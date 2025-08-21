import './App.css'
import { useCallback, useContext } from 'react'
import Home from '@/pages/Home'
import { searchKeyframes } from '@/api/services/query';
import { useStore } from './stores/questions';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {

  const { updateQuestionField, currentQuestionId, questions } = useStore();


  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative w-screen h-screen">
        <Home
        />
      </div>
    </QueryClientProvider>
  );
}

export default App
