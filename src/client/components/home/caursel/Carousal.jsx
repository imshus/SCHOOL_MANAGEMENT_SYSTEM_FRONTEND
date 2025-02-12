import { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  MobileStepper,
  useTheme,
  CircularProgress,
  Typography,
} from '@mui/material';
import KeyboardArrowLeft  from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight  from '@mui/icons-material/KeyboardArrowRight';
import axios from 'axios';
import { baseApi } from '../../../../enviroment';

const Carousel = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  const maxSteps = schools.length;

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseApi}/school/all`);
        setSchools(res.data.schools);
      } catch (e) {
        console.error("Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', height: 300, alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      maxWidth: '100%',
      margin: '0 auto',
      position: 'relative',
      height: { xs: 200, md: 300 },
      overflow: 'hidden',
      boxShadow: 3
    }}>
      <Box sx={{
        display: 'flex',
        height: '100%',
        width: `${maxSteps * 100}%`,
        transition: 'transform 0.5s ease-in-out',
        transform: `translateX(-${(activeStep * 100) / maxSteps}%)`
      }}>
        {schools.map((school) => (
          <Box
            key={school._id}
            sx={{
              width: `${100 / maxSteps}%`,
              height: '100%',
              position: 'relative'
            }}
          >
            <img
              src={school.school_image}
              alt={school.school_name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.8)'
              }}
            />
            <Box sx={{
              position: 'absolute',
              bottom: 32,
              left: 32,
              color: 'black',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: 'black' }}>
                {school.school_name}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.3)'
          }
        }}
      >
        <KeyboardArrowLeft fontSize="large" />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.3)'
          }
        }}
      >
        <KeyboardArrowRight fontSize="large" />
      </IconButton>

      {/* Dots Indicator */}
      <MobileStepper
        variant="dots"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'transparent',
          '& .MuiMobileStepper-dot': {
            width: 12,
            height: 12,
            backgroundColor: 'rgba(255,255,255,0.4)',
            '&.Mui-active': {
              backgroundColor: theme.palette.primary.main
            }
          }
        }}
        backButton={null}
        nextButton={null}
      />
    </Box>
  );
};

export default Carousel;