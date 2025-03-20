import { app } from "@/app"
import { prisma } from "@/database/prisma"
import request from "supertest"

describe("user controller", () => {

  let id_user: string

  afterAll(async () =>{
  await prisma.user.delete({ where: { id: id_user } })
  })

  // criando usuário
  it("should be able to create a new user", async () => {
    const response = await request(app).post("/users")
      .send({ name: "Teste Example", email: "Teste@example.com", password: "123456" })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty("id")

      id_user = response.body.id
   })

   // verificando se o email ja existe
   it("should throw a error if email already exists", async () => {
    const response = await request(app).post("/users")
    .send({ name: "Teste Two", email: "Teste@example.com", password: "123456" })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("User alreary exists.")
   })

   // verificando validação de email
   it("should a throw validation error if email is invalid", async () => {
    const response = await request(app).post("/users").send({ name: "Teste Example", email: "example-com", password: "123456" })
   
  
    expect(response.status).toBe(400)
    expect(response.body.message).toBe("validation error")
  })

})