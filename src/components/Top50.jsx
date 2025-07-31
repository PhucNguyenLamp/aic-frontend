import { useEffect, useRef, useState } from "react";
import VideoModal from "./VideoModal";
import Videos from "./Videos";
import SplitPane from "react-split-pane";
import Keyframes from "./Keyframes";

export default function Top50({ images }) {
    const undoRef = useRef([])
    const redoRef = useRef([])

    const [sortedImages, setSortedImages] = useState(images);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const handleOpen = (image) => {
        setModalImage(image);
        setIsOpenModal(true);
    };

    useEffect(() => {
        setSortedImages(images);
    }, [images]);

    useEffect(() => {
        const disableContextMenu = (e) => {
            e.preventDefault();
        };
        document.addEventListener("contextmenu", disableContextMenu);
        return () => {
            document.removeEventListener("contextmenu", disableContextMenu);
        };
    }, []);


    return (
        <div className="relative h-screen flex flex-col">

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
                <Keyframes undoRef={undoRef} redoRef={redoRef} sortedImages={sortedImages} setSortedImages={setSortedImages} handleOpen={handleOpen} />
                <Videos handleOpen={handleOpen} />
            </SplitPane>
            <VideoModal
                images={sortedImages} image={modalImage} open={isOpenModal}
                onClose={() => setIsOpenModal(false)} setSortedImages={setSortedImages}
                undoRef={undoRef} redoRef={redoRef}
            />
        </div>

    )
}