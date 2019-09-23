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
        data: {
          id: 'deployment',
          name: 'deployment apps/v1',
          label: 'top left',
        },
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
        data: { source: 'replica-set', target: 'deployment' },
      },
      {
        data: { source: 'pods', target: 'replica-set' },
      },
      {
        data: { source: 'service', target: 'pods' },
      },
      {
        data: { source: 'ingress', target: 'service' },
      },
      {
        data: { source: 'pods', target: 'service-account' },
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
        color: '#313131',
        'font-family': 'Metropolis',
        label: 'data(id)',
        shape: 'rectangle',
        'background-opacity': '50%',
        'background-color': '#DFF0D0',
        'border-color': '#62A420',
        'border-style': 'solid',
        'border-width': '2px',
        padding: '9px',
        'text-valign': 'top',
        'text-halign': 'center',
        'text-margin-y': '-6px',
      },
    },
    {
      selector: 'edge',
      style: {
        'target-arrow-shape': 'triangle',
        'line-color': '#C1CDD4',
      },
    },
  ];
}
