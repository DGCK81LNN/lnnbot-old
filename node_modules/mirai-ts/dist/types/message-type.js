"use strict";
/**
 * 消息类型，与 [Mirai-api-http 消息类型一览](https://github.com/project-mirai/mirai-api-http/blob/master/MessageType.md) 保持一致
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokes = void 0;
/**
 * "Poke": 戳一戳
 * "ShowLove": 比心
 * "Like": 点赞
 * "Heartbroken": 心碎
 * "SixSixSix": 666
 * "FangDaZhao": 放大招
 */
var Pokes;
(function (Pokes) {
    Pokes[Pokes["Poke"] = 0] = "Poke";
    Pokes[Pokes["ShowLove"] = 1] = "ShowLove";
    Pokes[Pokes["Like"] = 2] = "Like";
    Pokes[Pokes["Heartbroken"] = 3] = "Heartbroken";
    Pokes[Pokes["SixSixSix"] = 4] = "SixSixSix";
    Pokes[Pokes["FangDaZhao"] = 5] = "FangDaZhao";
})(Pokes = exports.Pokes || (exports.Pokes = {}));
