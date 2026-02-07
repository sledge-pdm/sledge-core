export interface ProjectInfo {
  thumbnailPath: string | undefined;
  lastSavedPath: string | undefined;
  lastSavedAt: Date | undefined;

  autoSnapshotEnabled?: boolean;
  autoSnapshotInterval?: number; // in seconds
}
