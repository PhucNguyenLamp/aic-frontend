import Top50 from '@/components/Home/Top50/Top50'
import Queries from '@/components/Home/Queries/Queries';
import SplitPane from 'react-split-pane';
import { useState, useEffect, memo, useContext } from 'react';
import HistoryModal from '@/components/HistoryModal';
import { useStore } from '@/stores/questions';
import './resizer.css'

export default memo(function Home() {
    

    return (
        <>
            <SplitPane split="vertical" 
                defaultSize={parseInt(localStorage.getItem('splitVer'), 10) || 600}
                onChange={(size) => localStorage.setItem('splitVer', size)}

                paneStyle={{ overflow: "auto" }} 
                resizerStyle={{
                    background: '#e5e7eb', width: '4px', cursor: 'col-resize', borderLeft: '1px solid #d1d5db', borderRight: '1px solid #d1d5db'
                }}
                resizerClassName='custom-resizer custom-resizer-vertical'
            >
                <Queries />
                <Top50 />
            </SplitPane>

            <HistoryModal />

        </>
    )
});

