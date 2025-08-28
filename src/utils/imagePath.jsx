import path from 'path'
import { get } from "idb-keyval";
const VIDEOS_URL = import.meta.env.VITE_VIDEOS_URL || 'http://localhost:3000';

export function imagePath(key){
    const [id, videoid, groupid] = key.split("-");
    return `/test/keyframe/L${String(groupid).padStart(2, '0')}/V${String(videoid).padStart(3, '0')}/${String(id).padStart(8, '0')}.webp`
}

export function videoPath(videoid, groupid) {
    if (!videoid || !groupid) return null;
    const paddedVideoId = videoid.toString().padStart(3, "0");
    const paddedGroupId = groupid.toString().padStart(2, "0");

    const url = `${VIDEOS_URL}/L${paddedGroupId}/V${paddedVideoId}.mp4`;
    console.log(url)
    return url;
}

export function getImageKey(id, videoid, groupid){
    return `${id}-${videoid}-${groupid}`;
}

export function getImageKey_(image){
    return getImageKey(image.key, image.video_id, image.group_id);
}

export function getChainImagesKey(images){
    const key = images.map(image => getImageKey(image.key, image.video_id, image.group_id)).join(",");
    return key;
}

export function getImage(blobKeyMap, key){
    // console.log(blobKeyMap)
    // console.log(key)
    return blobKeyMap[key] || imagePath(key);
}