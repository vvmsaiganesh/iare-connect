require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const { ensureAdmin } = require('./utils/seedAdmin.util');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    // Create the env-defined Admin on first boot (idempotent — a no-op once
    // it exists, and it never changes an existing password). This lets cloud
    // deployments work without a shell step.
    await ensureAdmin();
    app.listen(PORT, () => {
      console.log(`IARE Connect API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

start();
