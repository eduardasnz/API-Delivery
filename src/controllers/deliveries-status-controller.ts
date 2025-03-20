import { Request, Response, NextFunction } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod"

class DeliveriesStatusController {
  async update(request: Request, response: Response){

    const paramsSchema = z.object({
      id: z.string().uuid(),

    })

    const bodySchema = z.object({
      status: z.enum(["processing", "shipped", "delivered"])
    })

    const { id } = paramsSchema.parse(request.params)
    const { status } = bodySchema.parse(request.body)

    await prisma.delivery.update({
      data: { 
        status,
      },
      where: {
        id
      }
    })

    response.status(200).json({message: "update"})

  }
}

export { DeliveriesStatusController }