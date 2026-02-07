import { ProjectInfo, Selection } from '../project_types';
import { CanvasInfo } from '../project_types/Canvas';
import { HistoryStacks } from '../project_types/History';
import type { ImagePoolEntry, ImagePoolImage, ImagePoolState } from '../project_types/ImagePool';
import { Layer } from '../project_types/Layer';
import { LayerListState } from '../project_types/LayerListState';
import { SnapshotsPart } from '../project_types/Snapshots';
import { ProjectBase } from '../types';

export abstract class ProjectAdapter<P extends ProjectBase> {
  protected project: P;

  constructor(project: P) {
    this.project = project;
  }

  abstract ADAPTER_PROJECT_VERSION: number;

  getVersions(): {
    sledge?: string;
    project?: number;
  } {
    return {
      sledge: this.project?.version ?? undefined,
      project: this.project?.projectVersion ?? undefined,
    };
  }

  abstract getCanvasInfo(): CanvasInfo;
  abstract getLayers(): Layer[];
  abstract getLayerListState(): LayerListState;
  abstract getSelection(): Selection;
  abstract getRawBufferOf(layerId: string): Promise<Uint8ClampedArray | undefined>;
  abstract getProjectInfo(): ProjectInfo;
  abstract getImagePoolEntries(): ImagePoolEntry[];
  abstract getImagePoolImageOf(entryId: string): ImagePoolImage | undefined;
  abstract getImagePoolState(): ImagePoolState;
  abstract getHistory(): HistoryStacks;
  abstract getSnapshots(): Promise<SnapshotsPart>;
}
