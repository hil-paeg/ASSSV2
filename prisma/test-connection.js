const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Successfully connected to the database!');
    
    // Test a simple query
    const clientCount = await prisma.client.count();
    console.log(`Number of clients in the database: ${clientCount}`);
    
  } catch (error) {
    console.error('Error connecting to the database:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection()
  .catch((e) => {
    console.error('Error in testConnection:');
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
