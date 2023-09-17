/**
 * @file cardList.ts 贺卡预制模版
 * @description 贺卡预制模版数据
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-09-16 22:48
 */

// 月光如水，思念如丝
export const cardList = [
    {
        key: 'wish',
        name: '送祝福',
        desc: '千里共赏明月夜',
        designInfo: {
            bg: 'https://cdn.xiaoli.vip/project/moon-card/bg-1.png',
            layerList: [
                {
                    name: 'avatar',
                    type: 'img',
                    url: 'https://cdn.xiaoli.vip/project/moon-card/avatar-1.png',
                    w: 100,
                    left: 94,
                    top: 990,
                    angle: 0,
                    opacity: 1,
                    text: '',
                    fontColor: '#fff',
                    fontSize: 20
                },
                {
                    name: 'text1',
                    type: 'text',
                    url: 'https://cdn.xiaoli.vip/project/moon-card/kt.ttf',
                    w: 0,
                    left: 260,
                    top: 970,
                    angle: 0,
                    opacity: 1,
                    text: '采黎祝大家',
                    fontColor: '#fff',
                    fontSize: 40
                },
                {
                    name: 'text2',
                    type: 'text',
                    url: 'https://cdn.xiaoli.vip/project/moon-card/kt.ttf',
                    w: 0,
                    left: 360,
                    top: 1022,
                    angle: 0,
                    opacity: 1,
                    text: '花好月圆，幸福安康！',
                    fontColor: '#fff',
                    fontSize: 40
                }
            ]
        }
    },
    {
        key: 'reunion',
        name: '庆团圆',
        desc: '月下共庆团圆夜',
        designInfo: {
            bg: '',
            layerList: []
        }
    },
    {
        key: 'miss',
        name: '寄相思',
        desc: '月是故乡明',
        designInfo: {
            bg: '',
            layerList: []
        }
    }
]
