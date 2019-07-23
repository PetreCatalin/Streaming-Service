import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { RgbUtils } from '../utils/RgbUtils';

declare var $: any;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, AfterViewInit {
  private broadcasting = false; //this will be set to true when I start to broadcast
  private broadcastingMessage: string = 'You are currently not broadcasting a video';
  private fileName: string;
  private broadcastingInterval: any;
  private renderer: any;
  private videoPlayer: any;
  private streamPreview: any;
  private streamContext: any;
  private socket: any;
  private width: number = 300; //dimensiunile canvasului pentru preview(look in css - 400/200 normally  --400*200*3 pixels values)
  private height: number = 175;

  //this may change to 'You are currently broadcasting a video' or 'You are currently watching a video streamed by Userxxx'
  //this must be changed when clicking on a user in active-users component
  constructor(private socketService: SocketService) {
    this.socket = this.socketService.getSocket();
    this.socketService.onStreamReceived((data:any) => { //cand se primeste streamul
      return this.onStreamReceived(data);
    })
    console.warn('socketId', this.socket.id);
  }

  ngOnInit() {
    this.getChosenFileName();
    this.getDecryptedDataFromServer();
  }

  ngAfterViewInit() {
    this.videoPlayer = document.getElementById('video_player');
    this.streamPreview = document.getElementById('stream_preview');
    this.streamContext = this.streamPreview.getContext('2d');
    this.socket.emit('createElementRenderer', (data:any) => {
      console.log('data', data);
    });
  }

  private getChosenFileName() { //https://codepen.io/sazzad/pen/antDJ 
    $('#chooseFile').bind('change', function (event:any) {
      this.fileName = $("#chooseFile").val(); //http://jsfiddle.net/dsbonev/cCCZ2/?utm_source=website&utm_medium=embed&utm_campaign=cCCZ2 -- this is to run video in browser
      console.warn('filename', this.fileName);
      if (/^\s*$/.test(this.fileName)) {
        $(".file-upload").removeClass('active');
        $("#noFile").text("No file chosen..."); 
      }
      else {
        $(".file-upload").addClass('active');
        $("#noFile").text(this.fileName.replace("C:\\fakepath\\", "")); 
      }

    let file= this.files[0]; //this is the selected file
    var videoNode = document.querySelector('video');

    var fileURL = URL.createObjectURL(file);
    videoNode.src = fileURL;
    });

  }

  private userSelected(userName: string) {
    this.broadcastingMessage = 'You are currently watching a video streamed by ' + userName; //maybe this user must be taken from the graph
  }

  private toggleBroadcast() {
    this.broadcasting = !this.broadcasting;
    if (this.broadcasting === true) this.startBroadcasting();
      else
    this.endBroadcasting();
  }

  private startBroadcasting() {
    this.broadcastingMessage = 'You are currently broadcasting a video';
    this.broadcastingInterval = setInterval(() => this.sendSnapshot(), 400); //send data every 100 miliseconds normally, change for testing
  }

  private endBroadcasting() {
    this.broadcastingMessage = 'You are currently not broadcasting a video';
    clearInterval(this.broadcastingInterval); //stop sending data
  }

  private sendSnapshot() { //begin to start streaming to other users
    this.getEncryptedDataURL(this.videoPlayer, (data: any) => {
      console.warn('data', data);
      this.socketService.sendStream(data); //trimit textul catre ceilalti utilizatori
    });
  }

  private onStreamReceived(data: any) { //cand se primeste streamul de la alti utilizatori
    //this.renderer.decryptDataURLInCanvas(data, this.streamPreview);
  }

  private getEncryptedDataURL(element:any, callback:any) {
    console.time('Encryption Process'); //console.time(x) and console.timeEnd(x) --> this measure how much time the function between them needs to execute
    const canvas = this.createAndDrawInCanvas(element);
    const imgData = this.getImageData(canvas.getContext('2d'));
    const rgbPixels: Uint8ClampedArray = RgbUtils.toRgbUint8ClampedArray(imgData.data); //fac to rgb pentru cripare, voi face mai tarziu to rgba pentru decriptate
    //console.warn('imgData.data', imgData.data); //80000
    console.warn('rgbPixelsSentToEnctyption', rgbPixels); // (200*100*4)80000 => (200*100*3)60000 (se elimina ultimul filtru)

    this.socket.emit('sendDataToBeEncrypted', rgbPixels); //trimit pixelii care vor fi criptati pe server
    console.timeEnd('Encryption Process');
  }

  private createAndDrawInCanvas(element: any) {
    const canvas = this.createCanvas(this.width, this.height); //width si height de aici //this.renderer = new ElementRenderer({ width: 320, height: 240 });  //change those values
    const context = canvas.getContext('2d');
    context.drawImage(element, 0, 0, this.width, this.height);
    return canvas;
  }

  private createCanvas(width = this.width, height = this.height) {
    const canvas = document.createElement('canvas');
    canvas.width = width, canvas.height = height;
    return canvas;
  }

  private getImageData(context: any) {
    return context.getImageData(0, 0, this.width, this.height);
  }

  private getDecryptedDataFromServer() {
    this.socket.on('sendDectyptedDataToClient', (rgbDecrypted) => {
      //console.warn('rgbPixelsDecryptedFromServer', rgbDecrypted); //(200*100*3) 60000
      let rgbPixels = []; let size = this.width * this.height * 3;
      for (let i=0;i<size;++i) {
        rgbPixels.push(rgbDecrypted[i])
      }
      let rgbaDecrypted = RgbUtils.toRgbaUint8ClampedArray(rgbPixels); //(200*100*4) 80000
      console.warn('rgbaPixelsDecrypted', rgbaDecrypted);

      this.addDecryptedPixelsToPreviewCanvas(rgbaDecrypted);
    });
  }

  private addDecryptedPixelsToPreviewCanvas(rgbaDecrypted: Uint8ClampedArray): void {
    const decriptedCanvas = this.createCanvas();
    const decriptedContext = decriptedCanvas.getContext('2d');
    const decriptedImageData = this.getImageData(decriptedContext);

    decriptedImageData.data.set(rgbaDecrypted);
    decriptedContext.putImageData(decriptedImageData, 0, 0);

    const context = this.streamPreview.getContext('2d');
    context.drawImage(decriptedCanvas, 0, 0, this.width, this.height);
    console.warn('pixels added to canvas');
  }
  
}
