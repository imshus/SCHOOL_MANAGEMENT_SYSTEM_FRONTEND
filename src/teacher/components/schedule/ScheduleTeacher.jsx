import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { baseApi } from '../../../enviroment';



const localizer = momentLocalizer(moment);

const ScheduleTeacher = () => {
  const [selectedClasses, setSelectedClasses] = useState('');
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(()=>{
     axios.get(`${baseApi}/schedule/fetch-with-class/${selectedClasses}`).then(res=>{
      if(selectedClasses){
        const resData=res.data.data.map(x=>{
          return (
            {
              id:x._id,
              title:`Sub: ${x.subject.subject_name}`,
              start:new Date(x.startDate),
              end:new Date(x.endDate)
            }
          )
        })
        setEvents(resData)
      }
      else{
        alert("Create Period for this class")
      }
     }).catch((err)=>{
         console.log("Error",err)
     })
  },[selectedClasses])

  useEffect(() => {
    axios.get(`${baseApi}/class/all`)
      .then(res => setClasses(res.data.data))
      .catch(err => console.error("Error fetching classes:", err));
  }, []);

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
      <h1 className='text-3xl text-center'>Schedule</h1>

      <FormControl sx={{ display:'flex',marginBottom:'20px', width: '15rem',gap:'2',justifyContent:'left' }}>
        <InputLabel id="class-label">Classes</InputLabel>
        <Select
          labelId="class-label"
          id="class"
          value={selectedClasses}
          onChange={(e) => setSelectedClasses(e.target.value)}
          label="Class"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {classes.map(subj => (
            <MenuItem key={subj.id} value={subj._id}>
              {subj.class_text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Calendar
        localizer={localizer}
        defaultView="week"
        views={['week', 'day', 'agenda']}
        step={30}
        timeslots={4}
        startAccessor="start"
        endAccessor="end"
        events={events}
        defaultDate={new Date()}
        style={{ height: '100%', width:'100%', backgroundColor: '#f0f0f0', margin: '1rem auto' }}
      />
    </div>
  );
};
export default ScheduleTeacher;

