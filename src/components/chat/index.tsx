import { defineComponent, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Promotion } from '@element-plus/icons-vue'
import { ElButton, ElDialog, ElInput, ElAvatar, ElCard } from 'element-plus'
import { io } from 'socket.io-client'
import useUserStore from '@/store/modules/user'
import { ElMessage } from 'element-plus'

interface Message {
  id?: number
  username: string
  message: string
  avatar: string
  createTime: string
}

export default defineComponent({
  name: 'Chat',
  setup() {
    const isChatOpen = ref<boolean>(false)
    const newMessage = ref<string>('')
    const messageList = ref<Message[]>([])
    const messageListRef = ref<HTMLElement | null>(null)
    const onlineNumber = ref<number>(0)
    const userStore = useUserStore()
    let socket: any = null
    // 创建 WebSocket 连接
    const connectSocket = () => {
      socket = io(import.meta.env.VITE_URL)

      socket.on('connect', () => {
        console.log(
          `%c WebSocket  %c 连接成功～`,
          'color: #42d392;background: #434345;padding: 3px 0 3px 3px;',
          'color: #42d392; margin-top: 5px; margin-left: -7px;',
        )
      })

      socket.on('disconnect', () => {
        console.log('WebSocket断开连接')
      })

      socket.on('sendOnline', (data: { onlineNumber: number }) => {
        onlineNumber.value = data.onlineNumber
      })

      // 接收消息
      socket.on('receiveMessage', (data: Message) => {
        messageList.value.push(data)
        nextTick(() => {
          scrollToBottom()
        })
      })

      // 获取历史消息
      socket.emit('getHistory')
      socket.on('chatHistory', (historyData: Message[]) => {
        messageList.value = historyData
        nextTick(() => {
          scrollToBottom()
        })
      })
    }
    const scrollToBottom = () => {
      if (messageListRef.value) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight
      }
    }

    onMounted(() => {
      connectSocket()
    })

    onBeforeUnmount(() => {
      if (socket) {
        socket.disconnect()
      }
    })
    const toggleChat = () => {
      isChatOpen.value = !isChatOpen.value
      nextTick(() => {
        scrollToBottom()
      })
    }

    const sendMessage = () => {
      if (!userStore.username || !userStore.avatar) {
        ElMessage({ type: 'info', message: '登录后才能聊天哦！' })
        newMessage.value = ''
        return
      }
      if (newMessage.value && newMessage.value.length < 255) {
        socket.emit('sendMessage', {
          username: userStore.username,
          message: newMessage.value,
          avatar: userStore.avatar,
        })
        newMessage.value = ''
        ElMessage({ type: 'success', message: '发送成功' })
      }
    }

    // 处理键盘事件
    const handleKeyDown = (evt: Event | KeyboardEvent): any => {
      if (evt instanceof KeyboardEvent && evt.code === 'Enter') {
        evt.preventDefault() // 防止换行
        sendMessage()
      }
    }

    return () => (
      <div>
        <Svg-Icon
          onClick={toggleChat}
          class="fixed bottom-10 right-2 hover: cursor-pointer z-20"
          name="chat"
          width="2.5rem"
          height="2.5rem"
        />

        <ElDialog
          onClose={() => {
            isChatOpen.value = false
          }}
          modelValue={isChatOpen.value}
          append-to-body
          lock-scroll={false}
          close-on-click-modal={true}
          width="40%"
          class="p-0 rounded-lg"
        >
          {{
            header: () => (
              <p class="pt-2 pl-4">
                聊天室
                <span class=" ml-2 text-xs text-gray-500	">
                  当前在线 {onlineNumber.value} 人
                </span>
              </p>
            ),
            default: () => (
              <div
                class="h-96 p-4 overflow-y-auto bg-chatBg"
                ref={messageListRef}
              >
                {messageList.value.map((message, index) => (
                  <div>
                    <p
                      class="text-center"
                      v-show={
                        index !== 0
                          ? new Date(message.createTime).getTime() -
                              new Date(
                                messageList.value[index - 1].createTime,
                              ).getTime() >
                            60000
                          : true
                      }
                    >
                      <span class="text-xs">{message.createTime}</span>
                    </p>
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
                          <ElAvatar
                            src={message.avatar}
                            class="mr-2"
                          ></ElAvatar>
                          <div class="flex flex-col">
                            <span class="text-xs">{message.username}</span>
                            <ElCard
                              shadow="never"
                              bodyStyle={{ padding: '8px' }}
                              class="rounded-lg max-w-xs mt-1"
                            >
                              <span>{message.message}</span>
                            </ElCard>
                          </div>
                        </div>
                      ) : (
                        <div class="flex mb-4">
                          <div class="flex flex-col">
                            <span class="text-xs text-right">
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

                          <ElAvatar
                            src={message.avatar}
                            class="ml-2"
                          ></ElAvatar>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ),
            footer: () => (
              <div class="pb-3 px-4 flex justify-between">
                <ElInput
                  style={{ width: '80%' }}
                  v-model={newMessage.value}
                  placeholder="输入消息..."
                  onKeydown={handleKeyDown}
                ></ElInput>
                <ElButton icon={Promotion} onClick={sendMessage} type="primary">
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
