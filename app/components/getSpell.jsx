const findSummonerByKey = (data, targetKey) => {
  for (const summoner in data) {
    if (data[summoner].key === targetKey) {
      return summoner; // 'SummonerBarrier' 등 스펠 이름 반환
    }
  }
  return null; // 찾지 못했을 때 null 반환
};

export default findSummonerByKey;
