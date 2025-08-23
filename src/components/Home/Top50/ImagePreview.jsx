import { useState } from "react"


export default function ImagePreview({keyframe, videoid, groupid}) {
    
    const [src, setSrc] = useState("")
  return (
      <img src={src}
      />
  )
}
