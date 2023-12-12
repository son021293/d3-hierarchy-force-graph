// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

//Remove strict mode to prevent dev render 2 times
ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>,
)
