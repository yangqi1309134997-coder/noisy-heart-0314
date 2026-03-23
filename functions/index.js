const TARGET_HOST = 'superapi.superauthority.top';

export default async function handler(request) {
  const url = new URL(request.url);
  const targetUrl = `https://${TARGET_HOST}${url.pathname}${url.search}`;

  // 复制并修改请求头
  const headers = new Headers();
  for (const [key, value] of request.headers.entries()) {
    // 跳过一些 hop-by-hop 头
    if (!['host', 'connection', 'keep-alive', 'transfer-encoding'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  }
  headers.set('Host', TARGET_HOST);

  // 处理 OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // 构建代理请求体
  let body = null;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = request.body;
  }

  try {
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
      redirect: 'manual'
    });

    const response = await fetch(proxyRequest);

    // 构建响应
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    responseHeaders.set('Access-Control-Allow-Headers', '*');

    // 处理重定向
    if (response.status >= 300 && response.status < 400) {
      const location = responseHeaders.get('Location');
      if (location) {
        const newLocation = location.replace(TARGET_HOST, url.host);
        responseHeaders.set('Location', newLocation);
      }
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    return new Response(`Proxy Error: ${error.message}`, {
      status: 502,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
