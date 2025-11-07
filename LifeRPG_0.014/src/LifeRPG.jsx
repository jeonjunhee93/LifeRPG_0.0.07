import React, { useState, useEffect } from "react";

// ---- 아이템 DB (아이콘/이름/레어리티/타입/쓸모없음 등) ----
const ITEMS = [
  // 무기
  { id: "sword_common", name: "무딘 칼", icon: "무딘칼_일반.png", type: "weapon", rarity: "일반" },
  { id: "sword_rare", name: "루비소드", icon: "루비소드_희귀.png", type: "weapon", rarity: "희귀" },
  { id: "sword_epic", name: "파멸의 검", icon: "파멸의검_에픽.png", type: "weapon", rarity: "에픽" },
  { id: "sword_legend", name: "아스가르드의 빛", icon: "아스가르드의빛_전설.png", type: "weapon", rarity: "전설" },
  // 투구
  { id: "helmet_common", name: "녹슨 철 투구", icon: "녹슨 철 투구.png", type: "helmet", rarity: "일반" },
  { id: "helmet_rare", name: "용기의 투구", icon: "용기의 투구.png", type: "helmet", rarity: "희귀" },
  { id: "helmet_epic", name: "검은 달의 투구", icon: "검은 달의 투구.png", type: "helmet", rarity: "에픽" },
  // 갑옷
  { id: "armor_common", name: "낡은 철 갑옷", icon: "낡은 철 갑옷.png", type: "armor", rarity: "일반" },
  { id: "armor_rare", name: "기사단 정예 갑주", icon: "기사단 정예 갑주.png", type: "armor", rarity: "희귀" },
  // 쓸모없는 잡템
  { id: "potion_useless", name: "이상한 포션", icon: "포션_쓸모없음.png", type: "potion", rarity: "일반", useless: true, desc: "효과 없음 (판매 전용)" },
  { id: "banana_peel", name: "바나나 껍질", icon: "바나나껍질.png", type: "useless", rarity: "일반", useless: true, desc: "쓸데없음. 그냥 팔아버리세요." },
];

// ---- 초기 퀘스트 ----
const DEFAULT_QUESTS = [
  { id: 1, text: "집 청소하기", reward: { gold: 30, xp: 10 }, done: false },
  { id: 2, text: "설거지하기", reward: { gold: 25, xp: 8 }, done: false },
  { id: 3, text: "빨래 돌리기", reward: { gold: 20, xp: 7 }, done: false },
];

// ---- 드랍 확률/루팅 시스템 ----
const DROP_TABLE = [
  { id: "sword_common", weight: 50 },
  { id: "helmet_common", weight: 30 },
  { id: "armor_common", weight: 30 },
  { id: "potion_useless", weight: 40 },
  { id: "banana_peel", weight: 25 },
  { id: "sword_rare", weight: 10 },
  { id: "helmet_rare", weight: 8 },
  { id: "armor_rare", weight: 6 },
  { id: "sword_epic", weight: 3 },
  { id: "helmet_epic", weight: 2 },
  { id: "sword_legend", weight: 1 },
];

// ---- 최대 인벤토리 칸 ----
const INVENTORY_SIZE = 12;

// ---- 저장 및 불러오기 ----
const saveKey = (user) => `liferpg_save_${user || "guest"}`;

