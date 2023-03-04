import { RestManager } from '@discordeno/rest';
import { BASE_URL } from 'discordeno';

import config from '../config.js';
import { RunMethod } from '../types.js';

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

  const body = data.body ? (data.body as any) : undefined;
  if (body && body.file) {
    body.file = findFiles(body.file);
    console.log(body.file);
  }
  const result = await rest
    .makeRequest(
      data.method,
      `${BASE_URL}/v${rest.version}${data.url}`,
      body,
      data.options,
    )
    .catch((e) => {
      if (e instanceof Error) {
        if (e.message.includes('[404]')) return e;
        // eslint-disable-next-line no-console
        return e;
      }
      console.error(e);
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

/
