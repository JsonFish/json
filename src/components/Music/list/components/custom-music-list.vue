<script setup>
import { defineComponent, h, watch, inject } from 'vue'

import { PLAYTYPE } from '../../musicTool'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const musicGetters = inject('musicGetters')
const musicSetters = inject('musicSetters')

const { getCustomerMusicList } = musicGetters

defineComponent({
  name: 'CustomMusicList',
})

const playMusic = (item) => {
  // 设置当前播放音乐
  musicSetters.setMusicInfo(item.id)
  // 设置播放音乐的详细描述
  musicSetters.setPlayType(PLAYTYPE.CUSTOM)
}

const customerDeleteMusic = (item) => {
  musicSetters.setCustomerMusicList('delete', item)
  musicSetters.setPlayType(PLAYTYPE.CUSTOM)

  ElMessage({
    type: 'info',
    message: '删除成功',
  })
}

const returnAuthor = (item) => {
  // eslint-disable-next-line no-prototype-builtins
  if (item.hasOwnProperty('ar')) {
    return item.ar[0].name
    // eslint-disable-next-line no-prototype-builtins
  } else if (item.hasOwnProperty('artists')) {
    return item.artists[0].name
  } else {
    return ''
  }
}

const returnOther = (item) => {
  // eslint-disable-next-line no-prototype-builtins
  if (item.hasOwnProperty('alia')) {
    return item.alia[0]
    // eslint-disable-next-line no-prototype-builtins
  } else if (item.hasOwnProperty('alias')) {
    return item.alias[0]
  } else {
    return ''
  }
}

watch(
  () => getCustomerMusicList.value.length,
  () => {
    if (!getCustomerMusicList.value.length) {
      musicSetters.setPlayType('TOP')
    }
  },
)
</script>

<template>
  <div class="music-list">
    <div class="flex justify-between items-start">
      <div class="!py-[30px] music-list__detail">
        <el-row>
          <el-col :span="24" class="header">
            <div class="title title1">歌曲</div>
            <div class="title title2">作者</div>
            <div class="title title3">其他</div>
            <div class="title title4">操作</div>
          </el-col>
        </el-row>
        <el-row class="body">
          <div style="width: 100%" v-if="getCustomerMusicList.length">
            <el-col
              class="flex justify-start items-center overflow-auto"
              :span="24"
              v-for="item in getCustomerMusicList"
              :key="item.id"
            >
              <div class="name" @click="playMusic(item)">
                <span class="text-overflow" :title="item.name">{{
                  item.name
                }}</span>
              </div>
              <div class="author">
                <span class="text-overflow" :title="returnAuthor(item)">{{
                  returnAuthor(item)
                }}</span>
              </div>
              <div class="other">
                <span class="text-overflow" :title="returnOther(item)">{{
                  returnOther(item)
                }}</span>
              </div>
              <div class="delete-music">
                <el-icon @click="customerDeleteMusic(item)"><Delete /></el-icon>
              </div>
            </el-col>
          </div>
          <div v-else class="empty">空空如也</div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.music-list {
  box-sizing: border-box;
  border-radius: 8px;
  padding: 5px;

  &__detail {
    position: relative;
    overflow: auto;
    width: 100%;
    .header {
      width: 100%;
      display: flex;
      .title {
        font-weight: 600;
        font-size: 1.1rem;
        &1 {
          width: 30%;
        }
        &2 {
          width: 30%;
        }
        &3 {
          width: 25%;
        }
        &4 {
          text-align: center;
          width: 15%;
        }
      }
    }

    .body {
      max-height: 300px;
      overflow: auto;
    }
  }

  .name {
    width: 30%;
    cursor: pointer;

    &:hover {
      color: var(--music-main-active);
    }
  }

  .author {
    width: 30%;
  }

  .other {
    width: 25%;
  }

  .delete-music {
    width: 15%;
    text-align: center;
    &:hover {
      transform: scale(1.1);
    }
  }

  .text-overflow {
    font-size: 1rem;
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .empty {
    width: 80%;
    height: 25px;
    font-size: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
}
</style>
