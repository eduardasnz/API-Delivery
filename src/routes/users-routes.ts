import { Router } from "express"; 
import { UsersControllers } from "@/controllers/users-controller";

const userRoute = Router()
const usersControllers = new UsersControllers()

userRoute.post("/", usersControllers.create)

export { userRoute }