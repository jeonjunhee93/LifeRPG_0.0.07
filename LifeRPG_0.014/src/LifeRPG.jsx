import React, { useState, useEffect } from "react";

const EQUIP_TYPES = [
  { key: "weapon", label: "무기" },
  { key: "helmet", label: "투구" },
  { key: "armor", label: "갑옷" },
  { key: "glove", label: "장갑" },
  { key: "shield", label: "방패" },
  { key: "shoes", label: "신발" }
];

const ALL_ITEMS = [
  { name: "무딘 칼", type: "weapon", rarity: "일반", img: "무딘칼_일반.png" },
  { name: "기사 투구", type: "helmet", rarity: "일반", img: "녹슨 철 투구.png" },
  { name: "철 갑옷", type: "armor", rarity: "일반", img: "낡은 철 갑옷.png" },
  { name: "가죽 장갑", type: "glove", rarity: "일반", img: "가죽장갑.png" },
  { name: "나무 방패", type: "shield", rarity: "일반", img: "나무방패.png" },
  { name: "낡은 신발", type: "shoes", rarity: "일반", img: "낡은신발.png" },
  { name: "바나나 껍질", type: "junk", rarity: "희귀", img: "바나나껍질.png" }
];

const ITEM_DROP_TABLE = [
  ...ALL_ITEMS.filter(i => i.type !== "junk").map(i => ({ ...i, weight: 40 })),
  ...ALL_ITEMS.filter(i => i.type === "junk").map(i => ({ ...i, weight: 25 }))
];

const REWARD_SHOP = [
  { name: "디저트 먹기", price: 15, desc: "스트레스 해소! (효과는 없음)", img: "dessert.png" },
  { name: "유튜브 시청", price: 10, desc: "10분간 자유!", img: "youtube.png" },
  { name: "아이스커피", price: 12, desc: "기분전환용", img: "coffee.png" }
];

