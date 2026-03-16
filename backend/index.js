const express = require("express")
const cors=require("cors")
require('dotenv').config()
const cookieParser=require('cookie-parser');
const app=express();
app.use(express.json())
app.use(cookieParser())
const port=process.env.PORT
const User=require('./models/user')
const Freelancer = require('./models/freelancer')
const Booking = require('./models/booking')
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs');
app.use(cors({origin: ["http://localhost:3000"],credentials: true}))
mongoose.connect(process.env.mongoUri)
  .then(() => console.log('Connected to MongoDB cluster'))
  .catch(err => console.error('Could not connect to MongoDB cluster', err));
const JWT_SECRET =process.env.JWT_SECRET;

app.get("/",(req,res)=>{
    res.send("SJobs API is running.....")
})

const buildToken = (user) => jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn:"2h" }
)

const isLoggedIn=(req,res,next)=>{
    const token=req.cookies?.token
    if(!token) return res.status(404).json({success:false,message:"Error. Token missing"})
    try{
        const dec=jwt.verify(token,JWT_SECRET)
        req.user=dec
        next()
    }
    catch(error){console.log(error);return res.status(500).json({success: false,message: "access denied"})}
}

const requireFreelancer=(req,res,next)=>{
    if(req.user?.role !== 'freelancer'){
        return res.status(403).json({success:false,message:"Only freelancer accounts can manage freelancer profiles"})
    }
    next()
}

const requireUser=(req,res,next)=>{
    if(req.user?.role !== 'user'){
        return res.status(403).json({success:false,message:"Only normal users can create bookings"})
    }
    next()
}

app.post('/register',async(req,res)=>{
    try{
    const {username,password,role='user'}=req.body
    if(!['user','freelancer'].includes(role)){
        return res.status(400).json({success:false,message:"Invalid role selected"})
    }
    let exuser=await User.findOne({username: username})
    if(exuser) return res.status(400).json({msg: `User ${username} already exists in the database. Please Login`})
    const hashedPass = await bcrypt.hash(password,10)
    exuser= new User({
        username: username,password:hashedPass,role
    })
    await exuser.save()
    const token = buildToken(exuser)
    res.cookie('token', token, {
            httpOnly: true,
            expires: false,
            maxAge: 48*60*60*1000
          });
    return res.status(200).json({
        success: true,
        message: `User ${username} was added successfully`,
        user: {
            username: exuser.username,
            role: exuser.role
        }
    })
    }
    catch(error){
        res.status(500).json({message:"Error Occured: ",err:error.stack})
    }
})
app.post('/login',async(req,res)=>{
    try{
    const {username,password}=req.body
    const user=await User.findOne({username: username})
    if(!user) return res.status(400).json({success:false,message: `User ${username} doesn't exist in the database. Please Register`})
    const cpass= await bcrypt.compare(password,user.password)
    if(!cpass) return res.status(500).json({success:false, message:"Invalid credentials"})
        const token = buildToken(user)
    res.cookie('token', token, {
            httpOnly: true,
            expires: false,
            maxAge: 48*60*60*1000
          });
    return res.status(200).json({
        success: true,
        message: `User ${username} has logged in`,
        user: {
            username: user.username,
            role: user.role
        }
    })
    }
    catch(error){
        return res.status(500).json({success:false, message:"Login failed"})
    }
})

app.get('/logout',(req,res)=>{
    res.clearCookie('token', { httpOnly: true, path: '/' });
    return res.status(200).json({msg: "Logged out successfully"})
})

app.get('/check_reg',isLoggedIn,(req,res)=>{
    return res.status(200).json({success:true,message: "Logged in",user:req.user})
})

