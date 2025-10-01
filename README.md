# 🚀 Polia Portfolio

A modern, interactive 3D portfolio website built with Next.js, React Three Fiber, and Supabase. Features stunning 3D animations, project showcases, blog integration, and a comprehensive admin panel.

![Portfolio Preview](https://img.shields.io/badge/Next.js-13.5.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.58.0-green?style=for-the-badge&logo=supabase)

## ✨ Features

### 🎨 Interactive 3D Experience
- **Floating Tech Icons**: Animated 3D models of popular technologies (React, Python, Docker, GitHub, VS Code, ChatGPT)
- **Smooth Animations**: Powered by Framer Motion and React Three Fiber
- **Responsive Design**: Optimized for all device sizes
- **Performance Optimized**: Efficient 3D rendering with proper loading states

### 📱 Modern UI/UX
- **Dark/Light Theme**: Seamless theme switching with next-themes
- **Component Library**: Built with shadcn/ui components
- **Tailwind CSS**: Modern styling with custom animations
- **Accessibility**: WCAG compliant components

### 🛠️ Full-Stack Features
- **Project Showcase**: Dynamic project gallery with filtering
- **Blog System**: Content management with rich text support
- **Contact Form**: Email integration with Resend
- **CV Management**: Dynamic CV upload and download
- **Admin Panel**: Complete content management system

### 🔧 Technical Stack
- **Frontend**: Next.js 13, React 18, TypeScript
- **3D Graphics**: React Three Fiber, Three.js
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Database, Auth, Storage)
- **Email**: Resend API
- **Deployment**: Vercel Ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Resend account (for contact form)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanjula77/polia-portfolio.git
   cd polia-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   
   # Resend Configuration (for contact form)
   RESEND_API_KEY=your-resend-api-key-here
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/` folder
   - Enable Row Level Security (RLS) policies
   - Set up storage buckets for CV and project images

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
polia-portfolio/
├── app/                    # Next.js 13 app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── 3d/               # 3D components (Three.js)
│   ├── admin/            # Admin panel components
│   ├── layout/           # Layout components
│   ├── navigation/       # Navigation components
│   ├── providers/        # Context providers
│   ├── sections/         # Page sections
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── database.ts       # Supabase database operations
│   ├── resendService.ts  # Email service
│   ├── supabaseClient.ts # Supabase client configuration
│   ├── supabaseStorage.ts # Storage operations
│   └── utils.ts          # Utility functions
├── public/               # Static assets
│   └── models/           # 3D model files (.glb)
├── supabase/             # Database migrations
│   └── migrations/       # SQL migration files
└── ...config files
```

## 🎯 Key Components

### 3D Components
- **FloatingGeometry**: Main 3D scene with floating tech icons
- **GLBModel**: 3D model loader with animations
- **SceneWrapper**: 3D scene container with lighting

### Admin Panel
- **Blog Admin**: Manage blog posts and content
- **Projects Admin**: Upload and manage project showcases
- **Messages Admin**: View and manage contact form submissions
- **CV Admin**: Upload and manage CV files

### Sections
- **Hero Section**: Landing area with 3D background
- **About Section**: Personal information and timeline
- **Projects Section**: Project showcase with filtering
- **Blog Section**: Latest blog posts
- **Contact Section**: Contact form with email integration

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration

2. **Set Environment Variables**
   In Vercel dashboard, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   RESEND_API_KEY=your-resend-api-key
   ```

3. **Deploy**
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

### Other Deployment Options

- **Netlify**: Compatible with Next.js static export
- **Railway**: Full-stack deployment with database
- **DigitalOcean**: VPS deployment with Docker

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

### Adding New Features

1. **New 3D Models**: Add `.glb` files to `public/models/`
2. **New Sections**: Create components in `components/sections/`
3. **New UI Components**: Use shadcn/ui CLI or create in `components/ui/`
4. **Database Changes**: Add migrations in `supabase/migrations/`

## 🔧 Configuration

### Supabase Setup
1. Create tables using migration files
2. Set up RLS policies for security
3. Configure storage buckets
4. Enable email authentication (optional)

### Resend Setup
1. Create account at [resend.com](https://resend.com)
2. Generate API key
3. Add to environment variables
4. Configure email templates

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `RESEND_API_KEY` | Resend API key for emails | ✅ |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3D graphics
- [Supabase](https://supabase.com/) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations

## 📞 Support

If you have any questions or need help:

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/sanjula77/polia-portfolio/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/sanjula77/polia-portfolio/discussions)

---

⭐ **Star this repository if you found it helpful!**

Built with ❤️ by [Your Name]