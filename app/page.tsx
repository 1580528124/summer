"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ItemId =
  | "monitor"
  | "lol"
  | "qq"
  | "phone"
  | "wechat"
  | "netease"
  | "mp3"
  | "tv"
  | "remote"
  | "worldcup"
  | "movie"
  | "latiao"
  | "tea"
  | "spinner"
  | "examBook"
  | "novel"
  | "calendar"
  | "lamp"
  | "window"
  | "fan"
  | "trash";

type Popup = {
  title: string;
  tag: string;
  body: string;
  detail?: string;
  kind?: "desktop" | "phone" | "music" | "tv" | "calendar" | "egg";
};

type PhoneApp = "home" | "wechat" | "netease" | "weibo" | "douyin" | "album" | "calendar";

const items: Record<ItemId, Popup> = {
  monitor: {
    title: "Windows 10 桌面亮了",
    tag: "电脑桌区域 / 单击",
    body: "屏幕从黑色里醒过来，壁纸是低饱和的极光渐变。桌面上挤着英雄联盟、Steam、4399游戏盒和一个叫“2018暑假作业”的文件夹。",
    detail: "右下角还跳着一条 QQ 提示：您有 3 条未读消息。",
    kind: "desktop"
  },
  lol: {
    title: "英雄联盟图标",
    tag: "电脑桌区域 / 双击",
    body: "2018年5月20日，RNG 在巴黎捧起 MSI 冠军奖杯。那时候很多人都觉得，今年会是 LPL 最有希望的一年。",
    detail: "到了 11 月 3 日，IG 在仁川夺冠。夏天没等到的答案，秋天给了所有人。",
    kind: "desktop"
  },
  qq: {
    title: "QQ 未读消息",
    tag: "电脑桌区域 / 单击",
    body: "群聊窗口弹出：今晚世界杯谁看？法国稳了。姆巴佩太快了吧。你看着这些短句，突然想起那种一边看比赛一边刷消息的深夜。",
    kind: "desktop"
  },
  phone: {
    title: "iPhone X 锁屏",
    tag: "手机区域 / 单击",
    body: "锁屏亮起：2018年6月14日 22:34。你向上滑动，微信、微博、抖音、网易云音乐排在第一屏。",
    detail: "透明手机壳已经发黄，但那一年你觉得它很新。",
    kind: "phone"
  },
  wechat: {
    title: "朋友圈刷新中",
    tag: "手机区域 / 单击",
    body: "朋友圈里有人发：法国队赢了！4:2！！！有人转发锦鲤，有人在说药神看哭了，还有人把毕业照设置成了背景图。",
    kind: "phone"
  },
  netease: {
    title: "2018 夏天听歌报告",
    tag: "手机区域 / 单击",
    body: "歌单里躺着《起风了》《纸短情长》《白羊》《离人愁》。没有真的播放出来，但你已经听见了那个夏天的开头。",
    detail: "音乐在这个房间里不是背景，是一张可以被点击的记忆地图。",
    kind: "music"
  },
  mp3: {
    title: "旧 MP3 播放器",
    tag: "数码区 / 单击",
    body: "屏幕显示：声景一，青春与告别。进度条缓慢移动，耳机线绕过桌角，像把时间也缠住了。",
    detail: "这里先用模拟播放器，后续可以接真实音频资源和音量滑块。",
    kind: "music"
  },
  tv: {
    title: "电视机亮起",
    tag: "娱乐区 / 单击",
    body: "电视里默认是世界杯决赛的模拟画面。红蓝色块、滚动字幕、轻微雪花点，让它像一段刚从硬盘里找回来的旧视频。",
    kind: "tv"
  },
  remote: {
    title: "遥控器换台",
    tag: "娱乐区 / 单击",
    body: "频道切走了。世界杯、创造101、镇魂、奥运十周年新闻、我不是药神预告片轮流闪过。不是每段都完整，但每段都像 2018 的一个入口。",
    kind: "tv"
  },
  worldcup: {
    title: "世界杯赛程海报",
    tag: "海报墙 / 悬停或单击",
    body: "手写笔迹写着：决赛 7.15，法国 4:2 克罗地亚。夏天的深夜，因为一场球赛突然有了全世界都醒着的错觉。",
    kind: "tv"
  },
  movie: {
    title: "《我不是药神》海报",
    tag: "海报墙 / 单击",
    body: "2018年7月5日上映，票房 30.7 亿。你不一定记得和谁去看的，但很可能记得走出影院时沉默了一会儿。",
    kind: "tv"
  },
  latiao: {
    title: "卫龙辣条包装",
    tag: "零食杂物区 / 可拖拽",
    body: "2018年，卫龙辣条火到美国。你当年为了买一包，可能真的跑遍了学校小卖部。",
    detail: "试着把它拖到键盘上。",
    kind: "egg"
  },
  tea: {
    title: "维他柠檬茶空罐",
    tag: "零食杂物区 / 单击",
    body: "易拉罐已经空了，甜味和柠檬味却像还在。2018年的快乐水，常常出现在晚自习、网吧和宿舍桌面上。",
    kind: "egg"
  },
  spinner: {
    title: "指尖陀螺转起来了",
    tag: "零食杂物区 / 单击",
    body: "它在弹窗里旋转，像一个很小的夏天。那一年很多男生口袋里都有一个，说是解压，其实只是想让手里有点事做。",
    kind: "egg"
  },
  examBook: {
    title: "五年高考三年模拟",
    tag: "杂物区 / 单击",
    body: "随机翻到一句作文题：时代与个人。你看着题目，突然发现这些年自己一直在写同一道题。",
    detail: "2018年6月7日，全国 975 万考生走进考场。",
    kind: "calendar"
  },
  novel: {
    title: "《全职高手》小说",
    tag: "杂物区 / 单击",
    body: "书页停在荣耀开服的段落。2018年，同名动画第二季还在路上，叶修像一直坐在屏幕后面等你回来。",
    kind: "desktop"
  },
  calendar: {
    title: "2018年6月日历",
    tag: "时间区 / 单击",
    body: "红圈标了三个日子：6月7日高考，6月14日世界杯开幕，6月23日创造101决赛。另一个空白日期旁边写着：毕业典礼。",
    kind: "calendar"
  },
  lamp: {
    title: "台灯开关",
    tag: "环境区 / 单击",
    body: "暖黄色灯光铺到桌面上，显示器边框、辣条包装和课本页脚都变得清楚了一点。深夜房间真正开始呼吸。",
    kind: "egg"
  },
  window: {
    title: "窗外天色变了",
    tag: "环境区 / 单击",
    body: "窗外从深蓝慢慢泛出橙色。你在这个房间里待了一整夜，蝉鸣没有停，只是城市快醒了。",
    kind: "calendar"
  },
  fan: {
    title: "小风扇嗡嗡转",
    tag: "隐藏区 / 单击",
    body: "风扇转起来，风铃轻轻晃。2018年的夏天，热得只能靠一台小风扇和一杯冰饮料硬撑。",
    kind: "egg"
  },
  trash: {
    title: "垃圾桶里的纸条",
    tag: "隐藏区 / 单击",
    body: "一张皱巴巴的纸条被翻出来，上面写着：毕业快乐，前程似锦。——2018.6.20",
    kind: "egg"
  }
};

