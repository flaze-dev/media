import Page from "core/Page";
import { MediaDevices as MediaDevices2 } from "lib";
import { useMediaPermission } from "lib/hooks/useMediaPermission";
import { useMediaSupported } from "lib/hooks/useMediaSupported";
import React, { FC } from "react";


/**
 * Index Page
 * @author Ingo Andelhofs
 */
const IndexPage: FC = () => {
  const sm = useMediaSupported('media');
  const ss = useMediaSupported('screen');

  const micPermission = useMediaPermission('microphone');
  const camPermission = useMediaPermission('webcam');
  const screenPermission = useMediaPermission('screen');


  // Listeners
  const onRequestCamMic = async () => {
    await MediaDevices2.requestWebcamAndMicrophone();
  }

  const onRequestMic = async () => {
    await MediaDevices2.requestMicrophone();
  }

  const onRequestCam = async () => {
    await MediaDevices2.requestWebcam();
  }

  const onRequestScreen = async () => {
    await MediaDevices2.requestScreen();
  }

  // Rendering
  const getColor = (str: string) => {
    if (str === 'denied') {
      return 'red';
    }

    if (str === 'granted') {
      return 'green';
    }

    if (str === 'prompt') {
      return 'orange';
    }

    return 'gray';
  }

  const renderPermission = (permission: PermissionState) => {

    return <b style={{ color: getColor(permission) }}>{permission}</b>;
  }

  const render = () => {

    return <Page style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1>Media Devices</h1>
        <h2>Permissions</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span><b>Mic</b>: {renderPermission(micPermission)}</span>
        <span><b>Cam</b>: {renderPermission(camPermission)}</span>
        <span><b>Screen</b>: {renderPermission(screenPermission)}</span>
      </div>

      <h2>Support</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>Media: <b style={{ color: sm ? 'green' : 'red' }}>{sm.toString()}</b></span>
        <span>Screen: <b style={{ color: ss ? 'green' : 'red' }}>{ss.toString()}</b></span>
      </div>

      <h2>Requesting</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <button onClick={onRequestCamMic} style={{ width: 'max-content' }}>Request Cam + Mic</button>
        <button onClick={onRequestMic} style={{ width: 'max-content' }}>Request Mic</button>
        <button onClick={onRequestCam} style={{ width: 'max-content' }}>Request Cam</button>
        <button onClick={onRequestScreen} style={{ width: 'max-content' }}>Request Screen</button>
      </div>
    </Page>;
  }

  return render();
}


export default IndexPage;
