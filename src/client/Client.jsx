import { Outlet } from "react-router-dom"
import Navbar from "./utility components/navbar/Navbar"
import "../App.css"
import Footer from "./utility components/footer/Footer"
import { Box } from "@mui/material"

const Client = () => {
  return (

    <Box sx={{
      background: "url(https://res.cloudinary.com/dvzy9mzeh/image/upload/v1738220467/school_images/register-image.jpg)",
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      height: '100%'
    }}>
      <Navbar />
      <Box sx={{ minHeight: '77vh' }} component={'div'}>
        <Outlet />
      </Box>
      <Footer />
    </Box>

  )
}
export default Client
