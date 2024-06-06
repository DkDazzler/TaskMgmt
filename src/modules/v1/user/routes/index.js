import { Router } from "express";
import { auth } from "../auth/routes";
import { task } from "../task/routes";

const userRoutes = new Router();
userRoutes.use("/v1", auth);
userRoutes.use("/v1", task);
export { userRoutes };