const DEFAULT_QUESTS = [
  { text: "집 청소하기", reward: { xp: 10, gold: 5 } },
  { text: "설거지 하기", reward: { xp: 8, gold: 4 } },
  { text: "빨래 널기", reward: { xp: 6, gold: 3 } }
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
  const [userId, setUserId] = useState("");
  const [savedUser, setSavedUser] = useState("");
  const [xp, setXP] = useState(0);
  const [gold, setGold] = useState(0);
  const [equipment, setEquipment] = useState({ ...BLANK_EQUIPMENT });
  const [inventory, setInventory] = useState(Array(INV_SIZE).fill(null));
  const [quests, setQuests] = useState([...DEFAULT_QUESTS]);
  const [questInput, setQuestInput] = useState("");
  const [shopTab, setShopTab] = useState("sell");
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (savedUser) {
      const raw = localStorage.getItem(LOCAL_KEY + "_" + savedUser);
      if (raw) {
        const { xp, gold, equipment, inventory, quests } = JSON.parse(raw);
        setXP(xp); setGold(gold); setEquipment(equipment); setInventory(inventory); setQuests(quests);
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

  function handleLogin() {
    if (!userId) return;
    setSavedUser(userId);
    setLog(["로그인 성공!"]);
  }

  function addQuest() {
    if (questInput.trim()) {
      setQuests([...quests, { text: questInput, reward: { xp: 10, gold: 5 } }]);
      setQuestInput("");
    }
  }

  function completeQuest(idx) {
    const { xp: rx, gold: rg } = quests[idx].reward;
    setXP(xp + rx); setGold(gold + rg);
    let dropMsg = "";
    if (Math.random() < 0.65) {
      const drop = weightedRandomItem(ITEM_DROP_TABLE);
      const invIdx = inventory.findIndex(i => !i);
      if (invIdx !== -1) {
        const newInv = [...inventory];
        newInv[invIdx] = drop;
        setInventory(newInv);
        dropMsg = `획득! [${drop.name}]`;
      } else dropMsg = "인벤토리 공간 부족!";
    } else dropMsg = "아이템을 획득하지 못함";
    setLog([`퀘스트 완료: ${quests[idx].text} (경험치 +${rx}, 골드 +${rg})`, dropMsg]);
    setQuests(quests.filter((_, i) => i !== idx));
  }

  // 인벤토리 더블클릭: 장비만 장착(잡템은 판매 불가)
  function handleInventoryDoubleClick(idx) {
    const item = inventory[idx];
    if (!item) return;
    // 잡템은 판매 불가 (상점-판매 탭에서만)
    if (item.type === "junk") {
      setLog(["잡템은 상점-판매 탭에서만 판매 가능합니다!"]);
      return;
    }
    const slot = EQUIP_TYPES.find(e => e.key === item.type);
    if (slot) {
      const newEquip = { ...equipment, [slot.key]: item };
      setEquipment(newEquip);
      const newInv = [...inventory]; newInv[idx] = null;
      setInventory(newInv);
      setLog([`${item.name} 장착!`]);
    }
  }

  // 장비 더블클릭 → 해제
  function handleEquipmentDoubleClick(type) {
    if (!equipment[type]) return;
    const idx = inventory.findIndex(i => !i);
    if (idx === -1) {
      setLog(["인벤토리 공간 부족!"]);
      return;
    }
    const newInv = [...inventory]; newInv[idx] = equipment[type];
    setInventory(newInv); setEquipment({ ...equipment, [type]: null });
    setLog([`${equipment[type].name} 해제!`]);
  }

  // 상점-판매 탭에서만 잡템 더블클릭 판매 가능
  function handleShopSell(idx) {
    const item = inventory[idx];
    if (!item || item.type !== "junk") return;
    setGold(gold + 3);
    const newInv = [...inventory]; newInv[idx] = null;
    setInventory(newInv);
    setLog([`${item.name} 상점 판매! (골드+3)`]);
  }

  function handleBuyReward(idx) {
    const item = REWARD_SHOP[idx];
    if (gold < item.price) {
      setLog([`${item.name} 구매 실패 (골드 부족)`]);
      return;
    }
    setGold(gold - item.price);
    setLog([`${item.name} 구매 성공! (${item.desc})`]);
  }

  const equipPositions = [
    { left: -70, top: 10 }, { left: -70, top: 70 }, { left: -70, top: 130 },
    { left: 210, top: 10 }, { left: 210, top: 70 }, { left: 210, top: 130 }
  ];

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
        {/* 장비창 */}
        <div style={{ flex: "0 0 340px", background: "#292929", borderRadius: 16, padding: 24, boxShadow: "0 2px 16px #0002" }}>
          <h2 style={{ textAlign: "center" }}>장비</h2>
          <div style={{ position: "relative", width: 280, height: 230, margin: "24px auto" }}>
            <img src="/silhouette.png" alt="캐릭터" style={{ position: "absolute", left: 70, width: 140, height: 230, zIndex: 0, opacity: 0.97 }} />
            {EQUIP_TYPES.map((slot, idx) => (
              <div
                key={slot.key}
                style={{
                  position: "absolute", left: equipPositions[idx].left, top: equipPositions[idx].top,
                  width: 56, height: 56, background: "#181818cc", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid #3a3a3a", cursor: equipment[slot.key] ? "pointer" : "default", zIndex: 2
                }}
                onDoubleClick={() => handleEquipmentDoubleClick(slot.key)}
                title={equipment[slot.key]?.name || `${slot.label} 칸 (더블클릭 해제)`}
              >
                {equipment[slot.key] ?
                  <img src={`/${equipment[slot.key].img}`} alt={equipment[slot.key].name} style={{ width: 44, height: 44 }} /> :
                  <span style={{ color: "#888", fontSize: 15 }}>{slot.label}</span>
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
              onClick={() => setShopTab("sell")}
              style={{
                fontSize: 20, fontWeight: shopTab === "sell" ? 700 : 400,
                background: shopTab === "sell" ? "#fff" : "#333", color: shopTab === "sell" ? "#222" : "#fff",
                border: "none", borderRadius: 6, marginRight: 8, padding: "2px 18px", cursor: "pointer"
              }}
            >판매</button>
            <button
              onClick={() => setShopTab("reward")}
              style={{
                fontSize: 20, fontWeight: shopTab === "reward" ? 700 : 400,
                background: shopTab === "reward" ? "#fff" : "#333", color: shopTab === "reward" ? "#222" : "#fff",
                border: "none", borderRadius: 6, padding: "2px 18px", cursor: "pointer"
              }}
            >보상</button>
          </h2>
          {shopTab === "sell" ? (
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
          ) : (
            <div style={{
              display: "flex", gap: 28, background: "#222", padding: 24, borderRadius: 12, marginBottom: 24
            }}>
              {REWARD_SHOP.map((item, idx) => (
                <div key={idx} style={{
                  background: "#292929", borderRadius: 10, width: 128, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 2px 8px #0002"
                }}>
                  <img src={`/${item.img}`} alt={item.name} style={{ width: 50, height: 50, marginBottom: 8 }} />
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ color: "#ffd", fontSize: 14, marginBottom: 7 }}>{item.desc}</div>
                  <button
                    style={{ fontSize: 15, padding: "4px 13px", background: "#3988ef", color: "#fff", borderRadius: 7, border: "none", fontWeight: 600, cursor: "pointer" }}
                    onClick={() => handleBuyReward(idx)}
                  >구매 {item.price}G</button>
                </div>
              ))}
            </div>
          )}
          {/* 인벤토리, 퀘스트, 로그는 판매 탭에서만 노출 */}
          {shopTab === "sell" && (
            <>
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
              <div style={{ marginTop: 14, fontSize: 13, color: "#aaa", minHeight: 34 }}>
                {log.map((l, i) => <div key={i}>{l}</div>)}
              </div>
              <div style={{ marginTop: 25, color: "#888", fontSize: 13 }}>
                - 인벤토리 아이템 더블클릭: 장착<br />
                - 장비 아이콘 더블클릭: 해제<br />
                - 쓸모없는 아이템은 상점-판매 탭에서만 판매 가능
              </div>
            </>
          )}
          {shopTab === "reward" && (
            <div style={{ marginTop: 24, fontSize: 13, color: "#aaa", minHeight: 40 }}>
              {log.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
