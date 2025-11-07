import React, { useState, useEffect } from 'react';
import './index.css';
import { calculateReward } from './utils/questLogic';
import { equipmentData } from './utils/itemData';

const initialEquipment = { helmet: null, armor: null, weapon: null };
const initialStats = { strength: 10, intelligence: 10, luck: 10 };

function LifeRPG() {
  const [xp, setXp] = useState(0);
  const [gold, setGold] = useState(0);
  const [stats, setStats] = useState(initialStats);
  const [inventory, setInventory] = useState(equipmentData);
  const [equipped, setEquipped] = useState(initialEquipment);
  const [quest, setQuest] = useState('');
  const [difficulty, setDifficulty] = useState('보통');
  const [lastQuestDate, setLastQuestDate] = useState(null);
  const [reward, setReward] = useState({ xp: 0, gold: 0 });

  const equipmentPositions = {
    helmet: { top: '10px', left: '105px' },
    armor: { top: '100px', left: '90px' },
    weapon: { top: '180px', left: '200px' },
  };

  const handleEquip = (item) => {
    setEquipped((prev) => ({ ...prev, [item.type]: item }));
  };

  const handleQuestSubmit = () => {
    const today = new Date().toLocaleDateString();
    if (lastQuestDate === today) {
      alert('하루에 한 번만 보상을 받을 수 있습니다!');
      return;
    }

    const rewardData = calculateReward(difficulty);
    setXp((prev) => prev + rewardData.xp);
    setGold((prev) => prev + rewardData.gold);
    setReward(rewardData);
    setLastQuestDate(today);
  };

  return (
    <div className="game-container">
      <div className="character-panel">
        <h1 className="game-title">Life R.P.G</h1>
        <p>경험치: {xp}</p>
        <p>골드: {gold}</p>
        <p>힘: {stats.strength} / 지능: {stats.intelligence} / 운: {stats.luck}</p>

        <div className="silhouette-wrapper">
          <img src="/silhouette.png" alt="silhouette" className="silhouette" />
          {Object.keys(equipped).map((slot) =>
            equipped[slot] ? (
              <img
                key={slot}
                src={equipped[slot].src}
                alt={slot}
                className="equipment-icon"
                style={equipmentPositions[slot]}
              />
            ) : null
          )}
        </div>
      </div>

      <div className="quest-inventory-panel">
        <section className="quest-section">
          <h2>퀘스트</h2>
          <input
            type="text"
            value={quest}
            onChange={(e) => setQuest(e.target.value)}
            placeholder="퀘스트 내용을 입력하세요"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="쉬움">쉬움</option>
            <option value="보통">보통</option>
            <option value="어려움">어려움</option>
            <option value="매우 어려움">매우 어려움</option>
          </select>
          <button onClick={handleQuestSubmit}>보상 받기</button>
          <p>
            💰 보상: 경험치 +{reward.xp}, 골드 +{reward.gold}
          </p>
        </section>

        <section className="inventory-section">
          <h2>인벤토리</h2>
          <div className="inventory-grid">
            {inventory.map((item, index) => (
              <img
                key={index}
                src={item.src}
                alt={item.name}
                title={`${item.name} (${item.rarity})`}
                className="inventory-item"
                onDoubleClick={() => handleEquip(item)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default LifeRPG;
