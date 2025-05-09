import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

// 利用jsap来进行盒子的动画
/**
 *
 * @param {*} list 盒子类名
 * @param {*} x 位移
 * @param {*} duration 持续时间 s
 * @param {*} ease 动画过渡 详情见 https://gsap.com/docs/v3/Eases/
 */
function gsapTransX(list: any, x: any, duration = 1, ease = 'power1.inOut') {
  gsap.registerPlugin(ScrollTrigger)
  list.map((v: any) => {
    gsap.fromTo(
      v,
      {
        scrollTrigger: v,
        x,
      },
      {
        scrollTrigger: v,
        x: 0,
        duration,
        ease,
      },
    )
  })
}

/**
 *
 * @param {*} list 盒子类名
 * @param {*} y 位移
 * @param {*} duration 持续时间 s
 * @param {*} ease 动画过渡 详情见 https://gsap.com/docs/v3/Eases/
 */
function gsapTransY(list: any, y: any, duration = 1, ease = 'power1.inOut') {
  gsap.registerPlugin(ScrollTrigger)
  list.map((v: any) => {
    gsap.fromTo(
      v,
      {
        scrollTrigger: v,
        y,
      },
      {
        scrollTrigger: v,
        y: 0,
        duration,
        ease,
      },
    )
  })
}

/**
 *
 * @param {*} list 盒子类名
 * @param {*} from 从多小开始scale 12月22日 不要scale了 不喜欢
 * @param {*} duration 持续时间 s
 * @param {*} ease 动画过渡 详情见 https://gsap.com/docs/v3/Eases/
 */
function gsapTransXScale(
  list: any,
  opacity = 0,
  duration = 0.6,
  ease = 'power2.inOut',
) {
  gsap.registerPlugin(ScrollTrigger)
  list.map((v: any) => {
    gsap.fromTo(
      v,
      {
        scrollTrigger: v,
        // scale: from,
        duration: 0,
        y: 50,
        opacity: opacity,
      },
      {
        scrollTrigger: v,
        // scale: 1,
        duration,
        opacity: 1,
        y: 0,
        ease,
      },
    )
  })
}

// 字体动画
function gsapTransFont(name: any) {
  return gsap.to(name, {
    y: -10,
    stagger: 0.3,
  })
}

function gsapTransLyric(name: any, duration: any, reverse = false, dom: any) {
  let gsapControl
  if (!reverse) {
    gsapControl = gsap.fromTo(
      name,
      {
        scaleX: 1.1,
        opacity: 0.5,
      },
      {
        opacity: 1,
        scaleX: 1,
        duration,
      },
    )
  } else {
    gsapControl = gsap.fromTo(
      name,
      {
        opacity: 1,
        scaleX: 1,
        filter: `blur(0px)`,
      },
      {
        opacity: 0,
        filter: `blur(2px)`,
        scaleX: 1.1,
        duration,
        onComplete() {
          if (dom) {
            dom.style.filter = 'blur(0)'
          }
        },
      },
    )
  }

  return gsapControl
}

function gsapTransLyricLeftToRight(name: any, duration: any) {
  return gsap.fromTo(
    name,
    {
      backgroundSize: `0% 100%`,
    },
    {
      backgroundSize: `100% 100%`,
      duration,
      ease: 'none',
    },
  )
}

export {
  gsapTransX,
  gsapTransXScale,
  gsapTransY,
  gsapTransFont,
  gsapTransLyric,
  gsapTransLyricLeftToRight,
}
