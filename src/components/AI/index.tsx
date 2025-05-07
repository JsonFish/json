import { defineComponent, ref, nextTick, reactive } from 'vue'
import { Promotion } from '@element-plus/icons-vue'
import {
  ElButton,
  ElDialog,
  ElInput,
  ElAvatar,
  ElCard,
  ElSelect,
  ElOption,
} from 'element-plus'
import { MdPreview } from 'md-editor-v3'
import useUserStore from '@/store/modules/user'
import useThemeStore from '@/store/modules/theme.ts'
import { ElMessage } from 'element-plus'
import OpenAI from 'openai'
import './index.scss'
import { apiKey } from '@/setting/deepseek'

export default defineComponent({
  name: 'AIChat',
  setup() {
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    })

    const state = reactive<any>({
      theme: 'dark',
      previewTheme: 'default',
      codeTheme: 'atom',
      id: 'aiChatEditor',
    })
    const themeStore = useThemeStore()
    const isChatOpen = ref<boolean>(false)
    const loading = ref<boolean>(false)
    const newMessage = ref<string>('')
    const modelList = [
      { label: 'DeepSeek-V3', value: 'deepseek-chat' },
      { label: 'DeepSeek-R1', value: 'deepseek-reasoner' },
    ]
    const model = ref<string>('deepseek-chat')
    const messageList = ref<any[]>([
      {
        username: 'DeepSeek',
        avatar:
          'https://picx.zhimg.com/v2-dabcd3ba1cbbf8e188aac13ad1a25106_xll.jpg?source=32738c0c&needBackground=1',
        message: '你好👋！我是 DeepSeek，很高兴见到你！',
      },
    ])
    const messageListRef = ref<HTMLElement | null>(null)
    const userStore = useUserStore()

    const scrollToBottom = () => {
      if (messageListRef.value) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight
      }
    }

    const toggleChat = () => {
      isChatOpen.value = !isChatOpen.value
      if (themeStore.darkTheme) {
        state.theme = 'dark'
      } else {
        state.theme = 'light'
      }
      nextTick(() => {
        scrollToBottom()
      })
    }

    const handleKeyDown = (evt: Event | KeyboardEvent): any => {
      if (
        evt instanceof KeyboardEvent &&
        evt.code === 'Enter' &&
        loading.value !== true &&
        newMessage.value
      ) {
        evt.preventDefault()
        sendMessage()
      }
    }

    const sendMessage = async () => {
      if (!userStore.username || !userStore.avatar) {
        ElMessage({ type: 'info', message: '登录后才能聊天哦！' })
        newMessage.value = ''
        return
      }

      messageList.value.push({
        username: userStore.username,
        avatar: userStore.avatar,
        message: newMessage.value,
      })

      loading.value = true

      messageList.value.push({
        username: 'DeepSeek',
        avatar:
          'https://picx.zhimg.com/v2-dabcd3ba1cbbf8e188aac13ad1a25106_xll.jpg?source=32738c0c&needBackground=1',
        message: '加载中...',
      })
      const content = newMessage.value
      newMessage.value = ''
      try {
        const stream = await openai.chat.completions.create({
          messages: [{ role: 'system', content: content }],
          model: model.value,
          stream: true,
        })
        messageList.value[messageList.value.length - 1].message = ''
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          messageList.value[messageList.value.length - 1].message += content
          nextTick(() => {
            scrollToBottom()
          })
        }
        loading.value = false
      } catch (err) {
        messageList.value[messageList.value.length - 1].message =
          '请求失败，请稍后再试！'
        loading.value = false
      }
    }

    return () => (
      <div>
        <Svg-Icon
          onClick={toggleChat}
          class="fixed bottom-32 right-2 hover: cursor-pointer z-20"
          name="deepseek"
          width="3rem"
          height="3rem"
        />

        <ElDialog
          onClose={() => {
            isChatOpen.value = false
          }}
          modelValue={isChatOpen.value}
          append-to-body
          lock-scroll={false}
          close-on-click-modal={true}
          width="60%"
          class="p-0 rounded-lg"
        >
          {{
            header: () => <p class="pt-2 pl-4">DeepSeek</p>,
            default: () => (
              <div
                class="h-38 p-4 overflow-y-auto bg-chatBg"
                ref={messageListRef}
              >
                {messageList.value.map((message, index) => (
                  <div
                    key={index}
                    class={`flex ${
                      message.username === userStore.username
                        ? 'justify-end'
                        : ''
                    }`}
                  >
                    {message.username !== userStore.username ? (
                      <div class="flex mb-4">
                        <ElAvatar src={message.avatar} class="mr-2"></ElAvatar>
                        <div class="flex flex-col">
                          <span class="text-xs">{message.username}</span>
                          <MdPreview
                            class="max-w-xl rounded-lg mt-1"
                            showCodeRowNumber
                            theme={state.theme}
                            codeTheme={state.codeTheme}
                            previewTheme={state.previewTheme}
                            editorId={state.id}
                            modelValue={message.message}
                          />
                        </div>
                      </div>
                    ) : (
                      <div class="flex mb-4">
                        <div class="flex flex-col">
                          <span class="text-xs max-w-xl text-right">
                            {message.username}
                          </span>
                          <ElCard
                            shadow="never"
                            bodyStyle={{ padding: '8px' }}
                            class="rounded-lg max-w-xs mt-1 bg-sky-500"
                          >
                            <span>{message.message}</span>
                          </ElCard>
                        </div>

                        <ElAvatar src={message.avatar} class="ml-2"></ElAvatar>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ),
            footer: () => (
              <div class="pb-3 px-4 flex justify-between">
                <ElSelect v-model={model.value} style={{ width: '150px' }}>
                  {modelList.map((item: { label: string; value: string }) => (
                    <ElOption
                      key={item.value}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </ElSelect>
                <ElInput
                  style={{ width: '70%' }}
                  v-model={newMessage.value}
                  placeholder="输入消息..."
                  onKeydown={handleKeyDown}
                ></ElInput>
                <ElButton
                  loading={loading.value}
                  icon={Promotion}
                  onClick={sendMessage}
                  type="primary"
                >
                  发送
                </ElButton>
              </div>
            ),
          }}
        </ElDialog>
      </div>
    )
  },
})
