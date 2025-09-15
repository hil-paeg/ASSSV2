// import { config } from 'dotenv';
// import nodemailer from 'nodemailer';

// config();

// async function testSMTP(host, port, secure, description, family = 0) {
//   console.log(`Testing SMTP connection (${description}):`, {
//     host,
//     port,
//     secure,
//     family,
//     user: process.env.SMTP_USER,
//     from: process.env.SMTP_FROM,
//   });

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   tls: {
//     rejectUnauthorized: true,
//     minVersion: 'TLSv1.2',
//   },
//   family: 4,
//   localAddress: '127.0.0.1',
// });



//   try {
//     await transporter.verify();
//     console.log(`SMTP connection successful (${description})`);
//   } catch (err) {
//     console.error(`SMTP error (${description}):`, {
//       error: err.message,
//       stack: err.stack,
//       code: err.code,
//       errno: err.errno,
//     });
//   }
// }

// // Log environment variables
// console.log('Environment variables:', {
//   smtpHost: process.env.SMTP_HOST,
//   smtpPort: process.env.SMTP_PORT,
//   smtpUser: process.env.SMTP_USER,
//   smtpPass: process.env.SMTP_PASS ? '****' : 'undefined',
//   smtpFrom: process.env.SMTP_FROM,
//   smtpName: process.env.SMTP_NAME,
// });

// // Test configurations
// (async () => {
//   // Test port 587 with IPv6 preference
//   await testSMTP('smtp.gmail.com', 587, false, 'smtp.gmail.com:587 (IPv6)', 6);
//   // Test port 587 with IPv4
//   await testSMTP('smtp.gmail.com', 587, false, 'smtp.gmail.com:587 (IPv4)', 4);
//   // Test port 465 with IPv6 preference
//   await testSMTP('smtp.gmail.com', 465, true, 'smtp.gmail.com:465 (IPv6)', 6);
// })();




import net from 'net';

const client = new net.Socket();
client.connect(587, 'smtp.gmail.com', () => {
  console.log('TCP Connection Successful!');
  client.end();
});

client.on('error', (err) => {
  console.error('TCP Connection Failed:', err);
});
