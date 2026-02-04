# Supabase Table Setup Instructions

## Fix the `requests` Table Schema

The error indicates that your `requests` table doesn't have all the required columns. Here's how to set it up:

### Option 1: Use Current Schema (Recommended)

The code has been updated to work with your existing table schema. The following columns are required:

- `email` (text)
- `description` (text)
- `deadline` (date)
- `invite` (text, nullable)
- `auto_match` (text)
- `file_url` (text, nullable)
- `created_at` (timestamp)
- `form` (text)

### Option 2: Add Additional Columns (Optional)

If you want to store `type` and `project_title` in the database, you can add these columns:

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run this SQL to add columns:**

```sql
-- Add type column
ALTER TABLE requests 
ADD COLUMN IF NOT EXISTS type TEXT;

-- Add project_title column
ALTER TABLE requests 
ADD COLUMN IF NOT EXISTS project_title TEXT;
```

4. **Update RLS Policies (if needed)**
   - Go to Authentication → Policies
   - Find the `requests` table
   - Ensure INSERT policy allows anonymous users:
   ```sql
   CREATE POLICY "Allow anonymous inserts" 
   ON requests 
   FOR INSERT 
   TO anon 
   WITH CHECK (true);
   ```

### Current Table Structure

Your `requests` table should have these columns:

| Column Name | Type | Nullable | Default |
|------------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| email | text | NO | |
| description | text | NO | |
| deadline | date | NO | |
| invite | text | YES | |
| auto_match | text | NO | |
| file_url | text | YES | |
| created_at | timestamp | NO | now() |
| form | text | NO | |

### Verify Table Structure

Run this query in SQL Editor to check your table structure:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'requests'
ORDER BY ordinal_position;
```

### Fix RLS Policies for `requests` Table

If you're getting permission errors, create this policy:

```sql
-- Allow anonymous users to insert into requests table
CREATE POLICY "Allow anonymous inserts on requests" 
ON requests 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow authenticated users to read their own requests
CREATE POLICY "Allow users to read own requests" 
ON requests 
FOR SELECT 
TO authenticated 
USING (auth.uid()::text = email);
```

Note: The second policy assumes you'll add user authentication later. For now, the first policy allows anonymous inserts.
