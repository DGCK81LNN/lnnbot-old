import { MessageType } from "mirai-ts";
export type SendReplyFunction = (...content: MessageType.SingleMessage[]) => Promise<void>;
export type Command = (param: string, sendReply: SendReplyFunction) => Promise<void>;