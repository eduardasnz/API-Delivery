import { Request, Response } from "express";
import { z } from "zod"
import { hash } from "bcrypt"
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";


class UsersControllers {
  async create(request: Request, response: Response){
    const bodySchema = z.object({
      name: z.string().min(4),
      email: z.string().email(),
      password: z.string().min(4)
    })

    const { name, email, password } = bodySchema.parse(request.body)

    const userWithSameEMail = await prisma.user.findFirst({ where: { email }})

    if(userWithSameEMail){
      throw new AppError("User alreary exists.")
    }

    const hashPassword = await hash(password, 8)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword
      }
    })

    const { password: _, ...userWithoutEMail } = user

    response.status(201).json(userWithoutEMail)
  }
}

export { UsersControllers }