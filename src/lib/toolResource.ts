import { useEffect, useState } from 'react';
import type { Tool } from '@/types/tool';

export interface SuspenseResource<T> {
  read: () => T;
}

/**
 * Wraps a standard JavaScript Promise into a React Suspense-compatible resource.
 * Calling .read() will:
 * - throw the promise if pending (causing React Suspense to render fallback)
 * - throw the error if rejected
 * - return the resolved value if success
 */
export function createSuspenseResource<T>(promise: Promise<T>): SuspenseResource<T> {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: T;
  let error: unknown;

  const suspender = promise.then(
    (res) => {
      status = 'success';
      result = res;
    },
    (err) => {
      status = 'error';
      error = err;
    }
  );

  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw error;
      } else if (status === 'success') {
        return result;
      }
      throw new Error('Unexpected Suspense state');
    },
  };
}

/**
 * Creates an async simulated or real fetch resource for a collection of tools with an optional artificial micro-delay.
 */
export function createToolsResource(
  toolsFetcher: () => Promise<Tool[]> | Tool[],
  delayMs: number = 0
): SuspenseResource<Tool[]> {
  const promise = new Promise<Tool[]>((resolve, reject) => {
    try {
      const data = toolsFetcher();
      if (data instanceof Promise) {
        data.then((resolvedTools) => {
          if (delayMs > 0) {
            setTimeout(() => resolve(resolvedTools), delayMs);
          } else {
            resolve(resolvedTools);
          }
        }).catch(reject);
      } else {
        if (delayMs > 0) {
          setTimeout(() => resolve(data), delayMs);
        } else {
          resolve(data);
        }
      }
    } catch (err) {
      reject(err);
    }
  });

  return createSuspenseResource(promise);
}
