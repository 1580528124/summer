"use client";

import { useEffect, useState } from "react";
import { PhoneMemory } from "../components/PhoneMemory";
import type { LiveChatMessage, MemoryId, PhoneApp, SchedulePresenceChoice, VnLine } from "../story/types";
import { cx, speakerLabel } from "../story/utils";

type ChatChapter = {
  time: string;
  title: string;
  summary: string;
};

type FragmentId = "computer" | "voice" | "recycle";
type PhoneStepId = "phone0" | "phone1" | "phone2" | "phone3";
type StepId = FragmentId | PhoneStepId;

type MemoryFragment = {
  id: FragmentId;
  memoryId: MemoryId;
  label: string;
  title: string;
  subtitle: string;
  lines: VnLine[];
  doneText: string;
};

type Props = Record<string, any> & {
  markMemorySeen?: (id: MemoryId) => void;
  schedulePresenceChoice: SchedulePresenceChoice | null;
  setSchedulePresenceChoice: (choice: SchedulePresenceChoice) => void;
  setSecondAskLineIndex: (index: number) => void;
  setPhase: (phase: "secondAsk") => void;
  controllerStepIndex?: number;
  controllerJumpNonce?: number;
};

type ScheduleReactionBeat = {
  eyebrow: string;
  text: string;
  chat?: LiveChatMessage;
  typing?: boolean;
};

type ScheduleBranch = {
  key: SchedulePresenceChoice;
  mode: string;
  reply: string;
  marker: string;
  echo: string;
  beats: ScheduleReactionBeat[];
};

const fragmentOrder: StepId[] = ["computer", "phone0", "voice", "phone1", "recycle", "phone2", "phone3"];
const phoneStepIds: PhoneStepId[] = ["phone0", "phone1", "phone2", "phone3"];
const phoneDoneText = "聊天记录读取完成：她不是突然累的，你们的话是慢慢变短的。";

const chatChapters: ChatChapter[] = [
  {
    time: "2024 夏天 - 秋天",
    title: "刚在一起的时候",
    summary: "她问过以后，你把答案放到了以后。"
  },
  {
    time: "2025 三月 - 六月",
    title: "北京 offer 和南京本校",
    summary: "异地不是突然开始的，是从没有提前说出口的决定开始的。"
  },
  {
    time: "2025 七月 - 十二月",
    title: "入职、轮休和两座城市",
    summary: "她来过南京，你也去过北京。后来的热闹慢慢变成等、忙、没回。"
  },
  {
    time: "2026 一月",
    title: "分手通话",
    summary: "她等过一句“我不想分开”，你只说了“好”。"
  }
];

