/**
 * @file background.ts 绘制画布背景
 * @description 用于画布绘制背景色、背景图等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-09-15 17:46
 */
import { DesignInfo } from '../types/index'
import { fabric } from 'fabric'

/**
 * @function drawBackground 绘制背景
 * @param { Object } Canvas 画布实例
 * @param { Object } designInfo 背景信息 背景图片链接、url等
 */
export const drawBackground = async (Canvas, designInfo: DesignInfo) => {
    return new Promise((resolve: any) => {
        if (!designInfo.bg) return resolve()

        fabric.Image.fromURL(designInfo.bg, (img: any) => {

            img.set({
                left: Canvas.width / 2,
                top: Canvas.height / 2,
                originX: 'center',
                originY: 'center'
            })

            const imgRatio  = img.width / img.height
            const canvasRatio = 0.5

            canvasRatio >= imgRatio ? img.scaleToWidth(Canvas.width, true) : img.scaleToHeight(Canvas.height, true)
            Canvas.setBackgroundImage(img, Canvas.renderAll.bind(Canvas))

            resolve()
        }, { crossOrigin: 'Anonymous' })
    })
}
