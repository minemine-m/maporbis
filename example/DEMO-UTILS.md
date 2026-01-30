# Demo 通用工具函数使用说明

## 📝 简介

所有通用功能的代码都直接写在 HTML 文件的 `<script>` 标签中，方便使用者直接复制整个 HTML 文件。

## 🚀 使用方式

### 1. 复制模板文件

使用 `demo-template.html` 作为起点，它包含了所有通用工具函数。

### 2. 可用的工具函数

```javascript
// 显示通知（自动3秒后消失）
notify("操作成功！", "success");        // 成功提示（绿色）
notify("这是提示信息", "info");          // 信息提示（蓝色）
notify("警告信息", "warning");           // 警告提示（橙色）
notify("错误信息", "error");             // 错误提示（红色）
notify("自定义时长", "info", 5000);      // 自定义显示5秒

// 显示/隐藏加载指示器
showLoading();                          // 显示加载（默认文本）
showLoading("正在加载数据...");          // 自定义加载文本
hideLoading();                          // 隐藏加载

// 主题切换（已自动初始化，无需手动调用）
// 用户点击 #themeToggle 按钮自动切换，并保存到 localStorage
```

### 3. 工具函数会自动：

- ✅ 创建通知容器（无需在 HTML 中写 DOM）
- ✅ 创建加载指示器（无需在 HTML 中写 DOM）
- ✅ 初始化主题切换（自动从 localStorage 加载用户偏好）
- ✅ 绑定主题切换按钮事件

## 📋 完整示例

```html
<script type="module">
  import * as maporbis from "../src/index.ts";

  // ========================================
  // 复制这段通用工具函数代码
  // ========================================
  
  function createNotificationContainer() {
    if (document.getElementById('notif-container')) return;
    const div = document.createElement('div');
    div.id = 'notif-container';
    div.className = 'orbis-notification';
    document.body.appendChild(div);
  }

  function createLoadingContainer() {
    if (document.getElementById('loading-container')) return;
    const div = document.createElement('div');
    div.id = 'loading-container';
    div.className = 'orbis-loading';
    div.style.display = 'none';
    div.innerHTML = '<div class="orbis-spinner"></div><div class="orbis-loading-text">加载中...</div>';
    document.body.appendChild(div);
  }

  function initTheme() {
    const saved = localStorage.getItem('orbis-theme');
    if (saved === 'dark') document.body.classList.add('orbis-dark');
    
    const btn = document.getElementById('themeToggle');
    if (btn) {
      updateThemeButton();
      btn.onclick = () => {
        document.body.classList.toggle('orbis-dark');
        localStorage.setItem('orbis-theme', document.body.classList.contains('orbis-dark') ? 'dark' : 'light');
        updateThemeButton();
      };
    }
  }

  function updateThemeButton() {
    const btn = document.getElementById('themeToggle');
    const isDark = document.body.classList.contains('orbis-dark');
    if (btn) {
      btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      btn.title = isDark ? '切换亮色模式' : '切换暗黑模式';
    }
  }

  function notify(msg, type = 'info', duration = 3000) {
    const c = document.getElementById('notif-container');
    if (!c) return;
    
    const icons = {
      success: '<i class="fas fa-check-circle"></i>',
      info: '<i class="fas fa-info-circle"></i>',
      warning: '<i class="fas fa-exclamation-triangle"></i>',
      error: '<i class="fas fa-times-circle"></i>'
    };
    
    c.className = `orbis-notification orbis-notification-${type}`;
    c.innerHTML = `<div class="orbis-notification-content">${icons[type]}<span>${msg}</span></div>`;
    setTimeout(() => c.classList.add('orbis-notification-show'), 10);
    setTimeout(() => c.classList.remove('orbis-notification-show'), duration);
  }

  function showLoading(text = '加载中...') {
    const c = document.getElementById('loading-container');
    if (c) {
      c.querySelector('.orbis-loading-text').textContent = text;
      c.style.display = 'block';
    }
  }

  function hideLoading() {
    const c = document.getElementById('loading-container');
    if (c) c.style.display = 'none';
  }

  // 初始化（必须调用）
  createNotificationContainer();
  createLoadingContainer();
  initTheme();

  // ========================================
  // 你的地图代码
  // ========================================
  
  const map = new maporbis.Map("container", { /* 配置 */ });
  
  // 使用工具函数
  map.on("loaded", () => {
    notify("地图加载完成", "success");
  });
  
  document.getElementById('myButton').onclick = () => {
    showLoading("正在添加标记...");
    // ... 你的操作
    hideLoading();
    notify("添加成功！", "success");
  };
</script>
```

## 🎨 HTML 要求

如果要使用主题切换功能，需要在 HTML 中添加切换按钮：

```html
<button class="orbis-toggle" id="themeToggle" title="切换暗黑模式">
  <i class="fas fa-moon"></i>
</button>
```

## ⚠️ 注意事项

1. **必须引入样式文件**：
   ```html
   <link rel="stylesheet" href="./css/orbisstyle.css" />
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
   ```

2. **必须调用初始化函数**：
   ```javascript
   createNotificationContainer();
   createLoadingContainer();
   initTheme();
   ```

3. **代码要放在 `<script type="module">` 中**

## 📦 文件说明

- `demo-template.html` - 包含所有工具函数的完整模板，复制后直接使用
- `css/orbisstyle.css` - UI 样式文件（必需）

## 💡 优势

- ✅ **完全自包含** - 工具函数直接在 HTML 中，无需外部 JS 文件
- ✅ **易于复制** - 用户可以直接复制整个 HTML 文件就能运行
- ✅ **无需打包** - 不需要构建工具
- ✅ **简单直接** - 没有复杂的类和实例化
- ✅ **自动创建 DOM** - 通知和加载指示器的 DOM 由 JS 自动创建