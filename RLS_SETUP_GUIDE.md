# 🔧 RLS Setup Guide - Fix 403 Errors

## 🚨 **Current Issue**
You're getting 403 (Forbidden) errors because Supabase Row Level Security (RLS) policies are blocking access to the `profiles` table.

## ✅ **Solution Steps**

### **Step 1: Access Supabase Dashboard**
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your Justice Ultimate Automobiles project

### **Step 2: Open SQL Editor**
1. In the left sidebar, click on **"SQL Editor"**
2. Click **"New Query"**

### **Step 3: Run the RLS Setup Script**
1. Copy the entire contents of `supabase-rls-setup.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** to execute the script

### **Step 4: Verify Setup**
After running the script, you should see:
- ✅ RLS enabled on profiles table
- ✅ Policies created successfully
- ✅ Indexes created
- ✅ Trigger created for new users

### **Step 5: Test the Fix**
1. Go back to your application
2. Try logging in again
3. The 403 errors should be resolved

## 🔍 **What the Script Does**

### **1. Enables RLS**
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### **2. Creates Permissive Policies**
- Users can read/update their own profile
- Users can create their own profile
- Admins can manage all profiles
- Service role has full access

### **3. Creates Profiles Table**
If it doesn't exist, creates the complete profiles table with all necessary fields.

### **4. Sets Up Auto-Profile Creation**
Creates a trigger that automatically creates a profile when a new user signs up.

## 🛡️ **Security Features**

### **Row Level Security Policies**
- **User Access**: Users can only access their own profile
- **Admin Access**: Admins can access all profiles
- **Service Role**: Full access for API operations

### **Role Validation**
- Only valid roles: `admin`, `staff`, `mechanic`, `customer`
- No default roles assigned
- Explicit role selection required

## 🚀 **After Setup**

### **Expected Behavior**
1. **New Users**: Will be redirected to role selection page
2. **Existing Users**: Will access their assigned dashboard
3. **No More 403 Errors**: Profiles table access will work properly

### **Dashboard Access**
- **Admin**: `/secure-admin-dashboard`
- **Staff**: `/secure-staff-dashboard`
- **Mechanic**: `/secure-mechanic-dashboard`
- **Customer**: `/secure-customer-dashboard`

## 🔧 **Troubleshooting**

### **If you still get 403 errors:**
1. **Check RLS Status**: In Supabase Dashboard → Database → Tables → profiles → RLS should be enabled
2. **Verify Policies**: Check that policies are created in Database → Policies
3. **Test Connection**: Try a simple SELECT query in SQL Editor

### **If role selection doesn't work:**
1. **Check Auth Settings**: Ensure email confirmation is disabled for testing
2. **Verify Triggers**: Check that the `on_auth_user_created` trigger exists
3. **Test Profile Creation**: Try creating a profile manually in SQL Editor

## 📞 **Support**

If you continue to have issues:
1. Check the Supabase logs in the Dashboard
2. Verify your environment variables are correct
3. Ensure your Supabase project is active and not paused

## 🎯 **Success Indicators**

After running the script successfully, you should see:
- ✅ No more 403 errors in browser console
- ✅ Users can log in and select roles
- ✅ Each role redirects to correct dashboard
- ✅ Profile creation works without errors

---

**⚠️ Important**: Run this script in your Supabase SQL Editor, not in your application code! 