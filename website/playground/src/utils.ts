import pako from 'pako';

export const codeCompression = {
  deflate(code: string) {
    const codeBytes = new TextEncoder().encode(code);
    const compressedCode = pako.deflateRaw(codeBytes, { level: 9 });

    return btoa(String.fromCharCode.apply(null, compressedCode as any));
  },
  inflate(code: string) {
    const decompressed = pako.inflateRaw(
      new Uint8Array(
        atob(code)
          .split('')
          .map(char => char.charCodeAt(0))
      )
    );

    return new TextDecoder().decode(decompressed);
  }
};
