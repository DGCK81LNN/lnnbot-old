import { MessageType } from "mirai-ts";
export type SendReplyFunction = (...content: MessageType.SingleMessage[]) => Promise<void>;
export class Command {
    name: string;
    helpMessage: string;
    execute: (param: string, sendReply: SendReplyFunction) => Promise<void>;
    constructor(name: string, helpMessage: string, execute: (param: string, sendReply: SendReplyFunction) => Promise<void>) {
        this.name = name;
        this.helpMessage = helpMessage;
        this.execute = execute;
    }
};