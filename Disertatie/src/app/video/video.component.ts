import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  private broadcasting = false; //this will be set to true when I start to broadcast
  private broadcastingMessage: string = 'You are currently not broadcasting a video';
  private fileName: string;
  //this may change to 'You are currently broadcasting a video' or 'You are currently watching a video streamed by Userxxx'
  //this must be changed when clicking on a user in active-users component
  constructor() { }

  ngOnInit() {
    this.getChosenFileName();
  }

  private getChosenFileName() { //https://codepen.io/sazzad/pen/antDJ 
    $('#chooseFile').bind('change', function () {
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
    });
  }

  private userSelected(userName: string) {
    this.broadcastingMessage = 'You are currently watching a video streamed by ' + userName; //maybe this user must be taken from the graph
  }

  private toggleBroadcast() {
    this.broadcasting = !this.broadcasting;
    if (this.broadcasting === true) this.startBroadcasting();
    else this.endBroadcasting();
  }

  private startBroadcasting() {
    this.broadcastingMessage = 'You are currently broadcasting a video';
  }

  private endBroadcasting() {
    this.broadcastingMessage = 'You are currently not broadcasting a video';
  }

}
