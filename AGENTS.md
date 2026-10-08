# capybara-2048

🌿 Capybara 2048 🌿 A fun, animated 2048 game featuring cute animal emojis that progress as you merge tiles! Features - **Smooth Animations**: Tiles slide and merge with beautiful CSS transitions - **Capybara Theme**: Each tile value has a unique animal emoji

## 用途与 Target 判定

Capybara 2048 动画版 2048 游戏，可爱动物主题

- 移动端：需要
- 智能硬件：可选（可搁置）

## 目标平台

| 平台 | 方式 | 产出 |
|------|------|------|
| 🤖 Android | Capacitor → Gradle | APK |
| 🍎 iOS | Capacitor（若已加 ios/） | IPA |
| 智能硬件 | 可选（非当前里程碑硬门槛） | 戒指/手杖/手表 |

## 技术栈信号

- 检测到：android, capacitor, node

## 命令

```bash
npm install
npm run build
npm run sync:android
npm run apk:debug
npx --yes serve .
```

## 同步说明

改 Web 源码后执行 `cp index.html game.js styles.css www/`，再 `npx cap sync android`。打 APK 建议使用 **JDK 17**（已配置在 package.json 中）。

## 状态

已归档。默认只做必要修复与知识库同步，不新开大范围需求。

## 助手约束

- Loop：先定可验证 Done 与停止条件；每切片过验证环；失败回灌；详见 docs/LOOP_ENGINEERING.md
- Harness：遵循根 AGENTS「Harness Engineering」；Guide=本文件，Sensor=测试/CI；同类失误二次须沉淀规则或测试（棘轮）。详见 docs/HARNESS_ENGINEERING.md
- 遵循仓库根 `/Users/skat/AGENTS.md` 与本文件的用途判定
- 可选 Target 可搁置；不适用形态不要硬加
- 改动聚焦；公共逻辑抽离复用

## 验证环 / Done

```bash
npm install
npm test          # 若有
cp index.html game.js styles.css www/
npx cap sync android
# 可选：npm run apk:debug
```

**Done 示例**：测试通过（若有）+ web 产物进 `www/` + `cap sync` 无报错。可选穿戴未做可搁置，不纳入强制 Done。
