import { app } from "./index";
import { HTTP_PORT } from "./config";

app.listen(HTTP_PORT, () => {
  console.log(`Server listening at http://localhost:${HTTP_PORT}`);
});
