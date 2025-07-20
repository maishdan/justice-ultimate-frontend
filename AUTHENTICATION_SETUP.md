# 🔐 Authentication Setup Guide - Justice Ultimate Automobiles

## ✅ **Configuration Complete!**

### **🎯 How It Works:**

The login and register functionality automatically detects your environment and uses the appropriate backend URL:

- **Development (localhost:5173)** → Uses `http://localhost:5001`
- **Production (deployed)** → Uses `https://backend-jua.onrender.com`

## 🔧 **Environment Detection:**

### **Development Environment:**
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5001`
- **Detection**: Checks for `localhost`, `127.0.0.1`, or port `5173`

### **Production Environment:**
- **Frontend**: Any deployed URL (Vercel, Netlify, etc.)
- **Backend**: `https://backend-jua.onrender.com`
- **Detection**: Any other hostname/port combination

## 📋 **Authentication Flow:**

### **1. Login Process:**
1. **User enters credentials** on login page
2. **reCAPTCHA verification** with backend
3. **Supabase authentication** (handles user management)
4. **Role determination** and dashboard routing
5. **Session management** with localStorage

### **2. Register Process:**
1. **User fills registration form**
2. **reCAPTCHA verification** with backend
3. **Password strength validation**
4. **Supabase user creation**
5. **Email confirmation** (if enabled)

## 🛠️ **Backend Requirements:**

### **Local Development:**
```bash
# Start your backend server on port 5001
cd "C:\Users\maish\Desktop\backend j\server"
node index.js
```

**Expected Output:**
```
Receipt email server running on http://localhost:5001
```

### **Production:**
- Backend is already deployed at `https://backend-jua.onrender.com`
- No additional setup required

## 🔍 **Debugging Features:**

### **Console Logging:**
The system automatically logs environment information:

```
🌍 Environment Information:
   Environment: development
   Backend URL: http://localhost:5001
   Description: Local development server
   Debug Logging: true
   reCAPTCHA Enabled: true
```

### **Health Checks:**
- **Backend connection test** on page load
- **reCAPTCHA endpoint test** on page load
- **Toast notifications** for connection status

## 🧪 **Testing:**

### **Development Testing:**
1. **Start backend**: `node index.js` (port 5001)
2. **Start frontend**: `npm run dev` (port 5173)
3. **Test login**: Go to `http://localhost:5173/login`
4. **Test register**: Go to `http://localhost:5173/register`
5. **Check console** for connection status

### **Production Testing:**
1. **Deploy frontend** to your hosting platform
2. **Test login**: Use your deployed URL
3. **Backend automatically** uses `https://backend-jua.onrender.com`

## 🔒 **Security Features:**

### **reCAPTCHA Integration:**
- **Site Key**: `6Lf2HYgrAAAAAGLA2Pdh_EgRNFLVNtFr8wChye0T`
- **Secret Key**: `6Lf2HYgrAAAAAHvpe272LhCc6SfwXK_ak39tLBZl`
- **Verification**: Backend validates with Google API

### **Password Requirements:**
- Minimum 8 characters
- Must include uppercase, lowercase, number, and special character
- Real-time strength validation

## 📁 **Configuration Files:**

### **`src/lib/config.ts`:**
- Environment-specific settings
- Backend URL management
- Feature flags
- reCAPTCHA configuration

### **`src/lib/api.ts`:**
- API endpoint definitions
- Connection testing functions
- Error handling

### **`src/lib/supabaseClient.ts`:**
- Supabase authentication client
- Session management
- User role handling

## 🚨 **Troubleshooting:**

### **Common Issues:**

1. **Backend Connection Failed:**
   - Check if backend server is running on port 5001
   - Verify firewall settings
   - Check console for detailed error messages

2. **reCAPTCHA Not Working:**
   - Verify reCAPTCHA keys are correct
   - Check if backend reCAPTCHA endpoint is accessible
   - Ensure domain is whitelisted in reCAPTCHA settings

3. **Environment Detection Issues:**
   - Check browser console for environment info
   - Verify hostname and port detection logic
   - Manually check `getCurrentEnvironment()` function

### **Debug Commands:**
```javascript
// Check current environment
console.log(getCurrentEnvironment());

// Check backend URL
console.log(getBackendUrl());

// Test backend connection
testBackendConnection().then(console.log);

// Test reCAPTCHA endpoint
testRecaptchaEndpoint().then(console.log);
```

## ✅ **Success Indicators:**

### **Development:**
- ✅ Backend connection successful
- ✅ reCAPTCHA endpoint accessible
- ✅ Login/Register forms work
- ✅ User authentication successful
- ✅ Role-based routing works

### **Production:**
- ✅ Automatic environment detection
- ✅ Production backend URL used
- ✅ All features work as expected
- ✅ No localhost dependencies

## 🎉 **Ready to Use!**

Your authentication system is now configured to work seamlessly in both development and production environments. The system will automatically detect your environment and use the appropriate backend URL for all authentication operations. 