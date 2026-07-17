"use client";

import { useEffect, useState } from "react";
import { PhoneMemory } from "../components/PhoneMemory";
import type { LiveChatMessage, SchedulePresenceChoice } from "../story/types";
import { cx, speakerLabel } from "../story/utils";

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

type Props = Record<string, any> & {
  schedulePresenceChoice: SchedulePresenceChoice | null;
  setSchedulePresenceChoice: (choice: SchedulePresenceChoice) => void;
};

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

export function SecondAskStage(props: Props) {
  const { secondAskReady, currentSecondAskLine, advanceSecondAskLine, setVnLineIndex, setResponseLineIndex, setPhase, schedulePresenceChoice, setSchedulePresenceChoice } = props;
  const [scheduleReplyBeatIndex, setScheduleReplyBeatIndex] = useState(-1);
  const [scheduleDone, setScheduleDone] = useState(Boolean(schedulePresenceChoice));
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
    if (scheduleDone || !activeScheduleBranch || !activeScheduleBeat || scheduleReactionComplete) return;

    const delay = activeScheduleBeat.typing ? 3000 : activeScheduleBeat.chat ? 1500 : 2100;
    const timer = window.setTimeout(() => {
      setScheduleReplyBeatIndex((index) => Math.min(index + 1, activeScheduleBranch.beats.length - 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [activeScheduleBeat, activeScheduleBranch, scheduleDone, scheduleReactionComplete]);

  function chooseScheduleReply(choice: SchedulePresenceChoice) {
    setSchedulePresenceChoice(choice);
    setScheduleReplyBeatIndex(0);
  }

  if (!scheduleDone) {
    return (
      <section className="secondAskStage">
        <article className="liveSchedulePhoneShell thirdStageScheduleShell">
          <div className="liveSchedulePhoneColumn">
            <PhoneMemory
              markSeen={() => undefined}
              initialApp="zhouye"
              compact
              stageMode
              liveMessages={scheduleLiveMessages}
              liveTyping={Boolean(activeScheduleBeat?.typing)}
            />
            {activeScheduleBranch && scheduleReactionComplete && (
              <button className="schedulePhoneAdvance" onClick={() => setScheduleDone(true)} type="button">
                进入记忆确认
              </button>
            )}
          </div>
          <aside className="scheduleReplyPanel">
            <header>
              <small>第三阶段 · 2025年8月12日 22:18</small>
              <strong>她来南京这件事，你打算怎么接？</strong>
            </header>
            {!activeScheduleBranch && (
              <>
                <div className="scheduleFixedFact">
                  <small>不可改写的事实</small>
                  <p>周四导师仍会临时开会。你仍然很忙，也无法保证准时出现。</p>
                </div>
                <p>这不是第二阶段的旧记录了。系统把你放回她买票之后的那一刻：她提前十二天申请轮休，现在正在等你回消息。</p>
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
          </aside>
        </article>
      </section>
    );
  }

  return (
        <section className="secondAskStage">
          <article className="secondAskScene">
            <div className="secondAskNoise" />
            <div className="secondAskMemoryStrip">
              <span>2024 南京夏天</span>
              <span>2025 毕业.mp4</span>
              <span>北京 南京大牌档</span>
              <span>2026 分手电话</span>
            </div>
            {secondAskReady && (
              <div className="vnChoiceLayer secondAskChoice">
                <button onClick={() => {
                  setVnLineIndex(0);
                  setResponseLineIndex(0);
                  setPhase("nodes");
                }} type="button">
                  <i>A</i>
                  <span>是。正式启动。</span>
                </button>
              </div>
            )}
            <button
              className={cx("vnDialogueBox secondAskDialogue", !speakerLabel(currentSecondAskLine.speaker) && "noSpeaker", currentSecondAskLine.kind === "system" && "systemLine", currentSecondAskLine.speaker === "我" && "meLine")}
              onClick={() => {
                if (!secondAskReady) advanceSecondAskLine();
              }}
              type="button"
            >
              {speakerLabel(currentSecondAskLine.speaker) && <span className="speakerName">{speakerLabel(currentSecondAskLine.speaker)}</span>}
              <p>{currentSecondAskLine.text}</p>
              <i>{secondAskReady ? "请选择回应" : "点击继续"}</i>
            </button>
          </article>
        </section>
  );
}
