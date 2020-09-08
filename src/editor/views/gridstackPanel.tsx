import 'gridstack/dist/gridstack.css';
import GridStack from 'gridstack/dist/gridstack.all.js';

import { Widget } from '@lumino/widgets';

import Cell from '../components/cell';

export default class GridStackPanel extends Widget {
  private grid: GridStack;
  private cells: { [id: string]: Cell };

  constructor() {
    super();
    this.addClass('grid-panel');

    this.cells = {};
  }

  dispose = () => {
    super.dispose();
    this.cells = null;
    this.grid = null;
    console.debug("Grid disposed:", this.grid);
  }

  onUpdateRequest = () => {
    //console.debug("onUpdateRequest:", this.grid, this.node.children);
    
    this.grid?.destroy();

    const grid = document.createElement('div');
    grid.className = 'grid-stack';
    this.node.append(grid);

    this.grid = GridStack.init({ disableOneColumnMode: true, styleInHead: true });
    
    this.grid.on('change', (event: any, elements: any[]) => {
      elements.forEach( e => {
        console.debug(e.id);
        this.cells[e.id];
      });
    });
    
    for (let k in Object.keys(this.cells)) {
      const widget = document.createElement('div');
      widget.className = 'grid-stack-item';
      widget.append(this.cells[k].node);
      this.grid.addWidget( widget, { autoPosition: true });
      this.cells[k].update();
    }
  }
  
  addCell = (cell: Cell) => {
    console.debug("Id:", cell.id);
    this.cells[cell.id] = cell;
    this.update();
  }
}