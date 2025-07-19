-- Supabase RLS Setup for Justice Ultimate Automobiles
-- Run this in your Supabase SQL Editor to fix the 403 errors

-- 1. Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'customer',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    avatar_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    phone TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    date_of_birth TEXT,
    license_number TEXT,
    emergency_contact TEXT,
    kra_pin TEXT,
    id_document_url TEXT,
    passport_url TEXT,
    gender TEXT,
    gender_other TEXT,
    preferences JSONB DEFAULT '{}',
    communication_method TEXT DEFAULT 'SMS',
    theme TEXT DEFAULT 'Auto',
    notification_channels JSONB DEFAULT '{"sms": true, "email": true, "push": true}'
);

-- 3. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can do everything" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert own profile" ON profiles;

-- 4. Create more permissive policies for initial setup
-- Allow authenticated users to read their own profile
CREATE POLICY "Allow authenticated users to read own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Allow authenticated users to update own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile (for new users)
CREATE POLICY "Allow authenticated users to insert own profile" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "Allow admins to read all profiles" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Allow admins to update all profiles
CREATE POLICY "Allow admins to update all profiles" ON profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Allow admins to insert profiles
CREATE POLICY "Allow admins to insert profiles" ON profiles
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Allow service role to do everything (for API operations)
CREATE POLICY "Service role can do everything" ON profiles
    FOR ALL
    USING (auth.role() = 'service_role');

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_status_idx ON profiles(status);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- 6. Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

-- 7. Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, first_name, last_name, role, status, created_at, avatar_url, verified)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        'customer',
        'active',
        NEW.created_at,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        FALSE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Insert a default admin user if needed (replace with actual admin email)
-- INSERT INTO profiles (id, email, full_name, role, status, verified)
-- VALUES (
--     'your-admin-user-id-here',
--     'admin@justice.com',
--     'Admin User',
--     'admin',
--     'active',
--     TRUE
-- )
-- ON CONFLICT (id) DO NOTHING;

-- 10. Alternative: Create a more permissive policy for initial setup (temporary)
-- This allows any authenticated user to create a profile (remove after initial setup)
CREATE POLICY "Temporary allow profile creation" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- 11. Verify the setup
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles'; 