const memoryFragments: Record<FragmentId, MemoryFragment> = {
  computer: {
    id: "computer",
    memoryId: "computer",
    label: "电脑",
    title: "电脑文件夹“以后”",
    subtitle: "南京、北京、排班、退票订单。",
    doneText: "文件夹里的“以后”已经读完。那些没发生的计划，正在变成下一段记忆。",
    lines: [
      { speaker: "", text: "文件夹“以后”打开了。创建时间：2024年12月。最后修改时间：2026年1月。", kind: "system" },
      { speaker: "", text: "第一张文件：她的排班.jpg。打开它。", kind: "system" },
      { speaker: "", text: "截图加载完成。红框圈住周也，以及周四、周五两格“休”。", kind: "narration" },
      { speaker: "", text: "文件备注：2025年8月，她来南京。", kind: "system" },
      { speaker: "我", text: "她那次真的排了很久。", kind: "dialogue" },
      { speaker: "", text: "这仍然只是旧文件。系统暂不允许你回应。", kind: "system" },
      { speaker: "", text: "她提前十二天申请，在备注里写：去南京。票已买。勿改。", kind: "system" },
      { speaker: "", text: "她不是刚好有空。她是把你从排班表里抢出来的。", kind: "system" },
      { speaker: "我", text: "那时候我也收藏过去北京的票。", kind: "dialogue" },
      { speaker: "", text: "南京南到北京南，G6，558.5元。备注：等她安顿好了，我去找她。", kind: "narration" },
      { speaker: "", text: "北京南到南京南，G23，558.5元。她也收藏过这趟车。", kind: "narration" },
      { speaker: "我", text: "这个我不知道。", kind: "dialogue" },
      { speaker: "", text: "不是所有没说出口的东西，都不存在。", kind: "system" },
      { speaker: "", text: "北京攻略截图里，药店、便利店、她公司附近的餐厅被圈出来。备注：她下班晚，别约太远。买感冒药。", kind: "narration" },
      { speaker: "", text: "隐藏文件出现：2025年11月11日 北京南-南京南.pdf。状态：已退票。退票时间：23:47。", kind: "system" },
      { speaker: "我", text: "她都说没事了。我去了也帮不上什么。", kind: "dialogue" },
      { speaker: "", text: "你没有去。所以你永远不知道有没有用。", kind: "system" },
      { speaker: "", text: "你们收藏了很多“以后”。后来那些“以后”，大部分都停在收藏夹里。", kind: "system" }
    ]
  },
  voice: {
    id: "voice",
    memoryId: "mp3",
    label: "语音备忘录",
    title: "手机语音备忘录",
    subtitle: "聊天记录里不存在的两段音频。",
    doneText: "语音备忘录读取完成：她不是没有求救，她只是越来越少把话说完。",
    lines: [
      { speaker: "", text: "手机停在最后那条通话记录上。屏幕弹出提示：检测到同一设备内存在未同步音频备份。来源：语音备忘录。", kind: "system" },
      { speaker: "我", text: "她还录过东西？", kind: "dialogue" },
      { speaker: "", text: "聊天记录中不存在以下内容。但它们仍属于本次记忆校准。", kind: "system" },
      { speaker: "", text: "第一段：南京秋天.m4a。时间：2024年秋天。状态：未发送。", kind: "system" },
      { speaker: "周也", text: "喂。你在干嘛呀。没事，我就是想录个东西给你。", kind: "dialogue" },
      { speaker: "周也", text: "以后你去北京了、我回南京了，或者我们去了别的地方，翻到这个，还能想起来。", kind: "dialogue" },
      { speaker: "周也", text: "2024年的南京，秋天，有个人挺喜欢你的。好了不说了。我去找你了。", kind: "dialogue" },
      { speaker: "", text: "最后是她跑起来的脚步声。发送状态：未发送。保存状态：保留。她没有删。", kind: "system" },
      { speaker: "", text: "第二段：没发出去.m4a。时间：2025年12月。地点：北京。状态：未发送。", kind: "system" },
      { speaker: "周也", text: "又加班到这个点。想给他打电话。他肯定睡了。", kind: "dialogue" },
      { speaker: "周也", text: "我今天路过一家店，招牌上写着“南京大牌档”。在门口站了一会儿。没进去。", kind: "dialogue" },
      { speaker: "周也", text: "南京现在应该很冷了吧。梧桐树掉光叶子了。北京也好冷。但北京没有梧桐树。", kind: "dialogue" },
      { speaker: "周也", text: "算了。不说了。我好累啊。", kind: "dialogue" },
      { speaker: "", text: "保存时间：2025年12月14日 23:58。发送状态：未发送。最近一次播放：无。", kind: "system" },
      { speaker: "我", text: "那我怎么知道她这么累？", kind: "dialogue" },
      { speaker: "", text: "她说过。你没有听出来。", kind: "system" }
    ]
  },
  recycle: {
    id: "recycle",
    memoryId: "recycle",
    label: "回收站",
    title: "回收站：毕业.mp4",
    subtitle: "她离开南京前，最后一次等你开口。",
    doneText: "毕业.mp4 已恢复。她说过答案，只是你那时没有听进去。",
    lines: [
      { speaker: "", text: "回收站里只有一个文件：毕业.mp4。状态：已删除。", kind: "system" },
      { speaker: "我", text: "我记得这个。", kind: "dialogue" },
      { speaker: "", text: "你只记得你看过。你不记得她说过什么。", kind: "system" },
      { speaker: "周也", text: "笑一个。今天毕业了。", kind: "dialogue" },
      { speaker: "我", text: "我笑了。", kind: "dialogue" },
      { speaker: "周也", text: "算了。我明天就去北京了。你去送我吗？", kind: "dialogue" },
      { speaker: "我", text: "去。", kind: "dialogue" },
      { speaker: "周也", text: "真的？", kind: "dialogue" },
      { speaker: "我", text: "真的。", kind: "dialogue" },
      { speaker: "周也", text: "那行。我记住了。", kind: "dialogue" },
      { speaker: "周也", text: "你以后想我了，就看看这个视频。毕业快乐。", kind: "dialogue" },
      { speaker: "周也", text: "还有，你以后别什么都闷在心里了。你想说什么就说。你不说我就只能猜，我猜得好累。", kind: "dialogue" },
      { speaker: "我", text: "我尽量。", kind: "dialogue" },
      { speaker: "周也", text: "又“尽量”。行吧。但我还是喜欢你。", kind: "dialogue" },
      { speaker: "", text: "画面暗下去。最后三秒，她很轻地说：要是有你在北京就好了。", kind: "narration" },
      { speaker: "", text: "这个视频你2025年看过一次。她走之后你删了。2027年你把它恢复了。窗外梧桐树还是绿的，你看了三遍。", kind: "system" },
      { speaker: "我", text: "我那天后来也没去送她。", kind: "dialogue" },
      { speaker: "", text: "记录确认：2025年6月，她离开南京。你发送消息：路上小心。她回复：嗯。", kind: "system" }
    ]
  }
};

const calibrationChoices = [
  { key: "A", text: "没有。异地太难了。", fail: "校准失败。距离是事实，不是答案。" },
  { key: "B", text: "没有。她已经太累了。", fail: "校准失败。疲惫是结果，不是原因。" },
  { key: "C", text: "没有。我不想逼她。", fail: "校准失败。尊重不是沉默。" }
];

