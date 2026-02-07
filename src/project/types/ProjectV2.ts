import { CanvasInfo, HistoryStacks, Layer, LayerListState, ProjectInfo, ProjectSnapshot, Selection } from '../project_types';
import type { ImagePoolEntry, ImagePoolImage, ImagePoolState } from '../project_types/ImagePool';
import { ProjectBase } from './base';

/**
 *  Present project format.
 */
export interface ProjectV2 extends ProjectBase {
  canvas: CanvasInfo;
  layers: {
    layers: Layer[];
    buffers: Map<
      string, // layer id
      {
        deflatedBuffer: Uint8Array; // deflate compressed buffer
      }
    >;
    state: LayerListState;
  };
  selection: Selection;
  project: ProjectInfo;
  imagePool: {
    entries: ImagePoolEntry[];
    images: Map<string, ImagePoolImage>;
    state: ImagePoolState;
  };
  history: {
    undoStack: HistoryStacks['undoStack'];
    redoStack: HistoryStacks['redoStack'];
    layerHistories?: HistoryStacks['layerHistories'];
  };
  snapshots: ProjectSnapshot[];
}
