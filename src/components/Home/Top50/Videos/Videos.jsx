import { useState } from "react"
import VideoModal from "./VideoModal";
import { imagePath, videoPath } from "@/utils/imagePath";
import { Card } from "@mui/material";

export default function Videos({ videos, handleOpen }) {
  const [sortedVideos, setSortedVideos] = useState(videos || videosFallback);
  return (
    <Card className="overflow-y-scroll h-full">
      {
        sortedVideos.map((group, index) => {
          const groupid = index + 1
          return (
            <div key={groupid} >
              Group {groupid}
              <div className="grid grid-cols-5 gap-4 p-4">
                {group.map((videoid) => (
                  <div key={videoid} onDoubleClick={() => handleOpen({ key: 0, video_id: videoid, group_id: groupid })} className=" p-2 hover:bg-[rgba(68,171,255,0.15)]">
                    <img src={imagePath(0, videoid, groupid)} className="pointer-events-none select-none"
                    />
                    <span>V{videoid}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      }
    </Card>
  );
}
// group 1 has video 1 2 3
const videosFallback = [
  [1, 2, 3],
]