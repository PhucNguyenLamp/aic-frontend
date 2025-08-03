import { Modal, Box, Card, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { getHistory } from "@/api/services/query";
import QuestionsReader from "./Home/Top50/Keyframes/QuestionsReader";

export default function HistoryModal({ loadHistory }) {
    const [history, setHistory] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            const data = await getHistory();
            setHistory(data);
        };
        fetchHistory();
    }, []);

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
                    <div className="relative flex justify-center w-full h-[80vh]">
                        <div className="absolute -top-12 -left-12 text-4xl">📜</div>

                        <div className="w-full flex flex-col gap-4 scroll-auto">
                            {history.map((item, idx) => (
                                <Card key={idx} className="w-full p-4 cursor-pointer hover:!bg-gray-100 flex flex-row justify-between" onClick={() => { setOpen(false); loadHistory(item) }}>
                                    <Box>
                                        <h3>Question {idx + 1}</h3>
                                        <p>Workspace: {item.workspace ? "✔️" : "❌"}</p>
                                        <p>Images: {item.images.length}</p>
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


