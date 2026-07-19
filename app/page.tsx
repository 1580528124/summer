"use client";

import { useEffect, useRef, useState } from "react";
import { MemoryModal } from "./stages/MemoryModal";
import { EndingStage } from "./stages/EndingStage";
import { FarewellStage } from "./stages/FarewellStage";
import { IntroStage } from "./stages/IntroStage";
import { MemoryCalibrationStage } from "./stages/MemoryCalibrationStage";
import { NodesStage } from "./stages/NodesStage";
import { SecondAskStage } from "./stages/SecondAskStage";
import { SystemRevealStage } from "./stages/SystemRevealStage";
import { guidedBeats, introMemories, memories, nodes } from "./story/data";
import type { ChoiceKey, IntroPackItem, Memory, MemoryId, NodeId, Phase, SchedulePresenceChoice, StoryChoice, VnLine } from "./story/types";
import { cx, getTransitionText, parseVnLine } from "./story/utils";

const memoryCalibrationSteps = [
  "2-1 电脑",
  "2-2 消息：2024",
  "2-3 语音",
  "2-4 消息：offer",
  "2-5 回收站",
  "2-6 消息：7-12月",
  "2-7 消息：通话"
];

const thirdStageSteps = [
  "3-0 她来南京",
  "3-1 操场看台",
  "3-2 梧桐路",
  "3-3 南京南站"
];
const thirdStageMusicSrc = "/audio/10-xiao-xing-yun.flac";

