import type { Memory } from "../story/types";

export function GraduationVideoMemory({ memory, onClose }: { memory: Memory; onClose: () => void }) {
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


