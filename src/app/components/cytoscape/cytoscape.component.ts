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
import klay from 'cytoscape-klay';
import dagre from 'cytoscape-dagre';
import { ViewerElement } from '../../services/elements';

cytoscape.use(dagre);
cytoscape.use(klay);

@Component({
  selector: 'app-cytoscape',
  template: '<div #cy class="cy"></div>',
  styleUrls: ['./cytoscape.component.scss'],
})
export class CytoscapeComponent implements OnChanges {
  @ViewChild('cy', { static: true }) private el: ElementRef;
  @Input() public elements: ViewerElement[];
  @Input() public style: Stylesheet[];
  @Input() public layout: any;
  @Input() public zoom: any;
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  private cy: cytoscape.Core;

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
    if (!this.cy) {
      const cyContainer = this.renderer.selectRootElement(
        this.el.nativeElement
      );
      this.cy = cytoscape({
        container: cyContainer,
        layout: this.layout,
        minZoom: this.zoom.min,
        maxZoom: this.zoom.max,
        style: this.style,
        elements: this.elements,
      });

      // emit for selected node
      this.elements
        .filter(e => e.selected)
        .forEach(e => this.selected.emit(e.data));

      this.cy.on('tap', 'node', e => {
        // @ts-ignore
        this.cy.$('*').json({ selected: false });

        const node: SingularData = e.target;
        // @ts-ignore
        node.json({ selected: true });
        this.selected.emit(node.data());
      });

      this.cy.on('layoutready', () => {
        this.cy.fit();
        this.cy.center();
      });

      this.cy.layout({ ...this.layout, animate: false }).run();
      this.cy.autolock(true);
    } else {
      this.cy.autolock(false);
      this.cy.batch(() => {
        const tracker: { [key: string]: boolean } = {};

        changes.elements.currentValue.forEach(element => {
          const id = element.data.id;
          if (id) {
            const prev = this.cy.$id(id);
            if (prev.length === 1) {
              prev.data(element.data);
            } else {
              this.cy.add(element);
            }
          }

          tracker[id] = true;
        });

        this.cy.elements('*').forEach(element => {
          const id = element.id();
          if (!tracker[id]) {
            this.cy.remove(element);
          }
        });

        this.cy.minZoom(this.zoom.min);
        this.cy.maxZoom(this.zoom.max);
      });
      this.cy.layout({ ...this.layout, animate: false }).run();
      this.cy.autolock(true);
    }
  }
}
