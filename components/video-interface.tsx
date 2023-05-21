import React from "react";
// import vortex
import VoxeetSDK from "@voxeet/voxeet-web-sdk";
// import useState
import { useState, useEffect, useRef } from "react";
import "@millicast/sdk/dist/millicast.umd.js";
import { Director, Publish, View } from "@millicast/sdk";

// define type of data passed to the component
type UserProps = {
  username: string | undefined;
  role: string | undefined;
};

const VideoInterface = ({ username, role }: UserProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const APP_KEY = "9KshJ_n7Xfb5xSM5uZN0Eg==";
  const APP_SECRET = "pqeVDDQeyZKdDuU9Hl8Q4Oc5MFV0onwhgTFprUzdzuM=";
  const PUBLISH_TOKEN =
    "4811b659922ebd118b7fe41cedb5f77662a37215b462d9807b3a3dfac0afe012";
  const PUBLISH_STREAM_NAME = "myStreamName";
  const STREAM_ID = "TeTVWH";

  const [screenCapture, setScreenCapture] = useState<MediaStream>();
  const userRole = role ? role : "Streamer";




  // alternative attempt with Vorteex insttead of Millicast
  const [name, setName] = useState<string>("");
  const conferenceAliasInput = "gaming-room";
  useEffect(() => {
    const main = async () => {
      // Generate a client access token from the Dolby.io dashboard and insert into access_token variable
      let access_token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkb2xieS5pbyIsImlhdCI6MTY4NDYwODYxNSwic3ViIjoiOUtzaEpfbjdYZmI1eFNNNXVaTjBFZz09IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9DVVNUT01FUiJdLCJ0YXJnZXQiOiJzZXNzaW9uIiwib2lkIjoiODczZmFmYmMtMDYzOC00YWUzLWIyZGYtY2Q4MWRiYWM3MWY1IiwiYWlkIjoiMTM4Nzg4ZTMtYjU3OS00YmZmLTk3M2ItODk0OTk1OTU1NDYzIiwiYmlkIjoiOGEzNjhjZWU4NzI4MzQyNDAxODcyZDUzNmMxMjE4ZGMiLCJleHAiOjE2ODQ2OTUwMTV9.ZuxzbgOEf0PLwsF1THVariBEq58E74OH8goYQ8VeUiQgvrRpT5Mv6k167ZeY6Br-71DPMsdzMVAdBcdWm9w_qg";
      VoxeetSDK.initializeToken(access_token, (isExpired: any) => {
        return new Promise((resolve, reject) => {
          if (isExpired) {
            reject("The access token has expired.");
          } else {
            resolve(access_token);
          }
        });
      });


      try {
        // Open the session
        await VoxeetSDK.session.open({ name: username });
        setName(username as string);
        /*
         * 1. Create a conference room with an alias
         * 2. Join the conference with its id
         */
        VoxeetSDK.conference
          .create({ alias: conferenceAliasInput })
          .then((conference) => VoxeetSDK.conference.join(conference, {}))
          .catch((err) => console.error(err));
      } catch (e) {
        alert("Something went wrong : " + e);
      }
    };

    main();
  }, []);

  const sharingScreen = async () => {
    if (userRole.toLowerCase() === "streamer") {
    VoxeetSDK.conference
      .startScreenShare()
      .then(() => {
        console.log("Screen sharing started");
        // const screenCapture = await navigator.mediaDevices.getDisplayMedia(
        //   displayMediaOptions
        // );
        displayStream(videoRef.current as HTMLVideoElement);
      })
      .catch((err) => console.error(err));
    } else {
      alert("welcome viewer");
      displayStream(videoRef.current as HTMLVideoElement);
    }
  };

  const displayStream = (videoElement: HTMLVideoElement) => {
    VoxeetSDK.conference.on("streamAdded", (participant, stream) => {
      if (stream.type === "ScreenShare") {
        videoElement.srcObject = stream;
        videoRef.current?.play();
      }

      if (stream.getVideoTracks().length > 0) {
        videoElement.srcObject = stream;
        videoRef.current?.play();
      }
    });
  };


  return (
    <div className="video-interface">
      {/* This componnent will house the stream sharing and also display information regarding it */}
      <div className="video-interface__view-area">
        {/* view area */}
        <div className="video-interface__view-area__viewers">
          {/* number of viewers */}
          <p>500 Watching, you are logged in as {name}</p>
        </div>
        <video
          className="h-full relative w-full"
          ref={videoRef}
          autoPlay
          playsInline
        />
      </div>
      <div className="video-interface__stream-info">
        {/* stream info */}
        <div className="video-interface__stream-info__streamer">
          {/* streamer name */}
          <p className="video-interface__stream-info__streamer__name">
            Streamer Name
          </p>
          {/* status */}
          <p className="video-interface__stream-info__streamer__status">Live</p>
        </div>
        <div className="video-interface__stream-info__stream">
          {/* game name */}
          <p className="video-interface__stream-info__stream__game-name">
            The last of Us
          </p>
          {/* reactions */}
          <div className="video-interface__stream-info__stream__actions">
            <button className="video-interface__stream-info__stream__actions__exit">
              Exit
            </button>
            <button
              className="video-interface__stream-info__stream__actions__share"
              // onClick={() => startScreenShare()}
              onClick={() => sharingScreen()}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInterface;
