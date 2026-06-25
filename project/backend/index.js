import "./src/loadEnv.js";

import app from "./src/app.js";
import connectDB from "./config/db.config.js";

const PORT = process.env.PORT || 3000;

await connectDB();

app.listen(PORT, () => {
   console.log(`app listening on port ${PORT}`)
})
