
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppCourse from './AppCourse';
import { BrowserRouter } from 'react-router-dom';
import AppMapSearch from './AppMapSearch';

import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
        {/* <AppCourse/> 
        <AppMapSearch/> */}
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

