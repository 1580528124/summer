"use client";

import { useState } from "react";
import { cx } from "../story/utils";

type ChatLine = {
  speaker: "周也" | "我" | "系统";
  text: string;
  meta?: string;
};

type ChatChapter = {
  time: string;
  title: string;
  summary: string;
  lines: ChatLine[];
  after: string;
};

type Props = Record<string, any> & {
  setSecondAskLineIndex: (index: number) => void;
  setPhase: (phase: "secondAsk") => void;
};

const chatChapters: ChatChapter[] = [
  {
    time: "2024 夏天 - 秋天",
    title: "刚在一起的时候",
    summary: "他们还会认真讨论以后，只是主角总把答案推迟。",
    lines: [
      { speaker: "周也", text: "[图片：南京晚霞] 南京的晚霞有梧桐树衬着。北京的可能有高楼大厦吧。" },
      { speaker: "周也", text: "我们以后怎么办啊" },
      { speaker: "我", text: "再说吧" },
      { speaker: "周也", text: "又是“再说”" },
      { speaker: "我", text: "到时候肯定有办法的" },
      { speaker: "周也", text: "嗯。听你的" },
      { speaker: "系统", text: "第一次校准：她不是没有问过。你只是把答案放到了以后。", meta: "memory calibration 01" }
    ],
    after: "“以后”第一次出现。那时它还像一句承诺。"
  },
  {
    time: "2025 三月 - 六月",
    title: "北京 offer 和南京本校",
    summary: "异地不是突然开始的，是从没有提前说出口的决定开始的。",
    lines: [
      { speaker: "周也", text: "[图片：offer截图] 我拿到了！！！" },
      { speaker: "我", text: "太好了" },
      { speaker: "周也", text: "你那个呢？" },
      { speaker: "我", text: "本校" },
      { speaker: "周也", text: "你之前不是说考北京吗" },
      { speaker: "我", text: "没考上" },
      { speaker: "周也", text: "你一直没跟我说？" },
      { speaker: "我", text: "怕你担心" },
      { speaker: "周也", text: "……没事。南京也挺好的。我回来看你。" },
      { speaker: "系统", text: "第二次校准：你以为沉默是在保护她。她听见的是，重要的事你没有让她一起知道。", meta: "memory calibration 02" }
    ],
    after: "他们开始站在两个城市里。她先说了“我回来看你”。"
  },
  {
    time: "2025 七月 - 九月",
    title: "轮休、车票和花坛",
    summary: "异地生活不是一句想你，是排班、请假、车票、等待和十分钟。",
    lines: [
      { speaker: "周也", text: "[图片：钉钉排班] 下周休周四周五！我周四晚上到南京。你别放我鸽子啊" },
      { speaker: "我", text: "不会" },
      { speaker: "周也", text: "上车了。你到南京南了吗？" },
      { speaker: "我", text: "实验室还没走，导师临时开会" },
      { speaker: "周也", text: "……你上次也是“临时”" },
      { speaker: "周也", text: "[图片：花坛] 我到了" },
      { speaker: "我", text: "还在开会" },
      { speaker: "周也", text: "南京蚊子真多。咬了五个包了" },
      { speaker: "我", text: "你别坐那儿" },
      { speaker: "周也", text: "我哪儿也不想去。就想等你来了看见你" },
      { speaker: "系统", text: "补充记忆：她提前十二天申请休假，在备注里写“去南京。票已买。勿改。”", meta: "computer / schedule" },
      { speaker: "系统", text: "补充记忆：后来你也去过北京。从下午四点半等到晚上九点多，只在便利店门口坐了十分钟。", meta: "note / beijing" }
    ],
    after: "他们都努力过。只是每一次努力，都被时间切得很短。"
  },
  {
    time: "2025 十月 - 2026 一月",
    title: "话越来越短",
    summary: "爱没有消失，但聊天框里能留下的东西越来越少。",
    lines: [
      { speaker: "周也", text: "[图片：输液室天花板] 发烧了" },
      { speaker: "我", text: "多喝热水" },
      { speaker: "系统", text: "隐藏记忆：那天你买了北京南到南京南的票。23:47，你把票退了。", meta: "computer / refund" },
      { speaker: "周也", text: "[图片：北京街角“南京大牌档”] 今天路过这个" },
      { speaker: "我", text: "进去了吗" },
      { speaker: "周也", text: "没有。一个人没意思" },
      { speaker: "周也", text: "我今天不想装了。你别打过来。" },
      { speaker: "系统", text: "未发送录音：北京也好冷。但北京没有梧桐树。算了。不说了。我好累啊。", meta: "mp3 / draft" },
      { speaker: "周也", text: "我们最近话越来越少了。", meta: "通话记录 4分32秒" },
      { speaker: "我", text: "嗯。" },
      { speaker: "周也", text: "你总是“嗯”。" },
      { speaker: "我", text: "我不知道说什么。" },
      { speaker: "周也", text: "要不……我们先分开吧。" },
      { speaker: "我", text: "好。" },
      { speaker: "系统", text: "最终校准：整个通话里，你没有说过一句“我不想分开”。", meta: "memory calibration complete" }
    ],
    after: "到最后，她不是不爱了。她只是太累了，累到不想再猜你在想什么。"
  }
];

