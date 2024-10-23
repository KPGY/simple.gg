'use client';
import Image from 'next/image';
import useStore from '@/store/useStore';
import { getMatchHistory, getSpellId } from '../api/getUser/apiCall';
import { useEffect, useState } from 'react';
import findSummonerByKey from '../components/getSpell';
import { translate } from '../components/translateMode';

export default function Match() {
  const summonerInfo = useStore((state) => state.summonerInfo);
  const summonerSubInfo = useStore((state) => state.summonerSubInfo);
  const rankInfo = useStore((state) => state.rankInfo);
  const matchInfo = useStore((state) => state.matchInfo);

  const [currentBatchIndex, setCurrentBatchIndex] = useState(1);
  const [results, setResults] = useState([]);
  const [myIndices, setMyIndices] = useState([]);
  const [spellData, setSpellData] = useState();
  const batchSize = 10; // 한 번에 호출할 매치 수

  // 매치 기록을 가져오는 useEffect
  useEffect(() => {
    const fetchSpellData = async () => {
      const spellId = await getSpellId(); // getSpellId()가 Promise를 반환하는지 확인
      setSpellData(spellId); // spellData 상태 업데이트
    };

    fetchSpellData();

    const fetchMatchHistories = async () => {
      if (
        matchInfo &&
        matchInfo.length > 0 &&
        summonerInfo?.gameName &&
        currentBatchIndex > 0
      ) {
        try {
          // 이미 로드된 매치 ID를 확인
          const loadedMatchIds = new Set(results.map((res) => res.matchId));

          // 아직 로드되지 않은 매치들만 가져오기
          const batch = matchInfo
            .slice(
              (currentBatchIndex - 1) * batchSize,
              currentBatchIndex * batchSize
            )
            .filter((matchId) => !loadedMatchIds.has(matchId)); // Set 사용

          if (batch.length === 0) return; // 새로운 데이터가 없으면 더 이상 호출 안함

          const matchPromises = batch.map((matchId) =>
            getMatchHistory(matchId)
          );

          const fetchedResults = await Promise.all(matchPromises);
          const participantsResults = fetchedResults.map((match, index) => ({
            matchId: batch[index], // 매치 ID 추가
            participants: match.participants,
            gameDuration: match.gameDuration,
            gameStartTimestamp: match.gameStartTimestamp,
            queue: match.queueId,
          }));

          // 중복된 매치 ID가 포함되지 않도록 필터링
          const newResults = participantsResults.filter(
            (result) => !loadedMatchIds.has(result.matchId) // Set 사용
          );

          setResults((prevResults) => [...prevResults, ...newResults]);

          const indices = newResults.map(({ participants }) =>
            participants.findIndex(
              (participant) =>
                participant.riotIdGameName === summonerInfo?.gameName
            )
          );
          setMyIndices((prevIndices) => [...prevIndices, ...indices]);
        } catch (error) {
          console.error('Error fetching match histories:', error);
        }
      }
    };

    fetchMatchHistories();
  }, [currentBatchIndex]);

  // 더보기 버튼 클릭 시 다음 매치 배치를 불러오는 함수
  const handleLoadMore = () => {
    setCurrentBatchIndex((prevIndex) => prevIndex + 1);
  };

  const winRate = rankInfo
    ? Math.ceil((rankInfo.wins / (rankInfo.wins + rankInfo.losses)) * 100)
    : 'N/A';
  const rankIcon = rankInfo
    ? `/ranked-emblems-latest/${rankInfo?.tier}.png`
    : `/ranked-emblems-latest/UNRANK.png`;

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}분 ${seconds}초`;
  };

  // 타임스탬프를 날짜로 변환하는 함수
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className='flex flex-col items-center justify-center mt-14 min-h-screen gap-2'>
      <div className='flex flex-row items-center bg-slate-500 p-6 rounded-lg shadow-md sm:w-2/3 xl:w-1/3 lg:w-1/2 sm:gap-12 gap-7 w-5/6'>
        <Image
          className='object-cover mb-4'
          src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/${summonerSubInfo?.profileIconId}.png`}
          width={150}
          height={150}
          alt='소환사 이미지'
        />
        <div className='flex flex-col gap-14'>
          <span className='font-bold text-xl text-center'>
            {summonerInfo?.gameName} #{summonerInfo?.tagLine}
          </span>
          <span className='font-bold text-xl text-center'>
            {summonerSubInfo?.summonerLevel}
          </span>
        </div>
      </div>

      <div className='flex flex-row items-center bg-slate-500 p-6 rounded-lg shadow-md sm:w-2/3 xl:w-1/3 lg:w-1/2 sm:gap-12 gap-7 w-5/6'>
        <Image
          className='object-cover mb-4'
          src={rankIcon}
          width={150}
          height={150}
          alt='Unranked'
        />
        <div className='flex flex-col gap-3'>
          <span className='font-thin text-xl text-center'>
            개인/ 2인 랭크 게임
          </span>
          <span className='font-bold text-xl text-center'>
            {rankInfo?.tier} {rankInfo?.rank}
          </span>
          <span className='font-semibold text-xl text-center'>
            {rankInfo?.leaguePoints} LP
          </span>
          <span className='font-thin text-xl text-center'>
            {rankInfo?.wins}승 {rankInfo?.losses}패 {winRate}%
          </span>
        </div>
      </div>

      {results.length > 0 ? (
        <div className='mt-7 sm:w-2/3 xl:w-1/3 lg:w-1/2 w-5/6'>
          {results.map((match, matchIndex) => {
            const myIndex = myIndices[matchIndex];
            const myParticipant = match.participants[myIndex];
            const mode = translate(match.queue);
            const winners = match.participants.filter(
              (participant) => participant.win
            );
            const losers = match.participants.filter(
              (participant) => !participant.win
            );
            const mySpellId1 = myParticipant.summoner1Id.toString();
            const mySpellId2 = myParticipant.summoner2Id.toString();

            const mySpell1 = findSummonerByKey(spellData, mySpellId1);
            const mySpell2 = findSummonerByKey(spellData, mySpellId2);

            return (
              <div
                key={matchIndex}
                className={`mb-4 p-4 rounded-lg ${
                  myParticipant.win ? 'bg-blue-300' : 'bg-red-300'
                }`}
              >
                <div className='font-bold text-lg mb-4 flex items-center'>
                  <Image
                    src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${myParticipant.championName}.png`}
                    width={75}
                    height={75}
                    alt='챔피언 이미지'
                    className='rounded-full w-16 h-16 xl:w-20 xl:h-20'
                  />
                  <div className='flex flex-col object-cover justify-center pl-2 gap-1'>
                    <Image
                      src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/spell/${mySpell1}.png`}
                      width={30}
                      height={30}
                      alt='스펠1'
                      className='w-12 h-8 xl:w-10 xl:h-10'
                    />
                    <Image
                      src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/spell/${mySpell2}.png`}
                      width={30}
                      height={30}
                      alt='스펠2'
                      className='w-12 h-8 xl:w-10 xl:h-10'
                    />
                  </div>
                  <div className='flex flex-col gap-3 pl-2'>
                    <div className='flex justify-between'>
                      {myParticipant.kills} / {myParticipant.deaths} /{' '}
                      {myParticipant.assists}
                      <div
                        className={`${
                          myParticipant.win ? 'text-blue-700' : 'text-red-700'
                        }`}
                      >
                        {mode}
                      </div>
                    </div>

                    <div className='flex gap-2 flex-wrap'>
                      {Array.from({ length: 7 }).map((_, index) => {
                        const itemValue = myParticipant[`item${index}`];
                        return itemValue ? (
                          <Image
                            key={index}
                            src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/item/${itemValue}.png`}
                            width={35}
                            height={35}
                            alt={`아이템${index + 1}`}
                            className='object-contain rounded-md'
                          />
                        ) : (
                          <div
                            key={index}
                            className={`w-[35px] h-[35px] rounded-md ${
                              myParticipant.win ? 'bg-blue-400' : 'bg-red-400'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className='flex justify-between'>
                  {/* 승리자 리스트 */}
                  <ul className='w-1/2'>
                    {winners.map((participant, index) => (
                      <li
                        key={index}
                        className={`font-bold ${
                          participant.riotIdGameName === summonerInfo?.gameName
                            ? 'text-blue-700'
                            : 'text-white'
                        }`}
                      >
                        {participant.riotIdGameName} - 승리
                      </li>
                    ))}
                  </ul>

                  {/* 패배자 리스트 */}
                  <ul className='w-1/2'>
                    {losers.map((participant, index) => (
                      <li
                        key={index}
                        className={`font-bold ${
                          participant.riotIdGameName === summonerInfo?.gameName
                            ? 'text-red-700'
                            : 'text-white'
                        }`}
                      >
                        {participant.riotIdGameName} - 패배
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='mt-4 flex justify-between font-bold'>
                  <p>{formatDuration(match.gameDuration)}</p>
                  <p>{formatTimestamp(match.gameStartTimestamp)}</p>
                </div>
              </div>
            );
          })}
          <div className='flex justify-center'>
            <button
              className='mt-2 mb-4 p-3 bg-blue-500 text-white rounded-lg shadow-md text-lg w-3/5'
              onClick={handleLoadMore}
            >
              더보기
            </button>
          </div>
        </div>
      ) : (
        <p>매치 데이터를 불러오는 중입니다...</p>
      )}
    </div>
  );
}
