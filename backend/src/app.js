import "dotenv/config";
import express from "express";
import cors from "cors";
import logger from "./utils/logger";
import connect from "./utils/db.connection";
import userRouter from "./api/routes/user.route";
import authRouter from "./api/routes/auth.route";
import appointmentRoutes from "./api/routes/appointmentRoutes.js";
import doctorRoutes from "./api/routes/doctorRoutes.js";
import hospitalRoutes from "./api/routes/hospitalRoutes.js";
import serviceRoutes from "./api/routes/serviceRoutes.js";
import doctorServiceRoutes from "./api/routes/doctorServiceRoutes.js";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "FETCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/appoint", appointmentRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/doctorService", doctorServiceRoutes);

app.listen(PORT, () => {
  logger.info(`Server is running on port: ${PORT}`);
  connect();
});
