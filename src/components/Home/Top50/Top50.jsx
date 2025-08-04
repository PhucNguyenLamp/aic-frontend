import { useContext, useEffect, useRef, useState } from "react";
import VideoModal from "./Videos/VideoModal";
import Videos from "./Videos/Videos";
import SplitPane from "react-split-pane";
import Keyframes from "./Keyframes/Keyframes";
import { AppContext } from "@/context/AppContext";

export default function Top50() {
    const { images: sortedImages, setImages: setSortedImages } = useContext(AppContext);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    const handleOpen = (image) => {
        setModalImage(image);
        setIsOpenModal(true);
    };

    useEffect(() => {
        setSortedImages(sortedImages);
    }, [sortedImages]);

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
                <Keyframes sortedImages={sortedImages} setSortedImages={setSortedImages} handleOpen={handleOpen} />
                <Videos handleOpen={handleOpen} />
            </SplitPane>
            <VideoModal
                images={sortedImages} image={modalImage} open={isOpenModal}
                onClose={() => setIsOpenModal(false)} setSortedImages={setSortedImages}
            />
        </div>

    )
}