export function MemoryCalibrationStage({ setSecondAskLineIndex, setPhase }: Props) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const chapter = chatChapters[chapterIndex];
  const visibleLines = chapter.lines.slice(0, lineIndex + 1);
  const chapterDone = lineIndex >= chapter.lines.length - 1;
  const allDone = chapterIndex >= chatChapters.length - 1 && chapterDone;

  function advanceChat() {
    if (!chapterDone) {
      setLineIndex((index) => index + 1);
      return;
    }

    if (chapterIndex < chatChapters.length - 1) {
      setChapterIndex((index) => index + 1);
      setLineIndex(0);
      return;
    }

    setSecondAskLineIndex(0);
    setPhase("secondAsk");
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
          <span className="pinNote">北京—南京<br />1078 公里</span>
          <span className="pinPhoto">2024 秋</span>
        </div>
        <button className="window item hasSprite" disabled type="button" aria-label="窗外梧桐">
          <img className="itemSprite" src="/assets/items/window-night.png" alt="" draggable={false} />
          <span>梧桐树影</span>
        </button>
        <button className="calendar item hasSprite storyCalendar" disabled type="button" aria-label="2024 年日历">
          <img className="itemSprite" src="/assets/items/calendar.png" alt="" draggable={false} />
        </button>
        <div className="box pixelBox">回溯</div>
        <div className="desk">
          <button className="monitor item hasSprite memoryItem seen" disabled type="button" aria-label="旧笔记本电脑">
            <img className="itemSprite" src="/assets/items/monitor.png" alt="" draggable={false} />
            <span>电脑</span>
          </button>
          <button className="keyboard item hasSprite" disabled aria-label="键盘" type="button">
            <img className="itemSprite" src="/assets/items/keyboard.png" alt="" draggable={false} />
          </button>
          <button className="mouse item hasSprite" disabled aria-label="鼠标" type="button">
            <img className="itemSprite" src="/assets/items/mouse.png" alt="" draggable={false} />
          </button>
          <button className="phone item hasSprite memoryItem guidePhoneItem phoneVibrating" onClick={() => setPhoneOpen(true)} type="button" aria-label="打开手机微信聊天记录">
            <img className="itemSprite" src="/assets/items/phone.png" alt="" draggable={false} />
            <span>手机</span>
          </button>
          <button className="mp3 item memoryItem earbudCase seen" disabled type="button" aria-label="旧 MP3">
            <span className="earbudCaseLid" />
            <span className="earbud left" />
            <span className="earbud right" />
            <span className="earbudCaseLight" />
            <span>MP3</span>
          </button>
          <button className="lamp item hasSprite" disabled aria-label="台灯" type="button">
            <img className="itemSprite" src="/assets/items/lamp.png" alt="" draggable={false} />
          </button>
          <button className="recycle storyRecycle item memoryItem seen" disabled type="button" aria-label="回收站">
            <span>回收站</span>
          </button>
        </div>
        <button className="slippers item hasSprite" disabled aria-label="拖鞋" type="button">
          <img className="itemSprite" src="/assets/items/slippers.png" alt="" draggable={false} />
        </button>
        <button className="trash item hasSprite" disabled aria-label="纸箱旁的垃圾桶" type="button">
          <img className="itemSprite" src="/assets/items/trash.png" alt="" draggable={false} />
        </button>

        <button className="phoneVibeHint memoryPhoneHint" onClick={() => setPhoneOpen(true)} type="button">
          <b>嗡——</b>
          <span>微信记录正在恢复</span>
        </button>
      </section>

      <section className="wechatMemoryProgress roomMemoryProgress" aria-label="聊天章节">
        {chatChapters.map((item, index) => (
          <button
            className={cx(index < chapterIndex && "done", index === chapterIndex && "active")}
            disabled={index > chapterIndex}
            onClick={() => {
              setChapterIndex(index);
              setLineIndex(index < chapterIndex ? chatChapters[index].lines.length - 1 : 0);
              setPhoneOpen(true);
            }}
            type="button"
            key={item.title}
          >
            <small>{item.time}</small>
            <span>{item.title}</span>
          </button>
        ))}
      </section>

      {phoneOpen && (
        <div className="wechatMemoryBackdrop" onClick={() => setPhoneOpen(false)}>
          <article className="wechatMemoryPhone phoneFromRoom" onClick={(event) => event.stopPropagation()}>
            <button className="wechatPhoneClose" onClick={() => setPhoneOpen(false)} type="button" aria-label="收起手机">×</button>
            <header className="wechatMemoryTop">
              <span>23:47</span>
              <strong>周也</strong>
              <span>{chapterIndex + 1}/{chatChapters.length}</span>
            </header>

            <div className="wechatChapterHeader">
              <small>{chapter.time}</small>
              <b>{chapter.title}</b>
              <p>{chapter.summary}</p>
            </div>

            <div className="wechatMemoryMessages">
              {visibleLines.map((line, index) => (
                <div className={cx("wechatBubble", line.speaker === "我" && "mine", line.speaker === "系统" && "system")} key={`${line.text}-${index}`}>
                  {line.meta && <em>{line.meta}</em>}
                  <p>{line.text}</p>
                </div>
              ))}
            </div>

            {chapterDone && (
              <div className="wechatChapterAfter">
                {chapter.after}
              </div>
            )}

            <button className="wechatAdvance" onClick={advanceChat} type="button">
              {!chapterDone ? "继续查看聊天" : allDone ? "记忆校准完成" : "读取下一段聊天"}
            </button>
          </article>
        </div>
      )}
    </>
  );
}
