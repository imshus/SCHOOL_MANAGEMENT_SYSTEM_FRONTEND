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

const TeacherDetail = () => {
  const [teacherDetails, setTeacherDeatils] = useState(null)

  const fetchData = async () => {
    await axios.get(`${baseApi}/teacher/fetch-single`).then(res => {
      setTeacherDeatils(res.data.teacher)
    }).catch(err => {
      console.log("error", err)
    })
  }
  useEffect(() => {
    fetchData();
  }, []);


  return (
    <>
      {teacherDetails &&
        <>
          <CardMedia
            component="img"
            sx={{
              margin: 'auto',
              marginBottom: '20px',
              height: '200px',      
              width: '200px',
              borderRadius: '50%',   
              objectFit: 'cover',    
              display: 'block'      
            }}
            image={teacherDetails.student_image}
            alt="Student profile"
          />

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>

                <TableRow>
                  <TableCell><b>Name :</b></TableCell>
                  <TableCell align="right">{teacherDetails.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Email :</b></TableCell>
                  <TableCell align="right">{teacherDetails.email}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Age :</b></TableCell>
                  <TableCell align="right">{teacherDetails.age}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Gender :</b></TableCell>
                  <TableCell align="right">{teacherDetails.gender}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Qualification :</b></TableCell>
                  <TableCell align="right">{teacherDetails.qualification}</TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </>}
    </>
  );
}

export default TeacherDetail
