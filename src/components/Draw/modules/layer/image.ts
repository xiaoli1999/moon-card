/**
 * @file image.ts 图片图层
 * @description 绘制图片、模板照片图层等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-09-15 17:46
 */
import { fabric } from 'fabric'
import { addOrReplaceLayer } from '../common'
import { LayerType } from '../../types'

/**
 * @function drawImgLayer 绘制图片图层
 * @param { Object } Canvas 画布实例对象
 * @param { Object } layer 图层对象
 * @return { Object } layer 返回图片 图层对象
 */
export const drawImgLayer = (Canvas: any, layer: LayerType) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve: any) => {
        /* 绘制图片 */
        const { uuid, url, x, y, scale, angle, opacity } = layer
        if (!url) return resolve()

        const imgLayer: any = await drawImg(url)
        imgLayer.set({
            originX: 'center',
            originY: 'center',
            left: (x === 0 && y === 0 ) ? Canvas.width / 2 : x,
            top:  (x === 0 && y === 0 ) ? Canvas.height / 2 : y,
            scaleX: scale || Canvas.width / imgLayer.width,
            scaleY: scale || Canvas.width / imgLayer.height,
            angle
        })

        imgLayer.opacity = opacity

        addOrReplaceLayer(Canvas, imgLayer)
        imgLayer.name = uuid

        return resolve(imgLayer)
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
