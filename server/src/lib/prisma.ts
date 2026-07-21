// import { PrismaClient } from "@prisma/client";
// export const prisma = new PrismaClient();



// import "dotenv/config";
// import { PrismaPg } from "@prisma/adapter-pg";

// import { env } from "../config/env.js";
// import { PrismaClient } from "../generated/prisma";



// const connectionString = `${env.DATABASE_URL}`;

// const adapter = new PrismaPg({ connectionString });
// const prisma = new PrismaClient({ adapter });

// export { prisma };


import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../generated/prisma/client.js";
// import { PrismaClient } from "../generated/prisma/client";
import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.js";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  max: 10,
});

const prisma = new PrismaClient({ adapter });

export { prisma };