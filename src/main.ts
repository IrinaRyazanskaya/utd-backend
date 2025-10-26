import { app } from "./index";
import { serverConfig } from "./config";

app.listen(serverConfig.port, () => {
  console.log(`Server listening at http://localhost:${serverConfig.port}`);
});
