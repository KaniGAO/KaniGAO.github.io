# 3D 大头模型：Meshy 生成 → 导出 → 替换指南

本站点首页的「签名元素」是一个跟随鼠标、可拖拽旋转的 3D 大头。
当前为程序化占位模型，本文说明如何用 **Meshy** 生成一个真实 `.glb` 模型，
并**一行配置**替换进去（无需改任何其他代码）。

> 安全约束：Meshy API Key **绝不**写入前端代码、仓库或浏览器。
> 仅在本地生成 + 手动导出 `.glb` 到 `/public/models/`，或经自建后端代理调用。

---

## 1. 生成（Meshy）

1. 登录 https://www.meshy.ai ，进入 **Text to 3D**（或 Image to 3D）。
2. 提示词建议（按站点调性：量化/AI、冷静、有设计感，避免卡通玩趣）：

   ```
   A stylized low-poly bust of a young East-Asian man, head and shoulders only,
   clean matte skin material, minimal neutral expression, soft studio lighting,
   smooth topology, centered, game-ready, semi-realistic 3D avatar,
   neutral color palette with subtle blue tint, professional product render.
   ```

3. 参数建议：
   - **Topology**：Quad（布线上限更干净）
   - **Polygon count**：≤ 20k（Web 实时渲染流畅）
   - **Style**：Realistic / Stylized 之间取偏 Stylized，避免过于写实导致 Uncanny
   - 如需眨眼/说话等，勾选 **Auto-rig** + **Animation**（导出 GLB 会带 `animations`，
     代码已自动播放第一个 clip）

## 2. 导出

- 选 **GLB** 格式（含贴图与动画，单文件最省事）。
- 分辨率选中等即可（贴图 1k–2k）。
- 下载后重命名为 `head.glb`。

## 3. 放置

```
public/
  models/
    head.glb      <-- 放这里
```

## 4. 一行替换

打开 `src/components/three/HeadAvatar.tsx`，把顶部：

```ts
export const MODEL_URL: string | null = null
```

改为：

```ts
export const MODEL_URL: string | null = '/models/head.glb'
```

完成。代码会自动：
- 用 `useGLTF` 加载模型；
- 用 `<Center>` 自动居中（无需手动调位置）；
- 若模型带动画，自动播放第一个 clip；
- 加载完成前显示占位头，加载失败也回退占位头（不会白屏）。

## 5. 调节（可选）

- **大小/位置**：`GltfHead` 里给 `<primitive>` 或外层 `<group>` 加 `scale` / `position`。
- **旋转速度**：`HeadAvatar.tsx` 末尾 `OrbitControls` 的 `autoRotateSpeed`。
- **眼睛跟随**：Meshy 模型无程序化眼睛，跟随效果会丢失；如需保留，
  可让 Meshy 生成「大头 + 大眼」风格，或后续用骨骼约束实现（进阶）。

## 6. 密钥管理（重要）

- 不要在前端调用 Meshy API。
- 若想自动化生成，写一个**自建后端**（Cloudflare Worker / Render FastAPI），
  Key 存环境变量，前端只调自己的 API。
- `.glb` 是静态资源，进 `public/` 即可，无需密钥。

## 7. 验收

- `npm run dev` 打开首页，模型应正常显示、可拖拽、自动旋转。
- 浅色 / 深色模式切换，模型与光晕一致。
- 移动端可正常加载（≤20k 面数，首屏不卡）。
