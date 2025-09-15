// // lib/prisma.ts
// import { PrismaClient } from '@prisma/client/edge';
// import { withAccelerate } from '@prisma/extension-accelerate';

// // Create a base Prisma client
// const prismaClient = new PrismaClient({
//   log: ['error', 'warn'],
// });

// // Extend the Prisma client with Accelerate
// const prismaWithAccelerate = prismaClient.$extends(withAccelerate());

// // Create a type that includes our custom model
// type ExtendedPrismaClient = typeof prismaWithAccelerate & {
//   passwordResetToken: {
//     create: (args: { 
//       data: { 
//         token: string; 
//         expires: Date; 
//         userType: string; 
//         clientId?: number | null; 
//         memberId?: number | null; 
//       } 
//     }) => Promise<any>;
//   };
// };

// // Cast the extended client to our custom type
// const prisma = prismaWithAccelerate as unknown as ExtendedPrismaClient;

// // Export the PrismaClient type
// export type PrismaClientType = typeof prisma;

// // In development, attach the Prisma Client to the global object
// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClientType | undefined;
// }

// // Only create one instance of Prisma Client in development
// if (process.env.NODE_ENV !== 'production') {
//   if (!global.prisma) {
//     global.prisma = prisma;
//   }
// } else {
//   global.prisma = prisma;
// }

// export default prisma;
















// import { PrismaClient } from '@prisma/client/edge';
//    import { withAccelerate } from '@prisma/extension-accelerate';

//    // Create a base Prisma client
//    const prismaClient = new PrismaClient({
//      log: ['error', 'warn'],
//    });

//    // Extend the Prisma client with Accelerate
//    const prisma = prismaClient.$extends(withAccelerate());

//    // Export the PrismaClient type
//    export type PrismaClientType = typeof prisma;

//    // In development, attach the Prisma Client to the global object
//    declare global {
//      // eslint-disable-next-line no-var
//      var prisma: PrismaClientType | undefined;
//    }

//    // Only create one instance of Prisma Client in development
//    if (process.env.NODE_ENV !== 'production') {
//      if (!global.prisma) {
//        global.prisma = prisma;
//      }
//    } else {
//      global.prisma = prisma;
//    }

//    export default prisma;







// import { PrismaClient } from '@prisma/client/edge';
// import { withAccelerate } from '@prisma/extension-accelerate';

// // Create a base Prisma client
// const prismaClient = new PrismaClient({
//   log: ['error', 'warn'],
// });

// // Extend the Prisma client with Accelerate
// const prisma = prismaClient.$extends(withAccelerate());

// // Export the PrismaClient type
// export type PrismaClientType = typeof prisma;

// // In development, attach the Prisma Client to the global object
// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClientType | undefined;
// }

// // Only create one instance of Prisma Client in development
// if (process.env.NODE_ENV !== 'production') {
//   if (!global.prisma) {
//     global.prisma = prisma;
//   }
// } else {
//   global.prisma = prisma;
// }

// export default prisma;







import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

// Create a base Prisma client
const prismaClient = new PrismaClient({
  log: ['error', 'warn'],
});

// Extend the Prisma client with Accelerate
const prisma = prismaClient.$extends(withAccelerate());

// Export the PrismaClient type
export type PrismaClientType = typeof prisma;

// In development, attach the Prisma Client to the global object
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientType | undefined;
}

// Only create one instance of Prisma Client in development
if (process.env.NODE_ENV !== 'production') {
  if (!global.prisma) {
    global.prisma = prisma;
  }
} else {
  global.prisma = prisma;
}

// Export both default and named exports
export default prisma;
export { prisma };