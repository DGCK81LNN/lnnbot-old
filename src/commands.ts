import {
    //Api,
    //Config,
    //Contact,
    //EventType,
    //Logger,
    Message,
    MessageType,
    //Mirai,
    //MiraiInstance,
    //MiraiApiHttp,
    //MiraiApiHttpConfig,
    //check,
    //template,
} from "mirai-ts";

export function handleCommand(messageChain: MessageType.MessageChain): Promise<MessageType.MessageChain> {
    let text = "";
    for (let part of messageChain)
        if (part.type === 'Plain')
            text += part.text;
    let match = text.match(/^\s?\/([A-Za-z]+)(.*)$/); // match commands
    console.log({ text, match });
    if (match) {
        let reply = executeCommand(match[1], match[2]);
        console.log(reply);
        return reply;
    }
    // TODO: Handle messages that aren't commands
}

function executeCommand(commandName: string, param: string): Promise<MessageType.MessageChain> {
    if (commands.has(commandName.toLowerCase()))
        return commands.get(commandName)(param);
    return nullCommand();
}

const commands = new Map<string, (param: string) => Promise<MessageType.MessageChain>>();
commands.set("help", async _ => [Message.Plain(
    "LNNBot目前还处于测试阶段，以后会添加更多功能。\n" +
    "尖括号（<>）表示必填参数，方括号（[]）表示可选参数。\n" +
    "/help → 显示此帮助信息\n" +
    "/hello → Hello, world!\n" +
    "/l <参数> → 带参数指令测试"
)]);
commands.set("hello", async _ => [Message.Plain("Hello, world!")]);
commands.set("l", async param => [
    Message.Plain(param.trim() ? `参数内容：${param}` : "请提供参数：\n/l <参数>")
]);

async function nullCommand(): Promise<MessageType.MessageChain> {
    return [Message.Plain("无效指令，At我发送“/help”查看帮助。")];
}