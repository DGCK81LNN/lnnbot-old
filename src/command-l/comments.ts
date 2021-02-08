// 模板字符串乱死了，毫无可读性，我自裁（

import { Message } from "mirai-ts";
import axios from "axios";
import { SendReplyFunction } from "../types";
import {
    ResponseWrapper,
    CommentsResponse,
    CommentMain,
} from "./types";
import logger from "./logger";
import { formatTime, formatStatistic } from "./utils";

function doIt(comments: CommentMain<CommentMain>[], upperMid: number, isTop?: true) {
    return comments.map(comment => {
        var attributes = new Array<string>();
        if (comment.member?.official_verify?.desc)
            attributes.push(comment.member.official_verify.desc);
        if (comment.member?.vip?.vipType)
            attributes.push([null, "大会员", "年度大会员"][comment.member.vip.vipType]);
        return (
            `${comment.member.mid == upperMid ? "【UP】" : ""}@${comment.member.uname}（UID: ${comment.member.mid}）LV${comment.member.level_info.current_level} ${attributes.join(" - ")}\n` +
            `${formatTime(comment.ctime)}` + (comment.floor ? ` ${comment.floor}楼` : "") + "\n" +
            `${isTop ? "【置顶】" : ""}${comment.content.message}\n` +
            `---------\n` +
            `${formatStatistic(comment.like)}人点赞 ${formatStatistic(comment.rcount)}条回复` +
            (comment.replies?.length ?
                "\n" + comment.replies.map(reply =>
                    `${reply.member.mid == upperMid ? "【UP】" : ""}@${reply.member.uname}（UID: ${reply.member.mid}）：${reply.content.message}`
                ).join("\n")
                : ""
            )
        );
    }).join("\n=========\n");
}

export default async function comments<T extends number>(
    type: T, id: number, mode: "" | "-oldest" | "-latest", sendReply: SendReplyFunction,
) {
    try {
        var response = await axios.get<ResponseWrapper<CommentsResponse>>(
            `http://api.bilibili.com/x/v2/reply/main?type=${type}&oid=${id}&ps=11` + ({
                "-oldest": "&mode=2&next=11",
                "-latest": "&mode=2"
            }[mode] || ""),
            { responseType: "json" }
        );
    }
    catch (error) {
        logger.error("请求错误");
        console.error(error);
        await sendReply(Message.Plain(`请求出错：${error}`));
        return;
    }
    var wrapper = response.data;
    if (wrapper.code || !wrapper.data) {
        logger.info("服务器错误");
        console.log(wrapper);
        await sendReply(Message.Plain(`查询评论时出现服务器错误 ${wrapper.code}：${wrapper.message}`));
        return;
    }
    var data = wrapper.data;

    if (mode === "-oldest")
        await sendReply(Message.Plain(
            `${data.cursor.all_count}条评论\n` +
            doIt(data.replies, data.upper.mid)
        ));
    else if (mode === "-latest")
        await sendReply(Message.Plain(
            `${data.cursor.all_count}条评论\n` +
            doIt(data.replies, data.upper.mid)
        ));
    else
        await sendReply(Message.Plain(
            `${data.cursor.all_count}条评论\n` +
            (data.top.upper ?
                doIt([data.top.upper], data.upper.mid, true) + "\n=========\n"
                : ""
            ) +
            doIt(data.replies, data.upper.mid)
        ));
    logger.success(`成功`);
}