type HistoryActionTypes =
  | 'canvas_size'
  | 'color'
  | 'convert_selection'
  | 'image_pool'
  | 'layer_buffer'
  | 'layer_list'
  | 'layer_list_reorder'
  | 'layer_list_cut_paste'
  | 'layer_merge'
  | 'layer_props'
  | 'unknown';

interface BaseHistoryActionProps {
  context?: any;
  label?: string;

  version?: number;
}

interface SerializedHistoryAction {
  type: HistoryActionTypes;
  props: BaseHistoryActionProps;
}

type DeflatedHistorySnapshot = {
  bounds: { x: number; y: number; width: number; height: number };
  size: { width: number; height: number };
  deflated: Uint8Array;
  fullLayer?: boolean;
};

export type HistoryStacks = {
  undoStack: SerializedHistoryAction[];
  redoStack: SerializedHistoryAction[];

  layerHistories?: Record<string, { undoStack: DeflatedHistorySnapshot[]; redoStack: DeflatedHistorySnapshot[] }>;
};
