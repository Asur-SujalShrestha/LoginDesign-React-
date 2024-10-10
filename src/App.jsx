import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './Components/LoginPage';
import Register from './Components/Register';
import { Toaster } from 'react-hot-toast';
import Message from './Components/Message/message';
import VideoChat from './Components/VideoChat/VideoChat';


function App() {
      // var global = window;

  return (
    <>
  
    {/* {global}; */}
    {/* <LoginPage/> */}
    <Toaster />

    <Router>
      <Routes>
        <Route path='' element={<VideoChat/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register/>} />
        <Route path='/chat' element={<Message/>}/>
        <Route path='/video' element={<VideoChat/>}/>    
      </Routes>
    </Router>
    </>

    
  )
}

export default App
