import { defineComponent, onMounted,ref } from 'vue'
import MusicPlayer from '@/components/music/index.vue'
import Chat from '@/components/chat'
import AI from '@/components/AI'
import OpenAI from 'openai'

export default defineComponent({
  setup() {
    const message = ref<string>('')
    onMounted(() => {
      console.log('求star⭐ Github：https://github.com/JsonFish/Json')

      const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: 'sk-963f3a0eceb44a0cae1b2968aea5f40d',
        dangerouslyAllowBrowser: true,
      })

      async function main() {
        const stream = await openai.chat.completions.create({
          messages: [
            { role: 'system', content: '你好,你和chatgpt哪个更厉害' },
          ],
          model: 'deepseek-chat',
          stream: true
        })
        console.log(stream)
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            message.value += content
          }
      }



      // main()
    })
    return () => {
      return (
        <div>
          <p>          {message.value.split('').map((char, index) => (
              <span 
                key={index} 
                class="char" 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {char}
              </span>
            ))}</p>
          <AI/>
          <MusicPlayer />
          <Chat />
          <routerView />
        </div>
      )
    }
  },
})
