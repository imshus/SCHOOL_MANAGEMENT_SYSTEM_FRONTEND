/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { baseApi } from '../../../enviroment';
import axios from 'axios'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MessageSnackbar from '../../../../basic utility components/snackbar/MessageSnakbar';

const AttendanceTeacher = () => {
  const [classes, setClasses] = useState()
  const [selectedClass, setSelectedClass] = useState()
  const [message, setMessage] = useState()
  const [messageType, setMessageType] = useState("success")

  const handleMessageClose = () => {
    setMessage("")
    setMessageType("failed")
  }

  const fetchAttendeeClass = async () => {
    try {
      const response = await axios.get(`${baseApi}/class/attendee`)
      setClasses(response.data.data)
      if (response.data.data > 0) {
        setSelectedClass(response.data.data[0]._id)
      }
    }
    catch (err) {
      console.log("Error", err)
    }
  }

  useEffect(() => {
    fetchAttendeeClass()
  }, [])

  const [attendenceStatus, setAttendenceStatus] = useState({})
  const handleAttendence = (studentId, status) => {
    setAttendenceStatus((prevStatus) => ({
      ...prevStatus,
      [studentId]: status
    }))
  }

  const singleStudentAttendence = async (studentId, status) => {
    try {
      const response = await axios.post(`${baseApi}/attendance/mark`, {
        studentId,
        date: new Date(),
        classId: classes._id,
        status
      });
      setMessage(response.data.message);
      setMessageType("success");

    } catch (err) {
      setMessage(`Failed: ${err.message}`);
      setMessageType("error");

    }
  };

  const submitAttendence = async () => {
    try {
      await Promise.any(
        student.map((student) =>
          singleStudentAttendence(student._id, attendenceStatus[student._id])
        )
      )
      setMessage("Attendance submitted successfully!");
      setMessageType("success");
    } catch (err) {
      console.error("Error:", err);
      setMessage("Failed to submit attendance.");
      setMessageType("error");
    }
  };

  const [checkAttendenceStatus, setCheckAttendenceStatus] = useState(false)
  const [student, setStudent] = useState();
  const checkAttendenceAndFetchStudents = async () => {
    try {
      if (selectedClass) {
        const responseStudent = await axios.get(`${baseApi}/student/fetch-Query`, { params: { student_class: selectedClass } })
        const responseCheck = await axios.get(`${baseApi}/attendance/check/${selectedClass}`)
        if (!responseCheck.data.attendenceTaken) {
          setStudent(Array.from(responseStudent.data.student))
          responseStudent.data.student.forEach(student => {
            handleAttendence(student._id, 'present')
          })
        } else {
          setCheckAttendenceStatus(true)
        }
      }
    } catch (err) {
      console.log("Error", err)
    }
  }

  useEffect(() => {
    checkAttendenceAndFetchStudents()
  }, [selectedClass, message])

  return (
    <Box>
      <MessageSnackbar
        message={typeof message === "string" ? message : JSON.stringify(message)}
        type={messageType}
        handleClose={handleMessageClose}
      />
      <Typography sx={{ fontSize: "20px" }}>AttendenceTeacher</Typography>

      {classes?.length > 0 ? <Box>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          {`You have a ${classes?.length} class to attend.`}
        </Alert>
        <FormControl sx={{ border: '1px solide black', marginTop: '20px', width: '200px', marginBottom: '20px' }}>
          <InputLabel id="teacher">
            Teacher
          </InputLabel>
          <Select
            labelId="teacher"
            name='teacher'
            label='Teacher'
            sx={{ marginTop: '10px' }}
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value);setCheckAttendenceStatus(false) }}
          >
            <MenuItem value={""}>Select Class</MenuItem>
            {classes?.map((item) => (
              <MenuItem key={item._id} value={item.class_text}>{item.class_text}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box> :
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          {`You are not attendee of any classes`}
        </Alert>}

      {(student?.length > 0 && !checkAttendenceStatus) ? <TableContainer sx={{ marginTop: '20px' }} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><p>Name</p></TableCell>
              <TableCell align="right"><p>Action</p></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {student.map((student) => (
              <TableRow
                key={student._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {student.name}
                </TableCell>

                <TableCell align="right">
                  <FormControl sx={{ border: '1px solide black', marginTop: '20px', width: '200px', marginBottom: '20px' }}>
                    <InputLabel>Attendence</InputLabel>
                    <Select
                      name='attendence'
                      label='Attendence'
                      sx={{ marginTop: '10px' }}
                      value={attendenceStatus[student._id]}
                      onChange={(e) => { handleAttendence(student._id, e.target.value) }}
                    >
                      <MenuItem value={"present"}>Present</MenuItem>
                      <MenuItem value={"absent"}>Absent</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="outlined" color="primary" onClick={submitAttendence}>Take Attendence</Button>
      </TableContainer> :
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
          {checkAttendenceStatus ?`Attendence already taken for this class`:`There is no Students in this class.`}
        </Alert>
      }
    </Box>
  )
}

export default AttendanceTeacher
