import React, { useState, useEffect } from "react";

// ... (ALL_ITEMS, EQUIP_SLOTS 등은 이전 답변과 동일하니 생략, 필요시 붙여넣기) ...
const EQUIP_SLOTS = [
  { key: "weapon", label: "무기", position: "left" },
  { key: "helmet", label: "투구", position: "left" },
  { key: "armor", label: "갑옷", position: "left" },
  { key: "shield", label: "방패", position: "right" },
  { key: "glove", label: "장갑", position: "right" },
  { key: "boots", label: "신발", position: "right" },
];

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

const LOOT_TABLE = [
  { rarity: "전설", chance: 5 },
  { rarity: "에픽", chance: 10 },
  { rarity: "희귀", chance: 15 },
  { rarity: "일반", chance: 70 },
];

const DEFAULT_QUESTS = [
  { id: 1, text: "집 청소하기", reward: { xp: 10, gold: 5 } },
  { id: 2, text: "밀린 설거지 처리", reward: { xp: 7, gold: 3 } },
  { id: 3, text: "세탁물 개기/돌리기", reward: { xp: 8, gold: 4 } },
];

const SHOP_ITEMS = [
  { name: "디저트 먹기", price: 10, description: "달콤한 휴식!", emoji: "🍰" },
  { name: "유튜브 시청권", price: 15, description: "30분 휴식!", emoji: "📺" },
  { name: "카페 가기", price: 30, description: "분위기 환기!", emoji: "☕" },
  { name: "운동 보상", price: 25, description: "자기관리 보상!", emoji: "🏋️" },
];

function getRandomLoot() {
  if (Math.random() > 0.3) return null;
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

// 로그인 화면
function LoginScreen({ onLogin }) {
  const [id, setId] = useState("");
  const [warn, setWarn] = useState("");
  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #23232b 70%, #484862 100%)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#23232b", borderRadius: 18, boxShadow: "0 2px 24px #000b",
        padding: "60px 44px 40px 44px", textAlign: "center", width: 370
      }}>
        <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: 3, marginBottom: 10, color: "#fff" }}>
          <span role="img" aria-label="logo" style={{ verticalAlign: "-8px", marginRight: 8 }}>🛡️</span>
          Life R.P.G
        </div>
        <div style={{ color: "#ffda7b", fontSize: 16, marginBottom: 24, fontWeight: 500 }}>
          혼자 사는 직장인들을 위한<br />생활 게이미피케이션
        </div>
        <input
          placeholder="아이디를 입력하세요"
          value={id}
          onChange={e => setId(e.target.value)}
          style={{
            width: "80%", padding: "10px", borderRadius: 7, border: "1px solid #888",
            fontSize: 18, textAlign: "center"
          }}
          onKeyDown={e => e.key === "Enter" && id && onLogin(id)}
        />
        <button
          onClick={() => id ? onLogin(id) : setWarn("아이디를 입력하세요")}
          style={{
            width: "84%", marginTop: 16, padding: "11px", borderRadius: 7, fontSize: 19,
            background: "linear-gradient(90deg,#35b,#24baf3)", color: "#fff", border: "none", fontWeight: 700,
            letterSpacing: 2, cursor: "pointer"
          }}>
          로그인
        </button>
        <div style={{ minHeight: 24, color: "#ff7979", marginTop: 8 }}>{warn}</div>
        <div style={{ fontSize: 13, color: "#aaa", marginTop: 14 }}>
          <b>저장/불러오기</b> 및 <b>데이터 유지</b>는 <span style={{ color: "#fff" }}>같은 브라우저</span>에서만 가능합니다.
        </div>
      </div>
    </div>
  );
}

// 장비창(좌우 3개씩) - 이전과 동일
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

