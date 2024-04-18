


export default function useGyro() {

    const api = {
        isActive: false,
        onValue: () => { },
        enable: async () => {
            if (api.isActive) return true;
            const response = await DeviceOrientationEvent.requestPermission()
            api.isActive = response === 'granted'
            if (window.DeviceOrientationEvent) {
                window.addEventListener(
                    "deviceorientation",
                    (event) => api.onValue(event),
                    true,
                );
            }

            return api.isActive
        }
    }

    return api;
}