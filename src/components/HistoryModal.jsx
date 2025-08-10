import { Modal, Box, Card, Button } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { getHistory } from "@/api/services/query";
import QuestionsReader from "./Home/Top50/Keyframes/QuestionsReader";
import { useStore } from "@/stores/questions";

export default function HistoryModal({ loadHistory }) {
    // const [history, setHistory] = useState([]);
    const [open, setOpen] = useState(false);
    // const { questions, setQuestions, questionNumber, setQuestionNumber, images, setImages, workspaceRef, undoRef, redoRef } = useContext(AppContext);
    const { questions, updateQuestionField, currentQuestionId, setCurrentQuestion, setQuestions } = useStore();

    function changeWorkSpace(key) {
        // change currentQuestion
        setCurrentQuestion(key);
        setOpen(false);
    }

    function handleDelete(e, key) {
        e.stopPropagation()
        if (key == currentQuestionId) {
            setCurrentQuestion("default");
        }
        const newQuestions = Object.assign({}, questions);
        // chac an thi dung structured clone nhma bo di gu gu ga ga
        delete newQuestions[key];

        setQuestions(newQuestions);
        // patch tạm thời, đống bug omg
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
                            {Object.entries(questions).map(([key, q]) => (
                                <Card key={key} className="w-full p-4 cursor-pointer hover:!bg-gray-100 flex flex-row justify-between" onClick={() => changeWorkSpace(key)}>
                                    <Box>
                                        <h3>Question {key}</h3>
                                        <p>Workspace: {q?.nodes && q?.edges ? "✔️" : "❌"}</p>
                                        <p>Images: {q?.images.length}</p>
                                    </Box>
                                    <Button onClick={(e) => { handleDelete(e, key) }} disabled={key === "default"}> Delete </Button>
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


