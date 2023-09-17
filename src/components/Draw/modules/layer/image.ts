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
        /* 绘制圆形图片 */
        if (!url) return resolve()
        const imgLayer: any = await drawImg(url)

        imgLayer.set({
            left,
            top,
            angle,
            clipPath: new fabric.Circle({
                radius: Math.min(imgLayer.height, imgLayer.width) / 2
            })
        })

        imgLayer.width > imgLayer.height ? imgLayer.scaleToHeight(w, true) : imgLayer.scaleToWidth(w, true)
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
            const url = uploadImg(e) as string
            uploadImgDom.value =  ''

            const imgLayerShort = Math.min(imgLayer.getScaledWidth(), imgLayer.getScaledHeight())
            console.log('5616165', imgLayer.getScaledWidth())

            /* 更新图片源 */
            imgLayer.setSrc(url,  (newImgLayer) => {
                // 图片加载后的回调函数
                const ratio = imgLayerShort / (newImgLayer.width > newImgLayer.height ? newImgLayer.height : newImgLayer.width)
                newImgLayer.set({
                    left: imgLayer.left,
                    top: imgLayer.top,
                    angle: imgLayer.angle,
                    scaleX: ratio,
                    scaleY: ratio,
                    clipPath: new fabric.Circle({
                        radius: Math.min(newImgLayer.width, newImgLayer.height)  / 2
                    })
                })

                // 刷新 Canvas 以显示更新后的图片元素
                Canvas.renderAll()
            })

        })

        return resolve(imgLayer)
    })
}

const uploadImg = (e) => {
    if (!e.target.files || !e.target.files.length) return ElMessage.warning('上传失败！')

    const file = e.target.files[0]
    if (!file.type.includes('image')) return ElMessage.warning('请上传正确的图片格式！')

    return getCreatedUrl(file) ?? ''
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
