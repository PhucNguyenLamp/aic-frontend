import './App.css'
import { useCallback, useContext } from 'react'
import Home from '@/pages/Home'
import { searchKeyframes, syncHistory } from '@/api/services/query';
import { useStore } from './stores/questions';

function App() {

  const { updateQuestionField, currentQuestionId, questions } = useStore();
  const loadHistory = (data) => {
    // const workspace = workspaceRef.current;
    // if (workspace && data.workspace) {
    //   loadFormattedData(data.workspace, workspace);
    // }
    // setImages(data.images || []);
  };

  const sendQuery = useCallback(async (query) => {
    const result = await searchKeyframes(query);
    updateQuestionField({ searchImages: result });
    
  }, []);



  return (
    <div className="relative w-screen h-screen">
      <Home
        sendData={sendQuery}
        loadHistory={loadHistory}
      />
    </div>
  );
}

export default App
