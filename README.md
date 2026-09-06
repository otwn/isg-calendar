# ISG Calendar

A simple, free shift scheduling app for Ikeda Sun Group (ISG). Shifts run Monday, Wednesday, and Friday, 11am-2pm.

## Features

- 📅 **Calendar View** - See who's assigned to each day
- 👆 **Click to Assign** - Just click a date to assign or reassign
- ❌ **Cancel with Reason** - Track why shifts were cancelled
- 📜 **History Log** - Full audit trail of all changes
- 👥 **Contact List** - Team member info in one place
- 📆 **Google Calendar** - Read-only integration (optional)
- ⚡ **Real-time** - Changes sync instantly for all users
- 💰 **100% Free** - Netlify + Supabase free tiers

## Quick Start (15 minutes)

### Step 1: Set Up Supabase (Free Database)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project** → name it "isg-calendar"
3. Wait for it to initialize (~2 minutes)
4. Go to **SQL Editor** (left sidebar) and paste this schema:

```sql
-- Members table (your team contacts)
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL  -- soft delete timestamp
);

CREATE INDEX idx_members_deleted_at ON members(deleted_at);

-- View: only active (non-deleted) members
CREATE OR REPLACE VIEW active_members AS
  SELECT id, name, email, phone, color, created_at
  FROM members
  WHERE deleted_at IS NULL;

GRANT SELECT ON active_members TO anon, authenticated;

-- Shifts table (calendar assignments)
CREATE TABLE shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  shift_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- History table (audit log)
CREATE TABLE history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  member_name TEXT NOT NULL,
  shift_date DATE,  -- NULL for member_removed/member_restored actions
  action TEXT NOT NULL, -- 'assigned', 'cancelled', 'member_removed', 'member_restored'
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Allow all operations (no auth)
CREATE POLICY "Allow all" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON shifts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON history FOR ALL USING (true) WITH CHECK (true);

-- Sample members (optional)
INSERT INTO members (name, email, phone, color) VALUES
  ('Alice Johnson', 'alice@example.com', '555-0101', '#6366f1'),
  ('Bob Smith', 'bob@example.com', '555-0102', '#ec4899'),
  ('Carol Davis', 'carol@example.com', '555-0103', '#14b8a6');
```

5. Click **Run** to execute
6. Go to **Settings** → **API Keys** and copy:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **publishable key** (starts with `sb_publishable_...`)

### Step 2: Configure the App

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

### Step 3: Run Locally (Optional)

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Step 4: Deploy to Netlify (Free)

**Option A: One-Click Deploy**
1. Push this code to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Select your repo
4. Add environment variables in **Site settings** → **Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Click **Deploy**

**Option B: Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## Google Calendar Integration (Optional)

To show Google Calendar events:

1. Go to [Google Calendar](https://calendar.google.com)
2. Click the ⚙️ gear → **Settings**
3. Select your calendar on the left
4. Scroll to **Integrate calendar**
5. Find **Public URL to this calendar** or **Embed code**
6. Copy the URL
7. Edit `src/config.js` and set:
   ```javascript
   export const CONFIG = {
     googleCalendarUrl: 'https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID',
     // ...
   }
   ```

**Note**: Your Google Calendar must be set to **Public** for embedding to work.

## Customization

### Change Shift Days/Hours
Edit `src/config.js`:
```javascript
shiftRules: {
  shiftWeekdays: [1, 3, 5],   // 0=Sun … 6=Sat (currently Mon, Wed, Fri)
  shiftTimes: {
    1: '11am - 2pm',
    3: '11am - 2pm',
    5: '11am - 2pm',
  },
}
```

### Change Colors
Edit member colors in the Contacts page, or update the default colors in `src/pages/ContactsPage.jsx`.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Calendar**: FullCalendar
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Netlify

## Free Tier Limits

| Service | Free Limit |
|---------|------------|
| Netlify | 100GB bandwidth/month, 300 build min/month |
| Supabase | 500MB database, 2GB bandwidth, 50k users |

More than enough for a small team of 5-10 people!

## Troubleshooting

**Calendar doesn't load?**
- Check browser console for errors
- Verify Supabase URL and key in `.env`

**Real-time not working?**
- Supabase real-time is enabled by default
- Check Supabase dashboard → Database → Replication

**Google Calendar not showing?**
- Make sure your calendar is public
- Check the embed URL format

## License

MIT - Use it however you want!
