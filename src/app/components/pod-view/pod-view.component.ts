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
  @Input() view: PodView;

  data: any[];

  breadcrumbs = [];

  constructor() {
    super();
  }

  ngOnInit() {
    this.selectNodes();
  }

  labelFormat(data) {
    if (data.label.startsWith(nodePrefix)) {
      return data.label.substr(nodePrefix.length);
    } else if (data.label.startsWith(podPrefix)) {
      return data.label.substr(podPrefix.length);
    }

    return data.label;
  }

  valueFormat(data) {
    return '';
  }

  onSelect = (item: any) => {
    if (item.name.startsWith(nodePrefix)) {
      const nodeName = item.name.substr(nodePrefix.length);
      this.data = this.podData(nodeName);
      this.breadcrumbs = [
        { label: 'nodes', action: 'root' },
        { label: nodeName, action: '' },
      ];
      return;
    }

    console.log(`can't select`, item);
  };

  selectNodes() {
    this.data = this.nodeData();
    this.breadcrumbs = [{ label: 'nodes', action: 'root' }];
  }

  breadcrumbAction(action) {
    if (action === 'root') {
      this.selectNodes();
    }
  }

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
