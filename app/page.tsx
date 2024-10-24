'use client';
import { useState, useEffect } from 'react';
import {
  getUserId,
  getUserData,
  getRankInfo,
  getMatchId,
} from './api/getUser/apiCall';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import LoadingSpinner from './components/loading';

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [tag, setTag] = useState('');
  const [warning, setWarning] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const router = useRouter();

  const setSummonerInfo = useStore((state) => state.setSummonerInfo); // Zustand에서 setSummonerInfo 가져오기
  const setSummonerSubInfo = useStore((state) => state.setSummonerSubInfo);
  const setRankInfo = useStore((state) => state.setRankInfo);
  const setMatchId = useStore((state) => state.setMatchInfo);

  // 상태 초기화를 보장하기 위해 useEffect 사용
  useEffect(() => {
    if (!nickname && !tag) {
      // 닉네임과 태그가 없으면 상태 초기화
      setSummonerInfo(null);
      setSummonerSubInfo(null);
      setRankInfo(null);
      setMatchId(null);
    }
  }, [nickname, tag]);

  const handleSearch = async (e: any) => {
    e.preventDefault();

    if (nickname && tag) {
      setIsLoading(true); // 검색 시작할 때 로딩 상태로 설정
      try {
        const Info = await getUserId(nickname, tag);
        const summonerInfo = await getUserData(Info.puuid);
        const rankInfo = await getRankInfo(summonerInfo.id);
        const matchId = await getMatchId(Info.puuid);

        // Zustand에 소환사 정보 저장
        setSummonerInfo(Info);
        setSummonerSubInfo(summonerInfo);
        setRankInfo(rankInfo);
        setMatchId(matchId);

        setIsLoading(false); // 로딩 끝
        router.push('/match'); // 매치 페이지로 이동
      } catch (error) {
        setIsLoading(false); // 에러 발생 시 로딩 끝
        setWarning('존재하지 않는 사용자입니다.');
        console.log(error);
      }
    } else {
      setWarning('닉네임과 태그를 입력해주세요.');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      {isLoading ? ( // 로딩 중일 때는 로딩 스피너 표시
        <LoadingSpinner />
      ) : (
        <>
          <input
            className='border border-gray-300 rounded-md p-2 mb-4 w-4/5 md:w-1/3 lg:w-1/4'
            type='text'
            placeholder='닉네임'
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <input
            className='border border-gray-300 rounded-md p-2 mb-4 w-4/5 md:w-1/3 lg:w-1/4'
            type='text'
            placeholder='태그 (기본값: kr1)'
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          {warning && (
            <div className='mb-4 text-red-500 animate-bounce'>{warning}</div>
          )}
          <button
            className='bg-red-500 text-white p-2 rounded-md'
            onClick={handleSearch}
          >
            검색하기
          </button>
        </>
      )}
    </div>
  );
}
