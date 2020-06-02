import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useRoutes } from './routes'
import { useAuth } from './hooks'
import { AuthContext } from './context/authContext'
import './App.css'

function App() {
  const { token, login, logout, userId, ready } = useAuth()
  const isAuth = !!token
  const routes = useRoutes(isAuth)

  if (!ready) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, userId, isAuth }}>
      <BrowserRouter>
        <div className='App'>{routes}</div>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
