import './App.css'
import Top50 from './components/Top50'
import Queries from './components/Queries'
import { useState } from 'react'
import { searchKeyframes } from './api/services/query'
import { Fab } from '@mui/material'
import SplitPane from 'react-split-pane';
import * as Blockly from 'blockly';

function App() {
  const [images, setImages] = useState([])
  const [workspace, setWorkspace] = useState(null);

  const sendData = async (queries) => {
    // call api
    const data = await searchKeyframes(queries)
    setImages(data)
  }
  return (
    <div className="relative w-screen h-screen">
      <SplitPane
        split="vertical"
        defaultSize={400}
        onChange={() => {
          if (workspace) {
            setTimeout(() => {
              Blockly.svgResize(workspace); 
            }, 0);
          }
        }}

        paneStyle={{ overflow: 'hidden' }}
        resizerStyle={{
          background: '#e5e7eb',
          width: '4px',
          cursor: 'col-resize',
          borderLeft: '1px solid #d1d5db',
          borderRight: '1px solid #d1d5db'
        }}
      >
        <Queries sendData={sendData} workspace={workspace} setWorkspace={setWorkspace} />
        <Top50 images={images} />
      </SplitPane>

      <Fab
        color="primary"
        className="!absolute bottom-4 right-4 z-50"
        onClick={() => {
          const selectedElements = document.querySelectorAll("#selecto .image.selected");
          const selectedKeys = Array.from(selectedElements).map((el) => {
            const caption = el.querySelector("span")?.textContent;
            return caption;
          });

          console.log("Selected image keys:", selectedKeys);
        }}
      >
        ➜
      </Fab>
    </div>

  )
}

export default App
