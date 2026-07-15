"use client";

import { nodes } from "../story/data";
import { cx, speakerLabel } from "../story/utils";
import { SceneVisual } from "../components/SceneVisual";

type Props = Record<string, any>;

export function NodesStage(props: Props) {
  const { currentNode, nodeIndex, setNodeIndex, setActiveChoice, setVnLineIndex, setResponseLineIndex, activeChoice, choicesReady, chooseNode, currentResponseLine, currentVnLine, advanceResponseLine, advanceVnLine, responseLineIndex, responseLines } = props;

  return (
        <section className="nodeStage">
          <div className="sceneSwitcher" aria-label="当前回溯场景">
            {nodes.map((node, index) => (
              <button
                className={index === nodeIndex ? "active" : ""}
                disabled={index > nodeIndex}
                onClick={() => {
                  setNodeIndex(index);
                  setActiveChoice(null);
                  setVnLineIndex(0);
                  setResponseLineIndex(0);
                }}
                key={node.id}
                type="button"
              >
                <small>0{index + 1}</small>
                <span>{node.title}</span>
              </button>
            ))}
          </div>
          <article className="nodeCard vnNodeCard">
            <SceneVisual node={currentNode} activeChoice={activeChoice} />
            <div className="vnSceneHud">
              <div className="vnSceneTitle">
                <span>{currentNode.eyebrow}</span>
                <strong>{currentNode.title}</strong>
              </div>

              {!activeChoice && choicesReady && (
                <div className="vnChoiceLayer">
                  {currentNode.choices.map((choice: any) => (
                    <button onClick={() => chooseNode(choice)} key={choice.key} type="button">
                      <i>{choice.key}</i>
                      <span>{choice.text}</span>
                    </button>
                  ))}
                </div>
              )}

              <button
                className={cx(
                  "vnDialogueBox",
                  !speakerLabel(activeChoice ? currentResponseLine?.speaker : currentVnLine.speaker) && "noSpeaker",
                  (activeChoice ? currentResponseLine?.kind : currentVnLine.kind) === "system" && "systemLine",
                  (activeChoice ? currentResponseLine?.speaker : currentVnLine.speaker) === "我" && "meLine"
                )}
                onClick={() => {
                  if (activeChoice) {
                    advanceResponseLine();
                    return;
                  }
                  if (!choicesReady) advanceVnLine();
                }}
                type="button"
              >
                {speakerLabel(activeChoice ? currentResponseLine?.speaker : currentVnLine.speaker) && <span className="speakerName">{speakerLabel(activeChoice ? currentResponseLine?.speaker : currentVnLine.speaker)}</span>}
                <p>{activeChoice ? currentResponseLine?.text : currentVnLine.text}</p>
                <i>{activeChoice ? responseLineIndex < responseLines.length - 1 ? "点击继续" : nodeIndex < nodes.length - 1 ? "进入下一场景" : "回到 2027 宿舍" : choicesReady ? "请选择回应" : "点击继续"}</i>
              </button>
            </div>
          </article>
        </section>
  );
}


