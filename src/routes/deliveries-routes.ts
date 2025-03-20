import { Router } from "express";
import { DeliveriesController } from "@/controllers/deliveries-controller";
import { EnsureAuthenticated } from "@/middlewares/EnsureAuthenticated";
import { VerifyUserAuthorization } from "@/middlewares/VerifyUserAuthorization";
import { DeliveriesStatusController } from "@/controllers/deliveries-status-controller";

const deliveriesRouter = Router()

const deliveriesController = new DeliveriesController()
const deliveriesStatusController = new DeliveriesStatusController()

deliveriesRouter.use(EnsureAuthenticated, VerifyUserAuthorization(["sale"]))

deliveriesRouter.post("/", deliveriesController.create)
deliveriesRouter.get("/", deliveriesController.index)

deliveriesRouter.patch("/:id/status", deliveriesStatusController.update)


export { deliveriesRouter } 