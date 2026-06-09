const { app } = require("./app");
const { env } = require("./config/env");
const { connectDatabase } = require("./config/mongoose");

async function start() {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
