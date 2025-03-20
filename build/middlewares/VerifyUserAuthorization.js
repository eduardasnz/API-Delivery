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

// src/middlewares/VerifyUserAuthorization.ts
var VerifyUserAuthorization_exports = {};
__export(VerifyUserAuthorization_exports, {
  VerifyUserAuthorization: () => VerifyUserAuthorization
});
module.exports = __toCommonJS(VerifyUserAuthorization_exports);

// src/utils/AppError.ts
var AppError = class {
  message;
  statusCode;
  constructor(message, statusCode = 400) {
    this.message = message, this.statusCode = statusCode;
  }
};

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VerifyUserAuthorization
});
