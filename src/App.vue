<template>
    <div class="bg"></div>
    <header>中秋贺卡</header>

    <div class="stats">
        <p>本站访问人数:<span id="busuanzi_value_site_uv"></span></p>
        <p>本站访问总量:<span id="busuanzi_value_site_pv"></span></p>
        <a class="github" href="https://github.com/xiaoli1999/custom-rabbitImage" target="_blank">
            <img src="./assets/img/github.png" alt="github">
            <span>github</span>
        </a>
    </div>
    <div class="state">部分素材来源于网络，非商业用途，如有侵权请联系删除。</div>
    <footer>© 2023 All rights reserved. Powered by 黎</footer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { judgePC, getCreatedUrl, getImgInfo, downloadImg, base64ToFile, getAuthorization, getUploadAuthorization } from '@/tools/common'
import progress from './tools/progress'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { picList } from '@/tools/picList'

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
    layerList.value[0].url = picList[styleIndex.value].frameList[index]
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

</style>
