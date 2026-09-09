import './index.css'
import { Routes, Route,Navigate } from "react-router-dom"
import Navbar from './components/navbar'
import Homepage from './pages/HomePage'
import SignupPage from './pages/signupPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/settingsPage'
import ProfilePage from './pages/profilePage'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react"
import { useEffect } from 'react'
import { useThemeStore } from './store/useThemeStore'

function App() {
  const {authUser,authCheck,isCheckingAuth} = useAuthStore()
   const {theme}=useThemeStore()
  useEffect(() => {
   authCheck()
  }, [authCheck])

  console.log(authUser)
   if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
    
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser?<Homepage />:<Navigate to="/login"/>} />
        <Route path='/signup' element={!authUser?<SignupPage />:<Navigate to="/"/>} />
        <Route path='/login' element={!authUser?<LoginPage />:<Navigate to="/"/>} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser?<ProfilePage />:<Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App