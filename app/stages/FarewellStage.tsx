"use client";

import { echoByPlaneChoice, finalChoices } from "../story/data";

type Props = Record<string, any>;

export function FarewellStage(props: Props) {
  const { planeChoice, farewellChoice, setFarewellChoice, setPhase } = props;

  return (
        <section className="phoneFinal">
          <article className="moments momentsPhoneMock">
            <header className="momentsTop">
              <button type="button" aria-label="返回">‹</button>
              <strong>朋友圈</strong>
              <span>•••</span>
            </header>
            <section className="momentsCover">
              <div>
                <b>南京在读研</b>
                <i>我</i>
              </div>
            </section>
            <article className="wechatMomentPost">
              <i className="momentAvatar">我</i>
              <div className="momentPostBody">
                <header>
                  <b>南京在读研</b>
                  <small>刚刚</small>
                </header>
                <p>收拾东西翻到的。2024 年秋天，南京。那时候真好。</p>
                <button className="momentPhoto" type="button" aria-label="查看梧桐大道照片">
                  <img src="/assets/story/wutong-road-autumn-2024.png" alt="" draggable={false} />
                </button>
                <div className="momentMeta">
                  <span>南京 · 梧桐大道</span>
                  <button type="button">··</button>
                </div>
                <section className="momentReactions">
                  <p><b>周也</b>、<b>林小满</b> 赞了这条朋友圈</p>
                  <p><b>林小满：</b>2024 年……好怀念啊。她最近在北京升职了。你俩还有联系吗？</p>
                  <p><b>我 回复 林小满：</b>很久没联系了。</p>
                  <p><b>周也：</b>梧桐大道。你还留着这张啊。</p>
                </section>
              </div>
            </article>
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



