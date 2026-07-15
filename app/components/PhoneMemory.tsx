"use client";

import { useState } from "react";
import type { PhoneApp } from "../story/types";
import { cx } from "../story/utils";

function PhoneTop({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="phoneAppTop">
      <button onClick={onBack} type="button">‹</button>
      <strong>{title}</strong>
      <span />
    </header>
  );
}


export function PhoneMemory({ markSeen, initialApp = "home", compact = false }: { markSeen: () => void; initialApp?: PhoneApp; compact?: boolean }) {
  const [phoneApp, setPhoneApp] = useState<PhoneApp>(initialApp);

  function openPhoneApp(app: PhoneApp) {
    setPhoneApp(app);
    markSeen();
  }

  return (
    <div className={cx("phoneOS", compact && "compactPhoneMemory")}>
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
                <button type="button">语音备份</button>
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


