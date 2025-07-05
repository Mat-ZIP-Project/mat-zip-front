
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppCourse from './AppCourse';
import { BrowserRouter } from 'react-router-dom';
import AppMapSearch from './AppMapSearch';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
     <App />
    {/* <AppCourse/> 
    <AppMapSearch/> */}
  </BrowserRouter>
)
