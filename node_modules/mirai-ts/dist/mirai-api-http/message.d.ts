import { MessageType } from "..";
/**
 * 转化为标准的 MessageChain
 */
export declare function toMessageChain(messageChain: string | MessageType.SingleMessage | MessageType.MessageChain): MessageType.MessageChain;
