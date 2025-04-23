import { defineComponent, ref, onMounted, reactive } from 'vue'
import { getLink, applyLink } from '@/api/link'
import type { LinkInfo } from '@/api/link/type'
import { uploadFile } from '@/utils/upload'
import useUserStore from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { type UploadUserFile, type FormInstance } from 'element-plus'
import Upload from '@/components/upload/index'
import './index.scss'
export default defineComponent({
  name: 'friendLink',
  setup() {
    const userStore = useUserStore()
    const linkList = ref<LinkInfo[]>([])
    const visible = ref<boolean>(false)
    const linkFormRef = ref<FormInstance>()
    const fileList = ref<UploadUserFile[]>([])
    const linkForm = reactive<LinkInfo>({
      avatar: '',
      name: '',
      description: '',
      link: '',
    })
    onMounted(() => {
      getLinkList()
    })
    const getLinkList = () => {
      getLink().then((response) => {
        linkList.value = response.data.linkList
      })
    }
    // 跳转
    const toLink = (url: string) => {
      window.open(url, '_blank')
    }
    // 获取文件
    const getFileList = (file: UploadUserFile[]) => {
      fileList.value = file
    }
    // 打开弹窗
    const apply = () => {
      if (!userStore.username || !userStore.avatar) {
        ElMessage({ type: 'info', message: '请先登录哦！' })
        return
      }
      visible.value = true
    }
    // 验证网站地址
    const validateUrl = (_rule: any, value: string, callback: any) => {
      if (!value) {
        return callback(new Error('请输入网站地址'))
      }
      const reg = /^http(s)?:\/\//
      if (!reg.test(value)) {
        callback(new Error('请输入以http或https开头的网站地址'))
      } else {
        callback()
      }
    }
    // 提交友链申请
    const submitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return
      // 是否选择了头像
      if (fileList.value.length) {
        linkForm.avatar = fileList.value
      }
      formEl.validate(async (valid) => {
        if (valid) {
          // 上传头像
          await uploadFile(fileList.value).then((res: any) => {
            linkForm.avatar = res.url
          })
          applyLink(linkForm).then((res) => {
            if (res.code == 200) {
              ElMessage({ type: 'info', message: '申请成功！' })
            } else {
              ElMessage({ type: 'info', message: res.message })
            }
            closeDialog()
          })
        }
      })
    }
    // 关闭弹窗
    const closeDialog = () => {
      visible.value = false
      linkFormRef.value?.resetFields()
      fileList.value = []
    }
    return () => (
      <div>
        <div class="flex justify-center items-center text-4xl mb-2">
          <p>友链</p>
        </div>
        <div>
          <div class="text-center my-5">
            <el-button onClick={apply} plain>
              申请友链
            </el-button>
          </div>
          <div class="mx-auto my-0 w-65">
            <el-row>
              {linkList.value.map((item: LinkInfo, index: number) => (
                <el-col key={item.id} span={6}>
                  <div
                    class={[
                      'an' + (index + 1),
                      'flex',
                      'justify-between',
                      'border',
                      'border-solid',
                      'border-slate-500',
                      'h-20',
                      'rounded-lg',
                      'm-2',
                      'opacity-0',
                      'translate-x-1/4',
                      'hover:cursor-pointer',
                      'hover:bg-articleCard',
                    ]}
                    onClick={() => toLink(item.link)}
                  >
                    <div class="w-20 h-full flex justify-center items-center">
                      <el-avatar
                        shape="square"
                        class="duration-500 hover:scale-110"
                        src={item.avatar}
                        fit="cover"
                        size="large"
                      />
                    </div>
                    <div class="w-40">
                      <span class="mt-3 text-base font-bold line-clamp-1">
                        {item.name}
                      </span>
                      <span class="text-xs line-clamp-2">{item.description}</span>
                    </div>
                  </div>
                </el-col>
              ))}
            </el-row>
          </div>
        </div>
        <el-dialog
          onClose={closeDialog}
          lock-scroll={false}
          class="rounded-md px-10 py-5"
          align-center
          width="400"
          v-model={visible.value}
        >
          <div class="text-center text-xl mb-3 -mt-4">友链申请</div>
          <el-form model={linkForm} ref={linkFormRef} label-width="80">
            <el-form-item
              label="网站头像"
              prop="avatar"
              rules={[
                {
                  required: true,
                  trigger: 'change',
                  message: '请输入头像url',
                },
              ]}
            >
              {/* <Upload
                onGetFileList={getFileList}
                fileSize={3}
                file-list={fileList.value}
              /> */}
              <el-input
                placeholder="请输入头像url"
                v-model={linkForm.name}
              />
            </el-form-item>
            <el-form-item
              label="网站名称"
              prop="name"
              rules={[
                {
                  required: true,
                  trigger: 'change',
                  message: '请输入网站名称',
                },
              ]}
            >
              <el-input
                placeholder="请输入网站名称"
                v-model={linkForm.name}
              />
            </el-form-item>
            <el-form-item
              label="网站描述"
              prop="description"
              rules={[
                {
                  required: true,
                  trigger: 'change',
                  message: '请输入网站描述',
                },
              ]}
            >
              <el-input
                placeholder="描述一下你的网站"
                v-model={linkForm.description}
              />
            </el-form-item>
            <el-form-item
              label="网站地址"
              prop="link"
              rules={[
                {
                  required: true,
                  trigger: 'change',
                  validator: validateUrl,
                },
              ]}
            >
              <el-input
                placeholder="必须以'http'或'https'开头"
                v-model={linkForm.link}
              />
            </el-form-item>
            <el-button
              class="w-full bg-loginBtnBg text-loginBtnText hover:bg-loginBtnHover hover:text-loginBtnText"
              size="default"
              onClick={() => submitForm(linkFormRef.value)}
            >
              申请
            </el-button>
          </el-form>
        </el-dialog>
      </div>
    )
  },
})
