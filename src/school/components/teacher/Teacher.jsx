
/* eslint-disable react-hooks/exhaustive-deps */
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { teacherSchema } from '../../../yupSchema/teacherSchema';
import { useEffect, useRef, useState } from 'react';
import { Button, CardMedia, Typography, CircularProgress, FormControl, MenuItem, InputLabel, Select, FormHelperText, Card, CardActionArea, CardContent } from '@mui/material';
import axios from 'axios';
import MessageSnackbar from '../../../../basic utility components/snackbar/MessageSnakbar';
import { baseApi } from '../../../enviroment';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

export default function TeacherSchool() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const fileInputRef = useRef(null);
  const [teacher, setTeacher] = useState([]);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState([]);

  const [params, setParams] = useState({})

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined
    }))
  }

  const fetchTeacher = async () => {
    await axios.get(`${baseApi}/teacher/fetch-Query`, { params }).then(res => {
      console.log(res)
      setTeacher(Array.from(res.data.teacher))
    }).catch(err => {
      console.log(err)
    })
  }


  useEffect(() => {
    fetchTeacher()
  }, [message, params])


  const initialValues = {
    name: "",
    email: "",
    age: "",
    gender: "",
    qualification: "",
    school_image: "",
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
      fileInputRef.current.focus();
    }
    setFile(null);
    setImageUrl(null);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: teacherSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (edit) {
          const formData = new FormData();
          formData.append("teacher_image", file);
          formData.append("name", values.name);
          formData.append("qualification", values.qualification);
          formData.append("email", values.email);
          formData.append("age", values.age);
          formData.append("gender", values.gender);
          formData.append("password", values.password);

          const response = await axios.patch(
            `${baseApi}/teacher/update/${id}`,
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
        }
        else {
          const formData = new FormData();
          formData.append("teacher_image", file);
          formData.append("name", values.name);
          formData.append("qualification", values.qualification);
          formData.append("email", values.email);
          formData.append("age", values.age);
          formData.append("gender", values.gender);
          formData.append("password", values.password);

          const response = await axios.post(
            `${baseApi}/teacher/register`,
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
        }
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

  const handleDelete = async (id) => {
    axios.delete(`${baseApi}/teacher/delete/${id}`).then(res => {
      setMessage(res.data.message)
      setMessageType("success")
    }).catch(err => {
      setMessage(err)
      setMessageType("failded")
    })
  }

  const handleEdit = (id) => {
    setId(id)
    setEdit(true)
    const filteredStudent = teacher.filter(x => x._id === id)

    formik.setFieldValue('email', filteredStudent[0].email)
    formik.setFieldValue('name', filteredStudent[0].name)
    formik.setFieldValue('qualification', filteredStudent[0].qualification)
    formik.setFieldValue('age', filteredStudent[0].age)
    formik.setFieldValue('gender', filteredStudent[0].gender)
    formik.setFieldValue('school_image', filteredStudent[0].school_image)
  }

  const clearEdit = () => {
    setEdit(false)

    formik.setFieldValue('email', "")
    formik.setFieldValue('name', "")
    formik.setFieldValue('qualification', "")
    formik.setFieldValue('age', "")
    formik.setFieldValue('gender', "")
    formik.setFieldValue('school_image', "")
  }

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
        {edit ? <Typography variant="h6">Edit Student</Typography> : <Typography variant="h6">Teacher Registration</Typography>}


        <Button
          variant="contained"
          component="label"
          sx={{ width: 'fit-content' }}
        >
          Upload Teacher Photo
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
              alt="Teacher logo preview"
              image={imageUrl}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        )}

        <TextField
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          autoComplete="name"
          required
        />

        <TextField
          name="qualification"
          label="Qualification"
          value={formik.values.qualification}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.qualification && Boolean(formik.errors.qualification)}
          helperText={formik.touched.qualification && formik.errors.qualification}
          autoComplete="qualification"
          required
        />

        <TextField
          name="age"
          label="Age"
          value={formik.values.age}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.age && Boolean(formik.errors.age)}
          helperText={formik.touched.age && formik.errors.age}
          autoComplete="age"
          required
        />

        <FormControl fullWidth error={formik.touched.gender && Boolean(formik.errors.gender)}>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Gender"
            autoComplete="gender"
            required
          >
            <MenuItem value="">{""}</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          {formik.errors.gender && formik.touched.gender && (
            <FormHelperText>{formik.errors.gender}</FormHelperText>
          )}
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
        {edit ?
          <>
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
                'Edit Register'
              )}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting}
              sx={{ mt: 2, py: 1.5 }}
              onClick={() => clearEdit()}
            >
              {formik.isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Close'
              )}
            </Button>
          </>
          :
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
              'Register Teacher'
            )}
          </Button>
        }
      </Box>
      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <TextField
          label="Search"
          onChange={(e) => { handleSearch(e) }}
          value={params.search || ''}
        />
      </Box>
      <Box
        component="div"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          padding: '2rem',
          width: '100%'
        }}
      >
        {teacher && teacher.map((teacher) => (
          <Card
            key={teacher._id}
            sx={{
              width: 300,
              minWidth: 280,
              m: 2,
              boxShadow: 3,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.03)'
              }
            }}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                height="200"
                image={teacher.teacher_image}
                alt={teacher.name}
                sx={{ objectFit: 'cover', width: '20rem', height: '15rem' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {teacher.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Qualification: {teacher.qualification}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Age: {teacher.age}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gender: {teacher.gender}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {teacher.email}
                </Typography>
              </CardContent>
              <Button sx={{ color: 'red' }} onClick={() => handleDelete(teacher._id)}><DeleteOutlineIcon /></Button>
              <Button onClick={() => handleEdit(teacher._id)}><EditIcon /></Button>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}