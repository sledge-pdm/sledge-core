import { gzipDeflate } from '../../buffer/gzip';
import { toUint8Array } from '../../buffer/RawPixelData';
import { decodeWebp } from '../../buffer/webp';
import { ProjectV1 } from '../types/ProjectV1';
import { ProjectAdapter } from './base';
import { Canvas } from './parts/Canvas';
import { HistoryStacks } from './parts/History';
import { ImagePoolEntry, ImagePoolImage, ImagePoolState } from './parts/ImagePool';
import { Layer } from './parts/Layer';
import { LayerListState } from './parts/LayerListState';
import { ProjectPart } from './parts/Project';
import { ProjectSnapshot, SnapshotsPart } from './parts/Snapshots';

export class V1Adapter extends ProjectAdapter<ProjectV1> {
  ADAPTER_PROJECT_VERSION = 1;

  getCanvasInfo(): Canvas {
    return {
      size: this.project.canvas.store.canvas,
    };
  }

  getLayers(): Layer[] {
    return this.project.layers.store.layers;
  }

  async getRawBufferOf(layerId: string): Promise<Uint8ClampedArray | undefined> {
    const buffer = this.project.layers.buffers.get(layerId);
    if (!buffer) return undefined;

    const canvasSize = this.project.canvas.store.canvas;
    if (!canvasSize) return undefined;

    return await decodeWebp(buffer.webpBuffer, canvasSize.width, canvasSize.height);
  }

  getLayerListState(): LayerListState {
    return {
      ...this.project.layers.store,
    };
  }

  getProjectInfo(): ProjectPart {
    return {
      ...this.project.project.store,
    };
  }

  getImagePoolEntries(): ImagePoolEntry[] {
    const entries = this.project.imagePool.store.entries;
    return Array.isArray(entries) ? entries : [];
  }

  getImagePoolImageOf(entryId: string): ImagePoolImage | undefined {
    const entry = this.project.imagePool.store.entries.find((e) => e.id === entryId);
    if (!entry) return undefined;
    return {
      deflatedBuffer: gzipDeflate(entry.webpBuffer),
      mimeType: 'image/webp',
    };
  }

  getImagePoolState(): ImagePoolState {
    return {
      ...this.project.imagePool.store,
    };
  }

  getHistory(): HistoryStacks {
    return {
      undoStack: this.project.history.undoStack,
      redoStack: this.project.history.redoStack,
    };
  }

  async getSnapshots(): Promise<SnapshotsPart> {
    return Promise.all(
      this.project.snapshots.store.snapshots.map(async (v1Snap) => {
        if (v1Snap.thumbnail) {
          const { webpBuffer, width, height } = v1Snap.thumbnail;
          const rawThumbnailBuffer = await decodeWebp(webpBuffer, width, height);
          const deflated = toUint8Array(gzipDeflate(rawThumbnailBuffer));
          return {
            ...v1Snap,
            thumbnail: {
              packedBuffer: deflated,
              width,
              height,
            },
          } as ProjectSnapshot;
        } else {
          return {
            ...v1Snap,
            thumbnail: undefined,
          };
        }
      })
    );
  }
}
