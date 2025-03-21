import { Router } from "express";
import { SessionController } from "@/controllers/sessions-controller";

const sessionRouter = Router()
const sessionController = new SessionController()

sessionRouter.post("/", sessionController.create)

export { sessionRouter }