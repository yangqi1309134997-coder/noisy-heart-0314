export default async function handler(request) {
  const url = new URL(request.url);
  const targetUrl = `https://superapi.superauthority.top${url.pathname}${url.search}`;

  // 复制请求头
  const headers = new Headers(request.headers);
  headers.set('Host', 'superapi.superauthority.top');

  // 构建代理请求
  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: 'follow'
  });

  try {
    const response = await fetch(proxyRequest);

    // 复制响应并添加 CORS 头
    const proxyResponse = new Response(response.body, response);
    proxyResponse.headers.set('Access-Control-Allow-Origin', '*');
    proxyResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    proxyResponse.headers.set('Access-Control-Allow-Headers', '*');

    return proxyResponse;
  } catch (error) {
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}
