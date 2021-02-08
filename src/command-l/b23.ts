import { Message } from "mirai-ts";
import axios from "axios";
import { SendReplyFunction } from "../types";
import { ResponseWrapper } from "./types";
import logger from "./logger";

export default async function b23(id: string, sendReply: SendReplyFunction) {
    try {
        logger.info(`调用API`);
        var response = await axios.get<ResponseWrapper<void>>(`https://b23.tv/${id}`, {
            responseType: "json",
            maxRedirects: 0,
            validateStatus: status => status >= 200 && status < 300 || status == 302
        });
        var wrapper = response.data;
        if (response.status !== 302) {
            logger.info("服务器错误");
            console.log(wrapper);
            await sendReply(Message.Plain(`服务器错误 ${wrapper.code}：${wrapper.message}`));
        }
        await sendReply(Message.Plain(`短网址指向：${response.headers.location}`));
        logger.success(`成功`);
    }
    catch (error) {
        logger.error(error);
        await sendReply(Message.Plain(`查询出错：${error}`));
        return;
    }
}