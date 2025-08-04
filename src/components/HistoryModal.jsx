import { Modal, Box, Card, Button } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { getHistory } from "@/api/services/query";
import QuestionsReader from "./Home/Top50/Keyframes/QuestionsReader";
import { AppContext } from "@/context/AppContext";
import * as Blockly from 'blockly';

export default function HistoryModal({ loadHistory }) {
    // const [history, setHistory] = useState([]);
    const [open, setOpen] = useState(false);
    const { questionNumber, setQuestionNumber, questions, undoRef, redoRef, images, workspaceRef } = useContext(AppContext);

    function changeWorkSpace(e) {
        // save Workspace
        questions[questionNumber].workspace.images = images;
        questions[questionNumber].workspace.history.undoRef = undoRef.current;
        questions[questionNumber].workspace.history.redoRef = redoRef.current;
        questions[questionNumber].workspace.queries = Blockly.serialization.workspaces.save(workspaceRef.current);
        // change currentQuestion
        setQuestionNumber(e.target.value)
        setOpen(false);
    }


    // useEffect(() => {
    //     const fetchHistory = async () => {
    //         const data = await getHistory();
    //         setHistory(data);
    //     };
    //     fetchHistory();
    // }, []);

    useEffect(() => {
        const toggle = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', toggle);
        return () => window.removeEventListener('keydown', toggle);
    }, []);

    return (
        <div>
            <Modal
                open={open}
                onClose={() => { setOpen(false); }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="relative flex justify-center w-full mb-2 h-[80vh]">
                        <div className="absolute -top-12 -left-14 text-4xl">📜</div>
                        <div className="relative h-full w-full space-y-4 p-1 overflow-y-auto">
                            {questions.map((q, idx) => (
                                <Card key={idx} className="w-full p-4 cursor-pointer hover:!bg-gray-100 flex flex-row justify-between" onClick={changeWorkSpace}>
                                    <Box>
                                        <h3>Question {q.fileName}</h3>
                                        <p>Workspace: {q.workspace ? "✔️" : "❌"}</p>
                                        <p>Images: {q.workspace.images.length}</p>
                                    </Box>
                                    <Button onClick={(e) => {e.stopPropagation()} }> Delete </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <QuestionsReader />
                </Box>
            </Modal>
        </div>
    );
}


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "75vw",
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};


