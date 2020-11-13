import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';

import {
  registerWidgetManager,
  WidgetRenderer
} from '@jupyter-widgets/jupyterlab-manager';

import { EditorPanel } from '../editor/panel';

import { IVoilaEditorTracker } from '../editor/widget';

function* widgetRenderers(
  editor: EditorPanel
): IterableIterator<WidgetRenderer> {
  for (const w of editor.gridWidgets) {
    if (w instanceof WidgetRenderer) {
      yield w;
    }
  }
}

export const widgets: JupyterFrontEndPlugin<void> = {
  id: 'voila-editor/widgets',
  autoStart: true,
  optional: [IVoilaEditorTracker, IJupyterWidgetRegistry],
  activate: (
    app: JupyterFrontEnd,
    voilaEditorTracker: IVoilaEditorTracker | null,
    widgetRegistry: IJupyterWidgetRegistry | null
  ) => {
    if (!widgetRegistry) {
      return;
    }
    voilaEditorTracker.forEach(panel => {
      registerWidgetManager(
        panel.context,
        panel.content.rendermime,
        widgetRenderers(panel.content)
      );
    });

    voilaEditorTracker.widgetAdded.connect((sender, panel) => {
      registerWidgetManager(
        panel.context,
        panel.content.rendermime,
        widgetRenderers(panel.content)
      );
    });
    console.log(widgets.id, 'activated');
  }
};
