import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Admin from './Pages/Admin/Admin'
import Login from './Components/Login/Login'
import { getCookie } from './utils/cookies'
import { QueryProvider } from './providers/QueryProvider'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  React.useEffect(() => {
    const token = getCookie('auth-token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <QueryProvider>
      <div>
        {isLoggedIn ? (
          <>
            <Navbar setIsLoggedIn={setIsLoggedIn} />
            <Admin />
          </>
        ) : (
          <Login setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>
    </QueryProvider>
  )
}

export default App
