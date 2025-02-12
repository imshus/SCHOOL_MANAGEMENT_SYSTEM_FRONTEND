/* eslint-disable no-unused-vars */
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { baseApi } from "../../../enviroment";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MessageSnackbar from "../../../../basic utility components/snackbar/MessageSnakbar";
import { subjectSchema } from "../../../yupSchema/subjectSchema";

const Subject = () => {
    const [subject, setSubject] = useState([]);
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
            const response = await axios.get(`${baseApi}/subject/all`);
            if (Array.isArray(response.data.data)) {
                setSubject(response.data.data);
                console.log(response.data.data)
            } else {
                setSubject([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setSubject([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [message]);

    const formik = useFormik({
        initialValues: { subject_name: "", subject_codename: "" },
        validationSchema: subjectSchema,
        onSubmit: async (values, { resetForm }) => {
            if (edit) {
                await axios.patch(`${baseApi}/subject/update/${id}`, values).then(res => {
                    setMessage(res.data.message)
                    setMessageType("success")
                }).catch(err => {
                    console.log(err)
                    setMessage("Error in updating")
                    setMessageType("failed")
                })
            } else {
                try {
                    await axios.post(`${baseApi}/subject/create`, values).then(res => {
                        setMessage(res.data.message)
                        setMessageType("success")
                    })
                } catch (err) {
                    console.error("Error in Subject creation:", err);
                    setMessage("Error in saving")
                    setMessageType("error")
                }
                resetForm();
            }
        }
    });
    const handleDelete = async (id) => {
        axios.delete(`${baseApi}/Subject/delete/${id}`).then(res => {
            setMessage(res.data.message)
            setMessageType("success")
        }).catch(e => {
            setMessage("Error in Delete")
            setMessageType("failded")
        })
    }
    const handleEdit = (id, subject_name, subject_codename) => {
        setEdit(true);
        formik.setFieldValue("subject_name", subject_name)
        formik.setFieldValue("subject_codename", subject_codename)
        setId(id)
    }
    const cancelEdit = () => {
        setEdit(false)
        formik.setFieldValue("subject_name", "")
        formik.setFieldValue("subject_codename", "")
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
                <Typography sx={{ fontSize: '40px', textAlign: 'center' }}>Subject</Typography>

                <Box sx={{ height: '20rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {edit ? <Typography sx={{ fontSize: '30px', textAlign: 'center' }}>Edit Subject</Typography> :
                        <Typography sx={{ fontSize: '30px', textAlign: 'center' }}>Add New Subject</Typography>
                    }
                    <TextField
                        name="subject_name"
                        label="Subject Text"
                        value={formik.values.subject_name}
                        sx={{ width: '60rem' }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.subject_name && Boolean(formik.errors.subject_name)}
                        helperText={formik.touched.subject_name && formik.errors.subject_name}
                        required
                    />
                    <TextField
                        name="subject_codename"
                        label="Subject Codename"
                        sx={{ width: '60rem', mt: 2 }}
                        value={formik.values.subject_codename}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.subject_codename && Boolean(formik.errors.subject_codename)}
                        helperText={formik.touched.subject_codename && formik.errors.subject_codename}
                        required
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }} component={'div'}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={formik.isSubmitting}
                            sx={{ width: '60rem', mt: 2, py: 1.5 }}
                        >
                            {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                        </Button>
                        {edit &&
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                onClick={cancelEdit}
                                sx={{ width: '60rem', mt: 2, py: 1.5 }}
                            >
                                {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Cancel"}
                            </Button>
                        }
                    </Box>
                </Box>
                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: 3,
                        p: 2,
                        backgroundColor: '#f5f5f5'
                    }}
                >
                    {loading ? (
                        <CircularProgress />
                    ) : subject.length > 0 ? (
                        subject.map((cls, index) => (
                            <Box
                                key={cls.id || index}
                                sx={{
                                    minWidth: 250,
                                    flex: '1 1 auto',
                                    p: 2,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                    boxShadow: 1,
                                    transition: '0.3s',
                                    '&:hover': { boxShadow: 3 }
                                }}
                            >
                                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1976d2' }}>Subject</h2>
                                <p style={{ margin: '8px 0', fontSize: '1rem', color: '#757575' }}>
                                    [{cls.subject_name}]: {cls.subject_codename}
                                </p>
                                <Box component={'div'}>
                                    <Button sx={{ color: 'red' }} onClick={() => handleDelete(cls._id)}><DeleteIcon /></Button>
                                    <Button onClick={() => handleEdit(cls._id, cls.subject_name, cls.subject_codename)}><EditIcon /></Button>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Typography>No subject available</Typography>
                    )}
                </Box>
            </Box>
        </>
    );
};
export default Subject;


