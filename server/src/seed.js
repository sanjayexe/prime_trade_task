const bcrypt = require("bcryptjs");
const { connectDatabase } = require("./config/mongoose");
const { UserModel } = require("./models/User");

async function main() {
  await connectDatabase();

  await UserModel.updateOne(
    { email: "admin@primetrade.local" },
    {
      $set: {
        name: "Admin",
        role: "ADMIN",
        passwordHash: await bcrypt.hash("Admin123!", 10),
      },
    },
    { upsert: true },
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    process.exit(process.exitCode ?? 0);
  });
