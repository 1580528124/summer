"use client";

import { cx, speakerLabel } from "../story/utils";

type Props = Record<string, any>;

export function SecondAskStage(props: Props) {
  const { secondAskReady, currentSecondAskLine, advanceSecondAskLine, setVnLineIndex, setResponseLineIndex, setPhase } = props;

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


