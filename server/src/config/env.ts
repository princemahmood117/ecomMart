// function getEnv(name: string): string {
//   const value = process.env[name];

//   if (!value) {
//     throw new Error(`Missing environment variable: ${name}`);
//   }

//   return value;
// }

// export const env = {
//   CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
//   CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
//   CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),
//   DATABASE_URL: getEnv("DATABASE_URL")
// };



function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  // Database
  DATABASE_URL: getEnv("DATABASE_URL"),

  // JWT
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN"),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),

  // SMTP
  SMTP_HOST: getEnv("SMTP_HOST"),
  SMTP_PORT: getEnv("SMTP_PORT"),
  SMTP_USER: getEnv("SMTP_USER"),
  SMTP_PASS: getEnv("SMTP_PASS"),

  // Frontend URL
  CLIENT_URL: getEnv("CLIENT_URL"),

  // Server Port
  PORT: getEnv("PORT"),
};