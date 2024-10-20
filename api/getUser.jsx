import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY; // .env 파일에 API 키 저장

// 사용자 UUID를 가져오는 API 함수
export const getUserid = async (summonerName, tag) => {
  const response = await axios.get(
    `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag}?api_key=${API_KEY}`
  );
  return response.data; // UUID 반환
};

// 사용자 데이터를 가져오는 API 함수
export const getUserData = async (puuid) => {
  const response = await axios.get(
    `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`
  );
  return response.data; // 사용자 데이터 반환
};

export const getMatchId = async (puuid) => {
  const response = await axios.get(
    `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=100&api_key=${API_KEY}`
  );
  return response.data; // 최근 20게임의 매칭아이디 반환
};

export const getMatchHistory = async (matchId) => {
  const response = await axios.get(
    `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}?&api_key=${API_KEY}`
  );
  return response.data.info; //매칭 게임에 참가자정보
};

export const getRankInfo = async (userId) => {
  const response = await axios.get(
    `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${userId}?api_key=${API_KEY}`
  );
  return response.data[0];
};

export const getSpellId = async () => {
  const response = await axios.get(
    'https://ddragon.leagueoflegends.com/cdn/14.20.1/data/ko_KR/summoner.json'
  );
  return response.data.data;
};