app.post('/newFL',isLoggedIn,requireFreelancer,async(req,res)=>{
    try{
    const {name,email,phone,expertise,age}=req.body
    const expertiseList = expertise
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)

    let profile = await Freelancer.findOne({userId: req.user.id})
    if(profile){
        profile.name = name
        profile.email = email.toLowerCase()
        profile.phone = phone
        profile.age = age
        profile.expertise=[...new Set([...profile.expertise,...expertiseList])]
        await profile.save()
        return res.status(200).json({success: true,code: true,msg:'Freelancer profile updated successfully'})
    }
    profile = new Freelancer({
        userId: req.user.id,
        name: name,
        email: email.toLowerCase(),
        phone:phone,
        expertise: expertiseList,
        age: age
    })
    await profile.save()
    return res.status(200).json({success: true,message:'Freelancer added successfully'})
}
catch(error){
    console.log(error)
    return res.status(500).json({success:false,message:"Error Occured",error:error.toString()})
    }
})

const attachOptionalUser = (req,res,next)=>{
    const token = req.cookies?.token
    if(!token){
        return next()
    }

    try{
        req.user = jwt.verify(token,JWT_SECRET)
    }
    catch(error){
        req.user = null
    }

    next()
}

app.get('/freelancer/me',isLoggedIn,requireFreelancer,async(req,res)=>{
    try{
        const profile = await Freelancer.findOne({userId: req.user.id})
        return res.status(200).json({success:true, profile})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({success:false,message:"Unable to load freelancer profile"})
    }
})

app.get('/freelancer/bookings',isLoggedIn,requireFreelancer,async(req,res)=>{
    try{
        const bookings = await Booking.find({freelancerUserId: req.user.id}).sort({createdAt: -1})
        return res.status(200).json({success:true, bookings})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({success:false,message:"Unable to load bookings"})
    }
})

app.patch('/freelancer/bookings/:bookingId/accept',isLoggedIn,requireFreelancer,async(req,res)=>{
    try{
        const booking = await Booking.findOne({
            _id: req.params.bookingId,
            freelancerUserId: req.user.id,
        })

        if(!booking){
            return res.status(404).json({success:false,message:"Booking not found"})
        }

        booking.status = 'accepted'
        await booking.save()

        return res.status(200).json({success:true, booking})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({success:false,message:"Unable to accept booking"})
    }
})

app.get('/user/bookings',isLoggedIn,requireUser,async(req,res)=>{
    try{
        const bookings = await Booking.find({customerUserId: req.user.id}).sort({createdAt: -1})
        return res.status(200).json({success:true, bookings})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({success:false,message:"Unable to load your bookings"})
    }
})

app.patch('/user/bookings/:bookingId/complete',isLoggedIn,requireUser,async(req,res)=>{
    try{
        const { rating } = req.body

        if(!rating || rating < 1 || rating > 5){
            return res.status(400).json({success:false,message:"Rating must be between 1 and 5"})
        }

        const booking = await Booking.findOne({
            _id: req.params.bookingId,
            customerUserId: req.user.id,
        })

        if(!booking){
            return res.status(404).json({success:false,message:"Booking not found"})
        }

        if(booking.status !== 'accepted'){
            return res.status(400).json({success:false,message:"Only accepted bookings can be marked done"})
        }

        booking.status = 'completed'
        booking.rating = rating
        await booking.save()

        return res.status(200).json({success:true, booking})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({success:false,message:"Unable to complete booking"})
    }
})

app.post('/bookings',isLoggedIn,requireUser,async(req,res)=>{
    try{
        const {freelancerUserId, freelancerName, freelancerEmail, freelancerPhone, serviceType} = req.body

        if(!freelancerUserId || !freelancerName || !freelancerEmail || !freelancerPhone || !serviceType){
            return res.status(400).json({success:false,message:"Missing booking details"})
        }

        const hasActiveWork = await Booking.exists({
            freelancerUserId,
            status: 'accepted',
        })

        if(hasActiveWork){
            return res.status(400).json({
                success:false,
                message:"This freelancer is currently unavailable. Please choose another freelancer.",
            })
        }

        const booking = new Booking({
            customerUserId: req.user.id,
            customerUsername: req.user.username,
            freelancerUserId,
            freelancerName,
            freelancerEmail,
            freelancerPhone,
            serviceType,
        })

        await booking.save()

        return res.status(200).json({success:true, booking})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({success:false,message:"Unable to create booking"})
    }
})

