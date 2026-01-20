import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { decodeWebp } from '../../src/buffer/webp';

describe('webp e2e', () => {
  it('decodes a real webp fixture', async () => {
    const fixtureUrl = new URL('./test.webp', import.meta.url);
    const buffer = await readFile(fixtureUrl);
    const decoded = await decodeWebp(buffer, 16, 16);

    expect(decoded).toBeInstanceOf(Uint8ClampedArray);
    expect(decoded.byteLength).toBeGreaterThan(0);
    expect(decoded.byteLength % 4).toBe(0);
  });
});
