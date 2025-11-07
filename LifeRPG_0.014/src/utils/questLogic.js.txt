export const calculateReward = (difficulty) => {
  switch (difficulty) {
    case '쉬움':
      return { xp: 10, gold: 5 };
    case '보통':
      return { xp: 20, gold: 10 };
    case '어려움':
      return { xp: 40, gold: 25 };
    case '매우 어려움':
      return { xp: 70, gold: 50 };
    default:
      return { xp: 0, gold: 0 };
  }
};
