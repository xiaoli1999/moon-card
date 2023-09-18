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
                    w: 120,
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
                    left: 268,
                    top: 964,
                    angle: 0,
                    opacity: 1,
                    text: '小黎祝大家',
                    fontColor: '#fff',
                    fontWeight: '',
                    fontSize: 42
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
                    text: '月光所至，万事胜意.',
                    fontColor: '#fff',
                    fontWeight: '',
                    fontSize: 42
                }
            ]
        }
    },
    {
        key: 'reunion',
        name: '庆团圆',
        desc: '月下共庆团圆夜',
        designInfo: {
            bg: 'https://cdn.xiaoli.vip/project/moon-card/bg-2.png',
            layerList: [
                {
                    name: 'avatar',
                    type: 'img',
                    url: 'https://cdn.xiaoli.vip/project/moon-card/avatar-2.png',
                    w: 140,
                    left: 510,
                    top: 988,
                    angle: 0,
                    opacity: 1,
                    text: '',
                    fontColor: '#fff',
                    fontSize: 20
                },
                {
                    name: 'text1',
                    type: 'vText',
                    url: 'https://cdn.xiaoli.vip/project/moon-card/AT.ttf',
                    w: 0,
                    left: 460,
                    top: 690,
                    angle: 0,
                    opacity: 1,
                    text: '家人闲坐',
                    fontColor: '#fff',
                    fontWeight: '900',
                    fontSize: 54
                },
                {
                    name: 'text2',
                    type: 'vText',
                    url: 'https://cdn.xiaoli.vip/project/moon-card/AT.ttf',
                    w: 0,
                    left: 530,
                    top: 780,
                    angle: 0,
                    opacity: 1,
                    text: '灯火可亲',
                    fontColor: '#fff',
                    fontWeight: '900',
                    fontSize: 54
                }
            ]
        }
    },
    {
        key: 'miss',
        name: '寄相思',
        desc: '月是故乡明',
        designInfo: {
            bg: 'https://cdn.xiaoli.vip/project/moon-card/bg-3.png',
            layerList: [
                {
                    name: 'avatar',
                    type: 'img',
                    url: 'https://cdn.xiaoli.vip/project/moon-card/avatar-1.png',
                    w: 120,
                    left: 300,
                    top: 820,
                    angle: 0,
                    opacity: 1,
                    text: '',
                    fontColor: '#fff',
                    fontSize: 20
                },
                {
                    name: 'text1',
                    type: 'text',
                    url: 'https://cdn.xiaoli.vip/project/moon-card/AT.ttf',
                    w: 0,
                    left: 200,
                    top: 970,
                    angle: 0,
                    opacity: 1,
                    text: '露从今夜白，',
                    fontColor: '#fff',
                    fontWeight: '900',
                    fontSize: 44
                },
                {
                    name: 'text2',
                    type: 'text',
                    url: 'https://cdn.xiaoli.vip/project/moon-card/AT.ttf',
                    w: 0,
                    left: 380,
                    top: 1022,
                    angle: 0,
                    opacity: 1,
                    text: '月是故乡明~',
                    fontColor: '#fff',
                    fontWeight: '900',
                    fontSize: 44
                }
            ]
        }
    }
]
