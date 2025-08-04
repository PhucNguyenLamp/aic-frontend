import { useState, useEffect, useRef, useContext } from "react";
import { Box, Button, Card, Fab, FormControl, InputLabel, MenuItem, Select, Slider, Typography } from "@mui/material";
import { imagePath } from "@/utils/imagePath";
import clsx from "clsx";
import Selecto from "react-selecto";
import QuestionsReader from "./QuestionsReader";
import { AppContext } from "@/context/AppContext";
import * as Blockly from "blockly";
export default function Keyframes({ handleOpen }) {
    const [sortOption, setSortOption] = useState("d");
    const { questionNumber, setQuestionNumber, questions, undoRef, redoRef, images, setImages, workspaceRef } = useContext(AppContext);

    function changeWorkSpace(e) {
        // save Workspace
        questions[questionNumber].workspace.images = images;
        questions[questionNumber].workspace.history.undoRef = undoRef.current;
        questions[questionNumber].workspace.history.redoRef = redoRef.current;
        questions[questionNumber].workspace.queries = Blockly.serialization.workspaces.save(workspaceRef.current);
        // change currentQuestion
        setQuestionNumber(e.target.value)
    }

    const selectoRef = useRef(null);
    const undo = () => {
        if (undoRef.current.length > 0) {
            const lastState = undoRef.current.pop();
            redoRef.current.push(images);
            setImages(lastState);
        }
    }

    const redo = () => {
        if (redoRef.current.length > 0) {
            const lastState = redoRef.current.pop();
            undoRef.current.push(images);
            setImages(lastState);
        }
    }

    useEffect(() => {
        const newSortedImages = [...images].sort((a, b) => {
            if (sortOption === "g") {
                return a.group_id - b.group_id || a.video_id - b.video_id || a.key - b.key;
            } else if (sortOption === "hc") {
                return b.confidence - a.confidence;
            } else
                return 0;
        });
        setImages(newSortedImages);
    }, [sortOption])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.keyCode == 46) {
                const selectedElements = document.querySelectorAll("#selecto .image.selected");
                // delete selected elements by sorting them by key
                const selectedKeys = Array.from(selectedElements).map((el) => {
                    return el.getAttribute("data-key");
                });
                const newSortedImages = images.filter(image => !selectedKeys.includes(`${image.key}-${image.video_id}-${image.group_id}`));
                setImages(newSortedImages);
                undoRef.current.push(images);
                redoRef.current = [];
            }
            // control + a, select all
            if (e.ctrlKey && e.key.toLowerCase() === "a") {
                e.preventDefault();
                const allElements = document.querySelectorAll("#selecto .image");
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

        // const handleDragDown = (e) => {
        //     if (e.keyCode == 2){
        //         e.preventDefault();
        //         const selectedElements = document.querySelectorAll("#selecto .image.selected");

        //     }
        // }

        // document.addEventListener("keydown", handleDragDown);
        const handleDragUp = (e) => {
            if (e.button !== 2) return; // Right-click only

            const selectedElements = document.querySelectorAll("#selecto .image.selected");
            const currentElementMouseOn = document.elementFromPoint(e.clientX, e.clientY);
            console.log(currentElementMouseOn)
            if (!currentElementMouseOn) return;

            const targetKey = currentElementMouseOn.getAttribute("data-key");
            if (!targetKey) return;

            // Find the index of the drop target
            const dropIndex = images.findIndex(img =>
                `${img.key}-${img.video_id}-${img.group_id}` === targetKey
            );

            if (dropIndex === -1) return;

            // Extract keys of selected images
            const selectedKeys = Array.from(selectedElements).map(el =>
                el.getAttribute("data-key")
            );

            // Filter out selected images from original array
            const remainingImages = images.filter(img =>
                !selectedKeys.includes(`${img.key}-${img.video_id}-${img.group_id}`)
            );

            // Extract selected image objects
            const selectedImagesData = images.filter(img =>
                selectedKeys.includes(`${img.key}-${img.video_id}-${img.group_id}`)
            );

            // Insert selected at dropIndex
            const newImages = [
                ...remainingImages.slice(0, dropIndex),
                ...selectedImagesData,
                ...remainingImages.slice(dropIndex),
            ];

            setImages(newImages);
            undoRef.current.push(images);
            redoRef.current = [];
            setSortOption("d");
        }

        document.addEventListener("mouseup", handleDragUp);

        const handleRightClick = (e) => {
            const selectedElements = document.querySelectorAll("#selecto .image.selected");
            if (selectedElements.length > 0) return;

            const currentElementMouseOn = document.elementFromPoint(e.clientX, e.clientY);
            if (currentElementMouseOn && currentElementMouseOn.classList.contains("image")) {
                const selectedElements = document.querySelectorAll("#selecto .image.selected");
                selectedElements.forEach(el => el.classList.remove("selected"));
                currentElementMouseOn.classList.add("selected");
                selectoRef.current.setSelectedTargets([currentElementMouseOn]);
            }
        }
        document.addEventListener("mousedown", handleRightClick);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mouseup", handleDragUp);
            document.removeEventListener("mousedown", handleRightClick);
        };
    }, [images]);

    return (
        <div className="relative elements overflow-y-scroll w-full container">
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
            <Box className="sticky flex items-center">
                <Button className="h-[56px]" disabled={undoRef.current.length === 0} onClick={undo}>↩️</Button>
                <Button className="h-[56px]" disabled={redoRef.current.length === 0} onClick={redo}>↪️</Button>
                <Select
                    value={sortOption}
                    label="Sort By"
                    onChange={e => setSortOption(e.target.value)}
                >
                    <MenuItem value="d">Default</MenuItem>
                    <MenuItem value="g">Group</MenuItem>
                    <MenuItem value="hc">High Confidence</MenuItem>
                </Select>
                <FormControl className="max-w-[130px]" fullWidth>
                    <InputLabel id="question-select-label">{questions.length === 0 ? "No Question" : `Question ${questionNumber}`}</InputLabel>
                    <Select
                        labelId="question-select-label"
                        value={questionNumber}
                        label="Questions"
                        disabled={questions.length === 0}
                        onChange={e => setQuestionNumber(e.target.value)}
                    >
                        {
                            questions.map((q, index) => (
                                <MenuItem key={q.fileName} value={index} onClick={changeWorkSpace}>
                                    Question {q.fileName}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <QuestionsReader />
            </Box>
            <div className="grid grid-cols-5 gap-4 p-4" id="selecto">
                {images?.map((image, index) => (
                    <figure className="relative image p-2 hover:bg-[rgba(68,171,255,0.15)] [&_*]:select-none [&_*]:pointer-events-none"
                        key={`${image.key}-${image.video_id}-${image.group_id}`}
                        data-key={`${image.key}-${image.video_id}-${image.group_id}`}
                        onDoubleClick={() => handleOpen(image)}
                    >
                        <img src={image.blobUrl || imagePath(image.key, image.video_id, image.group_id)}
                            className=""
                        />
                        <figcaption className="flex flex-row justify-between ">
                            <Typography variant="caption" className=" text-center text-black bg-opacity-50 p-1 rounded">
                                L{image.group_id} / V{image.video_id} / {image.key}
                            </Typography>
                            <Typography className={clsx(image.confidence > 0.95 ? "text-blue-300" : image.confidence > 0.9 ? "text-yellow-500" : image.confidence > 0.8 ? "text-gray-400" : image.confidence > 0.7 ? "text-orange-900" : "")}>{image.confidence}</Typography>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </div>
    )
}

