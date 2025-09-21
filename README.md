# career-advisor-fixed-updated
Career Advisor is a Next.js 14 app that guides students with AI—career recommendations, learning roadmaps, and resume/interview tools. Built with TypeScript, Tailwind, Radix UI, and Supabase (auth/data). Live: https://career-advisor-fixed-updated-jqpl5sjvv.vercel.app
# TechManthan 🚀
TechManthan is a Next.js project aimed at providing career advisory tools and resources.

# Project: Personalized Career And Skills Advisor
> AI-powered career and skills advisor for students & professionals — Hackathon project.

## 🔍 Overview
Career & Skills Advisor helps users discover career paths, identify skill gaps and get tailored course/job suggestions via a conversational AI (Gemini) chatbot.

## 🚀 Demo
- Live: https://career-advisor-fixed-updated.vercel.app/
- Demo screenshots:  https://docs.google.com/document/d/15FTSYWE5FsouNu7R2_47PduleBUgXZ1S7AGqtWgJyZ8/edit?usp=sharing

## 📂 Features
- Conversational Gemini chatbot for personalised guidance
- User signup/login flow
- Skill gap analysis & course recommendations
- Interactive frontend built with Next.js
- Modern UI components
- Easy deployment and scalability
- Resume feature for professional resume and portfolio building

## 🛠 Tech Stack
- Frontend: Next.js, React, Typescript, Tailwind CSS
- Backend: Node.js / Express
- DB: MongoDB / Firebase, Supabase
- Deployment: Vercel 


## ⚡ Getting Started

1. Clone this repo:
   ```bash
   git clone https://github.com/Vatsalya18/Techmanthan.git
   cd Techmanthan
   npm install
   npm run dev
   ```

2. Install dependencies:
   npn install

3. Copy env file:
   cp .env.example.env

4. Run the development server:
   npm run dev

## Environment Variables (.env.example)

# Supabase
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmb2ZoZ25pZGhmYW9lY3dxdWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyODczMjcsImV4cCI6MjA3Mzg2MzMyN30.L8EImRrnxEBx9F8yhzIfq45Jet5YhXDeGyPmgccK25s

# Google / Gemini AI
   GOOGLE_AI_API_KEY= AIzaSyAt_KkBWSW_kkNuqoGrjBzkra0LZyN2OxI 

# Google OAuth
GOOGLE_CLIENT_ID=616761921672-tsepuk6jkocf792urkoh2paso5i9ne89.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token

# Google Service Account
GOOGLE_PROJECT_ID=intrepid-alloy-472414-q8
GOOGLE_CLIENT_EMAIL=careerpathai@intrepid-alloy-472414-q8.iam.gserviceaccount.com


## How to Run Tests / Build / Deploy
   bash
   # Run tests
    npm test

   # Build the project for production
    npm run build

   # Start the production server
    npm start

🤝 Contributing
1. Fork this repo  
2. Create a branch (`git checkout -b feature-name`)  
3. Commit changes (`git commit -m "Added feature"`)  
4. Push branch (`git push origin feature-name`)  
5. Open a Pull Request 🎉

---

## Folder Structure
- /app or /pages   # Next.js routes
- /components      # UI components
- /public          # images & static assets
- /styles          # CSS / Tailwind config
- /docs            # slides and screenshots


## 📜 License
This project is licensed under the MIT.
