import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ElementRenderer } from '../utils/ElementRenderer';
import { SocketService } from '../services/socket.service';

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

  //this may change to 'You are currently broadcasting a video' or 'You are currently watching a video streamed by Userxxx'
  //this must be changed when clicking on a user in active-users component
  constructor(private socketService: SocketService) {
    this.socketService.onStreamReceived((data:any) => { //cand se primeste streamul
      return this.onStreamReceived(data);
    })
  }

  ngOnInit() {
    this.getChosenFileName();
  }

  ngAfterViewInit() {
    this.videoPlayer = document.getElementById('video_player');
    this.streamPreview = document.getElementById('stream_preview');
    this.streamContext = this.streamPreview.getContext('2d');
    //this.renderer = new ElementRenderer({ width: 320, height: 240 });  //change those values    !!! need to look how I insantiate an element renderer
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
    //let type = file.type;
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
    this.broadcastingInterval = setInterval(() => this.sendSnapshot(), 100); //send data every 100 miliseconds
  }

  private endBroadcasting() {
    this.broadcastingMessage = 'You are currently not broadcasting a video';
    clearInterval(this.broadcastingInterval); //stop sending data
  }

  private sendSnapshot() { //begin to start streaming to other users
    this.renderer.getEncryptedDataURL(this.videoPlayer, (data: any) => {
      this.socketService.sendStream(data);
    });
  }

  private onStreamReceived(data: any) { //cand se primeste streamul de la alti utilizatori
    this.renderer.decryptDataURLInCanvas(data, this.streamPreview);
  }

}
