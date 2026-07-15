"use client";

import { useEffect, useState } from "react";

type Phase = "intro" | "room" | "secondAsk" | "nodes" | "system" | "farewell" | "ending";
type MemoryId = "computer" | "phone" | "mp3" | "recycle";
type NodeId = "stadium" | "plane" | "station";
type ChoiceKey = "A" | "B" | "C" | "D" | "E";
type PhoneApp = "home" | "wechat" | "zhouye" | "moments" | "album" | "calendar";
type DesktopApp = "folder" | "tickets" | "recycle" | "notes";
type IntroPackItem = "laptop" | "books" | "folder" | "calendar" | "lamp" | "keyboard" | "mp3" | "phone" | "mouse" | "cup" | "scarf";
type GuidePhoneView = "home" | "wechatList" | "chat";

type Memory = {
  id: MemoryId;
  title: string;
  place: string;
  summary: string;
  lines: string[];
  note: string;
};

type StoryChoice = {
  key: ChoiceKey;
  text: string;
  response: string[];
};

type StoryNode = {
  id: NodeId;
  eyebrow: string;
  title: string;
  scene: string;
  prompt: string[];
  system?: string;
  choices: StoryChoice[];
  closing: string[];
};

type GuidedBeat = {
  memoryId: MemoryId;
  time: string;
  title: string;
  message: string;
  cta: string;
  after: string;
};

type VnLine = {
  speaker: string;
  text: string;
  kind?: "dialogue" | "system" | "narration";
};

type DesktopGuideBeat = {
  app: DesktopApp;
  icon: string;
  title: string;
  meta: string;
  speaker: string;
  text: string;
  detail: string;
};

const memories: Memory[] = [
  {
    id: "computer",
    title: "电脑桌面",
    place: "文件夹：以后",
    summary: "南京到北京的车票、排班截图、攻略和一张退票订单。",
    lines: [
      "钉钉排班截图里，红框圈出“周也 休 周四 周五”。她发来：买了。你别放我鸽子啊。",
      "北京攻略截图收藏于 2025 年 1 月，备注写着：等她安顿好了，我去找她。",
      "隐藏文件：2025年11月11日 北京南—南京南.pdf。已退票，退票时间 23:47。",
      "她在回龙观发烧那天，我买了票。后来看到她朋友圈说退烧了，我把票退了。"
    ],
    note: "你们收藏了很多“以后”。后来那些“以后”，你一个人去了南京的颐和路，走了三遍。"
  },
  {
    id: "phone",
    title: "手机",
    place: "聊天记录",
    summary: "从“再说吧”到“我不想装了”，异地慢慢把话压短。",
    lines: [
      "周也：我们以后怎么办啊 / 主角：再说吧 / 周也：又是“再说”。",
      "周也：我拿到了 offer！！！ / 主角：太好了 / 周也：你之前不是说考北京吗？",
      "周也：南京蚊子真多。咬了五个包了。 / 主角：你别坐那儿。",
      "周也：我哪儿也不想去。就想等你来了看见你。",
      "周也：要不……我们先分开吧。 / 主角：好。"
    ],
    note: "整个通话里，你没有说过一句“我不想分开”。"
  },
  {
    id: "mp3",
    title: "旧 MP3",
    place: "她的录音",
    summary: "分手前寄回来的银色 MP3，里面有两段她忘了删的声音。",
    lines: [
      "给你的.mp3：以后你去北京了、我回南京了，翻到这个，还能想起来：2024 年的南京，秋天，有个人挺喜欢你的。",
      "给自己.mp3：又加班到这个点。想给他打电话。他肯定睡了。",
      "她说：我今天路过一家店，招牌上写着“南京大牌档”。在门口站了一会儿。没进去。",
      "她说：北京也好冷。但北京没有梧桐树。算了。不说了。我好累啊。"
    ],
    note: "这段录音她存了草稿，没有发给你。她忘了删。"
  },
  {
    id: "recycle",
    title: "回收站",
    place: "毕业.mp4",
    summary: "2025 年毕业典礼，被删除又恢复的视频。",
    lines: [
      "周也：笑一个。今天毕业了。",
      "主角：（笑得很短）",
      "周也：你这笑得什么啊。",
      "周也：算了。我明天就去北京了。",
      "周也：你去送我吗？",
      "主角：去。",
      "周也：真的？",
      "主角：真的。",
      "周也：那行。我记住了。",
      "周也：你以后想我了，就看看这个视频。毕业快乐。",
      "周也：还有，你以后别什么都闷在心里了。你想说什么就说。",
      "主角：我尽量。",
      "周也：又“尽量”。行吧。但我还是喜欢你。",
      "最后三秒，画面暗了，她轻声说：要是有你在北京就好了。"
    ],
    note: "这个视频你 2025 年看过一次。她走之后你删了。2027 年，你把它恢复了。"
  }
];

const guidedBeats: GuidedBeat[] = [
  {
    memoryId: "phone",
    time: "23:47",
    title: "周也",
    message: "你还留着那台旧手机吗？我刚才突然想起，我们那时候好像什么都说了，又什么都没说。",
    cta: "打开周也的聊天",
    after: "聊天记录亮起来，像有人把 2025 年的夜晚重新推到你面前。"
  },
  {
    memoryId: "computer",
    time: "23:51",
    title: "周也",
    message: "你电脑里应该还有那些车票和攻略吧。你总说以后再说，可你其实把很多“以后”都存起来了。",
    cta: "查看旧电脑",
    after: "桌上的笔记本自动亮屏，文件夹里全是没有兑现的以后。"
  },
  {
    memoryId: "mp3",
    time: "00:03",
    title: "周也",
    message: "那个银色 MP3，你不要再当成杂物了。里面有些话，我当时没来得及发给你。",
    cta: "播放 MP3 录音",
    after: "录音的电流声很轻，她的声音从很远的地方回来。"
  },
  {
    memoryId: "recycle",
    time: "00:12",
    title: "周也",
    message: "最后，去回收站恢复那个毕业视频吧。你删掉的不是文件，是她离开南京前最后一次等你开口。",
    cta: "恢复并播放 毕业.mp4",
    after: "毕业视频恢复完成。她说“你以后别什么都闷在心里了”，画面暗下去后，又轻声说了一句。"
  }
];

