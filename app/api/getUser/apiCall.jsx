import axios from 'axios';

// API 기본 URL
const API_BASE_URL = '/api/getUser';

// 사용자 ID를 가져오는 함수
export const getUserId = async (nickname, tag) => {
  const response = await axios.get(
    `${API_BASE_URL}?action=getUserId&summonerName=${nickname}&tag=${tag}`
  );
  return response.data;
};

// 사용자 데이터를 가져오는 함수
export const getUserData = async (puuid) => {
  const response = await axios.get(
    `${API_BASE_URL}?action=getUserData&puuid=${puuid}`
  );
  return response.data;
};

// 매치 ID를 가져오는 함수
export const getMatchId = async (puuid) => {
  const response = await axios.get(
    `${API_BASE_URL}?action=getMatchId&puuid=${puuid}`
  );
  return response.data;
};

// 랭크 정보를 가져오는 함수
export const getRankInfo = async (userId) => {
  const response = await axios.get(
    `${API_BASE_URL}?action=getRankInfo&userId=${userId}`
  );
  return response.data;
};

// 매치 히스토리를 가져오는 함수
export const getMatchHistory = async (matchId) => {
  const response = await axios.get(
    `${API_BASE_URL}?action=getMatchHistory&matchId=${matchId}`
  );
  return response.data;
};

// 스펠 ID를 가져오는 함수
export const getSpellId = async () => {
  const response = await axios.get(`${API_BASE_URL}?action=getSpellId`);
  return response.data;
};
