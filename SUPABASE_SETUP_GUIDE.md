# 💒 Wedding Invitation - Supabase RSVP Integration Guide

## Overview
This guide will help you set up Supabase to store RSVP responses from your wedding invitation website.

## Step 1: Create a Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Sign up"** (or log in if you have an account)
3. Sign up using:
   - Email & password, or
   - GitHub, Google, or other OAuth providers
4. Create a new organization (if prompted)

## Step 2: Create a New Project

1. Click **"+ New project"** or go to your organization dashboard
2. Fill in the project details:
   - **Name**: `wedding-rsvp` (or any name you prefer)
   - **Database Password**: Create a strong password (you'll need this)
   - **Region**: Choose the closest region to your location
   - **Pricing Plan**: Select "Free" for starting out
3. Click **"Create new project"** and wait for it to initialize (2-3 minutes)

## Step 3: Create the RSVP Table

Once your project is ready:

1. In the left sidebar, click **"SQL Editor"**
2. Click **"New query"**
3. Copy and paste the following SQL script:

```sql
-- Create RSVP table
CREATE TABLE IF NOT EXISTS rsvp_responses (
  id BIGSERIAL PRIMARY KEY,
  guest_name VARCHAR(255) NOT NULL,
  num_guests INT NOT NULL DEFAULT 1,
  attending BOOLEAN NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Create an index for faster queries
CREATE INDEX idx_rsvp_created_at ON rsvp_responses(created_at);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (no authentication needed for guests)
CREATE POLICY "Allow public inserts" ON rsvp_responses
  FOR INSERT WITH CHECK (true);

-- Allow anyone to select
CREATE POLICY "Allow public select" ON rsvp_responses
  FOR SELECT USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for updated_at
CREATE TRIGGER update_rsvp_updated_at BEFORE UPDATE ON rsvp_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

4. Click **"Run"** to execute the query
5. You should see a success message at the bottom

## Step 4: Get Your Supabase Credentials

1. In the left sidebar, click **"Settings"** → **"API"**
2. Under **Project API Keys**, you'll see:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **Anon Key** (a long string starting with `eyJ...`)
3. Copy both values - you'll need them in the next step

**⚠️ Important**: 
- Keep your **Anon Key** private (never commit to public repositories)
- The Anon Key is meant for public/client-side use with Row Level Security
- Never share your database password publicly

## Step 5: Update Your Project Configuration

1. Open `supabase-config.js` in the Marriage-Invitation folder
2. Find these lines at the top:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co'; // Replace with your Supabase URL
const SUPABASE_KEY = 'your-anon-key-here'; // Replace with your Anon Key
```

3. Replace the placeholder values with your actual credentials:

```javascript
const SUPABASE_URL = 'https://xxxxxxx.supabase.co'; // Your actual URL
const SUPABASE_KEY = 'eyJxxxxx...'; // Your actual Anon Key
```

4. Save the file

## Step 6: Test the Integration

1. Open `invitation.html` in a browser
2. Scroll to the RSVP section
3. Fill in the form:
   - **Name**: Test Name
   - **Guests**: 2
   - **Attendance**: Select your preference
   - **Message**: (optional) Add a message
4. Click **"🪔 Send RSVP 🪔"**
5. You should see a success message: "Namaskaram!"

## Step 7: View Your RSVP Data

### Option A: Supabase Dashboard
1. In Supabase, click **"Table Editor"** in the left sidebar
2. Click **"rsvp_responses"** table
3. You'll see your test RSVP response listed!

### Option B: Admin Dashboard
1. Open `admin-dashboard.html` in a browser
2. You'll see:
   - Statistics (Total responses, attending count, etc.)
   - A table with all RSVP details
   - Filters to view attending/declined responses
   - Export to CSV button

## File Structure

```
Marriage-Invitation/
├── invitation.html          # Main wedding invitation (updated)
├── supabase-config.js       # Supabase configuration
├── admin-dashboard.html     # Admin panel to view RSVPs
├── style.css               # (if using separate file)
└── index.js                # (if using separate file)
```

## Features Included

✅ **RSVP Form Submission**
- Guest name input
- Number of guests
- Attendance confirmation (Yes/No)
- Optional message/blessings
- Real-time submission to Supabase

✅ **Admin Dashboard** (admin-dashboard.html)
- Real-time statistics (total responses, attendees, guests)
- Searchable/filterable responses table
- Guest names, attendance status, messages
- Timestamp of each response
- CSV export functionality

✅ **Security Features**
- Row Level Security (RLS) enabled
- Public read/write access (guests can submit)
- IP address & user agent logging (optional tracking)
- Timestamp auto-update functionality

## Deployment Considerations

### For Production (Live Wedding Site):

1. **Environment Security**:
   - Store credentials in environment variables (if using a backend)
   - Use Supabase RLS policies to restrict data access
   - Consider adding a password-protected admin dashboard

2. **Rate Limiting**:
   - Add logic to prevent duplicate submissions from same IP
   - Implement CAPTCHA if you expect spam

3. **Backup**:
   - Supabase automatically backs up your data
   - Periodic manual exports via CSV are recommended

4. **Custom Domain** (optional):
   - Supabase allows domain customization
   - Your URL will be: `https://xxxxxxx.supabase.co`

## Troubleshooting

### "Supabase client failed to initialize"
- Check that `supabase-config.js` is in the same folder as `invitation.html`
- Verify your SUPABASE_URL and SUPABASE_KEY are correct
- Check browser console for specific error messages

### RSVP form submits but doesn't show success
- Open browser DevTools (F12) → Console
- Look for error messages
- Check that Row Level Security policies allow INSERT

### Admin dashboard shows "Could not load RSVP data"
- Verify Supabase credentials in `supabase-config.js`
- Check that the `rsvp_responses` table exists
- Try refreshing the page

### Data not appearing in Supabase
- Open Supabase dashboard → Table Editor → rsvp_responses
- Check if the table is empty
- Verify RLS policies are correctly set to allow inserts

## Modifying the RSVP Form

To customize the RSVP form, edit the HTML in `invitation.html`:

### Add more fields:
```html
<label class="f-label">Dietary Preferences</label>
<input class="f-input" type="text" id="rDiet" placeholder="Any allergies or preferences?">
```

### Update the submission code in `doRsvp()` function:
```javascript
const rsvpData = {
  name: nameInput.value.trim(),
  guests: parseInt(guestsInput.value) || 1,
  attending: selAttend,
  message: msgInput.value.trim(),
  diet: document.getElementById('rDiet').value.trim()  // Add this
};
```

### Update the database table:
```sql
ALTER TABLE rsvp_responses ADD COLUMN diet VARCHAR(255);
```

## API Reference

### Available Functions in supabase-config.js:

**Submit RSVP**
```javascript
await submitRsvpToSupabase({
  name: "Guest Name",
  guests: 2,
  attending: "yes",
  message: "Excited to celebrate!"
});
```

**Get Statistics**
```javascript
const stats = await getRsvpStats();
console.log(stats); // { total: 50, attending: 45, declines: 5, total_guests: 95 }
```

**Get All Responses**
```javascript
const responses = await getAllRsvpResponses();
responses.forEach(r => console.log(r.guest_name, r.attending));
```

## Next Steps

1. ✅ Create Supabase account and project
2. ✅ Run the SQL setup script
3. ✅ Update supabase-config.js with credentials
4. ✅ Test with invitation.html
5. ✅ Share admin-dashboard.html link with wedding coordinator
6. 📤 Deploy to web hosting (Vercel, Netlify, GitHub Pages, etc.)
7. 📧 Share invitation.html link with guests

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Issues**: Check console errors (F12 → Console tab)

---

**Happy Wedding! 🎉💒✨**

*Last Updated: March 2026*
