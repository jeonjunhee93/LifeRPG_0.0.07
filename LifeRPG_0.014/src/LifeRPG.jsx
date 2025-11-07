import React, { useState } from "react";

const EQUIP_SLOTS = ["무기", "투구", "갑옷", "장갑", "방패", "신발"];
const LEFT_SLOTS = ["무기", "투구", "갑옷"];
const RIGHT_SLOTS = ["장갑", "방패", "신발"];

const ALL_ITEMS = [
  { name: "무딘 칼", slot: "무기", rarity: "일반", img: "/무딘칼_일반.png", value: 50 },
  { name: "파멸의 검", slot: "무기", rarity: "에픽", img: "/파멸의검_에픽.png", value: 500 },
  { name: "루비소드", slot: "무기", rarity: "희귀", img: "/루비소드_희귀.png", value: 120 },
  { name: "아스가르드의 빛", slot: "무기", rarity: "전설", img: "/아스가르드의빛_전설.png", value: 2000 },
  { name: "녹슨 철 투구", slot: "투구", rarity: "일반", img: "/녹슨 철 투구.png", value: 40 },
  { name: "용기의 투구", slot: "투구", rarity: "희귀", img: "/용기의 투구.png", value: 110 },
  { name: "검은 달의 투구", slot: "투구", rarity: "에픽", img: "/검은 달의 투구.png", value: 450 },
  { name: "신왕의 면류관", slot: "투구", rarity: "전설", img: "/신왕의 면류관.png", value: 1400 },
  { name: "낡은 철 갑옷", slot: "갑옷", rarity: "일반", img: "/낡은 철 갑옷.png", value: 80 },
  { name: "기사단 정예 갑주", slot: "갑옷", rarity: "희귀", img: "/기사단 정예 갑주.png", value: 180 },
  { name: "피의 결의 갑옷", slot: "갑옷", rarity: "에픽", img: "/피의 결의 갑옷.png", value: 390 },
  { name: "황제의 황금 갑옷", slot: "갑옷", rarity: "전설", img: "/황제의 황금 갑옷.png", value: 1800 },
  { name: "험난한 가죽 장갑", slot: "장갑", rarity: "일반", img: "/험난한 가죽 장갑.png", value: 20 },
  { name: "철의 손아귀", slot: "장갑", rarity: "희귀", img: "/철의 손아귀.png", value: 100 },
  { name: "불사의 손길", slot: "장갑", rarity: "에픽", img: "/불사의 손길.png", value: 390 },
  { name: "왕의 건틀릿", slot: "장갑", rarity: "전설", img: "/왕의 건틀릿.png", value: 990 },
  { name: "초보자 방패", slot: "방패", rarity: "일반", img: "/초보자 방패.png", value: 40 },
  { name: "은빛 방패", slot: "방패", rarity: "희귀", img: "/은빛 방패.png", value: 80 },
  { name: "성기사의 방패", slot: "방패", rarity: "에픽", img: "/성기사의 방패.png", value: 380 },
  { name: "용살의 방패", slot: "방패", rarity: "전설", img: "/용살의 방패.png", value: 1200 },
  { name: "해진 가죽 신발", slot: "신발", rarity: "일반", img: "/해진 가죽 신발.png", value: 30 },
  { name: "기사단 군화", slot: "신발", rarity: "희귀", img: "/기사단 군화.png", value: 110 },
  { name: "피의 각인 신발", slot: "신발", rarity: "에픽", img: "/피의 각인 신발.png", value: 320 },
  { name: "신왕의 부츠", slot: "신발", rarity: "전설", img: "/신왕의 부츠.png", value: 770 },
  { name: "의문의 빨간 포션", slot: null, rarity: "잡템", img: "/의문의포션.png", value: 10, useless: true },
  { name: "이상한 돌멩이", slot: null, rarity: "잡템", img: "/이상한돌멩이.png", value: 7, useless: true },
  { name: "쓸모없는 고철", slot: null, rarity: "잡템", img: "/고철.png", value: 13, useless: true },
];

const SHOP_REWARDS = [
  { name: "디저트 먹기", price: 200, img: "/dessert.png" },
  { name: "유튜브 30분 시청", price: 300, img: "/youtube.png" },
  { name: "카페 커피 한 잔", price: 500, img: "/coffee.png" },
  { name: "하루 휴식권", price: 2000, img: "/rest.png" },
];

