import { RawPixelData, toUint8Array } from './RawPixelData';

export async function decodeWebp(webpBuffer: RawPixelData, width: number, height: number): Promise<Uint8ClampedArray> {
  if (typeof OffscreenCanvas === 'undefined' || typeof createImageBitmap === 'undefined') {
    return new Uint8ClampedArray(width * height * 4);
  }

  const blob = new Blob([toUint8Array(webpBuffer) as Uint8Array<ArrayBuffer>], { type: 'image/webp' });
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    if (typeof bitmap.close === 'function') {
      bitmap.close();
    }
    return new Uint8ClampedArray(width * height * 4);
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  if (typeof bitmap.close === 'function') {
    bitmap.close();
  }
  const imageData = ctx.getImageData(0, 0, width, height);
  return imageData.data;
}
