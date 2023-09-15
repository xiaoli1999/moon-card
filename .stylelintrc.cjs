module.exports = {
	extends: [
		'stylelint-config-standard',
		'stylelint-config-recommended-less',
		'stylelint-config-standard-vue'
	],
	plugins: ['stylelint-order'],
	// 不同格式的文件指定自定义语法
	overrides: [
		{
			files: ['**/*.(less|css|vue|html)'],
			customSyntax: 'postcss-less'
		},
		{
			files: ['**/*.(html|vue)'],
			customSyntax: 'postcss-html'
		}
	],
	ignoreFiles: [
		'**/*.js',
		'**/*.jsx',
		'**/*.tsx',
		'**/*.ts',
		'**/*.json',
		'**/*.md',
		'**/*.yaml'
	],
	rules: {
		'indentation': 4,
		'no-descending-specificity': null, // 禁止 不允许较低特异性的选择器出现在覆盖较高特异性的选择器之后 （详情 https://stylelint.io/user-guide/rules/list/no-descending-specificity）"
		'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['v-deep'] }],
		'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['deep'] }],
		'selector-class-pattern': null, /* 选择器类模式 https://stylelint.io/user-guide/rules/selector-class-pattern/ */
		// 指定样式的排序
		'order/properties-order': [
			'position',
			'top',
			'right',
			'bottom',
			'left',
			'z-index',
			'display',
			'justify-content',
			'align-items',
			'float',
			'clear',
			'overflow',
			'overflow-x',
			'overflow-y',
			'padding',
			'padding-top',
			'padding-right',
			'padding-bottom',
			'padding-left',
			'margin',
			'margin-top',
			'margin-right',
			'margin-bottom',
			'margin-left',
			'width',
			'min-width',
			'max-width',
			'height',
			'min-height',
			'max-height',
			'font-size',
			'font-family',
			'text-align',
			'text-justify',
			'text-indent',
			'text-overflow',
			'text-decoration',
			'white-space',
			'color',
			'background',
			'background-position',
			'background-repeat',
			'background-size',
			'background-color',
			'background-clip',
			'border',
			'border-style',
			'border-width',
			'border-color',
			'border-top-style',
			'border-top-width',
			'border-top-color',
			'border-right-style',
			'border-right-width',
			'border-right-color',
			'border-bottom-style',
			'border-bottom-width',
			'border-bottom-color',
			'border-left-style',
			'border-left-width',
			'border-left-color',
			'border-radius',
			'opacity',
			'filter',
			'list-style',
			'outline',
			'visibility',
			'box-shadow',
			'text-shadow',
			'resize',
			'transition'
		]
	}
}
