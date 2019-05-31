import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  private broadcasting = false; //this will be set to true when I start to broadcast
  public broadcastingMessage: string = 'You are currently not broadcasting a video';
  //this may change to 'You are currently broadcasting a video' or 'You are currently watching a video streamed by Userxxx'
  //this must be changes when clicking on a user in active-users component
  constructor() { }

  ngOnInit() {
    this.getChosenFileName();
  }

  private getChosenFileName() { //https://codepen.io/sazzad/pen/antDJ
    $('#chooseFile').bind('change', function () {
      var filename = $("#chooseFile").val();
      console.warn('filename', filename);
      if (/^\s*$/.test(filename)) {
        $(".file-upload").removeClass('active');
        $("#noFile").text("No file chosen..."); 
      }
      else {
        $(".file-upload").addClass('active');
        $("#noFile").text(filename.replace("C:\\fakepath\\", "")); 
      }
    });
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