const scheduleBranches: ScheduleBranch[] = [
  {
    key: "A",
    mode: "",
    reply: "周四导师临时有会，我不能保证准点。但你几点到？我提前跟他说，结束就去接你。晚了我随时告诉你。",
    marker: "信任指数 +1",
    echo: "她暂时放下了“你可能不会来”的担忧。",
    beats: [
      { eyebrow: "三秒", text: "她正在输入……停了大概三秒。", typing: true },
      { eyebrow: "周也", text: "真的？你不是说导师可能要开会？", chat: { speaker: "zhouye", text: "真的？你不是说导师可能要开会？" } },
      { eyebrow: "我", text: "会还得开。但我不会让你一个人猜。我出来就去找你。", chat: { speaker: "me", text: "会还得开。但我不会让你一个人猜。我出来就去找你。" } },
      { eyebrow: "新的截图", text: "她没回文字，发来12306订单详情：南京南站，到达14:37。", chat: { speaker: "zhouye", text: "[图片：12306订单详情] 南京南站 · 到达14:37", image: true } },
      { eyebrow: "周也", text: "那说好了啊。", chat: { speaker: "zhouye", text: "那说好了啊。" } },
      { eyebrow: "周也", text: "我把汤包那家店订位了。你别再改主意了。", chat: { speaker: "zhouye", text: "我把汤包那家店订位了。你别再改主意了。" } },
      { eyebrow: "2027年的我", text: "我没有让会议消失，也没有保证自己绝不迟到。我只是第一次把不确定性留给自己承担，而不是丢给她等待。" }
    ]
  },
  {
    key: "B",
    mode: "",
    reply: "我周四可能导师要开会，但我会尽量赶过来。你到了先找个地方歇着，我忙完立刻找你。",
    marker: "忍耐度 +1",
    echo: "她把期待压下去，但仍坚持等你出现。",
    beats: [
      { eyebrow: "很快", text: "她几乎立刻回了。" },
      { eyebrow: "周也", text: "行。你忙你的。", chat: { speaker: "zhouye", text: "行。你忙你的。" } },
      { eyebrow: "周也", text: "我到了先去科巷逛逛，那家店我去排个号，你来了就能吃。", chat: { speaker: "zhouye", text: "我到了先去科巷逛逛，那家店我去排个号，你来了就能吃。" } },
      { eyebrow: "周也", text: "不急。你忙完再说。", chat: { speaker: "zhouye", text: "不急。你忙完再说。" } },
      { eyebrow: "两分钟后", text: "聊天框安静了两分钟。她又补了一句。", typing: true },
      { eyebrow: "周也", text: "但你得过来啊。", chat: { speaker: "zhouye", text: "但你得过来啊。" } },
      { eyebrow: "2027年的我", text: "“不急”和“你得过来”是同一个人在同一秒说的。她努力不成为负担，又害怕我真的不来。" }
    ]
  },
  {
    key: "C",
    mode: "",
    reply: "我周四不确定，到时候再看吧。你到了跟我说。",
    marker: "磨损 +1",
    echo: "她又退了一步，开始收回已经排好的期待。",
    beats: [
      { eyebrow: "四十秒", text: "她隔了大概四十秒才回。", typing: true },
      { eyebrow: "周也", text: "好。", chat: { speaker: "zhouye", text: "好。" } },
      { eyebrow: "周也", text: "那你先忙。", chat: { speaker: "zhouye", text: "那你先忙。" } },
      { eyebrow: "沉默", text: "没有新截图，没有订位，也没有“我先逛逛”。聊天停在这里。" },
      { eyebrow: "2027年的我", text: "我以为事情只是先放一放。现在才看见，她发截图前已经排好了南京的两天；我说“到时候看”，她就默默删掉了它。" }
    ]
  },
  {
    key: "D",
    mode: "",
    reply: "嗯。",
    marker: "磨损 +2",
    echo: "她把期待收回，直到出发前都不会再主动提起。",
    beats: [
      { eyebrow: "正在输入", text: "她正在输入……停了。又开始输入……又停了。", typing: true },
      { eyebrow: "一分钟后", text: "大概过了一分钟。" },
      { eyebrow: "周也", text: "行吧。", chat: { speaker: "zhouye", text: "行吧。" } },
      { eyebrow: "沉默", text: "没有新的消息。聊天框里的光标也消失了。" },
      { eyebrow: "2027年的我", text: "“行”是确认，“行吧”是吐出一句“行”以后，把剩下半句咽回去。那半句也许是：我以为你会更想见我。" }
    ]
  }
];

type ComputerFile = {
  name: string;
  type: string;
  meta: string;
  lineIndex: number;
  danger: boolean;
  previewTitle: string;
  previewLines: string[];
  image?: string;
  portrait?: boolean;
};

