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
      node('deployment'),
      node('replica-set'),
      node('service'),
      node('pods'),
      node('service'),
      node('ingress'),
      node('service-account'),
    ],
    edges: [
      connect(
        'replica-set',
        'deployment'
      ),
      connect(
        'pods',
        'replica-set'
      ),
      connect(
        'service',
        'pods'
      ),
      connect(
        'ingress',
        'service'
      ),
      connect(
        'pods',
        'service-account'
      ),
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

const node = (name: string) => {
  return {
    data: { id: name },
  };
};

const connect = (source: string, target: string) => {
  return {
    data: { source, target },
  };
};
