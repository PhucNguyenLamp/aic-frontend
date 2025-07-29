import { Button, Card, Fab, MenuItem, Select, Slider, Typography } from "@mui/material";
import { imagePath } from "../utils/imagePath";
import { useEffect, useRef, useState } from "react";
import Selecto from "react-selecto";
import VideoModal from "./VideoModal";
import Videos from "./Videos";
import clsx from "clsx";
import SplitPane from "react-split-pane";

export default function Top50({ images }) {
    const undostackRef = useRef([])
    const selectoRef = useRef(null);
    const [sortedImages, setSortedImages] = useState(images);
    const [sortOption, setSortOption] = useState("d");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const handleOpen = (image) => {
        setModalImage(image);
        setIsOpenModal(true);
    };
    const undo = () => {
    }

    useEffect(() => {
        const newSortedImages = [...sortedImages].sort((a, b) => {
            if (sortOption === "g") {
                return a.group_id - b.group_id || a.video_id - b.video_id || a.key - b.key;
            } else if (sortOption === "hc") {
                return b.confidence - a.confidence;
            }
            return 0;
        });
        setSortedImages(newSortedImages);
    }, [sortOption])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.keyCode == 46){
                const selectedElements = document.querySelectorAll("#selecto .image.selected");
                // delete selected elements by sorting them by key
                const selectedKeys = Array.from(selectedElements).map((el) => {
                    return el.getAttribute("data-key");
                });
                const newSortedImages = sortedImages.filter(image => !selectedKeys.includes(`${image.key}-${image.video_id}-${image.group_id}`));
                setSortedImages(newSortedImages);
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

        }
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [sortedImages]);
    useEffect(() => {
        setSortedImages(images);
    }, [images]);

    return (
        <div className="relative h-screen flex flex-col">
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
            <SplitPane
                defaultSize={400}
                split="horizontal"
                paneStyle={{ overflow: "auto" }}
                resizerStyle={{
                    background: '#e5e7eb',
                    height: '4px',
                    cursor: 'row-resize',
                    borderTop: '1px solid #d1d5db',
                    borderBottom: '1px solid #d1d5db'
                }}
                >
                <div className="relative elements overflow-y-scroll w-full">
                    <Button className="h-[56px]" onClick={undo}>↩️</Button>
                    <Select
                        value={sortOption}
                        label="Sort By"
                        onChange={e => setSortOption(e.target.value)}
                    >
                        <MenuItem value="d">Default</MenuItem>
                        <MenuItem value="g">Group</MenuItem>
                        <MenuItem value="hc">High Confidence</MenuItem>
                    </Select>
                    <div className="grid grid-cols-5 gap-4 p-4 container" id="selecto">
                        {sortedImages?.map((image, index) => (
                            <figure className="relative image p-2 hover:bg-[rgba(68,171,255,0.15)]" 
                            key={`${image.key}-${image.video_id}-${image.group_id}`}
                            data-key={`${image.key}-${image.video_id}-${image.group_id}`} 
                            onDoubleClick={() => handleOpen(image)}
                            >
                                <img src={image.blobUrl || imagePath(image.key, image.video_id, image.group_id)}
                                    className="select-none pointer-events-none"
                                />
                                <figcaption className="flex flex-row justify-between">
                                    <Typography variant="caption" className=" text-center text-black bg-opacity-50 p-1 rounded">
                                        L{image.group_id} / V{image.video_id} / {image.key}
                                    </Typography>
                                    <Typography className={clsx(image.confidence > 0.95 ?  "text-blue-300" : image.confidence > 0.9 ? "text-yellow-500" : image.confidence > 0.8 ? "text-gray-400" : image.confidence > 0.7 ? "text-orange-900" : ""  )}>{image.confidence}</Typography>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
                <Videos handleOpen={handleOpen}/>
            </SplitPane>
            <VideoModal images={sortedImages} image={modalImage} open={isOpenModal} onClose={() => setIsOpenModal(false)} setSortedImages={setSortedImages}/>
            
        </div>

    )
}