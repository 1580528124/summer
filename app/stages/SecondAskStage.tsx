"use client";

import { useEffect, useState } from "react";
import { PhoneMemory } from "../components/PhoneMemory";
import type { LiveChatMessage, SchedulePresenceChoice } from "../story/types";
import { cx, speakerLabel } from "../story/utils";

type ScheduleBeat = {
  eyebrow: string;
  text: string;
  chat?: LiveChatMessage;
  typing?: boolean;
};

type ScheduleBranch = {
  key: SchedulePresenceChoice;
  mode: string;
  reply: string;
  echo: string;
  beats: ScheduleBeat[];
};

type Props = Record<string, any> & {
  schedulePresenceChoice: SchedulePresenceChoice | null;
  setSchedulePresenceChoice: (choice: SchedulePresenceChoice) => void;
};

const scheduleBranches: ScheduleBranch[] = [
  {
    key: "A",
    mode: "提前说清楚",
    reply: "我周四晚上可能有点事，导师那边还没定。但我一定想办法出来，结束就跑去接你。你到了先找个室内待着，别坐花坛边上，蚊子多。",
    echo: "这次她等的时候，知道我在哪里。原来区别不是我能不能准时，是她是不是一个人在等。",
    beats: [
      { eyebrow: "三秒", text: "她正在输入，停了大概三秒。", typing: true },
      { eyebrow: "周也", text: "你这次先说清楚了？", chat: { speaker: "zhouye", text: "你这次先说清楚了？" } },
      { eyebrow: "我", text: "嗯。上次让你等了那么久，我后来一直想着那事。", chat: { speaker: "me", text: "嗯。上次让你等了那么久，我后来一直想着那事。" } },
      { eyebrow: "周也", text: "你居然会提上次的事。", chat: { speaker: "zhouye", text: "你居然会提上次的事。" } },
      { eyebrow: "我", text: "我记着的。到了发消息。别坐花坛那边。", chat: { speaker: "me", text: "我记着的。到了发消息。别坐花坛那边。" } },
      { eyebrow: "周也", text: "知道了。你再说一遍蚊子多我就截图了。", chat: { speaker: "zhouye", text: "知道了。你再说一遍蚊子多我就截图了。" } },
      { eyebrow: "我", text: "蚊子多。", chat: { speaker: "me", text: "蚊子多。" } },
      { eyebrow: "周也", text: "截图了。", chat: { speaker: "zhouye", text: "截图了。" } },
      { eyebrow: "周四晚上", text: "导师还在讲。我提前告诉她还要四十分钟。她找了奶茶店，给我留了一杯热的。", chat: { speaker: "system", text: "周四晚上：她没有坐在花坛边。奶茶还是热的。" } },
      { eyebrow: "我", text: "我站在奶茶店门口喘气。她把没动过的那杯推到我面前，说：你今天提前说了。", chat: { speaker: "zhouye", text: "你今天提前说了。我原谅你。奶茶还是热的。" } },
      { eyebrow: "旁白", text: "那天我还是迟到了。但这一次，她知道我在路上。" }
    ]
  },
  {
    key: "B",
    mode: "含糊回应",
    reply: "好。我尽量赶过去。但你到了别一直等着，找个地方先休息。",
    echo: "我还是用了“尽量”。只是这一次，我终于补上了一句：如果到不了，我会提前告诉你。",
    beats: [
      { eyebrow: "很快", text: "她几乎立刻回了。", typing: true },
      { eyebrow: "周也", text: "你又是“尽量”。", chat: { speaker: "zhouye", text: "你又是“尽量”。" } },
      { eyebrow: "我", text: "我真的想去的。", chat: { speaker: "me", text: "我真的想去的。" } },
      { eyebrow: "周也", text: "我知道你想去。但你每次说“尽量”，最后我都是在等。", chat: { speaker: "zhouye", text: "我知道你想去。但你每次说“尽量”，最后我都是在等。" } },
      { eyebrow: "我", text: "那我不说尽量了。我说我肯定到。到不了我就提前告诉你。", chat: { speaker: "me", text: "那我不说尽量了。我说我肯定到。到不了我就提前告诉你。" } },
      { eyebrow: "周也", text: "行吧。信你一次。但你记住，你说的是肯定到。我截图了。", chat: { speaker: "zhouye", text: "行吧。信你一次。但你记住，你说的是肯定到。我截图了。" } },
      { eyebrow: "周四晚上", text: "我还是晚了。可我提前说了两次。她说，进步了。", chat: { speaker: "system", text: "周四晚上：她在奶茶店等我，聊天停在“我肯定到”那句。" } },
      { eyebrow: "周也", text: "你提前说了两次。虽然还是迟到了。但你说到了。就这样吧，挺好的。", chat: { speaker: "zhouye", text: "你提前说了两次。虽然还是迟到了。但你说到了。就这样吧，挺好的。" } },
      { eyebrow: "旁白", text: "“挺好的”比“我原谅你”轻很多。轻到像是她把期待放低了一点。" }
    ]
  },
  {
    key: "C",
    mode: "拖延回避",
    reply: "我周四不一定能走开。到时候再说吧。",
    echo: "我以为“到时候再说”只是把事情放一放。现在才知道，她听见的是：你自己看着办。",
    beats: [
      { eyebrow: "四十秒", text: "她隔了很久才回。", typing: true },
      { eyebrow: "周也", text: "……你上次也这么说。我票都买了。", chat: { speaker: "zhouye", text: "……你上次也这么说。我票都买了。" } },
      { eyebrow: "我", text: "我知道。但我真的不一定能出来。", chat: { speaker: "me", text: "我知道。但我真的不一定能出来。" } },
      { eyebrow: "周也", text: "那你要我怎么办？退票？", chat: { speaker: "zhouye", text: "那你要我怎么办？退票？" } },
      { eyebrow: "我", text: "我没让你退。就是到时候看情况。", chat: { speaker: "me", text: "我没让你退。就是到时候看情况。" } },
      { eyebrow: "周也", text: "行。那我周四到了自己找地方住。你自己看着办。", chat: { speaker: "zhouye", text: "行。那我周四到了自己找地方住。你自己看着办。" } },
      { eyebrow: "周四晚上", text: "她发了“我到了”和民宿定位。我开完会问她在哪。她说，别来了。", chat: { speaker: "system", text: "周四晚上：她去了民宿。手机停在我的“好”上。" } },
      { eyebrow: "旁白", text: "那天上午她走完了一整条颐和路。我走在后面，大概十步。她没等我，我也没追上去。" }
    ]
  },
  {
    key: "D",
    mode: "冷淡回应",
    reply: "嗯。",
    echo: "那是她最后一次主动来南京找我。当时我不知道。",
    beats: [
      { eyebrow: "三分钟", text: "她等了三分钟。", typing: true },
      { eyebrow: "周也", text: "？", chat: { speaker: "zhouye", text: "？" } },
      { eyebrow: "两分钟后", text: "又过了两分钟。", typing: true },
      { eyebrow: "周也", text: "你人呢？", chat: { speaker: "zhouye", text: "你人呢？" } },
      { eyebrow: "我", text: "在。", chat: { speaker: "me", text: "在。" } },
      { eyebrow: "周也", text: "你就回个“嗯”？我提前十二天申请的票，你就回个“嗯”？", chat: { speaker: "zhouye", text: "你就回个“嗯”？我提前十二天申请的票，你就回个“嗯”？" } },
      { eyebrow: "我", text: "我看到了。周四去接你。", chat: { speaker: "me", text: "我看到了。周四去接你。" } },
      { eyebrow: "周也", text: "你最好真的来。", chat: { speaker: "zhouye", text: "你最好真的来。" } },
      { eyebrow: "周四晚上", text: "她到站后发了三次消息。没有回复。坐在花坛边，发了一个定位。", chat: { speaker: "system", text: "周四晚上：20:30，我只回了“快了”。" } },
      { eyebrow: "周也", text: "你今天连“会晚”都没说。", chat: { speaker: "zhouye", text: "你今天连“会晚”都没说。" } },
      { eyebrow: "我", text: "我忘了。", chat: { speaker: "me", text: "我忘了。" } },
      { eyebrow: "周也", text: "你忘了。嗯。走吧。", chat: { speaker: "zhouye", text: "你忘了。嗯。走吧。" } },
      { eyebrow: "旁白", text: "路灯把她影子拉得很长。我跟在后面，那个影子像是她一个人走的路，旁边没有我的位置。" }
    ]
  }
];

