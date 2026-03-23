<script setup lang="ts">
import { ref } from 'vue'

const proxyUrl = ref('')
const result = ref('')
const loading = ref(false)

// 通过代理发送请求
async function sendRequest() {
  if (!proxyUrl.value) {
    alert('请输入路径')
    return
  }

  loading.value = true
  result.value = ''

  try {
    const response = await fetch(`/proxy${proxyUrl.value.startsWith('/') ? proxyUrl.value : '/' + proxyUrl.value}`)
    const data = await response.text()
    result.value = data
  } catch (error) {
    result.value = `错误: ${error}`
  } finally {
    loading.value = false
  }
}

// 发送 JSON 请求
async function sendJsonRequest() {
  if (!proxyUrl.value) {
    alert('请输入路径')
    return
  }

  loading.value = true
  result.value = ''

  try {
    const response = await fetch(`/api${proxyUrl.value.startsWith('/') ? proxyUrl.value : '/' + proxyUrl.value}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    result.value = JSON.stringify(data, null, 2)
  } catch (error) {
    result.value = `错误: ${error}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container">
    <h1>SuperAPI 中转代理站</h1>
    <p class="desc">代理目标: <code>superapi.superauthority.top</code></p>

    <div class="proxy-info">
      <h3>代理规则</h3>
      <ul>
        <li><code>/api/*</code> → <code>https://superapi.superauthority.top/*</code> (JSON请求)</li>
        <li><code>/proxy/*</code> → <code>https://superapi.superauthority.top/*</code> (通用代理)</li>
      </ul>
    </div>

    <div class="input-section">
      <label>请求路径:</label>
      <input
        v-model="proxyUrl"
        type="text"
        placeholder="例如: /v1/chat/completions"
        @keyup.enter="sendRequest"
      />
    </div>

    <div class="buttons">
      <button @click="sendJsonRequest" :disabled="loading">发送 JSON 请求</button>
      <button @click="sendRequest" :disabled="loading">发送原始请求</button>
    </div>

    <div class="result" v-if="result">
      <h3>响应结果:</h3>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #42b883;
  text-align: center;
}

.desc {
  text-align: center;
  color: #666;
}

.proxy-info {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.proxy-info code {
  background: #e0e0e0;
  padding: 2px 6px;
  border-radius: 4px;
}

.input-section {
  margin: 1rem 0;
}

.input-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.input-section input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

button {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background: #35a070;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.result {
  margin-top: 1rem;
}

.result pre {
  background: #1a1a1a;
  color: #0f0;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
