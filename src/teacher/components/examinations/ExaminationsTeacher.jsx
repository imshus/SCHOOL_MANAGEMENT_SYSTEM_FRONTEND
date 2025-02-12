/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { baseApi } from '../../../enviroment';
import axios from 'axios'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



export default function ExaminationsTeacher() {
    
    const [classData, setClassData] = useState([])
    const [selectedClass, setSelectedClass] = useState("");

    const fetchClass = async () => {
        try {
            const response = await axios.get(`${baseApi}/class/all`);
            setClassData(response.data.data)
        }
        catch (err) {
            console.log(`Error ${err}`)
        }
    }

    const convertDate = (dateData) => {
        const date = new Date(dateData);
        return date.getDate()+1 + "-" + (+date.getMonth() + 1) + "-" + date.getFullYear();
    }
    const [examination,setExamination]=useState([]);
    const fetchExaminations=async ()=>{
        try{
            if(selectedClass){
                const response=await axios.get(`${baseApi}/examination/class/${selectedClass}`)
                setExamination(response.data.data)
                console.log(response)
            }
        }
        catch(err){
            console.log(`Error ${err}`)
        }
    }
    useEffect(()=>{
        fetchClass()
    },[])

    useEffect(() => {
      fetchExaminations()
    },[selectedClass])

    return (
        <>
            <FormControl sx={{ width: '200px', marginBottom: '20px' }}>
                <InputLabel id="demo-simple-select-label">
                    Class
                </InputLabel>
                <Select
                    name='class'
                    label='Class'
                    sx={{ marginTop: '10px' }}
                    value={selectedClass}
                    onChange={(e) => { setSelectedClass(e.target.value) }}
                >
                    <MenuItem value={""}>Select Class</MenuItem>
                    {classData?.map((item) => (
                        <MenuItem key={item._id} value={item._id}>{item.class_text}</MenuItem>
                    ))}
                </Select>
            </FormControl>
      
            <TableContainer sx={{ marginTop: '20px' }} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><p>Exam Date</p></TableCell>
                            <TableCell align="right"><p>Subject</p></TableCell>
                            <TableCell align="right"><p>Exam Type</p></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {examination.map((examination) => (
                            <TableRow
                                key={examination._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {convertDate(examination.examDate.slice(0,10))}
                                </TableCell>
                                <TableCell align="right">{examination.subject?examination.subject.subject_name:"Not Found"}</TableCell>
                                <TableCell align="right">{examination.examType}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

