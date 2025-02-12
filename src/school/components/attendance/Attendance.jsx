/* eslint-disable react-hooks/exhaustive-deps */
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Typography, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import { baseApi } from '../../../enviroment';
import Attendee from './attendee';
import MessageSnackbar from '../../../../basic utility components/snackbar/MessageSnakbar';
import { Link } from 'react-router-dom';

export default function AttendenceStudentList() {

    const [classes, setClasses] = useState([]);
    const [student, setStudent] = useState([]);
    const [params, setParams] = useState({});
    const [message,setMessage]=useState("");
    const [messageType,setMessageType]=useState("success")

    const handleMessageClose=()=>{
        setMessage("")
    }
     
    const handleMessage= (message,messageType)=>{
        setMessage(message)
        setMessageType(messageType)
    }


    const fetchClasses = async () => {
        try {
            if (student) {
                const response = await axios.get(`${baseApi}/class/all`);
                if (Array.isArray(response.data.data)) {
                    setClasses(response.data.data);
                } else {
                    setClasses([]);
                }

            }
            else{
                console.log("student not available")
            }
        } catch (err) {
            console.log(err);
        }
    };

    const [attendanceData, setAttendanceData] = useState({})
    const fetchAttendanceForStudents = async (studentList) => {
        const attendancePromises = studentList.map((student) =>
            fetchAttendanceForStudent(student._id)
        );
        const result = await Promise.all(attendancePromises);
        const updateAttendanceData = {};
        result.forEach(({ studentId, attendancePercentage }) => {
            updateAttendanceData[studentId] = attendancePercentage
        });
        setAttendanceData(updateAttendanceData)
    }

    const fetchAttendanceForStudent = async (studentId) => {
        try {
            const response = await axios.get(`${baseApi}/attendance/${studentId}`);
            const attendanceRecords = response.data
            const totalClasses = attendanceRecords.length;
            const presentCount = attendanceRecords.filter(
                (record) => record.status === "Present"
            ).length
            const attendancePercentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
            return { studentId, attendancePercentage }
        } catch (err) {
            console.log('error', err)
            return { studentId, attendancePercentage: 0 }
        }
    }
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

    const fetchStudent = async () => {
        try {
            const res = await axios.get(`${baseApi}/student/fetch-Query`, { params });
            setStudent(Array.from(res.data.student));
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearch = (e) => {
        setParams((prevParams) => ({
            ...prevParams,
            search: e.target.value || undefined,
        }));
    };
    const [selectedClass, setSelectedClass] = useState("")

    const handleClass = (e) => {
        setSelectedClass(e.target.value[0])
        setParams((prevParams) => ({
            ...prevParams,
            student_class: e.target.value[1] || undefined,
        }));
    };
    
    useEffect(() => {
        fetchClasses();
        fetchStudent();
    }, [params,message]);

    useEffect(() => {
        fetchAttendanceForStudents(student)
    }, [params,selectedClass,message])

    return (
        <Box component={'div'}>
    
            <MessageSnackbar
                            message={typeof message === "string" ? message : JSON.stringify(message)}
                            type={messageType}
                            handleClose={handleMessageClose}
                        />

            <Typography variant='h2' sx={{ textAlign: 'center', fontSize: '2rem' }}>
                Student Attendance
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 4 }}>
                    <Item><Box
                        component={'div'}
                        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
                    >
                        <TextField label="Search" onChange={handleSearch} value={params.search || ''} />
                        <FormControl sx={{ width: '180px', marginLeft: '5px' }}>
                            <InputLabel id="select">Student Class</InputLabel>
                            <Select
                                labelId='select'
                                label="Student Class"
                                value={selectedClass}
                                onChange={handleClass}
                            >
                                <MenuItem value={""}>
                                    <em>Clean</em>
                                </MenuItem>
                                {Array.isArray(classes) &&
                                    classes.map((cls) => (
                                        <MenuItem key={cls._id || cls.class_text} value={[cls._id,cls.class_text]}>
                                            {cls.class_text} [{cls.class_num}]
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Box>
                        <Box>
                            {selectedClass &&
                                <Attendee classId={selectedClass} handleMessage={handleMessage} />
                            }
                        </Box>
                    </Item>
                </Grid>
                <Grid size={{ xs: 6, md: 8 }}>
                    <Item> <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Gender</TableCell>
                                    <TableCell align="right">Guardian Phone</TableCell>
                                    <TableCell align="right">Class</TableCell>
                                    <TableCell align="right">Percentange</TableCell>
                                    <TableCell align="right">View</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {student &&
                                    student.map((student) => (
                                        <TableRow key={student.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                {student.name}
                                            </TableCell>
                                            <TableCell align="right">{student.gender}</TableCell>
                                            <TableCell align="right">{student.guardian_phone}</TableCell>
                                            <TableCell align="right">{student.student_class}</TableCell>
                                            <TableCell align="right">{
                                                attendanceData[student._id] !== undefined
                                                    ? `${attendanceData[student._id].toFixed(2)}%`
                                                    : "No Data"
                                            }</TableCell>
                                            <TableCell align="right"><Link to={`/school/attendance/${student._id}`}>Detail</Link></TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer></Item>
                </Grid>
            </Grid>
        </Box>
    );
}
