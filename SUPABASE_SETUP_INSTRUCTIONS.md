# Supabase Setup Instructions for Hayatul Islamic School Website

## 🚀 Quick Setup Guide

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Choose a project name: "Hayatul Islamic School"
5. Set a database password (save this!)
6. Select a region close to Tanzania (e.g., Singapore)

### Step 2: Get Your Project Credentials
1. Go to Project Settings → API
2. Copy your **Project URL** (looks like: `https://your-project-id.supabase.co`)
3. Copy your **anon public key** (starts with `eyJ...`)

### Step 3: Update Configuration
1. Open `supabase-config.js` file
2. Replace the placeholder values:
```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co'; // Your actual URL
const SUPABASE_ANON_KEY = 'eyJ...'; // Your actual anon key
```

### Step 4: Create Database Tables
1. In your Supabase dashboard, go to SQL Editor
2. Copy the entire content from `database-schema.sql` file
3. Paste it in the SQL Editor and click "Run"
4. This will create all necessary tables and policies

### Step 5: Test the Connection
1. Open your website in a browser
2. Try submitting an application form
3. Check the Supabase dashboard → Table Editor → applications
4. You should see the new application data

## 📊 Database Tables Created

### 1. **applications** - Student Applications
- Stores all student application data
- Status tracking (pending, approved, rejected)
- Automatic timestamps

### 2. **news** - News & Announcements
- Admin can add/edit news articles
- Featured image support
- Date-based sorting

### 3. **programs** - Academic Programs
- Primary, O-Level, A-Level programs
- Subjects and requirements
- Dynamic content management

### 4. **testimonials** - What People Say
- Student/parent testimonials
- Photo support
- Active/inactive status

### 5. **school_info** - Dynamic School Information
- About section content
- Vision, mission, history
- "Why Choose Us" points
- Student life activities

### 6. **statistics** - School Statistics
- Student numbers, staff count
- Academic performance data
- GPA trends over years

### 7. **leadership** - School Leadership
- Principal, teachers, staff
- Photos and qualifications
- Position ordering

### 8. **slider_images** - Homepage Slider
- Image management
- Display order control
- Active/inactive status

### 9. **admin_users** - Admin Login System
- Secure admin authentication
- Role-based access
- Password hashing

## 🔐 Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Public can only read appropriate data
- Admins have full access to manage content

### Data Policies
- Applications: Public can submit, admins can manage
- News/Programs/Testimonials: Public read, admin write
- School info: Public read, admin write
- Statistics: Public read, admin write

## 🔄 Real-time Features

### Live Updates
- Applications appear instantly in admin panel
- News updates reflect immediately on website
- Statistics update in real-time

### Offline Support
- Automatic fallback to localStorage if database is unavailable
- Data syncs when connection is restored

## 🎯 Admin Panel Features

### Applications Management
- ✅ View all applications in organized table
- ✅ Filter by status (All, Pending, Approved, Rejected)
- ✅ Detailed application preview with full student info
- ✅ One-click approve/reject with reason tracking
- ✅ Export to Excel/CSV for record keeping
- ✅ Real-time dashboard statistics

### Content Management
- ✅ Edit school vision, mission, history
- ✅ Manage "Why Choose Us" points
- ✅ Update academic programs and subjects
- ✅ Add/edit testimonials with photos
- ✅ Manage news and announcements
- ✅ Update school statistics and performance data

### Real-time Communication
- ✅ Website automatically reflects admin changes
- ✅ Applications appear instantly in admin panel
- ✅ Dashboard statistics update automatically

## 🌐 Website Features

### Dynamic Content Loading
- All content loads from Supabase database
- Automatic fallback to default content if database unavailable
- Real-time updates without page refresh

### Application System
- ✅ Comprehensive application form in Swahili
- ✅ PDF generation with school branding
- ✅ Automatic database storage
- ✅ Success confirmation with download option

## 📱 Mobile Responsive
- Admin panel works on all devices
- Website fully responsive
- Touch-friendly interface

## 🔧 Troubleshooting

### If Applications Don't Appear in Admin Panel:
1. Check browser console for errors
2. Verify Supabase credentials in `supabase-config.js`
3. Ensure database tables were created properly
4. Check network connection

### If Website Content Doesn't Load:
1. Check Supabase project status
2. Verify API keys are correct
3. Check browser console for errors
4. Content will fallback to default if database unavailable

### Database Connection Issues:
1. Verify project URL and API key
2. Check Supabase project is active
3. Ensure RLS policies are set correctly
4. Try refreshing the browser

## 🎉 Success Indicators

✅ **Setup Complete When:**
- Applications submitted on website appear in admin panel
- Admin can approve/reject applications
- Dashboard shows real-time statistics
- Content changes in admin reflect on website
- Export functionality works
- All forms submit successfully

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all setup steps were completed
3. Test with a simple application submission
4. Check Supabase dashboard for data

## 🔄 Next Steps

After successful setup:
1. Test all admin panel features
2. Submit test applications
3. Verify real-time updates work
4. Train admin users on the system
5. Set up regular database backups in Supabase

---

**🎯 Your website now has a complete admin system with real-time database integration!**
