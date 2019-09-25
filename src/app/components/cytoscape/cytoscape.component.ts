import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import cytoscape, { SingularData, Stylesheet } from 'cytoscape';
import klay from 'cytoscape-klay';

cytoscape.use(klay);

@Component({
  selector: 'app-cytoscape',
  template: '<div #cy class="cy"></div>',
  styleUrls: ['./cytoscape.component.scss'],
})
export class CytoscapeComponent implements OnChanges {
  @ViewChild('cy', { static: true }) private el: ElementRef;
  @Input() public elements: [];
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

      this.cy.on('tap', 'node', e => {
        const node: SingularData = e.target;
        this.selected.emit(node.data());
        console.log(`tap`, node.data());
      });

      this.cy.layout({ ...this.layout, animate: false }).run();
      this.cy.autolock(true);
    } else {
      console.log('???', changes);

      this.cy.autolock(false);

      const tracker: { [key: string]: boolean } = {};

      changes.elements.currentValue.forEach(element => {
        const id = element.data.id;
        if (!id) {
          console.log(`new item didn't have id`, element);
        } else {
          const prev = this.cy.$id(id);

          if (prev.length === 1) {
            console.log('updating item', {
              id,
              prev: prev.data(),
              cur: element.data,
            });
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
      this.cy.layout({ ...this.layout, animate: false }).run();
      this.cy.autolock(true);
    }
  }
}
