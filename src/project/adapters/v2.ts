import { gzipInflate } from '../../buffer/gzip';
import { toUint8ClampedArray } from '../../buffer/RawPixelData';
import { ProjectInfo, Selection } from '../project_types';
import { CanvasInfo } from '../project_types/Canvas';
import { HistoryStacks } from '../project_types/History';
import type { ImagePoolEntry, ImagePoolImage, ImagePoolState } from '../project_types/ImagePool';
import { Layer } from '../project_types/Layer';
import { LayerListState } from '../project_types/LayerListState';
import { SnapshotsPart } from '../project_types/Snapshots';
import { ProjectV2 } from '../types/ProjectV2';
import { ProjectAdapter } from './base';

export class V2Adapter extends ProjectAdapter<ProjectV2> {
  ADAPTER_PROJECT_VERSION = 2;

  getCanvasInfo(): CanvasInfo {
    return this.project.canvas;
  }

  getLayers(): Layer[] {
    return this.project.layers.layers;
  }

  async getRawBufferOf(layerId: string): Promise<Uint8ClampedArray | undefined> {
    const buffer = this.project.layers.buffers.get(layerId);
    if (!buffer) return undefined;

    return toUint8ClampedArray(gzipInflate(buffer.deflatedBuffer));
  }

  getLayerListState(): LayerListState {
    return {
      ...this.project.layers.state,
    };
  }

  getSelection(): Selection {
    return (
      this.project.selection ?? {
        mask: undefined,
      }
    );
  }

  getProjectInfo(): ProjectInfo {
    return this.project.project;
  }

  getImagePoolEntries(): ImagePoolEntry[] {
    const entries = this.project.imagePool.entries;
    return Array.isArray(entries) ? entries : [];
  }

  getImagePoolImageOf(entryId: string): ImagePoolImage | undefined {
    const images = this.project.imagePool?.images;
    return images ? images.get(entryId) : undefined;
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

  async getSnapshots(): Promise<SnapshotsPart> {
    return this.project.snapshots.map((s) => {
      if (!s.project && s.snapshot) return { ...s, project: s.snapshot, snapshot: undefined };
      else return s;
    });
  }
}
