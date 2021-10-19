import MediaDevices from "./MediaDevices";

type DeviceInputType = 'videoinput' | 'audioinput';

export type DeviceType = 'screen' | 'webcam' | 'microphone';

type PermissionType = 'microphone' | 'camera' | 'display-capture';



/**
 * MediaDevicePermissions Class
 * @author Ingo Andelhofs
 */
class MediaDevicePermissions {

  // Constants
  private static readonly permissionMapping: { [key: string]: PermissionType } = {
    'screen': 'display-capture',
    'microphone': 'microphone',
    'webcam': 'camera',
  };

  private static readonly deviceMapping: { [key: string]: DeviceInputType } = {
    'webcam': 'videoinput',
    'microphone': 'audioinput',
  };


  // Members
  private static permissions: { [key: string]: PermissionState } = {
    'microphone': 'prompt',
    'webcam': 'prompt',
    'screen': 'prompt',
  };

  private static callbacks: Map<DeviceType, Array<(permission: PermissionState) => void>> = new Map();


  // Static API
  public static supported(): boolean {
    return 'permissions' in navigator;
  }

  public static getInitial(type: DeviceType): PermissionState {
    MediaDevicePermissions.loadInitial(type);
    return MediaDevicePermissions.permissions[type];
  }

  public static async loadInitial(type: DeviceType): Promise<void> {
    if ((type === 'microphone' || type === 'webcam') && !MediaDevices.isMediaSupported()) {
      MediaDevicePermissions.updatePermission(type, 'denied');
      return;
    }

    if (type === 'screen' && !MediaDevices.isScreenSupported()) {
      MediaDevicePermissions.updatePermission(type, 'denied');
      return;
    }

    if (!MediaDevicePermissions.supported()) {
      const permission = await MediaDevicePermissions.getBasedOnDeviceLabel(type);
      MediaDevicePermissions.updatePermission(type, permission);
      return;
    }

    try {
      const permissionName = <PermissionName>MediaDevicePermissions.permissionMapping[type];
      const result = await navigator.permissions.query({ name: permissionName });

      result.onchange = () => {
        MediaDevicePermissions.updatePermission(type, result.state);
      };

      MediaDevicePermissions.updatePermission(type, result.state);
      return;
    }
    catch (error) {
      const permission = await MediaDevicePermissions.getBasedOnDeviceLabel(type);
      MediaDevicePermissions.updatePermission(type, permission);
      return 
    }
  }


  // Getters
  public static async get(type: DeviceType): Promise<PermissionState> {
    if (!MediaDevicePermissions.supported()) {
      return await MediaDevicePermissions.getBasedOnDeviceLabel(type);
    }

    try {
      const permissionName = <PermissionName>MediaDevicePermissions.permissionMapping[type];
      const result = await navigator.permissions.query({ name: permissionName });

      result.onchange = () => {
        MediaDevicePermissions.updatePermission(type, result.state);
      };

      return result.state;
    }
    catch (error) {
      return await MediaDevicePermissions.getBasedOnDeviceLabel(type);
    }
  }

  public static async getBasedOnDeviceLabel(type: DeviceType): Promise<PermissionState> {
    if (this.permissions[type] !== 'prompt') {
      return this.permissions[type];
    }

    if (type === "screen") {
      return "prompt";
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const deviceKind = MediaDevicePermissions.deviceMapping[type];

      const devicesOfKind = devices.filter((device: MediaDeviceInfo) => {
        return device.kind === deviceKind;
      });

      const granted = devicesOfKind.length > 0 && devicesOfKind.every((device: MediaDeviceInfo) => {
        return device.deviceId.length > 0 && device.label.length > 0;
      });

      if (granted) {
        return "granted";
      }
    }
    catch (error) {
      return "denied";
    }

    return "prompt";
  }


  // Setters
  public static updatePermission(type: DeviceType, permission: PermissionState): void {
    MediaDevicePermissions.permissions[type] = permission;

    // Emit
    const callbacks = MediaDevicePermissions.callbacks.get(type) ?? [];
    callbacks.forEach((callback: (permission: PermissionState) => void) => callback(permission));
  }

  // Listeners
  public static onChange(type: DeviceType, callback: (permission: PermissionState) => void): void {
    // Listen
    const callbacks = MediaDevicePermissions.callbacks.get(type) ?? [];
    const updatedCallbacks = [...callbacks, callback];
    MediaDevicePermissions.callbacks.set(type, updatedCallbacks);
  }
}

export default MediaDevicePermissions;
