export type HistoryStacks = {
  undoStack: any[];
  redoStack: any[];
  layerHistories?: Record<string, { undoStack: any[]; redoStack: any[] }>;
};
