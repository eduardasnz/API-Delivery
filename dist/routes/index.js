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

// src/routes/index.ts
var routes_exports = {};
__export(routes_exports, {
  routes: () => routes
});
module.exports = __toCommonJS(routes_exports);
var import_express5 = require("express");

// src/routes/users-routes.ts
var import_express = require("express");

// src/controllers/users-controller.ts
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

// src/routes/users-routes.ts
var userRoute = (0, import_express.Router)();
var usersControllers = new UsersControllers();
userRoute.post("/", usersControllers.create);

// src/routes/sessions-routes.ts
var import_express2 = require("express");

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

// src/controllers/sessions-controller.ts
var import_bcrypt2 = require("bcrypt");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_zod3 = require("zod");
var SessionController = class {
  async create(request, response) {
    const bodySchema = import_zod3.z.object({
      email: import_zod3.z.string().email(),
      password: import_zod3.z.string().min(3)
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
    const passwordMatched = await (0, import_bcrypt2.compare)(password, user.password);
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
var sessionRouter = (0, import_express2.Router)();
var sessionController = new SessionController();
sessionRouter.post("/", sessionController.create);

// src/routes/deliveries-routes.ts
var import_express3 = require("express");

// src/controllers/deliveries-controller.ts
var import_zod4 = __toESM(require("zod"));
var DeliveriesController = class {
  async create(request, response) {
    const bodySchema = import_zod4.default.object({
      user_id: import_zod4.default.string().uuid(),
      description: import_zod4.default.string()
    });
    const { user_id, description } = bodySchema.parse(request.body);
    await prisma.delivery.create({
      data: {
        userId: user_id,
        description
      }
    });
    response.json().status(201);
  }
  async index(request, response) {
    const deliverys = await prisma.delivery.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });
    response.json(deliverys);
  }
};

// src/middlewares/EnsureAuthenticated.ts
var import_jsonwebtoken2 = require("jsonwebtoken");
function EnsureAuthenticated(request, response, next) {
  try {
    const authHeaders = request.headers.authorization;
    if (!authHeaders) {
      throw new AppError("JWT token not found", 401);
    }
    const [, token] = authHeaders.split(" ");
    const { role, sub: user_id } = (0, import_jsonwebtoken2.verify)(token, authConfig.jwt.secret);
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

// src/controllers/deliveries-status-controller.ts
var import_zod5 = require("zod");
var DeliveriesStatusController = class {
  async update(request, response) {
    const paramsSchema = import_zod5.z.object({
      id: import_zod5.z.string().uuid()
    });
    const bodySchema = import_zod5.z.object({
      status: import_zod5.z.enum(["processing", "shipped", "delivered"])
    });
    const { id } = paramsSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);
    await prisma.delivery.update({
      data: {
        status
      },
      where: {
        id
      }
    });
    response.status(200).json({ message: "update" });
  }
};

// src/routes/deliveries-routes.ts
var deliveriesRouter = (0, import_express3.Router)();
var deliveriesController = new DeliveriesController();
var deliveriesStatusController = new DeliveriesStatusController();
deliveriesRouter.use(EnsureAuthenticated, VerifyUserAuthorization(["sale"]));
deliveriesRouter.post("/", deliveriesController.create);
deliveriesRouter.get("/", deliveriesController.index);
deliveriesRouter.patch("/:id/status", deliveriesStatusController.update);

// src/routes/deliveries-logs-routes.ts
var import_express4 = require("express");

// src/controllers/deliveries-logs-controller.ts
var import_zod6 = __toESM(require("zod"));
var DeliveryLogsController = class {
  async create(request, response) {
    const bodySchema = import_zod6.default.object({
      delivery_id: import_zod6.default.string().uuid(),
      description: import_zod6.default.string()
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
    const paramsSchema = import_zod6.default.object({
      delivery_id: import_zod6.default.string().uuid()
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

// src/routes/deliveries-logs-routes.ts
var deliveryLogRouter = (0, import_express4.Router)();
var deliveryLogsController = new DeliveryLogsController();
deliveryLogRouter.post("/", EnsureAuthenticated, VerifyUserAuthorization(["sale"]), deliveryLogsController.create);
deliveryLogRouter.get("/:delivery_id", EnsureAuthenticated, VerifyUserAuthorization(["sale", "customer"]), deliveryLogsController.show);

// src/routes/index.ts
var routes = (0, import_express5.Router)();
routes.use("/users", userRoute);
routes.use("/sessions", sessionRouter);
routes.use("/deliveries", deliveriesRouter);
routes.use("/delivery-log", deliveryLogRouter);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  routes
});
