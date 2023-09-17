/**
 * @file image.ts 图片图层
 * @description 绘制图片、模板照片图层等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-09-15 17:46
 */
import {fabric} from 'fabric'
import {addOrReplaceLayer} from '../common'
import {LayerType} from '../../types'
import {ElMessage} from 'element-plus'
import {getCreatedUrl} from '@/tools/common'

/**
 * @function drawImgLayer 绘制图片图层
 * @param { Object } Canvas 画布实例对象
 * @param { Object } layer 图层对象
 * @return { Object } layer 返回图片 图层对象
 */
export const drawImgLayer = (Canvas: any, layer: LayerType) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve: any) => {

        const { name, url, left, top, w, angle  } = layer

        const imgLayer: any = await drawImg(url)
        imgLayer.set({ left, top, angle })
        imgLayer.scaleToWidth(w, true)
        imgLayer.name = name
        addOrReplaceLayer(Canvas, imgLayer)

        /* 绘制自定义上传控件 */
        const uploadLayer: any = await drawImg(new URL('../../icons/upload-img.png', import.meta.url).href)
        uploadLayer.scaleToHeight(30, true)

        const uploadImgDom = document.getElementById('uploadImg') as HTMLInputElement

        const customControl = new fabric.Control({
            x: 0.5,
            y: -0.5,
            offsetY: 0, // 垂直偏移以使图标居中
            cursorStyle: 'pointer', // 鼠标悬停样式
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mouseUpHandler:  () => uploadImgDom.click(),
            render: function (ctx, left, top) {
                // 渲染控件图标
                uploadLayer.set({ left, top: top })
                uploadLayer.render(ctx)
            }
        })

        imgLayer.setControlsVisibility({ tr: false })

        // 将自定义控制控件添加到元素1
        imgLayer.setControlVisible('mtr', true) // 显示元素1的默认控制控件
        imgLayer.controls.customControl = customControl // 添加自定义控制控件

        /* 图片上传逻辑 */
        uploadImgDom.addEventListener('change',  async (e) => {
            const url = await uploadImg(e) as string
            uploadImgDom.value =  ''

            const imgLayerWidth = imgLayer.getScaledWidth()

            /* 更新图片源 */
            imgLayer.setSrc(url, (newImgLayer) => {
                // 图片加载后的回调函数
                const ratio = imgLayerWidth / newImgLayer.width
                newImgLayer.set({
                    left: imgLayer.left,
                    top: imgLayer.top,
                    angle: imgLayer.angle,
                    scaleX: ratio,
                    scaleY: ratio
                })

                // 刷新 Canvas 以显示更新后的图片元素
                Canvas.renderAll()
            })

        })

        return resolve(imgLayer)
    })
}

const uploadImg = async (e) => {
    return new Promise((resolve, reject) => {
        if (!e.target.files || !e.target.files.length) return ElMessage.warning('上传失败！')

        const file = e.target.files[0]
        if (!file.type.includes('image')) return ElMessage.warning('请上传正确的图片格式！')

        const canvas: any = document.getElementById('circleCanvas')
        const ctx = canvas.getContext('2d')
        const imgUrl = getCreatedUrl(file) ?? ''

        const image = new Image()
        image.src = imgUrl

        image.onload = () => {
            const diameter = Math.min(image.width, image.height) // 获取最短边作为直径
            canvas.width = diameter
            canvas.height = diameter

            const centerX = diameter / 2
            const centerY = diameter / 2

            // 创建一个圆形路径
            ctx.beginPath()
            ctx.arc(centerX, centerY, diameter / 2, 0, Math.PI * 2, false)
            ctx.closePath()
            ctx.clip()

            // 计算图片的偏移，使其居中
            const offsetX = (image.width - diameter) / 2
            const offsetY = (image.height - diameter) / 2

            // 将图片绘制到圆形区域内，不变形
            ctx.drawImage(image, offsetX, offsetY, diameter, diameter, 0, 0, diameter, diameter)

            return resolve(canvas.toDataURL('image/png'))
        }

        image.onerror = () => reject('')
    })
}


/**
 * @function getImgInfo 获取图片信息
 * @param { String } url 图片链接
 * @return { Object } img 返回图片对象信息
 */
export const getImgInfo = (url: string) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve: any) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.src = url
    })
}

/**
 * @function drawImg 绘制图片
 * @param { String } url 图片链接
 * @return { Object } img 返回图片画布对象
 */
export const drawImg = (url: string) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve: any) => {
        fabric.Image.fromURL(url, (img) => resolve(img), { crossOrigin: 'Anonymous' })
    })
}
