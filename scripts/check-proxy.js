/**
 * Vite 代理配置检查脚本
 * 
 * 本脚本用于验证 vite.config.js 中是否包含所有后端服务的代理配置
 * 确保开发环境下前端能正确转发 API 请求到各个后端服务
 * 
 * @description 读取 vite.config.js，验证代理配置完整性
 * @usage node scripts/check-proxy.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 后端服务配置列表
 * @description 需要配置代理的服务及对应端口
 * 注意：禁止硬编码端口，仅用于配置验证
 */
const requiredServices = [
  {
    name: 'users',
    port: 8082,
    paths: ['/api/v1/users']
  },
  {
    name: 'courts',
    port: 8081,
    paths: ['/api/v1/courts', '/api/v1/monitor']
  },
  {
    name: 'posts',
    port: 8083,
    paths: ['/api/v1/posts', '/api/v1/comments', '/api/v1/messages']
  }
]

/**
 * 解析 vite.config.js 内容
 * @param {string} content - 配置文件内容
 * @returns {Object|null} 解析后的配置对象
 */
function parseViteConfig(content) {
  try {
    // 提取 server.proxy 部分
    const proxyMatch = content.match(/proxy:\s*{([\s\S]*?)}/)
    if (!proxyMatch) {
      console.error('未找到 proxy 配置')
      return null
    }
    
    // 解析代理配置键值对
    const proxyConfig = {}
    
    // 匹配 '/api/v1/xxx': { target: 'http://localhost:xxxx' }
    const proxyRegex = /['"](\/api\/v1\/[^'"]+)['"]:\s*{[^}]*target:\s*['"]http:\/\/localhost:(\d+)/g
    let match
    
    while ((match = proxyRegex.exec(content)) !== null) {
      proxyConfig[match[1]] = {
        targetPort: parseInt(match[2], 10)
      }
    }
    
    return proxyConfig
  } catch (error) {
    console.error('解析配置文件失败:', error.message)
    return null
  }
}

/**
 * 检查代理配置完整性
 * @param {Object} proxyConfig - 当前代理配置
 * @returns {Object} 检查结果
 */
function checkProxyConfig(proxyConfig) {
  const result = {
    missing: [],
    found: [],
    incorrect: []
  }
  
  // 检查每个服务所需的路径
  for (const service of requiredServices) {
    for (const pathPattern of service.paths) {
      if (proxyConfig[pathPattern]) {
        const configuredPort = proxyConfig[pathPattern].targetPort
        if (configuredPort === service.port) {
          result.found.push({
            path: pathPattern,
            service: service.name,
            port: service.port
          })
        } else {
          result.incorrect.push({
            path: pathPattern,
            expected: service.port,
            actual: configuredPort
          })
        }
      } else {
        result.missing.push({
          path: pathPattern,
          service: service.name,
          port: service.port
        })
      }
    }
  }
  
  return result
}

/**
 * 打印检查结果
 * @param {Object} checkResult - 检查结果
 */
function printResults(checkResult) {
  console.log('\n========== Vite 代理配置检查 ==========\n')
  
  // 打印已配置的路径
  if (checkResult.found.length > 0) {
    console.log('✓ 已正确配置的代理:')
    checkResult.found.forEach(item => {
      console.log(`  - ${item.path} -> localhost:${item.port} (${item.service})`)
    })
    console.log()
  }
  
  // 打印配置错误的路径
  if (checkResult.incorrect.length > 0) {
    console.log('✗ 端口配置错误的代理:')
    checkResult.incorrect.forEach(item => {
      console.log(`  - ${item.path} -> 期望端口: ${item.expected}, 实际端口: ${item.actual}`)
    })
    console.log()
  }
  
  // 打印缺失的路径
  if (checkResult.missing.length > 0) {
    console.log('✗ 缺失的代理配置:')
    checkResult.missing.forEach(item => {
      console.log(`  - ${item.path} (服务: ${item.name}, 端口: ${item.port})`)
    })
    console.log()
  }
  
  // 总结
  console.log('---------- 检查总结 ----------')
  const total = requiredServices.reduce((sum, s) => sum + s.paths.length, 0)
  console.log(`需要配置: ${total} 个路径`)
  console.log(`已正确配置: ${checkResult.found.length} 个路径`)
  console.log(`配置错误: ${checkResult.incorrect.length} 个路径`)
  console.log(`缺失配置: ${checkResult.missing.length} 个路径`)
  
  if (checkResult.missing.length === 0 && checkResult.incorrect.length === 0) {
    console.log('\n✓ 所有代理配置已正确设置!')
  } else {
    console.log('\n✗ 存在配置问题，请检查 vite.config.js')
  }
  console.log('=======================================\n')
}

/**
 * 主函数
 */
function main() {
  const configPath = path.join(__dirname, '..', 'vite.config.js')
  
  // 检查文件是否存在
  if (!fs.existsSync(configPath)) {
    console.error(`错误: 找不到配置文件 ${configPath}`)
    process.exit(1)
  }
  
  // 读取配置文件
  const content = fs.readFileSync(configPath, 'utf-8')
  
  // 解析配置
  const proxyConfig = parseViteConfig(content)
  
  if (!proxyConfig) {
    console.error('错误: 无法解析代理配置')
    process.exit(1)
  }
  
  // 检查配置完整性
  const checkResult = checkProxyConfig(proxyConfig)
  
  // 打印结果
  printResults(checkResult)
  
  // 如果有缺失配置，退出码为 1
  if (checkResult.missing.length > 0 || checkResult.incorrect.length > 0) {
    process.exit(1)
  }
}

// 执行主函数
main()
