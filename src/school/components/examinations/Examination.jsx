/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useFormik } from 'formik'
import dayjs from 'dayjs'
import { baseApi } from '../../../enviroment';
import axios from 'axios'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { examinationSchema } from '../../../yupSchema/examinationSchema';
import { Button, Typography } from '@mui/material';
import MessageSnackbar from '../../../../basic utility components/snackbar/MessageSnakbar';

export default function Examination() {
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState('success')
    const [subjectData, setSubjectData] = useState([])
    const [classData, setClassData] = useState([])
    const [selectedClass, setSelectedClass] = useState("");

    const handleMessageClose = () => {
        setMessage("")
    }

    const initialValues = {
        date: "",
        examType: "",
        subject: "",
    }
    const fetchSubjects = async (req, res) => {
        try {
            const response = await axios.get(`${baseApi}/subject/all`);
            setSubjectData(response.data.data)
        }
        catch (err) {
            console.log(`Error ${err}`)
        }
    }
    const fetchClass = async (req, res) => {
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
    const Formik = useFormik({
        initialValues: initialValues,
        validationSchema: examinationSchema,
        onSubmit:async (value) => {
            try {
                if(editId){
                   const response =await axios.post(`${baseApi}/examination/update/${editId}`,{ 
                    date: value.date, 
                    subjectId: value.subject, 
                    examType: value.examType,  
                })
                 setMessage(response.data.message);
                 setMessageType('success');
                }else{
                const response = await axios.post(`${baseApi}/examination/create`, 
                { 
                    date: value.date, 
                    subjectId: value.subject, 
                    examType: value.examType, 
                    classId: selectedClass 
                })
                setMessage(response.data.message);
                setMessageType('success');
            }}
            catch (err) {
                console.log("Erron", err)
                setMessage(`Error in updating data`);
                setMessageType('failed');
            }
            Formik.resetForm();
        }
    })
     const [examination,setExamination]=useState([]);
    const fetchExaminations=async (req,res)=>{
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
    const [editId,setEditId]=useState(null)
    const handleEdit=(id)=>{
        setEditId(id);
        const selectedExamination=examination.filter(x=>x._id===id)
        Formik.setFieldValue("date",selectedExamination[0].examDate)
        Formik.setFieldValue("subject",selectedExamination[0].subject._id)
        Formik.setFieldValue("examType",selectedExamination[0].examType)
    }

    const handleDelete=async (id)=>{
        try{
           const response=await axios.delete(`${baseApi}/examination/delete/${id}`)
           setMessage(response.data.message);
           setMessageType('success');
        }catch(err){
            console.log("Error",err)
            setMessage("Failed in Deleting");
           setMessageType('failed');
        }
    }

    const handleClose=()=>{
        setEditId(null)
        Formik.resetForm()
    }

    useEffect(()=>{
        fetchClass()
    },[])

    useEffect(() => {
        fetchSubjects()
        fetchExaminations()
    }, [message,selectedClass])

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
            <Paper>
                <Box
                    component="form"
                    onSubmit={Formik.handleSubmit}
                    noValidate
                    autoComplete="off"
                    sx={{ display: 'flex', flexDirection: 'column', width: '24vw', minWidth: '240px', margin: 'auto' }}
                >
                    <MessageSnackbar
                        message={typeof message === "string" ? message : JSON.stringify(message)}
                        type={messageType}
                        handleClose={handleMessageClose}
                    />
                    {editId ? <Typography style={{ textAlign: 'center', fontSize: '25px', font: 'bold' }}>Edit Exam</Typography>:<Typography style={{ textAlign: 'center', fontSize: '25px', font: 'bold' }}>Add New Exam</Typography>}
        
                    <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DemoContainer components={["DatePicker"]} >
                            <DatePicker
                                label="Basic date picker"
                                value={Formik.values.date ? dayjs(Formik.values.date) : null}
                                onChange={(newValue) => {
                                    Formik.setFieldValue("date", dayjs(newValue))
                                }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    {Formik.touched.date && Formik.errors.date && (<p style={{ color: 'red', textTransform: 'capitalize' }}>{Formik.errors.date}</p>)}
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Subject
                        </InputLabel>
                        <Select
                            name='subject'
                            label='Subject'
                            sx={{ marginTop: '10px' }}
                            onChange={Formik.handleChange}
                            onBlur={Formik.handleChange}
                            value={Formik.values.subject}
                        >
                            <MenuItem value={""}>Select Subject</MenuItem>
                            {subjectData?.map((item) => (
                                
                                <MenuItem key={item._id} value={item._id}>{item.subject_name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {Formik.touched.subject && Formik.errors.subject && (<p style={{ color: 'red', textTransform: 'capitalize' }}>{Formik.errors.subject}</p>)}

                    <TextField value={Formik.values.examType} sx={{ marginTop: '10px', marginBottom: '10px' }} name="examType" onChange={Formik.handleChange} onBlur={Formik.handleChange} id="standard-basic" label="Exam Type" variant="standard" />
                    {Formik.touched.examType && Formik.errors.examType && (<p style={{ color: 'red', textTransform: 'capitalize' }}>{Formik.errors.examType}</p>)}

                    <Button  sx={{ marginTop: '10px', marginBottom: '20px', backgroundColor: 'blue', color: 'Black' }} type="submit" varient='contained'>Submit</Button>
                    {editId ? <Button onClick={handleClose}  sx={{ marginTop: '10px', marginBottom: '20px', backgroundColor: 'blue', color: 'Black' }} type="submit" varient='contained'>Cancel</Button>:""}

                </Box>
            </Paper>

            <TableContainer sx={{ marginTop: '20px' }} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Exam Date</TableCell>
                            <TableCell align="right">Subject</TableCell>
                            <TableCell align="right">Exam Type</TableCell>
                            <TableCell align="right">Action</TableCell>
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
                                <TableCell align="right"><Button varient="contained" onClick={()=>handleEdit(examination._id)} sx={{background:'skyblue'}}>Edit</Button><Button onClick={()=>handleDelete(examination._id)} varient="contained" sx={{background:'tomato'}}>Delete</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
