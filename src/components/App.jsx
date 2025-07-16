import axios from "axios";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import IconButton from "@mui/material/IconButton";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";

import defaultProfile from "../../src/images/default-pp.jpg";
import users from "../utils/users";
import "./App.scss";

const client = generateClient();

const DraggableRow = ({ team, position, styleOverride }) => {
  const animateLayoutChanges = (args) => {
    const { isSorting, wasSorting, transform, index } = args;

    if (isSorting || wasSorting) {
      return defaultAnimateLayoutChanges(args);
    }

    return true;
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    animateLayoutChanges,
    id: team.team.name, // Use the team name as a unique ID
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      key={team.team.name}
    >
      <TableCell align="center" sx={{ color: "#340040", fontWeight: "bold" }}>
        {/* <DragIndicatorIcon /> */}
        {position + 1}
      </TableCell>
      <TableCell align="left" sx={{ color: "#340040" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <img src={team.team.logo} width="30px" alt="Prem team logo" />
            {team.team.name}
          </span>
          <span>
            <IconButton>
              <DragIndicatorIcon />
            </IconButton>
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
};

const App = () => {
  const [standings, setStandings] = useState([]);
  const [totalGoals, setTotalGoals] = useState(null);
  const [sortedResults, setSortedResults] = useState([]);
  const [predictionsToShow, setPredictionsToShow] = useState([]);
  const [showLeagueTable, setShowLeagueTable] = useState(false);

  const [currentPrediction, setCurrentPrediction] = useState([]);
  const [currentDraggedItem, setCurrentDraggedItem] = useState(null);

  const user = 1;

  const [todos, setTodos] = useState([]);

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
        setCurrentPrediction(
          response.sort((a, b) => a.team.name.localeCompare(b.team.name))
        );
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

  const createPrediction = () => {
    client.models.Todo.create({
      content: JSON.stringify({
        user: 1,
        prediction: currentPrediction.map((prediction) => prediction.team.name),
      }),
    });
  };

  const deletePrediction = (id) => {
    console.log(id);
    client.models.Todo.delete({ id });
  };

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
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
        })
      );

      setTotalGoals(calculateTotalGoals());
    }
  }, [standings]);

  return (
    <div className="App">
      <>
        <h1>Prem Predictor</h1>

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

          <TableContainer
            component={Paper}
            sx={{
              width: "90%",
              margin: "auto",
              borderRadius: "20px",
              padding: "10px",
            }}
          >
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
                    Name
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
                        <Button
                          onClick={() =>
                            predictionsToShow.find(
                              (prediction) => prediction.name === result.name
                            )
                              ? setPredictionsToShow(
                                  predictionsToShow.filter(
                                    (prediction) =>
                                      prediction.name !== result.name
                                  )
                                )
                              : setPredictionsToShow([
                                  ...predictionsToShow,
                                  users.find(
                                    (user) => user.name === result.name
                                  ),
                                ])
                          }
                        >
                          {predictionsToShow.find(
                            (prediction) => prediction.name === result.name
                          )
                            ? "Hide"
                            : "View"}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {predictionsToShow.length > 0 &&
                      predictionsToShow.find(
                        (prediction) => prediction.name === result.name
                      ) &&
                      predictionsToShow
                        .find((prediction) => prediction.name === result.name)
                        .predictions.map((prediction, index) => (
                          <TableRow>
                            <TableCell
                              align="center"
                              sx={{ color: "#340040", fontWeight: "bold" }}
                              colSpan={5}
                            >
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

      {currentPrediction.length > 0 && (
        <>
          <h2>Prediction</h2>

          <DndContext
            onDragStart={(event) => {
              const selectedIndex = event.active.data?.current.sortable.index;
              setCurrentDraggedItem({
                name: event.active.id,
                logo: currentPrediction[selectedIndex].team.logo,
                position: selectedIndex,
              });
            }}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (over && active.id !== over.id) {
                const activeIndex = currentPrediction.findIndex(
                  (standing) => standing.team.name === active.id
                );
                const overIndex = currentPrediction.findIndex(
                  (standing) => standing.team.name === over.id
                );

                if (activeIndex !== overIndex) {
                  const newItems = arrayMove(
                    currentPrediction,
                    activeIndex,
                    overIndex
                  );
                  setCurrentPrediction(newItems);
                }
                setCurrentDraggedItem(null);
              }
            }}
          >
            <SortableContext
              items={currentPrediction.map(
                (prediction) => prediction.team.name
              )}
              strategy={verticalListSortingStrategy}
            >
              <TableContainer
                component={Paper}
                sx={{
                  width: "90%",
                  margin: "auto",
                  borderRadius: "20px",
                  padding: "10px",
                }}
              >
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentPrediction.map((team, index) => (
                      <DraggableRow team={team} position={index} />
                    ))}
                    <DragOverlay
                      style={{
                        background: "white",
                        width: "90%",
                        borderBottom: "1px solid rgba(224, 224, 224, 1)",
                        borderTop: "1px solid rgba(224, 224, 224, 1)",
                      }}
                    >
                      {currentDraggedItem && (
                        <div
                          style={{
                            width: "100%",
                            background: "white",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              padding: "16px",
                              width: "14%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "15px",
                            }}
                          >
                            {/* <DragIndicatorIcon /> */}
                            {currentDraggedItem?.position + 1}
                          </span>
                          <span
                            style={{
                              padding: "16px",
                              width: "86%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "15px",
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "15px",
                              }}
                            >
                              <img
                                src={currentDraggedItem?.logo}
                                width="30px"
                                alt="Prem team logo"
                              />
                              {currentDraggedItem?.name}
                            </span>
                            <IconButton onClick={() => console.log("hitting")}>
                              <DragIndicatorIcon />
                            </IconButton>
                          </span>
                        </div>
                      )}
                    </DragOverlay>
                  </TableBody>
                </Table>
              </TableContainer>
            </SortableContext>
          </DndContext>

          <Button
            variant="contained"
            onClick={() => createPrediction()}
            sx={{ backgroundColor: "#F2055C", margin: "20px" }}
          >
            {"Submit prediction"}
          </Button>
        </>
      )}

      {todos.map((todo) => (
        <button onClick={() => deletePrediction(todo.id)}>
          {todo.content}
        </button>
      ))}

      {standings.length > 0 && (
        <div>
          <Button
            onClick={() => setShowLeagueTable((prev) => !prev)}
            variant="text"
          >
            {showLeagueTable ? "Hide league table" : "Show league table"}
          </Button>

          {showLeagueTable && (
            <TableContainer
              component={Paper}
              sx={{
                width: "90%",
                margin: "auto",
                borderRadius: "20px",
                padding: "10px",
              }}
            >
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
      )}
    </div>
  );
};

export default App;
