"use client";

import { useState } from "react";
import type { DesktopApp, DesktopGuideBeat, Memory } from "../story/types";
import { cx, speakerLabel } from "../story/utils";

export function DesktopMemory({ memory, markSeen }: { memory: Memory; markSeen: () => void }) {
  const [activeApp, setActiveApp] = useState<DesktopApp>("folder");
  const [desktopStep, setDesktopStep] = useState(0);
  const [desktopInspected, setDesktopInspected] = useState(false);
  const desktopGuide: DesktopGuideBeat[] = [
    {
      app: "folder",
      icon: "🖼",
      title: "她的排班.jpg",
      meta: "周也 休 周四 周五 · 勿改",
      speaker: "",
      text: "文件夹“以后”打开了。第一个亮起来的是她的排班截图。",
      detail: "她提前十二天申请，在备注里写：去南京。票已买。勿改。"
    },
    {
      app: "tickets",
      icon: "🚄",
      title: "南京南→北京南 G6",
      meta: "¥558.5 · 收藏时间 2024 年 12 月",
      speaker: "我",
      text: "那时候我收藏了去北京的票。收藏了很多次，但没有告诉她。",
      detail: "南京南到北京南，四个多小时。你把它放进收藏夹，像把一句话放回喉咙里。"
    },
    {
      app: "tickets",
      icon: "🚄",
      title: "北京南→南京南 G23",
      meta: "¥558.5 · 收藏时间 2024 年 12 月",
      speaker: "",
      text: "下一张票根被翻出来。北京南到南京南，是她回来的方向。",
      detail: "她来了一次，你去了四次。每一次都像在证明你们还够近。"
    },
    {
      app: "notes",
      icon: "🗺",
      title: "北京攻略截图",
      meta: "等她安顿好了，我去找她。",
      speaker: "我",
      text: "我甚至存过攻略。想等她安顿好了，再去找她。",
      detail: "你把先锋书店、颐和路、紫金山也一起存着。好像计划越完整，话就越不用现在说。"
    },
    {
      app: "notes",
      icon: "💬",
      title: "2025年3月聊天记录",
      meta: "她拿到 offer，他说“恭喜”。",
      speaker: "周也",
      text: "你之前不是说考北京吗？",
      detail: "你说：没考上。她问：你一直没跟我说？你说：怕你担心。"
    }
  ];
  const currentDesktopBeat = desktopGuide[desktopStep];
  const desktopDone = desktopStep >= desktopGuide.length - 1 && desktopInspected;

  function openApp(app: DesktopApp) {
    setActiveApp(app);
    markSeen();
  }

  function advanceDesktopGuide() {
    markSeen();
    setActiveApp(currentDesktopBeat.app);
    if (!desktopInspected) {
      setDesktopInspected(true);
      return;
    }
    if (desktopStep < desktopGuide.length - 1) {
      const nextStep = desktopStep + 1;
      setDesktopStep(nextStep);
      setActiveApp(desktopGuide[nextStep].app);
      setDesktopInspected(false);
    }
  }

  return (
    <div className="desktopOS">
      <div className="desktopWallpaper">
        <div className="desktopBrand"><span>Windows</span><small>2027 · 南京宿舍</small></div>
        <div className="desktopApps">
          <button onClick={() => openApp("folder")} type="button"><i className="pixelAppIcon folderPixel">文</i><span>以后</span></button>
          <button disabled={desktopStep < 1} onClick={() => openApp("tickets")} type="button"><i className="pixelAppIcon ticketPixel">G</i><span>高铁票根</span></button>
          <button disabled type="button"><i className="pixelAppIcon recyclePixel">♻</i><span>回收站</span></button>
          <button disabled={desktopStep < 3} onClick={() => openApp("notes")} type="button"><i className="pixelAppIcon notePixel">记</i><span>备忘录</span></button>
        </div>

        <section className={`desktopWindow desktopWindow-${activeApp}`}>
          <header className="desktopWindowBar">
            <span>{activeApp === "folder" ? "以后" : activeApp === "tickets" ? "高铁票根" : activeApp === "recycle" ? "回收站" : "备忘录"}</span>
            <div><button type="button">—</button><button type="button">×</button></div>
          </header>

          {activeApp === "folder" && (
            <div className="fileExplorer">
              <aside>
                <b>快速访问</b>
                <span>桌面</span>
                <span>图片</span>
                <span>文档</span>
                <span>回收站</span>
              </aside>
              <main>
                {desktopGuide.map((beat, index) => (
                  <button
                    className={cx(index < desktopStep && "seenFile", index === desktopStep && "activeFile", index > desktopStep && "lockedFile")}
                    disabled={index !== desktopStep}
                    onClick={advanceDesktopGuide}
                    type="button"
                    key={beat.title}
                  >
                    <i>{beat.icon}</i><b>{beat.title}</b><small>{index > desktopStep ? "等待前一个文件读取完成" : beat.meta}</small>
                  </button>
                ))}
              </main>
            </div>
          )}

          {activeApp === "tickets" && (
            <div className="ticketWall">
              <article className={desktopStep === 1 ? "activeRecord" : ""}><b>南京南 → 北京南</b><span>G6 · ¥558.5</span><small>收藏了，却没说出口。</small></article>
              <article className={desktopStep === 2 ? "activeRecord" : ""}><b>北京南 → 南京南</b><span>G23 · ¥558.5</span><small>她来了一次，他去了四次。</small></article>
              <article className="danger"><b>已退票订单</b><span>2025-11-11 23:47</span><small>她在输液室给我发“多喝热水”的时候，我在退票。</small></article>
            </div>
          )}

          {activeApp === "recycle" && (
            <div className="recycleWindow">
              <i>♻</i>
              <b>毕业.mp4</b>
              <span>这个视频你 2025 年看过一次。她走之后你删了。</span>
              <p>最后三秒，画面暗了，她轻声说：要是有你在北京就好了。</p>
            </div>
          )}

          {activeApp === "notes" && (
            <div className="desktopNotes">
              <p>{currentDesktopBeat.detail}</p>
              <p>{memory.note}</p>
            </div>
          )}
        </section>
        <button className={cx("desktopGuideDialogue", !speakerLabel(desktopDone ? "" : currentDesktopBeat.speaker) && "noSpeaker", currentDesktopBeat.speaker === "我" && "meLine", currentDesktopBeat.speaker === "周也" && "zhouyeLine")} onClick={desktopDone ? undefined : advanceDesktopGuide} type="button">
          {speakerLabel(desktopDone ? "" : currentDesktopBeat.speaker) && <span>{speakerLabel(currentDesktopBeat.speaker)}</span>}
          <p>{desktopDone ? "文件夹里的“以后”已经读完。那些没说出口的话，正在变成下一段记忆。" : desktopInspected ? currentDesktopBeat.detail : currentDesktopBeat.text}</p>
          <i>{desktopDone ? "已完成" : desktopInspected ? desktopStep < desktopGuide.length - 1 ? "点击读取下一个文件" : "文件夹读取完成" : `点击查看：${currentDesktopBeat.title}`}</i>
        </button>
      </div>
    </div>
  );
}


