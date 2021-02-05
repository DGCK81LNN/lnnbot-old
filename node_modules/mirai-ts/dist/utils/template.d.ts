declare type BaseCardType = "bilibili";
/**
 * 卡片信息格式
 */
interface CardInfo {
    type?: BaseCardType;
    /**
     * 简介
     */
    brief?: string;
    /**
     * 卡片链接
     */
    url: string;
    /**
     * 卡片标题
     */
    title?: string;
    /**
     * 卡片摘要
     */
    summary?: string;
    /**
     * 卡片封面图
     */
    cover: string;
    /**
     * 卡片图标
     */
    icon?: string;
    /**
     * 卡片名称
     */
    name?: string;
}
/**
 * 生成卡片 XML 消息模版
 * Example:
 * msg.reply([
 *   Message.Xml(
 *     template.card({
 *       type: "bilibili",
 *       url: "https://www.bilibili.com/video/BV1bs411b7aE",
 *       cover:
 *         "https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/meme/love-er-ci-yuan-is-sick.jpg",
 *       summary: "咱是摘要", // 从前有座山...
 *       title: "咱是标题", // 震惊，xxx！
 *       brief: "咱是简介", // QQ小程序[哔哩哔哩]
 *     })
 *   )
 * ]);
 * @param info
 */
export declare function card(info: CardInfo): string;
export {};
