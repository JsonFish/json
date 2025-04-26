import { defineComponent, onMounted, ref } from 'vue'
import VueDanmaku from 'vue3-danmaku'
import { ElMessage } from 'element-plus'
import { Promotion } from '@element-plus/icons-vue'
import { getMessage, addMessage } from '@/api/message/index'
import type { MessageInfo } from '@/api/message/type'
import useUserStore from '@/store/modules/user'
export default defineComponent({
  name: 'message',
  setup() {
    const userStore = useUserStore()
    const danmus = ref<MessageInfo[]>()
    const danmakuRef = ref<any>()
    const text = ref<string>('')
    const total = ref<number>(0)
    onMounted(() => {
      getMessageList()
    })
    const getMessageList = () => {
      getMessage().then((response) => {
        danmus.value = response.data.messageList
        total.value = response.data.total
      })
    }
    const add = async () => {
      if (!userStore.username) {
        ElMessage({ type: 'info', message: '登陆后才能留言哦!' })
        text.value = ''
        return
      }
      await addMessage({ text: text.value }).then((response) => {
        if (response.code == 200) {
          ElMessage({ type: 'info', message: '留言成功' })
          danmakuRef.value.add({ text: text.value, avatar: userStore.avatar })
          text.value = ''
        } else {
          ElMessage({ type: 'error', message: response.message })
        }
      })
    }
    return () => (
      <div>
        <VueDanmaku
          class="h-30 "
          ref={danmakuRef}
          v-model:danmus={danmus.value}
          useSlot
          loop
          autoplay={true}
          randomChannel
          channels={11}
        >
          {{
            dm: ({ danmu }: any) => (
              <div>
                <p class="text-menuActive text-base">{' ' + danmu.text}</p>
              </div>
            ),
          }}
        </VueDanmaku>
        <div class="w-45 mx-auto flex">
          <div>
            <p class="text-3xl">Message</p>
            <p class="text-xs">
              {total.value} message | {1023} views
            </p>
          </div>
          <div class="my-auto ml-32">
            <el-input
              class="w-72"
              v-model={text.value}
              placeholder="说点什么吧"
              size="small"
              clearable
            >
              {{
                append: () => (
                  <el-button icon={Promotion} onClick={() => add()}>
                    发送
                  </el-button>
                ),
              }}
            </el-input>
          </div>
        </div>
        <div class="my-4"></div>
        <div class="mx-auto my-0 w-65">
          {danmus.value?.map((item: MessageInfo) => (
            <div class="py-3 w-full max-w-2xl mx-auto border-b border-dashed border-gray-500">
              <div class="flex items-start">
                <img
                  class="w-12 h-12 rounded-full"
                  src={item.avatar}
                  alt="User Avatar"
                />
                <div class="ml-4 flex-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="flex items-center">
                        <span class="font-bold text-base mr-4">
                          {item.username}
                        </span>
                        {item.browserName && (
                          <span class="bg-gray-300 px-1 py-0.5 rounded text-10 mr-4 text-black">
                            {item.browserName +
                              ' ' +
                              item.browserVersion.slice(0, 5)}
                          </span>
                        )}
                        {item.osName && (
                          <span class="bg-gray-300 px-1 py-0.5 rounded text-10 text-black">
                            {item.osName + ' ' + item.osVersion}
                          </span>
                        )}
                      </div>
                      <div class="flex items-center space-x-2 text-xs"></div>
                    </div>
                  </div>
                  <div class="mb-2 text-sm">{item.text}</div>
                  <div class="text-10">
                    {item.ipAddress && item.ipAddress != '-' && (
                      <span class="bg-gray-300 px-1 py-0.5 rounded text-10 mr-4 text-black">
                        {item.ipAddress}
                      </span>
                    )}
                    <span class="text-xs">{item.createTime}</span>
                  </div>
                </div>
              </div>
              {/* <div class="flex items-center justify-end mt-4 space-x-4 text-gray-400">
                <button class="flex items-center space-x-1 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>0</span>
                </button>
                <button class="flex items-center space-x-1 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21 6h-2V4c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0H9V4h6v2z" />
                  </svg>
                </button>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    )
  },
})
