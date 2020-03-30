反应 React
应用程序 应用
i (.*?) / i <i>$1</i>
呈现 渲染
Technically 严格来说
第([0-9])部分 第$1章节
道具 props
以下 如下
第(.?)部分 第$1章节
析构 解构
Note 便笺 
注释 便笺 
音符 便笺 
 标记  标签
指示 说明
笔记 便笺
step([0-9]) 步骤$1
是可能的 是可行的
客户机 客户端
\* \* NB.*? \* \* ** 注意 **
钩子 Hook
路由器 路由
一部分 一章节
本部分 本章节
抱怨 产生警告
编译 转译

Round3 TODO：
统一修改课程内链接（在所有章节起完名字后）
代码修改链接

merge-log@2020-03-26
```
git merge mluu/source
Auto-merging src/content/pages/main.json
Auto-merging src/content/pages/faq.json
Auto-merging src/content/pages/about.json
Merge made by the 'recursive' strategy.
 src/content/0/en/part0a.md   |  85 +++++---
 src/content/0/fi/osa0a.md    |  18 +-
 src/content/1/en/part1a.md   |   2 +
 src/content/1/en/part1b.md   |   2 +-
 src/content/1/en/part1c.md   |   4 +-
 src/content/2/en/part2a.md   |   7 +-
 src/content/2/en/part2b.md   |  12 +-
 src/content/2/fi/osa2a.md    |   7 +-
 src/content/2/fi/osa2d.md    |   2 +-
 src/content/4/en/part4b.md   |   2 -
 src/content/5/en/part5a.md   |   2 +-
 src/content/5/en/part5b.md   |   3 +-
 src/content/5/en/part5d.md   |   9 +-
 src/content/5/fi/osa5b.md    |   2 +-
 src/content/6/en/part6a.md   |   9 +-
 src/content/6/en/part6d.md   |   8 +-
 src/content/7/en/part7a.md   |  51 ++---
 src/content/7/en/part7b.md   |  26 +--
 src/content/7/en/part7e.md   |   7 +-
 src/content/8/en/part8b.md   |   1 -
 src/content/8/en/part8d.md   |   4 +-
 src/content/9/en/part9b.md   |   2 +-
 src/content/9/en/part9c.md   |  26 +--
 src/content/9/en/part9d.md   | 503 +++++++++++++++++++++++++++++++------------
 src/content/images/0/28a.png | Bin 0 -> 120137 bytes
 src/content/images/0/28b.png | Bin 0 -> 63821 bytes
 src/content/images/9/28e.png | Bin 0 -> 52882 bytes
 src/content/images/9/29e.png | Bin 0 -> 50472 bytes
 src/content/pages/about.json |   4 +-
 src/content/pages/faq.json   |  30 ++-
 src/content/pages/main.json  |   3 +-
 src/pages/about.en.js        |   2 +-
 32 files changed, 530 insertions(+), 303 deletions(-)
 create mode 100644 src/content/images/0/28a.png
 create mode 100644 src/content/images/0/28b.png
 create mode 100644 src/content/images/9/28e.png
 create mode 100644 src/content/images/9/29e.png
 ```
 英文开头的行：
^[A-Z,a-z].*

还原代码行：
```([\w\W]+?)```\n

注释：
(^(\*\*)[A-Z,a-z].+)
(^(_)[A-Z,a-z].+)
(^(\[)[A-Z,a-z].+)

解注释：
<pre>([\w\W]+?)

解注释：包含中文，但被注释了。
<!-- (.*[\u4e00-\u9fa5].*)-->