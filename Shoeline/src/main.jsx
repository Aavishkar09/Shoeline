import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ShopContextProvider from './Context/ShopContext.jsx'
import { QueryProvider } from './providers/QueryProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryProvider>
    <ShopContextProvider>
      <App/>
    </ShopContextProvider>
  </QueryProvider>
)
