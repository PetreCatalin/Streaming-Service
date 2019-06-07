import { PwlcmSpicCipher3 } from 'chaotic-image-crypto/lib/bindings';
import { toRgbUint8ClampedArray, toRgbaUint8ClampedArray } from './ArrayUtils'
import base64js from 'base64-js';

export default class ElementRenderer {

  constructor(options) {
    this.width = options.width
    this.height = options.height
    this.format = options.format || 'image/png'

    this.cipher = new PwlcmSpicCipher3();
    this.cipher.initKey({ x1: 0.1567, y1: 0.3219, r1: 0.2, m1: 2015,
                 x2: 0.4567, y2: 0.1111, r2: 0.3, m2: 2016, iv: 123456 })
  }

  _createCanvas(width = this.width, height = this.height) {
    const canvas = document.createElement('canvas')
    canvas.width = width, canvas.height = height
    return canvas
  }

  _createAndDrawInCanvas(element) {
    const canvas = this._createCanvas(this.width, this.height)
    const context = canvas.getContext('2d')
    context.drawImage(element, 0, 0, this.width, this.height)
    return canvas
  }

  _getImageData(context) {
    return context.getImageData(0, 0, this.width, this.height)
  }

  drawInCanvas(element) {
    return this._createAndDrawInCanvas(element)
  }

  getEncryptedDataURL(element, callback) {
    console.time('Encryption Process')

    const canvas = this._createAndDrawInCanvas(element)
    const imgData = this._getImageData(canvas.getContext('2d'))
    const rgbPixels = toRgbUint8ClampedArray(imgData.data)
    const rgbEncrypted = this.cipher.encrypt(rgbPixels)

    callback(base64js.fromByteArray(rgbEncrypted));

    console.timeEnd('Encryption Process')
  }

  decryptDataURLInCanvas(data, canvas, callback) {
    console.time('Decryption Process')

    const dCanvas = this._createCanvas()
    const dContext = dCanvas.getContext('2d')
    const dImageData = this._getImageData(dContext)

    const rgbPixels = base64js.toByteArray(data)
    const rgbDecrypted = this.cipher.decrypt(rgbPixels);
    const rgbaDecrypted = toRgbaUint8ClampedArray(rgbDecrypted);

    dImageData.data.set(rgbaDecrypted)
    dContext.putImageData(dImageData, 0, 0)

    const context = canvas.getContext('2d')
    context.drawImage(dCanvas, 0, 0, canvas.width, canvas.height);
    if (callback) callback(canvas)

    console.timeEnd('Decryption Process')
  }
}