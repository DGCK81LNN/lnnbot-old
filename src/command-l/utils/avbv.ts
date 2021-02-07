export const BV_ALPHABET = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
export const AV_REG = /^av[1-9][0-9]*$/i;
export const BV_REG_STRICT = /^BV?(1[1-9A-HJ-NP-Za-km-z]{2}4[1-9A-HJ-NP-Za-km-z]1[1-9A-HJ-NP-Za-km-z]7[1-9A-HJ-NP-Za-km-z]{2})$/i;
export const BV_REG = /^BV?([1-9A-HJ-NP-Za-km-z]{10})$/i;
export const BV_REORDER = [6, 2, 4, 8, 5, 9, 3, 7, 1, 0];
export const BV_XORAND = 177451812;
export const BV_ADDAND = [6, 55, 3, 17, 17, 13, 13, 40, 31, 13];

/**
 * AV号转BV号
 */
export function av2bv(av: number | string) {
    let dump = JSON.stringify(av);
    let num: number = NaN;
    if (typeof av === "number") {
        num = av;
        if (num <= 0)
            throw new RangeError(`av2bv(${dump}): AV号必须大于0`);
        else if (!Number.isInteger(num))
            throw new RangeError(`av2bv(${dump}): AV号必须是整数`);
        else if (num > 2147483647)
            throw new RangeError(`av2bv(${dump}): AV号过大`);
    }
    else {
        if (av.match(AV_REG))
            num = Number(av.substr(2));
        else
            throw new Error(`av2bv(${dump}): AV号格式有误`);
    }

    num ^= BV_XORAND;
    let num58 = [];
    let result = 'BV';
    for (let i = 0; i < 10; i++) {
        num += BV_ADDAND[i];
        num58.push(num % 58);
        num = Math.floor(num / 58);
    }
    for (let digitIndex of BV_REORDER)
        result += BV_ALPHABET[num58[digitIndex]];
    return result;
}

/**
 * BV号转AV号
 * （省略“BV”时，“BV”后的“1”不能省略）
 */
export function bv2av(bv: string) {
    let dump = JSON.stringify(bv);
    let str = '';

    let match = bv.match(BV_REG_STRICT);
    if (match)
        str = match[1];
    else
        throw new Error(`bv2av(${dump}): BV号格式有误`);

    let num58 = [];
    let num = 0;
    for (let i = 0; i < 10; i++) {
        let char = str[i];
        num58[BV_REORDER[i]] = BV_ALPHABET.indexOf(char);
    }
    for (let i = 9; i >= 0; i--) {
        num *= 58;
        num += num58[i] - BV_ADDAND[i];
    }
    if (num > 2147483647)
        throw new RangeError(`bv2av(${dump}): 溢出 (${num} > 2147483647)`);
    num ^= BV_XORAND;

    return num;
}

/**
 * 将任意格式的视频番号转换为AV号数字
 * （“BV”后的“1”不能省略）
 */
export function toAV(input: number | string) {
    let dump = JSON.stringify(input);
    if (typeof (input) === "number")
        if (input <= 0)
            throw new RangeError(`getAID(${dump}): AV号必须大于0`);
        else if (!Number.isInteger(input))
            throw new RangeError(`getAID(${dump}): AV号必须是整数`);
        else
            return input;
    else {
        if (input.match(AV_REG))
            return Number(input.substr(2));
        else if (input.match(BV_REG))
            return bv2av(input);
        else
            throw new Error(`getAID(${dump}): 字符串参数格式有误`);
    }
}

/**
 * 将任意格式的视频番号转换为BV号字符串
 * （“BV”后的“1”不能省略）
 */
export function toBV(input: number | string) {
    let dump = JSON.stringify(input);
    let match: RegExpMatchArray;
    if (typeof input === "number")
        if (input <= 0)
            throw new RangeError(`getBVID(${dump}): AV号必须大于0`);
        else
            return av2bv(input);
    else {
        if (input.match(AV_REG))
            return av2bv(input);
        else if (match = input.match(BV_REG))
            return `BV${match[1]}`;
        else
            throw new Error(`getBVID(${dump}): 字符串参数格式有误`);
    }
}