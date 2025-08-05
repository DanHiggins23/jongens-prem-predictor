import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import mapUserToProfile from '../../utils/mapUserToProfile';

const UserSelection = ({ users, selectedUser, setSelectedUser }) => {
  const usersToDisplay = selectedUser
    ? [{ user: selectedUser, prediction: null }]
    : users.filter((user) => !user.isDraft);

  if (users.length === 0) {
    return null;
  }

  return (
    <>
      <div>
        {selectedUser ? (
          <Button onClick={() => setSelectedUser(null)}>Go back</Button>
        ) : (
          <h2>Select your user 👇</h2>
        )}
      </div>

      {/* TODO: Convert below into a table for better styling? */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {usersToDisplay.map((user) => (
          <IconButton
            onClick={() => setSelectedUser(user.user)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: '18px',
            }}
            key={user.user}
          >
            <Avatar
              src={mapUserToProfile[user.user]}
              sx={{ width: 120, height: 120 }}
            />
            <p>{user.user}</p>
          </IconButton>
        ))}
      </div>
    </>
  );
};

export default UserSelection;
