import { gzipDeflate } from '../../buffer/gzip';
import { toUint8Array } from '../../buffer/RawPixelData';
import { decodeWebp } from '../../buffer/webp';
import { Selection } from '../project_types';
import { CanvasInfo } from '../project_types/Canvas';
import { HistoryStacks } from '../project_types/History';
import type { ImagePoolEntry, ImagePoolImage, ImagePoolState } from '../project_types/ImagePool';
import { Layer } from '../project_types/Layer';
import { LayerListState } from '../project_types/LayerListState';
import { ProjectInfo } from '../project_types/Project';
import { ProjectSnapshot, SnapshotsPart } from '../project_types/Snapshots';
import { ProjectV1 } from '../types/ProjectV1';
import { ProjectAdapter } from './base';

export class V1Adapter extends ProjectAdapter<ProjectV1> {
  ADAPTER_PROJECT_VERSION = 1;

  getCanvasInfo(): CanvasInfo {
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

  getSelection(): Selection {
    return {
      mask: undefined,
    };
  }

  getProjectInfo(): ProjectInfo {
    return {
      ...this.project.project.store,
    };
  }

  getImagePoolEntries(): ImagePoolEntry[] {
    const entries = this.project.imagePool?.store?.entries;
    return Array.isArray(entries) ? entries : [];
  }

  getImagePoolImageOf(entryId: string): ImagePoolImage | undefined {
    const entries = this.project.imagePool?.store?.entries;
    if (!entries) return undefined;
    const entry = entries.find((e) => e.id === entryId);
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
          const { snapshot: oldSnapshot, ...v1SnapRest } = v1Snap;
          return {
            ...v1SnapRest,
            project: oldSnapshot,
            thumbnail: {
              packedBuffer: deflated,
              width,
              height,
            },
          } as ProjectSnapshot;
        } else {
          const { snapshot: oldSnapshot, ...v1SnapRest } = v1Snap;
          return {
            ...v1SnapRest,
            project: oldSnapshot,
            thumbnail: undefined,
          };
        }
      })
    );
  }
}
