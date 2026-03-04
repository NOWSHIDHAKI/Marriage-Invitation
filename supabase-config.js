// ═══════════════════════════════════════════════════════════════════════════
// SUPABASE CONFIGURATION FOR WEDDING RSVP
// ═══════════════════════════════════════════════════════════════════════════

// Instructions to set up Supabase:
// 1. Go to https://supabase.com and sign up
// 2. Create a new project named "wedding-rsvp"
// 3. In the SQL editor, run the table creation script below
// 4. Copy your Project URL and Anon Key from Project Settings > API
// 5. Replace SUPABASE_URL and SUPABASE_KEY below

const SUPABASE_URL = 'https://bwfpowojoqmsjjlwtgwy.supabase.co'; // Replace with your Supabase URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3ZnBvd29qb3Ftc2pqbHd0Z3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzOTYzNTgsImV4cCI6MjA4Nzk3MjM1OH0.tqDABW7l7q21EaAkPm2qSiapj4LMeLlVwaBemCcMGwg'; // Replace with your Anon Key

// Import Supabase client
async function initSupabase() {
  // Load Supabase from CDN
  if (typeof supabase === 'undefined') {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/dist/umd/supabase.js';
      script.onload = () => {
        window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('✓ Supabase initialized from CDN');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load Supabase from CDN');
        resolve(); // Resolve anyway so async code can handle it
      };
      document.head.appendChild(script);
    });
  } else {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✓ Supabase initialized (supabase already loaded)');
    return Promise.resolve();
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSupabase);
} else {
  initSupabase();
}

// ═══════════════════════════════════════════════════════════════════════════
// SQL SETUP SCRIPT
// ═══════════════════════════════════════════════════════════════════════════
/*
Copy and paste the SQL below into your Supabase SQL Editor:

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
*/

// ═══════════════════════════════════════════════════════════════════════════
// SUBMIT RSVP TO SUPABASE
// ═══════════════════════════════════════════════════════════════════════════
async function submitRsvpToSupabase(rsvpData) {
  try {
    // Wait for Supabase client to be initialized
    let attempts = 0;
    while (!window.supabaseClient && attempts < 50) {
      await new Promise(r => setTimeout(r, 100));
      attempts++;
    }

    if (!window.supabaseClient) {
      throw new Error('Supabase client failed to initialize');
    }

    // Get user's IP address (fallback)
    let userIp = 'unknown';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json', { timeout: 3000 });
      const ipData = await ipResponse.json();
      userIp = ipData.ip;
    } catch (e) {
      console.log('Could not fetch IP address');
    }

    // Prepare data
    const dataToInsert = {
      guest_name: rsvpData.name,
      num_guests: rsvpData.guests,
      attending: rsvpData.attending === 'yes',
      message: rsvpData.message || null,
      ip_address: userIp,
      user_agent: navigator.userAgent
    };

    // Insert into Supabase
    const { data, error } = await window.supabaseClient
      .from('rsvp_responses')
      .insert([dataToInsert]);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('✓ RSVP submitted successfully:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FETCH RSVP STATISTICS
// ═══════════════════════════════════════════════════════════════════════════
async function getRsvpStats() {
  try {
    const { data, error } = await window.supabaseClient
      .from('rsvp_responses')
      .select('attending, num_guests');

    if (error) throw error;

    const stats = {
      total: data.length,
      attending: 0,
      declines: 0,
      total_guests: 0
    };

    data.forEach(response => {
      if (response.attending) {
        stats.attending++;
        stats.total_guests += response.num_guests;
      } else {
        stats.declines++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FETCH ALL RSVP RESPONSES (for admin dashboard)
// ═══════════════════════════════════════════════════════════════════════════
async function getAllRsvpResponses() {
  try {
    const { data, error } = await window.supabaseClient
      .from('rsvp_responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching responses:', error);
    return null;
  }
}
