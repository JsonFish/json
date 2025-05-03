/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 导航栏Btn hover 背景颜色
        btnHover: 'var(--header-btn-hover-bgc)',
        // 登录弹窗背景颜色
        dialog: 'var(--login-dialog-background-color)',
        // 页脚背景颜色
        footer: 'var(--footer-background-color)',
        // 导航栏文字颜色
        menu: 'var(--menu-text-color)',
        // 导航栏文字激活颜色
        menuActive: 'var(--menu-text-active-color)',
        // 登录按钮背景颜色
        loginBtnBg: 'var(--login-btn-bg-color)',
        // 登录按钮文字颜色
        loginBtnText: 'var(--login-btn-color)',
        // 登录按钮hover背景颜色
        loginBtnHover: 'var(--login-btn-color-hover)',
        // 文章列表hover时背景颜色
        articleCard: 'var(--article-card-background-color)',
        // 聊天框背景颜色
        chatBg: 'var(--chat-bg-color)',
      },
      width: {
        5: '15rem',
        33: '33rem',
        45: '45rem',
        50: '50rem',
        60: '60rem',
        65: '65rem',
        70: '70rem',
        75: '75rem',
      },
      height: {
        30: '20rem',
        38: '38rem',
      },
      fontSize: {
        10: '0.6rem',
      },
    },
  },
  plugins: [],
}
