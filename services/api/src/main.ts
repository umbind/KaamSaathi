import { App } from './app.js';
import { Logger } from './common/logger.js';
import { seedPilotData } from './scripts/seed-pilot.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Auto-seed pilot data for instant interactive testing
seedPilotData({ reset: false });

const app = new App();
const server = app.createServer();

server.listen(PORT, HOST, () => {
  Logger.info(`KaamSaathi Modular Monolith API listening on http://${HOST}:${PORT}`);
});
