import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {  useFormik } from 'formik';
import { useRef, useState } from 'react';
import { useContext } from 'react';
import { Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import MessageSnackbar from '../../../../basic utility components/snackbar/MessageSnakbar';
import { loginSchema } from '../../../yupSchema/loginSchema';
import { AuthContext } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { baseApi } from '../../../enviroment';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function Login() {
    const [, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const fileInputRef = useRef(null);

    const [role,setRole]=useState('STUDENT')

    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const initialValues = {
        school_name: "",
        email: "",
        owner_name: "",
        password: "",
        confirm_password: ""
    };

    const handleClearFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setFile(null);
    };
    const formik = useFormik({
        initialValues,
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            let URL;

            if(role==="STUDENT"){
                URL=`${baseApi}/student/login`
            }
            else if(role==="TEACHER"){
                URL=`${baseApi}/teacher/login`
            }
            else if(role==="SCHOOL"){
                URL=`${baseApi}/school/login`
            }

            try {
                await axios.post(URL, { ...values }).then(res => {
                    const token = res.headers.get('Authentication');

                    if (token) {
                        localStorage.setItem("token", token)
                    }
                    const user = JSON.stringify(res.data.user);

                    if (user) {
                        localStorage.setItem("user", user)
                        login(user)
                    }

                    setMessage(res.data.message);
                    setMessageType('success');
                    formik.resetForm();
                    handleClearFile();
                    if(role==='SCHOOL'){
                        navigate('/school')
                    }
                    else if(role==='TEACHER'){
                        navigate('/teacher')
                    }
                    else if(role==='STUDENT'){
                        navigate('/student')
                    }
                })
            } catch (error) {
                console.error('Login error:', error);
                setMessage(error.response?.data?.message || 'Login failed. Please try again.');
                setMessageType('error');
            }
        }
    });
    const handleMessageClose = () => {
        setMessage('');
    };

    return (
        <Box component={'div'}> 
            <MessageSnackbar
                message={typeof message === "string" ? message : JSON.stringify(message)}
                type={messageType}
                handleClose={handleMessageClose}
            />
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '60vw',
                    minWidth: '230px',
                    margin: 'auto',
                    gap: 2,
                    p: 2,
                }}
                onSubmit={formik.handleSubmit}
            > 
                <Typography variant="h6">Login</Typography>
                <FormControl sx={{width:'200px'}}>
                    <InputLabel id="demo-simple-select-label">Select Role</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={role}
                        label="Select Role"
                        onChange={(e)=>{setRole(e.target.value)}}
                    >
                        <MenuItem value={""}>Select Role</MenuItem>
                        <MenuItem value={"STUDENT"}>STUDENT</MenuItem>
                        <MenuItem value={"SCHOOL"}>SCHOOL</MenuItem>
                        <MenuItem value={"TEACHER"}>TEACHER</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    name="email"
                    type="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    autoComplete="email"
                    required
                />

                <TextField
                    name="password"
                    type="password"
                    label="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    autoComplete="new-password"
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formik.isSubmitting}
                    sx={{ mt: 2, py: 1.5 }}
                >
                    {formik.isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Login'
                    )}
                </Button>
            </Box>
        </Box>
    );
}