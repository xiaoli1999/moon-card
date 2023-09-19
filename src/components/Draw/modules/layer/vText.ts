/**
 * @file vText.js 竖向文本图层
 * @description 绘制文本图层等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-09-18 23:58
 */

import { fabric } from 'fabric'
import { addOrReplaceLayer } from '../common'

/**
 * @function drawTextLayer 绘制文本图层
 * @param { Object } Canvas 画布实例对象
 * @param { Object } layer 图层对象
 * @return { Object } layer 返回文本 图层对象
 */
export const drawVTextLayer = (Canvas: any, layer: any) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve: any) => {
        const { name, left, top, text, url, fontSize, fontColor, fontWeight } = layer

        /* 注册字体 */
        if (url && !globalThis.fontObj[url]) {
            const font = new window.FontFace(url, `url(${url})`)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            document.fonts.add(font)
            const res = await font.load().catch(() => ({}))
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (res && res.status === 'loaded') globalThis.fontObj[url] = url
        }


        const textStyle = {
            width: fontSize,
            left,
            top,
            fontSize,
            fontWeight,
            fontFamily: url,
            fill: fontColor,
            lineHeight: 1,
            cursorColor: fontColor,
            editingBorderColo: '#fff',
            splitByGrapheme: true
        }

        const textSprite = new fabric.Textbox(text, textStyle)
        textSprite.name = name
        // 暂时禁用缩放调整大小
        textSprite.setControlsVisibility({  ml: false, mr: false, mt: false, mb: false })

        addOrReplaceLayer(Canvas, textSprite)

        return resolve(textSprite)
    })
}
