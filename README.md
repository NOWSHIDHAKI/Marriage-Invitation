# 💒 Wedding Invitation with Supabase RSVP System

A beautiful, feature-rich wedding invitation website with real-time RSVP collection powered by Supabase.

## ✨ Features

### 🎫 **RSVP Form**
- Guest name collection
- Number of guests input
- Attendance confirmation (Yes/No)
- Optional message & blessings field
- Real-time validation and submission to database

### 📊 **Admin Dashboard** (admin-dashboard.html)
- Live statistics (total responses, attendee count, guest total)
- Filterable response table
- Color-coded attendance status
- Guest messages and timestamps
- One-click CSV export to spreadsheet

### 🔒 **Secure Backend**
- Supabase PostgreSQL database
- Row Level Security (RLS) policies
- Automatic timestamps
- IP address & device tracking

### 🎨 **Beautiful Design**
- Traditional South Indian wedding aesthetic
- Responsive design for all devices
- Animated elements and transitions
- Dark elegant color scheme

---

## 📁 Project Structure

```
Marriage-Invitation/
├── invitation.html              ⭐ Main wedding website (with RSVP form)
├── supabase-config.js           ⚙️ Configuration file (UPDATE WITH YOUR CREDENTIALS)
├── admin-dashboard.html         📊 RSVP Viewer & Guest List Manager
├── setup-guide.html             🎯 Visual setup guide
├── SUPABASE_SETUP_GUIDE.md      📖 Detailed setup instructions (READ THIS FIRST)
├── QUICKSTART.txt               ⚡ Quick reference guide
├── .env.local.example           🔐 Environment variables template
├── .gitignore                   🚫 Security - prevents committing secrets
└── README.md                    This file!
```

---

## 🚀 Quick Setup (5 Minutes)

### 1️⃣ Create Supabase Account
```
👉 Go to https://supabase.com
👉 Sign up for free
👉 Create new project "wedding-rsvp"
```

### 2️⃣ Set Up Database Table
```
👉 Go to SQL Editor in Supabase
👉 Copy SQL from SUPABASE_SETUP_GUIDE.md
👉 Run it (creates rsvp_responses table)
```

### 3️⃣ Get Your Credentials
```
👉 Settings → API → Copy:
   - Project URL (https://xxxxx.supabase.co)
   - Anon Key (eyJ......)
```

### 4️⃣ Update Configuration
Edit `supabase-config.js`:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key-here';
```

### 5️⃣ Test It
```
👉 Open invitation.html
👉 Fill out RSVP form
👉 Click "Send RSVP"
👉 See success message!
```

### 6️⃣ View Responses
```
👉 Open admin-dashboard.html
👉 See all RSVPs, statistics, and export options
```

---

## 📖 Detailed Documentation

### For Complete Setup Instructions:
→ **[SUPABASE_SETUP_GUIDE.md](SUPABASE_SETUP_GUIDE.md)** ← Start here!

Key sections:
- Step-by-step Supabase account creation
- SQL database setup with security policies
- Getting API credentials
- Testing and troubleshooting
- Deployment options

### For Quick Reference:
→ **[QUICKSTART.txt](QUICKSTART.txt)**

- 5-minute setup overview
- File descriptions
- Security tips
- Troubleshooting checklist

### For Visual Setup Guide:
→ **[setup-guide.html](setup-guide.html)**

Open in any browser to see interactive setup instructions

---

## 🔐 Security Considerations

### What's Included ✅
- Row Level Security (RLS) on database
- Public key authentication (Anon Key)
- Automatic timestamp tracking
- Input validation & HTML escaping
- .gitignore to prevent committing secrets

### Best Practices 📋
1. **Update** `supabase-config.js` with YOUR credentials ⭐
2. **Never** commit this file with real credentials to GitHub
3. **Keep** your Anon Key private (but it's public-safe)
4. **Regenerate** keys if accidentally exposed
5. **Use** `.env.local` for production deployments

### File Safety
```
❌ DO NOT commit these files with real values:
   - supabase-config.js (with actual credentials)
   - .env.local (environment variables)

