import {
    Message,
    MessageType,
} from "mirai-ts";
import { SendReplyFunction, Command } from "./types";
import commandL from "./command-l";
import log from "./log"

export async function handleCommand(
    messageChain: MessageType.MessageChain,
    sendReply: SendReplyFunction
) {
    let text = "";
    for (let part of messageChain)
        if (part.type === 'Plain')
            text += part.text;
    let match = text.match(/^\s*\/([A-Za-z]+)\s?([^]*)$/); // match commands
    if (match) {
        let commandName = match[1].toLowerCase(),
            commandParams = match[2];
        log(`运行指令“${commandName}”，参数：“${commandParams}”`, 1);
        await executeCommand(commandName, commandParams, sendReply);
        log(`运行指令完成`, -1);
    }
    // TODO: Handle messages that aren't commands
    else log(`收到的消息“${text}”不是指令`);
}

function executeCommand(commandName: string, param: string, sendReply: SendReplyFunction) {
    return commands.has(commandName) ?
        commands.get(commandName)(param, sendReply)
        : sendReply(Message.Plain("无效指令，At我发送“/help”查看帮助。"));
}

const commands = new Map<string, Command>();
commands.set("help", (_, sendReply) => sendReply(Message.Plain(
    "LNNBot目前还处于测试阶段，以后会添加更多功能。\n" +
    "尖括号（<>）表示必填参数，方括号（[]）表示可选参数。\n" +
    "/help → 显示此帮助信息\n" +
    "/hello → Hello, world!\n" +
    "/l <查询内容> → 查询av号、BV号信息"
)));
commands.set("hello", (_, sendReply) => sendReply(Message.Plain("Hello, world!")));
commands.set("l", commandL);