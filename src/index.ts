import {
    //Api,
    //Config,
    //Contact,
    //EventType,
    Logger,
    MessageType,
    Mirai,
    //MiraiInstance,
    //MiraiApiHttp,
    MiraiApiHttpConfig,
    Message,
    //check,
    //template,
} from "mirai-ts";
import * as BotCommandHandler from "./commands";

const qq = 2748080608;
const mahConfig: MiraiApiHttpConfig = {
    host: "127.0.0.1",
    port: 19198,
    authKey: "CollectingJunkWithLNN"
};

const bot = new Mirai(mahConfig);

function handleGroupMessage(event: MessageType.GroupMessage) {
    if (!event.isAt())
        return;
    BotCommandHandler.handleCommand(event.messageChain, (...parts) => {
        //console.log(parts);
        return event.reply([
            Message.At(event.sender.id),
            Message.Plain(" "),
            ...parts
        ], true);
    }
    );
}
function handleSingleMessage(event: MessageType.FriendMessage | MessageType.TempMessage) {
    BotCommandHandler.handleCommand(event.messageChain, (...parts) => {
        //console.log(parts);
        return event.reply(parts, true);
    });
}

bot.link(qq).then(() => {
    bot.on("GroupMessage", handleGroupMessage);
    bot.on("FriendMessage", handleSingleMessage);
    bot.on("TempMessage", handleSingleMessage);

    bot.on("MemberJoinEvent", event => {
        if (event.member.group.permission !== 'MEMBER')
            event.reply([
                Message.At(event.member.id),
                Message.Plain(" 欢迎入群！")
            ]);
    });

    bot.listen();
});