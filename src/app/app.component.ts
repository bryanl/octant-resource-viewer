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
      node('deployment', 'warning'),
      node('replica-set', 'error'),
      node('service'),
      node('pods'),
      node('service'),
      node('ingress'),
      node('service-account'),
      node('node1'),
      node('node2'),
      node('node3'),
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
    grid: true,
    spacingFactor: 0.75,
  };

  // so we can see the ids
  style = [
    {
      selector: 'node',
      style: {
        'font-family': 'Metropolis',
        label: 'data(id)',
        shape: 'rectangle',
        'border-style': 'solid',
        'border-width': '2px',
        padding: '9px',
        'text-valign': 'top',
        'text-halign': 'center',
        'text-margin-y': '-6px',
      },
    },
    {
      selector: 'node[status = "ok"]',
      style: {
        color: '#313131',
        'background-opacity': '50%',
        'background-color': '#DFF0D0',
        'border-color': '#62A420',
      },
    },
    {
      selector: 'node[status = "warning"]',
      style: {
        color: '#313131',
        'background-opacity': '50%',
        'background-color': '#FEF3B5',
        'border-color': '#EDB200',
      },
    },
    {
      selector: 'node[status = "error"]',
      style: {
        color: '#313131',
        'background-opacity': '50%',
        'background-color': '#F5DBD9',
        'border-color': '#e12200',
      },
    },
    {
      selector: 'edge',
      style: {
        'target-arrow-shape': 'triangle',
        'target-arrow-color': '#C1CDD4',
        'line-color': '#C1CDD4',
        width: '2px',
        'curve-style': 'bezier',
        'arrow-scale': 1,
        'target-distance-from-node': '8px',
        'source-distance-from-node': '8px',
      },
    },
  ];

  zoom = {
    min: 0.5,
    max: 1.5,
  };
}

const node = (name: string, status = 'ok') => {
  return {
    data: { id: name, status },
  };
};

const connect = (source: string, target: string) => {
  return {
    data: { source, target },
  };
};
