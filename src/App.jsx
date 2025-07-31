import './App.css'
import { useEffect, useState } from 'react'
import History from './pages/History'
import Home from './pages/Home'

function App() {
  const [historyPage, setHistoryPage] = useState(false);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setHistoryPage(!historyPage);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [historyPage]);

  return (
    <div className="relative w-screen h-screen ">
      {
        historyPage
          ? <History history={history} setHistory={setHistory} />
          : <Home />
      }
    </div>
  )
}

export default App