const computerFiles: ComputerFile[] = [
  {
    name: "她的排班.jpg",
    type: "JPG 图片",
    meta: "2025/8/12 22:16",
    lineIndex: 1,
    danger: false,
    previewTitle: "排班管理 · 2025年8月18日 - 8月24日",
    previewLines: ["红框：周也 / 周四 休 / 周五 休", "备注：去南京。票已买。勿改。"],
    image: "/assets/story/schedule-zhouye-2025.png"
  },
  {
    name: "南京南-北京南 G6.png",
    type: "PNG 图片",
    meta: "2024/12/24 00:18",
    lineIndex: 9,
    danger: false,
    previewTitle: "高铁收藏",
    previewLines: ["南京南 → 北京南", "G6  ¥558.5", "收藏时间：2024年12月"],
    image: "/assets/story/ticket-g6-nanjing-beijing.png",
    portrait: true
  },
  {
    name: "北京南-南京南 G23.png",
    type: "PNG 图片",
    meta: "2024/12/24 00:20",
    lineIndex: 10,
    danger: false,
    previewTitle: "高铁收藏",
    previewLines: ["北京南 → 南京南", "G23  ¥558.5", "收藏时间：2024年12月"],
    image: "/assets/story/ticket-g23-beijing-nanjing.png",
    portrait: true
  },
  {
    name: "北京攻略.png",
    type: "PNG 图片",
    meta: "2025/1/09 18:42",
    lineIndex: 13,
    danger: false,
    previewTitle: "北京攻略截图",
    previewLines: ["她下班晚，别约太远。", "附近有没有南京菜？", "买感冒药。"]
  },
  {
    name: "2025-11-11 北京南-南京南.pdf",
    type: "PDF 文档",
    meta: "2025/11/11 23:47",
    lineIndex: 14,
    danger: true,
    previewTitle: "已退票订单",
    previewLines: ["状态：已退票", "退票时间：23:47", "她发“多喝热水”时，我在退票。"]
  }
];

