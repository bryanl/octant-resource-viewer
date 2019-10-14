import { Component, OnInit } from '@angular/core';
import { DynamicComponent } from '../dynamic-component';

@Component({
  selector: 'app-pod-view',
  templateUrl: './pod-view.component.html',
  styleUrls: ['./pod-view.component.scss'],
})
export class PodViewComponent extends DynamicComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
