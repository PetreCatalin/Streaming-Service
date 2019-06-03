export class RgbUtils {
    
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray
    // Converts from rgba Uint8ClampedArray to an rgb one. // size/4*3
    public static toRgbUint8ClampedArray(pixels: any[]): Uint8ClampedArray {  
        const imageSize  = Math.floor(pixels.length / 4)
        const outputPixels = new Uint8ClampedArray(imageSize * 3)
        for (let idx = 0; idx < imageSize; idx++) {
          for (let chan = 0; chan < 3; chan++) {
            outputPixels[idx * 3 + chan] = pixels[idx * 4 + chan]
          }
        }
        return outputPixels;
    }

    // Converts from rgb Uint8ClampedArray to an rgba one. //size*4/3
    public static toRgbaUint8ClampedArray(pixels: any[]): Uint8ClampedArray {
        const imageSize  = Math.floor(pixels.length / 3)
        const outputPixels = new Uint8ClampedArray(imageSize * 4)
        for (let idx = 0; idx < imageSize; idx++) {
        for (let chan = 0; chan < 3; chan++) {
            outputPixels[idx * 4 + chan] = pixels[idx * 3 + chan]
        }
        outputPixels[idx * 4 + 3] = 255;
        }
        return outputPixels;
    }
}
