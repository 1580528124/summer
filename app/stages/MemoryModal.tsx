"use client";

import { cx } from "../story/utils";
import { DesktopMemory } from "../components/DesktopMemory";
import { PhoneMemory } from "../components/PhoneMemory";
import { GraduationVideoMemory } from "../components/GraduationVideoMemory";

type Props = Record<string, any>;

export function MemoryModal(props: Props) {
  const { openedMemory, setOpenedMemory, markMemorySeen } = props;

  return (
        <div className="modalBackdrop" onClick={() => setOpenedMemory(null)}>
          <article className={cx("memoryModal", openedMemory.id === "computer" && "modalDesktop", openedMemory.id === "phone" && "modalPhone")} onClick={(event) => event.stopPropagation()}>
            <button className="close" onClick={() => setOpenedMemory(null)} aria-label="关闭" type="button">×</button>
            {openedMemory.id === "computer" ? (
              <DesktopMemory memory={openedMemory} markSeen={() => markMemorySeen("computer")} />
            ) : openedMemory.id === "phone" ? (
              <PhoneMemory markSeen={() => markMemorySeen("phone")} initialApp="zhouye" compact />
            ) : openedMemory.id === "recycle" ? (
              <GraduationVideoMemory memory={openedMemory} onClose={() => setOpenedMemory(null)} />
            ) : (
              <>
                <p className="eyebrow">{openedMemory.place}</p>
                <h2>{openedMemory.title}</h2>
                <p className="summary">{openedMemory.summary}</p>
                <div className="memoryLines">
                  {openedMemory.lines.map((line: string) => <p key={line}>{line}</p>)}
                </div>
                <div className="systemBox compact">{openedMemory.note}</div>
                <button onClick={() => setOpenedMemory(null)} type="button">收起这段记忆</button>
              </>
            )}
          </article>
        </div>
  );
}


