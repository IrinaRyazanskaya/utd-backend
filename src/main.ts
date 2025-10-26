import { createApp } from "./app";
import { serverConfig } from "./config";

const app = createApp();

app.listen(serverConfig.port, () => {
  console.log(`Server listening at http://localhost:${serverConfig.port}`);
});
