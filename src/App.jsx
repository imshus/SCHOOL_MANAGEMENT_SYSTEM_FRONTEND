import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import School from './school/School'
import Student from './student/Student'
import Teacher from './teacher/Teacher'
import Client from './client/Client'

import Class from './school/components/class/Class'
import Dashboard from './school/components/dashboard/Dashboard'
import Examination from './school/components/examinations/Examination'
import Schedule from './school/components/schedule/Schedule'
import Subject from './school/components/subject/Subject'
import Notice from './school/components/notice/Notice'
import StudentSchool from './school/components/student/Student'
import TeacherSchool from './school/components/teacher/Teacher'

import Home from './client/components/home/Home'
import Login from './client/components/login/Login'
import Register from './client/components/register/Register'
import Logout from './client/components/logout/logout'

import TeacherDetail from './teacher/components/Teacher/TeacherDetails'
import AttendanceTeacher from './teacher/components/attendance/AttendanceTeacher'
import ExaminationsTeacher from './teacher/components/examinations/ExaminationsTeacher'
import NoticeTeacher from './teacher/components/notice/NoticeTeacher'
import ScheduleTeacher from './teacher/components/schedule/ScheduleTeacher'

import AttendanceStudent from './student/components/attendance/attendanceStudent'
import ExaminationStudent from './student/components/examinations/examinationStudent'
import NoticeStudent from './student/components/notice/noticeStudent'
import ScheduleStudent from './student/components/schedule/scheduleStudent'
import StudentDetail from './student/components/student details/StudentDetail'
import ProtectedRoute from '../guard/ProtectedRoute'
import { AuthProvider } from '../context/AuthContext'
import AttendenceStudentList from './school/components/attendance/Attendance'
import AttendanceDetails from './school/components/attendance/AttendanceDetails'


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/*School Route*/}
          <Route path='school' element={<ProtectedRoute allowedRoles={['SCHOOL']}><School/></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path='attendance/:id' element={<AttendanceDetails/>}/>
            <Route path='attendance' element={<AttendenceStudentList />} />
            <Route path='class' element={<Class />} />
            <Route path='examinations' element={<Examination />} />
            <Route path='schedule' element={<Schedule />} />
            <Route path='subject' element={<Subject />} />
            <Route path='student' element={<StudentSchool />} />
            <Route path='teacher' element={<TeacherSchool />} />
            <Route path='notice' element={<Notice />} />
          </Route>
          {/*Student*/}
          <Route path='/student' element={<ProtectedRoute allowedRoles={['STUDENT']}><Student /></ProtectedRoute>}>
            <Route index element={<StudentDetail />} />
            <Route path='attendance' element={<AttendanceStudent />} />
            <Route path='examinations' element={<ExaminationStudent />} />
            <Route path='notice' element={<NoticeStudent />} />
            <Route path='schedule' element={<ScheduleStudent />} />
          </Route>
          {/*Teacher*/}
          <Route path='/teacher' element={<ProtectedRoute allowedRoles={['TEACHER']}><Teacher /></ProtectedRoute>}>
            <Route index element={<TeacherDetail />} />
            <Route path='attendance' element={<AttendanceTeacher />} />
            <Route path='examinations' element={<ExaminationsTeacher />} />
            <Route path='notice' element={<NoticeTeacher />} />
            <Route path='schedule' element={<ScheduleTeacher />} />
          </Route>
          {/*Client*/}
          <Route path='/' element={<Client />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='logout' element={<Logout/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App

