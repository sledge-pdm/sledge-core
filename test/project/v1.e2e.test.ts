import { describe, expect, it } from 'vitest';
import { gzipInflate } from '../../src/buffer/gzip';
import { decodeWebp } from '../../src/buffer/webp';
import { getProjectAdapter, getProjectVersion } from '../../src/project';
import { loadAndUnpackProject, projectCommonCheck } from './utils';

describe('v0 project io', () => {
  it('festa', async () => {
    const project = await loadAndUnpackProject(new URL('./v1_festa.sledge', import.meta.url));
    expect(getProjectVersion(project)).toBe(1);

    console.log(project);

    const adapter = getProjectAdapter(project);
    if (adapter === undefined) throw new Error("Couldn't create adapter.");
    expect(projectCommonCheck(adapter)).toBeTruthy();

    expect(adapter.getVersions()?.sledge).toBe('0.1.5');
    expect(adapter.getVersions()?.project).toBe(1);

    expect(adapter.getCanvasInfo().size.width).toBe(1064);
    expect(adapter.getCanvasInfo().size.height).toBe(1249);
    expect(adapter.getLayers().length).toBe(10);

    expect(adapter.getImagePoolEntries().length).toBe(2);
    const entry0 = adapter.getImagePoolEntries()[0];
    expect(entry0).toBeDefined();
    expect(entry0.base.width).toBe(765);
    expect(entry0.base.height).toBe(928);
    const image0 = adapter.getImagePoolImageOf(entry0.id);
    expect(image0).toBeDefined();
    expect(image0?.deflatedBuffer).toBeDefined();
    if (image0?.deflatedBuffer) {
      const inflated = gzipInflate(image0.deflatedBuffer);
      const inflatedRaw = await decodeWebp(inflated, entry0.base.width, entry0.base.height);
      expect(inflatedRaw.length).toBe(entry0.base.width * entry0.base.height * 4);
    }
  });

  it('sledgechan', async () => {
    const project = await loadAndUnpackProject(new URL('./v1_sledgechan.sledge', import.meta.url));
    expect(getProjectVersion(project)).toBe(1);

    console.log(project);

    const adapter = getProjectAdapter(project);
    if (adapter === undefined) throw new Error("Couldn't create adapter.");
    expect(projectCommonCheck(adapter)).toBeTruthy();

    expect(adapter.getVersions()?.sledge).toBe('0.1.5');
    expect(adapter.getVersions()?.project).toBe(1);

    expect(adapter.getCanvasInfo().size.width).toBe(767);
    expect(adapter.getCanvasInfo().size.height).toBe(995);
    expect(adapter.getLayers().length).toBe(10);

    expect(adapter.getHistory().undoStack.length).toBe(50);

    const snapshots = await adapter.getSnapshots();
    expect(snapshots.length).toBe(2);
    const snapshot0 = snapshots[0];
    expect(snapshot0.name).toBe('2025/10/21 18:01:40');

    const snapshot0Adapter = getProjectAdapter(snapshot0.project);
    expect(snapshot0Adapter?.getCanvasInfo().size.width).toBe(704);
    expect(snapshot0Adapter?.getCanvasInfo().size.height).toBe(1197);
  });
});
