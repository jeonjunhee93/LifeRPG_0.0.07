import React, { useState } from "react";

// 장비 부위
const EQUIP_SLOTS = ["무기", "투구", "갑옷", "장갑", "방패", "신발"];
// 양옆 배치용
const LEFT_SLOTS = ["무기", "투구", "갑옷"];
const RIGHT_SLOTS = ["장갑", "방패", "신발"];

// 장비/소모품/쓸모없는아이템 목록
const ALL_ITEMS = [
  // 장비: 부위/등급
  { name: "무딘 칼", slot: "무기", rarity: "일반", img: "/public/무딘칼_일반.png", value: 50 },
  { name: "파멸의 검", slot: "무기", rarity: "에픽", img: "/public/파멸의검_에픽.png", value: 500 },
  { name: "루비소드", slot: "무기", rarity: "희귀", img: "/public/루비소드_희귀.png", value: 120 },
  { name: "아스가르드의 빛", slot: "무기", rarity: "전설", img: "/public/아스가르드의빛_전설.png", value: 2000 },

  { name: "녹슨 철 투구", slot: "투구", rarity: "일반", img: "/public/녹슨 철 투구.png", value: 40 },
  { name: "용기의 투구", slot: "투구", rarity: "희귀", img: "/public/용기의 투구.png", value: 110 },
  { name: "검은 달의 투구", slot: "투구", rarity: "에픽", img: "/public/검은 달의 투구.png", value: 450 },
  { name: "신왕의 면류관", slot: "투구", rarity: "전설", img: "/public/신왕의 면류관.png", value: 1400 },

  { name: "낡은 철 갑옷", slot: "갑옷", rarity: "일반", img: "/public/낡은 철 갑옷.png", value: 80 },
  { name: "기사단 정예 갑주", slot: "갑옷", rarity: "희귀", img: "/public/기사단 정예 갑주.png", value: 180 },
  { name: "피의 결의 갑옷", slot: "갑옷", rarity: "에픽", img: "/public/피의 결의 갑옷.png", value: 390 },
  { name: "황제의 황금 갑옷", slot: "갑옷", rarity: "전설", img: "/public/황제의 황금 갑옷.png", value: 1800 },

  { name: "험난한 가죽 장갑", slot: "장갑", rarity: "일반", img: "/public/험난한 가죽 장갑.png", value: 20 },
  { name: "철의 손아귀", slot: "장갑", rarity: "희귀", img: "/public/철의 손아귀.png", value: 100 },
  { name: "불사의 손길", slot: "장갑", rarity: "에픽", img: "/public/불사의 손길.png", value: 390 },
  { name: "왕의 건틀릿", slot: "장갑", rarity: "전설", img: "/public/왕의 건틀릿.png", value: 990 },

  { name: "초보자 방패", slot: "방패", rarity: "일반", img: "/public/초보자 방패.png", value: 40 },
  { name: "은빛 방패", slot: "방패", rarity: "희귀", img: "/public/은빛 방패.png", value: 80 },
  { name: "성기사의 방패", slot: "방패", rarity: "에픽", img: "/public/성기사의 방패.png", value: 380 },
  { name: "용살의 방패", slot: "방패", rarity: "전설", img: "/public/용살의 방패.png", value: 1200 },

  { name: "해진 가죽 신발", slot: "신발", rarity: "일반", img: "/public/해진 가죽 신발.png", value: 30 },
  { name: "기사단 군화", slot: "신발", rarity: "희귀", img: "/public/기사단 군화.png", value: 110 },
  { name: "피의 각인 신발", slot: "신발", rarity: "에픽", img: "/public/피의 각인 신발.png", value: 320 },
  { name: "신왕의 부츠", slot: "신발", rarity: "전설", img: "/public/신왕의 부츠.png", value: 770 },

  // 쓸모없는 아이템 (상점에서만 판매)
  { name: "의문의 빨간 포션", slot: null, rarity: "잡템", img: "/public/의문의포션.png", value: 10, useless: true },
  { name: "이상한 돌멩이", slot: null, rarity: "잡템", img: "/public/이상한돌멩이.png", value: 7, useless: true },
  { name: "쓸모없는 고철", slot: null, rarity: "잡템", img: "/public/고철.png", value: 13, useless: true },
];

// 기본 퀘스트 3개
const BASE_QUESTS = [
  { text: "집 청소하기", difficulty: "보통", rewardXP: 20, rewardGold: 30 },
  { text: "미뤄둔 업무 처리", difficulty: "어려움", rewardXP: 40, rewardGold: 50 },
  { text: "세탁물 정리", difficulty: "쉬움", rewardXP: 10, rewardGold: 10 },
];

