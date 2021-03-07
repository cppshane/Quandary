import { Component, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router"
import { PageMode } from '../../enums/page-mode.enum';
import { ClassificationObject } from '../../models/classification-object.model';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

import { Guid } from "guid-typescript";
import { VideoStreamService } from '../../services/video-stream.service';
import { ClassificationObjectType } from '../../enums/classification-object-type.enum';

declare const RecordRTC: any;
declare const randomColor: any;

declare const knnClassifier: any;
declare const mobilenet: any;
declare const tf: any;

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.css']
})
export class ClassificationComponent {
  @ViewChild('mainCanvas', { static: false }) mainCanvasViewChild;

  mainCanvasElement: HTMLCanvasElement;
  mainCanvasContext: CanvasRenderingContext2D;

  pageMode: PageMode;
  project: Project;
  object: ClassificationObject;
  recording = false;

  net: any;

  constructor(private projectService: ProjectService, private videoStreamService: VideoStreamService, private route: ActivatedRoute, private router: Router) {
    this.loadComponents();
  }

  async loadComponents() {
    this.net = await mobilenet.load();
  }

  ngAfterViewInit() {
    this.mainCanvasElement = this.mainCanvasViewChild.nativeElement;
    this.mainCanvasContext = this.mainCanvasElement.getContext("2d");
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.projectId) {
        this.project = this.projectService.getProject(params.projectId);

        if (params.objectId) {
          this.object = this.project.getClassificationObject(params.objectId);

          if (params.pageId) {
            if (params.pageId === 'collect-data') {
              this.pageMode = PageMode.CollectDataPage;
            }
            if (params.pageId === 'record-video') {
              this.pageMode = PageMode.RecordVideoPage;
            }
            if (params.pageId === 'test-model') {
              this.pageMode = PageMode.TestModelPage;

              this.startTestingModel();
            }
          }
          else {
            this.pageMode = PageMode.SummaryPage;
          }
        }
        else {
          this.pageMode = PageMode.NoPage;
        }
      }
      else {
        this.router.navigate(['/classification/' + this.projectService.projects[0].Id]);
      }
    });
  }

  newObjectButtonClick() {
    let newObject = new ClassificationObject();
      
    newObject.Id = Guid.create().toString();
    newObject.Title = 'New Object';
    newObject.Color = randomColor();

    this.project.ClassificationObjects.push(newObject);
  }

  recordFromWindowButtonClick() {
    let mediaConstraints = {
      video: true,
      audio: false
    };

    const mediaDevices = navigator.mediaDevices as any;

    mediaDevices
      .getDisplayMedia(mediaConstraints)
      .then(this.recordStreamSuccessCallback.bind(this), this.recordStreamErrorCallback.bind(this));
  }

  recordFromWebcamButtonClick() {
    let mediaConstraints = {
      video: true,
      audio: false
    };

    const mediaDevices = navigator.mediaDevices as any;

    mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.recordStreamSuccessCallback.bind(this), this.recordStreamErrorCallback.bind(this));
  }

  testModelButtonClick() {
    let mediaConstraints = {
      video: true,
      audio: false
    };

    const mediaDevices = navigator.mediaDevices as any;

    mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.testModelStreamSuccessCallback.bind(this), this.testModelStreamErrorCallback.bind(this));
  }

  recordStreamSuccessCallback(stream: MediaStream) {
    var options = {
      mimeType: 'video/webm',
      frameRate: 60
    };

    this.videoStreamService.stream = stream;
    //this.videoStreamService.recordRTC = RecordRTC(stream, options);
    //this.videoStreamService.recordRTC.startRecording();

    this.router.navigate(['/classification/' + this.project.Id + '/' + this.object.Id + '/record-video']);
  }

  recordStreamErrorCallback() {

  }

  testModelStreamSuccessCallback(stream: MediaStream) {
    var options = {
      mimeType: 'video/webm',
      frameRate: 60
    };

    this.videoStreamService.stream = stream;
    //this.videoStreamService.recordRTC = RecordRTC(stream, options);
    //this.videoStreamService.recordRTC.startRecording();

    this.router.navigate(['/classification/' + this.project.Id + '/' + this.object.Id + '/test-model']);
  }

  testModelStreamErrorCallback() {

  }

  recordingButtonClick() {
    if (!this.recording) {
      this.recording = true;

      this.startStreamImageExtraction();
    }
    else {

      this.recording = false;
    }
  }

  async startStreamImageExtraction() {
    while (this.recording) {
      let mainVideoElement = <HTMLVideoElement>document.getElementById('main-video');

      this.mainCanvasElement.width = mainVideoElement.videoWidth;
      this.mainCanvasElement.height = mainVideoElement.videoHeight;
      this.mainCanvasContext.translate(mainVideoElement.videoWidth, 0);
      this.mainCanvasContext.scale(-1, 1);
      this.mainCanvasContext.drawImage(mainVideoElement, 0, 0, mainVideoElement.videoWidth, mainVideoElement.videoHeight);

      this.object.Data.push(this.mainCanvasElement.toDataURL());
      this.object.Tensors.push(tf.browser.fromPixels(this.mainCanvasElement));

      await this.sleep(250)
    }
  }
  
  async trainModelButtonClick() {
    this.project.Classifier = knnClassifier.create();

    for (let classificationObject of this.project.ClassificationObjects) {
      if (classificationObject.Type == ClassificationObjectType.StateDetection) {
        for (let tensor of classificationObject.Tensors) {
          const activation = this.net.infer(tensor, true);
          this.project.Classifier.addExample(activation, classificationObject.Id);
        }
      }
    }
  }

  async startTestingModel() {
    while (true) {
      try {
        let mainVideoElement = <HTMLVideoElement>document.getElementById('main-video');

        const activation = this.net.infer(tf.browser.fromPixels(mainVideoElement), 'conv_preds');

        const result = await this.project.Classifier.predictClass(activation);

        for (let object of this.project.ClassificationObjects) {
          if (object.Type === ClassificationObjectType.StateDetection) {
            object.DetectionConfidence = result.confidences[object.Id];
          }
        }
      }
      catch (e) {
        console.log(e)
      }

      await this.sleep(1000);
    }
  }

  sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  recordingButtonInnerHTML() {
    return this.recording ? '<i class="fas fa-square"></i><p>Stop Recording</p>' : '<i class="fas fa-circle"></i><p>Start Recording</p>';
  }

  objectDataListItemClick(data) {
    console.log(data);
  }

  noPage() {
    return this.pageMode === PageMode.NoPage;
  }

  summaryPage() {
    return this.pageMode === PageMode.SummaryPage;
  }

  collectDataPage() {
    return this.pageMode === PageMode.CollectDataPage;
  }

  recordVideoPage() {
    return this.pageMode === PageMode.RecordVideoPage;
  }

  testModelPage() {
    return this.pageMode === PageMode.TestModelPage;
  }
}
