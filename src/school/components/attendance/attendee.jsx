/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import axios from 'axios'
import { baseApi } from '../../../enviroment';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';


const Attendee = ({ classId,handleMessage }) => {
    const [teacher, setTeacher] = useState([]);
    const [selectedTeacher, setselectedTeachers] = useState({});

    const handleSubmit = async () => {
        try {
            if (selectedTeacher) {
                await axios.patch(`${baseApi}/class/update/${classId}`, { attendee: selectedTeacher })
                handleMessage("Success Updated/Save","success")
            }
            else{
                alert("Please select teacher")
            }
        }
        catch (err) {
            console.log("Error", err)
        }
    }

    const [attendee, setAttendee] = useState(null);
    const fetchClassDetails = async () => {
        if (classId) {
            try {
                const response = await axios.get(`${baseApi}/class/single/${classId}`)
                setAttendee(response.data.data.attendee ? response.data.data.attendee : null) 
            }
            catch (err) {
                console.log("Error", err)
            }
        }
    }
    const fetchTeacher = async () => {
        await axios.get(`${baseApi}/teacher/fetch-Query`, { params: {} }).then(res => {
            setTeacher(Array.from(res.data.teacher))
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchTeacher()
        fetchClassDetails()
    }, [classId, selectedTeacher, attendee])

    return (
        <Box component={'div'}>
            
            <Typography varient={'h2'} >Attendee Teacher</Typography>
            {attendee &&
                <Box sx={{ display: 'flex', margin: 'auto', backgroundColor: 'gray' }} component={'div'}>
                    <Typography varient="h4" >
                        Attendee Teacher :
                    </Typography>
                    <Typography varient="h4">
                        {attendee.name}
                    </Typography>
                </Box>
            }

            <FormControl sx={{ marginTop: '10px', width: '180px', marginLeft: '5px' }}>
                <InputLabel id="select">Teacher</InputLabel>
                <Select
                    labelId='select'
                    label="Select Teacher"
                    value={selectedTeacher}
                    onChange={(e) => setselectedTeachers(e.target.value)}
                >
                    <MenuItem value="">
                        <em>Clean</em>
                    </MenuItem>
                    {Array.isArray(teacher) &&
                        teacher.map((cls) => (
                            <MenuItem key={cls._id} value={cls._id}>
                                {cls.name}
                            </MenuItem>
                        ))}
                </Select>

            </FormControl>
            <Button type="submit" sx={{ width: '10rem', height: '2rem', backgroundColor: 'blue', color: "black", marginTop: '10px' }} onClick={handleSubmit}>{attendee ? "Change Attendee" : "Select Attendee"}</Button>
        </Box>
    )
}
export default Attendee
