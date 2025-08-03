import Top50 from '@/components/Home/Top50/Top50'
import Queries from '@/components/Home/Queries/Queries';
import { Fab } from '@mui/material'
import SplitPane from 'react-split-pane';
import * as Blockly from 'blockly';
import { useState, useEffect } from 'react';
import HistoryModal from '@/components/HistoryModal';

export default function Home({ sendData, images, workspaceRef, loadHistory, undoRef, redoRef }) {
    const [historyModalOpen, setHistoryModalOpen] = useState(false);

    return (
        <>
            <SplitPane split="vertical" defaultSize={400} onChange={() => {
                const ws = Blockly.getMainWorkspace();
                if (ws) setTimeout(() => Blockly.svgResize(ws), 100);
            }} paneStyle={{ overflow: "auto" }} resizerStyle={{
                background: '#e5e7eb', width: '4px', cursor: 'col-resize', borderLeft: '1px solid #d1d5db', borderRight: '1px solid #d1d5db'
            }}
            >
                <Queries sendData={sendData} workspaceRef={workspaceRef} undoRef={undoRef} redoRef={redoRef} />
                <Top50 images={images} undoRef={undoRef} redoRef={redoRef} />
            </SplitPane>

            <HistoryModal open={historyModalOpen} onClose={() => setHistoryModalOpen(false)} loadHistory={loadHistory} />


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
        </>
    )
}
