"use client";

import { useEffect, useRef, useState } from "react";
import { cx, speakerLabel } from "../story/utils";

type Props = Record<string, any>;

const introMusicSrc = "/audio/04-yu-jian.mp3";

export function IntroStage(props: Props) {
  const { introPhotoOpen, introPhotoLineIndex, introPhotoLines, currentIntroPhotoLine, advanceIntroPhotoLine, setVnLineIndex, setResponseLineIndex, setPhase, introPackedCount, introPackItems, introPackedDone, introPackLine, introPackNarrationVisible, packedIntroItems, packIntroItem, activeIntroPackItem, activeIntroMemory, currentIntroMemoryLine, introMemoryLineIndex, advanceIntroMemory, postcardFlipped, setPostcardFlipped, openIntroPhoto } = props;
  const introMusicRef = useRef<HTMLAudioElement>(null);
  const [introMusicPlaying, setIntroMusicPlaying] = useState(false);

  useEffect(() => {
    const audio = introMusicRef.current;
    if (!audio) return;

    audio.volume = 0.36;

    const playIntroMusic = () => {
      audio.play()
        .then(() => setIntroMusicPlaying(true))
        .catch(() => setIntroMusicPlaying(false));
    };

    playIntroMusic();
    window.addEventListener("pointerdown", playIntroMusic, { once: true });

    return () => {
      window.removeEventListener("pointerdown", playIntroMusic);
      audio.pause();
    };
  }, []);

  function toggleIntroMusic() {
    const audio = introMusicRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play()
        .then(() => setIntroMusicPlaying(true))
        .catch(() => setIntroMusicPlaying(false));
      return;
    }

    audio.pause();
    setIntroMusicPlaying(false);
  }

  return (
        <section className={cx("curtain introCurtain", introPhotoOpen && "photoOpen")}>
          <audio ref={introMusicRef} src={introMusicSrc} loop preload="auto" />
          <button className={cx("introMusicToggle", introMusicPlaying && "playing")} onClick={toggleIntroMusic} type="button">
            {introMusicPlaying ? "音乐开" : "音乐关"}
          </button>
          {!introPhotoOpen ? (
            <div className="introPackStage">
              <div className="introRoom" aria-label="2027 年 6 月，研究生宿舍">
                <div className="introWindow" aria-hidden="true"><i /></div>
                <div className="introShelf" aria-hidden="true" />
                <div className="introPinboard" aria-hidden="true">
                  <span>北京—南京<br />1078 公里</span>
                  <i>2024 秋</i>
                </div>
                <div className="introDesk">
                  <button className={cx("packItem spritePack introLaptop", packedIntroItems.includes("laptop") && "packed")} onClick={() => packIntroItem("laptop")} type="button" aria-label="把旧笔记本电脑放进箱子"><img src="/assets/items/monitor.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem introBook one giftBook", packedIntroItems.includes("books") && "packed")} onClick={() => packIntroItem("books")} type="button" aria-label="把她送的书放进箱子"><span className="giftBookCover">以后也要<br />好好的</span><span className="giftBookSpine" /><span className="giftBookPages" /></button>
                  <button className={cx("packItem spritePack introFolder", activeIntroPackItem === "folder" && "drawerOpen", packedIntroItems.includes("folder") && "packed")} onClick={() => packIntroItem("folder")} type="button" aria-label="拉开抽屉，拿出高铁票根">
                    <img src="/assets/items/drawer.png" alt="" draggable={false} />
                    <span className="ticketStubs" aria-hidden="true">
                      <i>南京南</i>
                      <i>北京南</i>
                      <i>G23</i>
                    </span>
                  </button>
                  <button className={cx("packItem spritePack introLamp", packedIntroItems.includes("lamp") && "packed")} onClick={() => packIntroItem("lamp")} type="button" aria-label="把台灯放进箱子"><img src="/assets/items/lamp.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem spritePack introKeyboard", packedIntroItems.includes("keyboard") && "packed")} onClick={() => packIntroItem("keyboard")} type="button" aria-label="把键盘放进箱子"><img src="/assets/items/keyboard.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem introMp3 earbudCase", packedIntroItems.includes("mp3") && "packed")} onClick={() => packIntroItem("mp3")} type="button" aria-label="把蓝牙耳机盒放进箱子"><span className="earbudCaseLid" /><span className="earbud left" /><span className="earbud right" /><span className="earbudCaseLight" /></button>
                  <button className={cx("packItem spritePack introPhone", packedIntroItems.includes("phone") && "packed")} onClick={() => packIntroItem("phone")} type="button" aria-label="把手机放进箱子"><img src="/assets/items/phone.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem spritePack introMouse", packedIntroItems.includes("mouse") && "packed")} onClick={() => packIntroItem("mouse")} type="button" aria-label="把鼠标放进箱子"><img src="/assets/items/mouse.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem introCup", packedIntroItems.includes("cup") && "packed")} onClick={() => packIntroItem("cup")} type="button" aria-label="把空玻璃瓶放进箱子"><span className="glassBottleBody" /><span className="glassBottleNeck" /><span className="glassBottleShine" /></button>
                  <button className={cx("packItem introScarf", packedIntroItems.includes("scarf") && "packed")} onClick={() => packIntroItem("scarf")} type="button" aria-label="把没寄出去的明信片放进箱子"><span className="postcardStamp" /><span className="postcardLines"><i /><i /><i /></span></button>
                </div>
                <button className={cx("packItem spritePack introCalendarLoose", packedIntroItems.includes("calendar") && "packed")} onClick={() => packIntroItem("calendar")} type="button" aria-label="把日历放进箱子"><img src="/assets/items/calendar.png" alt="" draggable={false} /></button>
                <div className={cx("introStorageBox", introPackedCount > 0 && "hasItems", introPackedDone && "full")} aria-label={`已收进 ${introPackedCount} 件物品`} role="status">
                  <span />
                  <b>{introPackedCount}/{introPackItems.length}</b>
                </div>
                {introPackedDone && <button
                  className={cx("introPhoto", introPackedDone && "revealed")}
                  onDoubleClick={openIntroPhoto}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") openIntroPhoto();
                  }}
                  type="button"
                  aria-label="双击照片，全屏放大"
                >
                  <i />
                  <span>2024 夏</span>
                </button>}
              </div>
              {introPackNarrationVisible && (
                <article className="visualNovelBox introDialogue">
                  <p>{introPackedDone ? "研究生宿舍的房间里，箱子已经合上了一半。" : "研究生宿舍的房间里，箱子摊在地上。"}</p>
                  <p>{introPackLine}</p>
                  <span>{introPackedDone ? "双击照片" : "点击物品收拾"}</span>
                </article>
              )}
              {activeIntroMemory && (
                <>
                  {activeIntroPackItem === "calendar" && (
                    <div className="calendarCloseup" aria-hidden="true">
                      <div className="calendarCloseupHeader">
                        <span>2024</span>
                        <strong>6月</strong>
                      </div>
                      <div className="calendarCloseupGrid">
                        {["一", "二", "三", "四", "五", "六", "日", "27", "28", "29", "30", "31", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"].map((day, index) => (
                          <span className={day === "6" ? "circledDay" : index < 7 ? "weekDay" : ""} key={`${day}-${index}`}>{day}</span>
                        ))}
                      </div>
                      <p>今天在一起了。</p>
                    </div>
                  )}
                  {activeIntroPackItem === "scarf" && (
                    <button className={cx("postcardCloseup", postcardFlipped && "flipped")} onClick={() => setPostcardFlipped((flipped: boolean) => !flipped)} type="button" aria-label={postcardFlipped ? "翻到明信片背面" : "翻到明信片正面"}>
                      <span className="postcardFace postcardBackFace">
                        <span className="postcardMiniPicture" />
                        <span className="postcardCloseupStamp" />
                        <span className="postcardHandwriting">北京的秋天怎么样</span>
                        <span className="postcardHandwriting">南京的梧桐，叶子黄的有些旧了</span>
                        <span className="postcardEmptyLine" />
                      </span>
                      <span className="postcardFace postcardFrontFace">
                        <span className="pixelRoad">
                          <i /><i /><i /><i />
                        </span>
                        <span className="pixelPlaneLeft" />
                        <span className="pixelPlaneRight" />
                        <span className="pixelTreeLine left" />
                        <span className="pixelTreeLine right" />
                        <span className="pixelLeafCanopy" />
                        <span className="pixelCar" />
                        <span className="postcardFrontWords">中山陵 梧桐大道</span>
                        <span className="postcardBlurWords">NANJING AUTUMN</span>
                      </span>
                    </button>
                  )}
                  <button className="visualNovelBox introMemoryDialogue" onClick={advanceIntroMemory} type="button">
                    <span className="speakerName">{activeIntroMemory.title}</span>
                    <p>{currentIntroMemoryLine}</p>
                    <i>{introMemoryLineIndex < activeIntroMemory.lines.length - 1 ? "点击继续" : "收进纸箱"}</i>
                  </button>
                </>
              )}
            </div>
          ) : (
            <article className="storyCard introScreen">
              <p className="eyebrow"></p>
              <div className={cx("fullscreenPhoto", introPhotoLineIndex >= 5 && "distorting")} aria-hidden="true">
                <img className="memoryPhotoImage" src="/assets/story/summer-2024-couple-photo.png" alt="" draggable={false} />
                <span className="photoNoise" />
              </div>
              <button className={cx("visualNovelBox photoDialogue", !speakerLabel(currentIntroPhotoLine.speaker) && "noSpeaker", currentIntroPhotoLine.kind === "system" && "systemLine")} onClick={advanceIntroPhotoLine} onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  advanceIntroPhotoLine();
                }
              }} type="button">
                {speakerLabel(currentIntroPhotoLine.speaker) && <span className="speakerName">{speakerLabel(currentIntroPhotoLine.speaker)}</span>}
                <p>{currentIntroPhotoLine.text}</p>
                <i>{introPhotoLineIndex < introPhotoLines.length - 1 ? "点击继续" : "请选择回应"}</i>
              </button>
              {introPhotoLineIndex === introPhotoLines.length - 1 && (
                <div className="introChoiceLayer">
                  <button onClick={() => {
                    setVnLineIndex(0);
                    setResponseLineIndex(0);
                    setPhase("room");
                  }} type="button">逆转未来</button>
                </div>
              )}
            </article>
          )}
        </section>
  );
}



