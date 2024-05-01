export default class Utils {
  constructor() {}

  static async preloadImages(name, count) {
    const promises = [];
    for (let i = 1; i <= count; i++) {
      const path = `${name}${i}.png`; // Chemin des images
      promises.push(
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve(img);
          img.src = path;
        })
      );
    }
    return Promise.all(promises);
  }
}
