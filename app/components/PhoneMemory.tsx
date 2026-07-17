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

const memoryConversations = [
  [
    { type: "date", text: "2024年3月5日" },
    { type: "theirs", text: "[图片：小龙虾] 这个好吃下次我们一起去！！！", image: true, imageSrc: "/assets/story/chat-crayfish-2024.png" },
    { type: "thiers", text: "你剥虾我负责吃😋" },
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
    { type: "date", text: "第三阶段：2025年7月-12月" },
    { type: "theirs", text: "[图片：工位] 入职第一天。工位好小，显示器好大。", image: true, imageSrc: "/assets/story/chat-workstation-2025.png" },
    { type: "mine", text: "你坐下去还看得到人吗" },
    { type: "theirs", text: "看得到。我在显示器旁边贴了个便利贴写\"别驼背\"。" },
    { type: "mine", text: "有用吗" },
    { type: "theirs", text: "没。现在已经驼了。" },
    { type: "mine", text: "那我每天提醒你。" },
    { type: "theirs", text: "你最好记得。" },
    { type: "theirs", text: "[图片：钉钉排班，休周二] 下周排班出来了，休周二。", image: true, imageSrc: "/assets/story/chat-schedule-tuesday-2025.png" },
    { type: "mine", text: "周二？不是周末啊" },
    { type: "theirs", text: "轮休。新人休不了周末。我能怎么办。" },
    { type: "mine", text: "那你周二干嘛" },
    { type: "theirs", text: "躺着。你周二有课吗" },
    { type: "mine", text: "有。满课。" },
    { type: "theirs", text: "那你躺着。咱俩隔着屏幕一起躺。" },
    { type: "mine", text: "好。周二下午三点，一起躺。" },
    { type: "theirs", text: "三点不行，我两点到四点睡觉。" },
    { type: "mine", text: "那你睡醒叫我。" },
    { type: "theirs", text: "你又不回。" },
    { type: "mine", text: "我回。把手机放枕头边上。" },
    { type: "theirs", text: "行。信你一次。" },
    { type: "date", text: "2025年8月，她来南京" },
    { type: "theirs", text: "[图片：钉钉排班，休周四周五] 下周休周四周五！！！我周四晚上到南京！！！你别放我鸽子啊！！！", image: true, imageSrc: "/assets/story/chat-schedule-nanjing-2025.png" },
    { type: "mine", text: "不会不会。几点到？" },
    { type: "theirs", text: "晚上八点。南京南。" },
    { type: "mine", text: "我去接你。" },
    { type: "theirs", text: "你说的。你要是敢临时开会……" },
    { type: "mine", text: "我就把导师拉黑。" },
    { type: "theirs", text: "你敢吗" },
    { type: "mine", text: "不敢。但我会想办法溜的。" },
    { type: "system", text: "*(当天)*" },
    { type: "theirs", text: "上车了。你到南京南了吗？" },
    { type: "mine", text: "实验室还没走……导师临时开会。" },
    { type: "theirs", text: "……你上次也是\"临时\"" },
    { type: "mine", text: "真的。我也没想到。" },
    { type: "theirs", text: "行吧。开完赶紧来。" },
    { type: "mine", text: "嗯。" },
    { type: "system", text: "*(两个小时后)*" },
    { type: "theirs", text: "[图片：花坛] 我到了。", image: true, imageSrc: "/assets/story/chat-flowerbed-nanjing-south-2025.png" },
    { type: "mine", text: "还在开会。" },
    { type: "theirs", text: "嗯。" },
    { type: "mine", text: "你要不要先去吃点东西？" },
    { type: "theirs", text: "不吃。等你。" },
    { type: "mine", text: "别饿着。" },
    { type: "theirs", text: "饿不着。你赶紧的。" },
    { type: "system", text: "*(又过了一个小时)*" },
    { type: "theirs", text: "你开完了吗" },
    { type: "mine", text: "快了快了" },
    { type: "theirs", text: "南京蚊子真多……咬了五个包了" },
    { type: "mine", text: "你别坐那儿！那个花坛边上草多" },
    { type: "theirs", text: "我哪儿也不想去。就想等你来了看见你。" },
    { type: "mine", text: "马上。五分钟。" },
    { type: "theirs", text: "你五分钟前也说的五分钟。" },
    { type: "mine", text: "这次是真的。出来了。" },
    { type: "system", text: "*(又过了四十分钟)*" },
    { type: "mine", text: "你在哪？我到南京南了。" },
    { type: "theirs", text: "花坛这儿。还在这儿。" },
    { type: "mine", text: "我跑过来。" },
    { type: "system", text: "*(他跑过去。她站起来。)*" },
    { type: "theirs", text: "你来了。" },
    { type: "mine", text: "对不起对不起。" },
    { type: "theirs", text: "没事。" },
    { type: "mine", text: "饿不饿？" },
    { type: "theirs", text: "饿。" },
    { type: "mine", text: "走，吃汤包去。" },
    { type: "theirs", text: "等等。你先站那儿别动。" },
    { type: "mine", text: "干嘛？" },
    { type: "theirs", text: "让我看一眼。快两个月没见了。" },
    { type: "mine", text: "……胖了没有？" },
    { type: "theirs", text: "瘦了。黑眼圈重了。" },
    { type: "mine", text: "读研就这样。" },
    { type: "theirs", text: "那你以后毕业了得补回来。" },
    { type: "mine", text: "补。你监督我。" },
    { type: "theirs", text: "走吧。带我去吃汤包。饿死了。还有——你知道我提前多久申请的？十二天。然后你让我在花坛边坐了快两个小时。" },
    { type: "mine", text: "我知道错了。" },
    { type: "theirs", text: "下次开会你跟你导师说\"我女朋友要来\"。" },
    { type: "mine", text: "导师又不认我女朋友。" },
    { type: "theirs", text: "那你跟导师说\"我女朋友打我\"。" },
    { type: "mine", text: "你打吗？" },
    { type: "theirs", text: "看情况。" },
    { type: "date", text: "2025年9月，他去北京（备忘录片段转聊天记录）" },
    { type: "system", text: "*(他买了票，没告诉她。从下午四点半等到晚上九点多。)*" },
    { type: "theirs", text: "你怎么来了？？？" },
    { type: "mine", text: "想你了啊。" },
    { type: "theirs", text: "你什么时候到的？你等了多久？" },
    { type: "mine", text: "没多久。几十分钟吧。" },
    { type: "theirs", text: "你骗谁呢。你身上一股地铁味。" },
    { type: "mine", text: "好吧。下午四点半到的。" },
    { type: "theirs", text: "五个小时？？你为什么不跟我说？" },
    { type: "mine", text: "想给你个惊喜。你不是加班嘛，我就等着呗。" },
    { type: "theirs", text: "可我昨天根本没时间陪你。我现在也还在加班你知道吗。" },
    { type: "mine", text: "我知道。没事，见到了就行。" },
    { type: "theirs", text: "……你这个人真的。" },
    { type: "mine", text: "饿不饿？下去吃个关东煮？" },
    { type: "theirs", text: "走。" },
    { type: "system", text: "*(便利店门口，坐了十分钟。)*" },
    { type: "theirs", text: "你明天几点走？" },
    { type: "mine", text: "早上六点的高铁。" },
    { type: "theirs", text: "六点？？那你今晚睡哪？" },
    { type: "mine", text: "北京南站候车室呗。睡一觉就到了。" },
    { type: "theirs", text: "你真是……算了。下次来提前告诉我。知道没有？" },
    { type: "mine", text: "知道。" },
    { type: "theirs", text: "我说真的。你提前告诉我，我好请假陪你。" },
    { type: "mine", text: "你不是很忙吗，别请假了。" },
    { type: "theirs", text: "你管我忙不忙。你来我就请。" },
    { type: "mine", text: "那行。下次提前说。" },
    { type: "theirs", text: "你记住。你要是再这样突然跑过来等五个小时，我就——" },
    { type: "mine", text: "就什么？" },
    { type: "theirs", text: "我就下次也突然跑回南京。看谁急。" },
    { type: "mine", text: "你赢了。" },
    { type: "system", text: "*(第二天早上六点，高铁上)*" },
    { type: "mine", text: "到南京了。" },
    { type: "theirs", text: "你走了？？？也不说一声？？？" },
    { type: "mine", text: "你还在睡。没忍心叫你。" },
    { type: "theirs", text: "我醒了啊！我五点五十醒的！你人呢！" },
    { type: "mine", text: "已经在高铁上了。别生气。下次不这样了。" },
    { type: "theirs", text: "你上次也这么说。算了，睡吧你。" },
    { type: "date", text: "2025年10月-12月" },
    { type: "theirs", text: "[图片：输液室天花板] 发烧了。", image: true, imageSrc: "/assets/story/chat-infusion-ceiling-2025.png" },
    { type: "mine", text: "多喝热水……不对，你在输液？什么情况？多少度？" },
    { type: "theirs", text: "38.7。扁桃体发炎。没事。" },
    { type: "mine", text: "有人陪你吗？" },
    { type: "theirs", text: "没有。一个人来的。护士挺好的，帮我倒了杯水。" },
    { type: "mine", text: "我帮你点个外卖？热粥什么的？" },
    { type: "theirs", text: "不用。输完液我自己买。你早点睡吧。" },
    { type: "mine", text: "我陪你聊会儿。" },
    { type: "theirs", text: "你明天不是有组会吗" },
    { type: "mine", text: "翘了。" },
    { type: "theirs", text: "你翘一个试试。" },
    { type: "mine", text: "那我不翘。我边陪你边看论文。" },
    { type: "theirs", text: "行。那你先发个论文题目过来我检查一下。" },
    { type: "mine", text: "你生病了还检查我？？" },
    { type: "theirs", text: "闲着也是闲着。" },
    { type: "mine", text: "[图片：南京下雨] 南京又下雨了。没带伞。", image: true, imageSrc: "/assets/story/chat-nanjing-rain-2025.png" },
    { type: "theirs", text: "你还是老样子。包里放把伞会死吗" },
    { type: "mine", text: "放了。上周拿出来用了忘放回去了。" },
    { type: "theirs", text: "那你现在怎么办" },
    { type: "mine", text: "在图书馆等雨停。" },
    { type: "theirs", text: "雨停不了。你问旁边人借一把。" },
    { type: "mine", text: "社恐。" },
    { type: "theirs", text: "我帮你借？我给他发微信？" },
    { type: "mine", text: "你怎么发。" },
    { type: "theirs", text: "我发\"你好我男朋友在图书馆没带伞你能借他一把吗\"" },
    { type: "mine", text: "你别……我这就去问。" },
    { type: "theirs", text: "哈哈哈。所以你是能开口的嘛。" },
    { type: "mine", text: "借到了。你说得对，是我自己的问题。" },
    { type: "theirs", text: "你终于承认了。" },
    { type: "mine", text: "嗯。我承认。" },
    { type: "theirs", text: "[图片：北京街角\"南京大牌档\"] 今天路过这个。在门口站了一会儿。", image: true, imageSrc: "/assets/story/chat-nanjing-dapaidang-beijing-2025.png" },
    { type: "mine", text: "进去了吗" },
    { type: "theirs", text: "没有。一个人没意思。" },
    { type: "mine", text: "下次你来南京，我陪你去吃。" },
    { type: "theirs", text: "下次什么时候" },
    { type: "mine", text: "你定。" },
    { type: "theirs", text: "我不知道我下次什么时候能休。" },
    { type: "mine", text: "那你定个大概。" },
    { type: "theirs", text: "大概……明年吧。" },
    { type: "mine", text: "那就明年。我等你。" },
    { type: "theirs", text: "你等我。嗯。这话不错。截图了。" },
    { type: "mine", text: "你截了好多图了。" },
    { type: "theirs", text: "攒着。以后你不认账我就发出来。" },
    { type: "mine", text: "我认账。" },
    { type: "date", text: "2025年12月" },
    { type: "system", text: "*(视频通话，挂断后发来消息)*" },
    { type: "theirs", text: "我今天不想装了。你别打过来。" },
    { type: "mine", text: "怎么了？" },
    { type: "theirs", text: "没事。就是累了。让我自己待会儿。" },
    { type: "mine", text: "好。" },
    { type: "system", text: "*(过了十分钟)*" },
    { type: "mine", text: "你要是想说话，我在这儿。" },
    { type: "system", text: "*(没有回复。)*" },
    { type: "mine", text: "那我先睡了。你好好休息。" },
    { type: "system", text: "*(他等到凌晨一点。她没回。)*" }
  ],
  [
    { type: "date", text: "第四阶段：2026年1月" },
    { type: "system", text: "通话记录：4分32秒" },
    { type: "theirs", text: "我们最近话越来越少了。" },
    { type: "mine", text: "嗯。" },
    { type: "theirs", text: "你总是\"嗯\"。" },
    { type: "mine", text: "我不知道说什么。" },
    { type: "theirs", text: "你以前不是这样的。" },
    { type: "mine", text: "以前我们在一起。" },
    { type: "theirs", text: "所以现在不在一起了，你就不说话了？" },
    { type: "mine", text: "你工作那么累，我说什么也帮不上忙。" },
    { type: "theirs", text: "我不要你帮忙。我就想听你说句话。" },
    { type: "mine", text: "我说了你就不累了？" },
    { type: "system", text: "*(沉默很久)*" },
    { type: "theirs", text: "要不……我们先分开吧。" },
    { type: "mine", text: "好。" },
    { type: "theirs", text: "你就说\"好\"？" },
    { type: "mine", text: "你说了算。" },
    { type: "theirs", text: "……我真服了。你知不知道我打这个电话之前想了多久？我告诉自己，你今天要是能说一句\"我不想分开\"，我就当什么都没发生。结果你只说了一个\"好\"。" },
    { type: "mine", text: "我不知道该怎么留你。你在北京过得那么累，我什么都帮不上。" },
    { type: "theirs", text: "我要的不是你帮我。是你在。" },
    { type: "mine", text: "我在啊。" },
    { type: "theirs", text: "你在哪？你在南京，我在北京。你跟我说\"好\"的时候，你在哪？" },
    { type: "mine", text: "……对不起。" },
    { type: "theirs", text: "别道歉了。你永远在道歉。你从来不提前说什么。你永远等我先开口。我累了。" },
    { type: "mine", text: "我知道。" },
    { type: "theirs", text: "那就这样吧。挂了。" },
    { type: "system", text: "整个通话里，你没有说过一句\"我不想分开\"。" }
  ]
] as const;

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
          <b>{stageMode && !liveMessages ? memoryChapterCompleted ? "这段旧对话已读完" : "等待当年的回复" : "说点什么"}</b>
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
