import { app } from "./application/app.js";
import { logger } from "./application/logging.js";

app.listen(4000, () => {
  logger.info("Server started in port 4000");
});
