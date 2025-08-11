import { useContext, useEffect, useRef, useState } from "react";
import VideoModal from "./Videos/VideoModal";
import Videos from "./Videos/Videos";
import SplitPane from "react-split-pane";
import Keyframes from "./Keyframes/Keyframes";
import { useStore } from "zustand";

export default function Top50() {

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    const handleOpen = (image) => {
        setModalImage(image);
        setIsOpenModal(true);
        console.log("Opening modal for image:", image);
    };

    // useEffect(() => {
    //     setSortedImages(sortedImages);
    // }, [sortedImages]);

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
                <Keyframes
                    handleOpen={handleOpen} />
                <Videos handleOpen={handleOpen} />
            </SplitPane>
            <VideoModal
                image={modalImage}
                open={isOpenModal}
                onClose={() => setIsOpenModal(false)}
            />
        </div>

    )
}