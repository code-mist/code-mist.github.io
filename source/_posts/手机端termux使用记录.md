---
title: 手机端termux使用记录
date: 2026-09-12 16:10:49
tags:
categories: note
description: termux笔记
hidden:
mermaid:
mathjax:
---

# Termux 使用笔记

> 适用环境：Redmi 12C / Android 14 / Termux 0.119.0-beta3  
> 核心原则：Termux 与 Termux:API、Termux:Boot 必须来自同一来源（推荐 F-Droid），否则命令会卡死。

## 1. 安装与初始化

```bash
# 更新包列表
pkg update && pkg upgrade

# 获取手机存储访问权限，弹窗点“允许”
termux-setup-storage

# 防止 CPU 休眠，减少后台被杀
termux-wake-lock
```

### MIUI 必做设置

- 设置 → 应用管理 → Termux → 省电策略 → **无限制**
- 允许 **自启动**、**后台活动**
- 最近任务里把 Termux 卡片 **下拉锁定**
- 对 Termux:API 也做同样设置

## 2. 基础命令

```bash
pkg install <包名>      # 安装软件包
ls / cd / cp / mv / rm  # 文件操作
nano app.py             # 编辑文件
cat /proc/cpuinfo       # 查看 CPU
ifconfig                # 查看 IP，看 wlan0 的 inet
whoami                  # 查看用户名
passwd                  # 设置密码
```

## 3. SSH 远程连接

```bash
pkg install openssh
passwd                  # 设置登录密码
sshd                    # 启动 SSH 服务
whoami                  # 查看用户名，如 u0_a275
ifconfig                # 查看手机 IP
```

电脑端连接：

```bash
ssh -p 8022 用户名@手机IP
# 示例：ssh -p 8022 u0_a267@192.168.1.7
```

## 4. Flask 文件服务器

常用启动方式：

```bash
cd ~/filebrowser
python app.py
```

后台常驻：

```bash
nohup python app.py > server.log 2>&1 &
```

关键优化点：

- `send_file(..., conditional=True)`：支持断点续传和视频拖进度
- `threaded=True`：传文件时网页不卡
- 关闭 werkzeug 日志：`logging.getLogger('werkzeug').setLevel(logging.ERROR)`
- 目录分页：每页 200 个文件，避免大目录卡死
- `safe_path()`：防止 `../` 路径穿越
- 根目录按需修改：`BASE_DIR = '/storage/emulated/0/Download'`

## 5. tmux 会话管理

```bash
tmux new -s fileserver      # 新建会话
tmux attach -t fileserver   # 回到已有会话
tmux ls                     # 列出所有会话
tmux kill-session -t fileserver  # 杀掉会话
```

脱离会话：按 `Ctrl+B`，松开，再按 `D`。

> 报错 `duplicate session: fileserver` 说明会话已存在，直接 `tmux attach -t fileserver`。

## 6. Termux:API 硬件调用

安装：

- 安装 **Termux:API APK**
- Termux 内执行：`pkg install termux-api`

常用命令：

```bash
termux-battery-status                 # 电池信息
termux-camera-info                    # 摄像头信息
termux-camera-photo -c 0 photo.jpg    # 拍照，0 后置，1 前置
termux-vibrate -d 1000                # 震动 1 秒
termux-notification -t "标题"         # 发通知
termux-toast "提示"                   # 屏幕提示
```

Python 调用拍照时建议加：

```python
subprocess.run(
    ['termux-camera-photo', '-c', '0', tmp],
    stdin=subprocess.DEVNULL,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.PIPE,
    timeout=15
)
```

若超时：

- 确认 Termux:API 已安装且同源
- 运行 `termux-api-start`
- 检查 MIUI 是否冻结 Termux:API
- 可加 `timeout 10` 强制结束

## 7. 开机自启

安装 **Termux:Boot**，然后：

```bash
mkdir -p ~/.termux/boot
nano ~/.termux/boot/start-fileserver.sh
```

内容示例：

```bash
#!/data/data/com.termux/files/usr/bin/sh
termux-wake-lock
cd ~/filebrowser
nohup python app.py > server.log 2>&1 &
```

赋权：

```bash
chmod +x ~/.termux/boot/start-fileserver.sh
```

## 8. 内网穿透

| 方案              | 适合场景           | 注意                     |
| ----------------- | ------------------ | ------------------------ |
| Tailscale         | 自己访问，速度最快 | 需手机和电脑登录同一账号 |
| Cloudflare Tunnel | 分享给别人         | 免费版单次上传限制 100MB |
| FRP               | 已有云服务器       | 需自己配 frps / frpc     |

推荐：优先 Tailscale，访问 `http://100.x.x.x:5000`。

## 9. 常见问题

- `gcc` 不可用 → 用 `clang` 替代
- `pkg install termux-api` 没反应 → 还要装 Termux:API APK
- 拍照命令超时 → 检查 API 服务、权限、MIUI 后台限制
- 外网访问不了 → 先确认同一 Wi-Fi，再考虑 Tailscale
- 传输慢 → 大文件走 SFTP，Flask 只做浏览管理

