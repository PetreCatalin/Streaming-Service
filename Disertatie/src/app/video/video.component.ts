import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  private broadcasting = false; //this will be set to true when I start to broadcast
  constructor() { }

  ngOnInit() {
    this.getChosenFileName();
  }

  private getChosenFileName() { //https://codepen.io/sazzad/pen/antDJ
    $('#chooseFile').bind('change', function () {
      var filename = $("#chooseFile").val();
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
  }

}
