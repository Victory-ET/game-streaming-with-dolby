import React from "react";
// import vortex
import VoxeetSDK from "@voxeet/voxeet-web-sdk";
// import useState
import { useState, useEffect, useRef } from "react";
import "@millicast/sdk/dist/millicast.umd.js";
import { Director, Publish, View } from "@millicast/sdk";

// define type of data passed to the component
type UserProps = {
  role: string | undefined;
};

const VideoInterface = ({ role }: UserProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const APP_KEY = "9KshJ_n7Xfb5xSM5uZN0Eg==";
  const APP_SECRET = "pqeVDDQeyZKdDuU9Hl8Q4Oc5MFV0onwhgTFprUzdzuM=";
  const PUBLISH_TOKEN =
    "4811b659922ebd118b7fe41cedb5f77662a37215b462d9807b3a3dfac0afe012";
  const PUBLISH_STREAM_NAME = "myStreamName";
  const STREAM_ID = "TeTVWH";

  const [screenCapture, setScreenCapture] = useState<MediaStream>();
  const userRole = role ? role : "Streamer";

  const startScreenShare = async () => {
    if (userRole.toLowerCase() === "streamer") {
      try {
        const displayMediaOptions = {
          video: {
            displaySurface: "window",
          },
          audio: true,
        };

        const screenCapture = await navigator.mediaDevices.getDisplayMedia(
          displayMediaOptions
        );
        if (videoRef.current) {
          videoRef.current.srcObject = screenCapture;
        }

        // Your Dolby.io integration code here
        // Connect to Dolby.io and share the screenCapture media stream
        // See the Dolby.io documentation for the specific implementation details
        const tokenGenerator = () =>
          Director.getPublisher({
            token:
              "4811b659922ebd118b7fe41cedb5f77662a37215b462d9807b3a3dfac0afe012",
            streamName: "myStreamName",
          });

        // Create a new instance
        const millicastPublish = new Publish("myStreamName", tokenGenerator);

        // Get user camera and microphone
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        // Publishing options
        const broadcastOptions = {
          mediaStream: mediaStream,
        };

        // Start broadcast
        try {
          await millicastPublish.connect(broadcastOptions);
        } catch (e) {
          console.log("Connection failed, handle error", e);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      const tokenGenerator = () =>
        Director.getSubscriber({
          streamName: "myStreamName",
          streamAccountId: "TeTVWH",
        });

      // Create a new instance
      const millicastView = new View(
        "myStreamName",
        tokenGenerator,
        videoRef.current as HTMLVideoElement
      );

      console.log("millicastView", millicastView);

      // Start connection to publisher
      try {
        await millicastView.connect();
      } catch (e) {
        console.log("Connection failed, handle error", e);
      }
    }
  };

  // alternative attempt with Vorteex insttead of Millicast
  useEffect(() => {
    const main = async () => {
      // Generate a client access token from the Dolby.io dashboard and insert into access_token variable
      let access_token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkb2xieS5pbyIsImlhdCI6MTY4NDYwODYxNSwic3ViIjoiOUtzaEpfbjdYZmI1eFNNNXVaTjBFZz09IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9DVVNUT01FUiJdLCJ0YXJnZXQiOiJzZXNzaW9uIiwib2lkIjoiODczZmFmYmMtMDYzOC00YWUzLWIyZGYtY2Q4MWRiYWM3MWY1IiwiYWlkIjoiMTM4Nzg4ZTMtYjU3OS00YmZmLTk3M2ItODk0OTk1OTU1NDYzIiwiYmlkIjoiOGEzNjhjZWU4NzI4MzQyNDAxODcyZDUzNmMxMjE4ZGMiLCJleHAiOjE2ODQ2OTUwMTV9.ZuxzbgOEf0PLwsF1THVariBEq58E74OH8goYQ8VeUiQgvrRpT5Mv6k167ZeY6Br-71DPMsdzMVAdBcdWm9w_qg";
      VoxeetSDK.initializeToken(access_token, (isExpired) => {
        return new Promise((resolve, reject) => {
          if (isExpired) {
            reject("The access token has expired.");
          } else {
            resolve(access_token);
          }
        });
      });

      const avengersNames = [
        "Thor",
        "Cap",
        "Tony Stark",
        "Black Panther",
        "Black Widow",
        "Hulk",
        "Spider-Man",
      ];

      let randomName =
        avengersNames[Math.floor(Math.random() * avengersNames.length)];

      try {
        // Open the session
        await VoxeetSDK.session.open({ name: randomName });
      } catch (e) {
        alert("Something went wrong : " + e);
      }
    };

    main();
  }, []);

  return (
    <div className="video-interface">
      {/* This componnent will house the stream sharing and also display information regarding it */}
      <div className="video-interface__view-area">
        {/* view area */}
        <div className="video-interface__view-area__viewers">
          {/* number of viewers */}
          <p>500 Watching</p>
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
              onClick={() => startScreenShare()}
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
