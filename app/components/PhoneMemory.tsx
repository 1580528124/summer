"use client";

import { useState } from "react";
import type { PhoneApp } from "../story/types";
import { cx } from "../story/utils";

type Props = {
  markSeen: () => void;
  initialApp?: PhoneApp;
  compact?: boolean;
  stageMode?: boolean;
};

type HomeApp = {
  id: PhoneApp;
  label: string;
  image?: string;
  badge?: string;
  className?: string;
};

const homeApps: HomeApp[] = [
  { id: "wechat", label: "微信", image: "/assets/phone-apps/wechat.png", badge: "12" },
  { id: "qq", label: "QQ", className: "qqIcon", badge: "3" },
  { id: "netease", label: "网易云音乐", image: "/assets/phone-apps/netease.png" },
  { id: "album", label: "照片", image: "/assets/phone-apps/album.png" },
  { id: "calendar", label: "日历", image: "/assets/phone-apps/calendar.png" },
  { id: "moments", label: "微博", image: "/assets/phone-apps/weibo.png" },
  { id: "douyin", label: "抖音", image: "/assets/phone-apps/douyin.png" },
];

const dockApps: HomeApp[] = [
  { id: "wechat", label: "微信", image: "/assets/phone-apps/wechat.png", badge: "12" },
  { id: "qq", label: "QQ", className: "qqIcon" },
  { id: "netease", label: "音乐", image: "/assets/phone-apps/netease.png" },
];

function PhoneTop({ title, onBack, dark = false }: { title: string; onBack: () => void; dark?: boolean }) {
  return (
    <header className={cx("phoneAppTop", dark && "darkPhoneTop")}>
      <button onClick={onBack} type="button" aria-label="返回">‹</button>
      <strong>{title}</strong>
      <span />
    </header>
  );
}

function PhoneIcon({ app, onOpen }: { app: HomeApp; onOpen: (app: PhoneApp) => void }) {
  return (
    <button className="phoneAppButton" onClick={() => onOpen(app.id)} type="button">
      <span className={cx("realAppIcon", app.className)}>
        {app.image ? <img src={app.image} alt="" draggable={false} /> : <i>Q</i>}
        {app.badge && <em>{app.badge}</em>}
      </span>
      <b>{app.label}</b>
    </button>
  );
}

function WechatList({ openChat }: { openChat: () => void }) {
  return (
    <div className="wechatListScreen">
      <div className="wechatSearch">搜索</div>
      <div className="wechatChatList">
        <button onClick={openChat} className="wechatRow pinnedChat" type="button">
          <i className="avatar zhouAvatar">周</i>
          <span>
            <b>周也</b>
            <small>我今天不想装了。你别打过来。</small>
          </span>
          <em>23:47</em>
        </button>
        <button className="wechatRow" type="button">
          <i className="avatar friendAvatar">满</i>
          <span>
            <b>林小满</b>
            <small>她最近在北京升职了。你俩还有联系吗？</small>
          </span>
          <em>刚刚</em>
        </button>
        <button className="wechatRow" type="button">
          <i className="avatar groupAvatar">班</i>
          <span>
            <b>本科班群</b>
            <small>毕业快乐，以后也要好好的。</small>
          </span>
          <em>2025/6</em>
        </button>
        <button className="wechatRow" type="button">
          <i className="avatar fileAvatar">文</i>
          <span>
            <b>文件传输助手</b>
            <small>毕业.mp4 已恢复</small>
          </span>
          <em>昨天</em>
        </button>
      </div>
      <nav className="wechatTabs" aria-label="微信底部导航">
        <b>微信</b>
        <span>通讯录</span>
        <span>发现</span>
        <span>我</span>
      </nav>
    </div>
  );
}

function WechatConversation() {
  return (
    <div className="wechatConversationScreen">
      <div className="chatDate">2024 年夏天</div>
      <p className="bubble theirs imageBubble">南京的晚霞有梧桐树衬着。北京的可能有高楼大厦吧。</p>
      <p className="bubble theirs">我们以后怎么办啊</p>
      <p className="bubble mine">再说吧</p>
      <p className="bubble theirs">又是“再说”</p>
      <div className="chatDate">2025 年 8 月</div>
      <p className="bubble theirs">我到了。花坛这儿。</p>
      <p className="bubble mine">还在开会</p>
      <p className="bubble theirs">南京蚊子真多。咬了五个包了。</p>
      <p className="bubble theirs">我哪儿也不想去。就想等你来了看见你</p>
      <div className="chatDate">2026 年 1 月</div>
      <p className="bubble theirs">要不……我们先分开吧。</p>
      <p className="bubble mine">好。</p>
      <p className="bubble systemBubble">整个通话里，你没有说过一句“我不想分开”。</p>
    </div>
  );
}

