import { app } from "@/app"
import request from "supertest"
import { prisma } from "@/database/prisma"

describe("session controller", () => {
  
  let user_id: string

  afterAll(async () =>{
    await prisma.user.delete({ where: { id: user_id } })
    })

  it("should athenticate and get acess token", async () => {
    const UserResponse = await request(app).post("/users").send({
      name: "John Doe Test",
      email: "testeJohnDoe@example.com",
      password: "00120"
    })

    user_id = UserResponse.body.id
  
    const SessionResponse = await request(app).post("/sessions").send({
      email: "testeJohnDoe@example.com",
      password: "00120"
    })

    expect(SessionResponse.status).toBe(201)
    expect(SessionResponse.body.token).toEqual(expect.any(String))
  })
})