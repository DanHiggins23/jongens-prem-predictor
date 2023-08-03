import axios from "axios";
import "./App.scss";
import { useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

function App() {
  const [standings, setStandings] = useState([]);

  const getStandings = async () => {
    const response = await axios.get(
      "https://premier-league-standings1.p.rapidapi.com/?season=2023",
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

  const predictions = [
    "Manchester City",
    "Arsenal",
    "Liverpool",
    "Newcastle United",
    "Chelsea",
    "Manchester United",
    "Aston Villa",
    "Tottenham Hotspur",
    "Brighton & Hove Albion",
    "West Ham United",
  ];

  const calculateScore = () => {
    let score = 0;
    standings.forEach((standing, index) => {
      if (standing.team.name === predictions[index]) {
        score = score + 5;
      }
      score = score - 1;
    });

    return score;
  };

  return (
    <div className="App">
      {standings.length >= 0 && (
        <>
          <h1>Jongens Op Tournee: Prem Predictor</h1>
          <h2>Scores on the doors</h2>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "25px" }}
          >
            <div>
              <Avatar
                alt="Dan Higgins"
                src="/me-pp.jpg"
                sx={{ width: 90, height: 90 }}
              />
              <p>{`${
                standings.length > 0
                  ? "Score: " + calculateScore()
                  : "Loading..."
              }`}</p>
            </div>
            <div>
              <Avatar
                alt="Jonny Constantine"
                src="/jonny-pp.jpg"
                sx={{ width: 90, height: 90 }}
              />
              <p>{`${
                standings.length > 0
                  ? "Score: " + calculateScore()
                  : "Loading..."
              }`}</p>
            </div>
            <div>
              <Avatar
                alt="George Shannon"
                src="/shandog-pp.jpg"
                sx={{ width: 90, height: 90 }}
              />
              <p>{`${
                standings.length > 0
                  ? "Score: " + calculateScore()
                  : "Loading..."
              }`}</p>
            </div>
          </div>
        </>
      )}

      <Button
        variant="contained"
        onClick={() => requestStandings()}
        sx={{ backgroundColor: "#F2055C", marginBottom: "20px" }}
      >
        {standings.length > 0 ? "Update score" : "Calculate score"}
      </Button>

      {standings.length > 0 && (
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
      )}
    </div>
  );
}

export default App;
