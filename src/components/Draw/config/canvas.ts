/**
 * @file canvas.ts 画布基础配置
 * @description 画布大小配置等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-09-15 17:46
 */

export interface CanvasSizeType {
    width: number,
    height: number
}

/**
 * @desc 操纵控件
 * @param { Object } canvasSize 画布尺寸 { width, height }
 */
export const canvasSize: CanvasSizeType = {
    width: 600,
    height: 1080
}
