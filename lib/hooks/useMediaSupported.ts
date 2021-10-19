import { useEffect, useState } from "react";
import MediaDevices from '../devices/MediaDevices';

type MediaType = 'media' | 'screen';



/**
 * useMediaPermission Hook
 * @author Ingo Andelhofs
 */
export const useMediaSupported = (mediaType: MediaType): boolean => {
  const [supported, setSupported] = useState<boolean>(false);

  useEffect(() => {
    if (mediaType === 'media') {
      const sm = MediaDevices.isMediaSupported();
      setSupported(sm);
    }

    if (mediaType === 'screen') {
      const ss = MediaDevices.isScreenSupported();
      setSupported(ss);
    }
  }, []);

  return supported;
}