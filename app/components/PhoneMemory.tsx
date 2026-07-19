"use client";

import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { LiveChatMessage, PhoneApp } from "../story/types";
import { cx } from "../story/utils";

type Props = {
  markSeen: () => void;
  initialApp?: PhoneApp;
  compact?: boolean;
  stageMode?: boolean;
  liveMessages?: LiveChatMessage[];
  liveTyping?: boolean;
  memoryChapter?: number;
  savedMemoryRevealCount?: number;
  onMemoryRevealCountChange?: (count: number) => void;
  onMemoryChapterCompleteChange?: (complete: boolean) => void;
  memoryChapterCompleted?: boolean;
  memoryAdvanceLabel?: string;
  onMemoryAdvance?: () => void;
};

type HomeApp = {
  id: PhoneApp;
  label: string;
  image?: string;
  badge?: string;
  className?: string;
};

type WechatTab = "chats" | "contacts" | "discover" | "me";
type MemoryChatMessage = {
  type: "date" | "system" | "theirs" | "mine" | "narration" | "memory";
  text: string;
  speaker?: "周也" | "我";
  image?: true;
  imageSrc?: string;
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

function WechatRow({
  avatar,
  name,
  text,
  time,
  className,
  onClick,
}: {
  avatar: string;
  name: string;
  text: string;
  time: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="wechatRow" type="button">
      <i className={cx("avatar", className)}>{avatar}</i>
      <span>
        <b>{name}</b>
        <small>{text}</small>
      </span>
      <em>{time}</em>
    </button>
  );
}

function WechatTabs({ activeTab, setActiveTab }: { activeTab: WechatTab; setActiveTab: (tab: WechatTab) => void }) {
  return (
    <nav className="wechatTabs" aria-label="微信底部导航">
      <button className={cx(activeTab === "chats" && "active")} onClick={() => setActiveTab("chats")} type="button">微信</button>
      <button className={cx(activeTab === "contacts" && "active")} onClick={() => setActiveTab("contacts")} type="button">通讯录</button>
      <button className={cx(activeTab === "discover" && "active")} onClick={() => setActiveTab("discover")} type="button">发现</button>
      <button className={cx(activeTab === "me" && "active")} onClick={() => setActiveTab("me")} type="button">我</button>
    </nav>
  );
}

function WechatList({ openChat, activeTab, setActiveTab }: { openChat: () => void; activeTab: WechatTab; setActiveTab: (tab: WechatTab) => void }) {
  return (
    <div className="wechatListScreen">
      {activeTab === "chats" && (
        <>
          <div className="wechatSearch">搜索</div>
          <div className="wechatChatList">
            <WechatRow avatar="周" name="周也" text="ovo" time="23:47" className="zhouAvatar" onClick={openChat} />
            <WechatRow avatar="满" name="林小满" text="" time="刚刚" className="friendAvatar" />
            <WechatRow avatar="组" name="课题组" text="导师：明早九点组会，大家同步实验进度。" time="21:12" className="labAvatar" />
            <WechatRow avatar="导" name="陈老师" text="论文初稿今晚先发我一版。" time="20:38" className="teacherAvatar" />
            <WechatRow avatar="研" name="2024级研究生院通知群" text="关于毕业生离校材料提交的提醒。" time="18:09" className="gradAvatar" />
            <WechatRow avatar="南" name="南京XX大学校园墙" text="晚霞投稿：南苑操场，梧桐路。" time="昨天" className="publicAvatar" />
            <WechatRow avatar="知" name="少数派" text="如何整理一台旧电脑里的回忆。" time="周一" className="publicAvatar" />
            <WechatRow avatar="文" name="文件传输助手" text="毕业.mp4 已恢复" time="昨天" className="fileAvatar" />
          </div>
        </>
      )}

      {activeTab === "contacts" && (
        <div className="wechatPanelList">
          <WechatRow avatar="新" name="新的朋友" text="2 个朋友申请" time="" className="contactToolAvatar" />
          <WechatRow avatar="群" name="群聊" text="课题组、研究生院通知群、本科班群" time="" className="groupAvatar" />
          <WechatRow avatar="签" name="标签" text="同门、导师、南京、北京" time="" className="tagAvatar" />
          <WechatRow avatar="公" name="公众号" text="南京发布、少数派、南大研究生会" time="" className="publicAvatar" />
          <WechatRow avatar="周" name="周也" text="北京 · 置顶联系人" time="" className="zhouAvatar" onClick={openChat} />
          <WechatRow avatar="导" name="陈老师" text="导师" time="" className="teacherAvatar" />
          <WechatRow avatar="满" name="林小满" text="大学同学" time="" className="friendAvatar" />
        </div>
      )}

      {activeTab === "discover" && (
        <div className="wechatPanelList">
          <WechatRow avatar="朋" name="朋友圈" text="周也更新了 1 条近况" time="" className="momentsAvatar" />
          <WechatRow avatar="看" name="看一看" text="研究生如何度过低谷期" time="" className="publicAvatar" />
          <WechatRow avatar="搜" name="搜一搜" text="南京南站 到 北京南" time="" className="tagAvatar" />
          <WechatRow avatar="游" name="游戏" text="很久没有打开" time="" className="gameAvatar" />
          <WechatRow avatar="小" name="小程序" text="12306、腾讯会议、校园卡" time="" className="contactToolAvatar" />
        </div>
      )}

      {activeTab === "me" && (
        <div className="wechatMe">
          <section className="wechatMeCard">
            <i className="avatar meAvatar">我</i>
            <span>
              <b>南京在读研</b>
              <small>微信号：summer_2018</small>
            </span>
          </section>
          <div className="wechatPanelList">
            <WechatRow avatar="服" name="服务" text="支付、城市服务、校园卡" time="" className="contactToolAvatar" />
            <WechatRow avatar="藏" name="收藏" text="北京攻略、车票截图、她发来的照片" time="" className="tagAvatar" />
            <WechatRow avatar="圈" name="朋友圈" text="最近一条：南京的秋天" time="" className="momentsAvatar" />
            <WechatRow avatar="设" name="设置" text="消息通知、隐私、聊天记录备份" time="" className="fileAvatar" />
          </div>
        </div>
      )}
    </div>
  );
}

const memoryConversations: MemoryChatMessage[][] = [
  [
    { type: "date", text: "2024年3月5日" },
    { type: "theirs", text: "[图片：小龙虾] 这个好吃下次我们一起去！！！", image: true, imageSrc: "/assets/story/chat-crayfish-2024.png" },
    { type: "theirs", text: "你剥虾我负责吃😋" },
    { type: "mine", text: "我剥壳很慢的" },
    { type: "theirs", text: "没事，你剥一只我吃一只，你剥两只我吃两只，不耽误" },
    { type: "mine", text: "哈哈哈哈哈哈那你得准备一打湿纸巾" },
    { type: "theirs", text: "你带就行~" },
    { type: "theirs", text: "好想回去看看啊" },
    { type: "theirs", text: "这个是之前拍的" },
    { type: "theirs", text: "[图片：南京晚霞] 南京的晚霞有梧桐树衬着。北京不知道夕阳配着高楼大厦是什么样。", image: true, imageSrc: "/assets/story/chat-nanjing-sunset-2024.png" },
    { type: "mine", text: "那我以后多拍给你看看" },
    { type: "theirs", text: "你说的喔" },
    { type: "theirs", text: "到时候咱俩交换" },
    { type: "mine", text: "晚霞配高楼，感觉一定很棒。" },
    { type: "theirs", text: "这么远那我们以后怎么办啊" },
    { type: "mine", text: "再说吧" },
    { type: "theirs", text: "又是\"再说\"" },
    { type: "mine", text: "到时候肯定有办法的" },
    { type: "mine", text: "等我去北京读研就好啦" },
    { type: "theirs", text: "嗯呢" },
    { type: "theirs", text: "听你的" },
    { type: "mine", text: "你信我？" },
    { type: "theirs", text: "不信嘿嘿" },
    { type: "theirs", text: "但先信着吧" },
    { type: "mine", text: "我谢谢你啊" }
  ],
  [
    { type: "date", text: "2025年4月16日" },
    { type: "theirs", text: "[图片：offer截图] 我能转正啦！！！", image: true, imageSrc: "/assets/story/offer-zhouye-2025.png" },
    { type: "theirs", text: "运营岗！！" },
    { type: "mine", text: "好耶！" },
    { type: "mine", text: "成功转正啦！" },
    { type: "mine", text: "转正后工资多少哇" },
    { type: "mine", text: "什么时候正式入职哈哈哈哈" },
    { type: "theirs", text: "你问得比我妈还细宝宝" },
    { type: "mine", text: "废话，阿姨见得次数比咱们俩多" },
    { type: "mine", text: "再说了阿姨又不用异地恋" },
    { type: "theirs", text: "哎！什么话！" },
    { type: "theirs", text: "我可截图了啊" },
    { type: "mine", text: "别别别" },
    { type: "mine", text: "错了错了" },
    { type: "theirs", text: "哈哈哈哈哈哈哈" },
     { type: "theirs", text: "这个还行税前12k，等正式毕业就入职啦" },
    { type: "mine", text: "前程似锦啊小宝" },
    { type: "theirs", text: "你来北京咱俩吃饭！" },
    { type: "theirs", text: "你那个结果怎么样呀？" },
    { type: "theirs", text: "咱们是不是九月就可以北京见啦" },
    { type: "mine", text: "啊" },
    { type: "mine", text: "其实" },
    { type: "theirs", text: "有消息跟我说啊 就算坏事也别自己扛" },
    { type: "mine", text: "嗯嗯" },
    { type: "mine", text: "差一点 要调剂回本校了" },
    { type: "theirs", text: "是不是早就出了但你一直没跟我说宝宝" },
    { type: "mine", text: "怕你担心" },
    { type: "theirs", text: "调剂回本校怎么会担心啊。我就是……你之前一直在说北京，我以为你肯定要来。" },
    { type: "theirs", text: "我们之前一直在说北京北京的，我以为你没问题的" },
    { type: "mine", text: "我也以为" },
    { type: "theirs", text: "没事儿 南京也挺好的 等我回来看你呀" },
    { type: "mine", text: "你工作那么忙，别老折腾了" },
    { type: "theirs", text: "那你来看我" },
    { type: "mine", text: "如果不是很忙的话包去的" },
    { type: "theirs", text: "你尽量这句话，我记住了。到时候你没来我可要生气的" },
    { type: "mine", text: "那我到时候多带点零食来赔罪好不好" },
    { type: "theirs", text: "我要吃辣条" },
    { type: "theirs", text: "麻辣王子" }
  ],
  [
    { type: "date", text: "2025年7月14日" },
    { type: "theirs", text: "[图片：工位] 工位好小，屏幕好大啊！", image: true, imageSrc: "/assets/story/chat-workstation-2025.png" },
    { type: "mine", text: "你坐下去还看得到人嘛哈哈哈哈哈哈" },
    { type: "theirs", text: "当然看得到！" },
    { type: "theirs", text: "我还在显示器旁边贴了个便利贴提醒自己\"别驼背\"呢" },
    { type: "mine", text: "有用嘛感觉" },
    { type: "theirs", text: "根本没用嗷" },
    { type: "theirs", text: "现在已经驼了" },
    { type: "mine", text: "那我到时候每天提醒你一下" },
    { type: "theirs", text: "你最好记得" },
    { type: "date", text: "2025年7月17日" },
    { type: "theirs", text: "[图片：钉钉排班，休周二] 我下周排班出来啦，周二终于能歇歇了", image: true, imageSrc: "/assets/story/chat-schedule-tuesday-2025.png" },
    { type: "mine", text: "周二？为什么不是周末啊" },
    { type: "theirs", text: "当然是轮休喽 " },
    { type: "theirs", text: "新人休不了周末" },
    { type: "theirs", text: "没办法喽" },
    { type: "mine", text: "那你周二准备干嘛" },
    { type: "theirs", text: "当然是躺着摆烂喽 你周二有课吗" },
    { type: "mine", text: "上午满课下午没课" },
    { type: "theirs", text: "那你也可以躺着！咱俩隔着屏幕一起躺！" },
    { type: "mine", text: "下午还得去实验室呢，忙的看不到头一天天的。" },
    { type: "theirs", text: "你忙的时候我就补补觉，你忙完了叫我喔" },
    { type: "mine", text: "好呢我忙完来找你。" },
    { type: "theirs", text: "不叫我的后果就是让我直接一觉睡到晚上哈哈哈" },
    { type: "mine", text: "我让你睡一会儿就叫你宝儿" },
    { type: "theirs", text: "行！信你一次" },
    { type: "date", text: "2025年8月29日" },
    { type: "theirs", text: "[图片：钉钉排班，休周四周五] 下周休周四周五！！！我周四晚上到南京！！！你别放我鸽子啊！！！", image: true, imageSrc: "/assets/story/chat-schedule-nanjing-2025.png" },
    { type: "mine", text: "不会不会 几点到哇？" },
    { type: "theirs", text: "晚上八点到南京南！" },
    { type: "mine", text: "我去接你哈哈哈哈" },
    { type: "system", text: "*(当天)*" },
    { type: "theirs", text: "我快到啦 你那怎么样？" },
    { type: "mine", text: "我还在实验室呢……导师突然找我。" },
    { type: "theirs", text: "你上次也是\"突然\"" },
    { type: "mine", text: "唉我也没想到" },
    { type: "theirs", text: "好吧好吧" },
    { type: "system", text: "*(两个小时后)*" },
    { type: "theirs", text: "[图片：花坛] 我到了你们学校附近啦", image: true, imageSrc: "/assets/story/chat-flowerbed-nanjing-south-2025.png" },
    { type: "mine", text: "我还在和导师battle呢" },
    { type: "theirs", text: "哦哦" },
    { type: "mine", text: "你要不要先去吃点东西？" },
    { type: "theirs", text: "我不吃 等你" },
    { type: "system", text: "*(又过了一个小时)*" },
    { type: "theirs", text: "OVO" },
    { type: "mine", text: "快了快了" },
    { type: "theirs", text: "南京蚊子真多……咬了五个包了" },
    { type: "mine", text: "你别坐那儿！那个花坛边上草多" },
    { type: "theirs", text: "我哪儿也不想去。就想等你来了看见你" },
    { type: "mine", text: "马上马上五分钟" },
    { type: "theirs", text: "你五分钟前也说的五分钟" },
    { type: "narration", text: "聊天记录到这里停住了。" },
    { type: "narration", text: "后面的事没有留在手机里。" },
    { type: "narration", text: "但我记得。" },
    { type: "narration", text: "我跑到学校门口。她从花坛边站起来，腿被蚊子咬了好几个包。" },
    { type: "memory", speaker: "周也", text: "你来啦" },
    { type: "memory", speaker: "我", text: "对不起对不起" },
    { type: "memory", speaker: "周也", text: "没事" },
    { type: "memory", speaker: "我", text: "饿不饿？" },
    { type: "memory", speaker: "周也", text: "饿" },
    { type: "memory", speaker: "我", text: "走，吃好吃的去" },
    { type: "memory", speaker: "周也", text: "等等。你先站那儿别动。" },
    { type: "memory", speaker: "我", text: "干嘛？" },
    { type: "memory", speaker: "周也", text: "让我看一眼 快两个月没见了" },
    { type: "memory", speaker: "我", text: "……胖了没有？" },
    { type: "memory", speaker: "周也", text: "瘦了 黑眼圈重了" },
    { type: "memory", speaker: "我", text: "读研就这样" },
    { type: "memory", speaker: "周也", text: "那你以后毕业了得补回来" },
    { type: "memory", speaker: "我", text: "必须得补 你监督我" },
    { type: "memory", speaker: "周也", text: "走吧 咱们去吃东西吧 饿死啦都 " },
    { type: "date", text: "2025年9月，他去北京" },
    { type: "system", text: "*(他到北京，她加班。他第二天就要回南京)*" },
    { type: "theirs", text: "抱歉宝宝今天酷酷加班" },
    { type: "mine", text: "没事我想你了" },
    { type: "theirs", text: "你什么时候到的？你等了多久？" },
    { type: "mine", text: "没多久 十几分钟吧" },
    { type: "theirs", text: "你骗谁呢" },
    { type: "mine", text: "好吧。下午六点到的。" },
    { type: "theirs", text: "两个小时？？你为什么不跟我说？" },
    { type: "mine", text: "想给你个惊喜 你不是在忙嘛，我等等就好啦" },
    { type: "mine", text: "饿不饿？咱们去吃个潇湘阁？" },
    { type: "theirs", text: "走吧" },
    { type: "theirs", text: "你这次来待多久啊？" },
    { type: "mine", text: "明天早上六点多的高铁。" },
    { type: "theirs", text: "明天六点？？怎么这么着急？还有你今晚睡哪啊？" },
    { type: "mine", text: "我找个网吧对付一下 还要改论文呢 明天导师还要开组会" },
    { type: "theirs", text: "你真是……算了。下次来提前告诉我好不好？" },
    { type: "mine", text: "嗯嗯" },
    { type: "theirs", text: "我说真的 你提前告诉我，我好请假陪你" },
    { type: "mine", text: "你不是很忙吗，别请假了" },
    { type: "theirs", text: "你管我忙不忙。你来我就请" },
    { type: "mine", text: "嗯嗯下次提前说" },
    { type: "date", text: "2025年11月5日" },
    { type: "theirs", text: "[图片：输液室天花板] 有点微死了", image: true, imageSrc: "/assets/story/chat-infusion-ceiling-2025.png" },
    { type: "mine", text: "多喝点热水……不对，你在输液？什么情况？烧多少度了？" },
    { type: "theirs", text: "38.7。扁桃体发炎 没事" },
    { type: "mine", text: "有人陪你吗？" },
    { type: "theirs", text: "没有。一个人来的 护士挺好的，帮我倒了杯热水" },
    { type: "mine", text: "我帮你点个外卖？热粥什么的？" },
    { type: "theirs", text: "不用 输完液我自己买 你早点睡吧你明天还要早起" },
    { type: "mine", text: "我陪你聊会儿天" },
    { type: "theirs", text: "你明早不是有组会吗" },
    { type: "mine", text: "我组会睡" },
    { type: "theirs", text: "你睡一个试试 导师直接push你怎么办" },
    { type: "mine", text: "不睡不睡 正好我边陪你边看论文" },
    { type: "theirs", text: "好那你先发个论文摘要过来我检查一下" },
    { type: "mine", text: "你生病了还检查我？？" },
    { type: "theirs", text: "闲着也是闲着" },
    { type: "mine", text: "[图片：南京下雨] 南京又下雨了", image: true, imageSrc: "/assets/story/chat-nanjing-rain-2025.png" },
    { type: "theirs", text: "你还是老样子 包里放把伞会死嘛" },
    { type: "mine", text: "放了但上周拿出来用了忘放回去了" },
    { type: "theirs", text: "那你现在怎么办" },
    { type: "mine", text: "在图书馆等雨停" },
    { type: "theirs", text: "雨一时半会儿停不了 你看看有没有顺路的" },
    { type: "mine", text: "社恐" },
    { type: "theirs", text: "我帮你说？咱俩打个电话》" },
    { type: "mine", text: "你别……我这就去问" },
    { type: "theirs", text: "哈哈哈哈哈所以你可以的嘛。" },
    { type: "theirs", text: "[图片：北京街角\"南京大牌档\"] 今天路过这个。在门口站了一会儿。", image: true, imageSrc: "/assets/story/chat-nanjing-dapaidang-beijing-2025.png" },
    { type: "mine", text: "没进去尝尝嘛" },
    { type: "theirs", text: "没有 一个人没意思" },
    { type: "mine", text: "下次你来南京，我陪你去吃" },
    { type: "theirs", text: "下次什么时候" },
    { type: "mine", text: "看你" },
    { type: "theirs", text: "我不知道我下次什么时候能休个长假" },
    { type: "mine", text: "那你定个大概" },
    { type: "theirs", text: "大概……得快过年吧" },
    { type: "mine", text: "我等你" },
    { type: "theirs", text: "嗯 这话不错 截图了" },
    { type: "mine", text: "你截了好多图了" },
    { type: "theirs", text: "攒着 以后你不认账我就发出来" },
    { type: "mine", text: "我认账" },
    { type: "date", text: "2025年12月" },
    { type: "system", text: "*(视频通话，挂断后发来消息)*" },
    { type: "theirs", text: "我今天不想说话 你别打过来。" },
    { type: "mine", text: "怎么了？" },
    { type: "theirs", text: "没事 就是累了 让我自己待会儿" },
    { type: "mine", text: "好" },
    { type: "system", text: "*(过了十分钟)*" },
    { type: "mine", text: "你要是想说话，我在这儿" },
    { type: "system", text: "*(没有回复。)*" },
    { type: "mine", text: "那我先睡了 你好好休息" },
    { type: "system", text: "*(他等到凌晨一点。她没回。)*" }
  ],
  [
    { type: "date", text: "2026年1月27日" },
    { type: "system", text: "通话记录：4分32秒" },
    { type: "theirs", text: "我们最近话感觉越来越少了" },
    { type: "mine", text: "嗯" },
    { type: "theirs", text: "你总是只说\"嗯\"" },
    { type: "mine", text: "但我不知道该说些什么" },
    { type: "theirs", text: "我们以前不是这样的" },
    { type: "mine", text: "以前我们在一起" },
    { type: "theirs", text: "所以现在不在一起了，你就不说话了？" },
    { type: "mine", text: "你工作那么累，我即使说些什么也帮不上忙" },
    { type: "theirs", text: "我不要你帮忙。我就想听你说句话" },
    { type: "mine", text: "但是我说了你就不累了？" },
    { type: "date", text: "2026年1月28日" },
    { type: "theirs", text: "那要不……我们先停一停吧" },
    { type: "mine", text: "好" },
    { type: "theirs", text: "你就说\"好\"？" },
    { type: "mine", text: "你说了算" },
    { type: "theirs", text: "我真服了。你知不知道我之前想了多久？我告诉自己，你今天要是能说一句\"我不想分开\"，我就当什么都没发生。结果你只说了一个\"好\"。" },
    { type: "mine", text: "我不知道该怎么留你。你在北京过得很累，但我什么都帮不上" },
    { type: "theirs", text: "我要的不是你帮我。是你在" },
    { type: "mine", text: "我在啊" },
    { type: "theirs", text: "你在哪？你在南京，我在北京。你跟我说\"好\"的时候，你在哪？" },
    { type: "mine", text: "对不起" },
    { type: "theirs", text: "别道歉了 你永远在道歉 你从来不提前说什么 你永远等我先开口 我累了" },
    { type: "theirs", text: "那我们就这样吧" },
    { type: "system", text: "整个通话里，你没有说过一句\"我不想分开\"" }
  ]
];

const defaultChatImage = "/assets/story/postcard-wutong-avenue.png";

function splitImageMessageText(text: string) {
  const match = text.match(/^\[图片：([^\]]+)\]\s*(.*)$/);
  return {
    label: match ? match[1] : "聊天图片",
    caption: match?.[2] ?? text
  };
}

