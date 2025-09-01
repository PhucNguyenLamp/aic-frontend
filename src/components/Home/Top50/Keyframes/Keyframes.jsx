import { useState, useEffect, useRef, useContext } from "react";
import { Box, Button, Card, Fab, FormControl, Input, InputLabel, Menu, MenuItem, Paper, Select, Slider, TextField, Typography } from "@mui/material";
import { getChainImagesKey, getImage, getImageKey, getImageKey_, imagePath } from "@/utils/imagePath";
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


    const [answer, setAnswer] = useState("");

    const currentQuestion = getCurrentQuestion();
    const images = currentQuestion.images;

    const imagesMode = images.length == 0 ? "both" : images[0]?.items ? "multiple" : "single";

    const undoArray = [...currentQuestion.undoArray];
    const redoArray = [...currentQuestion.redoArray];


    const ref = useRef(null);

    let getKey = getImageKey_;
    if (imagesMode == "multiple") getKey = getChainImagesKey;

    const exportQuestions = (e) => {
        const exportMode = imagesMode == "multiple" ? "trake" : answer == "" ? "kis" : "qa";

        if (exportMode === "kis") {
            // Build CSV lines (no header)
            const lines = images.map(image => {
                const groupVideo = `${image.group_id}_${image.video_id}`;
                const keyframePart = image.keyframe_id?.split("_")[1] || "";
                return `${groupVideo},${keyframePart}`;
            });
            // Convert to CSV string
            const csvContent = lines.join("\n");

            // Trigger download
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${currentQuestion.questionName}-export.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (exportMode === "qa") {
            const safeAnswer = (ans) => `"${ans.replace(/"/g, '""')}"`;

            const lines = images.map(image => {
                const groupVideo = `${image.group_id}_${image.video_id}`;
                const keyframePart = image.keyframe_id?.split("_")[1] || "";
                return `${groupVideo},${keyframePart},${safeAnswer(answer)}`;
            });

            const csvContent = lines.join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${currentQuestion.questionName}-export.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            const lines = images.map(image => {
                const items = image.items;
                const groupVideo = `${items[0].group_id}_${items[0].video_id}`;
                const keyframePart = items.map(img => img.keyframe_id?.split("_")[1] || "").join(",");
                return `${groupVideo},${keyframePart}`;
            });
            // Convert to CSV string
            const csvContent = lines.join("\n");

            // Trigger download
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${currentQuestion.questionName}-export.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

    }

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
                const newSortedImages = images.filter(image => !selectedKeys.includes(getKey(image)));
                updateQuestionField({
                    'images': newSortedImages,
                });
            }

            // control + a, select all
            if (e.ctrlKey && e.key.toLowerCase() === "a") {
                e.preventDefault();
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
                return a.group_id - b.group_id || a.video_id - b.video_id || a.keyframe_id - b.keyframe_id;
            } else if (sortOption === "hc") {
                return b.score - a.score;
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
                {/* <Select
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
                    <MenuItem value="hc">High score</MenuItem>
                </Select> */}
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
                <TextField multiline id="outlined-basic" label="Answer" variant="outlined" value={answer} onChange={e => setAnswer(e.target.value)} />

            </Box>
            <div className={clsx("relative overflow-y-scroll space-y-2 h-full container", imagesMode == "multiple" && "p-3")} ref={ref} tabIndex={0}>
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
                <div className={imagesMode == "single" ? "grid grid-cols-5 p-4" : "space-y-2"} id="selecto" >
                    {
                        imagesMode == "single" ?
                            images?.map((image) => {
                                const src = getImage(blobs, getKey(image));
                                return (
                                    <figure className="relative image p-2 hover:bg-[rgba(68,171,255,0.15)] [&_*]:select-none [&_*]:pointer-events-none keyframes"
                                        key={getKey(image)}
                                        data-key={getKey(image)}
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
                                                {image.group_id} / {image.video_id} / {String(image.keyframe_id).split("_")[1]}
                                            </Typography>
                                            <Typography className={clsx(image.score > 0.95 ? "text-blue-300" : image.score > 0.9 ? "text-yellow-500" : image.score > 0.8 ? "text-gray-400" : image.score > 0.7 ? "text-orange-900" : "")}>{image.score.toFixed(4)}</Typography>
                                        </figcaption>
                                    </figure>
                                )
                            }) :
                            images?.map((imageChain, index) => {
                                imageChain = imageChain.items;
                                return (
                                    <Paper key={index} className="flex flex-row justify-between image keyframes hover:!bg-[rgba(68,171,255,0.15)]"
                                        data-key={getKey(imageChain)}
                                        data-container={"images"}
                                    >
                                        {
                                            imageChain.map((image) => {
                                                const src = getImage(blobs, getImageKey_(image));
                                                return (
                                                    <figure className="relative p-2 [&_*]:select-none [&_*]:pointer-events-none"
                                                        key={getImageKey_(image)}
                                                        onDoubleClick={() => handleOpen(image)}
                                                    >
                                                        <img src={src}
                                                        />
                                                        <figcaption className="flex flex-row justify-between ">
                                                            <Typography variant="caption" className=" text-center text-black bg-opacity-50 p-1 rounded">
                                                                {image.group_id} / {image.video_id} / {String(image.keyframe_id).split("_")[1]}
                                                            </Typography>
                                                            <Typography className={clsx(image.score > 0.95 ? "text-blue-300" : image.score > 0.9 ? "text-yellow-500" : image.score > 0.8 ? "text-gray-400" : image.score > 0.7 ? "text-orange-900" : "")}>{image.score.toFixed(4)}</Typography>
                                                        </figcaption>
                                                    </figure>
                                                )
                                            })
                                        }
                                    </Paper>)
                            })

                    }
                </div>
            </div>
            <Fab
                color="primary"
                className="!absolute bottom-4 right-4 z-50"
                onClick={exportQuestions}
            >
                ➜
            </Fab>
        </div>
    )
}