export function MemoryCalibrationStage({ markMemorySeen, schedulePresenceChoice, setSchedulePresenceChoice, setSecondAskLineIndex, setPhase, controllerStepIndex, controllerJumpNonce }: Props) {
  const [activeFragment, setActiveFragment] = useState<FragmentId | null>(null);
  const [fragmentLineIndex, setFragmentLineIndex] = useState(0);
  const [completedFragments, setCompletedFragments] = useState<StepId[]>([]);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [activePhoneStep, setActivePhoneStep] = useState<PhoneStepId | null>(null);
  const [phoneRevealCounts, setPhoneRevealCounts] = useState<Record<PhoneStepId, number>>({
    phone0: 0,
    phone1: 0,
    phone2: 0,
    phone3: 0
  });
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [failedCalibration, setFailedCalibration] = useState<string[]>([]);
  const [scheduleMessageArrived, setScheduleMessageArrived] = useState(false);
  const [scheduleMessageRead, setScheduleMessageRead] = useState(false);
  const [openedComputerImage, setOpenedComputerImage] = useState<ComputerFile | null>(null);
  const [phoneInitialApp, setPhoneInitialApp] = useState<PhoneApp>("home");
  const [returnToComputerAfterPhone, setReturnToComputerAfterPhone] = useState(false);
  const [scheduleReplyBeatIndex, setScheduleReplyBeatIndex] = useState(-1);
  const [phoneChapterComplete, setPhoneChapterComplete] = useState(false);

  const currentFragment = activeFragment ? memoryFragments[activeFragment] : null;
  const currentLine = currentFragment?.lines[Math.min(fragmentLineIndex, Math.max(currentFragment.lines.length - 1, 0))];
  const allFragmentsDone = completedFragments.length === fragmentOrder.length;
  const currentStepId = fragmentOrder[completedFragments.length];
  const currentStepIsPhoneAccessible = currentStepId === "voice" || Boolean(currentStepId && isPhoneStep(currentStepId));
  const showFinalChoice = failedCalibration.length >= calibrationChoices.length;
  const activeScheduleBranch = schedulePresenceChoice ? scheduleBranches.find((branch) => branch.key === schedulePresenceChoice) ?? null : null;
  const activeScheduleBeat = activeScheduleBranch && scheduleReplyBeatIndex >= 0 ? activeScheduleBranch.beats[Math.min(scheduleReplyBeatIndex, activeScheduleBranch.beats.length - 1)] : null;
  const scheduleReactionComplete = Boolean(activeScheduleBranch && scheduleReplyBeatIndex >= activeScheduleBranch.beats.length - 1);
  const scheduleLiveMessages: LiveChatMessage[] = activeScheduleBranch
    ? [
        { speaker: "me", text: activeScheduleBranch.reply },
        ...activeScheduleBranch.beats.slice(0, scheduleReplyBeatIndex + 1).map((beat) => beat.chat ?? {
          speaker: "system" as const,
          text: `${beat.eyebrow}：${beat.text}`
        }),
        ...(scheduleReactionComplete ? [{
          speaker: "system" as const,
          text: `${activeScheduleBranch.marker} · ${activeScheduleBranch.echo}`
        }] : [])
      ]
    : [];

  useEffect(() => {
    if (!returnToComputerAfterPhone || !activeScheduleBranch || !activeScheduleBeat || scheduleReactionComplete) return;

    const delay = activeScheduleBeat.typing ? 3000 : activeScheduleBeat.chat ? 1500 : 2100;
    const timer = window.setTimeout(() => {
      setScheduleReplyBeatIndex((index) => Math.min(index + 1, activeScheduleBranch.beats.length - 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [activeScheduleBeat, activeScheduleBranch, returnToComputerAfterPhone, scheduleReactionComplete]);

  useEffect(() => {
    if (controllerStepIndex === undefined || controllerJumpNonce === undefined) return;

    const boundedIndex = Math.max(0, Math.min(controllerStepIndex, fragmentOrder.length - 1));
    const targetStep = fragmentOrder[boundedIndex];
    setCompletedFragments(fragmentOrder.slice(0, boundedIndex));
    setActiveFragment(null);
    setActivePhoneStep(null);
    setFragmentLineIndex(0);
    setOpenedComputerImage(null);
    setReturnToComputerAfterPhone(false);
    setScheduleReplyBeatIndex(-1);

    if (isPhoneStep(targetStep)) {
      setChapterIndex(phoneStepIndex(targetStep));
      setPhoneInitialApp("zhouye");
      setPhoneChapterComplete(false);
      setActivePhoneStep(targetStep);
      setPhoneOpen(true);
      return;
    }

    setPhoneOpen(false);
    setPhoneChapterComplete(false);
    setActiveFragment(targetStep);
  }, [controllerJumpNonce, controllerStepIndex]);

  function isPhoneStep(id: StepId): id is PhoneStepId {
    return phoneStepIds.includes(id as PhoneStepId);
  }

  function phoneStepIndex(id: PhoneStepId) {
    return phoneStepIds.indexOf(id);
  }

  function getStepMeta(id: StepId) {
    if (isPhoneStep(id)) {
      const chapter = chatChapters[phoneStepIndex(id)];
      return {
        label: "手机",
        title: `周也发来新的消息：${chapter.title}`
      };
    }
    return memoryFragments[id];
  }

  function isUnlocked(id: StepId) {
    const index = fragmentOrder.indexOf(id);
    return index === 0 || completedFragments.includes(fragmentOrder[index - 1]);
  }

  function completeFragment(id: FragmentId) {
    const fragment = memoryFragments[id];
    setCompletedFragments((current) => (current.includes(id) ? current : [...current, id]));
    markMemorySeen?.(fragment.memoryId);
    setActiveFragment(null);
    setActivePhoneStep(null);
    setFragmentLineIndex(0);
    setPhoneOpen(false);
    setOpenedComputerImage(null);
  }

  function markFragmentComplete(id: FragmentId) {
    const fragment = memoryFragments[id];
    setCompletedFragments((current) => (current.includes(id) ? current : [...current, id]));
    markMemorySeen?.(fragment.memoryId);
  }

  function closeFragment() {
    if (activeFragment === "computer" && fragmentLineIndex >= computerFiles[computerFiles.length - 1].lineIndex) {
      markFragmentComplete("computer");
    }
    setActiveFragment(null);
    setActivePhoneStep(null);
    setFragmentLineIndex(0);
    setPhoneOpen(false);
    setOpenedComputerImage(null);
  }

  function openStep(id: StepId) {
    if (!isUnlocked(id)) return;
    if (isPhoneStep(id)) {
      openPhoneStep(id);
      return;
    }
    openFragment(id);
  }

  function openFragment(id: FragmentId) {
    setActiveFragment(id);
    setActivePhoneStep(null);
    setFragmentLineIndex(0);
  }

  function openPhoneStep(id: PhoneStepId) {
    setActiveFragment(null);
    setActivePhoneStep(id);
    setChapterIndex(phoneStepIndex(id));
    setPhoneInitialApp("zhouye");
    setReturnToComputerAfterPhone(false);
    setPhoneChapterComplete(completedFragments.includes(id));
    setPhoneOpen(true);
  }

  function advanceFragment() {
    if (!currentFragment) return;
    if (fragmentLineIndex < currentFragment.lines.length - 1) {
      setFragmentLineIndex((index) => index + 1);
      return;
    }
    completeFragment(currentFragment.id);
  }

  function advanceChat() {
    if (!phoneChapterComplete || !activePhoneStep) return;
    setCompletedFragments((current) => (current.includes(activePhoneStep) ? current : [...current, activePhoneStep]));
    if (activePhoneStep === "phone3") {
      markMemorySeen?.("phone");
    }
    setPhoneOpen(false);
    setActivePhoneStep(null);
    setPhoneChapterComplete(false);
  }

  function updateActivePhoneRevealCount(count: number) {
    if (!activePhoneStep) return;
    setPhoneRevealCounts((current) => (
      current[activePhoneStep] === count ? current : { ...current, [activePhoneStep]: count }
    ));
  }

  function chooseFailedCalibration(key: string) {
    setFailedCalibration((current) => (current.includes(key) ? current : [...current, key]));
  }

  function finishCalibration() {
    setSecondAskLineIndex(0);
    setPhase("secondAsk");
  }

  function getActiveComputerFile() {
    return [...computerFiles].reverse().find((file) => fragmentLineIndex >= file.lineIndex) ?? computerFiles[0];
  }

  function openComputerFile(file: ComputerFile) {
    if (file.image) {
      setOpenedComputerImage(file);
    } else {
      setOpenedComputerImage(null);
    }
    if (file.name === computerFiles[computerFiles.length - 1].name) {
      markFragmentComplete("computer");
    }
    setFragmentLineIndex(file.lineIndex);
  }

  function openIncomingWechat() {
    setScheduleMessageRead(true);
    setOpenedComputerImage(null);
    setPhoneInitialApp("zhouye");
    setReturnToComputerAfterPhone(true);
    setScheduleReplyBeatIndex(schedulePresenceChoice ? 0 : -1);
    setActiveFragment(null);
    setPhoneOpen(true);
  }

  function closePhone() {
    if (returnToComputerAfterPhone && !scheduleReactionComplete) return;
    setPhoneOpen(false);
    if (returnToComputerAfterPhone) {
      setReturnToComputerAfterPhone(false);
      setActiveFragment("computer");
    }
  }

  function chooseScheduleReply(choice: SchedulePresenceChoice) {
    setSchedulePresenceChoice(choice);
    setScheduleReplyBeatIndex(0);
  }

  function advanceScheduleReaction() {
    if (!activeScheduleBranch) return;
    if (!scheduleReactionComplete) {
      setScheduleReplyBeatIndex((index) => index + 1);
      return;
    }
    setPhoneOpen(false);
    setReturnToComputerAfterPhone(false);
    setActiveFragment("computer");
    setFragmentLineIndex(5);
  }

  return (
    <>
      <section className="room pixelRoom guidedRoom memoryWechatRoom" aria-label="第二阶段：回溯空间里的宿舍">
        <div className="wallGlow" aria-hidden="true" />
        <div className="roomDepth" aria-hidden="true" />
        <div className="bookcase" aria-hidden="true">
          <span className="shelf shelfTop" />
          <span className="shelf shelfMid" />
          <span className="shelf shelfLow" />
        </div>
        <div className="pinboard" aria-hidden="true">
          <span className="pinNote">北京-南京<br />1078 公里</span>
          <span className="pinPhoto">2024 秋</span>
        </div>
        <button className="window item hasSprite" disabled type="button" aria-label="窗外梧桐">
          <img className="itemSprite" src="/assets/story/intro-night-window-wide.png" alt="" draggable={false} />
          <span>梧桐树影</span>
        </button>
        <button className="calendar item hasSprite storyCalendar" disabled type="button" aria-label="2024 年日历">
          <img className="itemSprite" src="/assets/items/calendar.png" alt="" draggable={false} />
        </button>
        <div className="box pixelBox">回溯</div>
        <div className="desk">
          <button className={cx("monitor item hasSprite memoryItem", completedFragments.includes("computer") && "seen", activeFragment === "computer" && "activeMemoryItem", !isUnlocked("computer") && "lockedMemoryItem")} onClick={() => openStep("computer")} type="button" aria-label="打开电脑文件夹以后">
            <img className="itemSprite" src="/assets/items/monitor.png" alt="" draggable={false} />
            <span>电脑</span>
          </button>
          <button className="keyboard item hasSprite" disabled aria-label="键盘" type="button">
            <img className="itemSprite" src="/assets/items/keyboard.png" alt="" draggable={false} />
          </button>
          <button className="mouse item hasSprite" disabled aria-label="鼠标" type="button">
            <img className="itemSprite" src="/assets/items/mouse.png" alt="" draggable={false} />
          </button>
          <button
            className={cx(
              "phone item hasSprite memoryItem guidePhoneItem",
              currentStepId && currentStepIsPhoneAccessible && isUnlocked(currentStepId) && "phoneVibrating",
              phoneStepIds.every((id) => completedFragments.includes(id)) && "seen",
              (activePhoneStep || activeFragment === "voice") && "activeMemoryItem",
              (!currentStepId || !currentStepIsPhoneAccessible || !isUnlocked(currentStepId)) && "lockedMemoryItem"
            )}
            onClick={() => currentStepId && currentStepIsPhoneAccessible && openStep(currentStepId)}
            type="button"
            aria-label="查看周也刚刚发来的微信消息"
          >
            <img className="itemSprite" src="/assets/items/phone.png" alt="" draggable={false} />
            <span>手机</span>
          </button>
          <button className={cx("voiceMemo item memoryItem", completedFragments.includes("voice") && "seen", activeFragment === "voice" && "activeMemoryItem", !isUnlocked("voice") && "lockedMemoryItem")} onClick={() => openStep("voice")} type="button" aria-label="恢复手机语音备忘录">
            <span className="voiceMemoIcon">m4a</span>
            <span>语音备忘录</span>
          </button>
          <button className="lamp item hasSprite" disabled aria-label="台灯" type="button">
            <img className="itemSprite" src="/assets/items/lamp.png" alt="" draggable={false} />
          </button>
          <button className={cx("recycle storyRecycle item memoryItem", completedFragments.includes("recycle") && "seen", activeFragment === "recycle" && "activeMemoryItem", !isUnlocked("recycle") && "lockedMemoryItem")} onClick={() => openStep("recycle")} type="button" aria-label="恢复回收站里的毕业视频">
            <span>回收站</span>
          </button>
        </div>
        <button className="slippers item hasSprite" disabled aria-label="拖鞋" type="button">
          <img className="itemSprite" src="/assets/items/slippers.png" alt="" draggable={false} />
        </button>
        <button className="trash item hasSprite" disabled aria-label="纸篓旁的垃圾桶" type="button">
          <img className="itemSprite" src="/assets/items/trash.png" alt="" draggable={false} />
        </button>

        {!allFragmentsDone && (
          <button className="phoneVibeHint memoryPhoneHint" onClick={() => currentStepId && openStep(currentStepId)} type="button">
            <b>{completedFragments.length + 1}/{fragmentOrder.length}</b>
            <span>{getStepMeta(currentStepId).title}</span>
          </button>
        )}
      </section>

      {currentFragment && activeFragment !== "phone" && currentLine && (
        <div className="wechatMemoryBackdrop fragmentMemoryBackdrop">
          <article className={cx("fragmentMemoryScene", `fragmentMemoryScene-${activeFragment}`)}>
            <button className="wechatPhoneClose" onClick={closeFragment} type="button" aria-label="关闭当前记忆">×</button>
            <div className="fragmentMemoryHeader">
              <small>{currentFragment.subtitle}</small>
              <strong>{currentFragment.title}</strong>
            </div>
            <div className="fragmentMemoryMock">
              {activeFragment === "computer" && (
                <div className="mockComputerOS">
                  <div className="mockComputerDesktop">
                    <button className={cx("osFolderIcon", fragmentLineIndex > 0 && "opened")} onClick={() => setFragmentLineIndex((index) => Math.max(index, 1))} type="button">
                      <i />
                      <span>以后</span>
                    </button>
                    <span className="osDesktopShortcut">回收站</span>
                    <span className="osDesktopShortcut">微信文件</span>
                  </div>
                  <div className={cx("mockExplorerWindow", fragmentLineIndex === 0 && "closed")}>
                    <header className="mockExplorerTitlebar">
                      <div><i /><span>以后</span></div>
                      <b>—</b><b>□</b><b>×</b>
                    </header>
                    <div className="mockExplorerToolbar">
                      <button type="button">‹</button>
                      <button type="button">›</button>
                      <span>桌面 / 以后</span>
                      <em>搜索“以后”</em>
                    </div>
                    <div className="mockExplorerBody">
                      <aside>
                        <b>快速访问</b>
                        <span>桌面</span>
                        <span>图片</span>
                        <span>文档</span>
                        <span className="active">以后</span>
                      </aside>
                      <main>
                        <div className="mockExplorerHead">
                          <span>名称</span>
                          <span>修改日期</span>
                          <span>类型</span>
                        </div>
                        {computerFiles.map((file) => {
                          const activeFile = getActiveComputerFile().name === file.name;
                          return (
                            <button
                              className={cx(activeFile && "active", file.danger && "danger")}
                              onClick={() => openComputerFile(file)}
                              type="button"
                              key={file.name}
                            >
                              <i>{file.type.includes("PDF") ? "PDF" : "IMG"}</i>
                              <span>{file.name}</span>
                              <small>{file.meta}</small>
                              <em>{file.type}</em>
                            </button>
                          );
                        })}
                      </main>
                      <section className={cx("mockFilePreview", getActiveComputerFile().danger && "danger")}>
                        <small>预览窗格</small>
                        <strong>{getActiveComputerFile().previewTitle}</strong>
                        {getActiveComputerFile().image && (
                          <button className="schedulePreviewImage" onClick={() => openComputerFile(getActiveComputerFile())} type="button" aria-label={`打开${getActiveComputerFile().name}`}>
                            <img src={getActiveComputerFile().image} alt="周也的排班表，红框圈出周四和周五休息" draggable={false} />
                            {!scheduleMessageArrived && <span>单击打开</span>}
                          </button>
                        )}
                        {getActiveComputerFile().previewLines.map((line) => <p key={line}>{line}</p>)}
                      </section>
                    </div>
                    <footer>{computerFiles.length} 个项目 · 已选择 1 个项目</footer>
                  </div>
                  {openedComputerImage?.image && (
                    <div className={cx("mockPhotoViewer", openedComputerImage.portrait && "portraitPhotoViewer")}>
                      <header>
                        <span>照片</span>
                        <b>{openedComputerImage.name}</b>
                        <button onClick={() => setOpenedComputerImage(null)} type="button" aria-label={`关闭${openedComputerImage.name}`}>×</button>
                      </header>
                      <div>
                        <img src={openedComputerImage.image} alt={openedComputerImage.previewTitle} draggable={false} />
                      </div>
                      <footer><span>−</span><i>适合窗口</i><span>＋</span></footer>
                    </div>
                  )}
                  <div className="mockTaskbar">
                    <span>开始</span>
                    <i>资源管理器</i>
                    <b>23:47</b>
                  </div>
                </div>
              )}
              {activeFragment === "voice" && (
                <div className="mockVoiceList">
                  <span>南京秋天.m4a<i /></span>
                  <span>没发出去.m4a<i /></span>
                </div>
              )}
              {activeFragment === "recycle" && (
                <div className="mockVideoFile">
                  <b>毕业.mp4</b>
                  <span>已恢复</span>
                  <i />
                </div>
              )}
            </div>
            {activeFragment === "computer" && scheduleMessageArrived && !scheduleMessageRead && (
              <button className="pastWechatArrival" onClick={openIncomingWechat} type="button" aria-label="查看周也刚刚发来的微信消息">
                <span className="pastPhoneStatus"><b>22:18</b><i>5G&nbsp;&nbsp;82%</i></span>
                <span className="pastWechatBanner">
                  <i>微信</i>
                  <b>周也</b>
                  <strong>买了。你别放我鸽子啊。</strong>
                  <small>刚刚</small>
                </span>
                <em>轻触查看</em>
              </button>
            )}
            <button
              className={cx("visualNovelBox introMemoryDialogue fragmentDialogue", !speakerLabel(currentLine.speaker) && "noSpeaker", currentLine.kind === "system" && "systemLine", currentLine.speaker === "我" && "meLine", currentLine.speaker === "周也" && "zhouyeLine")}
              onClick={advanceFragment}
              type="button"
            >
              {speakerLabel(currentLine.speaker) && <span className="speakerName">{speakerLabel(currentLine.speaker)}</span>}
              <p>{currentLine.text}</p>
              <i>{fragmentLineIndex < currentFragment.lines.length - 1 ? "点击继续" : currentFragment.doneText}</i>
            </button>
          </article>
        </div>
      )}

      {phoneOpen && (
        <div className="wechatMemoryBackdrop" onClick={closePhone}>
          <article className={cx("stagePhoneShell phoneFromRoom", returnToComputerAfterPhone && "liveSchedulePhoneShell")} onClick={(event) => event.stopPropagation()}>
            <button className="wechatPhoneClose" disabled={returnToComputerAfterPhone && !scheduleReactionComplete} onClick={closePhone} type="button" aria-label="收起手机">×</button>
            {returnToComputerAfterPhone ? (
              <div className="liveSchedulePhoneColumn">
                <PhoneMemory
                  markSeen={() => undefined}
                  initialApp={phoneInitialApp}
                  compact
                  stageMode
                  liveMessages={scheduleLiveMessages}
                  liveTyping={Boolean(activeScheduleBeat?.typing)}
                />
                {activeScheduleBranch && scheduleReactionComplete && (
                  <button className="schedulePhoneAdvance" onClick={advanceScheduleReaction} type="button">
                    记住这次回应
                  </button>
                )}
              </div>
            ) : (
              <PhoneMemory
                markSeen={() => undefined}
                initialApp={phoneInitialApp}
                compact
                stageMode
                memoryChapter={chapterIndex}
                savedMemoryRevealCount={activePhoneStep ? phoneRevealCounts[activePhoneStep] : 0}
                onMemoryRevealCountChange={updateActivePhoneRevealCount}
                onMemoryChapterCompleteChange={setPhoneChapterComplete}
                memoryChapterCompleted={phoneChapterComplete}
                memoryAdvanceLabel={activePhoneStep === "phone3" ? phoneDoneText : "收起手机，继续查看房间"}
                onMemoryAdvance={advanceChat}
              />
            )}
            {returnToComputerAfterPhone && (
              <aside className="scheduleReplyPanel">
                <header>
                  <small>2027年的我</small>
                  <strong>她来南京这件事，你打算怎么接？</strong>
                </header>
                <>
                  {!activeScheduleBranch && (
                    <>
                    <div className="scheduleFixedFact">
                      <small>不可改写的事实</small>
                      <p>周四导师仍会临时开会。你仍然很忙，也无法保证准时出现。</p>
                    </div>
                    <p>她提前十二天申请轮休。当年你回的是：“好的，我看看时间。”你不能改变这一天的安排，但可以决定怎样让她面对这份不确定。</p>
                    </>
                  )}
                  <div className="scheduleReplyChoices">
                    {scheduleBranches.map((branch) => (
                      <button
                        className={cx(activeScheduleBranch?.key === branch.key && "selected")}
                        disabled={Boolean(activeScheduleBranch)}
                        onClick={() => chooseScheduleReply(branch.key)}
                        type="button"
                        key={branch.key}
                      >
                        <i>{branch.key}</i>
                        <span><b>{branch.mode}</b>{branch.reply}</span>
                      </button>
                    ))}
                  </div>
                </>
              </aside>
            )}
            {!returnToComputerAfterPhone && (
              <>
                <aside className="stagePhoneChapter">
                  <small>{chatChapters[chapterIndex].time}</small>
                  <b>{chatChapters[chapterIndex].title}</b>
                  <p>{chatChapters[chapterIndex].summary}</p>
                </aside>
              </>
            )}
          </article>
        </div>
      )}

      {allFragmentsDone && (
        <div className="wechatMemoryBackdrop calibrationBackdrop">
          <article className="calibrationConfirm">
            <p className="eyebrow">校准确认</p>
            <h2>2026年1月，她提出分开时，你是否真的没有机会挽回？</h2>
            <div className="calibrationChoiceList">
              {calibrationChoices.map((choice) => (
                <button
                  className={cx(failedCalibration.includes(choice.key) && "failedChoice")}
                  disabled={failedCalibration.includes(choice.key)}
                  onClick={() => chooseFailedCalibration(choice.key)}
                  type="button"
                  key={choice.key}
                >
                  <i>{choice.key}</i>
                  <span>{failedCalibration.includes(choice.key) ? choice.fail : choice.text}</span>
                </button>
              ))}
              {showFinalChoice && (
                <button className="finalCalibrationChoice" onClick={finishCalibration} type="button">
                  <i>D</i>
                  <span>有。但我没有说。</span>
                </button>
              )}
            </div>
            {showFinalChoice ? (
              <p>未知说出口是否有用。但你没有说，因此该结果无法被计算。</p>
            ) : (
              <p>系统不会接受借口，只接受被校准后的事实。</p>
            )}
          </article>
        </div>
      )}
    </>
  );
}
