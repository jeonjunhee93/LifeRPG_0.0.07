import React, { useState } from "react";

// 장비 슬롯 정보
const EQUIP_SLOTS = [
  { key: "weapon", label: "무기", position: "left" },
  { key: "helmet", label: "투구", position: "left" },
  { key: "armor", label: "갑옷", position: "left" },
  { key: "shield", label: "방패", position: "right" },
  { key: "glove", label: "장갑", position: "right" },
  { key: "boots", label: "신발", position: "right" },
];

// 장비 예시(레어리티 포함)
const ALL_ITEMS = [
  { key: "weapon", name: "무딘 칼", icon: "/무딘칼_일반.png", rarity: "일반" },
  { key: "weapon", name: "파멸의 검", icon: "/파멸의검_에픽.png", rarity: "에픽" },
  { key: "helmet", name: "녹슨 철 투구", icon: "/녹슨 철 투구.png", rarity: "일반" },
  { key: "helmet", name: "용기의 투구", icon: "/용기의 투구.png", rarity: "희귀" },
  { key: "armor", name: "낡은 철 갑옷", icon: "/낡은 철 갑옷.png", rarity: "일반" },
  { key: "armor", name: "기사단 정예 갑주", icon: "/기사단 정예 갑주.png", rarity: "희귀" },
  { key: "shield", name: "기본 방패", icon: "/기본방패.png", rarity: "일반" },
  { key: "glove", name: "가죽장갑", icon: "/가죽장갑.png", rarity: "일반" },
  { key: "boots", name: "가죽신발", icon: "/가죽신발.png", rarity: "일반" },
];

// 레어리티별 드랍 확률
const LOOT_TABLE = [
  { rarity: "전설", chance: 5 },
  { rarity: "에픽", chance: 10 },
  { rarity: "희귀", chance: 15 },
  { rarity: "일반", chance: 70 },
];

// 기본 퀘스트
const DEFAULT_QUESTS = [
  { id: 1, text: "집 청소하기", reward: { xp: 10, gold: 5 } },
  { id: 2, text: "밀린 설거지 처리", reward: { xp: 7, gold: 3 } },
  { id: 3, text: "세탁물 개기/돌리기", reward: { xp: 8, gold: 4 } },
];

// 상점 아이템
const SHOP_ITEMS = [
  { name: "디저트 먹기", price: 10, description: "달콤한 휴식!", emoji: "🍰" },
  { name: "유튜브 시청권", price: 15, description: "30분 휴식!", emoji: "📺" },
  { name: "카페 가기", price: 30, description: "분위기 환기!", emoji: "☕" },
  { name: "운동 보상", price: 25, description: "자기관리 보상!", emoji: "🏋️" },
];

