import { Component, Input, OnInit } from '@angular/core';
import { DynamicComponent } from '../dynamic-component';
import { PodStatus, PodView } from '../../view';

@Component({
  selector: 'app-pod-view',
  templateUrl: './pod-view.component.html',
  styleUrls: ['./pod-view.component.scss'],
})
export class PodViewComponent extends DynamicComponent implements OnInit {
  data: any[];

  @Input() view: PodView;

  private podData = Array.from(Array(35), (_, x) => {
    return { name: `pod-${x}`, value: 1, label: '' };
  });

  constructor() {
    super();
  }

  ngOnInit() {
    this.data = this.nodeData();
  }

  nodeData = () =>
    Object.entries(
      this.view.config.pods.reduce((prev, cur) => {
        prev[cur.node] = (prev[cur.node] || 0) + 1;
        return prev;
      }, {})
    ).map(value => {
      return { name: value[0], value: value[1] };
    });

  nodeColors = node => {
    const pods = this.view.config.pods.filter(pod => pod.node === node);
    if (this.hasStatus(pods, 'error')) {
      return 'red';
    } else if (this.hasStatus(pods, 'warning')) {
      return 'yellow';
    }

    return 'green';
  };

  private hasStatus = (pods: PodStatus[], status: string) => {
    return pods.find(pod => pod.status === status);
  };
}
