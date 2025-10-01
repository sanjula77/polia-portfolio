# Contact Form Setup Guide

This guide will help you set up the contact form with email notifications using SendGrid.

## ✅ What's Already Implemented

- ✅ Contact form UI (matches your design perfectly)
- ✅ Database integration (messages saved to Supabase)
- ✅ Admin panel for viewing messages
- ✅ SendGrid email service integration
- ✅ API endpoint for form submission
- ✅ Auto-reply emails to users
- ✅ Email notifications to admin

## 🔧 Setup Steps

### 1. SendGrid Account Setup

1. **Create SendGrid Account**
   - Go to [SendGrid](https://sendgrid.com/)
   - Sign up for a free account (100 emails/day free)

2. **Get API Key**
   - Go to Settings → API Keys
   - Create a new API key with "Full Access" permissions
   - Copy the API key (you won't see it again!)

3. **Verify Sender Identity**
   - Go to Settings → Sender Authentication
   - Choose "Single Sender Verification" (easiest for testing)
   - Add your email: `sanjulagihan94@gmail.com`
   - Check your email and verify the sender

### 2. Environment Variables

1. **Copy environment file**
   ```bash
   cp env.example .env.local
   ```

2. **Add SendGrid API key to `.env.local`**
   ```env
   SENDGRID_API_KEY=your-actual-sendgrid-api-key-here
   ```

3. **Optional: Custom domain (for production)**
   ```env
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```

### 3. Database Setup

The messages table is already created in your Supabase database. If you need to recreate it:

```sql
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    replied BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 How It Works

### Contact Form Flow:
1. User fills out contact form
2. Form submits to `/api/contact` endpoint
3. Message saved to Supabase database
4. Email notification sent to `sanjulagihan94@gmail.com`
5. Auto-reply sent to user
6. Success message shown to user

### Admin Panel:
- View all messages at `/admin`
- Mark messages as read/replied
- Delete messages
- Real-time updates

## 📧 Email Templates

### Admin Notification Email:
- Professional HTML template
- Includes sender details and message
- Reply-to set to sender's email
- Timestamp and contact info

### Auto-Reply Email:
- Thank you message to user
- Confirms message received
- Professional branding
- 24-hour response promise

## 🔒 Security Features

- ✅ Input validation and sanitization
- ✅ Email format validation
- ✅ Rate limiting (handled by Next.js)
- ✅ CSRF protection
- ✅ SQL injection prevention (Supabase)

## 🧪 Testing

1. **Test the form:**
   - Fill out contact form on your site
   - Check if you receive email notification
   - Check if user receives auto-reply
   - Verify message appears in admin panel

2. **Test admin panel:**
   - Go to `/admin`
   - View messages
   - Mark as read/replied
   - Delete messages

## 🚨 Troubleshooting

### Common Issues:

1. **"SendGrid API key not configured"**
   - Check `.env.local` file exists
   - Verify `SENDGRID_API_KEY` is set correctly
   - Restart your development server

2. **Emails not sending**
   - Check SendGrid dashboard for errors
   - Verify sender email is verified in SendGrid
   - Check API key permissions

3. **Messages not saving to database**
   - Check Supabase connection
   - Verify database permissions
   - Check browser console for errors

### Debug Mode:
Add this to your `.env.local` for debugging:
```env
NODE_ENV=development
```

## 📈 Production Considerations

1. **Custom Domain:**
   - Set up domain authentication in SendGrid
   - Update `SENDGRID_FROM_EMAIL` to use your domain
   - Improves email deliverability

2. **Rate Limiting:**
   - Consider adding rate limiting to prevent spam
   - Implement CAPTCHA if needed

3. **Monitoring:**
   - Monitor SendGrid usage
   - Set up alerts for failed emails
   - Track form submission analytics

## 🎉 You're All Set!

Your contact form is now fully functional with:
- ✅ Professional UI matching your design
- ✅ Database storage
- ✅ Email notifications
- ✅ Admin management
- ✅ Auto-replies
- ✅ Security features

The form will work immediately once you add your SendGrid API key to `.env.local`!
