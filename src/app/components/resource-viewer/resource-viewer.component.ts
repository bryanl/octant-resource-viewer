import { Component, Input } from '@angular/core';

const colors = {
  ok: '#DFF0D0',
  okBorder: '#62A420',
  warning: '#FEF3B5',
  warningBorder: '#EDB200',
  error: '#F5DBD9',
  errorBorder: '#e12200',

  edge: '#c1cdd4',
};

// const klayLayout = {
//   name: 'klay',
//   klay: {
//     edgeSpacingFactor: 1,
//     spacing: 60,
//     direction: 'LEFT',
//   },
// };

const dagreLayout = {
  name: 'dagre',
  rankDir: 'BT',
  ranker: 'network-tree',
};

@Component({
  selector: 'app-resource-viewer',
  templateUrl: './resource-viewer.component.html',
  styleUrls: ['./resource-viewer.component.scss'],
})
export class ResourceViewerComponent {
  constructor() {}

  @Input() elements: any;
  layout = dagreLayout;

  style = [
    {
      selector: 'node[kind != "Pod"]',
      style: {
        shape: 'ellipse',
      },
    },
    {
      selector: 'node',
      style: {
        'font-family': 'Metropolis',
        'font-size': 10,
        label: 'data(name)',
        'border-style': 'solid',
        'border-width': 1,
        padding: 7,
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 6,
      },
    },
    {
      selector: 'node[status = "ok"]',
      style: {
        'background-color': colors.ok,
        'border-color': colors.okBorder,
      },
    },
    {
      selector: 'node[status = "warning"]',
      style: {
        'background-color': colors.warning,
        'border-color': colors.warningBorder,
      },
    },
    {
      selector: 'node[status = "error"]',
      style: {
        'background-color': colors.error,
        'border-color': colors.errorBorder,
        'border-style': 'dashed',
      },
    },
    {
      selector: 'edge',
      style: {
        'font-family': 'Metropolis',
        width: '2px',
        'curve-style': 'bezier',
        'arrow-scale': 1,
        'target-distance-from-node': '8px',
        'source-distance-from-node': '8px',
      },
    },
    {
      selector: 'edge[connectionType = "explicit"]',
      style: {
        'source-arrow-shape': 'triangle',
        'line-color': colors.edge,
        'source-arrow-color': colors.edge,
      },
    },
    {
      selector: 'edge[connectionType = "implicit"]',
      style: {
        'line-color': colors.edge,
        'line-style': 'dashed',
        'line-dash-pattern': [6, 3],
      },
    },
    {
      selector: 'edge[connectionType = "field"]',
      style: {
        'font-size': 10,
        'text-margin-y': -20,
        'source-arrow-shape': 'tee',
        'line-color': colors.edge,
        'source-arrow-color': colors.edge,
        'text-rotation': 'autorotate',
        'line-style': 'dashed',
      },
    },
    {
      selector: 'node[kind = "Pod"][apiVersion = "v1"]',
      style: {
        'background-color': 'white',
        'border-color': el => {
          const data = el.data();
          if (data.podErrorPercentage > 0) {
            return colors.errorBorder;
          } else if (data.podWarningPercentage > 0) {
            return colors.warningBorder;
          }
          return colors.okBorder;
        },
        'border-width': 1,
        content: 'data(name)',
        'pie-size': '150%',
        'pie-1-background-color': colors.ok,
        'pie-1-background-size': 'data(podOKPercentage)',
        'pie-2-background-color': colors.warning,
        'pie-2-background-size': 'data(podWarningPercentage)',
        'pie-3-background-color': colors.error,
        'pie-3-background-size': 'data(podErrorPercentage)',
      },
    },
  ];

  zoom = {
    min: 1,
    max: 1.5,
  };
}
