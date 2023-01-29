import { RestManager } from '@discordeno/rest';
import { BASE_URL, FileContent } from 'discordeno';
import { FormData } from 'undici';

import config from '../config';
import { RunMethod } from '../types';

const { REST_AUTHORIZATION } = config(['REST_AUTHORIZATION']);

export default async (data: RunMethod, rest: RestManager): Promise<unknown> => {
  if (data.Authorization !== REST_AUTHORIZATION) {
    return {
      status: 401,
      body: {
        error: 'Unauthorized',
      },
    };
  }
  const body = data.body ? JSON.parse(data.body as any) : undefined;
  if (body && body.file) {
    const files = findFiles(body.file);
    const form = new FormData();

    for (let i = 0; i < files.length; i++) {
      form.append(`file${i}`, files[i].blob, files[i].name);
    }
    form.append('payload_json', JSON.stringify({ ...body, file: undefined }));
    body.file = form;
    console.log(body.file);
  }

  const result = await rest
    .makeRequest(data.method, `${BASE_URL}/v${rest.version}${data.url}`, body, data.options)
    .catch((e) => {
      if (e instanceof Error) {
        if (e.message.includes('[404]')) return e;
        // eslint-disable-next-line no-console
        console.log(e);
      }
      return e;
    });

  return result;
};

function findFiles(file: unknown): FileContent[] {
  if (!file) {
    return [];
  }

  const files: unknown[] = Array.isArray(file) ? file : [file];
  return files.filter(coerceToFileContent);
}

function coerceToFileContent(value: unknown): value is FileContent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const file = value as Record<string, unknown>;
  if (typeof file.name !== 'string') {
    return false;
  }

  switch (typeof file.blob) {
    case 'string': {
      const match = file.blob.match(/^data:(?<mimeType>[a-zA-Z0-9/]*);base64,(?<content>.*)$/);
      if (match?.groups === undefined) {
        return false;
      }
      const { mimeType, content } = match.groups;
      file.blob = new Blob([decode(content)], { type: mimeType });
      return true;
    }
    case 'object':
      return file.blob instanceof Blob;
    default:
      return false;
  }
}

/**
 * CREDIT: https://gist.github.com/enepomnyaschih/72c423f727d395eeaa09697058238727
 * Decodes RFC4648 base64 string into an Uint8Array
 * @param data
 */
export function decode(data: string): Uint8Array {
  if (data.length % 4 !== 0) {
    throw new Error('Unable to parse base64 string.');
  }
  const index = data.indexOf('=');
  if (index !== -1 && index < data.length - 2) {
    throw new Error('Unable to parse base64 string.');
  }
  const missingOctets = data.endsWith('==') ? 2 : data.endsWith('=') ? 1 : 0,
    n = data.length,
    result = new Uint8Array(3 * (n / 4));
  let buffer;
  for (let i = 0, j = 0; i < n; i += 4, j += 3) {
    buffer =
      (getBase64Code(data.charCodeAt(i)) << 18) |
      (getBase64Code(data.charCodeAt(i + 1)) << 12) |
      (getBase64Code(data.charCodeAt(i + 2)) << 6) |
      getBase64Code(data.charCodeAt(i + 3));
    result[j] = buffer >> 16;
    result[j + 1] = (buffer >> 8) & 0xff;
    result[j + 2] = buffer & 0xff;
  }
  return result.subarray(0, result.length - missingOctets);
}

/**
 * CREDIT: https://gist.github.com/enepomnyaschih/72c423f727d395eeaa09697058238727
 * @param charCode
 */
function getBase64Code(charCode: number): number {
  if (charCode >= base64codes.length) {
    throw new Error('Unable to parse base64 string.');
  }
  const code = base64codes[charCode];
  if (code === 255) {
    throw new Error('Unable to parse base64 string.');
  }
  return code;
}

// CREDIT: https://gist.github.com/enepomnyaschih/72c423f727d395eeaa09697058238727
const base64codes = [
  255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  255, 255, 255, 255, 255, 62, 255, 255, 255, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 255, 255,
  255, 0, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 255, 255, 255, 255, 255, 255, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
  38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
];
