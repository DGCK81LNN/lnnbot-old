import { Message } from "mirai-ts";
import { SendReplyFunction } from "../types";
import video from "./video";
import b23 from "./b23";

export default async function commandL(param: string, sendReply: SendReplyFunction) {
    param = param.trim();
    let match: RegExpMatchArray;

    if (match = param.match(/^av(\d+)/i)) {
        let id = parseInt(match[1]);
        await video("aid", id, sendReply)
    }
    else if (match = param.match(/^BV[1-9A-HJ-NP-Za-km-z]{10}/i)) {
        let id = match[0];
        await video("bvid", id, sendReply);
    }
    else if (match = param.match(/^https:\/\/b23.tv\/(.*)/i)) {
        let id = match[1];
        await b23(id, sendReply);
    }
    else sendReply(Message.Plain(
        "无法识别要查询的内容。可用查询：\n" +
        "/l <AV号或BV号>\n" +
        "/l https://b23.tv/<短网址ID>"
    ));
}