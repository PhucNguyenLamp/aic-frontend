export function imagePath(id, videoid, groupid){

    return `/test/keyframe/L${String(groupid).padStart(2, '0')}/V${String(videoid).padStart(3, '0')}/${String(id).padStart(8, '0')}.webp`
}

export function videoPath(videoid, groupid) {
    return `/test/video/L${String(groupid).padStart(2, '0')}/V${String(videoid).padStart(3, '0')}.mp4`;
}

export function getImageKey(id, videoid, groupid, questionid){
    return `${id}-${videoid}-${groupid}-${questionid}`;
}