import { useState, useEffect, useRef, useContext } from "react";
import { Box, Button, Card, Fab, FormControl, InputLabel, Menu, MenuItem, Select, Slider, Typography } from "@mui/material";
import { getImage, getImageKey, imagePath } from "@/utils/imagePath";
import clsx from "clsx";
import Selecto from "react-selecto";
import QuestionsReader from "./QuestionsReader";
import { useStore } from "@/stores/questions";
import { get } from "idb-keyval";
import { useStoreImages } from "@/stores/blobs";

export default function Keyframes({ handleOpen }) {
    // const [sortOption, setSortOption] = useState("d");
    const { getCurrentQuestion, setCurrentQuestion, updateQuestionField, questions, currentQuestionId, undo, redo, imagesSortOption: sortOption, setImagesSortOption: setSortOption } = useStore();
    const { blobs, setBlob } = useStoreImages();
    
    const currentQuestion = getCurrentQuestion();
    const images = currentQuestion.images;
    const undoArray = [...currentQuestion.undoArray];
    const redoArray = [...currentQuestion.redoArray];

    const ref = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const isFocusedInside = ref.current && (ref.current === document.activeElement || ref.current.contains(document.activeElement));
            if (!isFocusedInside) return;
            
            if (e.keyCode == 46 || e.keyCode == 8 || e.key.toLowerCase() == "d") {
                const selectedElements = document.querySelectorAll("#selecto .image.selected");
                if (!selectedElements.length) return;
                // delete selected elements by sorting them by key
                const selectedKeys = Array.from(selectedElements).map((el) => {
                    return el.getAttribute("data-key");
                });
                const newSortedImages = images.filter(image => !selectedKeys.includes(`${image.key}-${image.video_id}-${image.group_id}`));
                updateQuestionField({
                    'images': newSortedImages,
                });
            }

            // control + a, select all
            if (e.ctrlKey && e.key.toLowerCase() === "a") {
                e.preventDefault();
                console.log("IMAGES RAN")
                const allElements = document.querySelectorAll("#selecto .image.keyframes");
                // give all elements selected class
                allElements.forEach(el => {
                    el.classList.add("selected");
                });
                selectoRef.current.setSelectedTargets(Array.from(allElements));
            }

            if (e.ctrlKey && e.key.toLowerCase() === "z") {
                e.preventDefault();
                undo();
            }
            if (e.ctrlKey && e.key.toLowerCase() === "y") {
                e.preventDefault();
                redo();
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [images, undoArray, redoArray]);

    function changeWorkSpace(e) {
        // change currentQuestion
        setCurrentQuestion(e.target.value)
    }

    const selectoRef = useRef(null);
    const sortImages = (sortOption) => {
        const newSortedImages = [...images].sort((a, b) => {
            if (sortOption === "g") {
                return a.group_id - b.group_id || a.video_id - b.video_id || a.key - b.key;
            } else if (sortOption === "hc") {
                return b.confidence - a.confidence;
            } else
                return 0;
        });
        updateQuestionField({ 'images': newSortedImages });
    }

    return (
        <div className="relative flex flex-col elements w-full container images" >
            <Box className="sticky flex items-center h-fit">
                <Button className="h-[56px]"
                    disabled={undoArray.length === 0}
                    onClick={undo}>↩️</Button>
                <Button className="h-[56px]"
                    disabled={redoArray.length === 0}
                    onClick={redo}>↪️</Button>
                <Select
                    value={sortOption}
                    label="Sort By"
                    onChange={(e) => {
                        const sortOption = e.target.value;
                        sortImages(sortOption);
                        setSortOption(sortOption);
                    }}
                >
                    <MenuItem value="d">Default</MenuItem>
                    <MenuItem value="g">Group</MenuItem>
                    <MenuItem value="hc">High Confidence</MenuItem>
                </Select>
                <FormControl className="max-w-[130px]" fullWidth>
                    <Select
                        labelId="question-select-label"
                        value={currentQuestionId}
                        disabled={questions.length === 0}
                        onChange={e => {
                            changeWorkSpace(e)
                        }}
                    >
                        {
                            Object.keys(questions).map((q) => (
                                <MenuItem key={q} value={q}>
                                    {q}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <QuestionsReader />
            </Box>
            <div className="relative overflow-y-scroll flex-1 container " ref={ref} tabIndex={0}>
                <Selecto
                    ref={selectoRef}
                    dragContainer={".container"}
                    selectableTargets={["#selecto .image"]}
                    onSelect={e => {
                        e.added.forEach(el => {
                            el.classList.add("selected");
                        });
                        e.removed.forEach(el => {
                            el.classList.remove("selected");
                        });
                    }}
                    hitRate={0}
                    selectByClick={true}
                    selectFromInside={true}
                    continueSelect={false}
                    continueSelectWithoutDeselect={true}
                    toggleContinueSelect={"shift"}
                    toggleContinueSelectWithoutDeselect={[["ctrl"], ["meta"]]}
                    ratio={0}
                ></Selecto>
                <div className="grid grid-cols-5 p-4" id="selecto" >
                    {images?.map((image) => {
                        const src = getImage(blobs, getImageKey(image.key, image.video_id, image.group_id));
                        return (
                            <figure className="relative image p-2 hover:bg-[rgba(68,171,255,0.15)] [&_*]:select-none [&_*]:pointer-events-none keyframes"
                                key={`${image.key}-${image.video_id}-${image.group_id}`}
                                data-key={`${image.key}-${image.video_id}-${image.group_id}`}
                                onDoubleClick={() => handleOpen(image)}
                                data-container={"images"}
                            >
                                <img src={src}
                                // onError={(e) => {
                                //     e.target.src = ""
                                // }}
                                />
                                <figcaption className="flex flex-row justify-between ">
                                    <Typography variant="caption" className=" text-center text-black bg-opacity-50 p-1 rounded">
                                        L{image.group_id} / V{image.video_id} / {image.key}
                                    </Typography>
                                    <Typography className={clsx(image.confidence > 0.95 ? "text-blue-300" : image.confidence > 0.9 ? "text-yellow-500" : image.confidence > 0.8 ? "text-gray-400" : image.confidence > 0.7 ? "text-orange-900" : "")}>{image.confidence}</Typography>
                                </figcaption>
                            </figure>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

