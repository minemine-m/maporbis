/**
 * MapOrbis Demo 公共工具函数
 * 在 HTML 中通过 <script src="./js/demo-common.js"></script> 引入
 */

// 初始化通知容器
function createNotificationContainer() {
  if (document.getElementById('notif-container')) return;
  const div = document.createElement('div');
  div.id = 'notif-container';
  div.className = 'orbis-notification';
  document.body.appendChild(div);
}

// 初始化加载指示器
function createLoadingContainer() {
  if (document.getElementById('loading-container')) return;
  const div = document.createElement('div');
  div.id = 'loading-container';
  div.className = 'orbis-loading';
  div.style.display = 'none';
  div.innerHTML = '<div class="orbis-spinner"></div><div class="orbis-loading-text">加载中...</div>';
  document.body.appendChild(div);
}

// 初始化主题
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

// 显示通知
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

// 显示加载
function showLoading(text = '加载中...') {
  const c = document.getElementById('loading-container');
  if (c) {
    c.querySelector('.orbis-loading-text').textContent = text;
    c.style.display = 'block';
  }
}

// 隐藏加载
function hideLoading() {
  const c = document.getElementById('loading-container');
  if (c) c.style.display = 'none';
}

// 页面加载完成后自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    createNotificationContainer();
    createLoadingContainer();
    initTheme();
  });
} else {
  createNotificationContainer();
  createLoadingContainer();
  initTheme();
}
