import './App.css'
import { useCallback, useContext } from 'react'
import Home from '@/pages/Home'
import { searchKeyframes, syncHistory } from '@/api/services/query';
import * as Blockly from 'blockly';
import { AppContext } from './context/AppContext';

function App() {
  const { setImages, workspaceRef } = useContext(AppContext);

  const loadHistory = (data) => {
    const workspace = workspaceRef.current;
    if (workspace && data.workspace) {
      loadFormattedData(data.workspace, workspace);
    }
    setImages(data.images || []);
  };

  const sendQuery = useCallback(async (formattedQuery) => {
    const result = await searchKeyframes(formattedQuery);
    const savedWorkspace = Blockly.serialization.workspaces.save(workspaceRef.current);
    await syncHistory(savedWorkspace);
    setImages(result);
  }, [workspaceRef, setImages]);

  

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

export function loadFormattedData(data, workspace) {
  console.log(data)
  console.log(workspace)
  Blockly.serialization.workspaces.load(data, workspace);
}
