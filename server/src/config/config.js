import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Construct __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const PORT = process.env.PORT || 3000;
export const STATIC_DIR_CLIENT = join(__dirname, '../../../client/src');
export const STATIC_DIR_GAME_LOGIC= join(__dirname, '../../../game-logic');
