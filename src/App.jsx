import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './Components/LoginPage';
import Register from './Components/Register';
import { Toaster } from 'react-hot-toast';
import Message from './Components/Message/message';

function App() {
      // var global = window;

  return (
    <>
  
    {/* {global}; */}
    {/* <LoginPage/> */}
    <Toaster />

    <Router>
      <Routes>
        <Route path='' element={<LoginPage/>}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register/>} />
        <Route path='/chat' element={<Message/>}/>
      </Routes>
    </Router>
    </>

    
  )
}

export default App