const nodes: StoryNode[] = [
  {
    id: "stadium",
    eyebrow: "节点一 / 2024 年夏天",
    title: "操场看台",
    scene: "南京某大学操场看台。夏天晚上，有风。她坐在旁边。",
    prompt: ["周也：我们以后怎么办？毕业以后，你想去哪？"],
    system: "2024 年夏天，你当时说的是：“再说吧。”",
    choices: [
      {
        key: "A",
        text: "我想试试北京，和你一起。但如果没做到，我会提前告诉你，不再让你猜。",
        response: ["她转过头看你：“真的？”", "你说：“真的。”", "她笑了：“那说好了。我等你来北京。”"]
      },
      {
        key: "B",
        text: "我想留在南京。但我支持你。",
        response: ["她沉默了一会儿：“你不跟我一起走？”", "你说：“我可能考不上北京的学校。”", "她声音低了一点：“那我也能回南京找你。南京也挺好的。”"]
      },
      {
        key: "C",
        text: "我还没想好。但我想和你一起想。",
        response: ["她看着你：“你愿意和我一起想？”", "你说：“嗯。”", "她笑了：“那行。南京也好北京也好，反正咱俩一块儿就行。”"]
      },
      {
        key: "D",
        text: "再说吧。",
        response: ["和当年一样。", "她没再追问。走的时候回头看了你一眼。"]
      }
    ],
    closing: ["她站起来，拍了拍裤子。", "夏天的风从操场那边吹过来。", "她在前面走。", "这一次，我跟上去了。"]
  },
  {
    id: "plane",
    eyebrow: "节点二 / 2024 年秋天",
    title: "梧桐路",
    scene: "南京，种满梧桐的路。她在前面踩落叶，转头看你。",
    prompt: [
      "周也：南京的秋天真的绝了。",
      "周也：你以后要是去别的地方了，会不会想南京？",
      "周也：你会想梧桐。想食堂的汤包。想……想我吗？"
    ],
    choices: [
      {
        key: "A",
        text: "会。想你走在我前面踩落叶的样子。",
        response: ["她站住，回头看你。风吹过来，梧桐叶落了几片。", "她笑了一下，很短：“你今天怎么这么会说话。”", "她走到你旁边，离得很近：“那你要记住你今天说的。”"]
      },
      {
        key: "B",
        text: "会。你在我前面走，我希望这条路特别长。",
        response: ["她站住，回头看你。风吹过来，梧桐叶落了几片。", "她笑了一下，很短：“你今天怎么这么会说话。”", "她走到你旁边，离得很近：“那你要记住你今天说的。”"]
      },
      {
        key: "C",
        text: "我会想南京。也会想你。分不开的。",
        response: ["她站住，回头看你。风吹过来，梧桐叶落了几片。", "她笑了一下，很短：“你今天怎么这么会说话。”", "她走到你旁边，离得很近：“那你要记住你今天说的。”"]
      },
      {
        key: "D",
        text: "嗯。",
        response: ["和当年一样。", "她等了两秒，转身继续走：“走吧，饿了。”"]
      }
    ],
    closing: ["她走回来的时候，离我很近。", "一片梧桐叶落在她肩膀上。", "这一次，我记住了。"]
  },
  {
    id: "station",
    eyebrow: "节点三 / 2025 年 6 月",
    title: "南京南站",
    scene: "南京南站北广场。玻璃幕墙反射着午后的光。她拖着银灰色行李箱，帆布袋挂在手腕上，回头看你。",
    prompt: [
      "周也：我下周排班出来了。不休。组长说这个月都不休。",
      "周也：下次回来，可能是下个月了。也可能不是。",
      "周也：我那个车次开始检票了。你有什么要跟我说的吗？"
    ],
    system: "她这次问你了。当年她没问。你还有三句话的时间。",
    choices: [
      {
        key: "A",
        text: "我会去北京看你。以后不能总让你一个人回来。",
        response: ["她盯着你看：“你这次说的是，以后不能总让我一个人回来。”", "她走过来，隔着安检栏杆拉住你的手。", "“好。我记住了。”"]
      },
      {
        key: "B",
        text: "到了好好吃饭。别老吃便利店。",
        response: ["她笑了一下：“你什么时候变啰嗦了。”", "她走了两步回头：“你也别老吃食堂。”"]
      },
      {
        key: "C",
        text: "南京的秋天我替你看。等你回来。",
        response: ["她站住了。安静了几秒。", "“南京的秋天。”她低着头，然后抬起来。", "“那你替我看。看了给我发照片。”"]
      },
      {
        key: "D",
        text: "到了给我发消息。",
        response: ["和当年一样。", "她说“好”。过安检。回头。", "你什么都没说。她站了十秒，走了。"]
      },
      {
        key: "E",
        text: "你别走。",
        response: ["她愣住。广播又响了一次。", "她轻声说：“你早说啊。”", "“车票改不了。但下次回来，你再说一遍。”"]
      }
    ],
    closing: ["画面闪白。广播：G……次列车停止检票。", "她已经走进去了。你站在原地看着。"]
  }
];

