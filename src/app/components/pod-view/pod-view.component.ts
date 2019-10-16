import { Component, Input, OnInit } from '@angular/core';
import { DynamicComponent } from '../dynamic-component';
import { PodStatus, PodView } from '../../view';
import { colors } from '../../colors';

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

  private viewType: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.selectNodes();
  }

  labelFormat(data) {
    if (data.label.startsWith(nodePrefix)) {
      return nodeName(data.label);
    } else if (data.label.startsWith(podPrefix)) {
      return podName(data.label);
    }

    return data.label;
  }

  valueFormat(data) {
    return '';
  }

  onSelect = (item: any) => {
    if (item.name.startsWith(nodePrefix)) {
      const name = nodeName(item.name);
      this.data = this.podData(name);
      this.viewType = 'pods';
      this.breadcrumbs = [
        { label: 'nodes', action: 'root' },
        { label: name, action: '' },
      ];
      return;
    }
  };

  selectNodes() {
    this.data = this.nodeData();
    this.viewType = 'nodes';
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

  colors = item => {
    if (this.viewType === 'pods') {
      return this.podColors(item);
    } else if (this.viewType === 'nodes') {
      return this.nodeColors(item);
    }

    return 'grey';
  };

  podColors = pod => {
    const cur = this.view.config.pods.find(
      value => value.name === podName(pod)
    );
    if (cur.status === 'error') {
      return colors.error;
    } else if (cur.status === 'warning') {
      return colors.warning;
    }

    return colors.ok;
  };

  nodeColors = node => {
    const pods = this.view.config.pods.filter(
      pod => pod.node === nodeName(node)
    );
    if (this.hasStatus(pods, 'error')) {
      return colors.error;
    } else if (this.hasStatus(pods, 'warning')) {
      return colors.warning;
    }

    return colors.ok;
  };

  private podData = (name: string) =>
    this.view.config.pods
      .filter(pod => pod.node === name)
      .map(pod => {
        const label = `${podPrefix}${pod.name}`;
        return { name: label, value: 1 };
      });

  private hasStatus = (pods: PodStatus[], status: string) => {
    return pods.find(pod => pod.status === status);
  };
}

const nodeName = (s: string) => s.substr(nodePrefix.length);
const podName = (s: string) => s.substr(podPrefix.length);