export function PhoneMemory({ markSeen, initialApp = "home", compact = false, stageMode = false }: Props) {
  const [phoneApp, setPhoneApp] = useState<PhoneApp>(initialApp);

  function openPhoneApp(app: PhoneApp) {
    setPhoneApp(app);
    markSeen();
  }

  return (
    <div className={cx("phoneOS", compact && "compactPhoneMemory", stageMode && "stagePhoneMemory")}>
      <div className="phoneFrame">
        <div className="phoneHardware" aria-hidden="true" />
        <div className="phoneScreen">
          <div className={cx("phoneStatus", phoneApp !== "home" && "lightPhoneStatus")}>
            <span>23:47</span>
            <span className="statusPills"><i /> 5G 62%</span>
          </div>

          {phoneApp === "home" && (
            <div className="phoneHome">
              <section className="phoneWidget">
                <small>南京 · 多云</small>
                <strong>6月12日</strong>
                <span>星期三 23:47</span>
              </section>
              <div className="appGrid">
                {homeApps.map((app) => <PhoneIcon key={app.label} app={app} onOpen={openPhoneApp} />)}
              </div>
              <div className="phoneDock">
                {dockApps.map((app) => <PhoneIcon key={app.label} app={app} onOpen={openPhoneApp} />)}
              </div>
            </div>
          )}

          {phoneApp === "wechat" && (
            <div className="phoneAppView wechatAppView">
              <PhoneTop title="微信" onBack={() => setPhoneApp("home")} dark />
              <WechatList openChat={() => openPhoneApp("zhouye")} />
            </div>
          )}

          {phoneApp === "zhouye" && (
            <div className="phoneAppView phoneConversation wechatChatApp">
              <PhoneTop title="周也" onBack={() => setPhoneApp("wechat")} dark />
              <WechatConversation />
              <div className="wechatInputBar">
                <span>＋</span>
                <b>说点什么</b>
                <span>☺</span>
              </div>
            </div>
          )}

          {phoneApp === "album" && (
            <div className="phoneAppView albumAppView">
              <PhoneTop title="照片" onBack={() => setPhoneApp("home")} />
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
            <div className="phoneAppView socialAppView">
              <PhoneTop title="微博" onBack={() => setPhoneApp("home")} />
              <div className="feedList">
                <article><b>我</b><p>收拾东西翻到的。2024 年秋天，南京。那时候真好。</p></article>
                <article><b>林小满</b><p>2024 年……好怀念啊。她最近在北京升职了。</p></article>
                <article><b>通知</b><p>周也 赞了你的动态。</p></article>
              </div>
            </div>
          )}

          {phoneApp === "calendar" && (
            <div className="phoneAppView calendarAppView">
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

          {phoneApp === "netease" && (
            <div className="phoneAppView musicAppView">
              <PhoneTop title="网易云音乐" onBack={() => setPhoneApp("home")} />
              <div className="musicPlayerMock">
                <img src="/assets/phone-apps/netease.png" alt="" draggable={false} />
                <strong>后来的我们</strong>
                <span>五月天</span>
                <i />
                <p>单曲循环 · 她离开南京以后</p>
              </div>
            </div>
          )}

          {phoneApp === "qq" && (
            <div className="phoneAppView qqAppView">
              <PhoneTop title="QQ" onBack={() => setPhoneApp("home")} />
              <div className="qqList">
                <button type="button"><i>班</i><b>本科班群</b><span>相册上传了 36 张毕业照</span></button>
                <button type="button"><i>满</i><b>林小满</b><span>你最近还好吗？</span></button>
              </div>
            </div>
          )}

          {phoneApp === "douyin" && (
            <div className="phoneAppView douyinAppView">
              <PhoneTop title="抖音" onBack={() => setPhoneApp("home")} />
              <div className="douyinMock">
                <b>南京梧桐大道</b>
                <span>@旧夏天 · 2024</span>
              </div>
            </div>
          )}

          <div className="homeIndicator" aria-hidden="true" />
        </div>
      </div>
      <aside className="phoneMemoryText">
        <p className="eyebrow">手机 / 聊天记录</p>
        <h2>她等你开口的那些地方，都还亮着。</h2>
        <p>手机现在作为独立的系统组件呈现：桌面、微信、QQ、网易云音乐、相册和日历都能进入。最重要的线索仍停在微信里。</p>
      </aside>
    </div>
  );
}
