<template>
    <div class="draw" :style="{ transform: `translate(-50%, -50%) scale(${ scale })` }">
        <canvas :id="CanvasId" />
    </div>
</template>
<script setup lang="ts">
import { ref, PropType, onMounted, watch } from 'vue'
import { fabric } from 'fabric'
import { canvasSize } from './config/canvas'
import { control, hiddenControl } from './config/control'
import { DesignInfo, LayerType } from './types'
import { initCanvas } from './modules/init'
import { drawBackground } from './modules/background'
import { drawLayer } from './modules/layer'
import { createUuid } from './modules/common'

const props = defineProps({
    designInfo: {
        type: Object as PropType<DesignInfo>,
        require: true,
        default: () => ({ bg: '', layerList: [] })
    },
    scale: {
        type: Number,
        default: () => 0.54
    }
})

/**
 * @const { String } inkId 画布的唯一id
 */
const CanvasId = ref<string>('li-' + createUuid())

/**
 * @let { Object } Canvas 画布实例
 */
let Canvas: any
/**
 * @const { Boolean } Loading 加载动画
 */
const Loading = ref<boolean>(false)

/* 字父通信 */
const emit = defineEmits(['drawComplete', 'updateLayer'])

/* 初始化控件 */
const initFabricControl = () => {
    fabric.Object.prototype.set(control)
    // 设置缩放摇杆偏移
    fabric.Object.prototype.controls.mtr.offsetY = control.mtrOffsetY
    // 隐藏不需要的控件
    hiddenControl.map((name: string) => (fabric.Object.prototype.controls[name].visible = false))
}

const init = async () => {
    if (Canvas) Canvas.clear()

    /* 初始化画布 */
    Canvas = initCanvas(CanvasId.value, canvasSize)

    /* 绘制背景 */
    await drawBackground(Canvas, props.designInfo)

    /* 绘制全部图层 */
    await drawAll(Canvas, props.designInfo.layerList)

}

/* 鼠标抬起 */
const canvasMouseUp = (e: any) => {
    const { target, transform } = e
    console.log(target, transform)
    // if (!target || !transform) return
    // const type: string = transform.action
    // const location: any = target.getCenterPoint()
    // const layerIndex = LayerList.findIndex(i => i.uuid === Uuid.value)
    // if (layerIndex === -1) return (Uuid.value = '')
    //
    // if (type === 'drag') {
    //     const { x, y } = location
    //     LayerList[layerIndex].x = x
    //     LayerList[layerIndex].y = y
    // } else if (type === 'scale') {
    //     if (target.flipX || target.flipY) {
    //         target.flipX = false
    //         target.flipY = false
    //     }
    //     LayerList[layerIndex].scale = (target.scaleX || target.scaleY)
    // } else if (type === 'rotate') {
    //     LayerList[layerIndex].angle = target.angle
    // } else { /* empty */ }
}

/* 元素缩放时 */
const canvasMouseScaling = (e: any) => {
    if (e.target.flipX || e.target.flipY) {
        e.target.flipX = false
        e.target.flipY = false
    }
}

onMounted(async () => {
    Loading.value = true
    /* 初始化控件 */
    initFabricControl()

    await init()

    /* 绑定交互事件 */
    /* 鼠标抬起事件 */
    Canvas.on('mouse:up', canvasMouseUp)
    /* 元素缩放事件 */
    Canvas.on('object:scaling', canvasMouseScaling)
})

/**
 * @function drawAll 绘制所有图层
 * @param { Object } canvas 画布实例
 * @param { Array } layerList 图层数组
 */
const drawAll = async (canvas: any, layerList: LayerType[]) => {
    for (const item of layerList) {
        await drawLayer(canvas, item)
    }
}

/* 绘制完成emit */
const drawComplete = () => emit('drawComplete')
/**
 * @function save 保存作品图及效果图
 * @return { String } result base64 保存/预览时返回
 */
const save = ():string => {
    console.log(Canvas)
    return Canvas.toDataURL({
        format: 'png',
        left: 0,
        top: 0,
        width: Canvas.width,
        height: Canvas.height
    })
}

/* 设计数据改变时触发重绘 */
watch(() => props.designInfo, async () => (await init()))

// 暴露给父组件可使用的方法
defineExpose({ drawAll, save })
</script>

<style lang="less" scoped>
.draw {
    position: absolute;
    top: 50% !important;
    left: 50% !important;
    //z-index: 10;
}
</style>
