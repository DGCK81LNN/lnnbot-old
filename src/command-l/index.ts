import { Message } from "mirai-ts";
import { Command } from "../types";
import logger from "./logger";
import { bv2av } from "./utils/avbv";

import video from "./video";
import videoTags from "./video-tags";
import user from "./user";
import b23 from "./b23";
import comments from "./comments";

export default new Command(
    "l",
    "/l <要调用的内容> [选项...] → 外链快速调用",
    async function commandL(param, sendReply) {
        param = param.trim();
        logger.info(`指令被调用，参数：${param}`);
        let match: RegExpMatchArray;

        if (param === "-help") {
            logger.info(`发送帮助`);
            await sendReply(Message.Plain(
                "/l <AV号或BV号> → 查询视频详细信息\n" +
                "/l <AV号或BV号> -tags → 查询视频标签\n" +
                "/l <AV号或BV号> -comments → 查询视频热评\n" +
                "/l <AV号或BV号> -comments -oldest → 查询视频最先10条评论\n" +
                "/l <AV号或BV号> -comments -latest → 查询视频最新10条评论\n" +
                "/l <https://b23.tv/短网址> → 还原短网址"
            ));
        }
        else if (match = param.match(/^av(\d+)$/i)) {
            let id = parseInt(match[1]);
            logger.info(`调用video<aid>：${id}`);
            await video("aid", id, sendReply);
        }
        else if (match = param.match(/^BV[1-9A-HJ-NP-Za-km-z]{10}$/i)) {
            let id = match[0];
            logger.info(`调用video<bvid>：${id}`);
            await video("bvid", id, sendReply);
        }
        else if (match = param.match(/^av(\d+)\s+-tags$/i)) {
            let id = parseInt(match[1]);
            logger.info(`调用videoTags<aid>：${id}`);
            await videoTags("aid", id, sendReply);
        }
        else if (match = param.match(/^(BV[1-9A-HJ-NP-Za-km-z]{10})\s+-tags$/i)) {
            let id = match[1];
            logger.info(`调用videoTags<bvid>：${id}`);
            await videoTags("bvid", id, sendReply);
        }
        else if (match = param.match(/^av(\d+)\s+-comments\s*(-oldest|-latest)?$/i)) {
            let id = parseInt(match[1]);
            logger.info(`调用comments<1>：${id}`);
            await comments(1, id, match[2] as "" | "-oldest" | "-latest", sendReply);
        }
        else if (match = param.match(/^(BV[1-9A-HJ-NP-Za-km-z]{10})\s+-comments\s*(-oldest|-latest)?$/i)) {
            try {
                logger.info("输入BV号查询评论，本地转换为AV号...");
                var id = bv2av(match[1]);
                logger.success("成功");
            } catch (error) {
                logger.error(error);
                await sendReply(Message.Plain("查询评论需要AV号，在将BV号转换为AV号时出错：" + error));
                return;
            }
            logger.info(`调用comments<1>：${id}`);
            await comments(1, id, match[2] as "" | "-oldest" | "-latest", sendReply);
        }
        else if (match = param.match(/UID[:]?\s*(\d+)/i)) {
            let id = parseInt(match[1]);
            logger.info(`调用user：${id}`);
            await user(id, sendReply);
        }
        else if (match = param.match(/^https:\/\/b23.tv\/(.*)$/i)) {
            let id = match[1];
            logger.info(`调用b23：${id}`);
            await b23(id, sendReply);
        }
        else if (match = param.match(/^@(.*)$/i)) {
            let id = match[1];
            logger.info(`调用at：${id}`);
            throw new Error("Not Implemented");
            //await b23(id, sendReply);
        }
        else {
            logger.info(`没有可查询的内容`);
            sendReply(Message.Plain("无法识别要查询的内容。输入“/l -help”查看帮助。"));
        }
        logger.info(`运行结束`);
    }
);
// https://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/name_search?keyword=%E7%94%B5%E9%B9%BF