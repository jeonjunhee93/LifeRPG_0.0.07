// src/LifeRPG.jsx
import React, { useState, useEffect } from "react";

// --- 장비/잡템 데이터 ---
const EQUIP_TYPES = [
  { key: "weapon", label: "무기", icon: "무딘칼_일반.png" },
  { key: "helmet", label: "투구", icon: "녹슨 철 투구.png" },
  { key: "armor", label: "갑옷", icon: "낡은 철 갑옷.png" },
];

const ALL_ITEMS = [
  // 장비 아이템
  { name: "무딘 칼", type: "weapon", rarity: "일반", img: "무딘칼_일반.png" },
  { name: "루비소드", type: "weapon", rarity: "희귀", img: "루비소드_희귀.png" },
  { name: "파멸의 검", type: "weapon", rarity: "에픽", img: "파멸의검_에픽.png" },
  { name: "아스가르드의 빛", type: "weapon", rarity: "전설", img: "아스가르드의빛_전설.png" },
  { name: "녹슨 철 투구", type: "helmet", rarity: "일반", img: "녹슨 철 투구.png" },
  { name: "용기의 투구", type: "helmet", rarity: "희귀", img: "용기의 투구.png" },
  { name: "검은 달의 투구", type: "helmet", rarity: "에픽", img: "검은 달의 투구.png" },
  { name: "신왕의 면류관", type: "helmet", rarity: "전설", img: "신왕의 면류관.png" },
  { name: "낡은 철 갑옷", type: "armor", rarity: "일반", img: "낡은 철 갑옷.png" },
  { name: "기사단 정예 갑주", type: "armor", rarity: "희귀", img: "기사단 정예 갑주.png" },
  { name: "피의 결의 갑옷", type: "armor", rarity: "에픽", img: "피의 결의 갑옷.png" },
  { name: "신성한 왕의 갑옷", type: "armor", rarity: "전설", img: "신성한 왕의 갑옷.png" },
  // 쓸모없는 아이템(판매 전용)
  { name: "체력 포션", type: "junk", rarity: "일반", img: "체력포션.png" },
  { name: "마나 포션", type: "junk", rarity: "일반", img: "마나포션.png" },
  { name: "바나나 껍질", type: "junk", rarity: "희귀", img: "바나나껍질.png" },
  { name: "맹독버섯", type: "junk", rarity: "에픽", img: "맹독버섯.png" },
  { name: "삐삐 머리핀", type: "junk", rarity: "희귀", img: "삐삐머리핀.png" },
];

const ITEM_DROP_TABLE = [
  ...ALL_ITEMS.filter(i => i.type !== "junk").map(i => ({ ...i, weight:
    i.rarity === "일반" ? 60 : i.rarity === "희귀" ? 25 : i.rarity === "에픽" ? 10 : 5 })),
  ...ALL_ITEMS.filter(i => i.type === "junk").map(i => ({ ...i, weight: 18 }))
];

const DEFAULT_QUESTS = [
  { text: "집 청소하기", reward: { xp: 10, gold: 5 } },
  { text: "설거지 하기", reward: { xp: 8, gold: 4 } },
  { text: "빨래 널기", reward: { xp: 6, gold: 3 } },
];

const BLANK_EQUIPMENT = EQUIP_TYPES.reduce((acc, e) => ({ ...acc, [e.key]: null }), {});
const INV_SIZE = 12;

function weightedRandomItem(table) {
  const total = table.reduce((sum, i) => sum + i.weight, 0);
  let n = Math.random() * total;
  for (const item of table) {
    if (n < item.weight) return item;
    n -= item.weight;
  }
  return table[0];
}

const LOCAL_KEY = "liferpg_save";

