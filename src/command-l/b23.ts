import { Message } from "mirai-ts";
import axios from "axios";
import { SendReplyFunction } from "../types";
import { ResponseWrapper } from "./types";
import log from "../log";

export default async function b23(id: string, sendReply: SendReplyFunction) {
    log(`查询短网址：${id}`, 1);
    try {
        let response = await axios.get<ResponseWrapper<void>>(`https://b23.tv/${id}`, {
            responseType: "json",
            maxRedirects: 0,
            validateStatus: status => status >= 200 && status < 300 || status == 302
        });
        let wrapper = response.data;
        if (response.status !== 302) {
            log(`服务器错误`, -1);
            console.log(wrapper);
            await sendReply(Message.Plain(`服务器错误 ${wrapper.code}：${wrapper.message}`));
        }
        await sendReply(Message.Plain(`短网址指向：${response.headers.location}`));
        log(`成功`, -1);
    }
    catch (error) {
        log(`运行时错误`, -1);
        console.error(error);
        await sendReply(Message.Plain(`查询出错：${error}`));
    }
}