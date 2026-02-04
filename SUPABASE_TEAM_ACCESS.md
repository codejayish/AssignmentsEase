# Supabase Team Member Access Guide

## Issue: Team Member Can't Access Tables

If you've added a member as "owner" but they still can't access tables, here are the steps to fix it:

## Step 1: Verify Team Member Role

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Check Team Settings**
   - Click on "Settings" (gear icon) in the left sidebar
   - Go to "Team" section
   - Verify the member is listed and has the correct role
   - **Owner** should have full access, but sometimes you need to explicitly grant permissions

## Step 2: Check Database Access

### Option A: Grant Direct Database Access

1. **Go to Database → Roles**
   - In the left sidebar, click "Database"
   - Then click "Roles"
   - You should see roles like `postgres`, `anon`, `authenticated`, etc.

2. **Grant Permissions to Tables**
   - Go to "SQL Editor"
   - Run these commands to grant access:

```sql
-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Grant future permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
```

## Step 3: Check Row Level Security (RLS) Policies

RLS policies might be blocking access even for owners. Check and update policies:

### For the `requests` table:

```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'requests';

-- If needed, create a policy that allows owners/admins to see all data
CREATE POLICY "Allow owners full access" 
ON requests 
FOR ALL 
TO postgres 
USING (true) 
WITH CHECK (true);
```

### For the `leads` table:

```sql
CREATE POLICY "Allow owners full access" 
ON leads 
FOR ALL 
TO postgres 
USING (true) 
WITH CHECK (true);
```

## Step 4: Verify Storage Access

For storage buckets, ensure the team member can access them:

1. **Go to Storage → Policies**
2. **Create policies for admin access:**

```sql
-- For assignments bucket
CREATE POLICY "Allow owners full storage access" 
ON storage.objects 
FOR ALL 
TO postgres 
USING (bucket_id = 'assignments') 
WITH CHECK (bucket_id = 'assignments');
```

## Step 5: Alternative - Use Service Role Key

If the team member needs programmatic access:

1. **Go to Settings → API**
2. **Copy the `service_role` key** (not the `anon` key)
3. **Share this key securely** - it bypasses RLS policies
4. **⚠️ WARNING**: Only share with trusted team members as this key has full database access

## Step 6: Check Project Access Level

1. **Go to Settings → General**
2. **Check "Project Access"**
3. Ensure the project allows team collaboration
4. Verify the member's email is correct and they've accepted the invitation

## Step 7: Database Connection String

The team member might need the direct database connection:

1. **Go to Settings → Database**
2. **Copy the connection string** under "Connection string"
3. Share this with the team member
4. They can use tools like:
   - Supabase Studio (web interface)
   - pgAdmin
   - DBeaver
   - TablePlus
   - Or any PostgreSQL client

## Step 8: Verify Member Can Access Supabase Studio

1. **Have the team member log in** to https://supabase.com/dashboard
2. **They should see your project** in their project list
3. **If they don't see it**, re-send the invitation:
   - Go to Settings → Team
   - Click "Invite member" or resend invitation
   - Make sure they accept the email invitation

## Common Issues and Solutions

### Issue 1: Member Can't See Tables in Table Editor
**Solution**: They might need to refresh the page or check if RLS is enabled. Try:
```sql
-- Temporarily disable RLS to test (not recommended for production)
ALTER TABLE requests DISABLE ROW LEVEL SECURITY;
```

### Issue 2: Member Gets Permission Denied Errors
**Solution**: Grant explicit permissions:
```sql
-- Grant all privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
```

### Issue 3: Member Can't Access SQL Editor
**Solution**: 
- Owner role should have access by default
- Check if they're using the correct account
- Verify project invitation was accepted

### Issue 4: Member Can't See Storage Files
**Solution**: Create storage policies:
```sql
-- Allow full access to storage
CREATE POLICY "Allow owners full access" 
ON storage.objects 
FOR ALL 
TO postgres 
USING (true) 
WITH CHECK (true);
```

## Quick Fix Script

Run this complete script in SQL Editor to grant full access:

```sql
-- Grant schema access
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;

-- Grant storage access
CREATE POLICY IF NOT EXISTS "Allow owners full storage access" 
ON storage.objects 
FOR ALL 
TO postgres 
USING (true) 
WITH CHECK (true);
```

## Verification Steps

After making changes, have the team member:

1. ✅ Log out and log back in to Supabase Dashboard
2. ✅ Check if they can see the project
3. ✅ Try accessing Table Editor
4. ✅ Try running a simple query in SQL Editor: `SELECT * FROM requests LIMIT 1;`
5. ✅ Check Storage section

## Still Having Issues?

1. **Check Supabase Status**: https://status.supabase.com
2. **Contact Support**: Use the help chat in Supabase Dashboard
3. **Verify Email**: Make sure the team member's email matches exactly
4. **Check Browser**: Try incognito/private mode or different browser
5. **Clear Cache**: Clear browser cache and cookies

## Security Note

⚠️ **Important**: Granting full access means the team member can:
- Read all data
- Modify all data
- Delete data
- Change schema

Only grant this level of access to trusted team members. For production, use more restrictive RLS policies.
