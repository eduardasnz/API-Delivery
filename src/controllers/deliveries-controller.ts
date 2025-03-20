import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import z from "zod";

class DeliveriesController {
  async create(request: Request, response: Response){

    const bodySchema = z.object({
      user_id: z.string().uuid(),
      description: z.string()
    })

    const { user_id, description } = bodySchema.parse(request.body)

    await prisma.delivery.create({
      data: {
        userId: user_id,
        description: description
      }
    })


    response.json().status(201)
  }

  async index(request: Request, response: Response){
    
    const deliverys = await prisma.delivery.findMany({
      include: {
        user: {
          select: { name: true, email: true}
        }
      }
    })

    

    response.json(deliverys)
  }
}

export { DeliveriesController }