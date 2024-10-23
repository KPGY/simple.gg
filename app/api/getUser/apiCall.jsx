import axios from 'axios';
const API_BASE_URL = '/api/getUser';

const fetchData = async (params) => {
  try {
    const response = await axios.get(API_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
};

export const getUserId = (nickname, tag) =>
  fetchData({ action: 'getUserId', summonerName: nickname, tag });
export const getUserData = (puuid) =>
  fetchData({ action: 'getUserData', puuid });
export const getMatchId = (puuid) => fetchData({ action: 'getMatchId', puuid });
export const getRankInfo = (userId) =>
  fetchData({ action: 'getRankInfo', userId });
export const getMatchHistory = (matchId) =>
  fetchData({ action: 'getMatchHistory', matchId });
export const getSpellId = () => fetchData({ action: 'getSpellId' });
