import { Router } from "express";
import { userRoute } from "./users-routes";
import { sessionRouter } from "./sessions-routes";
import { deliveriesRouter } from "./deliveries-routes";
import { deliveryLogRouter } from "./deliveries-logs-routes";

const routes = Router()

routes.use("/users", userRoute)
routes.use("/sessions", sessionRouter)
routes.use("/deliveries", deliveriesRouter)
routes.use("/delivery-log", deliveryLogRouter)

export { routes } 