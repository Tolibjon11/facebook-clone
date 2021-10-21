import React from 'react'
import './App.css';
import Header from './components/Header/Index'
import Sidebar from './components/Sidebar/Index'
import Feed from './components/Feed/Index'
import Widgets from './components/WidgetsComponent/Index'
import Login from './components/Login/Index'
import { useStateValue } from './StateProvider';
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [{ user }, dispatch] = useStateValue();
  return (
    <div className="App">
      {!user ? (<Login />):(
        <>
          <Header />
          <ToastContainer />
          <Sidebar />
          <div className='app-body'>
            {/* <div> */}
              
            {/* </div> */}
            {/* <div> */}
              <Feed />
              <Widgets />
            {/* </div>   */}
          </div>
        </>
      )}
      

    </div>
  );
}

export default App;
