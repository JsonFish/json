<script setup>
import { defineComponent } from 'vue'

import ProgressLine from './components/progress-line.vue'
import Information from './components/information.vue'
import AudioControls from './components/audio-controls.vue'

defineComponent({
  name: 'MusicControls',
})
</script>

<template>
  <div class="music-controls">
    <div class="controls-main">
      <div class="music-header">
        <ProgressLine />
      </div>
      <div class="music-body">
        <div class="music-body__left">
          <Information />
        </div>
        <div class="music-body__right">
          <!-- 控制音乐 -->
          <AudioControls />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.music-controls {
  width: 100%;
  box-sizing: border-box;
  background: transparent;
  display: flex;
  justify-content: center;
  background-color: var(--music-main-bg);
  .controls-main {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .music-header {
    width: 100%;
  }
  .music-body {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 3rem 5px 3rem;
    &__left {
      width: 33%;
    }

    &__right {
      width: 67%;
    }
  }
}

.change-color:hover {
  cursor: pointer;
  color: var(--music-main-active);
}

// mobile
@media screen and (max-width: 768px) {
  .main {
    width: 414px !important;
  }

  .music-body {
    padding: 8px 1rem 0px 1rem !important;
    &__left {
      width: 30% !important;
    }

    &__right {
      width: 70% !important;
    }
  }
}
</style>
