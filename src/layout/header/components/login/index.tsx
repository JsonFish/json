import { defineComponent, ref, reactive, onMounted } from 'vue'
import { getCaptcha, GetEmailCode, reqRegister } from '@/api/user'
import { LoginParmars, signInParmars } from '@/api/user/type'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { client_id, redirect_uri } from '@/setting/github'
import { setToken } from '@/utils/token'
import {
  Message,
  Lock,
  InfoFilled,
  ChatDotRound,
  Promotion,
} from '@element-plus/icons-vue'
export default defineComponent({
  setup(_, { expose }) {
    const dialogFormVisible = ref<boolean>(false)
    expose({
      dialogFormVisible,
    })
    const userStore = useUserStore()
    const loginForm = reactive<LoginParmars>({
      email: '',
      password: '',
      code: '',
      captchaId: 0,
    })
    const signInForm = reactive<signInParmars>({
      email: '',
      password: '',
      code: '',
    })
    const signIn = ref<boolean>(false)
    const loginFormRef = ref<any>(null)
    const signInFormRef = ref<any>(null)
    const loading = ref<boolean>(false)
    const captchaImage = ref<string>('')
    const countDownTime = ref<number>(60)
    const countDownIng = ref<boolean>(false)

    onMounted(() => {
      debounce()
      if (localStorage.getItem('start')) {
        countDownIng.value = true
        sendEmail()
      }
    })

    // 获取图片验证码
    const getCaptchaImg = async () => {
      loginForm.code = ''
      try {
        const response = await getCaptcha()
        captchaImage.value = `data:image/jpg;base64,${response.data.imageBase64}`
        loginForm.captchaId = response.data.id
      } catch (error) {
        console.error('Error fetching captcha:', error)
      }
    }

    // 图片验证码防抖
    let time: any = null
    const debounce = async () => {
      if (time == null) {
        await getCaptchaImg()
      }
      clearTimeout(time)
      time = setTimeout(() => {
        time = null
      }, 1000)
    }

    const toSignIn = () => {
      signIn.value = !signIn.value
    }

    // 登录
    const onLogin = async (formEl: any) => {
      if (!formEl) return
      try {
        await formEl.validate(async (vaild: boolean, fields: any) => {
          if (vaild) {
            loading.value = true
            try {
              await userStore.userLogin(loginForm)
              ElMessage({ type: 'info', message: '登录成功' })
              closeDialog()
            } catch (err: any) {
              ElMessage({ type: 'error', message: err })
              loginForm.code = ''
              debounce()
            }
            loading.value = false
          } else {
            return fields
          }
        })
      } catch (error) {
        console.error('Error validating login form:', error)
      }
    }

    // 发送验证码
    const sendEmail = async () => {
      countDownIng.value = true
      const startTime = localStorage.getItem('start') as unknown as number
      const nowTime = new Date().getTime()
      if (startTime) {
        let surplus =
          60 - parseInt(((nowTime - startTime) / 1000) as unknown as string, 10)
        countDownTime.value = surplus <= 0 ? 0 : surplus
      } else {
        countDownTime.value = 60
        localStorage.setItem('start', nowTime as unknown as string)

        try {
          const response = await GetEmailCode({ email: signInForm.email })
          if (response.code == 200) {
            ElMessage({ type: 'info', message: '发送成功' })
          } else {
            ElMessage({ type: 'error', message: response.message })
          }
        } catch (error) {
          console.error('Error sending email code:', error)
        }
      }

      let timer = setInterval(() => {
        countDownTime.value--
        if (countDownTime.value <= 0) {
          localStorage.removeItem('start')
          clearInterval(timer)
          countDownTime.value = 60
          countDownIng.value = false
        }
      }, 1000)
    }

    // 注册
    const onSignIn = async (formEl: any) => {
      if (!formEl) return
      try {
        await formEl.validate(async (vaild: boolean, fields: any) => {
          if (vaild) {
            loading.value = true
            try {
              const response = await reqRegister(signInForm)
              if (response.code == 200) {
                userStore.username = response.data.username
                userStore.avatar = response.data.avatar
                setToken(response.data)
                ElMessage({ type: 'info', message: '注册成功! 已为您自动登录' })
                closeDialog()
              } else {
                ElMessage({ type: 'error', message: response.message })
              }
            } catch (err: any) {
              ElMessage({ type: 'error', message: err })
            }
            loading.value = false
          } else {
            return fields
          }
        })
      } catch (error) {
        console.error('Error validating signIn form:', error)
      }
    }

    // github 登录
    const loginByGithub = () => {
      const path = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}`
      window.location.replace(path)
    }

    // 关闭登录窗
    const closeDialog = () => {
      loginFormRef.value?.resetFields()
      signInFormRef.value?.resetFields()
      signIn.value = false
      dialogFormVisible.value = false
    }

    return () => (
      <div>
        <el-dialog
          class="p-6 rounded-md bg-dialog"
          lockScroll={false}
          width="370"
          alignCenter
          v-model={dialogFormVisible.value}
          onClose={closeDialog}
          appendToBody
        >
          {!signIn.value ? (
            <div>
              <div class="text-center text-xl mb-3 -mt-6">登录</div>
              <el-form model={loginForm} ref={loginFormRef} size="default">
                <el-form-item
                  prop="email"
                  rules={[
                    {
                      required: true,
                      message: '请输入邮箱',
                      trigger: 'blur',
                    },
                  ]}
                >
                  <el-input
                    clearable
                    v-model={loginForm.email}
                    placeholder="邮箱"
                    prefixIcon={Message}
                    onChange={(e: any) => (loginForm.email = e.target.value)}
                  />
                </el-form-item>
                <el-form-item
                  prop="password"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码',
                      trigger: 'blur',
                    },
                  ]}
                >
                  <el-input
                    clearable
                    showPassword
                    v-model={loginForm.password}
                    placeholder="密码"
                    prefixIcon={Lock}
                    onChange={(e: any) => (loginForm.password = e.target.value)}
                  />
                </el-form-item>
                <el-form-item
                  prop="code"
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码',
                      trigger: 'blur',
                    },
                  ]}
                >
                  <div class="w-full flex justify-between">
                    <el-input
                      clearable
                      v-model={loginForm.code}
                      placeholder="验证码"
                      prefixIcon={InfoFilled}
                      class="w-3/5"
                      onChange={(e: any) => (loginForm.code = e.target.value)}
                    />
                    <img
                      loading="lazy"
                      onClick={debounce}
                      class="w-1/4"
                      src={captchaImage.value}
                      alt=""
                    />
                  </div>
                </el-form-item>
                <el-button
                  class="w-full bg-loginBtnBg text-loginBtnText hover:bg-loginBtnHover hover:text-loginBtnText"
                  onClick={() => onLogin(loginFormRef.value)}
                  size="default"
                  loading={loading.value}
                >
                  登录
                </el-button>
                <div class="flex justify-between">
                  <el-link class="text-xs">忘记密码?</el-link>
                  <div>
                    <span class="text-xs">没有账号?</span>
                    <el-link class="text-xs align-baseline" onClick={toSignIn}>
                      去注册
                    </el-link>
                  </div>
                </div>
              </el-form>
            </div>
          ) : (
            <div>
              <div class="text-center text-xl mb-3 -mt-6">注册</div>
              <el-form model={signInForm} ref={signInFormRef} size="default">
                <el-form-item
                  prop="email"
                  rules={[
                    {
                      required: true,
                      min: 10,
                      max: 22,
                      message: '请输入有效邮箱',
                      trigger: 'blur',
                    },
                  ]}
                >
                  <el-input
                    clearable
                    v-model={signInForm.email}
                    placeholder="请输入有效邮箱"
                    prefixIcon={Message}
                    onChange={(e: any) => (signInForm.email = e.target.value)}
                  ></el-input>
                </el-form-item>
                <el-form-item
                  prop="password"
                  rules={[
                    {
                      required: true,
                      message: '请设置密码',
                      trigger: 'blur',
                    },
                  ]}
                >
                  <el-input
                    clearable
                    showPassword
                    v-model={signInForm.password}
                    placeholder="密码"
                    prefixIcon={Lock}
                    onChange={(e: any) =>
                      (signInForm.password = e.target.value)
                    }
                  />
                </el-form-item>
                <el-form-item
                  prop="code"
                  rules={[
                    {
                      required: true,
                      min: 4,
                      max: 6,
                      message: '请输入验证码',
                      trigger: 'blur',
                    },
                  ]}
                >
                  <div class="w-full flex justify-between">
                    <el-input
                      class="w-3/5"
                      clearable
                      v-model={signInForm.code}
                      placeholder="邮箱验证码"
                      prefixIcon={ChatDotRound}
                      onChange={(e: any) => (signInForm.code = e.target.value)}
                    />
                    <el-button
                      class="w-1/4 bg-loginBtnBg text-loginBtnText hover:bg-loginBtnHover hover:text-loginBtnText"
                      disabled={!signInForm.email || countDownIng.value}
                      plain
                      icon={Promotion}
                      size="default"
                      onClick={sendEmail}
                    >
                      {!countDownIng.value ? (
                        <span>发送</span>
                      ) : (
                        <span class="text-xs">{countDownTime.value}s</span>
                      )}
                    </el-button>
                  </div>
                </el-form-item>
                <el-button
                  onClick={() => onSignIn(signInFormRef.value)}
                  class="w-full bg-loginBtnBg text-loginBtnText hover:bg-loginBtnHover hover:text-loginBtnText"
                  size="default"
                  loading={loading.value}
                >
                  注册
                </el-button>
              </el-form>
              <div class="flex justify-end">
                <div>
                  <span class="text-xs">已有账号?</span>
                  <el-link class="text-xs align-baseline" onClick={toSignIn}>
                    去登录
                  </el-link>
                </div>
              </div>
            </div>
          )}
          <el-divider class="my-4" contentPosition="center">
            <span class="text-xs">第三方登录</span>
          </el-divider>
          <el-button
            class="w-full border-none bg-black text-white hover:text-white hover:bg-zinc-950"
            size="default"
            onClick={loginByGithub}
          >
            <svg-icon
              color="white"
              class="mr-2"
              name="github"
              width="1rem"
              height="1rem"
            ></svg-icon>
            GitHub登录
          </el-button>
        </el-dialog>
      </div>
    )
  },
})
