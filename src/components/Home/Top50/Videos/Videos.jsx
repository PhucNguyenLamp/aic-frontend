import { useState, useEffect, useRef, useContext } from "react";
import { Box, Button, Card, Fab, FormControl, InputLabel, Menu, MenuItem, Select, Slider, Typography } from "@mui/material";
import { getImage, getImageKey, imagePath } from "@/utils/imagePath";
import clsx from "clsx";
import Selecto from "react-selecto";
import { useStore } from "@/stores/questions";
import { useStoreImages } from "@/stores/blobs";
import { get } from "idb-keyval";

export default function Videos({ handleOpen }) {
  const [sortOption, setSortOption] = useState("d");
  const { getCurrentQuestion, setCurrentQuestion, updateQuestionField, questions, currentQuestionId, undo, redo } = useStore();
  const currentQuestion = getCurrentQuestion();
  const images = currentQuestion.images;
  const searchImages = currentQuestion.searchImages;
  const undoArray = currentQuestion.undoSearchArray;
  const redoArray = currentQuestion.redoSearchArray;

  const ref = useRef(null);

  const { blobs, setBlobs } = useStoreImages();

  // const [blobUrls, setBlobUrls] = useState({});
  useEffect(() => {
    let isMounted = true;

    async function loadBlobs() {
      const urls = {};
      const uniqueMap = new Map();
       [...searchImages, ...images].forEach(img => {
        const imageKey = getImageKey(img.key, img.video_id, img.group_id);
        if (!uniqueMap.has(imageKey)) uniqueMap.set(imageKey, img);
      });
      const allImages = [...uniqueMap.values()];
      for (const img of allImages) {
        if (img.blobKey) {
          const val = await get(img.blobKey);
          if (val) {
            urls[img.blobKey] = URL.createObjectURL(val);
          }
        }
      }
      setBlobs(urls);
    }
    loadBlobs();

    return () => {
      isMounted = false;
      Object.values(blobs).forEach(URL.revokeObjectURL);
    };
  }, [images]);


  const selectoRef = useRef(null);

  const sortImages = (sortOption) => {
    const newSortedImages = [...searchImages].sort((a, b) => {
      if (sortOption === "g") {
        return a.group_id - b.group_id || a.video_id - b.video_id || a.key - b.key;
      } else if (sortOption === "hc") {
        return b.confidence - a.confidence;
      } else
        return 0;
    });
    updateQuestionField({ 'searchImages': newSortedImages });
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isFocusedInside = ref.current && (ref.current === document.activeElement || ref.current.contains(document.activeElement));
      if (!isFocusedInside) return;

      if (e.keyCode == 46) {
        const selectedElements = document.querySelectorAll("#selecto .image.selected");
        if (!selectedElements.length) return;
        // delete selected elements by sorting them by key
        const selectedKeys = Array.from(selectedElements).map((el) => {
          return el.getAttribute("data-key");
        });
        const newSortedImages = searchImages.filter(image => !selectedKeys.includes(`${image.key}-${image.video_id}-${image.group_id}`));
        updateQuestionField({
          'searchImages': newSortedImages,
        });
      }

      // control + a, select all
      if (e.ctrlKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        const allElements = document.querySelectorAll("#selecto .image.search");
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
      // if (ref.current && !ref.current.contains(e.target)) return;
      if (e.button !== 2) return; // Right-click only

      // hình chọn 
      const selectedElements = document.querySelectorAll("#selecto .image.selected");
      if (!selectedElements.length) return;
      // container của hình chọn
      const sourceContainer = selectedElements[0].getAttribute("data-container");

      // vị trí paste tới
      const currentElementMouseOn = document.elementFromPoint(e.clientX, e.clientY);
      // check xem có ở ngoài cửa sổ không
      if (!currentElementMouseOn) return;

      // check xem chuột có đang nằm trong 1 trong 2 container không
      const insideSearchImages = e.target.closest(".searchImages");
      const insideImages = e.target.closest(".images");
      const toContainer = insideSearchImages ? "searchImages" : insideImages ? "images" : null;

      if (!toContainer) return;


      // check xem 2 container giống hay khác
      const mode = sourceContainer === toContainer ? "same" : "different";
      // lấy data 2 container

      const sourceContainerData = sourceContainer === "images" ? images : searchImages;
      const toContainerData = toContainer === "images" ? images : searchImages;

      // data đã chọn 
      const selectedKeys = Array.from(selectedElements).map(el =>
        el.getAttribute("data-key")
      );

      // check xem có phải mấy cái paste lên dc ko
      const targetKey = currentElementMouseOn.getAttribute("data-key");
      // if (!targetKey) return;
      // nếu không có thì append vào cái cuối cùng
      // TODO: outside mode
      // TODO: KIỂM TRA XEM CÓ BỊ TRÙNG KO 
      if (!targetKey) {
        if (mode === "same") {
          const remainingImages = sourceContainerData.filter(img => !selectedKeys.includes(`${img.key}-${img.video_id}-${img.group_id}`));
          const selectedImages = sourceContainerData.filter(img => selectedKeys.includes(`${img.key}-${img.video_id}-${img.group_id}`));
          const newImages = [
            ...remainingImages,
            ...selectedImages
          ];
          updateQuestionField({ [sourceContainer]: newImages });
        }
        else if (mode === "different") {
          const remainingImages = sourceContainerData.filter(img => !selectedKeys.includes(`${img.key}-${img.video_id}-${img.group_id}`));
          const selectedImages = sourceContainerData.filter(img => selectedKeys.includes(`${img.key}-${img.video_id}-${img.group_id}`));
          const uniqueMap = new Map();
          [...toContainerData, ...selectedImages].forEach(img => {
            const imageKey = getImageKey(img.key, img.video_id, img.group_id);
            if (!uniqueMap.has(imageKey)) uniqueMap.set(imageKey, img);
          })
          const newImages = Array.from(uniqueMap.values());
          updateQuestionField({
            [toContainer]: newImages,
            [sourceContainer]: remainingImages
          })
        }
      }

      else {
        // TODO: BÌNH THƯỜNG MODE
        // vị trí drop 
        const dropIndex = toContainerData.findIndex(img =>
          `${img.key}-${img.video_id}-${img.group_id}` === targetKey
        );
        if (mode === "same") {

          const remainingImages = sourceContainerData.filter(img =>
            !selectedKeys.includes(`${img.key}-${img.video_id}-${img.group_id}`)
          );

          // Extract selected image objects
          const selectedImages = sourceContainerData.filter(img =>
            selectedKeys.includes(`${img.key}-${img.video_id}-${img.group_id}`)
          );

          // Insert selected at dropIndex
          const newImages = [
            ...remainingImages.slice(0, dropIndex),
            ...selectedImages,
            ...remainingImages.slice(dropIndex),
          ];

          updateQuestionField({ [sourceContainer]: newImages });
          // update 2 cái array
          setSortOption("d");
        } else if (mode === "different") {
          // Filter out selected images from original array
          const remainingImages = sourceContainerData.filter(img =>
            !selectedKeys.includes(`${img.key}-${img.video_id}-${img.group_id}`)
          );

          // Extract selected image objects
          const selectedImages = sourceContainerData.filter(img =>
            selectedKeys.includes(`${img.key}-${img.video_id}-${img.group_id}`)
          );

          const uniqueMap = new Map();
          [...toContainerData.slice(0, dropIndex), ...selectedImages, ...toContainerData.slice(dropIndex)].forEach(img => {
            const imageKey = getImageKey(img.key, img.video_id, img.group_id);
            if (!uniqueMap.has(imageKey)) uniqueMap.set(imageKey, img);
          })
          const newImages = Array.from(uniqueMap.values());

          updateQuestionField({
            [toContainer]: newImages,
            [sourceContainer]: remainingImages
          })
        }
      }

    }

    document.addEventListener("mouseup", handleDragUp);

    // might add later
    // const handleRightClick = (e) => {
    //   if (ref.current && !ref.current.contains(e.target)) return;
    //   const selectedElements = document.querySelectorAll("#selecto .image.selected");
    //   if (selectedElements.length > 0) return;

    //   const currentElementMouseOn = document.elementFromPoint(e.clientX, e.clientY);
    //   if (currentElementMouseOn && currentElementMouseOn.classList.contains("image")) {
    //     const selectedElements = document.querySelectorAll("#selecto .image.selected");
    //     selectedElements.forEach(el => el.classList.remove("selected"));
    //     currentElementMouseOn.classList.add("selected");
    //     selectoRef.current.setSelectedTargets([currentElementMouseOn]);
    //   }
    // }
    // document.addEventListener("mousedown", handleRightClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mouseup", handleDragUp);
      // document.removeEventListener("mousedown", handleRightClick);
    };
  }, [searchImages, undoArray, redoArray]);

  return (
    <div className="relative elements overflow-y-scroll w-full h-full container searchImages" ref={ref} tabIndex={0}>
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
        <Button className="h-[56px]"
          disabled={undoArray?.length === 0}
          onClick={undo}>↩️</Button>
        <Button className="h-[56px]"
          disabled={redoArray?.length === 0}
          onClick={redo}>↪️</Button>
        <Select
          value={sortOption}
          label="Sort By"
          onChange={(e) => {
            const sortOption = e.target.value;
            setSortOption(sortOption);
            sortImages(sortOption);
          }}
        >
          <MenuItem value="d">Default</MenuItem>
          <MenuItem value="g">Group</MenuItem>
          <MenuItem value="hc">High Confidence</MenuItem>
        </Select>
      </Box>
      <div className="grid grid-cols-5 gap-4 p-4 " id="selecto">
        {searchImages?.map((image) => {
          const src = getImage(blobs, getImageKey(image.key, image.video_id, image.group_id));
          return (
            <figure className="relative image p-2 hover:bg-[rgba(68,171,255,0.15)] [&_*]:select-none [&_*]:pointer-events-none search"
              key={`${image.key}-${image.video_id}-${image.group_id}`}
              data-key={`${image.key}-${image.video_id}-${image.group_id}`}
              data-container={"searchImages"}
              onDoubleClick={() => handleOpen(image)}
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
  )
}

