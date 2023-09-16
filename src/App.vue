<template>
    <div class="bg">
        <img class="wicker" src="./assets/img/wicker.png" alt="">
        <img class="moon" src="./assets/img/moon.png" alt="">
        <img class="rabbit1" :class="cardIndex !== 2 ? '' : 'hidden'" src="./assets/img/rabbit1.png" alt="">
        <img class="rabbit2" src="./assets/img/rabbit2.png" alt="">
    </div>

    <header>
        <div class="header-content">
            <div>
                <img src="https://cdn.xiaoli.vip/project/logo.jpg" alt="">
                采黎 • 中秋贺卡
            </div>
        </div>
    </header>

    <main>
        <div class="card">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" @click="changeCardTheme(false)">
                <path d="M783.36 1003.52c30.72-30.72 30.72-76.8 0-107.52L404.48 512l378.88-378.88c30.72-30.72 30.72-76.8 0-107.52-30.72-30.72-76.8-30.72-107.52 0L240.64 455.68c-30.72 30.72-30.72 76.8 0 107.52l435.2 435.2c30.72 30.72 76.8 30.72 107.52 5.12z"></path>
            </svg>
            <div class="card-content">
                <DrawLi ref="Draw" class="draw" :designInfo="cardInfo.designInfo" />
                <img class="lamp1" src="./assets/img/lamp.png" alt="">
                <img class="lamp2" src="./assets/img/lamp.png" alt="">
            </div>
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" @click="changeCardTheme(true)">
                <path d="M240.64 20.48c-30.72 30.72-30.72 81.92 0 112.64l378.88 378.88-378.88 378.88c-30.72 30.72-30.72 76.8 0 107.52s76.8 30.72 107.52 0l435.2-435.2c30.72-30.72 30.72-76.8 0-107.52L348.16 20.48c-30.72-25.6-76.8-25.6-107.52 0z"></path>
            </svg>
            <transition name="title" mode="out-in">
                <div class="title" :key="cardInfo.key">
                    <div>{{ cardInfo.name }}</div>
                    <div>{{ cardInfo.desc }}</div>
                </div>
            </transition>
        </div>
        <div class="panel">
            <el-button type="success" @click="createCard(true)">生成贺卡</el-button>
            <el-button type="primary" @click="createCard(false)">分享给朋友</el-button>
        </div>

        <div class="stats">
            <p>访问人数:<span id="busuanzi_value_site_uv"></span></p>
            <p>访问总量:<span id="busuanzi_value_site_pv"></span></p>
            <a class="github" href="https://github.com/xiaoli1999/moon-card" target="_blank">
                <img src="./assets/img/github.png" alt="github">
                <span>github</span>
            </a>
        </div>
        <div class="state">部分素材来源于网络，非商业用途，如有侵权请联系删除。</div>
        <footer>© 2023 All rights reserved. Powered by 黎</footer>
    </main>
</template>

<script lang="ts" setup>
import {ref, onMounted, nextTick} from 'vue'
import { judgePC, getCreatedUrl, downloadImg, base64ToFile, getAuthorization, getUploadAuthorization } from '@/tools/common'
import progress from './tools/progress'
import { ElMessage } from 'element-plus'
import { cardList } from './tools/cardList'
import axios from 'axios'
import DrawLi from './components/Draw/index.vue'

/* 初始化进度条 */
progress.start()

/* 基础数据 */
const isPc = ref<boolean>(judgePC())
const userInfo = {
    url: 'https://v0.api.upyun.com',
    bucket: (import.meta as any).env.VITE_UPYUN_BUCKET,
    name: (import.meta as any).env.VITE_UPYUN_NAME,
    password: (import.meta as any).env.VITE_UPYUN_PASSWORD,
    path: 'img/moon-card'
}
let fileName = ''

const cardIndex = ref(0)
const cardInfo: any = ref(cardList[cardIndex.value])
const loading = ref<boolean>(false)
const Draw = ref()

const changeCardTheme = (isAdd = true) => {
    if (isAdd) {
        (cardIndex.value === cardList.length - 1) ? cardIndex.value = 0 : cardIndex.value++
    } else {
        (cardIndex.value === 0) ? cardIndex.value = cardList.length - 1 : cardIndex.value--
    }
    cardInfo.value = cardList[cardIndex.value]
}

const uploadFile = async (e: any) => {
    if (!e.target.files || !e.target.files.length) return ElMessage.warning('上传失败！')

    const file = e.target.files[0]
    if (!file.type.includes('image')) return ElMessage.warning('请上传正确的图片格式！')

    const url = getCreatedUrl(file) ?? ''
    console.log(url);

    (document.getElementById('uploadImg') as HTMLInputElement).value = ''
}

const avatarList = ref([])
const getAvatarList = async () => {
    const url = `${ userInfo.url }/${ atob(userInfo.bucket) }/${ userInfo.path }`
    const { date, authorization } = getAuthorization(userInfo)
    const headers = { authorization, 'x-date': date, Accept: 'application/json' }
    const { data: { files } } = await axios({ method: 'GET', url, headers }).catch(() => ({})) as any

    avatarList.value = files || []

    /* 动态计算当前贺卡总数 */
    let num = 1
    if (files && files.length) {
        const name = files[0].name.split('.png')[0]
        const arr = name.split('-')
        num = Number(arr[arr.length - 1] || 0)  + 1
    }

    fileName = `li-${ 1e14 - Date.now() }-${ num }.png`
}

