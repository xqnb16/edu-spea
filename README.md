# Edu Speak · GitHub Pages 上传与发布说明

这是可以直接放到 GitHub Pages 的网页发布包，包含可编辑的 HTML、CSS、JavaScript、课程内容、双语字幕、图片和英汉词库。无需安装依赖，也无需付费账户。当前有 294 个可播放课程，视频使用现有站点的 720p / 1080p 文件。

## 先了解这次的托管方式

- GitHub Pages：提供首页、视频库、学习界面、词库与浏览器内功能。
- 现有公开站点：`https://everyday-vlog-study-q1014.yangqiannb16.chatgpt.site/`，继续提供视频文件。请保留该站点及其视频存储运行。
- GitHub 压缩包不包含视频原片、Cookie、登录凭证、服务器密钥或本机缓存。视频不用重新下载或上传 GitHub。
- 暂时没有账号、付费和云同步。单词、闪卡与学习记录保存在每位访问者自己的浏览器。换设备、换域名或清理浏览器数据不会自动同步；单词页支持导出收藏。
- 公开视频接口仅允许读取。原后台 `/upload` 页面已关闭；浏览器里的“导入素材”仍可使用本地文件。

## 推荐操作：GitHub Desktop，一次上传全部文件

网站文件较多，建议使用 [GitHub Desktop](https://desktop.github.com/)；浏览器上传每次最多 100 个文件。不要把 ZIP 文件本身当作网站上传，要先解压。

1. 下载并解压 `Edu-Speak-GitHub-Pages.zip`。打开解压后的文件夹，应能看到 `index.html`、`assets`、`data`、`site-config.js` 和本说明。
2. 安装 GitHub Desktop，登录你自己的 GitHub 账号。
3. 在 GitHub Desktop 点击 **File → New repository**。Name 填 `edu-speak`，Local path 选择你想保存代码的位置，然后创建仓库。
4. 打开刚创建的 `edu-speak` 文件夹，将解压包里的**全部文件和文件夹**复制进去。`index.html` 必须直接在仓库第一层；不要再套一层解压包文件夹。保留 GitHub Desktop 自动创建的 `.git` 文件夹。
5. 回到 GitHub Desktop，在左下角 Summary 输入“首次发布 Edu Speak”，点击 **Commit to main**。
6. 点击 **Publish repository**。确认仓库属于你的账号，**取消勾选 Keep this code private**，再点击发布。仓库代码将公开。
7. 点击 **Repository → View on GitHub**，进入这个仓库的网页。
8. 进入 **Settings → Pages**。在 Build and deployment 下，Source 选 **Deploy from a branch**；Branch 选 **main**，文件夹选 **/(root)**，点击 **Save**。
9. 等待 GitHub Pages 的构建完成。这个页面会出现网站地址，一般形式为 `https://你的用户名.github.io/edu-speak/`。打开这个地址即可分享。

> 如果你看不到 main，请先完成第 5、6 步。页面没有立即更新时，可到仓库的 Actions 页面查看 Pages 构建状态，完成后刷新。

## 怎么确认部署成功

依次检查：

1. 首页有 Edu Speak 标识，轮播展示真实课程画面。
2. 首页展示 6 行视频，点击“观看更多视频”可进入完整视频库并筛选。
3. 打开一条课程，能选择 720p / 1080p，播放视频并拖动进度条。
4. 点击英文单词能显示英汉释义、收藏，并在导航里的“单词”找到。
5. 点击字幕时间或中文句子能跳到视频位置，视频下的双语字幕保持显示。
6. 手机打开同一个网址，检查视频、字幕、单词卡和夜间模式。

## 后续怎么更新

在本机仓库文件夹中修改文件后，使用 GitHub Desktop 的 **Commit to main → Push origin**。GitHub Pages 会重新发布。

- 调整界面：修改 CSS、HTML 与对应 JavaScript 文件。
- 更换视频服务：修改 `site-config.js` 的 `mediaOrigin`，并更新 `hd-media.js` 和课程视频清单。新服务需提供公开的 HTTPS 视频地址，支持 Range 分段读取和跨域读取。
- 新增课程：需要课程内容、对应视频文件、字幕时间轴与视频清单一起更新；不要只往页面追加一个视频标题。
- 做账号和云同步：需要添加后端服务。GitHub Pages 提供静态网页托管，现阶段的浏览器收藏不依赖账号。

## 常见问题

**打开后只看到仓库文件，没有网站？**
请使用 Settings → Pages 提供的 `github.io` 地址访问。GitHub 仓库地址与网站地址是两个地址。

**页面空白或 404？**
检查 `index.html` 是否位于仓库根目录，Pages 是否选择了 main / (root)，以及文件是否已经 Push origin。保留包内的 `.nojekyll` 文件。

**网页能打开，但视频不能播放？**
先打开原视频站点，确认可以匿名播放。再检查 `site-config.js` 中的视频域名是否被改动。公开视频由原站提供，原站停用或文件删除会影响 GitHub 网站中的视频。

**能不能只双击本地 index.html 测试？**
推荐部署后测试。`file://` 打开会受到浏览器对词库读取、录音等功能的限制。若安装了 Node.js 22 或更高版本，可在解压目录运行 `npm run dev`，无需 `npm install`，打开终端显示的本地地址。

**GitHub 网站能不能保证所有网络都很快？**
GitHub Pages 与现有视频服务分别提供网页和视频，实际访问速度取决于使用者的网络。后续可以按需要换自有域名和视频存储，课程内容与界面可以保留。

## 词库与素材说明

英汉词库来自 [ECDICT](https://github.com/skywind3000/ECDICT)，包内保留 `data/ECDICT-LICENSE.txt` 和 `data/dictionary-source.json`。课程中的创作者、来源链接和字幕待复核标记保持原样。词库的 MIT 许可仅适用于对应词库，不代表视频或其他素材的使用许可。

## 官方参考

- [GitHub Pages 发布来源设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub 文件上传说明与限制](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [GitHub Pages 简介](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)

整理日期：2026-10-24。
