var logDepth = 0;
export default function log(
    msg: string,
    deltaIndent: -1 | 0 | 1 = 0
) {
    let indent = ">   ".repeat(logDepth);
    console.log("[LNNBot] " + indent + msg.replace(/\n/g, `\n${indent}`));
    logDepth += deltaIndent;
    if (logDepth < 0)
        throw new Error("logDepth must be no less than zero");
}