const echoByPlaneChoice: Record<ChoiceKey, string> = {
  A: "你那时候说，会想我走在前面踩落叶的样子。我后来偶尔会想起这句话。",
  B: "你那时候说，希望那条路特别长。其实我那天也希望。",
  C: "你那时候说，南京和我分不开。后来我去了北京，才有点明白这句话。",
  D: "你那时候还是只说了一个“嗯”。你以前真的很不爱说话。",
  E: "南京的梧桐，我后来也还是会想起。"
};

const finalChoices = [
  "再见。",
  "保重。",
  "挺好的。",
  "我会记得南京的秋天。",
  "那时候没说完的话，现在说也晚了。但我确实很爱过你。"
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PhoneTop({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="phoneAppTop">
      <button onClick={onBack} type="button">‹</button>
      <strong>{title}</strong>
      <span />
    </header>
  );
}

function speakerLabel(speaker?: string) {
  return speaker === "我" || speaker === "周也" ? speaker : "";
}

function DesktopMemory({ memory, markSeen }: { memory: Memory; markSeen: () => void }) {
  const [activeApp, setActiveApp] = useState<DesktopApp>("folder");
  const [desktopStep, setDesktopStep] = useState(0);
  const [desktopInspected, setDesktopInspected] = useState(false);
  const desktopGuide: DesktopGuideBeat[] = [
    {
      app: "folder",
      icon: "🖼",
      title: "她的排班.jpg",
      meta: "周也 休 周四 周五 · 勿改",
      speaker: "",
      text: "文件夹“以后”打开了。第一个亮起来的是她的排班截图。",
      detail: "她提前十二天申请，在备注里写：去南京。票已买。勿改。"
    },
    {
      app: "tickets",
      icon: "🚄",
      title: "南京南→北京南 G6",
      meta: "¥558.5 · 收藏时间 2024 年 12 月",
      speaker: "我",
      text: "那时候我收藏了去北京的票。收藏了很多次，但没有告诉她。",
      detail: "南京南到北京南，四个多小时。你把它放进收藏夹，像把一句话放回喉咙里。"
    },
    {
      app: "tickets",
      icon: "🚄",
      title: "北京南→南京南 G23",
      meta: "¥558.5 · 收藏时间 2024 年 12 月",
      speaker: "",
      text: "下一张票根被翻出来。北京南到南京南，是她回来的方向。",
      detail: "她来了一次，你去了四次。每一次都像在证明你们还够近。"
    },
    {
      app: "notes",
      icon: "🗺",
      title: "北京攻略截图",
      meta: "等她安顿好了，我去找她。",
      speaker: "我",
      text: "我甚至存过攻略。想等她安顿好了，再去找她。",
      detail: "你把先锋书店、颐和路、紫金山也一起存着。好像计划越完整，话就越不用现在说。"
    },
    {
      app: "notes",
      icon: "💬",
      title: "2025年3月聊天记录",
      meta: "她拿到 offer，他说“恭喜”。",
      speaker: "周也",
      text: "你之前不是说考北京吗？",
      detail: "你说：没考上。她问：你一直没跟我说？你说：怕你担心。"
    }
  ];
  const currentDesktopBeat = desktopGuide[desktopStep];
  const desktopDone = desktopStep >= desktopGuide.length - 1 && desktopInspected;

  function openApp(app: DesktopApp) {
    setActiveApp(app);
    markSeen();
  }

  function advanceDesktopGuide() {
    markSeen();
    setActiveApp(currentDesktopBeat.app);
    if (!desktopInspected) {
      setDesktopInspected(true);
      return;
    }
    if (desktopStep < desktopGuide.length - 1) {
      const nextStep = desktopStep + 1;
      setDesktopStep(nextStep);
      setActiveApp(desktopGuide[nextStep].app);
      setDesktopInspected(false);
    }
  }

  return (
    <div className="desktopOS">
      <div className="desktopWallpaper">
        <div className="desktopBrand"><span>Windows</span><small>2027 · 南京宿舍</small></div>
        <div className="desktopApps">
          <button onClick={() => openApp("folder")} type="button"><i className="pixelAppIcon folderPixel">文</i><span>以后</span></button>
          <button disabled={desktopStep < 1} onClick={() => openApp("tickets")} type="button"><i className="pixelAppIcon ticketPixel">G</i><span>高铁票根</span></button>
          <button disabled type="button"><i className="pixelAppIcon recyclePixel">♻</i><span>回收站</span></button>
          <button disabled={desktopStep < 3} onClick={() => openApp("notes")} type="button"><i className="pixelAppIcon notePixel">记</i><span>备忘录</span></button>
        </div>

        <section className={`desktopWindow desktopWindow-${activeApp}`}>
          <header className="desktopWindowBar">
            <span>{activeApp === "folder" ? "以后" : activeApp === "tickets" ? "高铁票根" : activeApp === "recycle" ? "回收站" : "备忘录"}</span>
            <div><button type="button">—</button><button type="button">×</button></div>
          </header>

          {activeApp === "folder" && (
            <div className="fileExplorer">
              <aside>
                <b>快速访问</b>
                <span>桌面</span>
                <span>图片</span>
                <span>文档</span>
                <span>回收站</span>
              </aside>
              <main>
                {desktopGuide.map((beat, index) => (
                  <button
                    className={cx(index < desktopStep && "seenFile", index === desktopStep && "activeFile", index > desktopStep && "lockedFile")}
                    disabled={index !== desktopStep}
                    onClick={advanceDesktopGuide}
                    type="button"
                    key={beat.title}
                  >
                    <i>{beat.icon}</i><b>{beat.title}</b><small>{index > desktopStep ? "等待前一个文件读取完成" : beat.meta}</small>
                  </button>
                ))}
              </main>
            </div>
          )}

          {activeApp === "tickets" && (
            <div className="ticketWall">
              <article className={desktopStep === 1 ? "activeRecord" : ""}><b>南京南 → 北京南</b><span>G6 · ¥558.5</span><small>收藏了，却没说出口。</small></article>
              <article className={desktopStep === 2 ? "activeRecord" : ""}><b>北京南 → 南京南</b><span>G23 · ¥558.5</span><small>她来了一次，他去了四次。</small></article>
              <article className="danger"><b>已退票订单</b><span>2025-11-11 23:47</span><small>她在输液室给我发“多喝热水”的时候，我在退票。</small></article>
            </div>
          )}

          {activeApp === "recycle" && (
            <div className="recycleWindow">
              <i>♻</i>
              <b>毕业.mp4</b>
              <span>这个视频你 2025 年看过一次。她走之后你删了。</span>
              <p>最后三秒，画面暗了，她轻声说：要是有你在北京就好了。</p>
            </div>
          )}

          {activeApp === "notes" && (
            <div className="desktopNotes">
              <p>{currentDesktopBeat.detail}</p>
              <p>{memory.note}</p>
            </div>
          )}
        </section>
        <button className={cx("desktopGuideDialogue", !speakerLabel(desktopDone ? "" : currentDesktopBeat.speaker) && "noSpeaker", currentDesktopBeat.speaker === "我" && "meLine", currentDesktopBeat.speaker === "周也" && "zhouyeLine")} onClick={desktopDone ? undefined : advanceDesktopGuide} type="button">
          {speakerLabel(desktopDone ? "" : currentDesktopBeat.speaker) && <span>{speakerLabel(currentDesktopBeat.speaker)}</span>}
          <p>{desktopDone ? "文件夹里的“以后”已经读完。那些没说出口的话，正在变成下一段记忆。" : desktopInspected ? currentDesktopBeat.detail : currentDesktopBeat.text}</p>
          <i>{desktopDone ? "已完成" : desktopInspected ? desktopStep < desktopGuide.length - 1 ? "点击读取下一个文件" : "文件夹读取完成" : `点击查看：${currentDesktopBeat.title}`}</i>
        </button>
      </div>
    </div>
  );
}

function PhoneMemory({ markSeen }: { markSeen: () => void }) {
  const [phoneApp, setPhoneApp] = useState<PhoneApp>("home");

  function openPhoneApp(app: PhoneApp) {
    setPhoneApp(app);
    markSeen();
  }

  return (
    <div className="phoneOS">
      <div className="phoneFrame">
        <div className="phoneStatus"><span>23:47</span><span>5G 62%</span></div>
        <div className="phoneScreen">
          {phoneApp === "home" && (
            <div className="phoneHome">
              <div className="phoneDate">
                <strong>6月</strong>
                <span>2027年 星期三 · 南京</span>
              </div>
              <div className="appGrid">
                <button onClick={() => openPhoneApp("wechat")} type="button"><img className="appIcon" src="/assets/phone-apps/wechat.png" alt="" draggable={false} />微信</button>
                <button onClick={() => openPhoneApp("album")} type="button"><img className="appIcon" src="/assets/phone-apps/album.png" alt="" draggable={false} />相册</button>
                <button onClick={() => openPhoneApp("moments")} type="button"><img className="appIcon" src="/assets/phone-apps/weibo.png" alt="" draggable={false} />朋友圈</button>
                <button onClick={() => openPhoneApp("calendar")} type="button"><img className="appIcon" src="/assets/phone-apps/calendar.png" alt="" draggable={false} />日历</button>
              </div>
            </div>
          )}

          {phoneApp === "wechat" && (
            <div className="phoneAppView">
              <PhoneTop title="微信" onBack={() => setPhoneApp("home")} />
              <div className="chatList">
                <button onClick={() => openPhoneApp("zhouye")} className="pinnedChat" type="button"><i>周</i><b>周也</b><span>我今天不想装了。你别打过来。</span><em>2025/12</em></button>
                <button type="button"><i>满</i><b>林小满</b><span>她最近在北京升职了。你俩还有联系吗？</span><em>刚刚</em></button>
                <button type="button"><i>班</i><b>本科班群</b><span>毕业快乐，以后也要好好的。</span><em>2025/6</em></button>
              </div>
            </div>
          )}

          {phoneApp === "zhouye" && (
            <div className="phoneAppView phoneConversation">
              <PhoneTop title="周也" onBack={() => setPhoneApp("wechat")} />
              <div className="mobileMessages">
                <time>2024 年夏天</time>
                <p className="theirs">[图片：南京晚霞] 南京的晚霞有梧桐树衬着。北京的可能有高楼大厦吧。</p>
                <p className="theirs">我们以后怎么办啊</p>
                <p className="mine">再说吧</p>
                <p className="theirs">又是“再说”</p>
                <time>2025 年 8 月</time>
                <p className="theirs">我到了。花坛这儿。</p>
                <p className="mine">还在开会</p>
                <p className="theirs">我哪儿也不想去。就想等你来了看见你</p>
                <time>2026 年 1 月</time>
                <p className="theirs">要不……我们先分开吧。</p>
                <p className="mine">好。</p>
              </div>
            </div>
          )}

          {phoneApp === "album" && (
            <div className="phoneAppView">
              <PhoneTop title="相册" onBack={() => setPhoneApp("home")} />
              <div className="photoGrid">
                <button type="button">梧桐大道</button>
                <button type="button">毕业照</button>
                <button type="button">南京南站</button>
                <button type="button">花坛</button>
                <button type="button">汤包</button>
                <button type="button">旧 MP3</button>
              </div>
            </div>
          )}

          {phoneApp === "moments" && (
            <div className="phoneAppView">
              <PhoneTop title="朋友圈" onBack={() => setPhoneApp("home")} />
              <div className="feedList">
                <article><b>我</b><p>收拾东西翻到的。2024 年秋天，南京。那时候真好。</p></article>
                <article><b>林小满</b><p>2024 年……好怀念啊。她最近在北京升职了。</p></article>
                <article><b>通知</b><p>周也 赞了你的朋友圈。</p></article>
              </div>
            </div>
          )}

          {phoneApp === "calendar" && (
            <div className="phoneAppView">
              <PhoneTop title="日历" onBack={() => setPhoneApp("home")} />
              <div className="phoneCalendar">
                <b>2024.06 在一起</b>
                <b>2025.06 毕业</b>
                <b>2025.08 她回南京</b>
                <b>2026.01 分手</b>
                <b>2027.06 离开南京</b>
              </div>
            </div>
          )}
        </div>
      </div>
      <aside className="phoneMemoryText">
        <p className="eyebrow">手机 / 聊天记录</p>
        <h2>她等你开口的那些地方，都还亮着。</h2>
        <p>这里保留原来的手机交互：桌面、微信、相册、朋友圈和日历。内容已经全部换成《离别》的南京线索。</p>
      </aside>
    </div>
  );
}

function GraduationVideoMemory({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  return (
    <div className="graduationVideo">
      <p className="eyebrow">{memory.place} / 已从回收站恢复</p>
      <div className="videoPlayer">
        <div className="videoFrame">
          <div className="videoSky" />
          <div className="videoBleachers"><i /><i /><i /></div>
          <div className="videoPerson videoMe" />
          <div className="videoPerson videoZhouye" />
          <div className="videoTimestamp">2025.06 南京 · 毕业典礼</div>
          <div className="videoRec">REC</div>
        </div>
        <div className="videoControls">
          <span />
          <b>毕业.mp4</b>
          <small>03:18 / 03:18</small>
        </div>
      </div>
      <div className="videoScript">
        {memory.lines.map((line) => <p key={line}>{line}</p>)}
      </div>
      <div className="systemBox compact">
        {memory.note}
        <br />
        窗外梧桐树还是绿的。你把这个视频看了三遍，才终于按下继续。
      </div>
      <button onClick={onClose} type="button">收起毕业视频</button>
    </div>
  );
}

function getTransitionText(nodeId: NodeId) {
  if (nodeId === "stadium") return "后来我们走过了很多个秋天。";
  if (nodeId === "plane") return "南京的秋天还没结束，夏天先走了。";
  return "你站在原地。很久。";
}

function getSceneHint(nodeId: NodeId, activeChoice: StoryChoice | null) {
  if (nodeId === "stadium") {
    if (!activeChoice) return "远处跑步的脚步声每隔几秒响一次。她没有看你，只看着操场。";
    if (activeChoice.key === "D") return "她站起来，拍了拍裤子上的灰，没有回头。";
    return "路灯在她眼睛里有一个很小的光点。她把小拇指伸到你们之间。";
  }

  if (nodeId === "plane") {
    if (!activeChoice) return "她问“想我吗”的时候，风刚好停了。梧桐叶落在地上，没再动。";
    if (activeChoice.key === "D") return "风又响起来。她还是走在前面，距离仍然是三步。";
    return "她走回你身边。没有牵手，但离得很近。";
  }

  if (!activeChoice) return "广播：G……次列车现在开始检票。她没看检票口，她看着你。";
  if (activeChoice.key === "A") return "广播：G……次列车开始检票。她重复那句话，像在确认什么。";
  if (activeChoice.key === "E") return "广播：G……次列车停止检票。声音近得像就在耳边。";
  return "广播：G……次列车即将停止检票。玻璃幕墙上人影来来往往。";
}

function parseVnLine(line: string): VnLine {
  const [speaker, ...rest] = line.split("：");
  if (rest.length > 0 && speaker.length <= 4) {
    return { speaker, text: rest.join("："), kind: "dialogue" };
  }
  return { speaker: "", text: line, kind: "narration" };
}

function SceneVisual({ node, activeChoice }: { node: StoryNode; activeChoice: StoryChoice | null }) {
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

export default function Home() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [introPhotoOpen, setIntroPhotoOpen] = useState(false);
  const [introPackNarrationVisible, setIntroPackNarrationVisible] = useState(true);
  const [introPhotoLineIndex, setIntroPhotoLineIndex] = useState(0);
  const [packedIntroItems, setPackedIntroItems] = useState<IntroPackItem[]>([]);
  const [openedMemory, setOpenedMemory] = useState<Memory | null>(null);
  const [seenMemories, setSeenMemories] = useState<MemoryId[]>([]);
  const [nodeIndex, setNodeIndex] = useState(0);
  const [nodeChoices, setNodeChoices] = useState<Partial<Record<NodeId, ChoiceKey>>>({});
  const [activeChoice, setActiveChoice] = useState<StoryChoice | null>(null);
  const [vnLineIndex, setVnLineIndex] = useState(0);
  const [responseLineIndex, setResponseLineIndex] = useState(0);
  const [secondAskLineIndex, setSecondAskLineIndex] = useState(0);
  const [guidePhoneOpen, setGuidePhoneOpen] = useState(false);
  const [guidePhoneView, setGuidePhoneView] = useState<GuidePhoneView>("home");
  const [farewellChoice, setFarewellChoice] = useState<string | null>(null);

  const currentNode = nodes[nodeIndex];
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
    { speaker: "", text: "记忆校准完成。", kind: "system" },
    { speaker: "", text: "你看到了 2024 年南京的夏天，她笑得很开心。", kind: "system" },
    { speaker: "", text: "你看到了 2025 年毕业视频里，她说：你以后别什么都闷在心里了。", kind: "system" },
    { speaker: "", text: "你看到了北京的南京大牌档，她一个人站在门口。", kind: "system" },
    { speaker: "", text: "你也看到了 2026 年电话里，她说：要不我们先分开吧。", kind: "system" },
    { speaker: "我", text: "好。", kind: "dialogue" },
    { speaker: "", text: "你改变不了已经发生的事。你改变不了你们分开的结局。", kind: "system" },
    { speaker: "", text: "但她明天去北京之前，确实等过你一句明确的话。", kind: "system" },
    { speaker: "", text: "现在你已经看到了结局。即使这样，你仍然要回去吗？", kind: "system" }
  ];
  const currentSecondAskLine = secondAskLines[Math.min(secondAskLineIndex, secondAskLines.length - 1)];
  const secondAskReady = secondAskLineIndex >= secondAskLines.length - 1;
  const introPackItems: IntroPackItem[] = ["laptop", "books", "folder", "calendar", "lamp", "keyboard", "mp3", "phone", "mouse", "cup", "scarf"];
  const introPackedCount = packedIntroItems.length;
  const introPackedDone = introPackedCount === introPackItems.length;
  const introPhotoLines: VnLine[] = [
    { speaker: "我", text: "2027年6月。研究生毕业。", kind: "narration" },
    { speaker: "我", text: "我在这间宿舍住了两年。现在要搬走了。", kind: "narration" },
    { speaker: "我", text: "收拾东西的时候，翻到这张照片——2024年夏天。", kind: "narration" },
    { speaker: "我", text: "南京的夏天很热，她的头发黏在脸上，但笑得很好看。", kind: "narration" },
    { speaker: "我", text: "我坐在电脑前面，看了很久。", kind: "narration" },
    { speaker: "我", text: "然后屏幕花了。", kind: "narration" },
    { speaker: "", text: "电脑屏幕出现波纹。照片变成模糊的噪点。", kind: "system" },
    { speaker: "", text: "慢慢清晰——但背景变了。", kind: "system" },
    { speaker: "", text: "你现在看到的是 2024 年。你还要回去吗？", kind: "system" }
  ];
  const currentIntroPhotoLine = introPhotoLines[Math.min(introPhotoLineIndex, introPhotoLines.length - 1)];
  const introPackLine = introPackedDone
    ? "东西都收进去了。桌上只剩下那张照片。"
    : "旧书、文件夹和零碎的小东西还散在房间里。先把它们收进箱子。";

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
    setPackedIntroItems((current) => (current.includes(item) ? current : [...current, item]));
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

  return (
    <main className="app">
      <section className="storyController" aria-label="剧情控制器">
        <div>
          <p className="eyebrow">剧情控制器</p>
          <strong>{phase === "intro" ? introPhotoOpen ? "开场照片" : "收拾宿舍" : phase === "room" ? "残留记忆" : phase === "nodes" ? currentNode.title : phase === "farewell" ? "朋友圈与私聊" : phase === "ending" ? "结尾" : "确认"}</strong>
          <span>{phase === "intro" && !introPhotoOpen ? `已收拾 ${introPackedCount} / ${introPackItems.length}` : phase === "room" ? `记忆碎片 ${seenMemories.length} / ${memories.length}` : "剧情进行中"}</span>
        </div>
        <div className="controllerActions">
          {phase === "intro" && !introPhotoOpen && (
            <>
              <button onClick={() => setPackedIntroItems([])} type="button">重置收拾</button>
              <button onClick={() => setPackedIntroItems(introPackItems)} type="button">一键收拾</button>
              <button disabled={!introPackedDone} onClick={openIntroPhoto} type="button">进入照片</button>
            </>
          )}
          {phase === "intro" && introPhotoOpen && <button onClick={() => setIntroPhotoOpen(false)} type="button">回到房间</button>}
          <button onClick={resetStory} type="button">重开</button>
        </div>
      </section>

      {phase === "intro" && (
        <section className={cx("curtain introCurtain", introPhotoOpen && "photoOpen")}>
          {!introPhotoOpen ? (
            <div className="introPackStage">
              <div className="introRoom" aria-label="2027 年 6 月，研究生宿舍">
                <div className="introWindow" aria-hidden="true" />
                <div className="introShelf" aria-hidden="true" />
                <div className="introPinboard" aria-hidden="true">
                  <span>北京—南京<br />1078 公里</span>
                  <i>2024 秋</i>
                </div>
                <div className="introDesk">
                  <button className={cx("packItem spritePack introLaptop", packedIntroItems.includes("laptop") && "packed")} onClick={() => packIntroItem("laptop")} type="button" aria-label="把旧笔记本电脑放进箱子"><img src="/assets/items/monitor.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem spritePack introBook one", packedIntroItems.includes("books") && "packed")} onClick={() => packIntroItem("books")} type="button" aria-label="把旧书放进箱子"><img src="/assets/items/examBook.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem spritePack introFolder", packedIntroItems.includes("folder") && "packed")} onClick={() => packIntroItem("folder")} type="button" aria-label="把文件夹放进箱子"><img src="/assets/items/drawer.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem spritePack introLamp", packedIntroItems.includes("lamp") && "packed")} onClick={() => packIntroItem("lamp")} type="button" aria-label="把台灯放进箱子"><img src="/assets/items/lamp.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem spritePack introKeyboard", packedIntroItems.includes("keyboard") && "packed")} onClick={() => packIntroItem("keyboard")} type="button" aria-label="把键盘放进箱子"><img src="/assets/items/keyboard.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem spritePack introMp3", packedIntroItems.includes("mp3") && "packed")} onClick={() => packIntroItem("mp3")} type="button" aria-label="把银色 MP3 放进箱子"><img src="/assets/items/mp3.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem spritePack introPhone", packedIntroItems.includes("phone") && "packed")} onClick={() => packIntroItem("phone")} type="button" aria-label="把手机放进箱子"><img src="/assets/items/phone.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem spritePack introMouse", packedIntroItems.includes("mouse") && "packed")} onClick={() => packIntroItem("mouse")} type="button" aria-label="把鼠标放进箱子"><img src="/assets/items/mouse.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem spritePack introCup", packedIntroItems.includes("cup") && "packed")} onClick={() => packIntroItem("cup")} type="button" aria-label="把水杯放进箱子"><img src="/assets/items/tea.png" alt="" draggable={false} /></button>
                  <button className={cx("packItem spritePack introScarf", packedIntroItems.includes("scarf") && "packed")} onClick={() => packIntroItem("scarf")} type="button" aria-label="把围巾放进箱子"><img src="/assets/items/cable.png" alt="" draggable={false} /></button>
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
            </div>
          ) : (
            <article className="storyCard introScreen">
              <p className="eyebrow">开场画面 / 第一次问</p>
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
                  <button onClick={() => setPhase("room")} type="button">是。等手机亮起来</button>
                </div>
              )}
            </article>
          )}
        </section>
      )}

      {phase === "room" && (
        <>
          <section className="room pixelRoom guidedRoom" aria-label="2027 年宿舍，手机消息推动主线">
            <div className="wallGlow" aria-hidden="true" />
            <div className="roomDepth" aria-hidden="true" />
            <div className="bookcase" aria-hidden="true">
              <span className="shelf shelfTop" />
              <span className="shelf shelfMid" />
              <span className="shelf shelfLow" />
            </div>
            <div className="pinboard" aria-hidden="true">
              <span className="pinNote">北京—南京<br />1078 公里</span>
              <span className="pinPhoto">2024 秋</span>
            </div>
            <button className="window item hasSprite" disabled type="button" aria-label="窗外梧桐">
              <img className="itemSprite" src="/assets/items/window-night.png" alt="" draggable={false} />
              <span>梧桐树影</span>
            </button>
            <button className="calendar item hasSprite storyCalendar" disabled type="button" aria-label="2024 年日历">
              <img className="itemSprite" src="/assets/items/calendar.png" alt="" draggable={false} />
            </button>
            <div className="box pixelBox">毕业</div>
            <div className="desk">
              <button className={cx("monitor item hasSprite memoryItem", seenMemories.includes("computer") && "seen")} disabled type="button" aria-label="旧笔记本电脑">
                <img className="itemSprite" src="/assets/items/monitor.png" alt="" draggable={false} />
                <span>旧笔记本</span>
              </button>
              <button className="keyboard item hasSprite" disabled aria-label="键盘" type="button">
                <img className="itemSprite" src="/assets/items/keyboard.png" alt="" draggable={false} />
              </button>
              <button className="mouse item hasSprite" disabled aria-label="鼠标" type="button">
                <img className="itemSprite" src="/assets/items/mouse.png" alt="" draggable={false} />
              </button>
              <button className={cx("phone item hasSprite memoryItem guidePhoneItem", !guidePhoneOpen && "phoneVibrating", seenMemories.includes("phone") && "seen")} onClick={openGuidePhone} type="button" aria-label="手机正在震动，查看微信">
                <img className="itemSprite" src="/assets/items/phone.png" alt="" draggable={false} />
                <span>手机</span>
              </button>
              <button className={cx("mp3 item hasSprite memoryItem", seenMemories.includes("mp3") && "seen")} disabled type="button" aria-label="银色 MP3">
                <img className="itemSprite" src="/assets/items/mp3.png" alt="" draggable={false} />
                <span>银色 MP3</span>
              </button>
              <button className="lamp item hasSprite" disabled aria-label="台灯" type="button">
                <img className="itemSprite" src="/assets/items/lamp.png" alt="" draggable={false} />
              </button>
              <button className={cx("recycle storyRecycle item memoryItem", seenMemories.includes("recycle") && "seen")} disabled type="button" aria-label="回收站">
                <span>回收站</span>
              </button>
            </div>
            <button className="slippers item hasSprite" disabled aria-label="拖鞋" type="button">
              <img className="itemSprite" src="/assets/items/slippers.png" alt="" draggable={false} />
            </button>
            <button className="trash item hasSprite" disabled aria-label="纸箱旁的垃圾桶" type="button">
              <img className="itemSprite" src="/assets/items/trash.png" alt="" draggable={false} />
            </button>

            {!guidePhoneOpen && (
              <button className="phoneVibeHint" onClick={openGuidePhone} type="button">
                <b>嗡——</b>
                <span>手机亮了一下</span>
              </button>
            )}
          </section>

          {guidePhoneOpen && (
            <div className="guidedPhoneBackdrop" onClick={() => setGuidePhoneOpen(false)}>
              <article className="mainlinePhone guidedPhoneScreenOnly" aria-label="周也发来的消息" onClick={(event) => event.stopPropagation()}>
              {guidePhoneView === "home" ? (
                <div className="phoneHomeScreen">
                  <div className="phoneHomeStatus">
                    <span>{guidedBeat?.time ?? "00:16"}</span>
                    <b>100%</b>
                  </div>
                  <button className="homeNotification" onClick={() => setGuidePhoneView("wechatList")} type="button">
                    <img src="/assets/phone-apps/wechat.png" alt="" draggable={false} />
                    <span>
                      <b>微信</b>
                      <strong>{guidedBeat?.title ?? "周也"}</strong>
                      <small>{guidedBeat ? "发来一条新消息" : "发来一条消息"}</small>
                    </span>
                    <em>{guidedBeat?.time ?? "现在"}</em>
                  </button>
                  <div className="phoneAppGrid" aria-label="手机桌面">
                    <button className="phoneAppButton unread" onClick={() => setGuidePhoneView("wechatList")} type="button">
                      <img src="/assets/phone-apps/wechat.png" alt="" draggable={false} />
                      <span>微信</span>
                    </button>
                    <button className="phoneAppButton" type="button">
                      <img src="/assets/phone-apps/netease.png" alt="" draggable={false} />
                      <span>网易云</span>
                    </button>
                    <button className="phoneAppButton" type="button">
                      <i className="phoneIcon phoneIconCall" />
                      <span>电话</span>
                    </button>
                    <button className="phoneAppButton" type="button">
                      <i className="phoneIcon phoneIconContacts" />
                      <span>联系人</span>
                    </button>
                    <button className="phoneAppButton" type="button">
                      <img src="/assets/phone-apps/album.png" alt="" draggable={false} />
                      <span>相册</span>
                    </button>
                    <button className="phoneAppButton" type="button">
                      <img src="/assets/phone-apps/calendar.png" alt="" draggable={false} />
                      <span>日历</span>
                    </button>
                    <button className="phoneAppButton" type="button">
                      <img src="/assets/phone-apps/douyin.png" alt="" draggable={false} />
                      <span>抖音</span>
                    </button>
                    <button className="phoneAppButton" type="button">
                      <img src="/assets/phone-apps/weibo.png" alt="" draggable={false} />
                      <span>微博</span>
                    </button>
                  </div>
                </div>
              ) : guidePhoneView === "wechatList" ? (
                <div className="wechatListScreen">
                  <div className="mainlinePhoneTop wechatListTop">
                    <span>{guidedBeat?.time ?? "00:16"}</span>
                    <b>微信</b>
                  </div>
                  <div className="wechatSearchBar">搜索</div>
                  <button className="wechatThread unread" onClick={() => setGuidePhoneView("chat")} type="button">
                    <i>周</i>
                    <span>
                      <strong>{guidedBeat?.title ?? "周也"}</strong>
                      <small>{guidedBeat ? guidedBeat.message : "现在你已经看到了结局。要不要仍然回到 2024 年？"}</small>
                    </span>
                    <em>{guidedBeat?.time ?? "00:16"}</em>
                  </button>
                  <div className="wechatEmptyThreads" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <nav className="wechatTabBar" aria-label="微信底部导航">
                    <b>微信</b>
                    <span>通讯录</span>
                    <span>发现</span>
                    <span>我</span>
                  </nav>
                </div>
              ) : (
                <>
                  <div className="mainlinePhoneTop">
                    <span>{guidedBeat?.time ?? "00:16"}</span>
                    <b>微信</b>
                  </div>
                  <div className="mainlineChatHeader">
                    <i>周</i>
                    <div>
                      <strong>{guidedBeat?.title ?? "周也"}</strong>
                      <span>{guidedBeat ? `${guidedBeat.time} 发来一条消息` : "消息已读"}</span>
                    </div>
                  </div>
                  <div className="mainlineMessages">
                    {guidedBeats.slice(0, seenMemories.length).map((beat) => (
                      <p className="readMessage" key={beat.memoryId}>{beat.after}</p>
                    ))}
                    {guidedBeat ? (
                      <p className="newMessage">{guidedBeat.message}</p>
                    ) : (
                      <p className="newMessage">现在你已经看到了结局。要不要仍然回到 2024 年，把那些没说出口的话说完？</p>
                    )}
                  </div>
                  <div className="mainlineProgress">
                    {guidedBeats.map((beat, index) => (
                      <span className={index < seenMemories.length ? "done" : index === seenMemories.length ? "active" : ""} key={beat.memoryId} />
                    ))}
                  </div>
                  {guidedBeat ? (
                    <button onClick={openGuidedBeat} type="button">{guidedBeat.cta}</button>
                  ) : (
                    <button onClick={() => {
                      setGuidePhoneOpen(false);
                      setGuidePhoneView("home");
                      setSecondAskLineIndex(0);
                      setPhase("secondAsk");
                    }} type="button">继续。第二次选择</button>
                  )}
                </>
              )}
              </article>
            </div>
          )}
        </>
      )}

      {phase === "secondAsk" && (
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
      )}

      {phase === "nodes" && currentNode && (
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
                  {currentNode.choices.map((choice) => (
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
      )}

      {phase === "system" && (
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
      )}

      {phase === "farewell" && (
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
              <p className="other echo">周也：{echoByPlaneChoice[planeChoice]}</p>
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
      )}

      {phase === "ending" && (
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
      )}

      {openedMemory && (
        <div className="modalBackdrop" onClick={() => setOpenedMemory(null)}>
          <article className={cx("memoryModal", openedMemory.id === "computer" && "modalDesktop", openedMemory.id === "phone" && "modalPhone")} onClick={(event) => event.stopPropagation()}>
            <button className="close" onClick={() => setOpenedMemory(null)} aria-label="关闭" type="button">×</button>
            {openedMemory.id === "computer" ? (
              <DesktopMemory memory={openedMemory} markSeen={() => markMemorySeen("computer")} />
            ) : openedMemory.id === "phone" ? (
              <PhoneMemory markSeen={() => markMemorySeen("phone")} />
            ) : openedMemory.id === "recycle" ? (
              <GraduationVideoMemory memory={openedMemory} onClose={() => setOpenedMemory(null)} />
            ) : (
              <>
                <p className="eyebrow">{openedMemory.place}</p>
                <h2>{openedMemory.title}</h2>
                <p className="summary">{openedMemory.summary}</p>
                <div className="memoryLines">
                  {openedMemory.lines.map((line) => <p key={line}>{line}</p>)}
                </div>
                <div className="systemBox compact">{openedMemory.note}</div>
                <button onClick={() => setOpenedMemory(null)} type="button">收起这段记忆</button>
              </>
            )}
          </article>
        </div>
      )}
    </main>
  );
}
