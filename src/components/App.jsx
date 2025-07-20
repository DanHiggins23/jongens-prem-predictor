import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import axios from 'axios';

import mockStandings from '../utils/mockStandings';
import './App.scss';
import ScoreTable from './ScoreTable/ScoreTable';
import LeagueTable from './LeagueTable/LeagueTable';
import PredictionsTable from './PredictionsTable/PredictionsTable';
import UserSelection from './UserSelection/UserSelection';
import mapUserToProfile from '../utils/mapUserToProfile';

const client = generateClient();

const App = () => {
  const [standings, setStandings] = useState(mockStandings);
  const [totalGoals, setTotalGoals] = useState(null);
  const [sortedResults, setSortedResults] = useState([]);
  const [currentPrediction, setCurrentPrediction] = useState(
    [...mockStandings].sort((a, b) => a.team.name.localeCompare(b.team.name)),
  );
  const [predictions, setPredictions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // TODO: Replace with environment var when eslint configured
  const hasSeasonStarted = new Date() >= new Date('2025-08-15');

  console.log(predictions);

  // Add back in once removed mocks
  // const getStandings = async () => {
  //   const response = await axios.get(
  //     "https://premier-league-standings1.p.rapidapi.com/?season=2024",
  //     {
  //       headers: {
  //         "X-RapidAPI-Key":
  //           "5d4abb2db7msh48ef7358e10d30fp15bcb3jsn00bc1450501f",
  //         "X-RapidAPI-Host": "premier-league-standings1.p.rapidapi.com",
  //       },
  //     }
  //   );
  //   return response.data;
  // };

  // const requestStandings = () => {
  //   getStandings()
  //     .then((response) => {
  //       setStandings(response);
  //       setCurrentPrediction(
  //         response.sort((a, b) => a.team.name.localeCompare(b.team.name))
  //       );
  //     })
  //     .catch((error) => console.log(error));
  // };

  const calculateScores = () => {
    const scores = [];
    const usersWithPredictions = predictions.filter((user) => user.prediction);

    usersWithPredictions.forEach((user) => {
      let score = 0;

      console.log(user.prediction);

      JSON.parse(user.prediction).forEach((prediction, predictionIndex) => {
        const predictedPos = predictionIndex + 1;

        const actualPos = standings.find(
          (standing) => standing.team.name === prediction,
        ).stats.rank;

        score += Math.abs(actualPos - predictedPos);
      });

      scores.push({
        name: user.user,
        score,
        profile: mapUserToProfile[user.user],
        goals: user.expectedGoals,
      });
    });

    return scores;
  };

  const calculateTotalGoals = () => {
    let totalGoals = 0;

    standings.forEach((team) => {
      totalGoals += team.stats.goalsFor;
    });

    return totalGoals;
  };

  const createPrediction = async ({ expectedGoals }) => {
    console.log(expectedGoals);
    const { data, errors } = await client.models.Predictions.update({
      id: predictions.find((user) => user.user === selectedUser)?.id,
      prediction: JSON.stringify(
        currentPrediction.map((prediction) => prediction.team.name),
      ),
      expectedGoals,
    });

    console.log(data, errors);
  };

  useEffect(() => {
    client.models.Predictions.observeQuery().subscribe({
      next: (data) => setPredictions([...data.items]),
    });
  }, []);

  useEffect(() => {
    if (standings.length > 0) {
      setSortedResults(
        calculateScores().sort((a, b) => {
          if (a.score === b.score) {
            return (
              Math.abs(totalGoals - a.goals) - Math.abs(totalGoals - b.goals)
            );
          }
          return a.score - b.score;
        }),
      );

      setTotalGoals(calculateTotalGoals());
    }
  }, [standings, predictions]);

  return (
    <div className='App'>
      <h1>Prem Predictor</h1>

      {predictions.some((user) => !user.prediction) && (
        <UserSelection
          users={predictions}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      )}

      {/* Replace to check if season started or all users have submitted */}
      {predictions.some((user) => user.prediction) && (
        <>
          {/* <Button
            variant='contained'
            onClick={() => requestStandings()}
            sx={{ backgroundColor: '#F2055C', marginBottom: '20px' }}
          >
            {standings.length > 0 ? 'Update score' : 'Calculate score'}
          </Button> */}

          <ScoreTable results={sortedResults} />

          <LeagueTable leagueTable={standings} />
        </>
      )}

      {!hasSeasonStarted && selectedUser && (
        <PredictionsTable
          currentPrediction={currentPrediction}
          setCurrentPrediction={setCurrentPrediction}
          createPrediction={(expectedGoals) => {
            createPrediction({ expectedGoals });
          }}
        />
      )}
    </div>
  );
};

export default App;