const BASE_QUESTS = [
  { text: "집 청소하기", difficulty: "보통", rewardXP: 20, rewardGold: 30 },
  { text: "미뤄둔 업무 처리", difficulty: "어려움", rewardXP: 40, rewardGold: 50 },
  { text: "세탁물 정리", difficulty: "쉬움", rewardXP: 10, rewardGold: 10 },
];

const randomGold = (item) => Math.floor(item.value * (0.8 + Math.random() * 0.4));

export default function LifeRPG() {
  const [tab, setTab] = useState("퀘스트");
  const [userId, setUserId] = useState("");
  const [login, setLogin] = useState(false);
  const [exp, setExp] = useState(0);
  const [gold, setGold] = useState(0);
  const [equipment, setEquipment] = useState({});
  const [inventory, setInventory] = useState([]);
  const [questText, setQuestText] = useState("");
  const [quests, setQuests] = useState(BASE_QUESTS);
  const [shopMessage, setShopMessage] = useState("");
  const [rewardMessage, setRewardMessage] = useState("");

  if (!login) {
    return (
      <div style={{
        minHeight: "100vh", background: "#222", color: "#fff",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <h1 style={{ fontSize: 44, marginBottom: 40 }}>Life R.P.G</h1>
        <div style={{
          background: "#333", borderRadius: 12, padding: 32, minWidth: 340,
          boxShadow: "0 4px 24px #0009", display: "flex", flexDirection: "column", alignItems: "center"
        }}>
          <span style={{ fontSize: 18, marginBottom: 8 }}>아이디로 저장됩니다</span>
          <input value={userId} onChange={e => setUserId(e.target.value)}
            placeholder="아이디 입력" style={{
              marginBottom: 16, fontSize: 18, padding: "8px 16px",
              borderRadius: 8, border: "1px solid #666", outline: "none"
            }} />
          <button onClick={() => setLogin(true)}
            disabled={!userId.trim()}
            style={{
              width: 140, height: 44, fontSize: 20,
              background: "#4d65f7", color: "#fff", borderRadius: 10, border: "none",
              cursor: userId.trim() ? "pointer" : "not-allowed"
            }}>
            시작하기
          </button>
        </div>
      </div>
    );
  }

  // 장착/해제
  const equip = (item) => {
    if (!item.slot) return;
    setEquipment(e => ({ ...e, [item.slot]: item }));
    setInventory(inv => inv.filter(i => i !== item));
  };
  const unequip = (slot) => {
    if (equipment[slot]) {
      setInventory(inv => [...inv, equipment[slot]]);
      setEquipment(e => ({ ...e, [slot]: undefined }));
    }
  };

  // 아이템 루팅
  function getRandomDrop() {
    if (Math.random() < 0.6) return null;
    const roll = Math.random();
    if (roll < 0.3) {
      const useless = ALL_ITEMS.filter(x => x.useless);
      return useless[Math.floor(Math.random() * useless.length)];
    }
    if (roll < 0.9) {
      const pool = ALL_ITEMS.filter(
        x =>
          x.slot &&
          ["일반", "희귀", "에픽"].includes(x.rarity)
      );
      let item;
      while (!item) {
        const i = pool[Math.floor(Math.random() * pool.length)];
        if (i.rarity === "에픽" && Math.random() > 0.3) continue;
        if (i.rarity === "희귀" && Math.random() > 0.7) continue;
        item = i;
      }
      return item;
    }
    const legendary = ALL_ITEMS.filter(x => x.rarity === "전설");
    return legendary[Math.floor(Math.random() * legendary.length)];
  }
  const completeQuest = (qidx) => {
    const q = quests[qidx];
    setExp(x => x + q.rewardXP);
    setGold(g => g + q.rewardGold);
    let msg = `경험치 +${q.rewardXP} 골드 +${q.rewardGold}`;
    const drop = getRandomDrop();
    if (drop) {
      setInventory(inv => [...inv, drop]);
      msg += ` / 루팅: ${drop.name}`;
    }
    alert(msg);
    setQuests(qs => qs.filter((_, i) => i !== qidx));
  };

  // 인벤토리 더블클릭: 장착/판매
  const handleInventoryDoubleClick = (item) => {
    if (item.slot) {
      equip(item);
    } else if (tab === "상점") {
      setInventory(inv => inv.filter(i => i !== item));
      setGold(g => g + randomGold(item));
      setShopMessage(`"${item.name}"를 판매했습니다!`);
    }
  };

  // 상점: 쓸모없는 아이템만 판매
  const uselessItems = inventory.filter(x => x.useless);

  // 상점 보상 구매
  const buyReward = (r) => {
    if (gold < r.price) {
      setRewardMessage("골드가 부족합니다!");
      return;
    }
    setGold(g => g - r.price);
    setRewardMessage(`보상: ${r.name} 을(를) 구매했습니다!`);
  };

  // 퀘스트 추가
  const addQuest = () => {
    if (questText.trim()) {
      setQuests(qs => [
        ...qs,
        {
          text: questText,
          difficulty: "사용자", rewardXP: 30, rewardGold: 30
        }
      ]);
      setQuestText("");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#222", color: "#fff",
      fontFamily: "Pretendard, Arial, sans-serif",
      paddingBottom: 32
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 900, margin: "0 auto", padding: "24px 0 0 0" }}>
        <h2 style={{ fontSize: 32, letterSpacing: -2 }}>Life R.P.G</h2>
        <div>
          <button style={{ marginRight: 8, fontSize: 18, background: tab === "퀘스트" ? "#4d65f7" : "#333", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", cursor: "pointer" }} onClick={() => setTab("퀘스트")}>퀘스트</button>
          <button style={{ marginRight: 8, fontSize: 18, background: tab === "장비" ? "#4d65f7" : "#333", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", cursor: "pointer" }} onClick={() => setTab("장비")}>장비</button>
          <button style={{ fontSize: 18, background: tab === "상점" ? "#4d65f7" : "#333", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", cursor: "pointer" }} onClick={() => setTab("상점")}>상점</button>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", marginTop: 6, fontSize: 17, color: "#ffd23a", fontWeight: 600, marginBottom: 8 }}>
        경험치: {exp} | 골드: {gold}
      </div>
      {tab === "퀘스트" && (
        <div style={{
          background: "#292929", borderRadius: 20, maxWidth: 900, margin: "0 auto",
          marginTop: 8, padding: "26px 38px"
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>퀘스트</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
            <input value={questText} onChange={e => setQuestText(e.target.value)}
              placeholder="새 퀘스트를 입력하세요" style={{
                fontSize: 18, borderRadius: 7, border: "1px solid #444", padding: "5px 12px", width: 300
              }} />
            <button onClick={addQuest} style={{ fontSize: 16, padding: "5px 16px", borderRadius: 8, background: "#4d65f7", color: "#fff", border: "none", fontWeight: 600 }}>추가</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {quests.length === 0 && (
              <div style={{ color: "#aaa", fontSize: 16, margin: "24px 0" }}>모든 퀘스트를 완료했습니다!</div>
            )}
            {quests.map((q, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#222", padding: "13px 18px", borderRadius: 10
              }}>
                <div>
                  <b>{q.text}</b>
                  <span style={{
                    fontSize: 14, fontWeight: 500,
                    color: q.difficulty === "어려움" ? "#fa5555" : q.difficulty === "보통" ? "#ffd23a" : "#98d957",
                    marginLeft: 18, marginRight: 4
                  }}>
                    [{q.difficulty}]
                  </span>
                </div>
                <div>
                  <span style={{ marginRight: 10, fontSize: 15, color: "#77d" }}>
                    보상: 경험치 +{q.rewardXP}, 골드 +{q.rewardGold}
                  </span>
                  <button onClick={() => completeQuest(i)}
                    style={{ background: "#4d65f7", color: "#fff", border: "none", borderRadius: 7, padding: "4px 15px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                    완료
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "장비" && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          margin: "24px auto 0 auto",
          background: "#292929",
          borderRadius: 22,
          padding: "32px 0",
          maxWidth: 900,
          minHeight: 480
        }}>
          {/* 왼쪽 슬롯 */}
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", marginRight: 12, gap: 25
          }}>
            {LEFT_SLOTS.map(slot => (
              <div key={slot} style={{
                width: 72, height: 72, border: "2px solid #555", borderRadius: 12, background: "#222",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: equipment[slot] ? "pointer" : "default"
              }} onDoubleClick={() => unequip(slot)}>
                {equipment[slot]
                  ? <img src={equipment[slot].img} alt={slot} style={{ maxWidth: 56, maxHeight: 56 }} />
                  : <span style={{ color: "#888" }}>{slot}</span>}
              </div>
            ))}
          </div>
          {/* 실루엣 */}
          <div style={{
            width: 230, margin: "0 22px", display: "flex", justifyContent: "center", alignItems: "center"
          }}>
            <img src="/silhouette.png" alt="실루엣" style={{ width: 180, filter: "brightness(0.8)" }} />
          </div>
          {/* 오른쪽 슬롯 */}
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", marginLeft: 12, gap: 25
          }}>
            {RIGHT_SLOTS.map(slot => (
              <div key={slot} style={{
                width: 72, height: 72, border: "2px solid #555", borderRadius: 12, background: "#222",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: equipment[slot] ? "pointer" : "default"
              }} onDoubleClick={() => unequip(slot)}>
                {equipment[slot]
                  ? <img src={equipment[slot].img} alt={slot} style={{ maxWidth: 56, maxHeight: 56 }} />
                  : <span style={{ color: "#888" }}>{slot}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "장비" && (
        <div style={{ maxWidth: 900, margin: "0 auto", marginTop: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 9 }}>인벤토리</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, minHeight: 80, background: "#232323", borderRadius: 12, padding: 14 }}>
            {inventory.length === 0
              ? <div style={{ color: "#aaa", fontSize: 16, padding: "20px 0" }}>인벤토리가 비었습니다.</div>
              : inventory.map((item, idx) => (
                <div key={idx} title={item.name}
                  onDoubleClick={() => handleInventoryDoubleClick(item)}
                  style={{
                    border: "2px solid #555", borderRadius: 10, width: 56, height: 56,
                    background: "#282828", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative"
                  }}>
                  <img src={item.img} alt={item.name} style={{ maxWidth: 40, maxHeight: 40 }} />
                  {item.rarity && (
                    <span style={{
                      position: "absolute", bottom: 3, right: 5, fontSize: 10, color: "#ffd23a", textShadow: "1px 1px 3px #000"
                    }}>{item.rarity}</span>
                  )}
                </div>
              ))
            }
          </div>
          <div style={{ color: "#999", fontSize: 14, marginTop: 10 }}>
            - 인벤토리 아이템 더블클릭: 장착/판매<br />
            - 장비 아이콘 더블클릭: 해제<br />
            - 퀘스트 완료 시 낮은 확률로 아이템 루팅, 중복 없음
          </div>
        </div>
      )}
      {tab === "상점" && (
        <div style={{
          background: "#232323", borderRadius: 18, maxWidth: 900, margin: "0 auto",
          marginTop: 18, padding: "34px 40px"
        }}>
          <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 10 }}>상점</div>
          <div style={{ fontSize: 16, marginBottom: 12 }}>쓸모없는 아이템만 판매할 수 있습니다.<br />
            <span style={{ color: "#aaa", fontSize: 14 }}>(인벤토리의 잡템을 더블클릭!)</span>
          </div>
          {uselessItems.length === 0
            ? <div style={{ color: "#888", fontSize: 15, margin: "20px 0 30px" }}>판매 가능한 쓸모없는 아이템이 없습니다.</div>
            : (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                {uselessItems.map((item, idx) => (
                  <div key={idx}
                    onDoubleClick={() => handleInventoryDoubleClick(item)}
                    style={{
                      border: "2px solid #a44", borderRadius: 10, width: 52, height: 52,
                      background: "#282828", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative"
                    }}>
                    <img src={item.img} alt={item.name} style={{ maxWidth: 34, maxHeight: 34 }} />
                  </div>
                ))}
              </div>
            )}
          {shopMessage && <div style={{ color: "#77c", marginBottom: 10 }}>{shopMessage}</div>}
          {/* --- 보상 탭 --- */}
          <div style={{ fontWeight: 600, fontSize: 18, marginTop: 30, marginBottom: 8 }}>보상 (골드로 구매)</div>
          <div style={{ display: "flex", gap: 18, marginBottom: 14 }}>
            {SHOP_REWARDS.map((reward, idx) => (
              <div key={idx} style={{
                background: "#393950", borderRadius: 14, padding: "10px 18px", textAlign: "center", minWidth: 98
              }}>
                <img src={reward.img} alt={reward.name} style={{ maxWidth: 32, marginBottom: 6 }} />
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{reward.name}</div>
                <div style={{ color: "#ffd23a", fontSize: 14, marginBottom: 6 }}>💰 {reward.price} G</div>
                <button
                  onClick={() => buyReward(reward)}
                  style={{ fontSize: 14, borderRadius: 8, padding: "2px 14px", border: "none", background: "#4d65f7", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                  구매
                </button>
              </div>
            ))}
          </div>
          {rewardMessage && <div style={{ color: "#98d957", marginTop: 8 }}>{rewardMessage}</div>}
        </div>
      )}
    </div>
  );
}
