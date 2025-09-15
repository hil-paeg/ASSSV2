// test-smtp.js - Run this to test your SMTP connection
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vedupadhye10@gmail.com',
    pass: 'qxef qgkx fsnh crto', // Your app password with spaces
  },
});

async function testConnection() {
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    // Send test email
    await transporter.sendMail({
      from: 'vedupadhye10@gmail.com',
      to: 'vedupadhye10@gmail.com', // Send to yourself for testing
      subject: 'Test Email',
      text: 'This is a test email from your app!',
    });
    
    console.log('✅ Test email sent successfully!');
  } catch (error) {
    console.error('❌ SMTP Error:', error);
  }
}

testConnection();