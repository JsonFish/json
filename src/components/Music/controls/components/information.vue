<!--
 * @Author: Zhang Yuming
 * @Date: 2023-07-03 11:48:12
 * @Description: 展示歌信息
 -->

<script setup>
import { defineComponent, inject } from 'vue'

const musicGetters = inject('musicGetters')
const musicSetters = inject('musicSetters')

defineComponent({
  name: 'Information',
})

const { getShowLyricBoard, getMusicDescription, getIsToggleImg, getIsPaused } =
  musicGetters
</script>

<template>
  <!-- 唱片展示 -->
  <div class="music-info">
    <img
      :class="[
        'music-img',
        getIsToggleImg ? '' : 'disc-rotate',
        getIsPaused ? 'paused' : 'running',
      ]"
      @click="musicSetters.setShowLyricBoard(!getShowLyricBoard)"
      :src="getMusicDescription.al.picUrl"
    />
    <div class="music-desc">
      <div class="music-name">
        {{ getMusicDescription.name }}
      </div>
      <div class="author-name">
        {{ getMusicDescription.ar[0].name }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.music-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  .music-img {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    object-fit: cover;
  }
  .music-desc {
    margin-left: 0.5rem;

    .author-name {
      font-size: 0.8rem;
      margin-top: 5px;
      overflow: hidden;
      text-wrap: nowrap;
      word-break: keep-all;
      text-overflow: ellipsis;
    }

    .music-name {
      font-size: 0.7rem;
      overflow: hidden;
      text-wrap: nowrap;
      word-break: keep-all;
      text-overflow: ellipsis;
    }
  }
}

.disc-rotate {
  animation: rotate360 18s infinite linear;
}

.running {
  animation-play-state: running;
}
.paused {
  animation-play-state: paused;
}

@keyframes rotate360 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

// mobile
@media screen and (max-width: 768px) {
  .music-img {
    // display: none;
    width: 50px !important;
    height: 50px !important;
    border-radius: 25px !important;
  }

  .music-desc {
    max-width: 4.5rem;
  }
}
</style>
