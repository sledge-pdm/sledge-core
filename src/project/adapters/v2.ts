import { gzipInflate } from '../../buffer/gzip';
import { toUint8ClampedArray } from '../../buffer/RawPixelData';
import { ProjectV2 } from '../types/ProjectV2';
import { ProjectAdapter } from './base';
import { Canvas } from './parts/Canvas';
import { HistoryStacks } from './parts/History';
import { ImagePoolEntry, ImagePoolImage, ImagePoolState } from './parts/ImagePool';
import { Layer } from './parts/Layer';
import { LayerListState } from './parts/LayerListState';
import { ProjectPart } from './parts/Project';
import { SnapshotsPart } from './parts/Snapshots';

export class V2Adapter extends ProjectAdapter<ProjectV2> {
  ADAPTER_PROJECT_VERSION = 2;

  getCanvasInfo(): Canvas {
    return this.project.canvas;
  }

  getLayers(): Layer[] {
    return this.project.layers.layers;
  }

  getRawBufferOf(layerId: string): Uint8ClampedArray | undefined {
    const buffer = this.project.layers.buffers.get(layerId);
    if (!buffer) return undefined;

    return toUint8ClampedArray(gzipInflate(buffer.deflatedBuffer));
  }

  getLayerListState(): LayerListState {
    return {
      ...this.project.layers.state,
    };
  }

  getProjectInfo(): ProjectPart {
    return {
      ...this.project.project,
    };
  }

  getImagePoolEntries(): ImagePoolEntry[] {
    const entries = this.project.imagePool.entries;
    return Array.isArray(entries) ? entries : [];
  }

  getImagePoolImageOf(entryId: string): ImagePoolImage | undefined {
    return this.project.imagePool.images.get(entryId);
  }

  getImagePoolState(): ImagePoolState {
    return {
      ...this.project.imagePool.state,
    };
  }

  getHistory(): HistoryStacks {
    return {
      undoStack: this.project.history.undoStack,
      redoStack: this.project.history.redoStack,
      layerHistories: this.project.history.layerHistories,
    };
  }

  getSnapshots(): SnapshotsPart {
    return this.project.snapshots;
  }
}
