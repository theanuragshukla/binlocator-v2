import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Camera.css";
import { MdCameraAlt, MdDone } from "react-icons/md";
import { RxCross2 as RxCross } from "react-icons/rx";

import { Box, Flex} from "@chakra-ui/react";
const Camera = () => {
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [img, setImg] = useState("");
    const [captured, setCaptured] = useState(false);
    const [imgSz, setImgSz] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        getVideo();
        return () => {
            if (videoRef != null && videoRef.current != null) {
                let video = videoRef.current;
                const stream = video.srcObject;
                const tracks = stream.getTracks();
                for (let i = 0; i < tracks.length; i++) {
                    let track = tracks[i];
                    track.stop();
                }
                video.srcObject = null;
            }
        };
    }, [videoRef]);
    const constraints = {
        video: {
            width: {
                min: 1280,
                ideal: window.innerWidth,
                max: 2560,
            },
            height: {
                min: 720,
                ideal: window.innerHeight,
                max: 1440,
            },
            facingMode: {
                //  exact: 'environment'
            },
        },
    };

    const getVideo = () => {
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                let video = videoRef.current;
                video.srcObject = stream;
                video.addEventListener("playing", () => {
                    setImgSz((obj) => {
                        obj.width = video.videoWidth;
                        obj.height = video.videoHeight;
                        return obj;
                    });
                });
            })
            .catch((err) => {
                console.log(err.name);
                if (err.name == "OverconstrainedError") {
                    alert(
                        "device not supported! please switch to a mobile device to use this feature"
                    );
                }
            });
    };

    const paintToCanvas = () => {
        if (!captured) {
            let video = videoRef.current;
            let photo = photoRef.current;
            let ctx = photo.getContext("2d");
            return setInterval(() => {
                const width = imgSz.width;
                const height = imgSz.height;
                photo.width = width;
                photo.height = height;
                ctx.drawImage(video, 0, 0, width, height);
            }, 200);
        }
    };

    const takePhoto = () => {
        let photo = photoRef.current;
        const data = photo.toDataURL("image/jpeg");
        setImg(() => data);
        stopVideo();
        setCaptured(() => true);
    };
    const stopVideo = () => {
        let video = videoRef.current;
        if (video === null) return;
        const stream = video.srcObject;
        const tracks = stream.getTracks();

        console.log(tracks);
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].stop();
        }

        video.srcObject = null;
    };
    const cancelUpload = () => {
        setCaptured(false);
        setImg("");
        getVideo();
    };
    const uploadBin = () => {};

    const beforeControl = [
        {
            Icon: MdCameraAlt,
            onClick: takePhoto,
        },
    ];

    const afterControl = [
        {
            Icon: RxCross,
            onClick: cancelUpload,
            color:"red"
        },
        {
            Icon: MdDone,
            onClick: uploadBin,
            color:"green"
        },
    ];

    useLayoutEffect(() => {
        return stopVideo;
    }, []);

    return (
        <Flex
            pos="relative"
            flexDir="column"
            justify="flex-start"
            bgImg={img}
            bgSize="cover"
            bgPos="center"
            width="100%"
            h="100%"
        >
            <Box
                display={captured ? "none" : "block"}
                width="100%"
                height="100%"
            >
                <video
                    onCanPlay={() => paintToCanvas()}
                    ref={videoRef}
                    autoPlay
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
                <Box display="none">
                    <canvas ref={photoRef} />
                </Box>
            </Box>
            <Flex
                pos="absolute"
                width="100%"
                justify="center"
                gap={8}
                color="white"
                bottom={8}
            >
                {(captured ? afterControl : beforeControl).map((o) => (
                    <Flex
                        onClick={o.onClick}
                        borderRadius="50%"
                        bg="#ebf5eb"
                        color={o.color || "black"}
                        h={20}
                        w={20}
                        justify="center"
                        alignItems="center"
                    >
                        <o.Icon size={36}/>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
};

export default Camera;
