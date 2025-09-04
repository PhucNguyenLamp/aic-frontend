import { Modal, Box, Card, Button } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { getHistory, getHistoryId } from "@/api/services/query";
import QuestionsReader from "./Home/Top50/Keyframes/QuestionsReader";
import { useStore } from "@/stores/questions";
import { RichTreeView, useTreeViewApiRef } from "@mui/x-tree-view";
import { useQuery } from "@tanstack/react-query";


export default function HistoryModal() {
    const { questions, updateQuestionField, currentQuestionId, setCurrentQuestion, setQuestions, toggleFetched, setSearchQuestions, setQueries } = useStore();
    const [open, setOpen] = useState(false);
    const apiRef = useTreeViewApiRef();

    const { data } = useQuery({
        queryKey: ['history'],
        queryFn: getHistory,
    })


    async function loadHistoryId(timeId) {
        let history = await getHistoryId(timeId);
        const { question_filename, timestamp, single_response, single_request, trake_request, trake_response } = history;
        console.log(trake_request)
        setCurrentQuestion(question_filename);
        
        let queries;
        if (single_request)
            queries = [{
                captionSearchText: single_request.caption.text,
                captionSearchRRF: single_request.caption.fusion === "rrf",
                captionSearchWeight: single_request.caption.weighted,
                captionSearchTagBoostAlpha: single_request.caption.tag_boost_alpha,

                captionSlider: 0, // chưa có 
                keyframeSlider: 0, // chưa có 
                OCRSlider: 0, // chưa có 

                keyframeSearchText: single_request.keyframe.text,
                keyframeSearchTagBoostAlpha: single_request.keyframe.tag_boost_alpha,
                OCRSearchText: single_request.ocr.text,

                userTags: single_request?.userTags || [],
            }];
        else
            queries = trake_request.events.map(event => {
                let query = event.query;
                return {
                    captionSearchText: query.req.caption.text,
                    captionSearchRRF: query.req.caption.fusion === "rrf",
                    captionSearchWeight: query.req.caption.weighted,
                    captionSearchTagBoostAlpha: query.req.caption.tag_boost_alpha,

                    captionSlider: 0, // chưa có 
                    keyframeSlider: 0, // chưa có 
                    OCRSlider: 0, // chưa có 

                    keyframeSearchText: query.req.keyframe.text,
                    keyframeSearchTagBoostAlpha: query.req.keyframe.tag_boost_alpha,
                    OCRSearchText: query.req.ocr.text,

                    userTags: query?.userTags || [],
                }
            })
        setQueries(queries)
        let response
        if (single_response)
            response = single_response.fused;
        else
            response = trake_response.paths;
        setSearchQuestions(response)
        toggleFetched();
        setOpen(false);
    }

    async function handleSelectedItemsChange(event, timeId) {
        const parentId = apiRef.current?.getParentId(timeId)
        if (!parentId) return;
        await loadHistoryId(timeId)
    }


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
                            <RichTreeView
                                items={data}
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


