/* eslint-disable react-hooks/exhaustive-deps */
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { studentSchema } from '../../../yupSchema/studentSchema';
import { useEffect, useRef, useState } from 'react';
import { Button, CardMedia, Typography, CircularProgress, FormControl, MenuItem, InputLabel, Select, FormHelperText, Card, CardActionArea, CardContent } from '@mui/material';
import axios from 'axios';
import MessageSnackbar from '../../../../basic utility components/snackbar/MessageSnakbar';
import { baseApi } from '../../../enviroment';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

export default function StudentSchool() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const fileInputRef = useRef(null);
  const [classes, setClasses] = useState([]);
  const [student, setStudent] = useState([]);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState([]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseApi}/class/all`);
      if (Array.isArray(response.data.data)) {
        setClasses(response.data.data);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const [params, setParams] = useState({})

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined
    }))
  }

  const handleClass = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      student_class: e.target.value || undefined
    }))
  }


  const fetchStudent = async () => {
    await axios.get(`${baseApi}/student/fetch-Query`, { params }).then(res => {
      setStudent(Array.from(res.data.student))
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchClasses()
    fetchStudent()
  }, [message, params])


  const initialValues = {
    name: "",
    email: "",
    student_class: "",
    age: "",
    gender: "",
    guardian: "",
    guardian_phone: "",
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
    validationSchema: studentSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (edit) {
          const formData = new FormData();
          formData.append("student_image", file);
          formData.append("name", values.name);
          formData.append("student_class", values.student_class);
          formData.append("email", values.email);
          formData.append("age", values.age);
          formData.append("gender", values.gender);
          formData.append("guardian", values.guardian);
          formData.append("guardian_phone", values.guardian_phone);
          formData.append("password", values.password);

          const response = await axios.patch(
            `${baseApi}/student/update/${id}`,
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
          formData.append("student_image", file);
          formData.append("name", values.name);
          formData.append("student_class", values.student_class);
          formData.append("email", values.email);
          formData.append("age", values.age);
          formData.append("gender", values.gender);
          formData.append("guardian", values.guardian);
          formData.append("guardian_phone", values.guardian_phone);
          formData.append("password", values.password);

          const response = await axios.post(
            `${baseApi}/student/register`,
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
    axios.delete(`${baseApi}/student/delete/${id}`).then(res => {
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
    const filteredStudent = student.filter(x => x._id === id)

    formik.setFieldValue('email', filteredStudent[0].email)
    formik.setFieldValue('name', filteredStudent[0].name)
    formik.setFieldValue('student_class', filteredStudent[0].student_class)
    formik.setFieldValue('age', filteredStudent[0].age)
    formik.setFieldValue('gender', filteredStudent[0].gender)
    formik.setFieldValue('guardian', filteredStudent[0].guardian)
    formik.setFieldValue('guardian_phone', filteredStudent[0].guardian_phone)
    formik.setFieldValue('school_image', filteredStudent[0].school_image)
  }

  const clearEdit = () => {
    setEdit(false)

    formik.setFieldValue('email', "")
    formik.setFieldValue('name', "")
    formik.setFieldValue('student_class', "")
    formik.setFieldValue('age', "")
    formik.setFieldValue('gender', "")
    formik.setFieldValue('guardian', "")
    formik.setFieldValue('guardian_phone', "")
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
        {edit ? <Typography variant="h6">Edit Student</Typography> : <Typography variant="h6">Student Registration</Typography>}


        <Button
          variant="contained"
          component="label"
          sx={{ width: 'fit-content' }}
        >
          Upload Student Photo
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
              alt="Student logo preview"
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
          name="guardian"
          label="Guardian"
          value={formik.values.guardian}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.guardian && Boolean(formik.errors.guardian)}
          helperText={formik.touched.guardian && formik.errors.guardian}
          autoComplete="guardian"
          required
        />

        <TextField
          name="guardian_phone"
          label="Guardian Phone"
          value={formik.values.guardian_phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.guardian_phone && Boolean(formik.errors.guardian_phone)}
          helperText={formik.touched.guardian_phone && formik.errors.guardian_phone}
          autoComplete="guardian_phone"
          required
        />


        <FormControl
          fullWidth
          error={Boolean(formik.touched.student_class && formik.errors.student_class)} // Show error when needed
        >
          <InputLabel id="student-class-label">Student Class</InputLabel>
          <Select
            labelId="student-class-label"
            id="student_class"
            name="student_class"
            value={formik.values.student_class}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} // Ensures Formik validates on blur
            label="Student Class"
          >
            <MenuItem value="">{""}</MenuItem>
            {Array.isArray(classes) && classes.map((cls) => (
              <MenuItem key={cls.id || cls.class_text} value={cls.class_text}>
                {cls.class_text} [{cls.class_num}]
              </MenuItem>
            ))}
          </Select>
          {formik.touched.student_class && formik.errors.student_class && (
            <FormHelperText>{formik.errors.student_class}</FormHelperText>
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
            'Register Student'
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
        <FormControl sx={{ width: '180px', marginLeft: '5px' }}>
          <InputLabel id="select">Student Class</InputLabel>
          <Select
            labelId='select'
            onChange={(e) => {
              handleClass(e)
            }}
            label="Student Class"
          >
            <MenuItem value="">{'Clean'}</MenuItem>
            {Array.isArray(classes) && classes.map((cls) => (
              <MenuItem key={cls.id || cls.class_text} value={cls.class_text}>
                {cls.class_text} [{cls.class_num}]
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        {student && student.map((student) => (
          <Card
            key={student._id}
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
                image={student.student_image}
                alt={student.name}
                sx={{ objectFit: 'cover', width:'20rem' ,height:'15rem'}}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {student.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Class: {student.student_class}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Age: {student.age}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gender: {student.gender}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {student.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Guardian Phone: {student.guardian_phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Guardian: {student.guardian}
                </Typography>
              </CardContent>
              <Button sx={{color:'red'}} onClick={() => handleDelete(student._id)}><DeleteOutlineIcon /></Button>
              <Button onClick={() => handleEdit(student._id)}><EditIcon /></Button>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}