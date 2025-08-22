import Top50 from '@/components/Home/Top50/Top50'
import Queries from '@/components/Home/Queries/Queries';
import { Fab } from '@mui/material'
import SplitPane from 'react-split-pane';
import { useState, useEffect, memo, useContext } from 'react';
import HistoryModal from '@/components/HistoryModal';
import { useStore } from '@/stores/questions';
import './resizer.css'

export default memo(function Home() {
    const { getCurrentQuestion } = useStore();
    const exportQuestions = (e) => {
        const currentQuestion = getCurrentQuestion();
        console.log(currentQuestion)
        // data.map((item) => {
        const blob = new Blob([JSON.stringify(currentQuestion, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentQuestion.questionName}.json`;
        a.click();
        URL.revokeObjectURL(url);
        // })
    }

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



// sửa lại images không cần group, cần sắp xếp tay 😁😀😶🤩🥰😲🐱‍👓🐱‍🐉👾

// searchimages cần không được sắp xếp, sortGroup theo thứ tự 😁😀😶🤩🥰😲🐱‍👓🐱‍🐉👾

// querybuilder sửa lại không cần tag 😁😀😶🤩🥰😲🐱‍👓🐱‍🐉👾

// sửa ctrl a hư 😁😀😶🤩🥰😲🐱‍👓🐱‍🐉👾

// sửa scroll images hư 😁😀😶🤩🥰😲🐱‍👓🐱‍🐉👾

// sửa autozoom 😁😀😶🤩🥰😲🐱‍👓🐱‍🐉👾

// sửa lại sort là group để trong global -> sửa undo 😁😀😶🤩🥰😲🐱‍👓🐱‍🐉👾


// sửa xuất 

// sửa lại api model 

// thêm serve ảnh test

// QOL: sao lưu luôn sort state vào undo
