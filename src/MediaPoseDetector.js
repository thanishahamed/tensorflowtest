import React, { useRef } from 'react';
// Import MediaPipe runtime with side effects.
import '@mediapipe/pose';
import Webcam from "react-webcam";
import * as poseDetection from '@tensorflow-models/pose-detection';
import { drawKeypoints, drawSkeleton } from "./utilities2";
import '@tensorflow/tfjs-backend-webgl';


const MediaPoseDetector = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const fireFunction = async () => {
        // Create a detector.
        console.log('hoooooo 1');
        // const detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, { runtime: 'mediapipe' });
        const detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, { runtime: 'tfjs' });
        // Pass in a video stream to the model to detect poses.
        console.log('hoooooo 1');
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;
            // const video = document.getElementById('video');
            console.log('hooooo')
            const poses = await detector.estimatePoses(video);
            console.log('console loggin', poses);
            drawCanvas(poses, video, videoWidth, videoHeight, canvasRef);
        }
    }

    const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
        const ctx = canvas.current.getContext("2d");
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;

        drawKeypoints(pose[0]["keypoints"], 0.6, ctx);
        drawSkeleton(pose[0]["keypoints"], 0.7, ctx);
    };

    const onClickFire = () => {
        // setInterval(()=>{
        //     fireFunction();
        // }, 100);

        for(let i=0; i<10; i++) {
           fireFunction();
        }
    }

    return (
        <div>
            <button onClick={onClickFire}>Fire</button>
            <div>
                <Webcam
                    ref={webcamRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        // zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                />

                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                />
            </div>

            </div>
            );
}

            export default MediaPoseDetector;