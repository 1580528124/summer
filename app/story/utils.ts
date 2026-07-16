import type { NodeId, StoryChoice, VnLine } from "./types";

export function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function speakerLabel(speaker?: string) {
  return speaker === "我" || speaker === "周也" ? speaker : "";
}

export function getTransitionText(nodeId: NodeId) {
  if (nodeId === "stadium") return "后来我们走过了很多个秋天。";
  if (nodeId === "plane") return "南京的秋天还没结束，夏天先走了。";
  return "你站在原地。很久。";
}

export function getSceneHint(nodeId: NodeId, activeChoice: StoryChoice | null) {
  if (nodeId === "stadium") {
    if (!activeChoice) return "远处跑步的脚步声每隔几秒响一次。她没有看你，只看着操场。";
    if (activeChoice.key === "D") return "她站起来，拍了拍裤子上的灰，没有回头。";
    return "路灯在她眼睛里有一个很小的光点。她把小拇指伸到你们之间。";
  }

  if (nodeId === "plane") {
    if (!activeChoice) return "她问“想我吗”的时候，风刚好停了。梧桐叶落在地上，没再动。";
    if (activeChoice.key === "D") return "风又响起来。她还是走在前面，距离仍然是三步。";
    return "她走回你身边。没有牵手，但离得很近。";
  }

  if (!activeChoice) return "广播：G……次列车现在开始检票。她没看检票口，她看着你。";
  if (activeChoice.key === "A") return "广播：G……次列车开始检票。她重复那句话，像在确认什么。";
  if (activeChoice.key === "E") return "广播：G……次列车停止检票。声音近得像就在耳边。";
  return "广播：G……次列车即将停止检票。玻璃幕墙上人影来来往往。";
}

export function parseVnLine(line: string): VnLine {
  const [speaker, ...rest] = line.split("：");
  if (rest.length > 0 && speaker.length <= 4) {
    return { speaker, text: rest.join("："), kind: "dialogue" };
  }
  return { speaker: "", text: line, kind: "narration" };
}
