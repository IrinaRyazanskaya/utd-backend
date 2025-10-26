import { createApp } from "./app.js";
import { serverConfig } from "./config.js";

const app = createApp();

app.listen(serverConfig.port, () => {
  console.log(`Server listening at http://localhost:${serverConfig.port}`);
});
