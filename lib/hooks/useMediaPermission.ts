import MediaDevicePermissions, { DeviceType } from "lib/devices/MediaDevicePermissions";
import { useCallback, useEffect, useState } from "react"


/**
 * useMediaPermission Hook
 * @author Ingo Andelhofs
 */
export const useMediaPermission = (deviceType: DeviceType): PermissionState => {

  const [permission, setPermission] = useState<PermissionState>('prompt');

  const onPermissionChange = useCallback((permission: PermissionState) => {
    setPermission(permission);
  }, [setPermission]);

  useEffect(() => {
    MediaDevicePermissions.onChange(deviceType, onPermissionChange);
    MediaDevicePermissions.loadInitial(deviceType);
  }, []);

  return permission;
}