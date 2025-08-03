import './App.css'
import { useEffect, useState, useRef } from 'react'
import Home from '@/pages/Home'
import { searchKeyframes, syncHistory } from '@/api/services/query';
import * as Blockly from 'blockly';

function App() {
  const [images, setImages] = useState([]);
  const workspaceRef = useRef(null);
  const undoRef = useRef([]);
  const redoRef = useRef([]);

  const loadHistory = (data) => {
    const workspace = workspaceRef.current;
    if (workspace && data.workspace) {
      loadFormattedData(data.workspace, workspace);
    }
    setImages(data.images || []);
  };

  const sendQuery = async (formattedQuery) => {
    const result = await searchKeyframes(formattedQuery);
    const savedWorkspace = Blockly.serialization.workspaces.save(workspaceRef.current);
    await syncHistory(savedWorkspace);
    setImages(result);
  };

  

  return (
    <div className="relative w-screen h-screen">
          <Home
            sendData={sendQuery}
            images={images}
            workspaceRef={workspaceRef}
            loadHistory={loadHistory}
            undoRef={undoRef}
            redoRef={redoRef}
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
