import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { View } from '@element-plus/icons-vue'
import { MdPreview, MdCatalog } from 'md-editor-v3'
import useThemeStore from '@/store/modules/theme.ts'
import { getArticleInfo } from '@/api/article'
import type { ArticleInfo } from '@/api/article/type'
import './index.scss'
export default defineComponent({
  name: 'Article',
  setup() {
    const themeStore = useThemeStore()
    const route = useRoute()
    // 编辑器配置信息
    const state = reactive<any>({
      theme: 'dark',
      previewTheme: 'default',
      codeTheme: 'atom',
      id: 'editor',
    })
    const articleInfo = ref<ArticleInfo>()
    onMounted(() => {
      if (themeStore.darkTheme) {
        state.theme = 'dark'
      } else {
        state.theme = 'light'
      }
      getArticleInfo(route.query.id as unknown as number).then((response) => {
        articleInfo.value = response.data
      })
    })
    // 监听主题变换
    watch(
      () => themeStore.darkTheme,
      (newValue) => {
        if (newValue) {
          state.theme = 'dark'
        } else {
          state.theme = 'light'
        }
      },
    )
    const scrollElement = document.documentElement
    return () => (
      <div>
        <div class="mt-20">
          <p class="text-center text-2xl">{articleInfo.value?.title}</p>
          <div class="flex justify-center">
            <div class="flex items-center mr-4">
              <el-icon size="14" class="mr-1">
                <View />
              </el-icon>
              <el-text>{articleInfo.value?.views}</el-text>
            </div>
            <el-text class="mr-4">{articleInfo.value?.categoryName || '前端'}</el-text>
            {articleInfo.value?.tags?.map((tag, index) => (
              <el-text class="mr-1" key={index}>
                {'# ' + tag.tagName}
              </el-text>
            ))}
          </div>
        </div>
        <div class="my-0 mx-auto w-65 min-h-screen flex">
          <MdPreview
            style={{fontSize:'12px'}}
            class="bg-transparent w-50"
            showCodeRowNumber
            theme={state.theme}
            codeTheme={state.codeTheme}
            previewTheme={state.previewTheme}
            editorId={state.id}
            modelValue={articleInfo.value?.content}
          />
          <el-affix offset={70}>
            <el-text size="large">目录</el-text>
            <MdCatalog
              class="w-5 text-sm"
              editorId={state.id}
              scrollElement={scrollElement}
              offsetTop={400}
              scrollElementOffsetTop={100}
            />
          </el-affix>
        </div>
      </div>
    )
  },
})
