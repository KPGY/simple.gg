import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY;

// GET 요청 처리
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const summonerName = searchParams.get('summonerName');
  const tag = searchParams.get('tag');
  const puuid = searchParams.get('puuid');
  const userId = searchParams.get('userId');
  const matchId = searchParams.get('matchId');

  try {
    switch (action) {
      case 'getUserId':
        const userIdResponse = await axios.get(
          `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag}?api_key=${API_KEY}`
        );
        return new Response(JSON.stringify(userIdResponse.data), {
          status: 200,
        });

      case 'getUserData':
        const userDataResponse = await axios.get(
          `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`
        );
        return new Response(JSON.stringify(userDataResponse.data), {
          status: 200,
        });

      case 'getMatchId':
        const matchIdResponse = await axios.get(
          `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=100&api_key=${API_KEY}`
        );
        return new Response(JSON.stringify(matchIdResponse.data), {
          status: 200,
        });

      case 'getMatchHistory':
        const matchHistoryResponse = await axios.get(
          `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`
        );
        return new Response(JSON.stringify(matchHistoryResponse.data.info), {
          status: 200,
        });

      case 'getRankInfo':
        const rankInfoResponse = await axios.get(
          `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${userId}?api_key=${API_KEY}`
        );
        return new Response(JSON.stringify(rankInfoResponse.data[0]), {
          status: 200,
        });

      case 'getSpellId':
        const spellIdResponse = await axios.get(
          'https://ddragon.leagueoflegends.com/cdn/14.20.1/data/ko_KR/summoner.json'
        );
        return new Response(JSON.stringify(spellIdResponse.data.data), {
          status: 200,
        });

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
        });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(
      JSON.stringify({ error: 'Error fetching data', details: error.message }),
      { status: 500 }
    );
  }
}
