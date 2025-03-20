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

// src/controllers/deliveries-controller.ts
var deliveries_controller_exports = {};
__export(deliveries_controller_exports, {
  DeliveriesController: () => DeliveriesController
});
module.exports = __toCommonJS(deliveries_controller_exports);

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: process.env.NODE_ENV === "production" ? [] : ["query"]
});

// src/controllers/deliveries-controller.ts
var import_zod = __toESM(require("zod"));
var DeliveriesController = class {
  async create(request, response) {
    const bodySchema = import_zod.default.object({
      user_id: import_zod.default.string().uuid(),
      description: import_zod.default.string()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeliveriesController
});
