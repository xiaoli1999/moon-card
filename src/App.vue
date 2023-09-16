<template>
    <div class="bg">
        <img class="moon" src="./assets/img/moon.png" alt="">
        <img class="rabbit1" src="./assets/img/rabbit1.png" alt="">
        <img class="rabbit2" src="./assets/img/rabbit2.png" alt="">
        <img class="lamp1" src="./assets/img/lamp.png" alt="">
        <img class="lamp2" src="./assets/img/lamp.png" alt="">
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
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13223" width="64" height="64">
                <path d="M783.36 1003.52c30.72-30.72 30.72-76.8 0-107.52L404.48 512l378.88-378.88c30.72-30.72 30.72-76.8 0-107.52-30.72-30.72-76.8-30.72-107.52 0L240.64 455.68c-30.72 30.72-30.72 76.8 0 107.52l435.2 435.2c30.72 30.72 76.8 30.72 107.52 5.12z"></path>
            </svg>
            <div class="card-content"></div>
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13223" width="64" height="64">
                <path d="M240.64 20.48c-30.72 30.72-30.72 81.92 0 112.64l378.88 378.88-378.88 378.88c-30.72 30.72-30.72 76.8 0 107.52s76.8 30.72 107.52 0l435.2-435.2c30.72-30.72 30.72-76.8 0-107.52L348.16 20.48c-30.72-25.6-76.8-25.6-107.52 0z"></path>
            </svg>
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
import { ref, onMounted } from 'vue'
import { judgePC, getCreatedUrl, getImgInfo, downloadImg, base64ToFile, getAuthorization, getUploadAuthorization } from '@/tools/common'
import progress from './tools/progress'
import { ElMessage } from 'element-plus'
import axios from 'axios'

/* 初始化进度条 */
progress.start()

/* 基础数据 */
const isPc = ref<boolean>(judgePC())
const userInfo = {
    url: 'https://v0.api.upyun.com',
    bucket: (import.meta as any).env.VITE_UPYUN_BUCKET,
    name: (import.meta as any).env.VITE_UPYUN_NAME,
    password: (import.meta as any).env.VITE_UPYUN_PASSWORD,
    path: 'img/custom-avatar'
}
const fileName = `li-${ 1e14 - Date.now() }.png`

/* 业务 */
const styleIndex = ref(0)
const frameIndex = ref<number | null>(null)
const showRound = ref<boolean>(true)
const avatarInfo = ref<any>({})

const loading = ref<boolean>(false)

const rabbitLi = ref()
const uploadFile = async (e: any) => {
    if (!e.target.files || !e.target.files.length) return ElMessage.warning('上传失败！')

    const file = e.target.files[0]
    if (!file.type.includes('image')) return ElMessage.warning('请上传正确的图片格式！')

    const url = getCreatedUrl(file) ?? ''
    const imgInfo: any = await getImgInfo(url)
    const name = file.name.split('.').splice(0, file.name.split('.').length - 1).join('.')
    avatarInfo.value = { url, w: imgInfo.width, h: imgInfo.height, name };

    (document.getElementById('uploadImg') as HTMLInputElement).value = ''
}

interface LayerType {
    uuid: string,
    type: string,
    url: string,
    w: number,
    h: number,
    x: number,
    y: number,
    scale: number,
    angle: number,
    opacity: number
    [propName: string]: any
}
const layerList = ref<LayerType[]>([
    {
        uuid: 'effect',
        type: 'img',
        url: '',
        w: 0,
        h: 0,
        x: 0,
        y: 0,
        scale: 0,
        angle: 0,
        opacity: 1
    }
])

const selectFrame = (index: number) => {
    if (!avatarInfo.value.url) return ElMessage.warning('请先上传原头像！')
    frameIndex.value = index

    loading.value = true
    // layerList.value[0].url = picList[styleIndex.value].frameList[index]
}

const previewShow = ref<boolean>(false)
const previewUrl = ref<string>('')
const save = async (isSave) => {
    if (!avatarInfo.value.url || !layerList.value[0].url) return ElMessage.warning('请上传原头像并选择效果图！')

    previewShow.value = false
    const url = await rabbitLi.value.save()
    if (isSave) return downloadImg(url, avatarInfo.value.name)

    previewShow.value= true
    previewUrl.value= url

    const uploadData = new FormData()

    const file = base64ToFile(url, fileName, 'png')
    uploadData.append('file', file)

    const { policy, authorization } = getUploadAuthorization(userInfo) as any
    uploadData.append('policy', policy)
    uploadData.append('authorization', authorization)

    console.log(url)

    axios({ method: 'POST', url: `${ userInfo.url }/${ atob(userInfo.bucket) }`, data: uploadData }).catch(() => ({}))
}

const avatarList = ref([])
const getAvatarList = async () => {
    const url = `${ userInfo.url }/${ atob(userInfo.bucket) }/${ userInfo.path }`
    const { date, authorization } = getAuthorization(userInfo)
    const headers = { authorization, 'x-date': date, Accept: 'application/json' }
    const { files } = await axios({ method: 'GET', url, headers }).catch(() => ({})) as any

    avatarList.value = files || []
}

onMounted(async () => {
    progress.close()
    await getAvatarList()
})
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
    max-width: 1200px;

    .card {
        width: 100%;
        margin: 24px auto;
        display: flex;
        justify-content: center;
        align-items: center;

        .card-content {
            position: relative;
            width: 280px;
            height: 500px;
            border-radius: 4px;
            box-shadow: 2px 2px 8px 1px #f4f4f480;
        }

        > svg {
            width: 36px;
            height: 36px;
            fill: #dfddc6aa;
            cursor: pointer;
            transition: all .24s;
            margin: 0 16px;

            &:hover {
                fill: #f4f4f4;
                transform: scale(1.1);
            }
        }
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

    .moon {
        position: absolute;
        width: 440px;
        right: -88px;
        top: -108px;
    }

    .rabbit1,
    .rabbit2 {
        position: absolute;
        width: 60px;
        bottom: 20px;
        left: 20px;
    }

    .rabbit1 {
        left: 74px;
    }

    .lamp1 {
        position: absolute;
        width: 140px;
        left: calc(50% - 220px);
        top: 20%;
        animation: lamp1-path 8s linear infinite;
    }

    .lamp2 {
        position: absolute;
        width: 240px;
        left: calc(50% + 10px);
        bottom: -60px;
        transform: rotate(-30deg);
        animation: lamp2-path 4s linear infinite;
        transform-origin: top center;
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

    .animated-element {
        animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
    }
}

@media only screen and (max-width: 768px) {

}
</style>
