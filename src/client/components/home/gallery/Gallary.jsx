import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { baseApi } from '../../../../enviroment';

export default function Gallery() {
  const [open, setOpen] = React.useState(false);
  const [selectedSchool, setSelectedSchool] = React.useState(null);
  const [schools, setSchools] = React.useState([]);

  const handleOpen = (school) => {
    setOpen(true);
    setSelectedSchool(school);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSchool(null);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '80%', md: '70vw' },
    height: { xs: '70vh', md: '80vh' },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 0,
    overflow: 'hidden',
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseApi}/school/all`);
        setSchools(res.data.schools);
      } catch (e) {
        console.error("Error:", e);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(to bottom right, #f5f7fa, #c3cfe2)' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
        Register Schools
      </Typography>

      <ImageList
        sx={{
          width: '100%',
          height: 'auto',
          gap: 16,
        }}
        rowHeight={250}
      >
        {schools.map((school) => (
          <ImageListItem
            key={school._id}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              height: '250px !important',
              '&:hover': {
                transform: 'translateY(-4px)',
                '& img': {
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }
              }
            }}
          >
            <img
              src={`${school.school_image}?w=248&fit=crop&auto=format`}
              srcSet={`${school.school_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={school.school_name}
              loading="lazy"
              onClick={() => handleOpen(school)}
              style={{
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                height: '100%',
                width: '100%',
                objectFit: 'cover'
              }}
            />
            <ImageListItemBar
              title={
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'black' }}>
                  {school.school_name}
                </Typography>
              }
              sx={{

                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
                width: 'calc(100% - 16px)',
                left: '8px !important',
                bottom: '8px !important'
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Modal
        open={open}
        onClose={handleClose}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0,0,0,0.8)'
          }
        }}
      >
        <Box sx={modalStyle}>
          {selectedSchool && (
            <>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  zIndex: 1,
                  fontWeight: 700,
                  color: 'black',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {selectedSchool.school_name}
              </Typography>

              <img
                src={`${selectedSchool.school_image}?w=2000&fit=crop&auto=format`}
                alt={selectedSchool.school_name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