// ---- 메인 컴포넌트 ----
export default function LifeRPG() {
  // 로그인 및 저장
  const [user, setUser] = useState("");
  const [loginInput, setLoginInput] = useState("");

  // 게임 상태
  const [xp, setXp] = useState(0);
  const [gold, setGold] = useState(0);
  const [quests, setQuests] = useState(DEFAULT_QUESTS);
  const [newQuest, setNewQuest] = useState("");
  const [inventory, setInventory] = useState(Array(INVENTORY_SIZE).fill(null));
  const [equipment, setEquipment] = useState({ weapon: null, helmet: null, armor: null });
  const [shopOpen, setShopOpen] = useState(false);
  const [sellIndex, setSellIndex] = useState(null);

  // ------------- 저장/불러오기 -------------
  useEffect(() => {
    if (!user) return;
    // 불러오기
    const data = localStorage.getItem(saveKey(user));
    if (data) {
      const { xp, gold, quests, inventory, equipment } = JSON.parse(data);
      setXp(xp); setGold(gold); setQuests(quests); setInventory(inventory); setEquipment(equipment);
    } else {
      // 기본값 리셋
      setXp(0); setGold(0);
      setQuests(DEFAULT_QUESTS);
      setInventory(Array(INVENTORY_SIZE).fill(null));
      setEquipment({ weapon: null, helmet: null, armor: null });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(saveKey(user), JSON.stringify({ xp, gold, quests, inventory, equipment }));
    }
  }, [user, xp, gold, quests, inventory, equipment]);

  // ------------- 로그인 -------------
  if (!user) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 80 }}>
        <h1>Life R.P.G</h1>
        <img src="/logo.png" alt="logo" style={{ width: 100, marginBottom: 24 }} />
        <input
          placeholder="아이디 입력"
          value={loginInput}
          onChange={e => setLoginInput(e.target.value)}
          style={{ fontSize: 18, padding: 8, marginBottom: 12, borderRadius: 6, border: "1px solid #bbb" }}
        />
        <button style={{ fontSize: 18, padding: "8px 24px" }} onClick={() => setUser(loginInput || "guest")}>로그인</button>
      </div>
    );
  }

  // ------------- 퀘스트 관련 -------------
  const handleQuestComplete = idx => {
    if (quests[idx].done) return;
    // 보상
    setXp(xp + quests[idx].reward.xp);
    setGold(gold + quests[idx].reward.gold);
    // 루팅 (확률)
    if (Math.random() < 0.6) {
      const item = rollDrop();
      addToInventory(item);
      alert(`[${item.name}]을(를) 획득했습니다!`);
    }
    // 완료 처리
    setQuests(quests.map((q, i) => i === idx ? { ...q, done: true } : q));
  };

  function rollDrop() {
    // 확률 기반 루팅
    const total = DROP_TABLE.reduce((sum, cur) => sum + cur.weight, 0);
    let r = Math.random() * total;
    for (const entry of DROP_TABLE) {
      if (r < entry.weight) return ITEMS.find(i => i.id === entry.id);
      r -= entry.weight;
    }
    return ITEMS[0];
  }

  function addToInventory(item) {
    setInventory(prev => {
      const i = prev.findIndex(x => x === null);
      if (i === -1) return prev; // 가득 찼으면 무시
      const newInv = [...prev];
      newInv[i] = item;
      return newInv;
    });
  }

  // ------------- 장비 관련 -------------
  const handleEquip = idx => {
    const item = inventory[idx];
    if (!item) return;
    if (!["weapon", "helmet", "armor"].includes(item.type)) return;
    setEquipment(prev => ({ ...prev, [item.type]: item }));
    setInventory(prev => prev.map((v, i) => (i === idx ? null : v)));
  };
  const handleUnequip = type => {
    setEquipment(prev => {
      if (!prev[type]) return prev;
      addToInventory(prev[type]);
      return { ...prev, [type]: null };
    });
  };

  // ------------- 아이템 판매 -------------
  const handleSell = idx => {
    if (!inventory[idx]) return;
    setSellIndex(idx);
    setShopOpen(true);
  };
  const confirmSell = price => {
    setGold(gold + price);
    setInventory(prev => prev.map((v, i) => (i === sellIndex ? null : v)));
    setSellIndex(null); setShopOpen(false);
  };

  // ------------- UI -------------
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#232323" }}>
      {/* --- 좌측: 캐릭터 및 장비 --- */}
      <div style={{ width: 320, background: "#2e2e2e", color: "#fff", padding: 28, margin: 20, borderRadius: 20 }}>
        <h2>Life R.P.G</h2>
        <div style={{ position: "relative", width: 180, height: 240, margin: "0 auto 16px" }}>
          <img src="/silhouette.png" alt="캐릭터" style={{ width: "100%", height: "100%" }} />
          {/* 장비 아이콘 (좌/우로 분산) */}
          <div style={{ position: "absolute", left: -36, top: 36 }}>
            {equipment.helmet && (
              <img
                src={`/${equipment.helmet.icon}`}
                alt={equipment.helmet.name}
                style={{ width: 44, cursor: "pointer" }}
                title="투구 해제"
                onDoubleClick={() => handleUnequip("helmet")}
              />
            )}
          </div>
          <div style={{ position: "absolute", left: -36, bottom: 10 }}>
            {equipment.armor && (
              <img
                src={`/${equipment.armor.icon}`}
                alt={equipment.armor.name}
                style={{ width: 44, cursor: "pointer" }}
                title="갑옷 해제"
                onDoubleClick={() => handleUnequip("armor")}
              />
            )}
          </div>
          <div style={{ position: "absolute", right: -36, top: 36 }}>
            {equipment.weapon && (
              <img
                src={`/${equipment.weapon.icon}`}
                alt={equipment.weapon.name}
                style={{ width: 44, cursor: "pointer" }}
                title="무기 해제"
                onDoubleClick={() => handleUnequip("weapon")}
              />
            )}
          </div>
        </div>
        <div style={{ fontSize: 18, margin: "16px 0" }}>경험치: {xp} | 골드: {gold}</div>
        <div style={{ fontSize: 15, color: "#c2e7ff", marginBottom: 10 }}>
          힘: 10 / 지능: 10 / 운: 10
        </div>
      </div>

      {/* --- 우측: 퀘스트, 인벤토리, 상점 --- */}
      <div style={{ flex: 1, padding: 32, color: "#fff" }}>
        {/* 퀘스트 */}
        <h2>퀘스트</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            value={newQuest}
            placeholder="퀘스트 추가"
            onChange={e => setNewQuest(e.target.value)}
            style={{ fontSize: 16, padding: 5, borderRadius: 6, marginRight: 6 }}
            onKeyDown={e => { if (e.key === "Enter" && newQuest.trim()) {
              setQuests([...quests, { id: Date.now(), text: newQuest, reward: { gold: 10, xp: 4 }, done: false }]); setNewQuest("");
            }}}
          />
          <button onClick={() => {
            if (newQuest.trim()) {
              setQuests([...quests, { id: Date.now(), text: newQuest, reward: { gold: 10, xp: 4 }, done: false }]);
              setNewQuest("");
            }
          }}>추가</button>
        </div>
        <ul style={{ margin: "16px 0 24px 0", padding: 0 }}>
          {quests.map((q, i) => (
            <li key={q.id} style={{ fontSize: 17, marginBottom: 7, display: "flex", alignItems: "center", opacity: q.done ? 0.5 : 1 }}>
              <span style={{ flex: 1 }}>{q.text}</span>
              <span style={{ color: "#ffd700", marginLeft: 8 }}>+{q.reward.gold}G</span>
              <span style={{ color: "#70ffd7", marginLeft: 4 }}>+{q.reward.xp}XP</span>
              <button disabled={q.done} style={{ marginLeft: 12, padding: "2px 10px", cursor: q.done ? "not-allowed" : "pointer" }}
                onClick={() => handleQuestComplete(i)}
              >{q.done ? "완료" : "완료하기"}</button>
            </li>
          ))}
        </ul>

        {/* 인벤토리 */}
        <h2>인벤토리</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, minHeight: 110, background: "#262626", borderRadius: 14, padding: 18 }}>
          {inventory.map((item, idx) =>
            <div key={idx} style={{
              width: 56, height: 56, border: "2px solid #333", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center", background: item ? "#444" : "#222", position: "relative"
            }}>
              {item && (
                <img
                  src={`/${item.icon}`}
                  alt={item.name}
                  title={`${item.name} (${item.rarity}${item.useless ? "/쓸모없음" : ""})${item.desc ? `\n${item.desc}` : ""}\n더블클릭: 장착/판매`}
                  style={{ width: 44, height: 44, cursor: item.useless ? "pointer" : "pointer" }}
                  onDoubleClick={() => item.useless ? handleSell(idx) : handleEquip(idx)}
                />
              )}
              {!item && (
                <span style={{ color: "#666" }}>빈칸</span>
              )}
            </div>
          )}
        </div>
        <div style={{ fontSize: 14, marginTop: 10 }}>
          <span style={{ color: "#aaa" }}>더블클릭: 무기/투구/갑옷 장착, 쓸모없는 아이템은 판매</span>
        </div>

        {/* 상점 (판매) */}
        {shopOpen && sellIndex !== null && inventory[sellIndex] && (
          <div style={{
            position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{ background: "#222", padding: 32, borderRadius: 18, color: "#fff", textAlign: "center" }}>
              <h3>아이템 판매</h3>
              <div>
                <img src={`/${inventory[sellIndex].icon}`} alt={inventory[sellIndex].name} style={{ width: 60, marginBottom: 16 }} />
                <div style={{ fontSize: 17, marginBottom: 6 }}>{inventory[sellIndex].name}</div>
                <div style={{ fontSize: 14, color: "#aaa", marginBottom: 16 }}>
                  {inventory[sellIndex].desc || "아이템을 판매하시겠습니까?"}
                </div>
                <button style={{ margin: "0 10px", padding: "6px 22px" }}
                  onClick={() => confirmSell(12)}
                >12 G에 판매</button>
                <button style={{ margin: "0 10px", padding: "6px 22px" }} onClick={() => setShopOpen(false)}>취소</button>
              </div>
            </div>
          </div>
        )}

        {/* 로그아웃 */}
        <div style={{ marginTop: 24 }}>
          <button onClick={() => setUser("")} style={{ color: "#eee", background: "#444", padding: "4px 18px", borderRadius: 8 }}>로그아웃</button>
        </div>
      </div>
    </div>
  );
}
