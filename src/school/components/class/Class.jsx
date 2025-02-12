/* eslint-disable no-unused-vars */
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { classSchema } from "../../../yupSchema/classSchema";
import axios from "axios";
import { baseApi } from "../../../enviroment";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MessageSnackbar from "../../../../basic utility components/snackbar/MessageSnakbar";

const Class = () => {
    const [classes, setClasses] = useState([]);
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
            const response = await axios.get(`${baseApi}/class/all`);
            if (Array.isArray(response.data.data)) {
                setClasses(response.data.data);
                console.log(response.data.data)
            } else {
                setClasses([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setClasses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [message]);

    const formik = useFormik({
        initialValues: { class_text: "", class_num: "" },
        validationSchema: classSchema,
        onSubmit: async (values, { resetForm }) => {
            if (edit) {
                await axios.patch(`${baseApi}/class/update/${id}`, values).then(res => {
                    setMessage(res.data.message)
                    setMessageType("success")
                }).catch(err => {
                    console.log(err)
                    setMessage("Error in updating")
                    setMessageType("failed")
                })
            } else {
                try {
                    await axios.post(`${baseApi}/class/create`, values).then(res => {
                        setMessage(res.data.message)
                        setMessageType("success")
                    })
                } catch (err) {
                    console.error("Error in class creation:", err);
                    setMessage("Error in saving")
                    setMessageType("error")
                }
                resetForm();
            }
        }
    });
    const handleDelete = async (id) => {
        axios.delete(`${baseApi}/class/delete/${id}`).then(res => {
            setMessage(res.data.message)
            setMessageType("success")
        }).catch(e => {
            setMessage("Error in Delete")
            setMessageType("failded")
        })
    }
    const handleEdit = (id, class_text, class_num) => {
        setEdit(true);
        formik.setFieldValue("class_text", class_text)
        formik.setFieldValue("class_num", class_num)
        setId(id)
    }
    const cancelEdit = () => {
        setEdit(false)
        formik.setFieldValue("class_text", "")
        formik.setFieldValue("class_num", "")
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
                <Typography sx={{ fontSize: '40px', textAlign: 'center' }}>Class</Typography>

                <Box sx={{ height: '20rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {edit ? <Typography sx={{ fontSize: '30px', textAlign: 'center' }}>Edit Class</Typography> :
                        <Typography sx={{ fontSize: '30px', textAlign: 'center' }}>Add New Class</Typography>
                    }
                    <TextField
                        name="class_text"
                        label="Class Text"
                        value={formik.values.class_text}
                        sx={{width:'60rem'}}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.class_text && Boolean(formik.errors.class_text)}
                        helperText={formik.touched.class_text && formik.errors.class_text}
                        required
                    />
                    <TextField
                        name="class_num"
                        label="Class Number"
                        type="number"
                        sx={{width:'60rem',mt:2}}
                        value={formik.values.class_num}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.class_num && Boolean(formik.errors.class_num)}
                        helperText={formik.touched.class_num && formik.errors.class_num}
                        required
                    />
                    <Box sx={{display:'flex',flexDirection:'column'}} component={'div'}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={formik.isSubmitting}
                            sx={{width:'60rem', mt: 2, py: 1.5 }}
                        >
                            {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                        </Button>
                        {edit &&
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                onClick={cancelEdit}
                                sx={{ width:'60rem',mt: 2, py: 1.5}}
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
                    ) : classes.length > 0 ? (
                        classes.map((cls, index) => (
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
                                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1976d2' }}>Class</h2>
                                <p style={{ margin: '8px 0', fontSize: '1rem', color: '#757575' }}>
                                    [{cls.class_text}]: {cls.class_num}
                                </p>
                                <Box component={'div'}>
                                    <Button sx={{ color: 'red' }} onClick={() => handleDelete(cls._id)}><DeleteIcon /></Button>
                                    <Button onClick={() => handleEdit(cls._id, cls.class_text, cls.class_num)}><EditIcon /></Button>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Typography>No classes available</Typography>
                    )}
                </Box>
            </Box>
        </>
    );
};
export default Class;
