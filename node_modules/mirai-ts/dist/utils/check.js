"use strict";
/**
 * 消息匹配辅助函数，提供了默认的几种匹配检测方式，可以直接导入使用。
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAt = exports.isChatMessage = exports.match = exports.re = exports.includes = exports.is = void 0;
// 匹配
/**
 * 匹配是否相同，当 keywords 为数组时，代表或，有一个相同即可
 * @param str 字符串
 * @param keywords 关键字
 */
function is(str, keywords) {
    if (Array.isArray(keywords)) {
        return keywords.some(function (keyword) {
            return str === keyword;
        });
    }
    else {
        return str === keywords;
    }
}
exports.is = is;
/**
 * 匹配是否包含，当 keywords 为数组时，代表同时包含
 * @param str 字符串
 * @param keywords  关键字
 */
function includes(str, keywords) {
    if (Array.isArray(keywords)) {
        return keywords.every(function (keyword) {
            /**
             * 有 false 时跳出循环
             */
            return str.includes(keyword);
        });
    }
    else {
        return str.includes(keywords);
    }
}
exports.includes = includes;
/**
 * 正则匹配（存在时，返回匹配的情况，不存在时返回 false）
 * @param str 字符
 * @param config 正则配置，可以是包含 pattern，flags 的对象，也可以是字符串（直接代表 pattern）
 */
function re(str, config) {
    var regExp = null;
    if (typeof config === "string") {
        regExp = new RegExp(config);
    }
    else {
        regExp = new RegExp(config.pattern, config.flags || "i");
    }
    var result = regExp.exec(str);
    if (result && result[0]) {
        return result;
    }
    else {
        return false;
    }
}
exports.re = re;
/**
 * 是否匹配
 * @param str 字符串
 * @param ans 回答的语法配置
 */
function match(str, ans) {
    if (ans.re)
        return re(str, ans.re);
    if (ans.is)
        return is(str, ans.is);
    if (ans.includes)
        return includes(str, ans.includes);
    return false;
}
exports.match = match;
// ------------
// helper
// 检测消息链
/**
 * 是否是聊天信息中的一种
 * ['FriendMessage', 'GroupMessage', 'TempMessage']
 * @param msg 消息链
 */
function isChatMessage(msg) {
    var msgType = ["FriendMessage", "GroupMessage", "TempMessage"];
    return msgType.includes(msg.type);
}
exports.isChatMessage = isChatMessage;
/**
 * 是否被艾特
 * 传入 qq 时，返回是否被艾特
 * 未传入 qq 时，返回艾特消息
 * @param msg
 */
function isAt(msg, qq) {
    if (qq) {
        return msg.messageChain.some(function (singleMessage) {
            return singleMessage.type === "At" && singleMessage.target === qq;
        });
    }
    else {
        var atMsg_1 = undefined;
        msg.messageChain.some(function (singleMessage) {
            if (singleMessage.type === "At") {
                atMsg_1 = singleMessage;
                return true;
            }
        });
        return atMsg_1 ? atMsg_1 : false;
    }
}
exports.isAt = isAt;
