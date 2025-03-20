"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controllers/users-controller.ts
var users_controller_exports = {};
__export(users_controller_exports, {
  UsersControllers: () => UsersControllers
});
module.exports = __toCommonJS(users_controller_exports);
var import_zod = require("zod");
var import_bcrypt = require("bcrypt");

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: process.env.NODE_ENV === "production" ? [] : ["query"]
});

// src/utils/AppError.ts
var AppError = class {
  message;
  statusCode;
  constructor(message, statusCode = 400) {
    this.message = message, this.statusCode = statusCode;
  }
};

// src/controllers/users-controller.ts
var UsersControllers = class {
  async create(request, response) {
    const bodySchema = import_zod.z.object({
      name: import_zod.z.string().min(4),
      email: import_zod.z.string().email(),
      password: import_zod.z.string().min(4)
    });
    const { name, email, password } = bodySchema.parse(request.body);
    const userWithSameEMail = await prisma.user.findFirst({ where: { email } });
    if (userWithSameEMail) {
      throw new AppError("User alreary exists.");
    }
    const hashPassword = await (0, import_bcrypt.hash)(password, 8);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword
      }
    });
    const { password: _, ...userWithoutEMail } = user;
    response.status(201).json(userWithoutEMail);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UsersControllers
});
