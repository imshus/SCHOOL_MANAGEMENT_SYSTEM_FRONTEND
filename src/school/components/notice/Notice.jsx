/* eslint-disable no-unused-vars */
import { Box, Button, CircularProgress, FormHelperText, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { noticeSchema } from "../../../yupSchema/noticeSchema";
import axios from "axios";
import { baseApi } from "../../../enviroment";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MessageSnackbar from "../../../../basic utility components/snackbar/MessageSnakbar";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Notice = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);

    const [edit, setEdit] = useState(false);

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    const [id, setId] = useState("");

    const handleMessageClose = () => {
        setMessage('');
    };
    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseApi}/notice/all`);
            if (Array.isArray(response.data.data)) {
                setNotices(response.data.data);
            } else {
                setNotices([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setNotices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [message]);

    const formik = useFormik({
        initialValues: { title: "", message: "", audience: "" },
        validationSchema: noticeSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log(values)
            try {
                if (edit) {
                    await axios.patch(`${baseApi}/notice/update/${id}`, values);
                    setEdit(false); 
                    setId("");
                } else {
                    await axios.post(`${baseApi}/notice/create`, values);
                }
                setMessage(edit ? "Notice updated successfully" : "Notice created successfully");
                setMessageType("success");
                resetForm();
            } catch (err) {
                console.error("Error:", err);
                setMessage(edit ? "Error updating notice" : "Error creating notice");
                setMessageType("error");
            }
        }
    });
    const handleDelete = async (id) => {
        axios.delete(`${baseApi}/notice/delete/${id}`).then(res => {
            setMessage(res.data.message)
            setMessageType("success")
        }).catch(err => {
            console.log("Error", err)
            setMessage("Error in Delete")
            setMessageType("failded")
        })
    }

    const handleEdit = (id, title, audience, message) => {
        setEdit(true);
        formik.setFieldValue("title", title)
        formik.setFieldValue("audience", audience)
        formik.setFieldValue("message", message)
        setId(id)
    }
    const cancelEdit = () => {
        setEdit(false)
        formik.setFieldValue("title", "")
        formik.setFieldValue("audience", "")
        formik.setFieldValue("message", "")
    }
    return (
        <>
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
                    width: '62rem',
                    margin: 'auto',
                    gap: 3,
                    p: 2,
                }}
                onSubmit={formik.handleSubmit}
            >
                <Typography sx={{ fontSize: '40px', textAlign: 'center' }}>Notice</Typography>

                <Box sx={{ height: '20rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {edit ? <Typography sx={{ fontSize: '30px', textAlign: 'center' }}>Edit Notice</Typography> :
                        <Typography sx={{ fontSize: '30px', textAlign: 'center' }}>Add New Notice</Typography>
                    }
                    <TextField
                        name="title"
                        label="Title"
                        value={formik.values.title}
                        sx={{ width: '60rem' }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                        required
                    />
                    <TextField
                        name="message"
                        multiline
                        rows={4}
                        label="Message"
                        sx={{ width: '60rem', mt: 2 }}
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.message && Boolean(formik.errors.message)}
                        helperText={formik.touched.message && formik.errors.message}
                        required
                    />
                    <FormControl
                        fullWidth
                        error={formik.touched.audience && Boolean(formik.errors.audience)}
                        sx={{ mt: 2 }}
                    >
                        <InputLabel id="audience-select-label">Audience</InputLabel>
                        <Select
                            name="audience"
                            labelId="audience-select-label"
                            label="Audience"
                            value={formik.values.audience}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <MenuItem value=""><em>Select Audience</em></MenuItem>
                            <MenuItem value="Student">Student</MenuItem>
                            <MenuItem value="Teacher">Teacher</MenuItem>
                        </Select>
                        {formik.touched.audience && formik.errors.audience && (
                            <FormHelperText>{formik.errors.audience}</FormHelperText>
                        )}
                    </FormControl>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }} component="div">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={formik.isSubmitting}
                            sx={{ mt: 2, width: '60rem', py: 1.5 }}
                        >
                            {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                        </Button>
                        {edit && (
                            <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={cancelEdit}
                                sx={{ mt: 2, width: '60rem', py: 1.5 }}
                            >
                                {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Cancel"}
                            </Button>
                        )}
                    </Box>
                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 3,
                            p: 2,
                            backgroundColor: '#f5f5f5',
                            margin: 'auto'
                        }}
                    >
                        {loading ? (
                            <CircularProgress />
                        ) : notices.length > 0 ? (
                            notices.map((cls, index) => (
                                <Box
                                    key={cls._id || index}
                                    sx={{
                                        minWidth: 250,
                                        flex: '1 1 auto',
                                        p: 2,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 2,
                                        backgroundColor: 'white',
                                        boxShadow: 1,
                                    }}
                                >
                                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1976d2' }}>Notice</h2>
                                    <p style={{ margin: '8px 0', fontSize: '1rem', color: '#757575' }}>
                                        Title: {cls.title}
                                    </p>
                                    <p style={{ margin: '8px 0', fontSize: '1rem', color: '#757575' }}>
                                        Audience: {cls.audience}
                                    </p>
                                    <p style={{ margin: '8px 0', fontSize: '1rem', color: '#757575' }}>
                                        Message: {cls.message}
                                    </p>
                                    <Box component={'div'}>
                                        <Button sx={{ color: 'red' }} onClick={() => handleDelete(cls._id)}><DeleteIcon /></Button>
                                        <Button onClick={() => handleEdit(cls._id, cls.title, cls.audience, cls.message)}><EditIcon /></Button>
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            <Typography>No notices available</Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    );
};
export default Notice;

