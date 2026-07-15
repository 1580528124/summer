import type { StoryChoice, StoryNode } from "../story/types";
import { cx, getSceneHint } from "../story/utils";

export function SceneVisual({ node, activeChoice }: { node: StoryNode; activeChoice: StoryChoice | null }) {
  const choiceClass = activeChoice ? `choice-${activeChoice.key.toLowerCase()}` : "choice-waiting";

  return (
    <div className={cx("sceneVisual", `scene-${node.id}`, choiceClass)}>
      <div className="sceneSky" />
      <div className="sceneBackdrop" />
      <div className="sceneCharacter protagonist" />
      <div className="sceneCharacter zhouye" />

      {node.id === "stadium" && (
        <>
          <div className="trackLines"><i /><i /><i /></div>
          <div className="bleachers"><i /><i /><i /><i /></div>
          <div className="waterBottle" />
          <div className="phoneBlink" />
          <div className="lampGlow" />
        </>
      )}

      {node.id === "plane" && (
        <>
          <div className="treeCanopy"><i /><i /><i /><i /><i /></div>
          <div className="leafRoad"><i /><i /><i /><i /><i /><i /></div>
          <div className="leafForeground"><i /><i /></div>
          <div className="streetDepth"><i /><i /><i /></div>
          <div className="bike" />
          <div className="bikeBasket" />
          <div className="windLine one" />
          <div className="windLine two" />
          <div className="focusFrame" />
          <div className="shoulderLeaf" />
        </>
      )}

      {node.id === "station" && (
        <>
          <div className="stationGlass"><i /><i /><i /><i /></div>
          <div className="stationSign">南京南站</div>
          <div className="stationCrowd"><i /><i /><i /><i /></div>
          <div className="ticketStub" />
          <div className="suitcase" />
          <div className="toteBag" />
          <div className="phonePolaroid" />
          <div className="securityRail" />
          <div className="broadcastTicker">{activeChoice?.key === "E" ? "G……次列车停止检票" : activeChoice?.key === "A" ? "G……次列车开始检票" : "G……次列车即将停止检票"}</div>
        </>
      )}

      <div className="sceneCaption">
        <b>{node.title}</b>
        <span>{getSceneHint(node.id, activeChoice)}</span>
      </div>
    </div>
  );
}


