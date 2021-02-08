import { Message, MessageType } from "mirai-ts";
import axios from "axios";
import { SendReplyFunction } from "../types";
import {
    ResponseWrapper,
    UserInfoResponse,
    UserRelationStatResponse,
    UserSpaceVideoResponse
} from "./types";
import logger from "./logger";
import { formatDuration, formatStatistic } from "./utils";

export default async function user(id: number, sendReply: SendReplyFunction) {
    try {
        var response = await axios.get<ResponseWrapper<UserInfoResponse>>(`https://api.bilibili.com/x/space/acc/info?mid=${id}`, { responseType: "json" });
        var response2 = await axios.get<ResponseWrapper<UserRelationStatResponse>>(`http://api.bilibili.com/x/relation/stat?vmid=${id}`, { responseType: "json" });
        var response3 = await axios.get<ResponseWrapper<UserSpaceVideoResponse>>(`https://api.bilibili.com/x/space/arc/search?mid=${id}&order=click&ps=5`, { responseType: "json" });
    }
    catch (error) {
        logger.error("请求错误");
        console.error(error);
        await sendReply(Message.Plain(`请求出错：${error}`));
    }
    var wrapper = response.data, wrapper2 = response2.data, wrapper3 = response3.data;
    if (wrapper.code || !wrapper.data) {
        logger.info("服务器错误<1>");
        console.log(wrapper);
        await sendReply(Message.Plain(`查询用户基本信息时出现服务器错误 ${wrapper.code}：${wrapper.message}`));
        return;
    }
    if (wrapper2.code || !wrapper2.data) {
        logger.info("服务器错误<2>");
        console.log(wrapper2);
        await sendReply(Message.Plain(`查询用户好友数时出现服务器错误 ${wrapper2.code}：${wrapper2.message}`));
        return;
    }
    if (wrapper3.code || !wrapper3.data) {
        logger.info("服务器错误<3>");
        console.log(wrapper3);
        await sendReply(Message.Plain(`查询用户热门视频时出现服务器错误 ${wrapper3.code}：${wrapper3.message}`));
        return;
    }
    var data = wrapper.data, data2 = wrapper2.data, data3 = wrapper3.data;

    var attributes = new Array<string>();
    if (data.official?.title)
        attributes.push(data.official.title);
    if (data.vip?.type)
        attributes.push([null, "大会员", "年度大会员"][data.vip.type]);
    let r = `@${data.name}（UID: ${data.mid}）${["男", "女"].includes(data.sex) ? " " + data.sex : ""} LV${data.level} ${attributes.join(" - ")}\n` +
        (data.sign.trim() ?
            `个性签名：\n`
            + `${data.sign}\n`
            + `\n`
            : ""
        ) +
        (data.birthday ? `生日：${data.birthday}\n` : "") +
        `${formatStatistic(data2.following)}关注　${formatStatistic(data2.follower)}粉丝`;
    if (data3?.list?.vlist?.length)
        r += `\n\n` +
            `视频投稿：\n` +
            data3.list.vlist.map(video => {
                let attributes = new Array<string>();
                if (video.is_union_video)
                    attributes.push("联合投稿");
                if (video.is_steins_gate)
                    attributes.push("互动视频");
                return (
                    `${video.title}\n` +
                    `时长：${video.length}　av${video.aid}　${video.bvid}\n` +
                    (attributes.length ? `${attributes.join(" - ")}\n` : "") +
                    `${formatStatistic(video.play)}次播放　${formatStatistic(video.comment)}条评论`
                );
            }).join("\n\n");
    await sendReply(Message.Image(null, data.face), Message.Plain(r));
    logger.success(`成功`);
}

// https://api.bilibili.com/x/space/arc/search?mid=328066747&order=click&ps=5
// https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=328066747&offset_dynamic_id=0&need_top=1