export default function LifeRPG() {
  // 로그인/저장
  const [userId, setUserId] = useState("");
  const [savedUser, setSavedUser] = useState("");
  // 게임 상태
  const [xp, setXP] = useState(0);
  const [gold, setGold] = useState(0);
  const [equipment, setEquipment] = useState({ ...BLANK_EQUIPMENT });
  const [inventory, setInventory] = useState(Array(INV_SIZE).fill(null));
  const [quests, setQuests] = useState([...DEFAULT_QUESTS]);
  const [questInput, setQuestInput] = useState("");
  const [shopTab, setShopTab] = useState(false);
  const [log, setLog] = useState([]);

  // 저장/불러오기
  useEffect(() => {
    if (savedUser) {
      const raw = localStorage.getItem(LOCAL_KEY + "_" + savedUser);
      if (raw) {
        const { xp, gold, equipment, inventory, quests } = JSON.parse(raw);
        setXP(xp); setGold(gold);
        setEquipment(equipment); setInventory(inventory);
        setQuests(quests);
      }
    }
  }, [savedUser]);
  useEffect(() => {
    if (savedUser) {
      localStorage.setItem(
        LOCAL_KEY + "_" + savedUser,
        JSON.stringify({ xp, gold, equipment, inventory, quests })
      );
    }
  }, [xp, gold, equipment, inventory, quests, savedUser]);

  // 로그인
  function handleLogin() {
    if (!userId) return;
    setSavedUser(userId);
    setLog(["로그인 성공!"]);
  }

  // 퀘스트 추가
  function addQuest() {
    if (questInput.trim()) {
      setQuests([...quests, { text: questInput, reward: { xp: 10, gold: 5 } }]);
      setQuestInput("");
    }
  }

  // 퀘스트 완료(아이템 루팅)
  function completeQuest(idx) {
    const { xp: rx, gold: rg } = quests[idx].reward;
    setXP(xp + rx);
    setGold(gold + rg);
    let dropMsg = "";
    if (Math.random() < 0.65) {
      // 65% 확률 드랍
      const drop = weightedRandomItem(ITEM_DROP_TABLE);
      // 인벤토리 빈칸
      const invIdx = inventory.findIndex(i => !i);
      if (invIdx !== -1) {
        const newInv = [...inventory];
        newInv[invIdx] = drop;
        setInventory(newInv);
        dropMsg = `획득! [${drop.name}]`;
      } else {
        dropMsg = "인벤토리 공간 부족!";
      }
    } else {
      dropMsg = "아이템을 획득하지 못함";
    }
    setLog([`퀘스트 완료: ${quests[idx].text} (경험치 +${rx}, 골드 +${rg})`, dropMsg]);
    setQuests(quests.filter((_, i) => i !== idx));
  }

  // 인벤토리 더블클릭 → 장착/판매
  function handleInventoryDoubleClick(idx) {
    const item = inventory[idx];
    if (!item) return;
    if (item.type === "junk") {
      setGold(gold + 3);
      const newInv = [...inventory];
      newInv[idx] = null;
      setInventory(newInv);
      setLog([`${item.name}을(를) 판매! (골드+3)`]);
      return;
    }
    // 장비 아이템
    const slot = EQUIP_TYPES.find(e => e.key === item.type);
    if (slot) {
      // 이미 해당 부위에 장비 있으면 교체
      const newEquip = { ...equipment, [slot.key]: item };
      setEquipment(newEquip);
      const newInv = [...inventory];
      newInv[idx] = null;
      setInventory(newInv);
      setLog([`${item.name} 장착!`]);
    }
  }
  // 장비 더블클릭 → 해제
  function handleEquipmentDoubleClick(type) {
    if (!equipment[type]) return;
    // 인벤토리 빈칸에 해제
    const idx = inventory.findIndex(i => !i);
    if (idx === -1) {
      setLog(["인벤토리 공간 부족!"]);
      return;
    }
    const newInv = [...inventory];
    newInv[idx] = equipment[type];
    setInventory(newInv);
    setEquipment({ ...equipment, [type]: null });
    setLog([`${equipment[type].name} 해제!`]);
  }

  // 상점 - 인벤토리에서 판매
  function handleShopSell(idx) {
    const item = inventory[idx];
    if (!item || item.type !== "junk") return;
    setGold(gold + 3);
    const newInv = [...inventory];
    newInv[idx] = null;
    setInventory(newInv);
    setLog([`${item.name} 상점 판매! (골드+3)`]);
  }

  // 화면
  if (!savedUser)
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#232323", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ color: "#fff", marginBottom: 24, fontSize: 36 }}>Life R.P.G</h1>
        <div style={{ background: "#2d2d2d", padding: 32, borderRadius: 12 }}>
          <input
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="아이디를 입력하세요"
            style={{ fontSize: 18, padding: 8, borderRadius: 4, width: 200 }}
          />
          <button onClick={handleLogin} style={{ marginLeft: 12, fontSize: 18 }}>로그인</button>
        </div>
        <div style={{ color: "#bbb", marginTop: 20, fontSize: 13 }}>아무 아이디나 사용, 자동저장</div>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: "#222", color: "#fff", fontFamily: "Pretendard, sans-serif" }}>
      <div style={{ display: "flex", gap: 40, padding: 40, maxWidth: 1100, margin: "0 auto" }}>
        {/* 캐릭터/장비창 */}
        <div style={{ flex: "0 0 300px", background: "#292929", borderRadius: 16, padding: 24, boxShadow: "0 2px 16px #0002" }}>
          <h2 style={{ textAlign: "center" }}>장비</h2>
          {/* 실루엣 */}
          <div style={{ position: "relative", width: 180, height: 240, margin: "16px auto" }}>
            <img src="/silhouette.png" alt="캐릭터" style={{ width: "100%", height: "100%" }} />
            {/* 장비 아이콘 (실루엣 양옆에 3개씩 배치) */}
            {EQUIP_TYPES.map((slot, idx) => (
              <div
                key={slot.key}
                style={{
                  position: "absolute",
                  left: idx === 0 ? -40 : idx === 1 ? 160 : 70,
                  top: idx === 2 ? 170 : 10 + idx * 60,
                  width: 48, height: 48, background: "#181818aa", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid #3a3a3a", cursor: equipment[slot.key] ? "pointer" : "default"
                }}
                onDoubleClick={() => handleEquipmentDoubleClick(slot.key)}
                title={equipment[slot.key]?.name || `${slot.label} 칸 (더블클릭 해제)`}
              >
                {equipment[slot.key] ?
                  <img src={`/${equipment[slot.key].img}`} alt={equipment[slot.key].name} style={{ width: 40, height: 40 }} /> :
                  <span style={{ color: "#888", fontSize: 22 }}>{slot.label}</span>
                }
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, fontSize: 18 }}>경험치: {xp} | 골드: {gold}</div>
        </div>

        {/* 인벤토리/퀘스트/상점 */}
        <div style={{ flex: 1 }}>
          <h2>
            <button
              onClick={() => setShopTab(false)}
              style={{
                fontSize: 20, fontWeight: shopTab ? 400 : 700,
                background: shopTab ? "#333" : "#fff", color: shopTab ? "#fff" : "#222",
                border: "none", borderRadius: 6, marginRight: 8, padding: "2px 18px", cursor: "pointer"
              }}
            >인벤토리</button>
            <button
              onClick={() => setShopTab(true)}
              style={{
                fontSize: 20, fontWeight: shopTab ? 700 : 400,
                background: shopTab ? "#fff" : "#333", color: shopTab ? "#222" : "#fff",
                border: "none", borderRadius: 6, padding: "2px 18px", cursor: "pointer"
              }}
            >상점</button>
          </h2>
          {!shopTab ? (
            <>
              {/* 인벤토리 */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(6, 62px)", gap: 12, background: "#242424", padding: 18, borderRadius: 12, marginBottom: 24
              }}>
                {inventory.map((item, idx) =>
                  <div
                    key={idx}
                    style={{
                      width: 60, height: 60, background: item ? "#18181a" : "#333",
                      borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                      border: "2px solid #444", cursor: item ? "pointer" : "default", position: "relative"
                    }}
                    title={item ? `${item.name} (${item.rarity})${item.type === "junk" ? " (쓸모없음, 판매가능)" : ""}` : "빈칸"}
                    onDoubleClick={() => handleInventoryDoubleClick(idx)}
                  >
                    {item ?
                      <img src={`/${item.img}`} alt={item.name} style={{ width: 44, height: 44 }} /> :
                      <span style={{ color: "#888" }}>빈칸</span>
                    }
                  </div>
                )}
              </div>
              {/* 퀘스트 */}
              <h3>퀘스트</h3>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <input
                  value={questInput}
                  onChange={e => setQuestInput(e.target.value)}
                  placeholder="퀘스트 내용을 입력하세요"
                  style={{ flex: 1, padding: 6, borderRadius: 4, border: "1px solid #aaa" }}
                  onKeyDown={e => e.key === "Enter" && addQuest()}
                />
                <button onClick={addQuest} style={{ borderRadius: 6, fontWeight: 600 }}>추가</button>
              </div>
              <div>
                {quests.map((q, idx) => (
                  <div key={idx} style={{ background: "#363636", borderRadius: 7, padding: "8px 16px", marginBottom: 7, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{q.text}</span>
                      <span style={{ fontSize: 14, color: "#ffdc91", marginLeft: 8 }}>
                        (경험치+{q.reward.xp}, 골드+{q.reward.gold})
                      </span>
                    </div>
                    <button
                      onClick={() => completeQuest(idx)}
                      style={{ borderRadius: 6, fontWeight: 600, background: "#198e1e", color: "#fff", padding: "4px 14px", cursor: "pointer" }}>
                      완료
                    </button>
                  </div>
                ))}
              </div>
              {/* 로그 */}
              <div style={{ marginTop: 14, fontSize: 13, color: "#aaa", minHeight: 34 }}>
                {log.map((l, i) => <div key={i}>{l}</div>)}
              </div>
              <div style={{ marginTop: 25, color: "#888", fontSize: 13 }}>
                - 인벤토리 아이템 더블클릭: 장착/판매<br />
                - 장비 아이콘 더블클릭: 해제
              </div>
            </>
          ) : (
            <>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(6, 62px)", gap: 12, background: "#222", padding: 18, borderRadius: 12, marginBottom: 24
              }}>
                {inventory.map((item, idx) =>
                  <div
                    key={idx}
                    style={{
                      width: 60, height: 60, background: item ? "#18181a" : "#333",
                      borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                      border: "2px solid #444", cursor: item && item.type === "junk" ? "pointer" : "not-allowed"
                    }}
                    title={item && item.type === "junk" ? "더블클릭: 판매" : ""}
                    onDoubleClick={() => handleShopSell(idx)}
                  >
                    {item ?
                      <img src={`/${item.img}`} alt={item.name} style={{ width: 44, height: 44, opacity: item.type === "junk" ? 1 : 0.4 }} /> :
                      <span style={{ color: "#888" }}>빈칸</span>
                    }
                  </div>
                )}
              </div>
              <div style={{ marginTop: 20, color: "#ffdc91", fontSize: 15 }}>
                ※ 상점에서는 <b>쓸모없는 아이템만</b> 판매 가능합니다. (더블클릭)
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
