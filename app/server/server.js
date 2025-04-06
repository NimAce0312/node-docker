import express from "express";
import connectToDB from "./config/db.js";
import arcjectMiddleware from "./middlewares/arcjet.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import indexRouter from "./routes/index.router.js";
import createDefaultUser from "./utils/default.user.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(arcjectMiddleware);

app.use("/api/v1", indexRouter);

app.use(errorMiddleware);

app.listen(8080, async () => {
  console.log(`Server is running on port: 8080`);
  await connectToDB();
  await createDefaultUser();
});