# TaskNest 📝

TaskNest is a full-stack to-do list application built with **Next.js**, **MongoDB**, and **Tailwind CSS**.  
It allows users to create, edit, and delete tasks with a clean, responsive UI.  
Deployed seamlessly on **Vercel**.

---

## 🚀 Features
- Add new tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Fully responsive UI
- MongoDB database integration

## 🛠 Tech Stack
**Frontend:** Next.js, React, Tailwind CSS  
**Backend:** API Routes (Next.js), Node.js  
**Database:** MongoDB Atlas  
**Deployment:** Vercel

## ⚙️ Setup Instructions

### Clone the repository
```bash
git clone https://github.com/yourusername/tasknest.git
cd tasknest
```
## Install Dependencies

```
npm install
```

## Configure environment variables

### Create a .env.local file in the root directory and add:

```
MONGODB_URI=your_mongodb_connection_string
```
### For production (Vercel):

- Go to your project settings on Vercel
- Add the same variable under Environment Variables

## Run the development server

```
npm run dev
```
App will be running at http://localhost:3000

# Deployment
### Deployed on Vercel:

- Push your code to GitHub
- Import the repo into Vercel
- Add your MONGODB_URI in Vercel’s Environment Variables
- Vercel automatically builds and deploys your app
