// 
import {google} from 'googleapis'
import { OAuth2Client } from 'google-auth-library';
import readline from 'readline';

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const REDIRECT_URI = 'http://localhost:3000/api/auth/callback/google';

// Create OAuth2 client
export function getOAuth2Client() {
  if (!process.env.EMAIL_CLIENT_ID || !process.env.EMAIL_CLIENT_SECRET) {
    throw new Error('Missing Google OAuth2 credentials');
  }

  return new google.auth.OAuth2(
    process.env.EMAIL_CLIENT_ID,
    process.env.EMAIL_CLIENT_SECRET,
    REDIRECT_URI
  );
}

// Generate auth URL
export function getAuthUrl() {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
}

// Get tokens from authorization code
export async function getTokensFromCode(code: string) {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

// Generate a new access token using refresh token
export async function getAccessToken() {
  if (!process.env.EMAIL_REFRESH_TOKEN) {
    throw new Error('No refresh token available');
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: process.env.EMAIL_REFRESH_TOKEN,
  });

  const { token } = await oauth2Client.getAccessToken();
  return token;
}

// Helper function to generate the initial refresh token (run this once)
export async function generateRefreshToken() {
  const authUrl = getAuthUrl();
  console.log('Authorize this app by visiting this URL:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve) => {
    rl.question('Enter the code from the authorization page: ', async (code) => {
      try {
        const tokens = await getTokensFromCode(code);
        console.log('Refresh token:', tokens.refresh_token);
        resolve(tokens.refresh_token!);
      } catch (error) {
        console.error('Error getting tokens:', error);
        process.exit(1);
      } finally {
        rl.close();
      }
    });
  });
}

// Only run this if the file is executed directly
if (require.main === module) {
  generateRefreshToken().catch(console.error);
}
