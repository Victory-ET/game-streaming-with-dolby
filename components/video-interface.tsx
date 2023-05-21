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

  // default role is streamer
  const userRole = role ? role : "Streamer";

  // Set the name of the current logged in user
  const [name, setName] = useState<string>("");
  // manage number of participants
  const [participants, setParticipants] = useState<any[]>([]);
  // name of the conference
  const conferenceName = "gaming-room";
  useEffect(() => {
    const main = async () => {
      // Generate a client access token from the Dolby.io dashboard and insert into access_token variable
      let access_token = process.env.NEXT_PUBLIC_CLIENT_ACCESS_TOKEN as string;
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
         * 1. Create a conference room with an the defined conference name
         * 2. Join the conference with user defined name
         */
        VoxeetSDK.conference
          .create({ alias: conferenceName })
          .then((conference) => VoxeetSDK.conference.join(conference, {}))
          .catch((err) => console.error(err));

        // Listen to participant events
        VoxeetSDK.conference.on("participantAdded", (participant) => {
          setParticipants((prevParticipants) => [
            ...prevParticipants,
            participant,
          ]);
        });
      } catch (e) {
        alert("Something went wrong : " + e);
      }
    };

    main();
  }, []);

  const sharingScreen = async () => {
    if (userRole.toLowerCase() === "streamer") {
      // if user is a streamer, they can start screen sharing. If a screen is already been shared it will alert the user
      VoxeetSDK.conference
        .startScreenShare()
        .then(() => {
          console.log("Screen sharing started");
          displayStream(videoRef.current as HTMLVideoElement);
        })
        .catch((err) => console.error(err));
    } else {
      // if user is a viewer, they will be alerted that they won't be able to share their screen
      alert("welcome viewer");
      displayStream(videoRef.current as HTMLVideoElement);
    }
  };

  const displayStream = (videoElement: HTMLVideoElement) => {
    // dis play the stream
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
          <p>
            {participants.length} Watching, you are logged in as {name}
          </p>
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
