import './App.css'
import { useState } from 'react'

function App() {
  const [cards, setCards] = useState([])
  return (
    <div className="app">
      <h1>Stock Predictor</h1>
    </div>
  )
}

export default App