export function SecondAskStage(props: Props) {
  const {
    secondAskReady,
    currentSecondAskLine,
    advanceSecondAskLine,
    setVnLineIndex,
    setResponseLineIndex,
    setPhase,
    schedulePresenceChoice,
    setSchedulePresenceChoice
  } = props;
  const [scheduleReplyBeatIndex, setScheduleReplyBeatIndex] = useState(-1);
  const [scheduleDone, setScheduleDone] = useState(Boolean(schedulePresenceChoice));
  const activeScheduleBranch = schedulePresenceChoice
    ? scheduleBranches.find((branch) => branch.key === schedulePresenceChoice) ?? null
    : null;
  const activeScheduleBeat = activeScheduleBranch && scheduleReplyBeatIndex >= 0
    ? activeScheduleBranch.beats[Math.min(scheduleReplyBeatIndex, activeScheduleBranch.beats.length - 1)]
    : null;
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
          text: activeScheduleBranch.echo
        }] : [])
      ]
    : [];

  useEffect(() => {
    if (scheduleDone || !activeScheduleBranch || !activeScheduleBeat || scheduleReactionComplete) return;

    const delay = activeScheduleBeat.typing ? 3000 : activeScheduleBeat.chat ? 1700 : 2200;
    const timer = window.setTimeout(() => {
      setScheduleReplyBeatIndex((index) => Math.min(index + 1, activeScheduleBranch.beats.length - 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [activeScheduleBeat, activeScheduleBranch, scheduleDone, scheduleReactionComplete]);

  function chooseScheduleReply(choice: SchedulePresenceChoice) {
    setSchedulePresenceChoice(choice);
    setScheduleReplyBeatIndex(0);
  }

  function enterNodeMemories() {
    setVnLineIndex(0);
    setResponseLineIndex(0);
    setPhase("nodes");
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
                进入下一个时间点
              </button>
            )}
          </div>
          <aside className="scheduleReplyPanel">
            <header>
              <small>第三阶段 · 节点零 · 2025年8月12日 22:18</small>
              <strong>她来南京这件事，我这次要怎么接？</strong>
            </header>
            {!activeScheduleBranch ? (
              <>
                <div className="scheduleFixedFact">
                  <small>客观事实不会改变</small>
                  <p>周四晚上导师仍然会临时开会。我仍然会迟到。但我可以选择，这次不要让她一个人猜。</p>
                </div>
                <p>她提前十二天申请轮休，刚把排班截图发来。那句“你别放我鸽子啊”不是玩笑，是她把期待递到我手里。</p>
              </>
            ) : (
              <div className="scheduleReactionBeat">
                <small>{activeScheduleBeat?.eyebrow ?? activeScheduleBranch.mode}</small>
                <p>{activeScheduleBeat?.text ?? activeScheduleBranch.echo}</p>
              </div>
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
          <span>2025 她来南京</span>
          <span>2024 操场看台</span>
          <span>2024 梧桐路</span>
          <span>2025 南京南站</span>
        </div>
        {secondAskReady && (
          <div className="vnChoiceLayer secondAskChoice">
            <button onClick={enterNodeMemories} type="button">
              <i>A</i>
              <span>继续回到下一个时间点</span>
            </button>
          </div>
        )}
        <button
          className={cx(
            "vnDialogueBox secondAskDialogue",
            !speakerLabel(currentSecondAskLine.speaker) && "noSpeaker",
            currentSecondAskLine.kind === "system" && "systemLine",
            currentSecondAskLine.speaker === "我" && "meLine"
          )}
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
