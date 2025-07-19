# 🔒 reCAPTCHA Integration Test Guide

## ✅ **Current Configuration Status:**

### **Frontend Files (✅ Correctly Configured):**
1. **LoginPage.tsx**: 
   - ✅ Site key: `6Lf2HYgrAAAAAGLA2Pdh_EgRNFLVNtFr8wChye0T`
   - ✅ Backend URL: `http://localhost:5001/api/verify-recaptcha`

2. **RegisterPage.tsx**:
   - ✅ Site key: `6Lf2HYgrAAAAAGLA2Pdh_EgRNFLVNtFr8wChye0T`
   - ✅ Backend URL: `http://localhost:5001/api/verify-recaptcha`

### **Backend Files (✅ Correctly Configured):**
1. **index.js**:
   - ✅ CORS configured for `http://localhost:5173`
   - ✅ reCAPTCHA endpoint available

2. **recaptchaEndpoint.js**:
   - ✅ Secret key: `6Lf2HYgrAAAAAHvpe272LhCc6SfwXK_ak39tLBZl`
   - ✅ Google API integration working

## 🧪 **Step-by-Step Test Process:**

### **Step 1: Verify Backend is Running**
```bash
cd "C:\Users\maish\Desktop\backend j\server"
node index.js
```
**Expected Output:**
```
Receipt email server running on http://localhost:5001
```

### **Step 2: Test Backend Health**
```bash
curl http://localhost:5001/health
```
**Expected Output:**
```json
{"status":"ok","time":"2025-07-19T..."}
```

### **Step 3: Test reCAPTCHA Endpoint**
```bash
curl -X POST http://localhost:5001/api/verify-recaptcha \
  -H "Content-Type: application/json" \
  -d '{"g-recaptcha-response":"test"}'
```
**Expected Output:**
```json
{"success":false,"message":"reCAPTCHA verification failed","errors":["invalid-input-response"]}
```

### **Step 4: Start Frontend**
```bash
cd "C:\Users\maish\Desktop\frontend"
npm run dev
```

### **Step 5: Test Frontend Integration**
1. Go to `http://localhost:5173/login`
2. Complete the reCAPTCHA
3. Check browser console for any errors
4. Check backend console for verification logs

## 🔍 **Troubleshooting "Invalid key type" Error:**

### **Possible Causes:**
1. **Domain Mismatch**: reCAPTCHA keys not configured for `localhost`
2. **Key Type Mismatch**: Using v3 keys with v2 widget
3. **Wrong Keys**: Site key and secret key don't match

### **Solutions:**

#### **Option 1: Check Google reCAPTCHA Admin Console**
1. Go to [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
2. Find your reCAPTCHA configuration
3. Verify domains include:
   - `localhost`
   - `127.0.0.1`
   - Your actual domain (if deployed)

#### **Option 2: Create New reCAPTCHA Keys**
1. Go to [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
2. Click "Create" or "+" button
3. Choose **reCAPTCHA v2** (not v3)
4. Add domains: `localhost`, `127.0.0.1`
5. Get new site key and secret key
6. Update both frontend and backend

#### **Option 3: Test with Different Keys**
If you have other reCAPTCHA keys, try them to see if the issue is with the specific keys.

## 📋 **Debug Checklist:**

- [ ] Backend server running on port 5001
- [ ] Frontend server running on port 5173
- [ ] CORS properly configured
- [ ] reCAPTCHA widget loads without errors
- [ ] Backend receives reCAPTCHA tokens
- [ ] Google API responds correctly
- [ ] No console errors in browser
- [ ] No network errors in browser dev tools

## 🚀 **Expected Success Flow:**

1. **User visits login page** → reCAPTCHA widget loads
2. **User completes reCAPTCHA** → Token generated
3. **Frontend sends token to backend** → `http://localhost:5001/api/verify-recaptcha`
4. **Backend verifies with Google** → Success response
5. **Login proceeds** → User redirected to dashboard

## 🔧 **If Still Getting "Invalid key type":**

1. **Clear browser cache and cookies**
2. **Try incognito/private browsing mode**
3. **Check if reCAPTCHA loads in different browsers**
4. **Verify network connectivity to Google's servers**
5. **Check if any ad blockers are interfering**

## 📞 **Next Steps:**

If the issue persists after following this guide:
1. Check Google reCAPTCHA admin console for domain settings
2. Consider creating new reCAPTCHA keys
3. Test with a different domain configuration

The integration is technically correct - the issue is likely with the reCAPTCHA key configuration in Google's admin console. 