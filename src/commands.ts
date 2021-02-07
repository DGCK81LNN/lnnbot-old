import {
    Message,
    MessageType,
} from "mirai-ts";
import { SendReplyFunction, Command } from "./types";
import commandL from "./command-l";
import log from "./log"

export async function handleCommand(
    messageChain: MessageType.MessageChain,
    sendReply: SendReplyFunction,
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
        for (let command of commands)
            if (command.name === commandName) {
                await command.execute(commandParams, sendReply);
                log(`运行指令完成`, -1);
                return;
            }
        await sendReply(Message.Plain("无效指令，At我发送“/help”查看帮助。"));
        log(`找不到该指令`, -1);
        return;
    }
    // TODO: Handle messages that aren't commands
    log(`收到的消息“${text}”不是指令`);
}

const commands = new Array<Command>();
commands.push(new Command(
    "hello",
    "/hello → Hello, world!",
    async function execute(_, sendReply) {
        sendReply(Message.Plain("Hello, world!"));
    },
));
commands.push(commandL);
commands.push(new Command(
    "help",
    "/help → 显示指令一览",
    async function execute(param, sendReply) {
        param = param.trim();
        if (param === "-help")
            return await sendReply(Message.Plain(this.helpMessage + "\n/<指令名> -help → 查看指令的详细帮助"));
        else if (param)
            return await sendReply(Message.Plain("参数无效\n" + this.helpMessage));
        await sendReply(Message.Plain(
            "LNNBot目前还处于测试阶段，以后会添加更多功能。\n" +
            "在群内运行指令必须＠机器人（必须＠出来，复制粘贴“@LNNBot”是没有用的）\n" +
            "尖括号（<>）表示必填参数，方括号（[]）表示可选参数。\n" +
            "/<指令名> -help → 查看指令的详细帮助\n" +
            [...commands].sort(({name: a}, {name: b}) => a > b ? 1 : a < b ? -1 : 0).map(command => command.helpMessage).join("\n")
        ));
    },
));