const randomGold = (item) => Math.floor(item.value * (0.8 + Math.random() * 0.4));

export default function LifeRPG() {
  // UI 상태
  const [tab, setTab] = useState("퀘스트");
  // 유저 상태
  const [userId, setUserId] = useState("");
  const [login, setLogin] = useState(false);
  // 게임 상태
  const [exp, setExp] = useState(0);
  const [gold, setGold] = useState(0);
  const [equipment, setEquipment] = useState({});
  const [inventory, setInventory] = useState([]);
  // 퀘스트
  const [questText, setQuestText] = useState("");
  const [quests, setQuests] = useState(BASE_QUESTS);
  // 상점
  const [shopMessage, setShopMessage] = useState("");

  // 로그인
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

  // 아이템 장착
  const equip = (item) => {
    if (!item.slot) return;
    setEquipment(e => ({ ...e, [item.slot]: item }));
    setInventory(inv => inv.filter(i => i !== item));
  };
  // 해제
  const unequip = (slot) => {
    if (equipment[slot]) {
      setInventory(inv => [...inv, equipment[slot]]);
      setEquipment(e => ({ ...e, [slot]: undefined }));
    }
  };
  // 퀘스트 완료 시 아이템 루팅
  function getRandomDrop() {
    // 60% 확률로 아무것도 없음
    if (Math.random() < 0.6) return null;
    // 30%: 잡템, 60%: 일반~에픽장비(희귀~에픽 30%, 일반 70%), 10%: 전설
    const roll = Math.random();
    if (roll < 0.3) {
      // 잡템
      const useless = ALL_ITEMS.filter(x => x.useless);
      return useless[Math.floor(Math.random() * useless.length)];
    }
    if (roll < 0.9) {
      // 일반~에픽
      const pool = ALL_ITEMS.filter(
        x =>
          x.slot &&
          ["일반", "희귀", "에픽"].includes(x.rarity)
      );
      // 희귀,에픽은 확률 낮게
      let item;
      while (!item) {
        const i = pool[Math.floor(Math.random() * pool.length)];
        if (i.rarity === "에픽" && Math.random() > 0.3) continue;
        if (i.rarity === "희귀" && Math.random() > 0.7) continue;
        item = i;
      }
      return item;
    }
    // 전설급 10%
    const legendary = ALL_ITEMS.filter(x => x.rarity === "전설");
    return legendary[Math.floor(Math.random() * legendary.length)];
  }
  // 퀘스트 완료
  const completeQuest = (qidx) => {
    const q = quests[qidx];
    setExp(x => x + q.rewardXP);
    setGold(g => g + q.rewardGold);
    // 아이템 드랍
    let msg = `경험치 +${q.rewardXP} 골드 +${q.rewardGold}`;
    const drop = getRandomDrop();
    if (drop) {
      setInventory(inv => [...inv, drop]);
      msg += ` / 루팅: ${drop.name}`;
    }
    alert(msg);
    setQuests(qs => qs.filter((_, i) => i !== qidx));
  };

  // 인벤토리 더블클릭: 장착 or 해제 or 판매
  const handleInventoryDoubleClick = (item) => {
    if (item.slot) {
      // 장착
      equip(item);
    } else if (tab === "상점") {
      // 상점에서만 쓸모없는 아이템 판매
      setInventory(inv => inv.filter(i => i !== item));
      setGold(g => g + randomGold(item));
      setShopMessage(`"${item.name}"를 판매했습니다!`);
    }
  };

  // 상점: 쓸모없는 아이템만 판매가능
  const uselessItems = inventory.filter(x => x.useless);

  // 새 퀘스트 추가
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

      {/* 경험치/골드 표시 */}
      <div style={{ maxWidth: 900, margin: "0 auto", marginTop: 6, fontSize: 17, color: "#ffd23a", fontWeight: 600, marginBottom: 8 }}>
        경험치: {exp} | 골드: {gold}
      </div>

      {/* 퀘스트 탭 */}
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

      {/* 장비 탭 */}
      {tab === "장비" && (
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          background: "#292929", borderRadius: 22, maxWidth: 900, margin: "0 auto",
          marginTop: 18, padding: "32px 0 40px 0"
        }}>
          {/* 왼쪽: 무기, 투구, 갑옷 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-end" }}>
            {LEFT_SLOTS.map((slot) => (
              <div
                key={slot}
                style={{
                  width: 68, height: 68, marginLeft: 14,
                  background: "#232323", color: "#fff",
                  border: "2px solid #333", borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 600, cursor: "pointer"
                }}
                onDoubleClick={() => unequip(slot)}
                title={equipment[slot]?.name || slot}
              >
                {equipment[slot] ? (
                  <img src={equipment[slot].img} alt={slot} style={{ width: 38, height: 38 }} />
                ) : slot}
              </div>
            ))}
          </div>
          {/* 중앙 실루엣 */}
          <div style={{
            margin: "0 60px", display: "flex", flexDirection: "column", alignItems: "center"
          }}>
            <div style={{
              background: "#1c1c1c",
              width: 180, height: 240, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 22, boxShadow: "0 0 14px #0007"
            }}>
              <img src="/public/silhouette.png" style={{ width: 148, height: 210, opacity: 0.94 }} alt="실루엣" />
            </div>
          </div>
          {/* 오른쪽: 장갑, 방패, 신발 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
            {RIGHT_SLOTS.map((slot) => (
              <div
                key={slot}
                style={{
                  width: 68, height: 68, marginRight: 14,
                  background: "#232323", color: "#fff",
                  border: "2px solid #333", borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 600, cursor: "pointer"
                }}
                onDoubleClick={() => unequip(slot)}
                title={equipment[slot]?.name || slot}
              >
                {equipment[slot] ? (
                  <img src={equipment[slot].img} alt={slot} style={{ width: 38, height: 38 }} />
                ) : slot}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 인벤토리 */}
      <div style={{
        maxWidth: 900, margin: "0 auto", marginTop: 24,
        background: "#292929", borderRadius: 20, padding: "20px 34px 18px 34px"
      }}>
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 10 }}>인벤토리</div>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 16, minHeight: 80,
          alignItems: "flex-start"
        }}>
          {inventory.length === 0 && (
            <div style={{ color: "#aaa", fontSize: 16, margin: "14px 0" }}>아이템이 없습니다.</div>
          )}
          {inventory.map((item, i) => (
            <div key={i}
              style={{
                minWidth: 62, minHeight: 62, background: "#232323",
                borderRadius: 12, border: "2px solid #444", color: "#fff",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 600, cursor: item.useless && tab === "상점" ? "pointer" : (item.slot ? "pointer" : "default"),
                padding: 7
              }}
              title={item.name + (item.slot ? " (" + item.rarity + ")" : "")}
              onDoubleClick={() => handleInventoryDoubleClick(item)}
            >
              <img src={item.img} alt={item.name} style={{ width: 32, height: 32, marginBottom: 3 }} />
              <div>
                {item.name}
                {item.slot && <span style={{ fontSize: 13, color: "#aaa", marginLeft: 2 }}> ({item.rarity})</span>}
                {item.useless && <span style={{ fontSize: 12, color: "#ff8888", marginLeft: 2 }}> (잡템)</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 18, color: "#888", fontSize: 13, lineHeight: 1.6
        }}>
          - 인벤토리 아이템 더블클릭: 장착/판매<br />
          - 장비 아이콘 더블클릭: 해제<br />
          - 퀘스트 완료 시 낮은 확률로 아이템 루팅, 중복 없음
        </div>
      </div>

      {/* 상점 탭 */}
      {tab === "상점" && (
        <div style={{
          maxWidth: 900, margin: "0 auto", marginTop: 22,
          background: "#292929", borderRadius: 20, padding: "30px 38px"
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>상점 - 쓸모없는 아이템만 판매가능</div>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
            {uselessItems.length === 0 ? (
              <span style={{ color: "#aaa" }}>판매 가능한 아이템이 없습니다.</span>
            ) : (
              uselessItems.map((item, idx) => (
                <div key={idx}
                  style={{
                    background: "#333", borderRadius: 11, padding: "8px 16px", marginBottom: 7,
                    color: "#fff", fontWeight: 600, display: "flex", alignItems: "center", cursor: "pointer", border: "2px solid #666"
                  }}
                  onDoubleClick={() => handleInventoryDoubleClick(item)}
                  title="더블클릭시 판매"
                >
                  <img src={item.img} alt={item.name} style={{ width: 28, height: 28, marginRight: 8 }} />
                  {item.name} <span style={{ fontSize: 14, color: "#ffd23a", marginLeft: 8 }}>{randomGold(item)}G</span>
                </div>
              ))
            )}
          </div>
          {shopMessage && <div style={{ marginTop: 16, color: "#57ffa1" }}>{shopMessage}</div>}
          <div style={{ color: "#aaa", marginTop: 18, fontSize: 14 }}>
            * 쓸모없는 아이템은 <b>상점탭에서만</b> 판매할 수 있습니다.<br />
            * 장비/소모품은 판매 불가 (추후 업데이트 가능)
          </div>
        </div>
      )}
    </div>
  );
}
