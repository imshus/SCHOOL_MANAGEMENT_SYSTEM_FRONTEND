/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react'
import { baseApi } from '../../../enviroment'
import axios from 'axios'

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PieChart } from '@mui/x-charts/PieChart';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const AttendanceDetails = () => {
    const [present, setPresent] = useState(0);
    const [absent, setAbsent] = useState(0);
    const [attendanceData, setAttendanceData] = useState([]);

    const [studentId,setStudentId]=useState(null);
    const fetchSingleStudent=async ()=>{
       try{
         const response=await axios.get(`${baseApi}/student/fetch-single`)
         setStudentId(response.data.student._id)
       }catch(err){
        console.log("Error",err)
       }
    }
    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get(`${baseApi}/attendance/${studentId}`)
            console.log(response)
            const attendanceFetchData = response.data.attendance
            if (attendanceFetchData) {
                setAttendanceData(attendanceFetchData)
                attendanceFetchData?.forEach(attendance => {
                    if (attendance.status == "present") {
                        setPresent(present + 1)
                    } else {
                        setAbsent(absent + 1)
                    }
                })
            }
        } catch (err) {
            console.log("Error in fetching student attendance", err)
        }
    }
    
    const convertDate = (dateData) => {
        const date = new Date(dateData);
        return date.getDay() + "-" + (+date.getMonth() + 1) + "-" + date.getFullYear();
    }

    useEffect(()=>{
      fetchSingleStudent()
    },[])

    useEffect(() => {
      if(studentId){
        fetchAttendanceData()
      }
    }, [studentId])
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid size={6}>
                    <Item>
                        <PieChart
                            series={[
                                {
                                    data: [
                                        { id: 0, value: present, label: 'Present' },
                                        { id: 1, value: absent, label: 'Absent' },

                                    ],
                                },
                            ]}
                            width={400}
                            height={200}
                        />
                    </Item>
                </Grid>
                <Grid size={6}>
                    <Item>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 450 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell align="right">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceData.map((attendance) => (
                                        <TableRow
                                            key={attendance._id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {convertDate(attendance.date)}
                                            </TableCell>
                                            <TableCell align="right">{attendance.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Item>
                </Grid>
            </Grid>
        </Box>
    )
}
export default AttendanceDetails