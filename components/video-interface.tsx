import React from "react";
// import vortex
import VoxeetSDK from "@voxeet/voxeet-web-sdk";
// import useState
import { useState } from "react";
import { PeerConnection } from "@millicast/sdk";
import { Director, Publish, View } from "@millicast/sdk";

const VideoInterface = () => {
  // state to manage screenshare
  // const [isSharing, setIsSharing] = useState(false);
  // const serverURL = "";

  // const capabilities = PeerConnection.getCapabilities("video");
  // console.log(capabilities);

  //   // Publishing Options
  //   const broadcastOptions = {
  //     mediaStream: mediaStream,
  //   };

  //   // Start broadcast
  //   try {
  //     await publisher.connect(broadcastOptions);
  //   } catch (e) {
  //     console.error("Connection failed, handle error", e);
  //   }
  // };
  // getCam();

  const handleScreenShare = async () => {
    const displayMediaOptions = {
      video: {
        displaySurface: "window",
      },
      audio: false,
    };

    const screenCapture = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );

    const broadcastOptions = {
      mediaStream: screenCapture,
    };

    const tokenGenerator = () =>
      Director.getPublisher({
        token:
          "4811b659922ebd118b7fe41cedb5f77662a37215b462d9807b3a3dfac0afe012",
        streamName: "myStreamName",
      });
    const publisher = new Publish("myStreamName", tokenGenerator);
    try {
      const mediaStream = await publisher.connect(broadcastOptions);
    } catch (e) {
      console.error("Connection failed, handle error", e);
    }

    // Create callback to generate a new token
    const ViewtokenGenerator = () =>
      Director.getSubscriber({
        streamName: "myStreamName",
        streamAccountId: "875058156",
        subscriberToken: "27df13e796d7b2bea982d375ad813d7fc79b6fb52de23aca267a874e624990af", // Optional: This token is needed if you're subscribing to a secure stream,
        // This token should be provided by the publish owner.
      });

    // Create Millicast instance
    const millicastView = new View("publish-stream-name", ViewtokenGenerator);
  };

  handleScreenShare();

  return (
    <div className="video-interface">
      {/* This componnent will house the stream sharing and also display information regarding it */}
      <div className="video-interface__view-area">
        {/* view area */}
        <div className="video-interface__view-area__viewers">
          {/* number of viewers */}
          <p>500 Watching</p>
        </div>
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
            <button className="video-interface__stream-info__stream__actions__share">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInterface;
