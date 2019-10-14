import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { UnknownDynamicComponent } from '../unknown-dynamic/unknown-dynamic.component';
import { PodViewComponent } from '../pod-view/pod-view.component';
import { DynamicComponent } from '../dynamic-component';
import { View } from '../../view';

@Component({
  selector: 'app-dynamic-content',
  template: `
    <div>
      <div #container></div>
    </div>
  `,
})
export class DynamicContentComponent implements OnInit, OnDestroy {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  @ViewChild('container', { read: ViewContainerRef, static: true })
  container: ViewContainerRef;

  @Input() view: View;

  private componentRef: ComponentRef<{}>;

  private componentMappings: { [key: string]: any } = {
    'pod-view': PodViewComponent,
  };

  ngOnInit() {
    if (this.view) {
      const viewType = this.getComponentType(this.view);
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        viewType
      );
      this.componentRef = this.container.createComponent(factory);
      const instance = this.componentRef.instance as DynamicComponent;
      instance.view = this.view;
    } else {
      console.log('no view');
    }
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  getComponentType(view: View) {
    const type = this.componentMappings[view.metadata.type];
    return type || UnknownDynamicComponent;
  }
}
