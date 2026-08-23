# SkillBase

SkillBase is a full-stack web application built to help users find local service freelancers based on skill. A user can search for services like TV repair, AC repair, fan repair, and similar work, book a freelancer, track booking status, and rate the work once the job is completed.

On the freelancer side, the app has a separate dashboard where freelancers can manage their profile, view incoming bookings, accept jobs, and see their rating based on completed work.

## What the project does

- User and freelancer login with role-based access
- Freelancer profile creation and update
- Search freelancers by skill
- Booking flow for users
- Freelancer booking management
- Job completion with star rating
- Search ranking influenced by user history and freelancer rating
- Availability status shown directly in search results

## Tech stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs
- cookie-parser

## Project structure

```text
skillBase/
├── backend/
│   ├── models/
│   ├── scripts/
│   ├── seeds/
│   ├── .env
│   └── index.js
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env
│   └── package.json
└── README.md
```

## Main features

### Authentication
There are two account types in the project:

- `user`
- `freelancer`

After login, users are redirected based on role:

- normal users go to the user dashboard
- freelancer accounts go to the freelancer dashboard

### User flow

- Search freelancers by skill
- See rating and availability on each freelancer card
- Book a freelancer
- View booking status in `My Bookings`
- Mark completed work as done
- Submit a rating out of 5

### Freelancer flow

- Create freelancer profile
- View bookings from users
- Accept pending bookings
- See completed jobs and received ratings
- View overall rating in the freelancer dashboard

### Booking flow

The booking flow currently works like this:

1. A user searches for a skill.
2. Matching freelancers are shown.
3. The user books one freelancer.
4. The freelancer accepts the booking.
5. Once the work is finished, the user marks it as done and gives a rating.

That rating is then used to calculate the freelancer's average rating in future searches and on the freelancer dashboard.

## Database collections

The project mainly uses 3 collections:

### `users`
- `username`
- `password`
- `role`

### `freelancers`
- `userId`
- `name`
- `email`
- `phone`
- `expertise`
- `age`
- `createdAt`
- `updatedAt`

### `bookings`
- `customerUserId`
- `customerUsername`
- `freelancerUserId`
- `freelancerName`
- `freelancerEmail`
- `freelancerPhone`
- `serviceType`
- `status`
- `rating`
- `createdAt`
- `updatedAt`

## Local setup

### Prerequisites

Make sure these are installed:

- Node.js
- MongoDB running locally
- npm

### Backend setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Backend environment file:

```env
PORT=8080
mongoUri=mongodb://localhost:27017/
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npx nodemon index.js
```

### Frontend setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Frontend environment file:

```env
NEXT_PUBLIC_BHOST=http://localhost:8080
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

## Seed data

This project includes seed data for freelancer accounts.

Files used:

- `backend/seeds/freelancerSeedData.js`
- `backend/seeds/freelancerCredentials.csv`
- `backend/scripts/seedFreelancers.js`

To insert the sample freelancer accounts:

```bash
cd backend
npm run seed:freelancers
```

## Notes

- The app uses JWT stored in cookies for authentication.
- Search results include freelancer rating and availability.
- User history affects freelancer ranking in future searches.
- If port `8080` is already in use, stop the old backend process before starting the server again.

## Future improvements

Some things that can still be improved:

- Better admin controls
- Better error messages on the frontend
- More filters in search like location and category
- Deployment configuration for production
- Real-time booking updates

## Author

Built as a full-stack practice project to learn authentication, role-based flows, booking management, MongoDB schema design, and frontend-backend integration.
