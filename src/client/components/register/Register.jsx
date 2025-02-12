import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { registerSchema } from '../../../yupSchema/registerSchema';
import { useRef, useState } from 'react';
import { Button, CardMedia, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import MessageSnackbar from '../../../../basic utility components/snackbar/MessageSnakbar';
import { baseApi } from '../../../enviroment';


export default function Register() {
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const fileInputRef = useRef(null);

    const initialValues = {
        school_name: "",
        email: "",
        school_image: "",
        owner_name: "",
        password: "",
        confirm_password: ""
    };

    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setImageUrl(URL.createObjectURL(selectedFile));
            setFile(selectedFile);
        }
    };

    const handleClearFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setFile(null);
        setImageUrl(null);
    };

    const formik = useFormik({
        initialValues,
        validationSchema: registerSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const formData = new FormData();
                formData.append("school_image", file);
                formData.append("school_name", values.school_name);
                formData.append("owner_name", values.owner_name);
                formData.append("email", values.email);
                formData.append("password", values.password);

                const response = await axios.post(
                    `${baseApi}/school/register`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                setMessage(response.data.message);
                setMessageType('success');
                formik.resetForm();
                handleClearFile();
            } catch (error) {
                console.error('Registration error:', error);
                setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
                setMessageType('error');
            } finally {
                setSubmitting(false);
            }
        }
    });

    const handleMessageClose = () => {
        setMessage('');
    };

    return (
        <Box component={'div'}
            sx={{
                background: "url(https://res.cloudinary.com/dvzy9mzeh/image/upload/v1738220467/school_images/register-image.jpg)",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                height: '100%'
            }}>
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
                <Typography variant="h6">School Registration</Typography>

                <Button
                    variant="contained"
                    component="label"
                    sx={{ width: 'fit-content' }}
                >
                    Upload School Logo
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                    />
                </Button>

                {imageUrl && (
                    <Box sx={{ maxWidth: 200 }}>
                        <CardMedia
                            component="img"
                            alt="School logo preview"
                            image={imageUrl}
                            sx={{ borderRadius: 1 }}
                        />
                    </Box>
                )}

                <TextField
                    name="owner_name"
                    label="Owner Name"
                    value={formik.values.owner_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.owner_name && Boolean(formik.errors.owner_name)}
                    helperText={formik.touched.owner_name && formik.errors.owner_name}
                    autoComplete="name"
                    required
                />

                <TextField
                    name="school_name"
                    label="School Name"
                    value={formik.values.school_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.school_name && Boolean(formik.errors.school_name)}
                    helperText={formik.touched.school_name && formik.errors.school_name}
                    autoComplete="organization"
                    required
                />

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

                <TextField
                    name="confirm_password"
                    type="password"
                    label="Confirm Password"
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
                    helperText={formik.touched.confirm_password && formik.errors.confirm_password}
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
                        'Register School'
                    )}
                </Button>
            </Box>
        </Box>
    );
}