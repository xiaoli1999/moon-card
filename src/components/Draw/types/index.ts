/**
 * @file index.ts type类型、接口等
 * @description 用于画布组件的props及其他参数类型接口
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-09-15 17:46
 */

export interface DesignInfo {
    bg: string,
    layerList: LayerType[]
}

export interface LayerType {
    name: string,
    type: string,
    url: string,
    w: number,
    h: number,
    x: number,
    y: number,
    scale: number,
    angle: number,
    opacity: number,
    text: string,
    fontColor: string,
    fontSize: number
    [propName: string]: any
}

export interface ControlType {
    [propName: string]: any
}
