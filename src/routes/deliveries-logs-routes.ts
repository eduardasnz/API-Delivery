import { Router } from "express";
import { DeliveryLogsController } from "@/controllers/deliveries-logs-controller";
import { EnsureAuthenticated } from "@/middlewares/EnsureAuthenticated";
import { VerifyUserAuthorization } from "@/middlewares/VerifyUserAuthorization";


const deliveryLogRouter = Router()
const deliveryLogsController = new DeliveryLogsController()

deliveryLogRouter.post("/", EnsureAuthenticated, VerifyUserAuthorization(['sale']), deliveryLogsController.create)
deliveryLogRouter.get("/:delivery_id", EnsureAuthenticated, VerifyUserAuthorization(['sale', 'customer']), deliveryLogsController.show)


export { deliveryLogRouter }