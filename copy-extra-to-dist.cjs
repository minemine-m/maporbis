const fs = require("fs-extra");
const path = require("path");

async function copyExtraToDist() {
    const currentDir = __dirname;
    const distPath = path.join(currentDir, "dist");

    // 确保 dist 存在
    if (!(await fs.pathExists(distPath))) {
        console.warn(`警告: dist 目录不存在: ${distPath}，请先执行构建`);
        return;
    }

    // 1. 拷贝 assets -> dist/assets
    const srcAssets = path.join(currentDir, "assets");
    const destAssets = path.join(distPath, "assets");

    if (await fs.pathExists(srcAssets)) {
        console.log(`拷贝 assets: ${path.relative(currentDir, srcAssets)} → dist/assets`);
        await fs.copy(srcAssets, destAssets);
    } else {
        console.warn(`警告: 未找到 assets 目录: ${srcAssets}`);
    }

    // 2. 拷贝 README 文件 -> dist/
    const readmeFiles = ["README.md", "README_CN.md"];
    for (const file of readmeFiles) {
        const src = path.join(currentDir, file);
        const dest = path.join(distPath, file);
        if (await fs.pathExists(src)) {
            console.log(`拷贝 README: ${file} → dist/${file}`);
            await fs.copy(src, dest);
        } else {
            console.warn(`警告: 未找到 ${file}，跳过`);
        }
    }

    console.log("core extra 文件拷贝完成（assets + README）");
}

copyExtraToDist().catch((err) => {
    console.error("拷贝额外文件到 dist 失败:", err);
    process.exit(1);
});