1. 安装依赖
```npm install```
2. 本地调试
```npm run test```
### 本地智能体安装
1. 克隆项目到本地
2. ```npm run build```进行打包
3. mcp配置文件添加
```json
"mcpServers": {
    "caipiao": {
    "command": "node",
    "args": [
      "/{绝对路径}/caipiao-mcp/build/index.js"
    ]
  }
}
```
