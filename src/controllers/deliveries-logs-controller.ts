import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import z from "zod";

class DeliveryLogsController {
  async create(request: Request, response: Response){
    const bodySchema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string()
    })

    const { delivery_id, description } = bodySchema.parse(request.body)

    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id }
    })

    if(!delivery) {
      throw new AppError("Delivery not found", 401)
    }

    if(delivery.status === "delivered"){
      throw new AppError("this order has already been delivered")
    }

    if(delivery.status === "processing"){
      throw new AppError("Change status to shipped", 401)
    }

    await prisma.deliveryLogs.create({
      data: {
        deliveryId: delivery_id,
        description
      }
    })

    response.json({ message: "ok" })
  }

  async show(request: Request, response: Response){
    const paramsSchema = z.object({
      delivery_id: z.string().uuid()
    })

    const { delivery_id } = paramsSchema.parse(request.params)
  
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
      include: { logs: true }
    })

    if(request.user?.role === "customer" && request.user.id !== delivery?.userId){
      throw new AppError("the user can only view their deliveries", 401)
    }

    response.json(delivery)
  }
}

export { DeliveryLogsController }