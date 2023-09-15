/**
 * @file text.js 文本图层
 * @description 绘制文本图层等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-09-15 17:46
 */

import { fabric } from 'fabric'
import { addOrReplaceLayer } from '../common'
// import { borderControl } from '@views/printTemplate/components/Draw/config/control';

/**
 * @function drawTextLayer 绘制文本图层
 * @param { Object } Canvas 画布实例对象
 * @param { Object } layer 图层对象
 * @return { Object } layer 返回文本 图层对象
 */
export const drawTextLayer = (Canvas: any, layer: any) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve: any) => {
        const { uuid, design: { w, x, y, scaleX, scaleY }, text, textAlign, fontFamily, fontSize, fontColor, fontWeight, fontStyle, underline } = layer

        const charSpacing = 100
        const textInfo = new fabric.IText(text, { fontSize, fontFamily, fontWeight, fontStyle, charSpacing })

        const width = w || Math.ceil(textInfo.width as number)

        const textStyle = {
            width,
            left: x,
            top: y,
            fontSize,
            fontFamily,
            fill: fontColor,
            fontStyle,
            fontWeight,
            textAlign,
            scaleX,
            scaleY,
            underline,
            lineHeight: 1,
            charSpacing,
            // splitByGrapheme: true,
            editable: false
        }
        const textSprite = new fabric.Textbox(text, textStyle)
        textSprite.name = uuid
        // 暂时禁用缩放调整大小
        textSprite.setControlsVisibility({ tl: false, tr: false, bl: false, br: false, ml: false, mt: false, mb: false })

        const borderSprite = new fabric.Rect({
            left: x,
            top: y,
            width: textSprite.width,
            height: textSprite.height,
            fill: 'transparent',
            stroke: '#00BFFF',
            strokeWidth: 1,
            selectable: false,
            evented: false
        });

        borderSprite.name = 'borderSprite' + uuid
        textSprite.on('mouseup', (e: any) => {
            const { target } = e || {}
            borderSprite.set({
                left: target.left,
                top: target.top,
                width: target.width,
                height: target.height
            })
            Canvas.renderAll()
        })

        addOrReplaceLayer(Canvas, borderSprite)
        addOrReplaceLayer(Canvas, textSprite)

        return resolve(textSprite)
    })
}
