import { useState } from 'react';

import { DndContext, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

import DraggableRow from '../DraggableRow/DraggableRow';

const PredictionsTable = ({
  currentPrediction,
  setCurrentPrediction,
  createPrediction,
  isDraft,
}) => {
  const [currentDraggedItem, setCurrentDraggedItem] = useState(null);
  const [showxGDialog, setShowxGDialog] = useState(false);
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [expectedGoalsInput, setExpectedGoalsInput] = useState('');

  if (currentPrediction <= 0) return null;

  const renderxGDialogContent = () => (
    <>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Please enter your prediction for how many total goals will be scored
          this season. This will be used as a tiebreaker if needed.
        </DialogContentText>
        <TextField
          label='Total goals'
          value={expectedGoalsInput}
          onChange={(e) => setExpectedGoalsInput(e.target.value)}
          variant='outlined'
          sx={{ marginTop: '20px' }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setShowxGDialog(false);
            setExpectedGoalsInput('');
          }}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          sx={{ backgroundColor: '#F2055C', margin: '20px' }}
          onClick={() => {
            setShowSubmissionDialog(true);
            setShowxGDialog(false);
          }}
          autoFocus
          disabled={expectedGoalsInput === ''}
        >
          Next
        </Button>
      </DialogActions>
    </>
  );

  const renderSubmitDialogContent = () => (
    <>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          You are about to submit your predictions. This cannot be undone. Are
          you happy with your choices?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowSubmissionDialog(false)}>No</Button>
        <Button
          variant='contained'
          sx={{ backgroundColor: '#F2055C', margin: '20px' }}
          onClick={() => {
            createPrediction(expectedGoalsInput, false);
            setShowSubmissionDialog(false);
          }}
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </>
  );

  return (
    <>
      <h2>Set your predictions below 👇</h2>
      {isDraft && (
        <Chip label='In Draft' color='warning' sx={{ marginBottom: '20px' }} />
      )}

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
              (standing) => standing.team.name === active.id,
            );
            const overIndex = currentPrediction.findIndex(
              (standing) => standing.team.name === over.id,
            );

            if (activeIndex !== overIndex) {
              const newItems = arrayMove(
                currentPrediction,
                activeIndex,
                overIndex,
              );
              setCurrentPrediction(newItems);
            }
            setCurrentDraggedItem(null);
          }
        }}
      >
        <SortableContext
          items={currentPrediction.map((prediction) => prediction.team.name)}
          strategy={verticalListSortingStrategy}
        >
          <TableContainer
            component={Paper}
            sx={{
              width: '80%',
              margin: 'auto',
              borderRadius: '20px',
              padding: '10px',
            }}
          >
            <Table sx={{ touchAction: 'none' }}>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPrediction.map((team, index) => (
                  <DraggableRow team={team} position={index} />
                ))}
                <DragOverlay
                  style={{
                    background: 'white',
                    width: '90%',
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                    touchAction: 'manipulation',
                  }}
                >
                  {currentDraggedItem && (
                    <div
                      style={{
                        width: '100%',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          padding: '16px',
                          width: '14%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '15px',
                        }}
                      >
                        {currentDraggedItem.position + 1}
                      </span>
                      <span
                        style={{
                          padding: '16px',
                          width: '86%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '15px',
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                          }}
                        >
                          <img
                            src={currentDraggedItem?.logo}
                            width='30px'
                            alt='Prem team logo'
                          />
                          {currentDraggedItem?.name}
                        </span>
                        <IconButton>
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

      <div>
        <Button
          variant='outlined'
          color='secondary'
          onClick={() => createPrediction(null, true)}
          sx={{
            margin: '20px 20px 0px',
            width: '50%',
            color: 'white',
            borderColor: '#F2055C',
          }}
        >
          Save draft
        </Button>
        <Button
          variant='contained'
          onClick={() => setShowxGDialog(true)}
          sx={{ backgroundColor: '#F2055C', margin: '20px', width: '50%' }}
        >
          Submit predictions
        </Button>
      </div>

      <Dialog
        open={showxGDialog || showSubmissionDialog}
        // onClose={() => setShowConfirmationModal(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Submit predictions</DialogTitle>
        {showxGDialog && renderxGDialogContent()}
        {showSubmissionDialog && renderSubmitDialogContent()}
      </Dialog>
    </>
  );
};

export default PredictionsTable;
