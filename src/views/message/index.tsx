import { defineComponent, onMounted, ref } from 'vue'
import VueDanmaku from 'vue3-danmaku'
import { ElMessage } from 'element-plus'
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
    onMounted(() => {
      getMessageList()
    })
    const getMessageList = () => {
      getMessage().then((response) => {
        danmus.value = response.data.messageList
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
      <div class="relative">
        <VueDanmaku
          class="h-screen"
          ref={danmakuRef}
          v-model:danmus={danmus.value}
          useSlot
          loop
          autoplay={true}
          randomChannel
          channels={27}
        >
          {{
            dm: ({ danmu }: any) => (
              <div>
                <p class="text-menuActive text-base">{' ' + danmu.text}</p>
              </div>
            ),
          }}
        </VueDanmaku>
        <div class="absolute top-1/3 left-1/2 -translate-x-1/2">
          <el-input
            class="w-72"
            v-model={text.value}
            placeholder="说点什么吧"
            size="small"
            clearable
          >
            {{
              append: () => (
                <el-button icon="Promotion" onClick={() => add()}>
                  发送
                </el-button>
              ),
            }}
          </el-input>
        </div>
      </div>
    )
  },
})
