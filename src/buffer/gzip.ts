import * as pako from 'pako';
import { RawPixelData } from './RawPixelData';

/**
 * All four functions read and write the same zlib format (RFC 1950), so output from either
 * implementation can be given to either one.
 */

/** Synchronous deflate, implemented with pako. */
export function gzipDeflate(rawBuffer: RawPixelData): Uint8Array {
  const buffer = new Uint8Array(rawBuffer.buffer, rawBuffer.byteOffset, rawBuffer.byteLength);
  const deflated = pako.deflate(buffer);
  return deflated;
}

/** Synchronous inflate, implemented with pako. */
export function gzipInflate(compressed: RawPixelData): Uint8Array {
  const buffer = new Uint8Array(compressed.buffer, compressed.byteOffset, compressed.byteLength);
  const inflated = pako.inflate(buffer);
  return inflated;
}

/**
 * Asynchronous deflate, implemented with CompressionStream.
 * Falls back to gzipDeflate where CompressionStream is unavailable.
 */
export async function gzipDeflateAsync(rawBuffer: RawPixelData): Promise<Uint8Array> {
  if (!hasCompressionStream) return gzipDeflate(rawBuffer);
  return runAsyncBufferStream(rawBuffer, new CompressionStream('deflate'));
}

/**
 * Asynchronous inflate, implemented with DecompressionStream.
 * Falls back to gzipInflate where DecompressionStream is unavailable.
 */
export async function gzipInflateAsync(compressed: RawPixelData): Promise<Uint8Array> {
  if (!hasDecompressionStream) return gzipInflate(compressed);
  return runAsyncBufferStream(compressed, new DecompressionStream('deflate'));
}

const hasCompressionStream = typeof CompressionStream !== 'undefined';
const hasDecompressionStream = typeof DecompressionStream !== 'undefined';

async function runAsyncBufferStream(buffer: RawPixelData, transform: ReadableWritablePair<Uint8Array, BufferSource>): Promise<Uint8Array> {
  const source = new ReadableStream<BufferSource>({
    start(controller) {
      controller.enqueue(new Uint8Array(buffer.buffer as ArrayBuffer, buffer.byteOffset, buffer.byteLength));
      controller.close();
    },
  });

  return new Uint8Array(await new Response(source.pipeThrough(transform)).arrayBuffer());
}
