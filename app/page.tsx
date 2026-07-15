"use client";

import { useMemo, useState } from "react";

type Phase = "intro" | "room" | "secondAsk" | "nodes" | "system" | "farewell" | "ending";
type MemoryId = "computer" | "phone" | "mp3" | "recycle";
type NodeId = "stadium" | "plane" | "station";
type ChoiceKey = "A" | "B" | "C" | "D" | "E";
type PhoneApp = "home" | "wechat" | "zhouye" | "moments" | "album" | "calendar";
type DesktopApp = "folder" | "tickets" | "recycle" | "notes";
type IntroPackItem = "laptop" | "books" | "folder" | "calendar" | "lamp" | "keyboard" | "mp3" | "phone" | "mouse" | "cup" | "scarf";

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
      "周也：你以后想我了，就看看这个视频。毕业快乐。",
      "周也：还有，你以后别什么都闷在心里了。你想说什么就说。",
      "主角：我尽量。",
      "周也：又“尽量”。行吧。但我还是喜欢你。",
      "最后三秒，画面暗了，她轻声说：要是有你在北京就好了。"
    ],
    note: "这个视频你 2025 年看过一次。她走之后你删了。2027 年，你把它恢复了。"
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
    scene: "南京南站北广场。广播声循环。她拖着行李箱，回头看你。",
    prompt: [
      "周也：我下周排班出来了。不休。组长说这个月都不休。",
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

function DesktopMemory({ memory, markSeen }: { memory: Memory; markSeen: () => void }) {
  const [activeApp, setActiveApp] = useState<DesktopApp>("folder");

  function openApp(app: DesktopApp) {
    setActiveApp(app);
    markSeen();
  }

  return (
    <div className="desktopOS">
      <div className="desktopWallpaper">
        <div className="desktopBrand"><span>Windows</span><small>2027 · 南京宿舍</small></div>
        <div className="desktopApps">
          <button onClick={() => openApp("folder")} type="button"><i className="pixelAppIcon folderPixel">文</i><span>以后</span></button>
          <button onClick={() => openApp("tickets")} type="button"><i className="pixelAppIcon ticketPixel">G</i><span>高铁票根</span></button>
          <button onClick={() => openApp("recycle")} type="button"><i className="pixelAppIcon recyclePixel">♻</i><span>回收站</span></button>
          <button onClick={() => openApp("notes")} type="button"><i className="pixelAppIcon notePixel">记</i><span>备忘录</span></button>
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
                <button onClick={() => openApp("tickets")} type="button"><i>🖼</i><b>她的排班.jpg</b><small>周也 休 周四 周五 · 勿改</small></button>
                <button type="button"><i>🚄</i><b>南京南→北京南 G6</b><small>¥558.5 · 收藏时间 2024 年 12 月</small></button>
                <button type="button"><i>🚄</i><b>北京南→南京南 G23</b><small>¥558.5 · 收藏时间 2024 年 12 月</small></button>
                <button onClick={() => openApp("notes")} type="button"><i>🗺</i><b>北京攻略截图</b><small>等她安顿好了，我去找她。</small></button>
                <button type="button"><i>💬</i><b>2025年3月聊天记录</b><small>她拿到 offer，他说“恭喜”。</small></button>
              </main>
            </div>
          )}

          {activeApp === "tickets" && (
            <div className="ticketWall">
              <article><b>南京南 → 北京南</b><span>G6 · ¥558.5</span><small>收藏了，却没说出口。</small></article>
              <article><b>北京南 → 南京南</b><span>G23 · ¥558.5</span><small>她来了一次，他去了四次。</small></article>
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
              <p>{memory.note}</p>
              <p>你以为爱是等准备好了再给她。但爱不是。爱是哪怕没准备好，也要让她知道你在。</p>
            </div>
          )}
        </section>
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
                <article><b>系统通知</b><p>周也 赞了你的朋友圈。</p></article>
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
        <p>这里保留原来的手机系统交互：桌面、微信、相册、朋友圈和日历。内容已经全部换成《离别》的南京线索。</p>
      </aside>
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
          <div className="bike" />
          <div className="windLine one" />
          <div className="windLine two" />
          <div className="focusFrame" />
        </>
      )}

      {node.id === "station" && (
        <>
          <div className="stationGlass"><i /><i /><i /><i /></div>
          <div className="stationSign">南京南站</div>
          <div className="ticketStub" />
          <div className="suitcase" />
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
  const [introPhotoLineIndex, setIntroPhotoLineIndex] = useState(0);
  const [packedIntroItems, setPackedIntroItems] = useState<IntroPackItem[]>([]);
  const [openedMemory, setOpenedMemory] = useState<Memory | null>(null);
  const [seenMemories, setSeenMemories] = useState<MemoryId[]>([]);
  const [nodeIndex, setNodeIndex] = useState(0);
  const [nodeChoices, setNodeChoices] = useState<Partial<Record<NodeId, ChoiceKey>>>({});
  const [activeChoice, setActiveChoice] = useState<StoryChoice | null>(null);
  const [farewellChoice, setFarewellChoice] = useState<string | null>(null);

  const progress = Math.round((seenMemories.length / memories.length) * 100);
  const currentNode = nodes[nodeIndex];
  const planeChoice = nodeChoices.plane ?? "D";
  const canSecondAsk = seenMemories.length === memories.length;
  const introPackItems: IntroPackItem[] = ["laptop", "books", "folder", "calendar", "lamp", "keyboard", "mp3", "phone", "mouse", "cup", "scarf"];
  const introPackedCount = packedIntroItems.length;
  const introPackedDone = introPackedCount === introPackItems.length;
  const introPhotoLines = [
    "2027年6月。研究生毕业。",
    "我在这间宿舍住了两年。现在要搬走了。",
    "收拾东西的时候，翻到这张照片——2024年夏天。",
    "南京的夏天很热，她的头发黏在脸上，但笑得很好看。",
    "我坐在电脑前面，看了很久。",
    "然后屏幕花了。"
  ];
  const introPackLine = introPackedDone
    ? "东西都收进去了。桌上只剩下那张照片。"
    : `旧书、文件夹和零碎的小东西还散在房间里。先把它们收进箱子。还剩 ${introPackItems.length - introPackedCount} 件。`;

  const roomHint = useMemo(() => {
    if (!canSecondAsk) return `请查看四个记忆碎片：${seenMemories.length} / ${memories.length}`;
    return "记忆校准完成。系统正在等待你的第二次选择。";
  }, [canSecondAsk, seenMemories.length]);

  function openMemory(memory: Memory) {
    setOpenedMemory(memory);
    setSeenMemories((current) => (current.includes(memory.id) ? current : [...current, memory.id]));
  }

  function markMemorySeen(id: MemoryId) {
    setSeenMemories((current) => (current.includes(id) ? current : [...current, id]));
  }

  function chooseNode(choice: StoryChoice) {
    setActiveChoice(choice);
    setNodeChoices((current) => ({ ...current, [currentNode.id]: choice.key }));
  }

  function continueNode() {
    setActiveChoice(null);
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
    setFarewellChoice(null);
  }

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="eyebrow">南京版互动叙事原型</p>
          <h1>离别</h1>
          <p>如果结局注定是分开，你还愿不愿意认真过在一起的每一分每一秒？</p>
        </div>
        <div className="status">
          <span>{phase === "room" ? roomHint : "2027 年 6 月，南京某高校研究生宿舍"}</span>
          <i><b style={{ width: `${progress}%` }} /></i>
        </div>
      </section>

      <section className="storyController" aria-label="剧情控制器">
        <div>
          <p className="eyebrow">剧情控制器</p>
          <strong>{phase === "intro" ? introPhotoOpen ? "开场照片" : "收拾宿舍" : phase === "room" ? "残留记忆" : phase === "nodes" ? currentNode.title : phase === "farewell" ? "朋友圈与私聊" : phase === "ending" ? "结尾旁白" : "系统确认"}</strong>
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
                <div className="introBox">
                  <b>毕业</b>
                  <span>{introPackedCount} / {introPackItems.length}</span>
                  <small>点击物品收进箱子</small>
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
              <article className="visualNovelBox introDialogue">
                <div className="speakerName">旁白</div>
                <p>{introPackedDone ? "研究生宿舍的房间里，箱子已经合上了一半。" : "研究生宿舍的房间里，箱子摊在地上。"}</p>
                <p>{introPackLine}</p>
                <span>{introPackedDone ? "双击照片" : "点击物品收拾"}</span>
              </article>
            </div>
          ) : (
            <article className="storyCard introScreen">
              <p className="eyebrow">开场画面 / 第一次问</p>
              <div className={cx("fullscreenPhoto", introPhotoLineIndex === introPhotoLines.length - 1 && "distorting")} aria-hidden="true">
                <img className="memoryPhotoImage" src="/assets/story/summer-2024-couple-photo.png" alt="" draggable={false} />
                <span className="photoNoise" />
              </div>
              <button className="visualNovelBox photoDialogue" onClick={advanceIntroPhotoLine} onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  advanceIntroPhotoLine();
                }
              }} type="button">
                <span className="speakerName">我</span>
                <p>{introPhotoLines[introPhotoLineIndex]}</p>
                <i>{introPhotoLineIndex < introPhotoLines.length - 1 ? "点击继续" : "画面开始失真"}</i>
              </button>
              {introPhotoLineIndex === introPhotoLines.length - 1 && (
                <>
                  <div className="systemBox">
                    <p>电脑屏幕出现波纹。照片变成模糊的噪点。</p>
                    <p>慢慢清晰——但背景变了。</p>
                    <strong>你现在看到的是 2024 年。你还要回去吗？</strong>
                  </div>
                  <button onClick={() => setPhase("room")} type="button">是。查看残留记忆</button>
                </>
              )}
            </article>
          )}
        </section>
      )}

      {phase === "room" && (
        <>
          <section className="room pixelRoom">
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
            <button className="window item hasSprite" onClick={() => openMemory(memories[0])} aria-label="窗外梧桐">
              <img className="itemSprite" src="/assets/items/window-night.png" alt="" draggable={false} />
              <span>梧桐树影</span>
            </button>
            <button className="calendar item hasSprite storyCalendar" onClick={() => openMemory(memories[1])} aria-label="2024 年日历">
              <img className="itemSprite" src="/assets/items/calendar.png" alt="" draggable={false} />
            </button>
            <div className="box pixelBox">毕业</div>
            <div className="desk">
              <button className={cx("monitor item hasSprite memoryItem", seenMemories.includes("computer") && "seen")} onClick={() => openMemory(memories[0])} type="button" aria-label="旧笔记本电脑">
                <img className="itemSprite" src="/assets/items/monitor.png" alt="" draggable={false} />
                <span>旧笔记本</span>
              </button>
              <button className="keyboard item hasSprite" onClick={() => openMemory(memories[0])} aria-label="键盘" type="button">
                <img className="itemSprite" src="/assets/items/keyboard.png" alt="" draggable={false} />
              </button>
              <button className="mouse item hasSprite" onClick={() => openMemory(memories[0])} aria-label="鼠标" type="button">
                <img className="itemSprite" src="/assets/items/mouse.png" alt="" draggable={false} />
              </button>
              <button className={cx("phone item hasSprite memoryItem", seenMemories.includes("phone") && "seen")} onClick={() => openMemory(memories[1])} type="button" aria-label="手机">
                <img className="itemSprite" src="/assets/items/phone.png" alt="" draggable={false} />
                <span>手机</span>
              </button>
              <button className={cx("mp3 item hasSprite memoryItem", seenMemories.includes("mp3") && "seen")} onClick={() => openMemory(memories[2])} type="button" aria-label="银色 MP3">
                <img className="itemSprite" src="/assets/items/mp3.png" alt="" draggable={false} />
                <span>银色 MP3</span>
              </button>
              <button className="lamp item hasSprite" onClick={() => openMemory(memories[2])} aria-label="台灯" type="button">
                <img className="itemSprite" src="/assets/items/lamp.png" alt="" draggable={false} />
              </button>
              <button className={cx("recycle storyRecycle item memoryItem", seenMemories.includes("recycle") && "seen")} onClick={() => openMemory(memories[3])} type="button" aria-label="回收站">
                <span>回收站</span>
              </button>
            </div>
            <button className="slippers item hasSprite" onClick={() => openMemory(memories[1])} aria-label="拖鞋" type="button">
              <img className="itemSprite" src="/assets/items/slippers.png" alt="" draggable={false} />
            </button>
            <button className="trash item hasSprite" onClick={() => openMemory(memories[3])} aria-label="纸箱旁的垃圾桶" type="button">
              <img className="itemSprite" src="/assets/items/trash.png" alt="" draggable={false} />
            </button>
          </section>

          <section className="memoryDock" aria-label="记忆校准进度">
            {memories.map((memory) => (
              <button className={seenMemories.includes(memory.id) ? "done" : ""} onClick={() => openMemory(memory)} key={memory.id} type="button">
                <b>{memory.title}</b>
                <span>{memory.summary}</span>
              </button>
            ))}
          </section>

          {canSecondAsk && (
            <div className="floatingAction">
              <button onClick={() => setPhase("secondAsk")} type="button">全部看完了。继续</button>
            </div>
          )}
        </>
      )}

      {phase === "secondAsk" && (
        <section className="curtain">
          <article className="storyCard wide">
            <p className="eyebrow">第二次问 / 知情选择</p>
            <h2>现在你已经看到了结局。</h2>
            <p>2024 年南京的夏天，她笑得很开心。2025 年北京的南京大牌档，她一个人站在门口。2026 年电话里，她说“要不我们先分开吧”。你说了“好”。</p>
            <div className="systemBox">
              <p>你改变不了已经发生的事。</p>
              <p>你知道那些话救不了这段关系。</p>
              <p>你也知道重新经历这些，只会让你再失去她一次。</p>
              <strong>即使这样，你仍然要回去吗？</strong>
            </div>
            <button onClick={() => setPhase("nodes")} type="button">是。正式启动</button>
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
                }}
                key={node.id}
                type="button"
              >
                <small>0{index + 1}</small>
                <span>{node.title}</span>
              </button>
            ))}
          </div>
          <article className="nodeCard">
            <SceneVisual node={currentNode} activeChoice={activeChoice} />
            <div className="nodeScript">
              <p className="eyebrow">{currentNode.eyebrow}</p>
              <h2>{currentNode.title}</h2>
              <p className="scene">{currentNode.scene}</p>
              <div className="dialogue">
                {currentNode.prompt.map((line) => <p key={line}>{line}</p>)}
              </div>
              {currentNode.system && <div className="systemBox compact">{currentNode.system}</div>}

              {!activeChoice && (
                <div className="silenceMeter">
                  <span>沉默</span>
                  <i />
                  <small>{currentNode.id === "plane" ? "风停住了。她在等。" : currentNode.id === "station" ? "广播第二次响起。你还有三句话的时间。" : "她低头拧开水瓶，声音在安静里很响。"}</small>
                </div>
              )}

              {!activeChoice ? (
                <div className="choiceGrid">
                  {currentNode.choices.map((choice) => (
                    <button onClick={() => chooseNode(choice)} key={choice.key} type="button">
                      <i>{choice.key}</i>
                      <span>{choice.text}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="responsePanel">
                  <p className="eyebrow">你选择了 {activeChoice.key}</p>
                  {activeChoice.response.map((line) => <p key={line}>{line}</p>)}
                  <hr />
                  {currentNode.closing.map((line) => <p key={line}>{line}</p>)}
                  <div className="transitionLine">{getTransitionText(currentNode.id)}</div>
                  <button onClick={continueNode} type="button">{nodeIndex < nodes.length - 1 ? "切换到下一个场景" : "回到 2027 宿舍"}</button>
                </div>
              )}
            </div>
          </article>
        </section>
      )}

      {phase === "system" && (
        <section className="curtain">
          <article className="storyCard wide">
            <p className="eyebrow">系统揭示</p>
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
