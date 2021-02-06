import { Message } from "mirai-ts";
import axios from "axios";
import { SendReplyFunction } from "../types";
import {
    ResponseWrapper,
    VideoAttribute,
    VideoCopyright,
    VideoViewResponse,
    VideoTagsResponse,
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
            Message.Plain(
                `
${data.title}

${data.staff?.length ?
                    `【制作组】\n${data.staff.map(staff => `〖${staff.title}〗${staff.name}（UID: ${staff.mid}）`).join("\n")}`
                    : `【UP主】${data.owner.name}（UID: ${data.owner.mid}）`
                }
【时长】${formatDuration(data.duration)}　【版权】${data.copyright === VideoCopyright.Original ? "自制" : "转载"}　【二级分区】${data.tname}
【发布日期】${formatTime(data.pubdate)}
【AV号】av${data.aid}　【BV号】${data.bvid}
${attributes.length ? `【属性】${attributes.join(" - ")}\n` : ""}
【简介】
${data.desc}

【播放】${formatStatistic(data.stat.view)}　【弹幕】${formatStatistic(data.stat.danmaku)}
【点赞】${formatStatistic(data.stat.like)}　【投币】${formatStatistic(data.stat.coin)}　【收藏】${formatStatistic(data.stat.favorite)}
【转发】${formatStatistic(data.stat.share)}　【评论】${formatStatistic(data.stat.reply)}

【分P】${data.pages.length}个
${data.pages.map(page => `${page.page}. ${page.part} （${formatDuration(page.duration)}）`).join("\n")}`
            ),
        );
        log(`查询视频标签`, 1);
        try {
            let response = await axios.get<ResponseWrapper<VideoTagsResponse>>(`https://api.bilibili.com/x/tag/archive/tags?${type}=${id}`, { responseType: "json" });
            let wrapper = response.data;
            if (wrapper.code || !wrapper.data) {
                log(`服务器错误`, -1);
                console.log(wrapper);
                await sendReply(localConvertAVBV(`查询视频标签时出现服务器错误 ${wrapper.code}：${wrapper.message}`, id));
                return;
            }
            let data = wrapper.data;

            await sendReply(
                Message.Plain(`【标签】
${data.map(tag => `#${tag.tag_name}（ID: ${tag.tag_id}） - ${tag.short_content}`).join("\n")}`
                )
            );
            log(`成功`, -1);
        }
        catch (error) {
            log(`运行时错误`, -1);
            console.error(error);
            await sendReply(localConvertAVBV(`查询视频标签时出错：${error}`, id));
        }
        log(`成功`, -1);
    }
    catch (error) {
        log(`运行时错误`, -1);
        console.error(error);
        await sendReply(localConvertAVBV(`查询出错：${error}`, id));
    }
}