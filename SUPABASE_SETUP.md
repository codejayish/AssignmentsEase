# Supabase Storage Setup Instructions

## Fix Row Level Security (RLS) Policy for File Uploads

The error you're seeing is because the Supabase storage bucket has Row Level Security (RLS) enabled, which is blocking anonymous uploads.

### Steps to Fix:

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - Find the "assignments" bucket (or create it if it doesn't exist)

3. **Update RLS Policies**
   - Click on the "assignments" bucket
   - Go to the "Policies" tab
   - You need to create/update policies to allow uploads

4. **Create Policy for INSERT (Upload)**
   - Click "New Policy"
   - Choose "Create a policy from scratch" or "For full customization"
   - Policy name: `Allow anonymous uploads`
   - Allowed operation: `INSERT`
   - Target roles: `anon` (anonymous users)
   - Policy definition: Use this SQL:
   ```sql
   (bucket_id = 'assignments'::text)
   ```
   - Or use this simpler version:
   ```sql
   true
   ```

5. **Create Policy for SELECT (Read/Download)**
   - Click "New Policy" again
   - Policy name: `Allow public read access`
   - Allowed operation: `SELECT`
   - Target roles: `anon`
   - Policy definition:
   ```sql
   (bucket_id = 'assignments'::text)
   ```

### Alternative: Disable RLS (Not Recommended for Production)

If you want to disable RLS entirely (less secure):
- Go to Storage > assignments bucket
- Toggle off "RLS enabled" (not recommended for production)

### Verify the Fix

After updating the policies:
1. Try uploading a file again through your form
2. Check the browser console - the error should be gone
3. Check Supabase Storage - you should see the uploaded file

### Current Configuration

Your Supabase credentials are already configured in `assets/js/main.js`:
- URL: `https://hpjpoqpwowcvargwrwpn.supabase.co`
- Bucket name: `assignments`
- Storage path: `uploads/`
