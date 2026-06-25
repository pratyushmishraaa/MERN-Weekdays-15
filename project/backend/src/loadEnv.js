// This file must be imported first in index.js.
// In ESM, imports are hoisted before the module body runs, so loading env
// here ensures every other module sees the variables correctly.
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../env/.env") });
