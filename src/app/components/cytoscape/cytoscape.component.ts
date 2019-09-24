import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import cytoscape, { SingularData, Stylesheet } from 'cytoscape';

@Component({
  selector: 'app-cytoscape',
  template: '<div #cy class="cy"></div>',
  styleUrls: ['./cytoscape.component.scss'],
})
export class CytoscapeComponent implements OnChanges {
  @ViewChild('cy', { static: true }) private cy: ElementRef;
  @Input() public elements: any;
  @Input() public style: Stylesheet[];
  @Input() public layout: any;
  @Input() public zoom: any;

  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  constructor(private renderer: Renderer2) {
    this.layout = this.layout || {
      name: 'grid',
      directed: true,
    };

    this.zoom = this.zoom || {
      min: 0.1,
      max: 1.5,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  public render() {
    const cyContainer = this.renderer.selectRootElement(this.cy.nativeElement);
    const cy = cytoscape({
      container: cyContainer,
      layout: this.layout,
      minZoom: this.zoom.min,
      maxZoom: this.zoom.max,
      style: this.style,
      elements: this.elements,
    });

    cy.on('tap', 'node', e => {
      const node: SingularData = e.target;
      this.selected.emit(node.data());
    });

    cy.autolock(true);
  }
}
