"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMessageChain = void 0;
var message_1 = __importDefault(require("../message"));
/**
 * 转化为标准的 MessageChain
 */
function toMessageChain(messageChain) {
    if (typeof messageChain === "string") {
        messageChain = [message_1.default.Plain(messageChain)];
    }
    else if (!Array.isArray(messageChain)) {
        messageChain = [messageChain];
    }
    return messageChain;
}
exports.toMessageChain = toMessageChain;
