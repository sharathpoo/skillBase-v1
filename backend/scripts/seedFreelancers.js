require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Freelancer = require("../models/freelancer");
const freelancerSeedData = require("../seeds/freelancerSeedData");

async function seedFreelancers() {
  await mongoose.connect(process.env.mongoUri);

  for (const entry of freelancerSeedData) {
    const hashedPassword = await bcrypt.hash(entry.plainPassword, 10);

    let user = await User.findOne({ username: entry.username });

    if (!user) {
      user = await User.create({
        username: entry.username,
        password: hashedPassword,
        role: "freelancer",
      });
    } else {
      user.password = hashedPassword;
      user.role = "freelancer";
      await user.save();
    }

    const freelancerPayload = {
      userId: user._id,
      name: entry.name,
      email: entry.email.toLowerCase(),
      phone: entry.phone,
      age: entry.age,
      expertise: entry.expertise.map((skill) => skill.toLowerCase()),
    };

    await Freelancer.findOneAndUpdate(
      { userId: user._id },
      freelancerPayload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded ${freelancerSeedData.length} freelancer accounts.`);
  await mongoose.disconnect();
}

seedFreelancers().catch(async (error) => {
  console.error("Failed to seed freelancers:", error);
  await mongoose.disconnect();
  process.exit(1);
});
