export type Phase = "intro" | "room" | "secondAsk" | "nodes" | "system" | "farewell" | "ending";
export type MemoryId = "computer" | "phone" | "mp3" | "recycle";
export type NodeId = "stadium" | "plane" | "station";
export type ChoiceKey = "A" | "B" | "C" | "D" | "E";
export type PhoneApp = "home" | "wechat" | "zhouye" | "moments" | "album" | "calendar";
export type DesktopApp = "folder" | "tickets" | "recycle" | "notes";
export type IntroPackItem = "laptop" | "books" | "folder" | "calendar" | "lamp" | "keyboard" | "mp3" | "phone" | "mouse" | "cup" | "scarf";
export type GuidePhoneView = "home" | "wechatList" | "chat";

export type IntroMemory = {
  title: string;
  lines: string[];
};

export type Memory = {
  id: MemoryId;
  title: string;
  place: string;
  summary: string;
  lines: string[];
  note: string;
};

export type StoryChoice = {
  key: ChoiceKey;
  text: string;
  response: string[];
};

export type StoryNode = {
  id: NodeId;
  eyebrow: string;
  title: string;
  scene: string;
  prompt: string[];
  system?: string;
  choices: StoryChoice[];
  closing: string[];
};

export type GuidedBeat = {
  memoryId: MemoryId;
  time: string;
  title: string;
  message: string;
  cta: string;
  after: string;
};

export type VnLine = {
  speaker: string;
  text: string;
  kind?: "dialogue" | "system" | "narration";
};

export type DesktopGuideBeat = {
  app: DesktopApp;
  icon: string;
  title: string;
  meta: string;
  speaker: string;
  text: string;
  detail: string;
};


