import {
    Message,
    MessageType,
} from "mirai-ts";
import { SendReplyFunction, Command } from "./types";
import commandL from "./command-l";
import logger from "./logger"

export async function handleCommand(
    messageChain: MessageType.MessageChain,
    sendReply: SendReplyFunction,
) {
    let text = "";
    for (let part of messageChain)
        if (part.type === 'Plain')
            text += part.text;
    return await executeCommand(text, sendReply);
}

async function executeCommand(text: string, sendReply: SendReplyFunction) {
    let match = text.match(/^\s*\/([A-Za-z]+)\s?([^]*)$/); // match commands
    if (match) {
        let commandName = match[1].toLowerCase(),
            commandParams = match[2];
        logger.info(`运行指令 ${commandName}，参数：${commandParams}`);
        for (let command of commands)
            if (command.name === commandName) {
                try {
                    await command.execute(commandParams, sendReply);
                    logger.info(`运行指令完成`);
                }
                catch (error) {
                    logger.error(`运行指令出错`);
                    console.error(error);
                    await sendReply(Message.Plain(`指令运行出错：${error}`));
                }
                return;
            }
        logger.info(`找不到该指令`);
        await sendReply(Message.Plain("无效指令，使用“/help”指令查看帮助。"));
        return;
    }
    // TODO: Handle messages that aren't commands
    logger.info(`收到的消息“${text}”不是指令`);
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
    "/help → 显示帮助信息",
    async function execute(param, sendReply) {
        param = param.trim();
        if (param.match(/^-help/))
            return await sendReply(Message.Plain(
                "/help → 显示指令列表\n" +
                "/<指令名> -help 或 /help <指令名> → 查看指令的详细帮助"
            ));
        else if (param) {
            logger.info("请求指令的详细帮助，重定向指令...");
            return await executeCommand(`/${param} -help`, sendReply);
        }
        await sendReply(Message.Plain(
            "LNNBot目前还处于测试阶段，以后会添加更多功能。\n" +
            "在群内运行指令必须＠机器人（必须＠出来，复制粘贴“@LNNBot”是没有用的）\n" +
            "尖括号（<>）表示必填参数，方括号（[]）表示可选参数。\n" +
            "/<指令名> -help 或 /help <指令名> → 查看指令的详细帮助\n" +
            [...commands].sort(({ name: a }, { name: b }) => a > b ? 1 : a < b ? -1 : 0).map(command => command.helpMessage).join("\n")
        ));
    },
));