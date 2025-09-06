# Google OAuth Setup Instructions

## 🚀 Quick Setup Guide

### 1. **Google Cloud Console Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API:
   - Go to \"APIs & Services\" > \"Library\"
   - Search for \"Google+ API\" and enable it
4. Create OAuth 2.0 credentials:
   - Go to \"APIs & Services\" > \"Credentials\"
   - Click \"Create Credentials\" > \"OAuth 2.0 Client IDs\"
   - Choose \"Web application\"
   - Add authorized redirect URIs:
     ```
     http://localhost:4001/api/auth/google/callback
     ```
   - Copy the Client ID and Client Secret

### 2. **Environment Configuration**

Update your `server/.env` file with your Google OAuth credentials:

```env
# Replace these with your actual Google OAuth credentials
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here

# Generate a strong JWT secret (you can use: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\")
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure

# Generate a strong session secret
SESSION_SECRET=your_session_secret_key_here
```

### 3. **Test the Integration**

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd SIH2025
   npm run dev
   ```

3. Navigate to the login page and click \"Continue with Google\"

### 4. **How It Works**

1. **User clicks \"Continue with Google\"** → Redirects to `/api/auth/google`
2. **Google OAuth flow** → User authenticates with Google
3. **Callback handling** → `/api/auth/google/callback` processes the response
4. **User creation/retrieval** → User data is stored in MongoDB
5. **JWT token generation** → Secure token created for user session
6. **Frontend redirect** → User redirected to `/auth/success` with token
7. **Token storage** → Frontend stores token in localStorage
8. **Navigation** → User redirected to dashboard/home

### 5. **Security Features**

- ✅ JWT tokens with expiration (7 days)
- ✅ Secure session management
- ✅ CORS configuration for frontend-backend communication
- ✅ Token verification middleware
- ✅ Proper logout handling

### 6. **Production Considerations**

For production deployment:

1. Update redirect URIs in Google Cloud Console:
   ```
   https://yourdomain.com/api/auth/google/callback
   ```

2. Update environment variables:
   ```env
   NODE_ENV=production
   FRONTEND_URL=https://yourdomain.com
   ```

3. Enable secure cookies:
   ```javascript
   cookie: {
     secure: true, // Enable in production with HTTPS
     httpOnly: true,
     sameSite: 'strict'
   }
   ```

### 7. **API Endpoints Available**

- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Handle OAuth callback
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/verify-token` - Verify JWT token

### 8. **Frontend Integration**

```javascript
// Check authentication status
const token = localStorage.getItem('authToken')
const userData = JSON.parse(localStorage.getItem('userData') || '{}')

// Make authenticated API calls
const response = await fetch('/api/protected-endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

🎉 **You're all set!** The Google OAuth integration is now complete and ready to use.
