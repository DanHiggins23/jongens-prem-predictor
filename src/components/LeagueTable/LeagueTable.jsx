import { useState } from 'react';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const LeagueTable = ({ leagueTable }) => {
  const [showLeagueTable, setShowLeagueTable] = useState(false);

  if (leagueTable.length <= 0) return null;

  return (
    <>
      <Button
        onClick={() => setShowLeagueTable((prev) => !prev)}
        variant='text'
        sx={{ margin: '16px' }}
      >
        {showLeagueTable ? 'Hide league table' : 'View league table'}
      </Button>

      {showLeagueTable && (
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
                  align='center'
                  sx={{ color: '#340040', fontWeight: 'bold' }}
                >
                  Pos
                </TableCell>
                <TableCell
                  align='left'
                  sx={{ color: '#340040', fontWeight: 'bold' }}
                >
                  Club
                </TableCell>
                <TableCell
                  align='center'
                  sx={{ color: '#340040', fontWeight: 'bold' }}
                >
                  Pld
                </TableCell>
                <TableCell
                  align='center'
                  sx={{ color: '#340040', fontWeight: 'bold' }}
                >
                  GD
                </TableCell>
                <TableCell
                  align='center'
                  sx={{ color: '#340040', fontWeight: 'bold' }}
                >
                  Pts
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leagueTable.map((team) => (
                <TableRow>
                  <TableCell
                    align='center'
                    sx={{ color: '#340040', fontWeight: 'bold' }}
                  >
                    {team.stats.rank}
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
                        src={team.team.logo}
                        width='30px'
                        alt='Prem team logo'
                      />
                      {team.team.name}
                    </div>
                  </TableCell>
                  <TableCell align='center' sx={{ color: '#340040' }}>
                    {team.stats.gamesPlayed}
                  </TableCell>
                  <TableCell align='center' sx={{ color: '#340040' }}>
                    {team.stats.goalDifference}
                  </TableCell>
                  <TableCell align='center' sx={{ color: '#340040' }}>
                    {team.stats.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default LeagueTable;
