import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { View } from '@element-plus/icons-vue'
import { getArticleList } from '@/api/article/index.ts'
import { ArticleInfo } from '@/api/article/type'

export default defineComponent({
  name: 'articleList',
  setup() {
    const router = useRouter()
    const articleList = ref<any>([])
    const page = ref<number>(1)
    const pageSize = ref<number>(100)
    const total = ref<number>(0)
    const views = ref<number>(0)
    onMounted(async () => {
      await getArticle()
    })
    const getArticle = async () => {
      await getArticleList(page.value, pageSize.value).then((response) => {
        articleList.value = response.data.articleList
        total.value = response.data.total
        views.value = articleList.value.reduce((sum:number, item:ArticleInfo) => sum + (item.views || 0), 0)
      })
    }
    const toArticle = (id: number) => {
      router.push({ path: '/article', query: { id } })
    }
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const year = date.getFullYear()
      return `${month}/${day}/${year}`
    }

    return () => {
      return (
        <div class="w-70 mx-auto">
          <div class='w-full h-20 ml-8'>
            <p class="text-3xl">Articles</p>
            <p class="text-xs">{total.value} articles | {views.value} views</p>
          </div>
          {articleList.value.map((item: ArticleInfo, index: number) => {
            return (
              <div
                key={item.id}
                class={[
                  'an' + (index + 1),
                  'w-33',
                  'flex',
                  'px-4',
                  'mx-4',
                  'mb-16',
                  'float-left',
                  'hover:bg-articleCard',
                  'rounded',
                  'overflow-hidden',
                  'opacity-0',
                  'translate-x-1/4',
                ]}
              >
                <div class="w-full py-2">
                  <div onClick={() => toArticle(item.id)}>
                    <span class="text-xl font-bold line-clamp-1 hover:cursor-pointer">
                      {item.title}
                    </span>
                  </div>
                  <div class="mt-2 h-12" onClick={() => toArticle(item.id)}>
                    <el-text class="line-clamp-2 hover:cursor-pointer">
                      {item.description}
                    </el-text>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex hover:cursor-pointer">
                      <div class="flex items-center mr-2">
                        <el-icon size="14" class="mr-1">
                          <View />
                        </el-icon>
                        <span class="text-xs">{item.views}</span>
                      </div>
                      <div class="flex items-center">
                        {item.tags?.map((item: any) => {
                          return (
                            <div
                              class="flex items-center"
                              style="line-height: 12px"
                            >
                              <Svg-Icon
                                class="mr-1"
                                name={item.tagName}
                                width="14px"
                                height="14px"
                              ></Svg-Icon>
                              <span class="text-xs mr-1" key={item}>
                                {item.tagName}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div>
                      <span class="text-xs">{formatDate(item.createTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )
    }
  },
})
