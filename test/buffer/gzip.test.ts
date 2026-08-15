import { describe, expect, it } from 'vitest';
import { gzipDeflate, gzipDeflateAsync, gzipInflate, gzipInflateAsync } from '../../index';

const makeBuffer = (length: number, seed: number) => {
  const buffer = new Uint8Array(length);
  for (let i = 0; i < length; i++) buffer[i] = (i * seed) % 251;
  return buffer;
};

describe('gzip encode/decode', () => {
  it('roundtrips a buffer slice', () => {
    const base = new Uint8Array([9, 9, 1, 2, 3, 4, 9, 9]);
    const slice = base.subarray(2, 6);
    const compressed = gzipDeflate(slice);
    const inflated = gzipInflate(compressed);

    expect(Array.from(inflated)).toEqual([1, 2, 3, 4]);
  });

  it('roundtrips a buffer slice asynchronously', async () => {
    const base = new Uint8Array([9, 9, 1, 2, 3, 4, 9, 9]);
    const slice = base.subarray(2, 6);
    const compressed = await gzipDeflateAsync(slice);
    const inflated = await gzipInflateAsync(compressed);

    expect(Array.from(inflated)).toEqual([1, 2, 3, 4]);
  });

  it('roundtrips a clamped array', async () => {
    const source = new Uint8ClampedArray([5, 6, 7, 8]);

    expect(Array.from(gzipInflate(gzipDeflate(source)))).toEqual([5, 6, 7, 8]);
    expect(Array.from(await gzipInflateAsync(await gzipDeflateAsync(source)))).toEqual([5, 6, 7, 8]);
  });
});

describe('gzip sync/async interoperability', () => {
  const source = makeBuffer(8192, 7);

  it('inflates asynchronously what was deflated synchronously', async () => {
    expect(Array.from(await gzipInflateAsync(gzipDeflate(source)))).toEqual(Array.from(source));
  });

  it('inflates synchronously what was deflated asynchronously', async () => {
    expect(Array.from(gzipInflate(await gzipDeflateAsync(source)))).toEqual(Array.from(source));
  });

  it('writes the same zlib header from both implementations', async () => {
    const sync = gzipDeflate(source);
    const async = await gzipDeflateAsync(source);

    expect(Array.from(async.subarray(0, 2))).toEqual(Array.from(sync.subarray(0, 2)));
  });

  it('handles an empty buffer', async () => {
    const empty = new Uint8Array(0);

    expect(Array.from(gzipInflate(await gzipDeflateAsync(empty)))).toEqual([]);
    expect(Array.from(await gzipInflateAsync(gzipDeflate(empty)))).toEqual([]);
  });
});
