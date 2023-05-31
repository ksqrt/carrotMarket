const TABLE_NAME = "all-for-you";
const config = {
  PORT: process.env.PORT || 5000,
  //DB_CONNECTION: `mongodb://localhost/${TABLE_NAME}`,
  DB_CONNECTION: `mongodb://user:1q2w3e4r!@gp3sp.pub-vpc.mg.naverncp.com:17017/admin?replicaSet=carretmarket-DB001&directConnection=true`,
  SECRET: "badumts",
  SALT: 10,
  COOKIE_NAME: "USER_SESSION",
  CLOUDINARY_NAME: "silenceiv",
  CLOUDINARY_API_KEY: 626847416757451,
  CLOUDINARY_API_SECRET: "3NzQ5GbrcSjW0EERTJd5XZvfcT8",
  CLOUDINARY_STORAGE: "pza5zln6",
};

module.exports = config;
