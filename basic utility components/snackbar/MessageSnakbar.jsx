/* eslint-disable react/prop-types */
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function MessageSnackbar({ message, type, handleClose }) {
  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
      action={action}
      ContentProps={{
        sx: {
          backgroundColor: type === 'success' ? '#4caf50' : '#f44336',
          color: 'white',
          alignItems: 'left',
        }
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    />
  )
}