function getRandomLoot() {
  if (Math.random() > 0.3) return null; // 30% 확률
  const roll = Math.random() * 100;
  let acc = 0, chosen = "일반";
  for (let l of LOOT_TABLE) {
    acc += l.chance;
    if (roll <= acc) { chosen = l.rarity; break; }
  }
  const candidates = ALL_ITEMS.filter(i => i.rarity === chosen);
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// 장비창(좌우 3개씩)
function CharacterPanel({ equipment, onIconDoubleClick }) {
  const leftSlots = EQUIP_SLOTS.filter(slot => slot.position === "left");
  const rightSlots = EQUIP_SLOTS.filter(slot => slot.position === "right");
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minWidth: 380, minHeight: 400, background: "#4443", borderRadius: 8, margin: 0, padding: 0
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {leftSlots.map(slot => (
          <div
            key={slot.key}
            style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}
            onDoubleClick={() => onIconDoubleClick(slot.key)}
          >
            {equipment[slot.key] &&
              <img
                src={equipment[slot.key].icon}
                alt={slot.label}
                title={equipment[slot.key].name}
                style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 8, background: "#2228", border: "2px solid #fff" }}
              />}
          </div>
        ))}
      </div>
      {/* 실루엣 */}
      <div style={{
        width: 180, height: 320, position: "relative", margin: "0 12px"
      }}>
        <img src="/silhouette.png" alt="캐릭터 실루엣"
          style={{ width: "100%", height: "100%", objectFit: "contain", filter: "brightness(0.93)" }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {rightSlots.map(slot => (
          <div
            key={slot.key}
            style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}
            onDoubleClick={() => onIconDoubleClick(slot.key)}
          >
            {equipment[slot.key] &&
              <img
                src={equipment[slot.key].icon}
                alt={slot.label}
                title={equipment[slot.key].name}
                style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 8, background: "#2228", border: "2px solid #fff" }}
              />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LifeRPG() {
  const [equipment, setEquipment] = useState({
    weapon: null, helmet: null, armor: null, shield: null, glove: null, boots: null,
  });
  const [inventory, setInventory] = useState([
    ALL_ITEMS[0], ALL_ITEMS[2], ALL_ITEMS[4], ALL_ITEMS[6], ALL_ITEMS[7], ALL_ITEMS[8]
  ]);
  const [quests, setQuests] = useState([...DEFAULT_QUESTS]);
  const [questInput, setQuestInput] = useState("");
  const [xp, setXP] = useState(0);
  const [gold, setGold] = useState(0);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("quest"); // quest or shop

  // 인벤토리 더블클릭 → 장착
  const handleInventoryDoubleClick = item => {
    setEquipment(prev => ({
      ...prev, [item.key]: item,
    }));
    setInventory(inv => inv.filter(i => i !== item));
  };
  // 장비 더블클릭 → 해제
  const handleEquipDoubleClick = slotKey => {
    if (!equipment[slotKey]) return;
    setInventory(inv => [...inv, equipment[slotKey]]);
    setEquipment(prev => ({ ...prev, [slotKey]: null }));
  };

  // 퀘스트 추가
  const handleQuestAdd = () => {
    if (questInput.trim()) {
      setQuests(qs => [...qs, {
        id: Date.now(), text: questInput.trim(), reward: { xp: 10, gold: 5 }
      }]);
      setQuestInput("");
    }
  };

  // 퀘스트 완료
  const handleQuestComplete = quest => {
    setXP(xp + quest.reward.xp);
    setGold(gold + quest.reward.gold);
    setQuests(qs => qs.filter(q => q.id !== quest.id));
    const loot = getRandomLoot();
    if (loot) {
      setInventory(inv => [...inv, loot]);
      setMessage(`🎉 퀘스트 완료! ${loot.name}(${loot.rarity})를 획득!`);
    } else {
      setMessage(`퀘스트 완료! 경험치 +${quest.reward.xp}, 골드 +${quest.reward.gold}`);
    }
    setTimeout(() => setMessage(""), 2000);
  };

  // 상점 구매
  const handleBuy = item => {
    if (gold < item.price) {
      setMessage("골드가 부족합니다!");
      setTimeout(() => setMessage(""), 1200);
      return;
    }
    setGold(gold - item.price);
    setMessage(`${item.emoji} ${item.name} 구매 완료!`);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div style={{ background: "#222", minHeight: "100vh", color: "#fff", fontFamily: "Pretendard, sans-serif", padding: 32 }}>
      <h1 style={{ marginBottom: 12 }}>Life R.P.G</h1>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
        {/* 캐릭터+장비 */}
        <CharacterPanel equipment={equipment} onIconDoubleClick={handleEquipDoubleClick} />
        <div style={{ flex: 1 }}>
          {/* 골드, 경험치, 탭 */}
          <div style={{ marginBottom: 8 }}>
            <b>경험치:</b> {xp} | <b>골드:</b> {gold}
            <button onClick={() => setActiveTab("quest")} style={{ marginLeft: 20, marginRight: 4, background: activeTab === "quest" ? "#555" : "#333", color: "#fff" }}>퀘스트</button>
            <button onClick={() => setActiveTab("shop")} style={{ background: activeTab === "shop" ? "#555" : "#333", color: "#fff" }}>상점</button>
          </div>
          {/* 퀘스트 탭 */}
          {activeTab === "quest" && (
            <>
              <div style={{ marginBottom: 12 }}>
                <h2>퀘스트</h2>
                <ul style={{ padding: 0, listStyle: "none" }}>
                  {quests.map(q => (
                    <li key={q.id}
                      style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{q.text}</span>
                      <span style={{ fontSize: 13, color: "#ffd" }}>
                        (보상: XP +{q.reward.xp}, Gold +{q.reward.gold})
                      </span>
                      <button onClick={() => handleQuestComplete(q)} style={{ marginLeft: 10 }}>완료</button>
                    </li>
                  ))}
                </ul>
                {/* 퀘스트 추가 */}
                <input
                  value={questInput}
                  onChange={e => setQuestInput(e.target.value)}
                  placeholder="퀘스트 내용 입력"
                  style={{ width: 180, marginRight: 4 }}
                  onKeyDown={e => e.key === "Enter" && handleQuestAdd()}
                />
                <button onClick={handleQuestAdd}>추가</button>
              </div>
              {/* 인벤토리 */}
              <h2>인벤토리</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {inventory.map(item => (
                  <div key={item.name + item.rarity}
                    onDoubleClick={() => handleInventoryDoubleClick(item)}
                    style={{
                      width: 56, height: 56, background: "#333c",
                      border: `2px solid ${item.rarity === "전설" ? "#FFD700" : item.rarity === "에픽" ? "#c0f" : item.rarity === "희귀" ? "#08f" : "#555"}`,
                      borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                    }}>
                    <img src={item.icon} alt={item.name} style={{ width: 48, height: 48 }} />
                  </div>
                ))}
              </div>
            </>
          )}
          {/* 상점 탭 */}
          {activeTab === "shop" && (
            <div>
              <h2>상점</h2>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {SHOP_ITEMS.map(item => (
                  <div key={item.name} style={{
                    background: "#444a", padding: 16, borderRadius: 12,
                    width: 150, textAlign: "center", border: "2px solid #555"
                  }}>
                    <div style={{ fontSize: 36 }}>{item.emoji}</div>
                    <b>{item.name}</b>
                    <div style={{ margin: "6px 0", fontSize: 13, color: "#ccc" }}>{item.description}</div>
                    <div style={{ marginBottom: 8, color: "#ffe600" }}>💰 {item.price}G</div>
                    <button onClick={() => handleBuy(item)}
                      style={{ width: "90%", padding: 4, background: "#006eff", color: "#fff", border: "none", borderRadius: 8 }}>
                      구매
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 안내 및 메시지 */}
      <div style={{ marginTop: 18, color: "#fc0", fontSize: 16, minHeight: 24 }}>{message}</div>
      <div style={{ marginTop: 8, color: "#bbb", fontSize: 13 }}>
        - 인벤토리 아이템 더블클릭: 장착<br />
        - 장비 아이콘 더블클릭: 해제<br />
        - 퀘스트 완료 시 낮은 확률로 아이템 루팅<br />
        - 상점에서 골드로 다양한 보상 구매 가능<br />
      </div>
    </div>
  );
}
