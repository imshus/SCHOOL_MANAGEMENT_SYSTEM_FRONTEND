/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box, Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { periodSchema } from "../../../yupSchema/periodSchema";
import { baseApi } from "../../../enviroment";
import axios from "axios";
import dayjs from 'dayjs'

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MessageSnackbar from "../../../../basic utility components/snackbar/MessageSnakbar";

const ScheduleEvent = ({ selectedClasses, edit, selectedEventId }) => {

  const period = [
    {
      id: 1,
      title: "Period 1 (10:00 AM - 11:00 AM)",
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      id: 2,
      title: "Period 2 (11:00 AM - 12:00 PM)",
      startTime: "11:00",
      endTime: "12:00",
    },
    {
      id: 3,
      title: "Period 3 (12:00 PM - 1:00 PM)",
      startTime: "12:00",
      endTime: "13:00",
    },
    {
      id: 4,
      title: "Lunch Break (1:00 PM - 2:00 PM)",
      startTime: "13:00",
      endTime: "14:00",
    },
    {
      id: 5,
      title: "Period 4 (2:00 PM - 3:00 PM)",
      startTime: "14:00",
      endTime: "15:00",
    },
    {
      id: 6,
      title: "Period 5 (3:00 PM - 4:00 PM)",
      startTime: "15:00",
      endTime: "16:00",
    }
  ];

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const handleMessageClose = () => {
    setMessage("")
  }

  const fetchData = async () => {
    try {
      const teacherResponse = await axios.get(`${baseApi}/teacher/fetch-Query`, { params: {} });
      const subjectResponse = await axios.get(`${baseApi}/subject/all`);
      setTeachers(teacherResponse.data.teacher);
      setSubjects(subjectResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [message]);

  const initialValues = {
    teacher: "",
    subject: "",
    period: "",
    date: new Date(),
  };

  const formik = useFormik({
    initialValues,
    validationSchema: periodSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const baseDate = new Date(values.date);
      const [startTimeStr, endTimeStr] = values.period.split(',');
      const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
      const [endHours, endMinutes] = endTimeStr.split(':').map(Number);
      const startTime = new Date(baseDate);
      startTime.setHours(startHours, startMinutes, 0, 0);
      const endTime = new Date(baseDate);
      endTime.setHours(endHours, endMinutes, 0, 0);
      const payload = {
        date: baseDate,
        teacher: values.teacher,
        subject: values.subject,
        class: selectedClasses,
        startDate: startTime.toISOString(),
        endDate: endTime.toISOString(),
      };
      try {
        if (edit) {
          const response = await axios.patch(`${baseApi}/schedule/update/${selectedEventId}`, payload);
          setMessage(response.data.message)
          setMessageType("success")
          resetForm();
        }else{
          const response = await axios.post(`${baseApi}/schedule/create`, payload);
          setMessage(response.data.message)
          setMessageType("success")
          resetForm();
        }
      } catch (error) {
        console.error("Submission error:", error.response?.data || error.message);
        setMessage("failded to create/update")
        setMessageType("failded")
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (selectedEventId) {
      axios.get(`${baseApi}/schedule/fetch/${selectedEventId}`).then((res) => {
        formik.setFieldValue("teacher", `${res.data.data[0].teacher.name}`)
        formik.setFieldValue("subject", `${res.data.data[0].subject.subject_name}`)
        let start = new Date(res.data.data[0].startDate)
        let end = new Date(res.data.data[0].endDate)
        formik.setFieldValue("date", start)
        formik.setFieldValue("period", `${start.getHours()}:${(end.getMinutes() < 10 ? '0' : '') + end.getMinutes()},${end.getHours()}:${(start.getMinutes() < 10 ? '0' : '') + start.getMinutes()}`)
      }).catch((err) => {
        console.log("Error", err)
      })
    }
  }, [selectedEventId])

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "60vw",
        minWidth: "230px",
        margin: "auto",
        gap: 2,
        p: 2,
      }}
      onSubmit={formik.handleSubmit}
    >
      <MessageSnackbar
        message={typeof message === "string" ? message : JSON.stringify(message)}
        type={messageType}
        handleClose={handleMessageClose}
      />
      {edit ? <Typography varient="h4" sx={{ fontSize: '25px', textAlign: 'center' }}>
        Edit Period
      </Typography> :
        <Typography varient="h4" sx={{ fontSize: '25px', textAlign: 'center' }}>
          Add New Period
        </Typography>}

      <FormControl fullWidth>
        <InputLabel id="teacher-label">Teacher</InputLabel>
        <Select
          labelId="teacher-label"
          id="teacher"
          name="teacher"
          value={formik.values.teacher}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Teacher"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Array.isArray(teachers) &&
            teachers.map((teacher) => (
              <MenuItem key={teacher._id} value={teacher._id}>
                {teacher.name}
              </MenuItem>
            ))}
        </Select>
        {formik.touched.teacher && formik.errors.teacher && (
          <FormHelperText>{formik.errors.teacher}</FormHelperText>
        )}
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="subject-label">Subject</InputLabel>
        <Select
          labelId="subject-label"
          id="subject"
          name="subject"
          value={formik.values.subject}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Subject"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Array.isArray(subjects) &&
            subjects.map((subj) => (
              <MenuItem key={subj.id} value={subj._id}>
                {subj.subject_name}
              </MenuItem>
            ))}
        </Select>
        {formik.touched.subject && formik.errors.subject && (
          <FormHelperText>{formik.errors.subject}</FormHelperText>
        )}
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="period-label">Period</InputLabel>
        <Select
          labelId="period-label"
          id="period"
          name="period"
          value={formik.values.period}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Period"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Array.isArray(period) &&
            period.map((p) => (
              <MenuItem key={p.id} value={`${p.startTime},${p.endTime}`}>
                {p.title}
              </MenuItem>
            ))}
        </Select>
        {formik.touched.period && formik.errors.period && (
          <FormHelperText>{formik.errors.period}</FormHelperText>
        )}
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="Select Date"
            value={dayjs(formik.values.date)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </DemoContainer>
      </LocalizationProvider>
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
          'Submit'
        )}
      </Button>
    </Box>
  );
};

export default ScheduleEvent;