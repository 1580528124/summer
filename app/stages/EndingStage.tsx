"use client";

import { useEffect, useState } from "react";

const endingLines = [
  "2027 年 6 月。",
  "南京的梧桐又绿了。",
  "分开，不是谁不够好。",
  "是她在北京深夜加班的时候，我只能说“辛苦了”。",
  "是她提前十二天申请，写“勿改”，然后在花坛边等了快两个小时。",
  "是我去了北京，在她公司楼下等了好长时间，然后我们只待了一会儿。",
  "是她最后问我有什么要说的，我说了。",
  "但太晚了。也不是太晚。",
  "就是时间到了。",
  "我没有改变我们分开的结局。",
  "只是后来，她的记忆里，多了几句我的声音。",
  "那些声音留不住她。",
  "但那些日子，是真实的。",
  "这次好好说再见了。",
  "真的再见了。"
];

type Props = Record<string, any>;

export function EndingStage(props: Props) {
  const { resetStory } = props;
  const [lineIndex, setLineIndex] = useState(0);
  const endingComplete = lineIndex >= endingLines.length;

  useEffect(() => {
    if (endingComplete) return;

    const timer = window.setTimeout(() => {
      setLineIndex((index) => Math.min(index + 1, endingLines.length));
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [endingComplete, lineIndex]);

  return (
    <section className="curtain final">
      <article className="endingText endingCurtainText">
        {!endingComplete ? (
          <div className="endingLineButton" key={lineIndex}>
            <p>{endingLines[lineIndex]}</p>
          </div>
        ) : (
          <div className="endingFinalPanel">
            <p>故事结束了。</p>
            <button onClick={resetStory} type="button">重新开始</button>
          </div>
        )}
      </article>
    </section>
  );
}
