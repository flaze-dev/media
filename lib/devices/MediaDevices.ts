import MediaDevicePermissions from "./MediaDevicePermissions";


type Constraints = {
  'microphone': any;
  'webcam': any;
  'screen': any;
};



/**
 * MediaDevices Class
 * @author Ingo Andelhofs
 */
class MediaDevices {

  // Support
  public static isMediaSupported(): boolean {
    return 'getUserMedia' in navigator.mediaDevices;
  }

  public static isScreenSupported(): boolean {
    return 'getDisplayMedia' in navigator.mediaDevices;
  }


  // Request Media
  public static requestWebcamAndMicrophone = async (id?: string) => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      MediaDevicePermissions.updatePermission('microphone', 'granted');
      MediaDevicePermissions.updatePermission('webcam', 'granted');
    }
    catch (error) {
      if (error instanceof DOMException) {

        if (error.name === 'NotAllowedError') {
          await MediaDevices.requestMicrophone(id);
          await MediaDevices.requestWebcam(id);
        }

        return;
      }

      console.warn("UNKNOWN ERROR");
    }
  }

  public static requestMicrophone = async (id?: string) => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      MediaDevicePermissions.updatePermission('microphone', 'granted');
    }
    catch (error) {
      if (error instanceof DOMException) {

        if (error.name === 'NotAllowedError') {
          MediaDevicePermissions.updatePermission('microphone', 'denied');
        }

        return;
      }

      console.warn("UNKNOWN ERROR");
    }
  }

  public static requestWebcam = async (id?: string) => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      MediaDevicePermissions.updatePermission('webcam', 'granted');
    }
    catch (error) {
      if (error instanceof DOMException) {

        if (error.name === 'NotAllowedError') {
          MediaDevicePermissions.updatePermission('webcam', 'denied');
        }

        return;
      }

      console.warn("UNKNOWN ERROR");
    }
  }

  public static requestScreen = async (id?: string) => {
    if (!MediaDevices.isScreenSupported()) {
      MediaDevicePermissions.updatePermission('screen', 'denied');
      return;
    }

    try {
      await (navigator.mediaDevices as any).getDisplayMedia();
      MediaDevicePermissions.updatePermission('screen', 'granted');
    }
    catch (error) {
      if (error instanceof DOMException) {
        console.log(error.name, error.code);


        if (error.name === 'NotAllowedError') {
          console.log('update');
          MediaDevicePermissions.updatePermission('screen', 'denied');
        }

        return;
      }

      console.warn("UNKNOWN ERROR");
    }
  }

}

export default MediaDevices;
