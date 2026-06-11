---
title: Zeal下载docset不稳定
date: 2026-06-11 09:43:41
tags: question
categories:
description: 关于国内在zeal官方源下载docset时不稳定，下载缓慢问题的解决方案。
hidden:
mermaid:
mathjax:

---

在Zeal官方网站：[Zeal - Offline documentation browser. Your personal reference library, searchable in an instant.](https://zealdocs.org/)

然后可以查看你要下载的文档集的名称，然后把名称替换为下面的{name}如果name有空格用下划线代替`_` 。

```bash
http://tokyo.kapeli.com/feeds/{name}.tgz

http://singapore.kapeli.com/feeds/{name}.tgz 	

http://sanfrancisco.kapeli.com/feeds/{name}.tgz   

http://frankfurt.kapeli.com/feeds/{name}.tgz 

http://newyork.kapeli.com/feeds/{name}.tgz 

http://sydney.kapeli.com/feeds/{name}.tgz 

http://london.kapeli.com/feeds/{name}.tgz
```

然后把链接复制到浏览器url框访问就可以进行下载了，下载后使用解压缩软件解压把里面的`***.docset` 文件夹解压到Zeal的`docsets`文件夹下，此文件夹是存放下载的doset的，可以从`Edit->Preferences->General的下方找到Docset storage` 此文件夹的位置。