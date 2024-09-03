import axios from "axios";
import "./App.scss";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import defaultProfile from "../../src/images/default-pp.jpg";
import users from "../utils/users";

function App() {
  const [standings, setStandings] = useState([]);
  const [totalGoals, setTotalGoals] = useState(null);
  const [sortedResults, setSortedResults] = useState([]);
  const [predictionsToShow, setPredictionsToShow] = useState([]);

  const getStandings = async () => {
    const response = await axios.get(
      "https://premier-league-standings1.p.rapidapi.com/?season=2024",
      {
        headers: {
          "X-RapidAPI-Key":
            "5d4abb2db7msh48ef7358e10d30fp15bcb3jsn00bc1450501f",
          "X-RapidAPI-Host": "premier-league-standings1.p.rapidapi.com",
        },
      }
    );
    return response.data;
  };

  const requestStandings = () => {
    getStandings()
      .then((response) => {
        setStandings(response);
      })
      .catch((error) => console.log(error));
  };

  const calculateScores = () => {
    const scores = [];

    users.forEach((user) => {
      let score = 0;

      user.predictions.forEach((prediction, predictionIndex) => {
        const predictedPos = predictionIndex + 1;

        const actualPos = standings.find(
          (standing) => standing.team.name === prediction
        ).stats.rank;

        score = score + Math.abs(actualPos - predictedPos);
      });

      scores.push({
        name: user.name,
        score: score,
        profile: user.profile,
        goals: user.goals,
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
        })
      );

      setTotalGoals(calculateTotalGoals());
    }
  }, [standings]);

  return (
    <div className="App">
      <>
        <h1>Jongens Op Tournee: Prem Predictor</h1>

        <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
          <div>
            <Avatar
              alt={sortedResults[0]?.name}
              src={
                sortedResults.length > 0
                  ? sortedResults[0]?.profile
                  : defaultProfile
              }
              sx={{ width: 120, height: 120 }}
            />
            <p>🍺🍺🍺🍺🍺</p>
          </div>
          <div>
            <Avatar
              alt={sortedResults[sortedResults.length]?.name}
              src={
                sortedResults.length > 0
                  ? sortedResults[sortedResults.length - 1]?.profile
                  : defaultProfile
              }
              sx={{ width: 120, height: 120 }}
            />
            <p>😢💷</p>
          </div>
        </div>
      </>

      <Button
        variant="contained"
        onClick={() => requestStandings()}
        sx={{ backgroundColor: "#F2055C", marginBottom: "20px" }}
      >
        {standings.length > 0 ? "Update score" : "Calculate score"}
      </Button>

      {sortedResults.length > 0 && (
        <>
          <h2>Scores on the doors</h2>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    sx={{ color: "#340040", fontWeight: "bold" }}
                  >
                    Pos
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#340040", fontWeight: "bold" }}
                  >
                    Jongen
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#340040", fontWeight: "bold" }}
                  >
                    Points
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#340040", fontWeight: "bold" }}
                  >
                    xG
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#340040", fontWeight: "bold" }}
                  >
                    Predictions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedResults.map((result, index) => (
                  <>
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ color: "#340040", fontWeight: "bold" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell align="left" sx={{ color: "#340040" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        <img
                          src={result.profile}
                          width="30px"
                          height="30px"
                          alt="Jongen"
                          style={{ borderRadius: "50px" }}
                        />
                        {result.name}
                      </div>
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#340040" }}>
                      {result.score}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#340040" }}>
                      {result.goals.toLocaleString()}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#340040" }}>
                      <Button onClick={() => predictionsToShow.find((prediction) => prediction.name === result.name) ? setPredictionsToShow(predictionsToShow.filter((prediction) => prediction.name !== result.name)) : setPredictionsToShow([...predictionsToShow, users.find((user) => user.name === result.name)])}>{predictionsToShow.find((prediction) => prediction.name === result.name) ? 'Hide' : 'View'}</Button>
                    </TableCell>
                  </TableRow>

                  {predictionsToShow.length > 0 && predictionsToShow.find((prediction) => prediction.name === result.name) && predictionsToShow.find((prediction) => prediction.name === result.name).predictions.map((prediction, index) => (
                    <TableRow>
                      <TableCell align="center" sx={{ color: "#340040", fontWeight: 'bold' }} colSpan={5}>
                        {`${index + 1}: ${prediction}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {standings.length > 0 && (
        <>
          <h2>League table</h2>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ color: "#340040", fontWeight: "bold" }}
                  >
                    Pos
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#340040", fontWeight: "bold" }}
                  >
                    Club
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#340040", fontWeight: "bold" }}
                  >
                    Pld
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#340040", fontWeight: "bold" }}
                  >
                    GD
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#340040", fontWeight: "bold" }}
                  >
                    Pts
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {standings.map((team) => (
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{ color: "#340040", fontWeight: "bold" }}
                    >
                      {team.stats.rank}
                    </TableCell>
                    <TableCell align="left" sx={{ color: "#340040" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        <img
                          src={team.team.logo}
                          width="30px"
                          alt="Prem team logo"
                        />
                        {team.team.name}
                      </div>
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#340040" }}>
                      {team.stats.gamesPlayed}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#340040" }}>
                      {team.stats.goalDifference}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#340040" }}>
                      {team.stats.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}

export default App;
