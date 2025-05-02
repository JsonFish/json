import { defineComponent, onMounted } from 'vue'
import MusicPlayer from '@/components/music/index.vue'
import Chat from '@/components/chat'
export default defineComponent({
  setup() {
    onMounted(() => {
      console.log(
        '求star⭐ Github：https://github.com/JsonFish/Json',
      )
    })
    return () => {
      return (
        <div>
          <MusicPlayer />
          <Chat />
          <routerView />
        </div>
      )
    }
  },
})