function WechatConversation({
  liveMessages,
  liveTyping = false,
  memoryChapter = 0,
  savedMemoryRevealCount = 0,
  onMemoryRevealCountChange,
  onMemoryChapterCompleteChange,
  memoryChapterCompleted = false,
  stageMode = false,
  memoryAdvanceLabel,
  onMemoryAdvance,
}: {
  liveMessages?: LiveChatMessage[];
  liveTyping?: boolean;
  memoryChapter?: number;
  savedMemoryRevealCount?: number;
  onMemoryRevealCountChange?: (count: number) => void;
  onMemoryChapterCompleteChange?: (complete: boolean) => void;
  memoryChapterCompleted?: boolean;
  stageMode?: boolean;
  memoryAdvanceLabel?: string;
  onMemoryAdvance?: () => void;
}) {
  const conversationRef = useRef<HTMLDivElement>(null);
  const rawMemoryConversation = memoryConversations[Math.min(memoryChapter, memoryConversations.length - 1)];
  const currentMemoryConversation = useMemo(() => rawMemoryConversation.flatMap((message) => {
    if (!("image" in message) || !message.image) return [message];

    const imageText = splitImageMessageText(message.text);
    return [
      { ...message, text: `[图片：${imageText.label}]` },
      ...(imageText.caption ? [{ type: message.type, text: imageText.caption }] : [])
    ];
  }), [rawMemoryConversation]);
  const [memoryRevealCount, setMemoryRevealCount] = useState(
    memoryChapterCompleted ? currentMemoryConversation.length : Math.min(savedMemoryRevealCount, currentMemoryConversation.length)
  );
  const [enlargedImage, setEnlargedImage] = useState<{ src: string; label: string } | null>(null);
  const pendingMemoryMessage = currentMemoryConversation[memoryRevealCount];
  const waitingForHistoricalReply = !liveMessages && pendingMemoryMessage?.type === "mine";
  const memoryChapterComplete = Boolean(liveMessages) || memoryRevealCount >= currentMemoryConversation.length;

  useEffect(() => {
    if (!liveMessages || !conversationRef.current) return;
    conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
  }, [liveMessages, liveTyping]);

  useEffect(() => {
    setMemoryRevealCount(
      memoryChapterCompleted ? currentMemoryConversation.length : Math.min(savedMemoryRevealCount, currentMemoryConversation.length)
    );
  }, [currentMemoryConversation.length, memoryChapter, memoryChapterCompleted, savedMemoryRevealCount]);

  useEffect(() => {
    if (liveMessages) return;
    onMemoryRevealCountChange?.(memoryRevealCount);
  }, [liveMessages, memoryRevealCount, onMemoryRevealCountChange]);

  useEffect(() => {
    onMemoryChapterCompleteChange?.(memoryChapterComplete);
  }, [memoryChapterComplete, onMemoryChapterCompleteChange]);

  useEffect(() => {
    if (!conversationRef.current) return;
    conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
  }, [memoryRevealCount, memoryChapter]);

  useEffect(() => {
    if (liveMessages || memoryChapterComplete || waitingForHistoricalReply) return;

    const delay = memoryRevealCount === 0 ? 1600 : 1950;
    const timer = window.setTimeout(() => {
      setMemoryRevealCount((count) => Math.min(count + 1, currentMemoryConversation.length));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [currentMemoryConversation.length, liveMessages, memoryChapterComplete, memoryRevealCount, waitingForHistoricalReply]);

  function sendHistoricalReply() {
    if (!waitingForHistoricalReply) return;
    setMemoryRevealCount((count) => Math.min(count + 1, currentMemoryConversation.length));
  }

  function renderImageMessage(text: string, src = defaultChatImage, keyPrefix: string, mine = false) {
    const imageText = splitImageMessageText(text);

    return (
      <Fragment key={keyPrefix}>
        <button
          className={cx("bubble", mine ? "mine" : "theirs", "imageBubble", "clickableImageBubble")}
          style={{ "--chat-image": `url(${src})` } as CSSProperties}
          onClick={() => setEnlargedImage({ src, label: imageText.label })}
          type="button"
          aria-label={`放大查看${imageText.label}`}
        />
      </Fragment>
    );
  }

  return (
    <>
      <div className={cx("wechatConversationScreen", waitingForHistoricalReply && "hasHistoricalReply")} ref={conversationRef}>
        {liveMessages ? (
          <>
            <div className="chatDate liveChatDate">2025年8月12日 22:16</div>
            {renderImageMessage("[图片：排班截图]", defaultChatImage, "live-schedule-image")}
            <p className="bubble theirs">买了。周四下午到南京南。</p>
            <div className="chatDate liveChatDate">22:18</div>
            <p className="bubble theirs liveIncomingMessage">你别放我鸽子啊。</p>
            {liveMessages.map((message, index) => (
              message.speaker === "system" ? (
                <p className="bubble systemBubble liveReplySystem" key={`${message.text}-${index}`}>{message.text}</p>
              ) : message.image ? (
                renderImageMessage(message.text, defaultChatImage, `${message.text}-${index}`, message.speaker === "me")
              ) : (
                <p
                  className={cx("bubble", message.speaker === "me" ? "mine" : "theirs", "liveReplyBubble")}
                  key={`${message.text}-${index}`}
                >
                  {message.text}
                </p>
              )
            ))}
            {liveTyping && <p className="bubble theirs liveTypingBubble" aria-label="周也正在输入"><i /><i /><i /></p>}
          </>
        ) : (
          <>
            {memoryRevealCount === 0 && <p className="bubble systemBubble">手机亮了一下。周也发来新的消息。</p>}
            {currentMemoryConversation.slice(0, memoryRevealCount).map((message, index) => (
              message.type === "date" ? (
                <div className="chatDate" key={`${message.text}-${index}`}>{message.text}</div>
              ) : message.type === "system" ? (
                <p className="bubble systemBubble" key={`${message.text}-${index}`}>{message.text}</p>
              ) : message.type === "narration" ? (
                <p className="phoneMemoryNarration" key={`${message.text}-${index}`}>{message.text}</p>
              ) : message.type === "memory" ? (
                <p className={cx("phoneMemoryRecallLine", message.speaker === "我" && "me")} key={`${message.text}-${index}`}>
                  <b>{message.speaker}</b>
                  <span>{message.text}</span>
                </p>
              ) : "image" in message && message.image ? (
                renderImageMessage(
                  message.text,
                  "imageSrc" in message && message.imageSrc ? message.imageSrc : defaultChatImage,
                  `${message.text}-${index}`,
                  message.type === "mine"
                )
              ) : (
                <p
                  className={cx("bubble", message.type)}
                  key={`${message.text}-${index}`}
                >
                  {message.text}
                </p>
              )
            ))}
          </>
        )}
      </div>
      {stageMode && !liveMessages && memoryChapterCompleted && memoryAdvanceLabel && onMemoryAdvance && (
        <button className="historicalNextButton" onClick={onMemoryAdvance} type="button">
          {memoryAdvanceLabel}
        </button>
      )}
      <div className="wechatInputBar">
        <span>＋</span>
        {waitingForHistoricalReply && pendingMemoryMessage ? (
          <button className="wechatReplyInputButton" onClick={sendHistoricalReply} type="button">
            {pendingMemoryMessage.text}
          </button>
        ) : (
          <b>{stageMode && !liveMessages ? memoryChapterCompleted ? "这段旧对话已读完" : "" : "说点什么"}</b>
        )}
        <span>☺</span>
      </div>
      {enlargedImage && (
        <button className="chatImagePreviewOverlay" onClick={() => setEnlargedImage(null)} type="button" aria-label="关闭图片预览">
          <img src={enlargedImage.src} alt={enlargedImage.label} draggable={false} />
        </button>
      )}
    </>
  );
}

export function PhoneMemory({
  markSeen,
  initialApp = "home",
  compact = false,
  stageMode = false,
  liveMessages,
  liveTyping,
  memoryChapter = 0,
  savedMemoryRevealCount = 0,
  onMemoryRevealCountChange,
  onMemoryChapterCompleteChange,
  memoryChapterCompleted = false,
  memoryAdvanceLabel,
  onMemoryAdvance,
}: Props) {
  const [phoneApp, setPhoneApp] = useState<PhoneApp>(initialApp);
  const [wechatTab, setWechatTab] = useState<WechatTab>("chats");

  function openPhoneApp(app: PhoneApp) {
    if (app === "wechat") {
      setWechatTab("chats");
    }
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
              <WechatList openChat={() => openPhoneApp("zhouye")} activeTab={wechatTab} setActiveTab={setWechatTab} />
              <WechatTabs activeTab={wechatTab} setActiveTab={setWechatTab} />
            </div>
          )}

          {phoneApp === "zhouye" && (
            <div className="phoneAppView phoneConversation wechatChatApp">
              <PhoneTop title="周也" onBack={() => setPhoneApp("wechat")} dark />
              <WechatConversation
                liveMessages={liveMessages}
                liveTyping={liveTyping}
                memoryChapter={memoryChapter}
                savedMemoryRevealCount={savedMemoryRevealCount}
                onMemoryRevealCountChange={onMemoryRevealCountChange}
                onMemoryChapterCompleteChange={onMemoryChapterCompleteChange}
                memoryChapterCompleted={memoryChapterCompleted}
                stageMode={stageMode}
                memoryAdvanceLabel={memoryAdvanceLabel}
                onMemoryAdvance={onMemoryAdvance}
              />
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
