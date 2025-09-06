# Testing the Google Authentication Flow

Follow these steps to test the complete Google authentication flow:

## Prerequisites

1. Make sure both the backend and frontend servers are running:
   - Backend: `cd server && npm run dev`
   - Frontend: `cd SIH2025 && npm run dev`

2. Ensure your MongoDB is running and properly configured
   - Verify with: `cd server && npm run setup-db`

3. Confirm your Google OAuth credentials are set up correctly in `server/.env`

## Test Steps

1. **Open the frontend application**
   - Navigate to the URL shown in your frontend terminal (typically http://localhost:5174)

2. **Go to the Login page**
   - Click on "Login" in the navigation or go directly to the login route

3. **Click "Continue with Google"**
   - The button should show a loading spinner while processing
   - You should be redirected to Google's authentication page

4. **Select your Google account**
   - Choose an account to authenticate with

5. **Observe the redirect**
   - You should be briefly redirected to the AuthSuccess page
   - After a short delay, you should be redirected to the Home page
   - The navigation should now show you're logged in

## Troubleshooting

If you encounter issues:

1. **Check the browser console for errors**
   - Open developer tools (F12) and look at the Console tab

2. **Verify backend logs**
   - Look at the terminal running your backend server for error messages

3. **Confirm environment variables**
   - Backend: Check `server/.env` for correct FRONTEND_URL and Google OAuth credentials
   - Frontend: Check `SIH2025/.env` for correct VITE_API_URL and VITE_FRONTEND_URL

4. **Test MongoDB connection**
   - Run `cd server && npm run setup-db` to verify database connectivity

5. **Clear browser cookies and cache**
   - Sometimes old sessions can cause authentication issues

6. **Verify Google OAuth configuration**
   - Ensure your Google OAuth credentials have the correct redirect URI
   - Check that your Google Cloud project has the necessary APIs enabled