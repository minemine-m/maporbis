import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		dts({
			outDir: ["./dist"],
			rollupTypes: true,
		}),
		// 建议开启 visualizer 来观察哪些文件占用了体积
		// visualizer({
		// 	open: true,
		// 	filename: 'stats.html',
		// 	gzipSize: true,
		// }),
	],
esbuild: {
	// 删除所有 debugger 语句，阻止调试时断点
	drop: ['debugger'],
	// 移除所有注释，包括版权声明等，减小文件体积
	legalComments: 'none',
	// 混淆变量名（a,b,c等短名称），提高代码安全性
	minifyIdentifiers: true,
	// 编译目标为 ES2020 标准
	target: 'es2020',
	// 最小化语法：简化表达式、删除冗余代码
	minifySyntax: true,
	// 删除空白字符（空格、换行、缩进），大幅压缩体积
	minifyWhitespace: true,
},
	build: {
		target: "es2020",
		outDir: "./dist",
		// 1. 切换压缩器为 terser
		minify: "esbuild",
		sourcemap: false,
		lib: {
			entry: "./src/index.ts",
			name: "maporbis",
			fileName: "index",
			// 建议保留 formats 配置，通常库需要 es 和 umd
			formats: ['es', 'umd']
		},
		rollupOptions: {
			external: ["three"],
			output: {
				globals: {
					three: "THREE",
				},
			},
		},
	},
});