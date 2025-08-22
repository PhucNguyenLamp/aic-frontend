import { get } from "idb-keyval";

export function imagePath(key){
    const [id, videoid, groupid] = key.split("-");
    return `/test/keyframe/L${String(groupid).padStart(2, '0')}/V${String(videoid).padStart(3, '0')}/${String(id).padStart(8, '0')}.webp`
}

export function videoPath(videoid, groupid) {
    return `/test/video/L${String(groupid).padStart(2, '0')}/V${String(videoid).padStart(3, '0')}.mp4`;
}

export function getImageKey(id, videoid, groupid){
    return `${id}-${videoid}-${groupid}`;
}

export function getImage(blobKeyMap, key){
    // console.log(blobKeyMap)
    // console.log(key)
    return blobKeyMap[key] || imagePath(key);
}