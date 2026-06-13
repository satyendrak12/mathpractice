# MathPractice 📐

A free MCQ practice platform for Class 11 & 12 Math students built with Next.js and Supabase.

## Live Demo
Coming soon...

## Tech Stack
- **Frontend** - Next.js 16, Tailwind CSS
- **Backend** - Supabase (Database + Auth)
- **Hosting** - Vercel

## Features
- ✅ Chapter-wise MCQ tests (Class 11 & 12)
- ✅ Google Login
- ✅ 30 second quiz timer
- ✅ Skip questions
- ✅ Instant results with explanations
- ✅ Student Dashboard with progress tracking
- ✅ Leaderboard

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/satyendrak12/mathpractice.git
cd mathpractice
```

### 2. Install dependencies
```bash
npm install
```
### 3. Create .env.local file
Create a `.env.local` file in the root folder:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```


### 4. Set up Supabase
- Create a new project on [supabase.com](https://supabase.com)
- Run the SQL from `supabase/schema.sql` in your Supabase SQL Editor
- Enable Google Auth in Supabase Authentication settings

### 5. Run the project
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing
Pull requests are welcome! For major changes, please open an issue first.

## License
MIT