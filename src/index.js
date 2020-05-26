// This file has to exist outside of the rest of frontend/ becuase of create-react-app specifications
// it has to be at the root of the src/ file
import React from 'react';
import ReactDOM from 'react-dom';
import './frontend/index.css';
import App from './frontend/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

