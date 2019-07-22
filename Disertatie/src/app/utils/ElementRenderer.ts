import { RgbUtils } from './RgbUtils';
import base64js  from 'base64-js'; //https://www.npmjs.com/package/base64-js

export class ElementRenderer {
    private width: number;
    private height: number;
    private format: string;
    private cipher: any;

    constructor(options) {
        this.width = options.width;
        this.height = options.height;
        this.format = options.format || 'image/png';
    
        // this.cipher = new PwlcmSpicCipher3();
        // this.cipher.initKey({ x1: 0.1567, y1: 0.3219, r1: 0.2, m1: 2015,
        //              x2: 0.4567, y2: 0.1111, r2: 0.3, m2: 2016, iv: 123456 });
      }

    public createCanvas(width = this.width, height = this.height) {
        const canvas = document.createElement('canvas');
        canvas.width = width, canvas.height = height;
        return canvas;
    }

    public createAndDrawInCanvas(element: any) {
        const canvas = this.createCanvas(this.width, this.height);
        const context = canvas.getContext('2d');
        context.drawImage(element, 0, 0, this.width, this.height);
        return canvas;
    }

    public getImageData(context: any) {
        return context.getImageData(0, 0, this.width, this.height);
    }

    public getEncryptedDataURL(element:any, callback:any) {
        console.time('Encryption Process'); //console.time(x) and console.timeEnd(x) --> this measure how much time the function between them needs to execute
    
        const canvas = this.createAndDrawInCanvas(element);
        const imgData = this.getImageData(canvas.getContext('2d'));
        const rgbPixels = RgbUtils.toRgbUint8ClampedArray(imgData.data);
        const rgbEncrypted = this.cipher.encrypt(rgbPixels);
        callback(base64js.fromByteArray(rgbEncrypted));
    
        console.timeEnd('Encryption Process');
    }

    public decryptDataURLInCanvas(data:any, canvas:any, callback:any) {
        console.time('Decryption Process');
    
        const dCanvas = this.createCanvas();
        const dContext = dCanvas.getContext('2d');
        const dImageData = this.getImageData(dContext);
    
        const rgbPixels = base64js.toByteArray(data);
        const rgbDecrypted = this.cipher.decrypt(rgbPixels);
        const rgbaDecrypted = RgbUtils.toRgbaUint8ClampedArray(rgbDecrypted);
    
        dImageData.data.set(rgbaDecrypted);
        dContext.putImageData(dImageData, 0, 0);
    
        const context = canvas.getContext('2d');
        context.drawImage(dCanvas, 0, 0, canvas.width, canvas.height);
        if (callback) callback(canvas);
    
        console.timeEnd('Decryption Process');
    }
}
