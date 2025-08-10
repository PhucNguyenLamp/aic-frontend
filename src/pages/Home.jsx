import Top50 from '@/components/Home/Top50/Top50'
import Queries from '@/components/Home/Queries/Queries';
import { Fab } from '@mui/material'
import SplitPane from 'react-split-pane';
import { useState, useEffect, memo, useContext } from 'react';
import HistoryModal from '@/components/HistoryModal';
import { useStore } from '@/stores/questions';

export default memo(function Home({ sendData, loadHistory }) {
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const { questions } = useStore();
    const exportQuestions = () => {

        const data = Object.entries(questions).map(([key, q]) => ({
            fileName: key,
            images: q.images,
        }));
        // split into to data.length parts
        data.map((item) => {
            const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${item.fileName}.json`;
            a.click();
            URL.revokeObjectURL(url);
        })
    }

    return (
        <>
            <SplitPane split="vertical" defaultSize={700}
                paneStyle={{ overflow: "auto" }} resizerStyle={{
                    background: '#e5e7eb', width: '4px', cursor: 'col-resize', borderLeft: '1px solid #d1d5db', borderRight: '1px solid #d1d5db'
                }}
            >
                <Queries sendData={sendData} />
                <Top50 />
            </SplitPane>

            <HistoryModal open={historyModalOpen} onClose={() => setHistoryModalOpen(false)} loadHistory={loadHistory} />


            <Fab
                color="primary"
                className="!absolute bottom-4 right-4 z-50"
                onClick={exportQuestions}
            >
                ➜
            </Fab>
        </>
    )
});
