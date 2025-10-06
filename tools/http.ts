import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

export type HttpMethod = 'GET' | 'HEAD';

export interface HttpResponse<T = Buffer | string | unknown> {
  status: number;
  headers: Record<string, string | string[]>;
  body: T;
}

export interface HttpOptions {
  method?: HttpMethod;
  timeoutMs?: number;
  responseType?: 'text' | 'json' | 'buffer';
  headers?: Record<string, string>;
}

export async function request(url: string, options: HttpOptions = {}): Promise<HttpResponse> {
  const target = new URL(url);
  const client = target.protocol === 'https:' ? https : http;
  const method = options.method ?? 'GET';
  const timeoutMs = options.timeoutMs ?? 8000;
  const headers = options.headers ?? {};

  return new Promise<HttpResponse>((resolve, reject) => {
    const req = client.request(
      target,
      { method, headers },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const contentType = String(res.headers['content-type'] ?? '');
          const responseType = options.responseType ?? inferResponseType(contentType);
          let body: Buffer | string | unknown = buffer;

          if (responseType === 'text' || responseType === 'json') {
            const textBody = buffer.toString('utf8');
            body = textBody;
            if (responseType === 'json') {
              try {
                body = JSON.parse(textBody);
              } catch (error) {
                body = textBody;
              }
            }
          }

          resolve({
            status: res.statusCode ?? 0,
            headers: res.headers as Record<string, string | string[]>,
            body,
          });
        });
      },
    );

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`Request timed out after ${timeoutMs}ms`));
    });

    req.end();
  });
}

export async function get(url: string, options: Omit<HttpOptions, 'method'> = {}): Promise<HttpResponse> {
  return request(url, { ...options, method: 'GET' });
}

export async function head(url: string, options: Omit<HttpOptions, 'method'> = {}): Promise<HttpResponse> {
  return request(url, { ...options, method: 'HEAD' });
}

function inferResponseType(contentType: string): 'text' | 'json' | 'buffer' {
  if (!contentType) {
    return 'buffer';
  }

  if (contentType.includes('application/json')) {
    return 'json';
  }

  if (contentType.startsWith('text/') || contentType.includes('+json') || contentType.includes('xml')) {
    return 'text';
  }

  return 'buffer';
}