export default function Home() {
  const thirdStageMusicRef = useRef<HTMLAudioElement>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [introPhotoOpen, setIntroPhotoOpen] = useState(false);
  const [introPackNarrationVisible, setIntroPackNarrationVisible] = useState(true);
  const [introPhotoLineIndex, setIntroPhotoLineIndex] = useState(0);
  const [packedIntroItems, setPackedIntroItems] = useState<IntroPackItem[]>([]);
  const [activeIntroPackItem, setActiveIntroPackItem] = useState<IntroPackItem | null>(null);
  const [introMemoryLineIndex, setIntroMemoryLineIndex] = useState(0);
  const [postcardFlipped, setPostcardFlipped] = useState(false);
  const [openedMemory, setOpenedMemory] = useState<Memory | null>(null);
  const [seenMemories, setSeenMemories] = useState<MemoryId[]>([]);
  const [nodeIndex, setNodeIndex] = useState(0);
  const [nodeChoices, setNodeChoices] = useState<Partial<Record<NodeId, ChoiceKey>>>({});
  const [activeChoice, setActiveChoice] = useState<StoryChoice | null>(null);
  const [vnLineIndex, setVnLineIndex] = useState(0);
  const [responseLineIndex, setResponseLineIndex] = useState(0);
  const [secondAskLineIndex, setSecondAskLineIndex] = useState(0);
  const [guidePhoneOpen, setGuidePhoneOpen] = useState(false);
  const [guidePhoneView, setGuidePhoneView] = useState<"home" | "wechatList" | "chat">("home");
  const [farewellChoice, setFarewellChoice] = useState<string | null>(null);
  const [schedulePresenceChoice, setSchedulePresenceChoice] = useState<SchedulePresenceChoice | null>(null);
  const [memoryControllerJump, setMemoryControllerJump] = useState({ index: 0, nonce: 0 });
  const [thirdStageMusicPlaying, setThirdStageMusicPlaying] = useState(false);

  const currentNode = nodes[nodeIndex];
  const isThirdStagePhase = phase === "secondAsk" || phase === "nodes";
  const planeChoice = nodeChoices.plane ?? "D";
  const guidedBeat = guidedBeats[seenMemories.length];
  const nodeIntroLines: VnLine[] = [
    { speaker: "", text: currentNode.scene, kind: "narration" },
    ...currentNode.prompt.map(parseVnLine),
    ...(currentNode.system ? [{ speaker: "", text: currentNode.system, kind: "system" as const }] : [])
  ];
  const currentVnLine = nodeIntroLines[Math.min(vnLineIndex, nodeIntroLines.length - 1)];
  const choicesReady = vnLineIndex >= nodeIntroLines.length - 1;
  const responseLines: VnLine[] = activeChoice
    ? [
        { speaker: "我", text: activeChoice.text, kind: "dialogue" },
        ...activeChoice.response.map(parseVnLine),
        ...currentNode.closing.map((line) => ({ speaker: "", text: line, kind: "narration" as const })),
        { speaker: "", text: getTransitionText(currentNode.id), kind: "system" }
      ]
    : [];
  const currentResponseLine = responseLines[Math.min(responseLineIndex, Math.max(responseLines.length - 1, 0))];
  const secondAskLines: VnLine[] = [
    { speaker: "我", text: "我把聊天记录关掉了。", kind: "narration" },
    { speaker: "我", text: "从头看到尾，我发现一件事。", kind: "narration" },
    { speaker: "我", text: "每一次她靠近的时候，我都在往后退。", kind: "narration" },
    { speaker: "我", text: "不是故意的。", kind: "narration" },
    { speaker: "我", text: "是我以为退一步，是为了以后能更好地进一步。", kind: "narration" },
    { speaker: "我", text: "但退着退着，就没有以后了。", kind: "narration" },
    { speaker: "我", text: "她从头到尾都在说。我从头到尾都在退。", kind: "narration" },
    { speaker: "我", text: "到最后退无可退了。", kind: "narration" },
    { speaker: "我", text: "好。", kind: "dialogue" },
    { speaker: "我", text: "那时候我以为这是尊重她的决定。现在才知道，那是我又往后退了一步。", kind: "narration" },
    { speaker: "", text: "客观事实不会改变。你们仍然会走到分开。但你可以重新说话。", kind: "system" }
  ];
  const currentSecondAskLine = secondAskLines[Math.min(secondAskLineIndex, secondAskLines.length - 1)];
  const secondAskReady = secondAskLineIndex >= secondAskLines.length - 1;
  const introPackItems: IntroPackItem[] = ["laptop", "books", "folder", "calendar", "lamp", "keyboard", "mp3", "phone", "mouse", "cup", "scarf"];
  const introPackedCount = packedIntroItems.length;
  const introPackedDone = introPackedCount === introPackItems.length;
  const introPhotoLines: VnLine[] = [
    { speaker: "我", text: "现在2027年6月了。我也毕业了。", kind: "narration" },
    { speaker: "我", text: "我在这间宿舍住了两年。现在要搬走了。", kind: "narration" },
    { speaker: "我", text: "南京的夏天很热，她的头发黏在脸上，但笑得很好看。", kind: "narration" },
    { speaker: "我", text: "她的那半张脸有点脏了。我拿袖子擦了擦，擦不掉。", kind: "narration" },
    { speaker: "我", text: "我坐在电脑前面，看了很久。", kind: "narration" },
    { speaker: "我", text: "然后屏幕花了。", kind: "narration" },
    { speaker: "", text: "电脑屏幕出现波纹。照片变成模糊的噪点。", kind: "system" },
    { speaker: "", text: "慢慢清晰——但背景变了。", kind: "system" },
    { speaker: "", text: "你现在看到的是 2024 年。你还要回去吗？", kind: "system" }
  ];
  const currentIntroPhotoLine = introPhotoLines[Math.min(introPhotoLineIndex, introPhotoLines.length - 1)];
  const activeIntroMemory = activeIntroPackItem ? introMemories[activeIntroPackItem] : null;
  const currentIntroMemoryLine = activeIntroMemory?.lines[Math.min(introMemoryLineIndex, activeIntroMemory.lines.length - 1)];
  const introPackLine = introPackedDone
    ? "东西都收进去了。桌上只剩下那张照片。"
    : "旧书、文件夹和零碎的小东西还散在房间里。先把它们收进箱子。";

  useEffect(() => {
    const audio = thirdStageMusicRef.current;
    if (!audio) return;

    audio.volume = 0.3;

    if (!isThirdStagePhase) {
      audio.pause();
      setThirdStageMusicPlaying(false);
      return;
    }

    const playThirdStageMusic = () => {
      audio.play()
        .then(() => setThirdStageMusicPlaying(true))
        .catch(() => setThirdStageMusicPlaying(false));
    };

    playThirdStageMusic();
    window.addEventListener("pointerdown", playThirdStageMusic, { once: true });

    return () => {
      window.removeEventListener("pointerdown", playThirdStageMusic);
    };
  }, [isThirdStagePhase]);

  useEffect(() => {
    if (phase !== "intro" || introPhotoOpen) return;

    setIntroPackNarrationVisible(true);
    const timer = window.setTimeout(() => {
      setIntroPackNarrationVisible(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [introPhotoOpen, phase]);

  function openMemory(memory: Memory) {
    setOpenedMemory(memory);
    setSeenMemories((current) => (current.includes(memory.id) ? current : [...current, memory.id]));
  }

  function toggleThirdStageMusic() {
    const audio = thirdStageMusicRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play()
        .then(() => setThirdStageMusicPlaying(true))
        .catch(() => setThirdStageMusicPlaying(false));
      return;
    }

    audio.pause();
    setThirdStageMusicPlaying(false);
  }

  function markMemorySeen(id: MemoryId) {
    setSeenMemories((current) => (current.includes(id) ? current : [...current, id]));
  }

  function openGuidedBeat() {
    if (!guidedBeat) return;
    const memory = memories.find((item) => item.id === guidedBeat.memoryId);
    if (memory) {
      setGuidePhoneOpen(false);
      openMemory(memory);
    }
  }

  function openGuidePhone() {
    setGuidePhoneView("home");
    setGuidePhoneOpen(true);
  }

  function getGuidedOptionText(beat: typeof guidedBeats[number]) {
    if (beat.memoryId === "phone") return "查看旧手机里的聊天记录";
    return beat.cta;
  }

  function chooseNode(choice: StoryChoice) {
    setActiveChoice(choice);
    setResponseLineIndex(0);
    setNodeChoices((current) => ({ ...current, [currentNode.id]: choice.key }));
  }

  function continueNode() {
    setActiveChoice(null);
    setVnLineIndex(0);
    setResponseLineIndex(0);
    if (nodeIndex < nodes.length - 1) {
      setNodeIndex((index) => index + 1);
      return;
    }
    setPhase("system");
  }

  function packIntroItem(item: IntroPackItem) {
    if (packedIntroItems.includes(item)) return;
    setActiveIntroPackItem(item);
    setIntroMemoryLineIndex(0);
    setPostcardFlipped(false);
    setIntroPackNarrationVisible(false);
  }

  function advanceIntroMemory() {
    if (!activeIntroPackItem || !activeIntroMemory) return;
    if (introMemoryLineIndex < activeIntroMemory.lines.length - 1) {
      setIntroMemoryLineIndex((index) => index + 1);
      return;
    }
    const item = activeIntroPackItem;
    setPackedIntroItems((current) => (current.includes(item) ? current : [...current, item]));
    setActiveIntroPackItem(null);
    setIntroMemoryLineIndex(0);
    setPostcardFlipped(false);
  }

  function openIntroPhoto() {
    setIntroPhotoLineIndex(0);
    setIntroPhotoOpen(true);
  }

  function advanceIntroPhotoLine() {
    setIntroPhotoLineIndex((index) => Math.min(index + 1, introPhotoLines.length - 1));
  }

  function resetStory() {
    setPhase("intro");
    setIntroPhotoOpen(false);
    setIntroPhotoLineIndex(0);
    setPackedIntroItems([]);
    setActiveIntroPackItem(null);
    setIntroMemoryLineIndex(0);
    setPostcardFlipped(false);
    setOpenedMemory(null);
    setSeenMemories([]);
    setNodeIndex(0);
    setNodeChoices({});
    setActiveChoice(null);
    setVnLineIndex(0);
    setResponseLineIndex(0);
    setSecondAskLineIndex(0);
    setGuidePhoneOpen(false);
    setGuidePhoneView("home");
    setFarewellChoice(null);
    setSchedulePresenceChoice(null);
    setMemoryControllerJump({ index: 0, nonce: 0 });
  }

  function advanceVnLine() {
    setVnLineIndex((index) => Math.min(index + 1, nodeIntroLines.length - 1));
  }

  function advanceResponseLine() {
    if (responseLineIndex < responseLines.length - 1) {
      setResponseLineIndex((index) => index + 1);
      return;
    }
    continueNode();
  }

  function advanceSecondAskLine() {
    setSecondAskLineIndex((index) => Math.min(index + 1, secondAskLines.length - 1));
  }

  function jumpToIntroStage() {
    setPhase("intro");
    setIntroPhotoOpen(false);
    setOpenedMemory(null);
    setGuidePhoneOpen(false);
    setGuidePhoneView("home");
  }

  function jumpToMemoryCalibrationStage() {
    setPhase("room");
    setOpenedMemory(null);
    setSeenMemories([]);
    setGuidePhoneOpen(false);
    setGuidePhoneView("home");
    setSecondAskLineIndex(0);
    setMemoryControllerJump((current) => ({ index: 0, nonce: current.nonce + 1 }));
  }

  function jumpToMemoryCalibrationStep(index: number) {
    setPhase("room");
    setOpenedMemory(null);
    setGuidePhoneOpen(false);
    setGuidePhoneView("home");
    setSecondAskLineIndex(0);
    setMemoryControllerJump((current) => ({ index, nonce: current.nonce + 1 }));
  }

  function jumpToThirdStageStep(index: number) {
    setOpenedMemory(null);
    setGuidePhoneOpen(false);
    setGuidePhoneView("home");
    setActiveChoice(null);
    setVnLineIndex(0);
    setResponseLineIndex(0);
    setSecondAskLineIndex(0);
    setSchedulePresenceChoice(null);
    if (index === 0) {
      setPhase("secondAsk");
      return;
    }
    setNodeIndex(index - 1);
    setPhase("nodes");
  }

  return (
    <main className="app">
      <section className="storyController" aria-label="剧情控制器">
        <div>
          <p className="eyebrow">剧情控制器</p>
          <strong>{phase === "intro" ? introPhotoOpen ? "开场照片" : "收拾宿舍" : phase === "room" ? "记忆校准" : phase === "secondAsk" ? "第三阶段：她来南京" : phase === "nodes" ? `第三阶段：${currentNode.title}` : phase === "farewell" ? "朋友圈与私聊" : phase === "ending" ? "结尾" : "确认"}</strong>
          <span>{phase === "intro" && !introPhotoOpen ? `已收拾 ${introPackedCount} / ${introPackItems.length}` : phase === "room" ? `当前节点 ${memoryControllerJump.index + 1} / ${memoryCalibrationSteps.length}` : phase === "secondAsk" ? "节点 0 / 3" : phase === "nodes" ? `节点 ${nodeIndex + 1} / ${nodes.length}` : "剧情进行中"}</span>
        </div>
        <div className="controllerActions">
          <button className={phase === "intro" ? "activeControllerAction" : ""} onClick={jumpToIntroStage} type="button">第一阶段</button>
          <button className={phase === "room" ? "activeControllerAction" : ""} onClick={jumpToMemoryCalibrationStage} type="button">第二阶段</button>
          {memoryCalibrationSteps.map((label, index) => (
            <button
              className={phase === "room" && memoryControllerJump.index === index ? "activeControllerAction" : ""}
              onClick={() => jumpToMemoryCalibrationStep(index)}
              type="button"
              key={label}
            >
              {label}
            </button>
          ))}
          <button className={phase === "secondAsk" || phase === "nodes" ? "activeControllerAction" : ""} onClick={() => jumpToThirdStageStep(0)} type="button">第三阶段</button>
          {thirdStageSteps.map((label, index) => (
            <button
              className={(phase === "secondAsk" && index === 0) || (phase === "nodes" && index === nodeIndex + 1) ? "activeControllerAction" : ""}
              onClick={() => jumpToThirdStageStep(index)}
              type="button"
              key={label}
            >
              {label}
            </button>
          ))}
          {phase === "intro" && !introPhotoOpen && (
            <>
              <button onClick={() => setPackedIntroItems([])} type="button">重置收拾</button>
              <button disabled={!introPackedDone} onClick={openIntroPhoto} type="button">进入照片</button>
            </>
          )}
          {phase === "intro" && introPhotoOpen && <button onClick={() => setIntroPhotoOpen(false)} type="button">回到房间</button>}
          <button onClick={resetStory} type="button">重开</button>
        </div>
      </section>

      <audio ref={thirdStageMusicRef} src={thirdStageMusicSrc} loop preload="auto" />
      {isThirdStagePhase && (
        <button className={cx("introMusicToggle stageMusicToggle", thirdStageMusicPlaying && "playing")} onClick={toggleThirdStageMusic} type="button">
          {thirdStageMusicPlaying ? "音乐开" : "音乐关"}
        </button>
      )}

      {phase === "intro" && (
        <IntroStage
          introPhotoOpen={introPhotoOpen}
          introPhotoLineIndex={introPhotoLineIndex}
          introPhotoLines={introPhotoLines}
          currentIntroPhotoLine={currentIntroPhotoLine}
          advanceIntroPhotoLine={advanceIntroPhotoLine}
          setVnLineIndex={setVnLineIndex}
          setResponseLineIndex={setResponseLineIndex}
          setPhase={setPhase}
          introPackedCount={introPackedCount}
          introPackItems={introPackItems}
          introPackedDone={introPackedDone}
          introPackLine={introPackLine}
          introPackNarrationVisible={introPackNarrationVisible}
          packedIntroItems={packedIntroItems}
          packIntroItem={packIntroItem}
          activeIntroPackItem={activeIntroPackItem}
          activeIntroMemory={activeIntroMemory}
          currentIntroMemoryLine={currentIntroMemoryLine}
          introMemoryLineIndex={introMemoryLineIndex}
          advanceIntroMemory={advanceIntroMemory}
          postcardFlipped={postcardFlipped}
          setPostcardFlipped={setPostcardFlipped}
          openIntroPhoto={openIntroPhoto}
        />
      )}

      {phase === "room" && (
        <MemoryCalibrationStage
          seenMemories={seenMemories}
          memories={memories}
          guidedBeat={guidedBeat}
          guidePhoneOpen={guidePhoneOpen}
          openGuidePhone={openGuidePhone}
          setGuidePhoneOpen={setGuidePhoneOpen}
          guidePhoneView={guidePhoneView}
          setGuidePhoneView={setGuidePhoneView}
          openGuidedBeat={openGuidedBeat}
          getGuidedOptionText={getGuidedOptionText}
          markMemorySeen={markMemorySeen}
          schedulePresenceChoice={schedulePresenceChoice}
          setSchedulePresenceChoice={setSchedulePresenceChoice}
          setSecondAskLineIndex={setSecondAskLineIndex}
          setPhase={setPhase}
          controllerStepIndex={memoryControllerJump.index}
          controllerJumpNonce={memoryControllerJump.nonce}
        />
      )}

      {phase === "secondAsk" && (
        <SecondAskStage
          secondAskReady={secondAskReady}
          currentSecondAskLine={currentSecondAskLine}
          advanceSecondAskLine={advanceSecondAskLine}
          setVnLineIndex={setVnLineIndex}
          setResponseLineIndex={setResponseLineIndex}
          setPhase={setPhase}
          schedulePresenceChoice={schedulePresenceChoice}
          setSchedulePresenceChoice={setSchedulePresenceChoice}
        />
      )}

      {phase === "nodes" && currentNode && (
        <NodesStage
          currentNode={currentNode}
          nodeIndex={nodeIndex}
          setNodeIndex={setNodeIndex}
          setActiveChoice={setActiveChoice}
          setVnLineIndex={setVnLineIndex}
          setResponseLineIndex={setResponseLineIndex}
          activeChoice={activeChoice}
          choicesReady={choicesReady}
          chooseNode={chooseNode}
          currentResponseLine={currentResponseLine}
          currentVnLine={currentVnLine}
          advanceResponseLine={advanceResponseLine}
          advanceVnLine={advanceVnLine}
          responseLineIndex={responseLineIndex}
          responseLines={responseLines}
        />
      )}

      {phase === "system" && <SystemRevealStage setPhase={setPhase} />}
      {phase === "farewell" && <FarewellStage planeChoice={planeChoice} farewellChoice={farewellChoice} setFarewellChoice={setFarewellChoice} setPhase={setPhase} />}
      {phase === "ending" && <EndingStage resetStory={resetStory} />}
      {openedMemory && <MemoryModal openedMemory={openedMemory} setOpenedMemory={setOpenedMemory} markMemorySeen={markMemorySeen} />}
    </main>
  );
}
