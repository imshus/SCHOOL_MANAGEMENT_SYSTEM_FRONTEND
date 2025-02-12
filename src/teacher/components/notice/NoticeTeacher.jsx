import { Box, CircularProgress, Typography } from "@mui/material";

import axios from "axios";
import { baseApi } from "../../../enviroment";
import { useEffect, useState } from "react";

const NoticeTeacher = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseApi}/notice/teacher`);
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
  }, []);

  return (
    <>
      <Typography sx={{ fontSize: '40px', textAlign: 'center' }}>Notice</Typography>
      <Box sx={{ height: '20rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
              </Box>
            ))
          ) : (
            <Typography>No notices available</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default NoticeTeacher;

