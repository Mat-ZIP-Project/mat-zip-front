
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppCourse from './AppCourse';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>                                    {/* ✨ Redux Provider */}
    <PersistGate loading={null} persistor={persistor}>        {/* ✨ PersistGate */}
      <BrowserRouter>                                        {/* ✨ Router */}
        <App />
        {/* <AppCourse/> */}
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