onMounted(async () => {
    progress.close()
    await getAvatarList()
})

const cardUrl = ref('')
const shareUrl = ref('')
const saveShow = ref(false)
const shareShow = ref<boolean>(false)

const createCard = async (isSave) => {
    cardUrl.value = Draw.value.save()

    console.log(cardUrl.value)

    if  (isSave) {
        saveShow.value = true
    } else {
        await nextTick(() => {
            /* todo 处理生成海报 */

            shareUrl.value = ''
            shareShow.value = true
        })
    }

    /* todo 上传贺卡 */
    const uploadData = new FormData()

    const file = base64ToFile(cardUrl.value, fileName, 'png')
    uploadData.append('file', file)

    const { policy, authorization } = getUploadAuthorization(userInfo) as any
    uploadData.append('policy', policy)
    uploadData.append('authorization', authorization)

    axios({ method: 'POST', url: `${ userInfo.url }/${ atob(userInfo.bucket) }`, data: uploadData }).catch(() => ({}))
}

const save = async (isSave = true) => {
    try {
        /* todo 手动保存 */
        const name = `黎-中秋贺卡${isSave ? '' : '分享'}-${cardInfo.value.name}-${Date.now()}`

        downloadImg(cardUrl.value, name)
    } catch (e) {
        /* 捕获错误 */
    }
}
</script>

<style lang="less" scoped>
header {
    position: sticky;
    width: 100%;
    left: 0;
    right: 0;
    top: 0;
    margin: 0 auto;
    background: #dfddc630;
    backdrop-filter: bulr(4px) saturate(50%);
    z-index: 1000;

    .header-content {
        max-width: 1200px;
        height: 48px;
        padding: 0 12px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;

        > div {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #fff;
            letter-spacing: 1px;

            > img {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                margin-right: 8px;
            }
        }
    }
}

main {
    position: relative;
    max-width: 1200px;
    min-height: 100vh;
    margin: 0 auto;

    .card {
        position: relative;
        width: 100%;
        height: calc(100vh - 124px);
        margin: 0 auto;
        padding-bottom: 12px;
        display: flex;
        justify-content: center;
        align-items: center;

        .card-content {
            position: relative;
            width: 270px;
            height: 540px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 2px 2px 8px 1px #0000001f;

            .draw {

            }

            > .lamp1 {
                position: absolute;
                width: 120px;
                left: calc(50% - 200px);
                top: 20%;
                animation: lamp1-path 8s linear infinite;
                z-index: -1;
            }

            > .lamp2 {
                position: absolute;
                width: 200px;
                left: calc(50% + 10px);
                top: 80%;
                transform: rotate(-40deg);
                animation: lamp2-path 6s infinite;
                transform-origin: top center;
                z-index: -1;
            }
        }

        > svg {
            width: 36px;
            height: 36px;
            fill: #dfddc6aa;
            cursor: pointer;
            transition: all .24s;
            margin: 0 24px;

            &:hover {
                fill: #f4f4f4;
                transform: scale(1.1);
            }
        }

        .title {
            position: absolute;
            font-family: love, sans-serif;
            right: 7%;
            top: 40%;
            display: flex;

            > div {
                width: 30px;
                font-size: 30px;
                line-height: 36px;
                padding-top: 60px;
            }

            > div:first-child {
                margin-right: 28px;
                color: #e0a24c;
                padding: 0;
                font-size: 32px;
                line-height: 42px;
            }
        }
    }

    .panel {
        display: flex;
        justify-content: center;
    }

    .stats {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 8px auto;

        > p,
        > a {
            padding: 6px 8px;
            margin: 0 6px 0 0;
            font-size: 12px;
            border-radius: 2px;
            background: #dfddc680;
            display: flex;
            align-items: center;

            > span {
                padding-left: 4px;
            }

            > img {
                width: 14px;
                height: 14px;
                margin-right: 4px;
            }
        }
    }

    footer,
    .state {
        line-height: 20px;
        font-size: 12px;
        text-align: center;
    }
}

.bg {
    width: 100%;
    max-width: 1200px;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: -1;

    > .wicker {
        position: absolute;
        top: 10%;
        left: -60px;
    }

    > .moon {
        position: absolute;
        width: 320px;
        right: -60px;
        top: -70px;
    }

    > .rabbit1,
    > .rabbit2 {
        position: absolute;
        width: 60px;
        bottom: 12px;
        left: 12px;
        transition: all .24s;

        &.hidden {
            opacity: 0;
        }
    }

    > .rabbit1 {
        left: 70px;
    }
}

@keyframes lamp1-path {
    50% {
        transform: translate(-40px, -8px) rotate(20deg);
    }
}

@keyframes lamp2-path {
    50% {
        transform: rotate(-20deg);
    }
}

.title-enter-active,
.title-leave-active {
    will-change: transform;
    transition: all .48s linear;
}

.title-enter-from {
    opacity: 0;
    transform: translateX(-24px);
}

.title-leave-to {
    opacity: 0;
    transform: translateX(24px);
}

@media only screen and (max-width: 768px) {

}
</style>
