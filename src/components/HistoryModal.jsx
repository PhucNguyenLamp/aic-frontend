import { Modal, Box, Card, Button } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { getHistory, getHistoryId } from "@/api/services/query";
import QuestionsReader from "./Home/Top50/Keyframes/QuestionsReader";
import { useStore } from "@/stores/questions";
import { RichTreeView, useTreeViewApiRef } from "@mui/x-tree-view";
import { useQuery } from "@tanstack/react-query";


export default function HistoryModal() {
    const { questions, updateQuestionField, currentQuestionId, setCurrentQuestion, setQuestions, toggleFetched } = useStore();
    const [open, setOpen] = useState(false);
    const apiRef = useTreeViewApiRef();

    const { data } = useQuery({
        queryKey: ['history'],
        queryFn: getHistory,
    })

    async function loadHistoryId(id) {
        const history = await getHistoryId(id);
        const { questionName, timestamp, searchImages, edges, nodes } = history;
        setCurrentQuestion(questionName);
        updateQuestionField({
            questionName,
            timestamp,
            searchImages,
            edges,
            nodes,
        });
        toggleFetched();
    }

    async function handleSelectedItemsChange(event, itemId) {
        const parentId = apiRef.current?.getParentId(itemId)
        if (!parentId) return;
        await loadHistoryId(itemId)
    }

    // function handleDelete(e, key) {
    // }


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
                            <RichTreeView items={data}
                                apiRef={apiRef}
                                onSelectedItemsChange={handleSelectedItemsChange}
                            />
                        </div>
                    </div>
                    <QuestionsReader />
                </Box>
            </Modal>
        </div>
    );
}

const MUI_X_PRODUCTS = [
    {
        id: 'grid',
        label: 'Data Grid',
        children: [
            { id: 'grid-community', label: '@mui/x-data-grid' },
            { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
            { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
        ],
    },
    {
        id: 'pickers',
        label: 'Date and Time Pickers',
        children: [
            { id: 'pickers-community', label: '@mui/x-date-pickers' },
            { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
        ],
    },
    {
        id: 'charts',
        label: 'Charts',
        children: [
            { id: 'charts-community', label: '@mui/x-charts' },
            { id: 'charts-pro', label: '@mui/charts-pro' },
        ],
    },
    {
        id: 'tree-view',
        label: 'Tree View',
        children: [
            { id: 'tree-view-community', label: '@mui/x-tree-view' },
            { id: 'tree-view-pro', label: '@mui/x-tree-view-pro' },
        ],
    },
];


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


