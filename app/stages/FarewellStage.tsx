"use client";

import { echoByPlaneChoice, finalChoices } from "../story/data";

type Props = Record<string, any>;

export function FarewellStage(props: Props) {
  const { planeChoice, farewellChoice, setFarewellChoice, setPhase } = props;

  return (
        <section className="phoneFinal">
          <article className="moments">
            <p className="eyebrow">朋友圈</p>
            <h2>旧照片已整理。是否发到朋友圈？</h2>
            <div className="photoPost">
              <div className="photoPlane">梧桐大道 / 2024 秋天</div>
              <p>收拾东西翻到的。2024 年秋天，南京。那时候真好。</p>
              <span>林小满：2024 年……好怀念啊。她最近在北京升职了。你俩还有联系吗？</span>
              <strong>周也 赞了你的朋友圈。</strong>
            </div>
          </article>

          <article className="chatCard">
            <p className="eyebrow">私聊消息</p>
            <div className="chat">
              <p className="other">周也：梧桐大道。你还留着这张啊。</p>
              <p className="me">我：留了三年了。每次看到都觉得那时候真好。</p>
              <p className="other">周也：那时候确实挺好的。</p>
              <p className="other">周也：南京的梧桐。</p>
              <p className="other echo">周也：{echoByPlaneChoice[planeChoice as keyof typeof echoByPlaneChoice]}</p>
              <p className="me">我：走。但没以前那么勤了。有时候路过会慢一点。</p>
              <p className="other">周也：我后来在北京路过南京大牌档的时候，会站在门口看一下。然后走了。</p>
              <p className="other">周也：我们那时候都不容易。我知道你也不容易。</p>
              <p className="me">我：你也不容易。</p>
              <p className="other">周也：嗯。那这次好好说再见吧。别再留着什么没说完的话了。</p>
            </div>

            {!farewellChoice ? (
              <div className="choiceGrid finalChoices">
                {finalChoices.map((choice) => (
                  <button onClick={() => setFarewellChoice(choice)} key={choice} type="button">
                    <span>{choice}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="responsePanel">
                <p className="me">我：{farewellChoice}</p>
                {farewellChoice.includes("爱过") && (
                  <>
                    <p className="other">周也：我现在知道了。</p>
                    <p className="other">周也：其实有些时候，我也听见了。</p>
                    <p className="other">周也：只是我们还是走到了这里。</p>
                  </>
                )}
                <p className="other">周也：再见啦。真的再见了。</p>
                <button onClick={() => setPhase("ending")} type="button">好好说再见</button>
              </div>
            )}
          </article>
        </section>
  );
}