✅ These are safe in version control:
   - .env.local.example (template only)
   - Everything else in the project
```

---

## 💾 Database Schema

### rsvp_responses Table
```sql
id              BIGINT PRIMARY KEY         -- Unique response ID
guest_name      VARCHAR(255) NOT NULL     -- Guest's full name
num_guests      INT DEFAULT 1             -- Number of guests
attending       BOOLEAN NOT NULL          -- Yes/No confirmation
message         TEXT                      -- Optional message
created_at      TIMESTAMP                 -- When submitted
updated_at      TIMESTAMP                 -- Last updated
ip_address      VARCHAR(45)               -- Guest's IP (tracking)
user_agent      TEXT                      -- Browser/device info
```

### Automated Features
- **Timestamps**: Auto-populated on insert/update
- **Indexing**: Fast queries on created_at
- **Security**: RLS policies for public access
- **Validation**: NOT NULL constraints

---

## 🎯 Features Details

### RSVP Form (invitation.html)
```html
<!-- Located in #rsvp section ~line 1540 -->
<input id="rName">           <!-- Guest name -->
<input id="rGuests">         <!-- Number of guests -->
<button class="attend-btn">  <!-- Yes/No buttons -->
<input id="rMsg">            <!-- Message -->
<button class="submit-btn">  <!-- Send RSVP -->
```

### Admin Dashboard (admin-dashboard.html)
- Real-time RSVP statistics
- Sortable response table
- Filter by attendance status
- Export to CSV
- Auto-refresh every 30 seconds

### Key Functions
```javascript
// Submit RSVP to Supabase
await submitRsvpToSupabase({
  name: "Guest Name",
  guests: 2,
  attending: "yes",
  message: "Excited to celebrate!"
})

// Get all responses
const responses = await getAllRsvpResponses();

// Get statistics
const stats = await getRsvpStats();
```

---

## 📱 Deployment

### Option 1: GitHub Pages (FREE)
```bash
# Upload to GitHub
git push origin main

# Enable Pages in repo settings
Settings → Pages → Source: main branch
```
Your site: `https://yourusername.github.io/repository-name`

### Option 2: Netlify (FREE)
```bash
# Drag & drop folder to Netlify
https://netlify.com/drop
```
Instant hosting with custom domain option

### Option 3: Vercel (FREE)
```bash
# Import GitHub repo
https://vercel.com/import
```
Auto-deploy on every push

### Option 4: Traditional Hosting
```bash
# FTP/upload files to your web host
# Works with any standard web hosting
```

---

## 🐛 Troubleshooting

### "Supabase client failed to initialize"
- Check `supabase-config.js` is in same folder as `invitation.html`
- Verify URL and Key are correct
- Check browser console (F12 → Console)

### RSVP form doesn't submit
- Open DevTools (F12) → Network tab
- Look for failed requests
- Check RSVP data in Supabase dashboard

### Admin dashboard won't load data
- Verify credentials in `supabase-config.js`
- Check `rsvp_responses` table exists in Supabase
- Verify RLS policies allow SELECT access

### Data not in Supabase
- Open Supabase → Table Editor → rsvp_responses
- Check if table is empty
- Verify Row Level Security policies

