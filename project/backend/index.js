import "./src/loadEnv.js";

import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`app listening on port ${PORT}`)
})
