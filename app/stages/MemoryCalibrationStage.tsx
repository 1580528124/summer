"use client";

import { useState } from "react";
import { PhoneMemory } from "../components/PhoneMemory";
import { cx } from "../story/utils";

type ChatChapter = {
  time: string;
  title: string;
  summary: string;
};

type Props = Record<string, any> & {
  setSecondAskLineIndex: (index: number) => void;
  setPhase: (phase: "secondAsk") => void;
};

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
    time: "2025 七月 - 九月",
    title: "轮休、车票和花坛",
    summary: "她提前请假，坐车回来，在花坛边等你。"
  },
  {
    time: "2025 十月 - 2026 一月",
    title: "话越来越短",
    summary: "爱没有消失，但聊天框里能留下的东西越来越少。"
  }
];

export function MemoryCalibrationStage({ setSecondAskLineIndex, setPhase }: Props) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const allDone = chapterIndex >= chatChapters.length - 1;

  function advanceChat() {
    if (!allDone) {
      setChapterIndex((index) => index + 1);
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
        <button className="trash item hasSprite" disabled aria-label="纸篓旁的垃圾桶" type="button">
          <img className="itemSprite" src="/assets/items/trash.png" alt="" draggable={false} />
        </button>

        <button className="phoneVibeHint memoryPhoneHint" onClick={() => setPhoneOpen(true)} type="button">
          <b>嗡--</b>
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
          <article className="stagePhoneShell phoneFromRoom" onClick={(event) => event.stopPropagation()}>
            <button className="wechatPhoneClose" onClick={() => setPhoneOpen(false)} type="button" aria-label="收起手机">×</button>
            <PhoneMemory markSeen={() => undefined} initialApp="zhouye" compact stageMode />
            <aside className="stagePhoneChapter">
              <small>{chatChapters[chapterIndex].time}</small>
              <b>{chatChapters[chapterIndex].title}</b>
              <p>{chatChapters[chapterIndex].summary}</p>
            </aside>
            <button className="wechatAdvance stagePhoneAdvance" onClick={advanceChat} type="button">
              {allDone ? "记忆校准完成" : "读取下一段聊天"}
            </button>
          </article>
        </div>
      )}
    </>
  );
}
