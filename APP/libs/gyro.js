export default function useGyro() {
  const propagateEvent = (event) => api.onValue(event);
  const api = {
    isActive: false,
    onValue: () => {},
    disable: () => {
      api.isActive = false;
      window.removeEventListener("devicemotion", propagateEvent);
    },
    enable: async () => {
      if (api.isActive) return true;
      //   //   const response = await DeviceOrientationEvent.requestPermission();
      //   api.isActive = response === "granted";
      //   if (window.DeviceOrientationEvent) {
      //     window.addEventListener(
      //       "deviceorientation",
      //       (event) => api.onValue(event),
      //       true
      //     );
      //   }

      if (typeof DeviceMotionEvent.requestPermission === "function") {
        // Handle iOS 13+ devices.
        DeviceMotionEvent.requestPermission()
          .then((state) => {
            if (state === "granted") {
              window.addEventListener("devicemotion", propagateEvent);
            } else {
              console.error("Request to access the orientation was rejected");
            }
          })
          .catch(console.error);
      } else {
        // Handle regular non iOS 13+ devices.
        window.addEventListener("devicemotion", propagateEvent);
      }

      return api.isActive;
    },
  };

  return api;
}
