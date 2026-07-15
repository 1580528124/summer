"use client";



type Props = Record<string, any>;

export function SystemRevealStage(props: Props) {
  const { setPhase } = props;

  return (
        <section className="curtain">
          <article className="storyCard wide">
            <p className="eyebrow">回声</p>
            <h2>你改变的从来不是结局。</h2>
            <div className="systemBox">
              <p>三个节点，你都走完了。</p>
              <p>你回去寻找让她留下的方法。现在你知道答案了。</p>
              <strong>你改变的是她记忆里的你。</strong>
              <p>哪怕只有几秒。哪怕那些声音留不住她。</p>
            </div>
            <p>画面从南京南站淡出。2027 年的宿舍重新亮起来。南京还是南京。梧桐还是梧桐。</p>
            <button onClick={() => setPhase("farewell")} type="button">整理旧照片</button>
          </article>
        </section>
  );
}


