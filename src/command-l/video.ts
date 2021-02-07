import { Message } from "mirai-ts";
import axios from "axios";
import { SendReplyFunction } from "../types";
import {
    ResponseWrapper,
    VideoAttribute,
    VideoCopyright,
    VideoViewResponse,
} from "./types";
import log from "../log";
import { Avbv, formatDuration, formatTime, formatStatistic } from "./utils";

function localConvertAVBV(errmsg: string, id: number | string) {
    log(`尝试本地转换AV-BV`, 1);
    let msg = errmsg + "\n本地AV-BV号转换结果：\n";
    try {
        msg += `【AV号】av${Avbv.toAV(id)}　【BV号】${Avbv.toBV(id)}`
        log(`成功`, -1);
    }
    catch (error) {
        log(`转换失败`, -1);
        console.log(error);
        msg += `出错：${error}`;
    }
    return Message.Plain(msg);
}

export default async function video<T extends "aid" | "bvid">(type: T, id: T extends "aid" ? number : string, sendReply: SendReplyFunction) {
    log(`查询视频<${type}>：${id}`, 1);
    try {
        let response = await axios.get<ResponseWrapper<VideoViewResponse>>(`https://api.bilibili.com/x/web-interface/view?${type}=${id}`, { responseType: "json" });
        let wrapper = response.data;
        if (wrapper.code || !wrapper.data) {
            log(`服务器错误`, -1);
            console.log(wrapper);
            await sendReply(localConvertAVBV(`服务器错误 ${wrapper.code}：${wrapper.message}`, id));
            return;
        }
        let data = wrapper.data;

        let attributes: String[] = [];
        if (data.rights.is_cooperation) attributes.push("联合投稿");
        if (data.attribute & VideoAttribute.Interactive) attributes.push("互动视频");
        if (!data.rights.download) attributes.push("不允许下载");
        if (data.rights.movie) attributes.push("电影");
        if (data.rights.no_reprint) attributes.push("未经作者授权，禁止转载");

        await sendReply(
            Message.Image(null, data.pic),
            Message.Plain(`\n` +
                `${data.title}\n` +
                `\n` +
                (data.staff?.length ?
                    `【制作组】\n` +
                    data.staff.map(staff =>
                        `〖${staff.title}〗${staff.name}（UID: ${staff.mid}）`
                    ).join("\n")
                    : `【UP主】${data.owner.name}（UID: ${data.owner.mid}）`
                ) + "\n" +
                `【时长】${formatDuration(data.duration)}　【版权】${data.copyright === VideoCopyright.Original ? "自制" : "转载"}　【二级分区】${data.tname}\n` +
                `【发布日期】${formatTime(data.pubdate)}\n` +
                `【AV号】av${data.aid}　【BV号】${data.bvid}\n` +
                (attributes.length ? `【属性】${attributes.join(" - ")}\n` : "") + "\n" +
                `【简介】\n` +
                data.desc + "\n" +
                `\n` +
                `【播放】${formatStatistic(data.stat.view)}　【弹幕】${formatStatistic(data.stat.danmaku)}\n` +
                `【点赞】${formatStatistic(data.stat.like)}　【投币】${formatStatistic(data.stat.coin)}　【收藏】${formatStatistic(data.stat.favorite)}\n` +
                `【转发】${formatStatistic(data.stat.share)}　【评论】${formatStatistic(data.stat.reply)}\n` +
                `\n` +
                `【分P】${data.pages.length}个\n` +
                data.pages.map(page => `${page.page}. ${page.part} （${formatDuration(page.duration)}）`).join("\n") + "\n" +
                `\n` +
                `输入 /l <AV号或BV号> -tags 查询视频的标签。\n` +
                `输入 /l <AV号或BV号> -comments 查询视频的评论（刷屏警告）。\n` +
                `输入 /l <AV号或BV号> -comments -oldest 查询视频的10条最旧评论。\n` +
                `输入 /l <AV号或BV号> -comments -latest 查询视频的最新评论。`
            ),
        );
        log(`成功`, -1);
    }
    catch (error) {
        log(`运行时错误`, -1);
        console.error(error);
        await sendReply(localConvertAVBV(`查询出错：${error}`, id));
    }
}