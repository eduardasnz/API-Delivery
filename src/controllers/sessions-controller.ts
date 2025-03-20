import { Request, Response } from "express";
import { authConfig } from "@/config/auth";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";
import { prisma } from "@/database/prisma";
import jwt from "jsonwebtoken";
import { z } from "zod"

class SessionController {
  async create(request: Request, response: Response){
    
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(3)
    })

    const { email, password } = bodySchema.parse(request.body)
    
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if(!user){
      throw new AppError("Invalid email or password.", 401)
    }

    const passwordMatched = await compare(password, user.password)

    if(!passwordMatched){
      throw new AppError("Invalid email or password.", 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = jwt.sign({ role: user.role ?? "customer" }, secret, {
      subject: user.id,
      expiresIn,
    });    

    const { password: hashPassword, ...userWithoutPassword } = user

    response.status(201).json({ token, user: { ...userWithoutPassword } })
  }
}

export { SessionController }