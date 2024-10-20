// store.js
import { create } from 'zustand';

const useStore = create((set) => ({
  summonerInfo: null, // 소환사 정보 초기값
  rankInfo: null, // 랭크 정보 초기값
  summonerSubInfo: null, // 소환사 프로필/레벨 정보 초기값
  matchInfo: [],

  // 소환사 정보 설정
  setSummonerInfo: (info) => set({ summonerInfo: info }),

  setSummonerSubInfo: (info) => set({ summonerSubInfo: info }),

  // 랭크 정보 설정
  setRankInfo: (info) => set({ rankInfo: info }),

  setMatchInfo: (info) => set({ matchInfo: info }),
}));

export default useStore;
