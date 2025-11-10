# 五子棋游戏 (Gomoku Game)

一个使用纯原生JavaScript开发的五子棋小游戏，支持双人对战。

## 项目特点

- 📱 响应式设计，支持桌面端和移动端
- 🎨 精美的UI界面和棋子渐变效果
- ⚡ 使用ES6+模块化语法编写
- 💬 完整的中文注释，便于学习和维护
- 🎯 完整的游戏逻辑：五子连珠判定、平局检测等

## 技术栈

- HTML5 Canvas - 绘制棋盘和棋子
- CSS3 - 页面样式和动画效果
- 原生JavaScript (ES6+) - 游戏逻辑实现

## 项目结构

```
gomoku-game/
├── index.html      # 主页面文件
├── style.css       # 样式文件
├── game.js         # 游戏逻辑文件
└── README.md       # 项目说明文件
```

## 如何运行

1. 直接在浏览器中打开 `index.html` 文件即可开始游戏
2. 或者使用本地服务器运行：
   ```bash
   # 使用 Python 3
   python -m http.server 8000

   # 使用 PHP
   php -S localhost:8000

   # 使用 Node.js (需要安装 http-server)
   npx http-server
   ```
3. 在浏览器中访问 `http://localhost:8000`

## 游戏规则

1. 黑方先手，双方轮流落子
2. 在棋盘上点击即可落子
3. 先将5个棋子连成一线（横、竖、斜）的一方获胜
4. 如果棋盘下满仍无人获胜，则为平局
5. 点击"重新开始"按钮可以开启新一局

## 代码规范

本项目遵循以下代码规范：

- ✅ 使用ES模块 (import/export) 语法
- ✅ 使用解构导入
- ✅ 所有代码添加中文注释
- ✅ 使用语义化的变量和函数命名

## 主要功能模块

### GomokuGame 类

游戏核心类，包含以下主要方法：

- `initBoard()` - 初始化棋盘数据
- `drawBoard()` - 绘制棋盘界面
- `drawPiece(row, col, player)` - 绘制棋子
- `handleClick(event)` - 处理用户点击
- `makeMove(row, col)` - 执行落子操作
- `checkWin(row, col)` - 检查是否获胜
- `switchPlayer()` - 切换玩家
- `reset()` - 重置游戏

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

建议使用现代浏览器以获得最佳体验。

## 后续改进计划

- [ ] 添加悔棋功能
- [ ] 添加人机对战（AI）
- [ ] 添加音效
- [ ] 添加游戏历史记录
- [ ] 支持禁手规则（专业模式）

## 许可证

MIT License

## 作者

Created with Claude Code
