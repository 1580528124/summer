"use client";



type Props = Record<string, any>;

export function EndingStage(props: Props) {
  const { resetStory } = props;

  return (
        <section className="curtain final">
          <article className="endingText">
            {[
              "2027 年 6 月。",
              "南京的梧桐又绿了。",
              "分开，不是谁不够好。",
              "是她在北京深夜加班的时候，我只能说“辛苦了”。",
              "是她提前十二天申请，写“勿改”，然后在花坛边等了快两个小时。",
              "是我去了北京，在她公司楼下等了快五个小时，然后我们只坐了十分钟。",
              "是她最后问我有什么要说的，我说了。",
              "但太晚了。也不是太晚。",
              "就是时间到了。",
              "我没有改变我们分开的结局。",
              "只是后来，她的记忆里，多了几句我的声音。",
              "那些声音留不住她。",
              "但那些日子，是真实的。",
              "这次好好说再见了。真的再见了。"
            ].map((line) => <p key={line}>{line}</p>)}
            <button onClick={() => {
              resetStory();
            }} type="button">重新开始</button>
          </article>
        </section>
  );
}