For more troubleshooting → **[SUPABASE_SETUP_GUIDE.md](SUPABASE_SETUP_GUIDE.md#troubleshooting)**

---

## 🎨 Customization

### Adding More RSVP Fields

1. **Add HTML input** in `invitation.html` (~line 1550):
```html
<label class="f-label">Diet Preference</label>
<input class="f-input" type="text" id="rDiet" placeholder="Any restrictions?">
```

2. **Update doRsvp() function** (~line 2000):
```javascript
const rsvpData = {
  // ... existing fields ...
  diet: document.getElementById('rDiet').value.trim()
};
```

3. **Add database column**:
```sql
ALTER TABLE rsvp_responses ADD COLUMN diet VARCHAR(255);
```

4. **Update admin dashboard** to display the field

### Styling
- Main colors in CSS (lines 15-32 in invitation.html)
- Google Fonts integrated
- Dark elegant theme with gold accents
- Responsive breakpoints at 640px

---

## 📊 Tracking & Analytics

### Automatic Data Collection
- Guest name & count
- Attendance status
- Message/blessings
- Submission timestamp
- IP address (for analytics)
- User agent (browser/device)

### Using the Data
```javascript
// View in Supabase dashboard
// Export as CSV from admin-dashboard.html
// Use for spreadsheet tracking
// Create seating arrangements
```

---

## 📧 Sharing with Guests

### RSVP Link
```
📎 Share this URL with guests:
   - Local: Open invitation.html
   - Online: https://your-wedding-site.com/invitation.html
```

### Admin Link (Keep Private)
```
🔒 Keep this for you & wedding team:
   - Local: Open admin-dashboard.html
   - Online: https://your-wedding-site.com/admin-dashboard.html (password protect!)
```

---

## 💡 Pro Tips

✅ **Backup Your Data**
```javascript
// Periodically download as CSV from admin dashboard
// Or export from Supabase SQL Editor
```

✅ **Set RSVP Deadline**
```
// Add countdown to RSVP date
// Send reminders 1 week before
```

✅ **Create Seating Chart**
```
// Use exported CSV in Excel
// Group by family/friend groups
// Create table assignments
```

✅ **Monitor in Real-Time**
```
// Keep admin dashboard open during events
// Refresh every 30 seconds auto-updates
```

---

## 🆘 Support

### Documentation
- [Supabase Official Docs](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [SUPABASE_SETUP_GUIDE.md](SUPABASE_SETUP_GUIDE.md)

### Common Issues
See **[SUPABASE_SETUP_GUIDE.md#troubleshooting](SUPABASE_SETUP_GUIDE.md#troubleshooting)**

### Getting Help
1. Check the .md files in this project
2. Open browser console (F12) for error messages
3. Verify Supabase configuration
4. Check Supabase dashboard for data

---

## 📝 Files Reference

| File | Purpose | Edit? |
|------|---------|-------|
| `invitation.html` | Main wedding site | ✏️ Yes (form styling) |
| `supabase-config.js` | **DATABASE CONFIG** | ✏️ **MUST EDIT** |
| `admin-dashboard.html` | Guest list viewer | 📖 No (just view) |
| `setup-guide.html` | Visual setup guide | 📖 No (reference) |
| `SUPABASE_SETUP_GUIDE.md` | Detailed guide | 📖 No (reference) |
| `QUICKSTART.txt` | Quick reference | 📖 No (reference) |
| `.env.local.example` | Config template | ✏️ Optional |
| `.gitignore` | Git security | ✏️ No |
| `README.md` | This file | 📖 No |

---

## 🎉 Next Steps

1. ✅ **Read** QUICKSTART.txt (5 min overview)
2. ✅ **Follow** SUPABASE_SETUP_GUIDE.md (detailed setup)
3. ✅ **Update** supabase-config.js (your credentials)
4. ✅ **Test** invitation.html (local testing)
5. ✅ **View** admin-dashboard.html (see responses)
6. ✅ **Deploy** to web (GitHub Pages, Netlify, etc.)
7. ✅ **Share** invitation.html link with guests
8. ✅ **Monitor** responses in admin dashboard

---

## 🏆 Credits

**Wedding Invitation Website** with Supabase Integration
- Beautiful South Indian wedding aesthetic
- Responsive design for all devices
- Real-time RSVP collection
- Secure database backend
- Zero-cost hosting options available

**Made with ❤️ for Chandhu & Santhi's Wedding**
📅 April 2, 2026 • 8:45 PM • Muhurtham

---

## 📄 License

This project is free to use and modify for your wedding or any personal/family event.

---

**Questions?** → Check SUPABASE_SETUP_GUIDE.md
**Quick Start?** → Check QUICKSTART.txt
**Visual Guide?** → Open setup-guide.html

🎊 Happy Wedding! 🎊
