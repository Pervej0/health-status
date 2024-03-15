import { Server } from "http";
import app from "./app";
const PORT = 5000;

const main = async () => {
  const server: Server = app.listen(PORT, () =>
    console.log("The Server is running on port", PORT)
  );
};

main();
