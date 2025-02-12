import axios from 'axios';
import { useState, useEffect } from 'react';
import { baseApi } from '../../../enviroment';
import { Box, Typography, IconButton, Input } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const Dashboard = () => {
    const [school, setSchool] = useState(null);
    const [hover, setHover] = useState(false);

    const fetchSchool = async () => {
        try {
            const response = await axios.get(`${baseApi}/school/fetch-single`);
            setSchool(response.data.school);
        } catch (error) {
            console.error("Error fetching school data:", error);
        }
    };
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.patch(
                `${baseApi}/school/update`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setSchool(prev => ({ ...prev, school_image: response.data.imageUrl }));
        } catch (error) {
            console.error("Error updating image:", error);
        }
    };
    useEffect(() => {
        fetchSchool();
    }, []);
    if (!school) return <Typography variant="h6">Loading...</Typography>;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                {school.school_name}
            </Typography>
            <Box 
                sx={{
                    height: 500,
                    width: '100%',
                    position: 'relative',
                    backgroundImage: `url(${school.school_image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '&:hover': {
                        boxShadow: 3
                    }
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {hover && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                            bgcolor: 'background.paper',
                            borderRadius: '50%',
                            boxShadow: 2
                        }}
                    >
                        <IconButton component="label">
                            <EditIcon />
                            <Input
                                type="file"
                                inputProps={{ accept: 'image/*' }}
                                sx={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Box>
    );
};
export default Dashboard;