// 메인 RPG 컴포넌트
function RPGGame({ userId, onLogout }) {
  // ... (아래는 이전 코드와 거의 동일, 아이디 입력란/저장버튼 제거) ...
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
  const [activeTab, setActiveTab] = useState("quest");

  // 더블클릭 장착/해제
  const handleInventoryDoubleClick = item => {
    setEquipment(prev => ({
      ...prev, [item.key]: item,
    }));
    setInventory(inv => inv.filter(i => i !== item));
  };
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
  // 저장/불러오기 (아이디로)
  const handleSave = () => {
    if (!userId) return;
    const data = { equipment, inventory, quests, xp, gold };
    localStorage.setItem(`lifergp_save_${userId}`, JSON.stringify(data));
    setMessage("저장 완료!");
    setTimeout(() => setMessage(""), 1200);
  };
  const handleLoad = () => {
    if (!userId) return;
    const raw = localStorage.getItem(`lifergp_save_${userId}`);
    if (!raw) {
      setMessage("저장된 데이터가 없습니다.");
      setTimeout(() => setMessage(""), 1200);
      return;
    }
    try {
      const data = JSON.parse(raw);
      setEquipment(data.equipment || {});
      setInventory(data.inventory || []);
      setQuests(data.quests || [...DEFAULT_QUESTS]);
      setXP(data.xp || 0);
      setGold(data.gold || 0);
      setMessage("불러오기 완료!");
      setTimeout(() => setMessage(""), 1200);
    } catch {
      setMessage("불러오기 실패");
      setTimeout(() => setMessage(""), 1200);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(handleSave, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [userId, equipment, inventory, quests, xp, gold]);

  // --- 게임 화면 ---
  return (
    <div style={{ background: "#222", minHeight: "100vh", color: "#fff", fontFamily: "Pretendard, sans-serif", padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <h1 style={{ margin: 0, fontSize: 34, letterSpacing: 2, fontWeight: 800 }}>Life R.P.G</h1>
        <div>
          <span style={{ fontWeight: 600, fontSize: 17, marginRight: 10, color: "#ffda7b" }}>{userId} 님</span>
          <button onClick={onLogout} style={{ background: "#333", color: "#fff", border: "none", borderRadius: 6, padding: "7px 14px" }}>로그아웃</button>
          <button onClick={handleSave} style={{ marginLeft: 4, background: "#224", color: "#fff", border: "none", borderRadius: 6, padding: "7px 14px" }}>저장</button>
          <button onClick={handleLoad} style={{ marginLeft: 4, background: "#226", color: "#fff", border: "none", borderRadius: 6, padding: "7px 14px" }}>불러오기</button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
        <CharacterPanel equipment={equipment} onIconDoubleClick={handleEquipDoubleClick} />
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8 }}>
            <b>경험치:</b> {xp} | <b>골드:</b> {gold}
            <button onClick={() => setActiveTab("quest")} style={{ marginLeft: 20, marginRight: 4, background: activeTab === "quest" ? "#555" : "#333", color: "#fff" }}>퀘스트</button>
            <button onClick={() => setActiveTab("shop")} style={{ background: activeTab === "shop" ? "#555" : "#333", color: "#fff" }}>상점</button>
          </div>
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
                <input
                  value={questInput}
                  onChange={e => setQuestInput(e.target.value)}
                  placeholder="퀘스트 내용 입력"
                  style={{ width: 180, marginRight: 4 }}
                  onKeyDown={e => e.key === "Enter" && handleQuestAdd()}
                />
                <button onClick={handleQuestAdd}>추가</button>
              </div>
              <h2>인벤토리</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {inventory.map(item => (
                  <div key={item.name + item.rarity}
                    onDoubleClick={() => handleInventoryDoubleClick(item)}
                    style={{
                      width: 56, height: 56, background: "#333c",
                      border: `2px solid ${item.rarity === "전설" ? "#FFD700" : item.rarity === "에픽" ? "#c0f" : item.rarity === "희귀" ? "#08f" : "#555"}`,
                      borderRadius: 8, display: "flex", align
