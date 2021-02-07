import { Message } from "mirai-ts";
import { Command } from "../types";
import log from "../log";
import { bv2av } from "./utils/avbv";
import video from "./video";
import videoTags from "./video-tags";
import b23 from "./b23";
import comments from "./comments";

export default new Command(
    "l",
    "/l <要查询的内容> [选项...] → 外链快速查询",
    async function commandL(param, sendReply) {
        param = param.trim();
        let match: RegExpMatchArray;

        if (param === "-help") {
            await sendReply(Message.Plain(
                "/l <AV号或BV号> → 查询视频详细信息\n" +
                "/l <AV号或BV号> -tags → 查询视频标签\n" +
                "/l <AV号或BV号> -comments → 查询视频热评\n" +
                "/l <AV号或BV号> -comments -oldest → 查询视频最前10条评论\n" +
                "/l <AV号或BV号> -comments -latest → 查询视频最新10条评论\n" +
                "/l <https://b23.tv/短网址> → 还原短网址"
            ));
        }
        else if (match = param.match(/^av(\d+)$/i)) {
            let id = parseInt(match[1]);
            await video("aid", id, sendReply);
        }
        else if (match = param.match(/^BV[1-9A-HJ-NP-Za-km-z]{10}$/i)) {
            let id = match[0];
            await video("bvid", id, sendReply);
        }
        else if (match = param.match(/^av(\d+)\s+-tags$/i)) {
            let id = parseInt(match[1]);
            await videoTags("aid", id, sendReply);
        }
        else if (match = param.match(/^(BV[1-9A-HJ-NP-Za-km-z]{10})\s+-tags$/i)) {
            let id = match[1];
            await videoTags("bvid", id, sendReply);
        }
        else if (match = param.match(/^av(\d+)\s+-comments\s*(-oldest|-latest)?$/i)) {
            let id = parseInt(match[1]);
            await comments(1, id, match[2] as "" | "-oldest" | "-latest", sendReply);
        }
        else if (match = param.match(/^(BV[1-9A-HJ-NP-Za-km-z]{10})\s+-comments\s*(-oldest|-latest)?$/i)) {
            try {
                log("输入BV号查询评论，本地转换为AV号...", 1);
                var id = bv2av(match[1]);
                log("成功", -1);
            } catch (error) {
                log("失败", -1);
                console.log(error);
                await sendReply(Message.Plain("查询评论需要AV号，在将BV号转换为AV号时出错：" + error));
                return;
            }
            await comments(1, id, match[2] as "" | "-oldest" | "-latest", sendReply);
        }
        else if (match = param.match(/^https:\/\/b23.tv\/(.*)$/i)) {
            let id = match[1];
            await b23(id, sendReply);
        }
        else
            sendReply(Message.Plain("无法识别要查询的内容。输入“/l -help”查看帮助。"));
    }
);