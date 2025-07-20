import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

import defaultProfile from '../../images/default-pp.jpg';

const ScoreTable = ({ results }) => {
  const [predictionsToShow, setPredictionsToShow] = useState([]);

  if (results.length <= 0) return null;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
        <div>
          <Avatar
            alt={results[0]?.name}
            src={results.length > 0 ? results[0]?.profile : defaultProfile}
            sx={{ width: 120, height: 120 }}
          />
          <p>🍺🍺🍺🍺🍺</p>
        </div>
        <div>
          <Avatar
            alt={results[results.length]?.name}
            src={
              results.length > 0
                ? results[results.length - 1]?.profile
                : defaultProfile
            }
            sx={{ width: 120, height: 120 }}
          />
          <p>😢💷</p>
        </div>
      </div>

      <h2>Scores on the doors</h2>

      <TableContainer
        component={Paper}
        sx={{
          width: '90%',
          margin: 'auto',
          borderRadius: '20px',
          padding: '10px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                align='left'
                sx={{ color: '#340040', fontWeight: 'bold' }}
              >
                Pos
              </TableCell>
              <TableCell
                align='left'
                sx={{ color: '#340040', fontWeight: 'bold' }}
              >
                Name
              </TableCell>
              <TableCell
                align='center'
                sx={{ color: '#340040', fontWeight: 'bold' }}
              >
                Points
              </TableCell>
              <TableCell
                align='center'
                sx={{ color: '#340040', fontWeight: 'bold' }}
              >
                xG
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => (
              <>
                <TableRow>
                  <TableCell
                    align='left'
                    sx={{ color: '#340040', fontWeight: 'bold' }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell align='left' sx={{ color: '#340040' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                      }}
                    >
                      <img
                        src={result.profile}
                        width='30px'
                        height='30px'
                        alt='Jongen'
                        style={{ borderRadius: '50px' }}
                      />
                      {result.name}
                    </div>
                  </TableCell>
                  <TableCell align='center' sx={{ color: '#340040' }}>
                    {result.score}
                  </TableCell>
                  <TableCell align='center' sx={{ color: '#340040' }}>
                    {result.goals?.toLocaleString()}
                  </TableCell>
                  {/* <TableCell align="center" sx={{ color: "#340040" }}>
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
                </TableCell> */}
                </TableRow>

                {/* {predictionsToShow.length > 0 &&
                  predictionsToShow.find(
                    (prediction) => prediction.name === result.name,
                  ) &&
                  predictionsToShow
                    .find((prediction) => prediction.name === result.name)
                    .predictions.map((prediction, index) => (
                      <TableRow>
                        <TableCell
                          align='center'
                          sx={{ color: '#340040', fontWeight: 'bold' }}
                          colSpan={5}
                        >
                          {`${index + 1}: ${prediction}`}
                        </TableCell>
                      </TableRow>
                    ))} */}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ScoreTable;
