# Google OAuth Authentication Setup

This guide will help you set up Google OAuth authentication for your HealthCare Hub app.

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)

## Step 2: Get Your Credentials

After creating the OAuth client, you'll get:

- **Client ID**: A long string like `123456789-abcdef.apps.googleusercontent.com`
- **Client Secret**: A shorter string like `GOCSPX-abcdefghijklmnop`

## Step 3: Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your actual credentials:

   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```

3. Generate a random secret for NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

## Step 4: Test the Authentication

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/auth/signin`
3. Click "Sign in with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected to the dashboard

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**:

   - Make sure the redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/callback/google`

2. **"Client ID not found" error**:

   - Double-check your GOOGLE_CLIENT_ID in `.env.local`
   - Make sure there are no extra spaces or characters

3. **"Invalid client secret" error**:

   - Double-check your GOOGLE_CLIENT_SECRET in `.env.local`
   - Make sure you copied the entire secret

4. **Environment variables not loading**:
   - Restart your development server after updating `.env.local`
   - Make sure the file is in the root directory of your project

### Security Notes:

- Never commit `.env.local` to version control
- Use different credentials for development and production
- Keep your client secret secure
- Consider using environment variables in production deployments

## Production Deployment

For production deployment:

1. Update the redirect URIs in Google Console to include your production domain
2. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
3. Update NEXTAUTH_URL to your production domain
4. Use a strong, random NEXTAUTH_SECRET

## Additional Features

The current setup includes:

- ✅ Google OAuth authentication
- ✅ Session management
- ✅ Protected dashboard route
- ✅ Sign out functionality
- ✅ Loading states and error handling

You can extend this by adding:

- Email/password authentication
- Database integration for user profiles
- Role-based access control
- Social login providers (GitHub, Facebook, etc.)
