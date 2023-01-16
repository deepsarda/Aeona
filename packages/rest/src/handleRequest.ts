import { createRestManager } from 'discordeno/rest';

import config from './config';
import runMethod from './requests/runMethod';
import sendRequest from './requests/sendRequest';
import { RequestTypes } from './types';

const { DISCORD_TOKEN, REST_AUTHORIZATION } = config(['DISCORD_TOKEN', 'REST_AUTHORIZATION']);

const rest = createRestManager({
  token: DISCORD_TOKEN,
  secretKey: REST_AUTHORIZATION,
  processRateLimitedPaths: (rest) => {
    const now = Date.now();

    for (const [key, value] of rest.rateLimitedPaths.entries()) {
      rest.debug(
        `[REST - processRateLimitedPaths] Running for of loop. ${
          value.resetTimestamp - now
        } ${key}`,
      );
      // IF THE TIME HAS NOT REACHED CANCEL
      if (value.resetTimestamp > now) continue;

      // RATE LIMIT IS OVER, DELETE THE RATE LIMITER
      rest.rateLimitedPaths.delete(key);
      // IF IT WAS GLOBAL ALSO MARK THE GLOBAL VALUE AS FALSE
      if (key === 'global') rest.globallyRateLimited = false;
    }

    // ALL PATHS ARE CLEARED CAN CANCEL OUT!
    if (!rest.rateLimitedPaths.size) {
      rest.processingRateLimitedPaths = false;
    } else {
      rest.processingRateLimitedPaths = true;
      // RECHECK IN 1 SECOND
      setTimeout(() => {
        rest.debug(`[REST - processRateLimitedPaths] Running setTimeout.`);
        rest.processRateLimitedPaths(rest);
      }, 1000);
    }
  },
  debug: (s) => {
    if (!s.includes('[REST - fetch')) console.log(s);
  },
});

const handleRequest = async (req: RequestTypes): Promise<unknown> => {
  switch (req.type) {
    case 'RUN_METHOD':
      return runMethod(req.data, rest);
    case 'SEND_REQUEST':
      return sendRequest(req.data, rest);
  }
};
rest.invalidBucket = createInvalidRequestBucket({});
export { handleRequest };
function createInvalidRequestBucket(options: InvalidRequestBucketOptions): InvalidRequestBucket {
  const bucket: InvalidRequestBucket = {
    current: options.current ?? 0,
    max: options.max ?? 10000,
    interval: options.interval ?? 600000,
    timeoutId: options.timeoutId ?? 0,
    safety: options.safety ?? 1,
    frozenAt: options.frozenAt ?? 0,
    errorStatuses: options.errorStatuses ?? [401, 403, 429],
    requested: options.requested ?? 0,
    processing: false,

    waiting: [],

    requestsAllowed: function () {
      return bucket.max - bucket.current - bucket.requested - bucket.safety;
    },

    isRequestAllowed: function () {
      return bucket.requestsAllowed() > 0;
    },

    waitUntilRequestAvailable: async function () {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        // If whatever amount of requests is left is more than the safety margin, allow the request
        if (bucket.isRequestAllowed()) {
          bucket.requested++;
          resolve();
        } else {
          bucket.waiting.push(resolve);
          await bucket.processWaiting();
        }
      });
    },

    processWaiting: async function () {
      // If already processing, that loop will handle all waiting requests.
      if (bucket.processing) {
        return;
      }

      // Mark as processing so other loops don't start
      bucket.processing = true;

      while (bucket.waiting.length) {
        if (bucket.isRequestAllowed()) {
          bucket.requested++;
          // Resolve the next item in the queue
          bucket.waiting.shift()?.();
        } else {
          await delay(10);
        }
      }

      // Mark as false so next pending request can be triggered by new loop.
      bucket.processing = false;
    },

    handleCompletedRequest: function (code, sharedScope) {
      // Since request is complete, we can remove one from requested.
      bucket.requested--;
      // Since it is as a valid request, we don't need to do anything
      if (!bucket.errorStatuses.includes(code)) return;
      // Shared scope is not considered invalid
      if (code === 429 && sharedScope) return;

      // INVALID REQUEST WAS MADE

      // If it was not frozen before, mark it frozen
      if (!bucket.frozenAt) bucket.frozenAt = Date.now();
      // Mark a request has been invalid
      bucket.current++;
      // If a timeout was not started, start a timeout to reset this bucket
      if (!bucket.timeoutId) {
        //@ts-ignore
        bucket.timeoutId = setTimeout(() => {
          bucket.frozenAt = 0;
          bucket.current = 0;
          bucket.timeoutId = 0;
        }, bucket.interval);
      }
    },
  };

  return bucket;
}

export interface InvalidRequestBucketOptions {
  /** current invalid amount */
  current?: number;
  /** max invalid requests allowed until ban. Defaults to 10,000 */
  max?: number;
  /** The time that discord allows to make the max number of invalid requests. Defaults to 10 minutes */
  interval?: number;
  /** timer to reset to 0 */
  timeoutId?: number;
  /** how safe to be from max. Defaults to 1 */
  safety?: number;
  /** when first request in this period was made */
  frozenAt?: number;
  /** The request statuses that count as an invalid request. */
  errorStatuses?: number[];
  /** The amount of requests that were requested from this bucket. */
  requested?: number;
}

export interface InvalidRequestBucket {
  /** current invalid amount */
  current: number;
  /** max invalid requests allowed until ban. Defaults to 10,000 */
  max: number;
  /** The time that discord allows to make the max number of invalid requests. Defaults to 10 minutes */
  interval: number;
  /** timer to reset to 0 */
  timeoutId: number;
  /** how safe to be from max. Defaults to 1 */
  safety: number;
  /** when first request in this period was made */
  frozenAt: number;
  /** The request statuses that count as an invalid request. */
  errorStatuses: number[];
  /** The amount of requests that were requested from this bucket. */
  requested: number;
  /** The requests that are currently pending. */
  waiting: ((value: void | PromiseLike<void>) => void)[];
  /** Whether or not the waiting queue is already processing. */
  processing: boolean;

  /** Gives the number of requests that are currently allowed. */
  requestsAllowed: () => number;
  /** Checks if a request is allowed at this time. */
  isRequestAllowed: () => boolean;
  /** Waits until a request is available */
  waitUntilRequestAvailable: () => Promise<void>;
  /** Begins processing the waiting queue of requests. */
  processWaiting: () => Promise<void>;
  /** Handler for whenever a request is validated. This should update the requested values or trigger any other necessary stuff. */
  handleCompletedRequest: (code: number, sharedScope: boolean) => void;
}
export function delay(ms: number): Promise<void> {
  return new Promise((res): number =>
    //@ts-ignore
    setTimeout((): void => {
      res();
    }, ms),
  );
}
