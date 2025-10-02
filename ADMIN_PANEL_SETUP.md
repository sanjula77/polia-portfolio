# Admin Panel Setup Guide

This guide explains how to access and secure your admin panel after deployment.

## 🔐 Admin Panel Security

Your admin panel is now protected with password authentication and includes:

- **Password Protection**: Secure login form
- **Session Management**: 24-hour auto-logout for security
- **Local Storage**: Persistent login across browser sessions
- **Logout Functionality**: Manual logout option

## 🚀 Deployment Setup

### 1. Set Admin Password

**Option A: Environment Variable (Recommended)**
```bash
# In your deployment platform (Vercel, Netlify, etc.)
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password-here
```

**Option B: Update Default Password**
If you can't set environment variables, update the default password in:
```typescript
// hooks/use-admin-auth.ts
const ADMIN_PASSWORD = 'your-secure-password-here'; // Change this!
```

### 2. Access Admin Panel

After deployment, navigate to:
```
https://your-domain.com/admin
```

### 3. Login Credentials

- **Default Password**: `admin123` (change this immediately!)
- **Custom Password**: Whatever you set in environment variables

## 🛡️ Security Features

### Password Requirements
- Use a strong, unique password
- Minimum 8 characters recommended
- Include numbers and special characters

### Session Management
- **Duration**: 24 hours
- **Auto-logout**: Automatic after session expires
- **Manual logout**: Click logout button in dashboard
- **Storage**: Local browser storage (cleared on logout)

### Security Best Practices
1. **Change Default Password**: Never use `admin123` in production
2. **Use Environment Variables**: Keep passwords out of code
3. **Regular Updates**: Change password periodically
4. **Secure Connection**: Always use HTTPS in production
5. **Private Access**: Don't share admin credentials

## 📱 Admin Panel Features

Once logged in, you can manage:

- **Projects**: Add, edit, delete portfolio projects
- **Blog Posts**: Create and manage blog content
- **CV Management**: Upload and manage CV files
- **Messages**: View contact form submissions
- **Analytics**: View dashboard statistics

## 🔧 Environment Variables Setup

### Vercel Deployment
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add: `NEXT_PUBLIC_ADMIN_PASSWORD` = `your-secure-password`
4. Redeploy your application

### Netlify Deployment
1. Go to your Netlify site dashboard
2. Navigate to Site settings → Environment variables
3. Add: `NEXT_PUBLIC_ADMIN_PASSWORD` = `your-secure-password`
4. Redeploy your application

### Other Platforms
Add the environment variable according to your platform's documentation.

## 🚨 Important Security Notes

1. **Never commit passwords to Git**
2. **Use strong, unique passwords**
3. **Enable HTTPS in production**
4. **Regularly update passwords**
5. **Monitor admin access logs**

## 🔄 Password Reset

To change your admin password:

1. **With Environment Variables**: Update the environment variable and redeploy
2. **Without Environment Variables**: Update the password in `hooks/use-admin-auth.ts` and redeploy

## 📞 Troubleshooting

### Can't Access Admin Panel
- Check if password is correct
- Clear browser cache and cookies
- Verify environment variables are set
- Check browser console for errors

### Forgot Password
- Check your environment variables
- Look at your deployment platform settings
- Check the default password in code (if not using env vars)

### Session Issues
- Clear browser local storage
- Try incognito/private browsing mode
- Check if 24 hours have passed (auto-logout)

## 🎯 Quick Start Checklist

- [ ] Set secure admin password
- [ ] Deploy application
- [ ] Test admin login at `/admin`
- [ ] Verify all admin features work
- [ ] Set up regular password updates
- [ ] Document password securely

Your admin panel is now secure and ready for production use! 🎉
