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

// src/routes/deliveries-logs-routes.ts
var deliveries_logs_routes_exports = {};
__export(deliveries_logs_routes_exports, {
  deliveryLogRouter: () => deliveryLogRouter
});
module.exports = __toCommonJS(deliveries_logs_routes_exports);
var import_express = require("express");

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

// src/controllers/deliveries-logs-controller.ts
var import_zod = __toESM(require("zod"));
var DeliveryLogsController = class {
  async create(request, response) {
    const bodySchema = import_zod.default.object({
      delivery_id: import_zod.default.string().uuid(),
      description: import_zod.default.string()
    });
    const { delivery_id, description } = bodySchema.parse(request.body);
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id }
    });
    if (!delivery) {
      throw new AppError("Delivery not found", 401);
    }
    if (delivery.status === "delivered") {
      throw new AppError("this order has already been delivered");
    }
    if (delivery.status === "processing") {
      throw new AppError("Change status to shipped", 401);
    }
    await prisma.deliveryLogs.create({
      data: {
        deliveryId: delivery_id,
        description
      }
    });
    response.json({ message: "ok" });
  }
  async show(request, response) {
    const paramsSchema = import_zod.default.object({
      delivery_id: import_zod.default.string().uuid()
    });
    const { delivery_id } = paramsSchema.parse(request.params);
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
      include: { logs: true }
    });
    if (request.user?.role === "customer" && request.user.id !== delivery?.userId) {
      throw new AppError("the user can only view their deliveries", 401);
    }
    response.json(delivery);
  }
};

// src/middlewares/EnsureAuthenticated.ts
var import_jsonwebtoken = require("jsonwebtoken");

// src/env.ts
var import_zod2 = require("zod");
var envSchema = import_zod2.z.object({
  DATABASE_URL: import_zod2.z.string().url(),
  JWT_SECRET: import_zod2.z.string(),
  PORT: import_zod2.z.coerce.number().default(3333)
});
var env = envSchema.parse(process.env);

// src/config/auth.ts
var authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: "1d"
  }
};

// src/middlewares/EnsureAuthenticated.ts
function EnsureAuthenticated(request, response, next) {
  try {
    const authHeaders = request.headers.authorization;
    if (!authHeaders) {
      throw new AppError("JWT token not found", 401);
    }
    const [, token] = authHeaders.split(" ");
    const { role, sub: user_id } = (0, import_jsonwebtoken.verify)(token, authConfig.jwt.secret);
    request.user = {
      id: user_id,
      role
    };
    next();
  } catch (error) {
    throw new AppError("Invalid JWT token", 401);
  }
}

// src/middlewares/VerifyUserAuthorization.ts
function VerifyUserAuthorization(role) {
  return (request, Response, next) => {
    if (!request.user) {
      throw new AppError("Unauthorized.", 401);
    }
    if (!role.includes(request.user.role)) {
      throw new AppError("Unauthorized.", 401);
    }
    next();
  };
}

// src/routes/deliveries-logs-routes.ts
var deliveryLogRouter = (0, import_express.Router)();
var deliveryLogsController = new DeliveryLogsController();
deliveryLogRouter.post("/", EnsureAuthenticated, VerifyUserAuthorization(["sale"]), deliveryLogsController.create);
deliveryLogRouter.get("/:delivery_id", EnsureAuthenticated, VerifyUserAuthorization(["sale", "customer"]), deliveryLogsController.show);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deliveryLogRouter
});
