import { Message } from "mirai-ts";
import axios from "axios";
import { SendReplyFunction } from "../types";
import {
    ResponseWrapper,
    VideoTagsResponse,
} from "./types";
import logger from "./logger";

export default async function videoTags<T extends "aid" | "bvid">(type: T, id: T extends "aid" ? number : string, sendReply: SendReplyFunction) {
    try {
        var response = await axios.get<ResponseWrapper<VideoTagsResponse>>(`https://api.bilibili.com/x/tag/archive/tags?${type}=${id}`, { responseType: "json" });
    }
    catch (error) {
        logger.error("请求错误");
        console.error(error);
        await sendReply(Message.Plain(`请求出错：${error}`));
    }
    var wrapper = response.data;
    if (wrapper.code || !wrapper.data) {
        logger.info("服务器错误");
        console.log(wrapper);
        await sendReply(Message.Plain(`查询视频标签时出现服务器错误 ${wrapper.code}：${wrapper.message}`));
        return;
    }
    var data = wrapper.data;

    await sendReply(Message.Plain(
        `标签：\n` +
        data.map(tag => `#${tag.tag_name}（ID: ${tag.tag_id}）${tag.short_content ? ` - ${tag.short_content}` : ""}`).join("\n")
    ));
    logger.success(`成功`);
}