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
    const loading = ref<boolean>(false)
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
      if (text.value.length < 1) {
        ElMessage({ type: 'info', message: '请输入留言内容' })
        return
      }
      loading.value = true
      await addMessage({ text: text.value }).then((response) => {
        if (response.code == 200) {
          ElMessage({ type: 'info', message: '留言成功' })
          danmakuRef.value.add({ text: text.value, avatar: userStore.avatar })
          text.value = ''
        } else {
          ElMessage({ type: 'error', message: response.message })
        }
        loading.value = false
      })
    }
    return () => (
      <div class="relative">
        <VueDanmaku
          class="h-30"
          ref={danmakuRef}
          v-model:danmus={danmus.value}
          useSlot
          loop
          autoplay={true}
          randomChannel
          channels={10}
        >
          {{
            dm: ({ danmu }: any) => (
              <div>
                <p class="text-menuActive text-base">{' ' + danmu.text}</p>
              </div>
            ),
          }}
        </VueDanmaku>
        <div>
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
                    <el-button
                      loading={loading.value}
                      icon={Promotion}
                      onClick={() => add()}
                    >
                      发送
                    </el-button>
                  ),
                }}
              </el-input>
            </div>
          </div>
          <div class="mx-auto my-0 w-65">
            {danmus.value?.map((item: MessageInfo) => (
              <div class="py-3 w-full max-w-2xl mx-auto border-b border-dashed border-gray-600">
                <div class="flex items-start">
                  <img
                    class="w-14 h-14 rounded-full"
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
                            <span class="bg-gray-600	opacity-40 px-1 rounded-sm text-10 mr-4 text-white">
                              {item.browserName +
                                ' ' +
                                item.browserVersion.slice(0, 5)}
                            </span>
                          )}
                          {item.osName && (
                            <span class="bg-gray-600 opacity-40 px-1  rounded-sm text-10 text-white">
                              {item.osName + ' ' + item.osVersion}
                            </span>
                          )}
                        </div>
                        <div class="flex items-center space-x-2 text-xs"></div>
                      </div>
                    </div>
                    <div class="my-1 text-sm">{item.text}</div>
                    <div class="text-10">
                      {item.ipAddress && item.ipAddress != '-' && (
                        <span class="bg-gray-600 opacity-40 px-1 py-0.5 rounded-sm  mr-4 text-white">
                          {item.ipAddress}
                        </span>
                      )}
                      <span>{item.createTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
})
