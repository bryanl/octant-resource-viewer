import { Component, Input, OnInit } from '@angular/core';
import { DynamicComponent } from '../dynamic-component';
import { PodStatus, PodView } from '../../view';

const nodePrefix = 'node/';
const podPrefix = 'pod/';

@Component({
  selector: 'app-pod-view',
  templateUrl: './pod-view.component.html',
  styleUrls: ['./pod-view.component.scss'],
})
export class PodViewComponent extends DynamicComponent implements OnInit {
  data: any[];

  @Input() view: PodView;

  constructor() {
    super();
  }

  ngOnInit() {
    this.data = this.nodeData();
  }

  labelFormat(data) {
    if (data.label.startsWith(nodePrefix)) {
      return data.label.substr(nodePrefix.length);
    } else if (data.label.startsWith(podPrefix)) {
      return data.label.substr(podPrefix.length);
    }

    console.log(data);
    return data.label;
  }

  onSelect = (item: any) => {
    if (item.name.startsWith(nodePrefix)) {
      this.data = this.podData(item.name.substr(nodePrefix.length));
      return;
    }

    console.log(`can't select`, item);
  };

  private nodeData = () =>
    Object.entries(
      this.view.config.pods.reduce((prev, cur) => {
        prev[cur.node] = (prev[cur.node] || 0) + 1;
        return prev;
      }, {})
    ).map(value => {
      const name = `${nodePrefix}${value[0]}`;
      return { name, value: value[1] };
    });

  private nodeColors = node => {
    const pods = this.view.config.pods.filter(pod => pod.node === node);
    if (this.hasStatus(pods, 'error')) {
      return 'red';
    } else if (this.hasStatus(pods, 'warning')) {
      return 'yellow';
    }

    return 'green';
  };

  private podData = (nodeName: string) =>
    this.view.config.pods
      .filter(pod => pod.node === nodeName)
      .map(pod => {
        const name = `${podPrefix}${pod.name}`;
        return { name, value: 1 };
      });

  private hasStatus = (pods: PodStatus[], status: string) => {
    return pods.find(pod => pod.status === status);
  };
}