app.get('/findFL',attachOptionalUser,async(req,res)=>{
    try{
        const skill=(req.query.skill || '').trim()
        if(!skill) return res.status(200).json({success: false,message: "Please include a skill"})

        const normalizedSkill = skill.toLowerCase()
        const unavailableFreelancerIds = await Booking.distinct('freelancerUserId', {
            status: 'accepted',
        })
        const unavailableFreelancerIdSet = new Set(
            unavailableFreelancerIds.map((id) => id.toString())
        )

        const freelancers = await Freelancer.find({
            expertise: normalizedSkill,
        }).lean()

        if(freelancers.length===0){
            return res.status(200).json({success: false,message: "No Worker Found"})
        }

        const freelancerUserIds = freelancers.map((freelancer) => freelancer.userId)
        const ratingStats = await Booking.aggregate([
            {
                $match: {
                    freelancerUserId: { $in: freelancerUserIds },
                    status: 'completed',
                    rating: { $ne: null },
                },
            },
            {
                $group: {
                    _id: '$freelancerUserId',
                    averageRating: { $avg: '$rating' },
                    ratingCount: { $sum: 1 },
                },
            },
        ])

        const ratingByFreelancer = new Map(
            ratingStats.map((item) => [
                item._id.toString(),
                {
                    averageRating: Number(item.averageRating.toFixed(1)),
                    ratingCount: item.ratingCount,
                },
            ])
        )

        const data = freelancers.map((freelancer) => {
            const rating = ratingByFreelancer.get(freelancer.userId.toString())

            return {
                ...freelancer,
                averageRating: rating?.averageRating ?? 4,
                ratingCount: rating?.ratingCount ?? 0,
                isAvailable: !unavailableFreelancerIdSet.has(freelancer.userId.toString()),
            }
        })

        let historyByFreelancer = new Map()
        if(req.user?.id && req.user?.role === 'user'){
            const userHistory = await Booking.aggregate([
                {
                    $match: {
                        customerUserId: new mongoose.Types.ObjectId(req.user.id),
                        freelancerUserId: { $in: freelancerUserIds },
                    },
                },
                {
                    $group: {
                        _id: '$freelancerUserId',
                        bookingCount: { $sum: 1 },
                        completedCount: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
                            },
                        },
                        latestBookingAt: { $max: '$createdAt' },
                    },
                },
            ])

            historyByFreelancer = new Map(
                userHistory.map((item) => [
                    item._id.toString(),
                    {
                        bookingCount: item.bookingCount,
                        completedCount: item.completedCount,
                        latestBookingAt: item.latestBookingAt,
                    },
                ])
            )
        }

        const rankedData = data
            .map((freelancer) => {
                const history = historyByFreelancer.get(freelancer.userId.toString())

                return {
                    ...freelancer,
                    previousBookings: history?.bookingCount ?? 0,
                    previousCompletedBookings: history?.completedCount ?? 0,
                    lastBookedAt: history?.latestBookingAt ?? null,
                }
            })
            .sort((a,b) => {
                if(b.previousCompletedBookings !== a.previousCompletedBookings){
                    return b.previousCompletedBookings - a.previousCompletedBookings
                }

                if(b.previousBookings !== a.previousBookings){
                    return b.previousBookings - a.previousBookings
                }

                if(a.lastBookedAt && b.lastBookedAt){
                    return new Date(b.lastBookedAt).getTime() - new Date(a.lastBookedAt).getTime()
                }

                if(a.lastBookedAt){
                    return -1
                }

                if(b.lastBookedAt){
                    return 1
                }

                if(b.averageRating !== a.averageRating){
                    return b.averageRating - a.averageRating
                }

                return a.name.localeCompare(b.name)
            })

        return res.status(200).json({success:true,data: rankedData})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({success:false,message:"Unable to search freelancers"})
    }
})

app.listen(port,()=>{
console.log(`Server running on port:${port}`)
})
