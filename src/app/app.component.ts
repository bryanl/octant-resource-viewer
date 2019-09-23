import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'octant-resource-viewer';

  elements = {
    nodes: [
      {
        data: { id: 'deployment' },
      },
      {
        data: { id: 'replica-set' },
      },
      {
        data: { id: 'pods' },
      },
      {
        data: { id: 'service' },
      },
      {
        data: { id: 'ingress' },
      },
      {
        data: { id: 'service-account' },
      },
      {
        data: { id: 'pod' },
      },
    ],
    edges: [
      {
        data: { id: '1', source: 'replica-set', target: 'deployment' },
      },
      {
        data: { id: '2', source: 'pods', target: 'replica-set' },
      },
      {
        data: { id: '3', source: 'service', target: 'pods' },
      },
      {
        data: { id: '4', source: 'ingress', target: 'service' },
      },
      {
        data: { id: '5', source: 'pods', target: 'service-account' },
      },
    ],
  };

  layout = {
    name: 'breadthfirst',
  };

  // so we can see the ids
  style = [
    {
      selector: 'node',
      style: {
        label: 'data(id)',
      },
    },
  ];
}
