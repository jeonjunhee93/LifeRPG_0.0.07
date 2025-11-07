import React, { useState } from "react";

// 드랍 아이템 테이블
const ALL_ITEMS = [
  { id: 1, name: "무딘 칼", type: "weapon", rarity: "common", img: "/무딘칼_일반.png", dropRate: 0.5 },
  { id: 2, name: "루비소드", type: "weapon", rarity: "rare", img: "/루비소드_희귀.png", dropRate: 0.15 },
  { id: 3, name: "파멸의 검", type: "weapon", rarity: "epic", img: "/파멸의검_에픽.png", dropRate: 0.05 },
  { id: 4, name: "아스가르드의 빛", type: "weapon", rarity: "legendary", img: "/아스가르드의빛_전설.png", dropRate: 0.01 },
  // 투구
  { id: 5, name: "녹슨 철 투구", type: "helmet", rarity: "common", img: "/녹슨 철 투구.png", dropRate: 0.5 },
  { id: 6, name: "용기의 투구", type: "helmet", rarity: "rare", img: "/용기의 투구.png", dropRate: 0.15 },
  { id: 7, name: "검은 달의 투구", type: "helmet", rarity: "epic", img: "/검은 달의 투구.png", dropRate: 0.05 },
  { id: 8, name: "신왕의 면류관", type: "helmet", rarity: "legendary", img: "/신왕의 면류관.png", dropRate: 0.01 },
  // 갑옷
  { id: 9, name: "낡은 철 갑옷", type: "armor", rarity: "common", img: "/낡은 철 갑옷.png", dropRate: 0.5 },
  { id: 10, name: "기사단 정예 갑주", type: "armor", rarity: "rare", img: "/기사단 정예 갑주.png", dropRate: 0.15 },
  { id: 11, name: "피의 결의 갑옷", type: "armor", rarity: "epic", img: "/피의 결의 갑옷.png", dropRate: 0.05 },
  { id: 12, name: "용왕의 판금갑주", type: "armor", rarity: "legendary", img: "/용왕의 판금갑주.png", dropRate: 0.01 },
];

const SLOT_LIST = [
  { key: "weapon", label: "무기" },
  { key: "helmet", label: "투구" },
  { key: "armor", label: "갑옷" },
];

// 한글화
function rarityKor(r) {
  if (r === "common") return "일반";
  if (r === "rare") return "희귀";
  if (r === "epic") return "에픽";
  if (r === "legendary") return "전설";
  return r;
}
function raritySortValue(rarity) {
  if (rarity === "legendary") return 4;
  if (rarity === "epic") return 3;
  if (rarity === "rare") return 2;
  return 1;
}

export default function LifeRPG() {
  const [inventory, setInventory] = useState([]);
  const [equipment, setEquipment] = useState({});
  const [questInput, setQuestInput] = useState("");
  const [msg, setMsg] = useState("");

  // 퀘스트 완료시 아이템 드랍
  function handleQuestComplete() {
    const candidates = ALL_ITEMS.filter(
      (item) => !inventory.some((i) => i.id === item.id)
    );
    if (candidates.length === 0) {
      setMsg("더 이상 드랍 가능한 아이템이 없습니다!");
      return;
    }
    const rolled = candidates.filter((item) => Math.random() < item.dropRate);
    if (rolled.length === 0) {
      setMsg("아이템을 획득하지 못했습니다!");
      return;
    }
    rolled.sort((a, b) => raritySortValue(b.rarity) - raritySortValue(a.rarity));
    const loot = rolled[0];
    setInventory((inv) => [...inv, loot]);
    setMsg(`${rarityKor(loot.rarity)} 등급 [${loot.name}] 아이템을 획득했습니다!`);
  }

  function handleEquip(item) {
    setEquipment((eq) => ({ ...eq, [item.type]: item }));
    setMsg(`[${item.name}] 장착 완료!`);
  }

  function handleUnequip(type) {
    setEquipment((eq) => {
      const newEq = { ...eq };
      delete newEq[type];
      return newEq;
    });
  }

  // 각 부위별 위치 (원하는대로 조절)
  const slotPosition = {
    weapon: { left: 10, top: 240 },
    helmet: { left: 80, top: 30 },
    armor: { left: 80, top: 160 },
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "500px",
        background: "linear-gradient(135deg, #232526 60%, #414345 100%)",
        color: "white",
        fontFamily: "Pretendard, Arial, sans-serif",
      }}
    >
      {/* 좌측: 캐릭터/장비창 */}
      <div style={{ flex: "0 0 350px", padding: "32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", width: 220, height: 340 }}>
          <img src="/silhouette.png" alt="실루엣" style={{ width: 220, height: 340, filter: "brightness(0.6)" }} />
          {/* 장비 아이콘들 (부위별 지정 좌표) */}
          {SLOT_LIST.map((slot) =>
            equipment[slot.key] && (
              <img
                key={slot.key}
                src={equipment[slot.key].img}
                title={equipment[slot.key].name}
                onDoubleClick={() => handleUnequip(slot.key)}
                style={{
                  position: "absolute",
                  left: slotPosition[slot.key]?.left || 20,
                  top: slotPosition[slot.key]?.top || 60,
                  width: 48,
                  height: 48,
                  cursor: "pointer",
                  border: "2px solid #fff3",
                  borderRadius: 10,
                  background: "#1118",
                }}
              />
            )
          )}
        </div>
        <div style={{ margin: "24px 0 0 0", textAlign: "center" }}>
          <div style={{ fontSize: 30, fontWeight: "bold", letterSpacing: 2 }}>Life R.P.G</div>
          <div style={{ margin: "8px 0 0 0", fontSize: 16 }}>경험치: 0 | 골드: 0</div>
        </div>
      </div>
      {/* 우측: 퀘스트/인벤토리 */}
      <div style={{ flex: 1, padding: "32px 32px 0 32px" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>퀘스트</div>
          <input
            style={{ width: 280, height: 36, fontSize: 18, borderRadius: 8, padding: 8, marginRight: 8 }}
            value={questInput}
            placeholder="퀘스트 내용을 입력하세요"
            onChange={e => setQuestInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleQuestComplete()}
          />
          <button
            style={{ fontSize: 17, padding: "6px 18px", borderRadius: 8, background: "#356", color: "white" }}
            onClick={handleQuestComplete}
          >
            퀘스트 완료
          </button>
        </div>
        <div style={{ margin: "32px 0 10px 0", fontSize: 22, fontWeight: "bold" }}>인벤토리</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {inventory.length === 0 && <div style={{ color: "#bbb" }}>획득한 아이템 없음</div>}
          {inventory.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "2px solid #888",
                borderRadius: 10,
                background: "#222a",
                padding: 4,
                width: 62,
              }}
              title={`[${item.name}]\n${rarityKor(item.rarity)} 등급\n더블클릭: 장착`}
              onDoubleClick={() => handleEquip(item)}
            >
              <img src={item.img} alt={item.name} style={{ width: 42, height: 42 }} />
              <span style={{ fontSize: 13 }}>{item.name}</span>
              <span style={{ fontSize: 12, color: "#87f" }}>{rarityKor(item.rarity)}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 22, minHeight: 38, color: "#fff59e", fontSize: 16 }}>{msg}</div>
        <div style={{ color: "#888", marginTop: 18, fontSize: 13 }}>
          - 인벤토리 아이템 더블클릭: 장착<br />
          - 장비 아이콘 더블클릭: 해제<br />
          - 퀘스트 완료 시 낮은 확률로만 아이템 루팅, 중복 없음
        </div>
      </div>
    </div>
  );
}
