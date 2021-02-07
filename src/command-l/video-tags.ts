import { Message } from "mirai-ts";
import axios from "axios";
import { SendReplyFunction } from "../types";
import {
    ResponseWrapper,
    VideoTagsResponse,
} from "./types";
import log from "../log";

export default async function video<T extends "aid" | "bvid">(type: T, id: T extends "aid" ? number : string, sendReply: SendReplyFunction) {
    log(`查询视频标签<${type}>: ${id}`, 1);
    try {
        let response = await axios.get<ResponseWrapper<VideoTagsResponse>>(`https://api.bilibili.com/x/tag/archive/tags?${type}=${id}`, { responseType: "json" });
        let wrapper = response.data;
        if (wrapper.code || !wrapper.data) {
            log(`服务器错误`, -1);
            console.log(wrapper);
            await sendReply(Message.Plain(`查询视频标签时出现服务器错误 ${wrapper.code}：${wrapper.message}`));
            return;
        }
        let data = wrapper.data;

        await sendReply(Message.Plain(
            `【标签】\n` +
            data.map(tag => `#${tag.tag_name}（ID: ${tag.tag_id}）${tag.short_content ? ` - ${tag.short_content}` : ""}`).join("\n")
        ));
        log(`成功`, -1);
    }
    catch (error) {
        log(`运行时错误`, -1);
        console.error(error);
        await sendReply(Message.Plain(`查询视频标签时出错：${error}`));
    }
}