const channels = ["世界杯决赛", "创造101", "镇魂", "奥运十周年", "药神预告"];

type MusicHandle = {
  audio?: HTMLAudioElement;
  context?: AudioContext;
  timers: ReturnType<typeof setInterval>[];
  nodes: AudioScheduledSourceNode[];
};

function PhoneTop({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="phoneAppTop">
      <button onClick={onBack} type="button">‹</button>
      <strong>{title}</strong>
      <span />
    </header>
  );
}

export default function Home() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [phoneApp, setPhoneApp] = useState<PhoneApp>("home");
  const [visited, setVisited] = useState<ItemId[]>([]);
  const [channel, setChannel] = useState(0);
  const [lampOn, setLampOn] = useState(true);
  const [daybreak, setDaybreak] = useState(false);
  const [fanOn, setFanOn] = useState(false);
  const [lampClicks, setLampClicks] = useState(0);
  const [windowClicks, setWindowClicks] = useState(0);
  const [eggs, setEggs] = useState<string[]>([]);
  const [dragging, setDragging] = useState<ItemId | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const musicRef = useRef<MusicHandle | null>(null);

  const progress = Math.round((visited.length / Object.keys(items).length) * 100);

  const roomClass = useMemo(() => {
    return ["room", lampOn ? "lampOn" : "lampOff", daybreak ? "daybreak" : "night", fanOn ? "fanOn" : ""].join(" ");
  }, [lampOn, daybreak, fanOn]);

  function openItem(id: ItemId) {
    if (id === "phone" || id === "wechat" || id === "netease") {
      setVisited((current) => (current.includes(id) ? current : [...current, id]));
      setPhoneApp(id === "wechat" ? "wechat" : id === "netease" ? "netease" : "home");
      setPopup(items.phone);
      return;
    }

    if (id === "remote") {
      setChannel((current) => (current + 1) % channels.length);
    }
    if (id === "lamp") {
      const next = lampClicks + 1;
      setLampClicks(next);
      setLampOn((current) => !current);
      if (next >= 5) triggerEgg("台灯闪了三下：2018年的深夜，你也是这样熬夜的。");
    }
    if (id === "window") {
      const next = windowClicks + 1;
      setWindowClicks(next);
      setDaybreak((current) => !current);
      if (next >= 3) triggerEgg("窗外忽然放起烟花：2018年夏天，你也在某个夜晚看过烟花吗？");
    }
    if (id === "fan") setFanOn((current) => !current);

    setVisited((current) => (current.includes(id) ? current : [...current, id]));
    setPopup(items[id]);
  }

  function triggerEgg(message: string) {
    setEggs((current) => (current.includes(message) ? current : [...current, message]));
    setPopup({ title: "隐藏彩蛋", tag: "特殊触发", body: message, kind: "egg" });
  }

  function handleDrop(target: "keyboard" | "tvDock" | "mp3Dock") {
    if (dragging === "latiao" && target === "keyboard") {
      triggerEgg("2018年，你一边吃辣条一边打 LOL，油都蹭到键盘上了。");
    } else if (dragging === "phone" && target === "tvDock") {
      triggerEgg("2018年的夏天，你一边看世界杯一边刷微博，手机比电视还忙。");
    } else if (dragging === "phone" && target === "mp3Dock") {
      triggerEgg("2018年，你用手机听歌，用 MP3 显得很复古。两种时代感在桌面上碰了一下。");
    }
    setDragging(null);
  }

  function scheduleTone(
    context: AudioContext,
    destination: AudioNode,
    frequency: number,
    start: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    attack = 0.018,
    release = 0.18,
    pan = 0
  ) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const panner = context.createStereoPanner();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    panner.pan.setValueAtTime(pan, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(volume, start + attack);
    gain.gain.setValueAtTime(volume * 0.72, start + Math.max(attack, duration - release));
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    oscillator.connect(gain);
    gain.connect(panner);
    panner.connect(destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  }

  function scheduleKick(context: AudioContext, destination: AudioNode, start: number) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(96, start);
    oscillator.frequency.exponentialRampToValueAtTime(42, start + 0.18);
    gain.gain.setValueAtTime(0.09, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(start);
    oscillator.stop(start + 0.24);
  }

  function scheduleNoiseHit(context: AudioContext, destination: AudioNode, buffer: AudioBuffer, start: number, duration: number, volume: number, filterFrequency: number, pan = 0) {
    const source = context.createBufferSource();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const panner = context.createStereoPanner();

    source.buffer = buffer;
    filter.type = "highpass";
    filter.frequency.setValueAtTime(filterFrequency, start);
    panner.pan.setValueAtTime(pan, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    panner.connect(destination);
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  function stopMusic() {
    if (!musicRef.current) return;

    musicRef.current.timers.forEach((timer) => clearInterval(timer));
    musicRef.current.nodes.forEach((node) => {
      try {
        node.stop();
      } catch {
        // The browser may have already stopped a scheduled source.
      }
    });
    if (musicRef.current.audio) {
      musicRef.current.audio.pause();
      musicRef.current.audio.currentTime = 0;
    }
    if (musicRef.current.context) {
      void musicRef.current.context.close();
    }
    musicRef.current = null;
    setMusicOn(false);
    setMusicBlocked(false);
  }

  function startSoundscape() {
    const AudioContextClass = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const musicBus = context.createGain();
    const delay = context.createDelay();
    const delayFeedback = context.createGain();
    const delayWet = context.createGain();
    const roomFilter = context.createBiquadFilter();
    const nodes: AudioScheduledSourceNode[] = [];
    const timers: ReturnType<typeof setInterval>[] = [];

    master.gain.value = 0.34;
    musicBus.gain.value = 0.92;
    delay.delayTime.value = 0.32;
    delayFeedback.gain.value = 0.28;
    delayWet.gain.value = 0.18;
    compressor.threshold.value = -24;
    compressor.knee.value = 18;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.02;
    compressor.release.value = 0.28;
    roomFilter.type = "lowpass";
    roomFilter.frequency.value = 6200;

    musicBus.connect(roomFilter);
    musicBus.connect(delay);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delay.connect(delayWet);
    delayWet.connect(roomFilter);
    roomFilter.connect(compressor);
    compressor.connect(master);
    master.connect(context.destination);

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noiseData.length; index += 1) {
      noiseData[index] = (Math.random() * 2 - 1) * 0.16;
    }

    const roomNoise = context.createBufferSource();
    const noiseGain = context.createGain();
    roomNoise.buffer = noiseBuffer;
    roomNoise.loop = true;
    noiseGain.gain.value = 0.028;
    roomNoise.connect(noiseGain);
    noiseGain.connect(roomFilter);
    roomNoise.start();
    nodes.push(roomNoise);

    const fanHum = context.createOscillator();
    const fanGain = context.createGain();
    fanHum.type = "sine";
    fanHum.frequency.value = 72;
    fanGain.gain.value = 0.018;
    fanHum.connect(fanGain);
    fanGain.connect(roomFilter);
    fanHum.start();
    nodes.push(fanHum);

    const bpm = 88;
    const stepTime = 60 / bpm / 4;
    const lead = [392, 0, 440, 523.25, 659.25, 0, 587.33, 523.25, 440, 0, 392, 349.23, 329.63, 0, 392, 440, 523.25, 0, 493.88, 440, 392, 0, 329.63, 392, 440, 0, 392, 349.23, 329.63, 0, 293.66, 329.63];
    const chords = [
      { bass: 110, notes: [220, 261.63, 329.63, 440] },
      { bass: 87.31, notes: [174.61, 220, 261.63, 349.23] },
      { bass: 130.81, notes: [196, 261.63, 329.63, 392] },
      { bass: 98, notes: [196, 246.94, 293.66, 392] }
    ];
    const arpPattern = [0, 2, 1, 3, 2, 1, 0, 2];
    let nextStep = 0;
    let nextTime = context.currentTime + 0.08;

    function scheduleStep(step: number, start: number) {
      const barStep = step % 64;
      const chord = chords[Math.floor(barStep / 16) % chords.length];
      const stepInBar = barStep % 16;

      if (stepInBar === 0 || stepInBar === 8) {
        const lift = stepInBar === 8 ? 1.5 : 1;
        scheduleTone(context, musicBus, chord.bass * lift, start, stepTime * 2.2, "sine", 0.062, 0.018, 0.28, -0.08);
        scheduleKick(context, musicBus, start);
      }

      if (stepInBar === 4 || stepInBar === 12) {
        scheduleNoiseHit(context, musicBus, noiseBuffer, start, 0.16, 0.035, 900, 0.08);
      }

      if (stepInBar % 2 === 0) {
        scheduleNoiseHit(context, musicBus, noiseBuffer, start + 0.01, 0.045, 0.012, 5200, stepInBar % 4 === 0 ? -0.18 : 0.18);
      }

      if (stepInBar === 0) {
        chord.notes.forEach((frequency, index) => {
          scheduleTone(context, musicBus, frequency, start + index * 0.035, stepTime * 14, "sine", 0.018, 0.24, 1.1, -0.26 + index * 0.16);
        });
      }

      if (stepInBar % 2 === 0) {
        const arpFrequency = chord.notes[arpPattern[(barStep / 2) % arpPattern.length]];
        scheduleTone(context, musicBus, arpFrequency * 2, start + 0.018, stepTime * 1.2, "triangle", 0.024, 0.012, 0.18, stepInBar % 4 === 0 ? -0.32 : 0.32);
      }

      const leadFrequency = lead[barStep % lead.length];
      if (leadFrequency) {
        const phraseVolume = barStep < 32 ? 0.052 : 0.042;
        scheduleTone(context, musicBus, leadFrequency, start + 0.02, stepTime * 1.85, "triangle", phraseVolume, 0.024, 0.26, 0.06);
        if (barStep % 8 === 6) {
          scheduleTone(context, musicBus, leadFrequency * 1.5, start + stepTime * 0.55, stepTime * 1.3, "sine", 0.015, 0.018, 0.24, 0.36);
        }
      }

      if (barStep % 24 === 10 || barStep % 31 === 18) {
        const frequency = 2500 + Math.random() * 900;
        scheduleTone(context, musicBus, frequency, start, 0.08, "sine", 0.008, 0.004, 0.06, 0.46);
      }
    }

    timers.push(setInterval(() => {
      while (nextTime < context.currentTime + 0.42) {
        scheduleStep(nextStep, nextTime);
        nextStep += 1;
        nextTime += stepTime;
      }
    }, 90));

    musicRef.current = { context, timers, nodes };
    setMusicOn(true);
    setMusicBlocked(context.state === "suspended");
    void context.resume().then(() => setMusicBlocked(false)).catch(() => setMusicBlocked(true));
  }

  function toggleMusic() {
    if (musicRef.current) {
      stopMusic();
      return;
    }

    startSoundscape();
  }

  useEffect(() => {
    const startTimer = window.setTimeout(() => {
      if (!musicRef.current) startSoundscape();
    }, 600);

    function unlockMusic() {
      const handle = musicRef.current;
      if (handle?.context?.state === "suspended") {
        void handle.context.resume().then(() => setMusicBlocked(false)).catch(() => setMusicBlocked(true));
      } else if (!handle) {
        startSoundscape();
      }
    }

    window.addEventListener("pointerdown", unlockMusic, { once: true });
    window.addEventListener("keydown", unlockMusic, { once: true });

    return () => {
      window.clearTimeout(startTimer);
      window.removeEventListener("pointerdown", unlockMusic);
      window.removeEventListener("keydown", unlockMusic);
      stopMusic();
    };
  }, []);

  return (
    <main className="appShell">
      <header className="topHud">
        <div>
          <p className="kicker">一间 2018 年的深夜房间</p>
          <h1>回到2018</h1>
        </div>
        <aside className="statusPanel">
          <span>已发现 {visited.length} / {Object.keys(items).length}</span>
          <div className="meter"><i style={{ width: `${progress}%` }} /></div>
          <small>彩蛋 {eggs.length} / 3 · 当前频道：{channels[channel]}</small>
          <button className={`musicToggle ${musicOn ? "active" : ""}`} onClick={toggleMusic} type="button">
            {musicOn ? (musicBlocked ? "点击解锁原创夏夜曲" : "暂停原创夏夜曲") : "播放原创夏夜曲"}
          </button>
        </aside>
      </header>

      <section className={roomClass} aria-label="2018 深夜房间互动场景">
        <div className="wallGlow" aria-hidden="true" />
        <div className="roomDepth" aria-hidden="true" />
        <div className="bookcase" aria-hidden="true">
          <span className="shelf shelfTop" />
          <span className="shelf shelfMid" />
          <span className="shelf shelfLow" />
        </div>
        <div className="pinboard" aria-hidden="true" />
        <button className="poster posterWorldcup item hasSprite" onClick={() => openItem("worldcup")} aria-label="世界杯赛程海报">
          <img className="itemSprite" src="/assets/items/worldcup.png" alt="" draggable={false} />
        </button>
        <button className="poster posterMovie item hasSprite" onClick={() => openItem("movie")} aria-label="我不是药神海报">
          <img className="itemSprite" src="/assets/items/movie.png" alt="" draggable={false} />
        </button>
        <button className="poster poster101 item hasSprite" onClick={() => setPopup({ title: "创造101海报", tag: "娱乐区 / 单击", body: "6月23日，火箭少女101成团。卡路里从夏天火到冬天。", kind: "tv" })} aria-label="创造101海报">
          <img className="itemSprite" src="/assets/items/poster101.png" alt="" draggable={false} />
        </button>
        <button className="poster posterGuardian item hasSprite" onClick={() => setPopup({ title: "镇魂海报", tag: "娱乐区 / 单击", body: "2018年6月13日开播。镇魂女孩的夏天，沈巍和赵云澜站在屏幕里。", kind: "tv" })} aria-label="镇魂海报">
          <img className="itemSprite" src="/assets/items/posterGuardian.png" alt="" draggable={false} />
        </button>

        <button className="window item hasSprite" onClick={() => openItem("window")} aria-label="窗外天色">
          <img className="itemSprite" src={daybreak ? "/assets/items/window-day.png" : "/assets/items/window-night.png"} alt="" draggable={false} />
        </button>
        <button className="clock item hasSprite" onClick={() => setPopup({ title: "墙上的时钟", tag: "环境区 / 悬停", body: "2018年的时间，走得比你想的要快。", kind: "calendar" })} aria-label="墙上的时钟">
          <img className="itemSprite" src="/assets/items/clock.png" alt="" draggable={false} />
        </button>

        <div className="tvCabinet">
        <button className="tv item hasSprite" onClick={() => openItem("tv")} aria-label="电视机">
            <img className="itemSprite" src="/assets/items/tv.png" alt="" draggable={false} />
            <span>{channels[channel]}</span>
          </button>
          <button className="remote item hasSprite" onClick={() => openItem("remote")} aria-label="遥控器">
            <img className="itemSprite" src="/assets/items/remote.png" alt="" draggable={false} />
          </button>
          <button className="drawer item hasSprite" onClick={() => setPopup({ title: "电视柜抽屉", tag: "娱乐区 / 单击", body: "抽屉里有一叠老照片：聚会、吃西瓜、毕业照。每张都糊，但每张都很真。", kind: "egg" })} aria-label="电视柜抽屉">
            <img className="itemSprite" src="/assets/items/drawer.png" alt="" draggable={false} />
          </button>
        </div>

        <div className="desk">
          <button className="monitor item hasSprite" onClick={() => openItem("monitor")} aria-label="电脑显示器">
            <img className="itemSprite" src="/assets/items/monitor.png" alt="" draggable={false} />
            <span className="desktopIcon lolIcon" onDoubleClick={(event) => { event.stopPropagation(); openItem("lol"); }}>LOL</span>
            <span className="desktopIcon qqIcon" onClick={(event) => { event.stopPropagation(); openItem("qq"); }}>QQ</span>
            <span className="desktopIcon gameIcon" onClick={(event) => { event.stopPropagation(); setPopup({ title: "4399 游戏盒", tag: "电脑桌区域 / 单击", body: "仿 Flash 小游戏页面打开了：摩尔庄园、赛尔号、洛克王国。你的拉姆还在等你吗？", kind: "desktop" }); }}>4399</span>
          </button>

          <button
            className="keyboard item dropTarget hasSprite"
            onClick={() => setPopup({ title: "键盘亮起", tag: "电脑桌区域 / 悬停", body: "2018年夏天，你在这块键盘上敲过多少篇论文，又敲过多少句“作业借我抄抄”？", kind: "desktop" })}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop("keyboard")}
            aria-label="键盘"
          >
            <img className="itemSprite" src="/assets/items/keyboard.png" alt="" draggable={false} />
          </button>
          <button className="mouse item hasSprite" onClick={() => setPopup({ title: "有线鼠标", tag: "电脑桌区域 / 单击", body: "那年你还没用上无线鼠标，有线的一直缠着充电线。", kind: "desktop" })} aria-label="有线鼠标">
            <img className="itemSprite" src="/assets/items/mouse.png" alt="" draggable={false} />
          </button>
          <button className="cable item hasSprite" onClick={() => setPopup({ title: "Micro-USB 充电线", tag: "电脑桌区域 / 单击", body: "2018年，出门总要带三根线。借充电线，是一种社交。", kind: "desktop" })} aria-label="Micro-USB 充电线">
            <img className="itemSprite" src="/assets/items/cable.png" alt="" draggable={false} />
          </button>

          <button
            className="phone item hasSprite deskFan"
            onClick={() => openItem("fan")}
            aria-label="小风扇"
          >
            <img className="itemSprite" src="/assets/items/fan.png" alt="" draggable={false} />
          </button>

          <button
            className="phone item hasSprite tablePhone"
            draggable
            onDragStart={() => setDragging("phone")}
            onClick={() => openItem("phone")}
            aria-label="iPhone X"
          >
            <img className="itemSprite" src="/assets/items/phone.png" alt="" draggable={false} />
            <i aria-label="微信" onClick={(event) => { event.stopPropagation(); openItem("wechat"); }} />
            <i aria-label="网易云" onClick={(event) => { event.stopPropagation(); openItem("netease"); }} />
          </button>

          <button
            className="mp3 item dropTarget hasSprite"
            onClick={() => openItem("mp3")}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop("mp3Dock")}
            aria-label="旧 MP3 播放器"
          >
            <img className="itemSprite" src="/assets/items/mp3.png" alt="" draggable={false} />
          </button>
          <button className="lamp item hasSprite" onClick={() => openItem("lamp")} aria-label="台灯">
            <img className="itemSprite" src="/assets/items/lamp.png" alt="" draggable={false} />
          </button>
        </div>

        <div
          className="tvDropZone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => handleDrop("tvDock")}
          aria-label="把手机拖到电视旁边触发彩蛋"
        />

        <div className="snacks">
          <button className="latiao item hasSprite" draggable onDragStart={() => setDragging("latiao")} onClick={() => openItem("latiao")} aria-label="辣条">
            <img className="itemSprite" src="/assets/items/latiao.png" alt="" draggable={false} />
          </button>
          <button className="tea item hasSprite" onClick={() => openItem("tea")} aria-label="柠檬茶">
            <img className="itemSprite" src="/assets/items/tea.png" alt="" draggable={false} />
          </button>
          <button className={`spinner item hasSprite ${popup?.title === "指尖陀螺转起来了" ? "spinNow" : ""}`} onClick={() => openItem("spinner")} aria-label="指尖陀螺">
            <img className="itemSprite" src="/assets/items/spinner.png" alt="" draggable={false} />
          </button>
          <button className="examBook item hasSprite" onClick={() => openItem("examBook")} aria-label="五年高考三年模拟">
            <img className="itemSprite" src="/assets/items/examBook.png" alt="" draggable={false} />
          </button>
          <button className="novel item hasSprite" onClick={() => openItem("novel")} aria-label="全职高手小说">
            <img className="itemSprite" src="/assets/items/novel.png" alt="" draggable={false} />
          </button>
          <button className="watermelon item hasSprite" onDoubleClick={() => setPopup({ title: "半个西瓜", tag: "零食区 / 双击", body: "2018年的夏天，是没有西瓜就不完整的夏天。", kind: "egg" })} aria-label="半个西瓜">
            <img className="itemSprite" src="/assets/items/watermelon.png" alt="" draggable={false} />
          </button>
          <button
            className="fan item hasSprite snackPhone"
            draggable
            onDragStart={() => setDragging("phone")}
            onClick={() => openItem("phone")}
            aria-label="iPhone X"
          >
            <img className="itemSprite" src="/assets/items/phone.png" alt="" draggable={false} />
            <i aria-label="微信" onClick={(event) => { event.stopPropagation(); openItem("wechat"); }} />
            <i aria-label="网易云" onClick={(event) => { event.stopPropagation(); openItem("netease"); }} />
          </button>
        </div>

        <button className="calendar item hasSprite" onClick={() => openItem("calendar")} aria-label="6月日历">
          <img className="itemSprite" src="/assets/items/calendar.png" alt="" draggable={false} />
        </button>
        <button className="slippers item hasSprite" onClick={() => setPopup({ title: "地上的拖鞋", tag: "环境区 / 单击", body: "2018年夏天，你穿着这双拖鞋去楼下买冰棍。", kind: "egg" })} aria-label="地上的拖鞋">
          <img className="itemSprite" src="/assets/items/slippers.png" alt="" draggable={false} />
        </button>
        <button className="trash item hasSprite" onClick={() => openItem("trash")} aria-label="垃圾桶">
          <img className="itemSprite" src="/assets/items/trash.png" alt="" draggable={false} />
        </button>
      </section>

      <section className="notesPanel">
        <div>
          <h2>玩法</h2>
          <p>在房间里随便逛：单击物品看记忆，双击部分物件触发特殊内容，把手机或辣条拖到特定位置会出现隐藏彩蛋。</p>
        </div>
        <div>
          <h2>声音地图</h2>
          <p>原创夏夜曲会在房间底噪、风扇低频和轻像素旋律之间循环，像一段没有歌词的 2018 深夜记忆。</p>
        </div>
      </section>

      {popup && (
        <div className="modalBackdrop" onClick={() => setPopup(null)}>
          <article className={`modal ${popup.kind ? `modal-${popup.kind}` : ""}`} onClick={(event) => event.stopPropagation()}>
            <button className="closeButton" onClick={() => setPopup(null)} aria-label="关闭弹窗">×</button>
            {popup.kind === "phone" ? (
              <div className="phoneOS">
                <div className="phoneFrame">
                  <div className="phoneStatus"><span>22:34</span><span>4G 82%</span></div>
                  <div className="phoneScreen">
                    {phoneApp === "home" && (
                      <div className="phoneHome">
                        <div className="phoneDate">
                          <strong>6月14日</strong>
                          <span>世界杯开幕夜</span>
                        </div>
                        <div className="appGrid">
                          <button onClick={() => setPhoneApp("wechat")}><i className="appIcon green" />微信</button>
                          <button onClick={() => setPhoneApp("netease")}><i className="appIcon red" />网易云</button>
                          <button onClick={() => setPhoneApp("weibo")}><i className="appIcon orange" />微博</button>
                          <button onClick={() => setPhoneApp("douyin")}><i className="appIcon dark" />抖音</button>
                          <button onClick={() => setPhoneApp("album")}><i className="appIcon blue" />相册</button>
                          <button onClick={() => setPhoneApp("calendar")}><i className="appIcon cream" />日历</button>
                        </div>
                      </div>
                    )}

                    {phoneApp === "wechat" && (
                      <div className="phoneAppView">
                        <PhoneTop title="微信" onBack={() => setPhoneApp("home")} />
                        <div className="chatList">
                          <button><b>高中同学群</b><span>今晚看揭幕战吗？冰可乐已就位。</span><em>22:31</em></button>
                          <button><b>置顶的人</b><span>毕业照原图发你了，别又压缩。</span><em>20:18</em></button>
                          <button><b>家庭群</b><span>早点睡，明天别赖床。</span><em>19:42</em></button>
                        </div>
                      </div>
                    )}

                    {phoneApp === "netease" && (
                      <div className="phoneAppView">
                        <PhoneTop title="网易云音乐" onBack={() => setPhoneApp("home")} />
                        <div className="musicApp">
                          <div className="recordDisc" />
                          <strong>2018 夏夜原创曲</strong>
                          <span>书桌旁 / 风扇 / 窗外橙色天光</span>
                          <div className="musicBars"><i /><i /><i /><i /><i /></div>
                          <button onClick={toggleMusic}>{musicOn ? "暂停背景音乐" : "播放背景音乐"}</button>
                        </div>
                      </div>
                    )}

                    {phoneApp === "weibo" && (
                      <div className="phoneAppView">
                        <PhoneTop title="微博" onBack={() => setPhoneApp("home")} />
                        <div className="feedList">
                          <article><b>#世界杯开幕#</b><p>四年一次的夏夜，又把所有人的屏幕点亮了。</p></article>
                          <article><b>#我不是药神#</b><p>有人说电影看完以后，走出影院很久都没说话。</p></article>
                          <article><b>#锦鲤转发#</b><p>转发这条，暑假作业自动写完。</p></article>
                        </div>
                      </div>
                    )}

                    {phoneApp === "douyin" && (
                      <div className="phoneAppView">
                        <PhoneTop title="抖音" onBack={() => setPhoneApp("home")} />
                        <div className="shortVideo">
                          <span>卡点舞 / 校服 / 操场黄昏</span>
                          <b>2018 的短视频还带着一点新鲜感</b>
                        </div>
                      </div>
                    )}

                    {phoneApp === "album" && (
                      <div className="phoneAppView">
                        <PhoneTop title="相册" onBack={() => setPhoneApp("home")} />
                        <div className="photoGrid">
                          <button>毕业照</button><button>西瓜</button><button>网吧</button>
                          <button>晚自习</button><button>电影票</button><button>截图</button>
                        </div>
                      </div>
                    )}

                    {phoneApp === "calendar" && (
                      <div className="phoneAppView">
                        <PhoneTop title="日历" onBack={() => setPhoneApp("home")} />
                        <div className="phoneCalendar">
                          <b>6.7 高考</b><b>6.14 世界杯</b><b>6.23 成团夜</b><b>7.5 药神</b><b>7.15 决赛</b>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <aside className="phoneMemory">
                  <p className="kicker">手机区域 / 可交互</p>
                  <h2>2018 手机桌面</h2>
                  <p>这次不是读一段文字，而是在手机里翻一会儿：群聊、歌单、热搜、相册和日历一起组成那年夏天。</p>
                </aside>
              </div>
            ) : (
              <>
                <p className="kicker">{popup.tag}</p>
                <h2>{popup.title}</h2>
                {popup.kind === "desktop" && <div className="fakeDesktop"><span>回收站</span><span>英雄联盟</span><span>4399</span><span>QQ</span></div>}
                {popup.kind === "music" && <div className="fakePlayer"><strong>2018 夏夜歌单</strong><i /></div>}
                {popup.kind === "tv" && <div className="fakeVideo"><span>{channels[channel]}</span></div>}
                {popup.kind === "calendar" && <div className="fakeCalendar"><b>6.7 高考</b><b>6.14 世界杯</b><b>6.23 101决赛</b><b>7.15 决赛</b></div>}
                <p>{popup.body}</p>
                {popup.detail && <strong>{popup.detail}</strong>}
              </>
            )}
          </article>
        </div>
      )}
    </main>
  );
}
