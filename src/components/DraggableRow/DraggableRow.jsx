import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSS } from '@dnd-kit/utilities';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const DraggableRow = ({ team, position }) => {
  const animateLayoutChanges = (args) => {
    const { isSorting, wasSorting } = args;

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
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...listeners}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...attributes}
      key={team.team.name}
    >
      <TableCell align='center' sx={{ color: '#340040', fontWeight: 'bold' }}>
        {position + 1}
      </TableCell>
      <TableCell align='left' sx={{ color: '#340040' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={team.team.logo} width='30px' alt='Prem team logo' />
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

export default DraggableRow;
