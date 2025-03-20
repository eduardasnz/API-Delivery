"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/sessions-routes.ts
var sessions_routes_exports = {};
__export(sessions_routes_exports, {
  sessionRouter: () => sessionRouter
});
module.exports = __toCommonJS(sessions_routes_exports);
var import_express = require("express");

// src/env.ts
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  DATABASE_URL: import_zod.z.string().url(),
  JWT_SECRET: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3333)
});
var env = envSchema.parse(process.env);

// src/config/auth.ts
var authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: "1d"
  }
};

// src/utils/AppError.ts
var AppError = class {
  message;
  statusCode;
  constructor(message, statusCode = 400) {
    this.message = message, this.statusCode = statusCode;
  }
};

// src/controllers/sessions-controller.ts
var import_bcrypt = require("bcrypt");

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: process.env.NODE_ENV === "production" ? [] : ["query"]
});

// src/controllers/sessions-controller.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_zod2 = require("zod");
var SessionController = class {
  async create(request, response) {
    const bodySchema = import_zod2.z.object({
      email: import_zod2.z.string().email(),
      password: import_zod2.z.string().min(3)
    });
    const { email, password } = bodySchema.parse(request.body);
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    });
    if (!user) {
      throw new AppError("Invalid email or password.", 401);
    }
    const passwordMatched = await (0, import_bcrypt.compare)(password, user.password);
    if (!passwordMatched) {
      throw new AppError("Invalid email or password.", 401);
    }
    const { secret, expiresIn } = authConfig.jwt;
    const token = import_jsonwebtoken.default.sign({ role: user.role ?? "customer" }, secret, {
      subject: user.id,
      expiresIn
    });
    const { password: hashPassword, ...userWithoutPassword } = user;
    response.status(201).json({ token, user: { ...userWithoutPassword } });
  }
};

// src/routes/sessions-routes.ts
var sessionRouter = (0, import_express.Router)();
var sessionController = new SessionController();
sessionRouter.post("/", sessionController.create);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sessionRouter
});
