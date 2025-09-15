import { google } from 'googleapis';
import nodemailer from 'nodemailer';

function validateEnvVars() {
  const requiredVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REFRESH_TOKEN',
    'EMAIL_FROM'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

export async function createTransporter() {
  try {
    // Validate environment variables first
    validateEnvVars();
    
    console.log('Initializing OAuth2 client...');
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    console.log('Setting OAuth2 credentials...');
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    console.log('Getting access token...');
    const { token } = await oauth2Client.getAccessToken();
    
    if (!token) {
      throw new Error('Failed to get access token');
    }

    console.log('Creating nodemailer transport...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_FROM,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: token,
      },
    });

    // Verify connection configuration
    await transporter.verify(function(error, success) {
      if (error) {
        console.error('Server verification failed:', error);
        throw error;
      } else {
        console.log('Server is ready to take our messages');
      }
    });

    return transporter;
  } catch (error) {
    console.error('Error in createTransporter:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    throw new Error('Failed to create email transporter. Please check your configuration.');
  }
}
