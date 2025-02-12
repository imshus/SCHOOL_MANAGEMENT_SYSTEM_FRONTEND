import { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import axios from 'axios'
import { baseApi } from "../../../enviroment";
import { CardMedia } from '@mui/material';

const StudentDetail = () => {
  const [studentDetails, setStudentDeatils] = useState(null)

  const fetchData = async () => {
    await axios.get(`${baseApi}/student/fetch`).then(res => {
      console.log(res)
      setStudentDeatils(res.data.student)
    }).catch(err => {
      console.log("error", err)
    })
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {studentDetails &&
        <>
          <CardMedia
            component="img"
            sx={{
              margin: 'auto',
              marginBottom: '20px',
              height: '200px',       // Make height and width equal
              width: '200px',
              borderRadius: '50%',   // Correct property name (was borderRight)
              objectFit: 'cover',    // Ensures image covers the space without distortion
              display: 'block'       // Ensures proper image alignment
            }}
            image={studentDetails.student_image}
            alt="Student profile"
          />

          <TableContainer sx={{ marginTop: '20px' }} component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>

                <TableRow>
                  <TableCell><b>Name :</b></TableCell>
                  <TableCell align="right">{studentDetails.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Email :</b></TableCell>
                  <TableCell align="right">{studentDetails.email}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Age :</b></TableCell>
                  <TableCell align="right">{studentDetails.age}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Gender :</b></TableCell>
                  <TableCell align="right">{studentDetails.gender}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Guardian :</b></TableCell>
                  <TableCell align="right">{studentDetails.guardian}</TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </>}
    </>
  );
}

export default StudentDetail
