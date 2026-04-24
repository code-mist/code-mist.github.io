---
title: WSL-Ubuntu设置
date: 2026-04-24 20:26:04
tags: question
categories:
description: 在windows电脑上设置WSL并使用Ubuntu的记录。
hidden:
---

WSL Ubuntu 安装在 D 盘后，需要完成以下几项关键设置：**更新系统、配置用户环境、优化资源占用，并确保与 Windows 文件系统的互操作顺畅**。



## 安装基础配置

### 1. 确认安装位置与版本
首先确认 Ubuntu 确实位于 D 盘，且 WSL 版本为 2（推荐）：
```powershell
# 在 PowerShell 中执行
wsl -l -v
```
如果版本显示为 1，请升级：
```powershell
wsl --set-version Ubuntu-24.04 2
wsl --set-default-version 2
```

### 2. 首次启动与基础配置
启动 Ubuntu 并完成初始化：
```bash
# 在 PowerShell 或开始菜单点击 Ubuntu 图标启动
# 首次启动会提示创建用户名和密码（输入密码时不显示）
sudo -i   # 若需要 root 权限
```

**关键第一步：更换国内软件源**（大幅提升下载速度）  
备份原有源列表：
```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
sudo sed -i 's@archive.ubuntu.com@mirrors.aliyun.com@g' /etc/apt/sources.list
sudo apt update && sudo apt upgrade -y
```

### 3. 安装基础开发工具（可选但推荐）
```bash
sudo apt install -y build-essential git curl wget unzip zip
sudo apt install -y python3 python3-pip   # 若需要 Python
```

### 4. 配置 WSL 全局设置（优化资源占用）
在 Windows 用户目录下创建/编辑 `.wslconfig` 文件：
```powershell
# 在 PowerShell 中执行
notepad "$env:USERPROFILE\.wslconfig"
```
添加以下内容（根据你的硬件调整）：
```ini
[wsl2]
memory=8GB          # 限制内存占用，避免 Windows 卡顿
processors=4        # 限制 CPU 核心数
swap=2GB            # 交换分区大小
localhostForwarding=true
```
保存后，需重启 WSL 生效：
```powershell
wsl --shutdown
```

### 5. 文件互操作与权限
- **访问 Windows 文件**：Ubuntu 中访问 D 盘路径为 `/mnt/d/`
- **避免跨文件系统操作**：不要把项目代码放在 `/mnt/d/` 下运行（I/O 性能差），建议在 WSL 内部（如 `/home/你的用户名/`）进行开发，用 Windows 资源管理器打开：`\\wsl$\Ubuntu-24.04\home\你的用户名`

### 6. 其他实用设置
**设置默认登录用户**（若每次需输入用户名）：
```powershell
# 在 PowerShell 中执行（将 USERNAME 替换为你的用户名）
ubuntu2404.exe config --default-user USERNAME
```

**开启 systemd**（Ubuntu 24.04 默认开启，若未开启）：
编辑 `/etc/wsl.conf`：
```bash
sudo nano /etc/wsl.conf
```
添加：
```ini
[boot]
systemd=true
```
保存后重启 WSL。

### 7. 图形界面（如需）
若需 GUI 应用，Windows 11 已原生支持，无需额外配置；若需显示 Linux GUI，确保安装显卡驱动并运行：
```bash
sudo apt install -y ubuntu-desktop  # 可选，体积较大
```

### 常见问题
- **D 盘空间不足**：可通过 `wsl --export` 导出备份，再 `wsl --import` 到其他目录迁移
- **网络代理**：若使用代理，在 Ubuntu 中配置 `export http_proxy=http://你的代理IP:端口`
- **权限问题**：遇到 `Permission denied` 时，检查文件是否在 Windows 分区（`/mnt/d`）且未正确挂载权限

完成上述步骤后，你WSL Ubuntu 24.04 就处于一个可高效开发的状态了。如果有特定用途（如 Docker、Node.js 等），可根据需要继续安装相应环境。



-----



## 其它工具安装推荐



除了基础的 C/C++ 开发工具（`build-essential`、`gdb`、`cmake` 等），以下推荐的工具可以进一步提升开发效率、代码质量和环境便捷性。可以根据实际需求选择性安装。

---

### 1. 版本控制与协作
- **Git LFS**（大文件支持）  
  ```bash
  sudo apt install -y git-lfs
  git lfs install
  ```
- **Git 图形化工具**（可选，在 WSL 中建议使用 VS Code 插件）

---

### 2. 代码质量与格式化
- **clang-format**（自动格式化 C/C++ 代码）  
  ```bash
  sudo apt install -y clang-format
  ```
- **clang-tidy**（静态分析）  
  ```bash
  sudo apt install -y clang-tidy
  ```
- **cppcheck**（静态检查）  
  ```bash
  sudo apt install -y cppcheck
  ```
- **cpplint**（Google 风格检查）  
  ```bash
  sudo apt install -y cpplint
  ```

---

### 3. 构建与包管理
- **Ninja**（快速构建系统）  
  ```bash
  sudo apt install -y ninja-build
  ```
- **Meson**（现代构建系统）  
  ```bash
  sudo apt install -y meson
  ```
- **Conan**（C/C++ 包管理器）  
  ```bash
  sudo apt install -y python3-pip
  pip3 install conan
  ```

---

### 4. 调试与性能分析
- **strace** / **ltrace**（系统调用/库调用跟踪）  
  ```bash
  sudo apt install -y strace ltrace
  ```
- **perf**（性能分析，需安装 linux-tools-common）  
  ```bash
  sudo apt install -y linux-tools-common linux-tools-generic
  ```
- **gprof**（GNU 性能分析）  
  ```bash
  sudo apt install -y binutils   # 已包含 gprof
  ```

---

### 5. 容器化与虚拟化
- **Docker**（容器化开发环境，需在 WSL2 中安装）  
  ```bash
  # 推荐使用官方脚本
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
  # 重启 WSL 生效
  ```
- **Podman**（Docker 替代品）  
  ```bash
  sudo apt install -y podman
  ```

---

### 6. 数据库客户端
- **SQLite3**（轻量级数据库）  
  ```bash
  sudo apt install -y sqlite3
  ```
- **PostgreSQL 客户端**  
  ```bash
  sudo apt install -y postgresql-client
  ```
- **MySQL 客户端**  
  ```bash
  sudo apt install -y mysql-client
  ```

---

### 7. 网络与系统工具
- **net-tools** / **iproute2**（网络诊断）  
  ```bash
  sudo apt install -y net-tools iproute2
  ```
- **nmap**（端口扫描）  
  ```bash
  sudo apt install -y nmap
  ```
- **tcpdump**（抓包）  
  ```bash
  sudo apt install -y tcpdump
  ```

---

### 8. 文本处理与效率增强
- **ripgrep**（快速搜索）  
  ```bash
  sudo apt install -y ripgrep
  ```
- **fd-find**（find 替代）  
  ```bash
  sudo apt install -y fd-find
  ```
- **bat**（语法高亮的 cat）  
  ```bash
  sudo apt install -y bat
  ```
- **jq**（JSON 处理）  
  ```bash
  sudo apt install -y jq
  ```
- **tmux** / **zsh**（终端复用/增强 shell）  
  ```bash
  sudo apt install -y tmux zsh
  ```

---

### 9. Python 开发环境（可选）
- **Python 3 及虚拟环境**  
  ```bash
  sudo apt install -y python3 python3-pip python3-venv
  ```

---

### 10. 实用小工具
- **htop**（系统监控）  
  ```bash
  sudo apt install -y htop
  ```
- **tree**（目录树显示）  
  ```bash
  sudo apt install -y tree
  ```
- **neofetch**（系统信息展示）  
  ```bash
  sudo apt install -y neofetch
  ```
- **unzip** / **zip**（压缩工具，通常已安装）  
  ```bash
  sudo apt install -y unzip zip
  ```

---

### 安装建议
- **按需安装**：不必全部安装，可根据项目需要逐步添加。
- **磁盘空间**：WSL 的虚拟磁盘会动态增长，建议定期清理（`sudo apt autoremove`）。
- **VS Code 集成**：推荐在 VS Code 中安装 **Remote - WSL** 扩展，并配合 **C/C++**、**CMake Tools**、**Docker** 等扩展，能获得更流畅的开发体验。

执行以上命令前，建议先更新软件源：
```bash
sudo apt update
```

如果需要轻量的环境，只安装 `build-essential` + `cmake` + `gdb` + `git`，其余工具按需添加。



----

## 给提示符行添加颜色

为 root 用户添加彩色提示符，可以通过修改 `PS1` 环境变量实现。下面是具体步骤和几种配色方案。

---

### 步骤

1. **进入 root 环境**（如果你当前是普通用户）：
   ```bash
   sudo su -
   ```
   或直接使用 root 登录（WSL 默认允许）。

2. **编辑 root 的 `.bashrc` 文件**：
   ```bash
   nano /root/.bashrc
   ```
   或使用你喜欢的编辑器（如 `vim`）。

3. **在文件末尾添加以下任一配色方案**（推荐使用第一种）。

4. **保存并退出**（nano 按 `Ctrl+O` 回车保存，`Ctrl+X` 退出）。

5. **使配置立即生效**：
   ```bash
   source /root/.bashrc
   ```
   或重新打开终端。

---

### 配色方案

#### 方案 1：简单经典（用户@主机:路径 颜色区分）
```bash
PS1='\[\e[31m\]\u\[\e[m\]@\[\e[32m\]\h\[\e[m\]:\[\e[33m\]\w\[\e[m\]\$ '
```
- `\u`：用户名（root）
- `\h`：主机名（Jin）
- `\w`：当前工作目录（完整路径）
- `\$`：普通用户显示 `$`，root 显示 `#`
- 颜色：红色用户名，绿色主机名，黄色路径，最后恢复默认颜色

效果：  
`root@Jin:/mnt/c/Users/33187#` 现在 `root` 红色，`Jin` 绿色，路径黄色。

---

#### 方案 2：带时间戳
```bash
PS1='\[\e[34m\]\t\[\e[m\] \[\e[31m\]\u\[\e[m\]@\[\e[32m\]\h\[\e[m\]:\[\e[33m\]\w\[\e[m\]\$ '
```
- `\t`：当前时间（HH:MM:SS），蓝色
- 其余同上

效果：`14:30:22 root@Jin:/mnt/c/Users/33187#`（时间蓝色）

---

#### 方案 3：仅改变当前目录颜色
```bash
PS1='\u@\h:\[\e[36m\]\w\[\e[m\]\$ '
```
- 目录为青色，其余保持默认

---

#### 方案 4：高亮显示 root 用户（背景色）
```bash
PS1='\[\e[1;31m\]\u\[\e[m\]@\[\e[32m\]\h\[\e[m\]:\[\e[33m\]\w\[\e[m\]\$ '
```
- `1;31m`：加粗红色，更醒目

---

### 颜色代码速查
| 颜色 | 前景色 | 背景色 |
| ---- | ------ | ------ |
| 黑色 | 30     | 40     |
| 红色 | 31     | 41     |
| 绿色 | 32     | 42     |
| 黄色 | 33     | 43     |
| 蓝色 | 34     | 44     |
| 品红 | 35     | 45     |
| 青色 | 36     | 46     |
| 白色 | 37     | 47     |

- 加粗：`1;`（如 `1;31m` 表示加粗红色）
- 下划线：`4;`
- 恢复默认：`\e[m` 或 `\e[0m`

---

### 注意事项
- 如果希望永久生效，必须将配置写入 `~/.bashrc`（对于 root 是 `/root/.bashrc`）并确保 `~/.bash_profile` 或 `~/.profile` 已调用 `.bashrc`（通常默认已配置）。
- 如果终端颜色未显示，请检查终端模拟器是否支持 ANSI 颜色（WSL 中均支持）。
- 如果只想临时测试，可直接在终端输入 `export PS1='...'` 试效果，不写入文件。



----



## 保存环境和代码

如果希望代码和开发环境能够长久保存，并在更换电脑时轻松迁移，需要采用 **备份和导出** 的方法。WSL 的虚拟磁盘文件（ext4.vhdx）虽然可以手动复制，但直接复制容易遇到权限问题、路径冲突，因此官方推荐使用 **导出/导入** 功能。

以下是三种常用方案，按推荐程度排序：

---

### 方案一：导出整个 WSL 发行版（最完整）

此方法会备份整个 Ubuntu 系统，包括所有安装的软件、配置、用户文件（代码、配置等）。

1. **在旧电脑上关闭 WSL 发行版**  
   ```powershell
   wsl --terminate Ubuntu-24.04
   ```

2. **导出为 tar 文件**（存放到 Windows 分区，例如 D 盘）  
   ```powershell
   wsl --export Ubuntu-24.04 D:\wsl_backup\ubuntu24.04.tar
   ```
   文件可能很大（几 GB 到几十 GB），请确保有足够空间。

3. **将 tar 文件复制到新电脑**（通过 U 盘、网络或云盘）。

4. **在新电脑上导入发行版**  
   ```powershell
   wsl --import Ubuntu-24.04 D:\wsl\Ubuntu-24.04 D:\wsl_backup\ubuntu24.04.tar --version 2
   ```
   - 第一个路径是 **安装位置**（虚拟磁盘文件存放处，推荐放在非系统盘，如 `D:\wsl\Ubuntu-24.04`）。
   - 第二个路径是 **tar 文件路径**。

5. **设置默认用户**  
   导入后默认以 root 登录，需恢复原来的用户名：
   ```powershell
   ubuntu2404.exe config --default-user 你的用户名
   ```
   （如果命令不可用，可进入 WSL 后手动修改 `/etc/wsl.conf`）

---

### 方案二：仅备份用户数据（轻量级）

如果只关心代码和个人配置（如 `.bashrc`），可以只备份 `/home/用户名` 目录。

1. **在 WSL 中打包用户目录**  
   ```bash
   cd /home
   tar -czf /mnt/d/wsl_backup/home_backup.tar.gz 你的用户名
   ```

2. **将压缩包复制到新电脑**。

3. **在新电脑安装 Ubuntu 后，解压覆盖**  
   ```bash
   cd /home
   sudo tar -xzf /mnt/d/wsl_backup/home_backup.tar.gz
   sudo chown -R 你的用户名:你的用户名 你的用户名
   ```

此方法不会备份系统级软件（如通过 `apt` 安装的包），需要重新安装。

---

### 方案三：使用 Git 托管代码（最常用）

如果你的核心需求是 **保存代码**，建议将代码放到 Git 仓库（GitHub、GitLab、Gitee 等），这是最专业的长久保存方式：

- 在 WSL 中初始化 Git 仓库，将代码提交并推送到远程。
- 换电脑后，重新安装 Ubuntu，再克隆仓库即可。
- 配合 `.bashrc`、`.vimrc` 等配置文件可托管在 GitHub 上（如使用 `dotfiles` 仓库）。

这种方式不依赖特定硬件，任何地方都能重建开发环境，且具备版本历史。

---

### 注意事项

- **不要直接复制 `%LOCALAPPDATA%\Packages\...\LocalState\ext4.vhdx`**：这样做可能因为路径绑定、权限问题导致无法启动。
- **导出前关闭 WSL**：`wsl --terminate` 确保数据完整。
- **大文件备份**：如果虚拟磁盘较大，导出后可用 7-Zip 等工具压缩 tar 文件。
- **重新安装软件**：导出/导入会保留所有软件，但若使用方案二，需要在新电脑上重新运行 `sudo apt install ...` 安装开发工具。

---

### 总结
- 要 **完整迁移整个 Ubuntu 环境**（包括所有软件、配置、代码），使用 **方案一**（`wsl --export`/`--import`）。
- 只关心 **用户代码和配置**，使用 **方案二**（备份 `/home`）或 **方案三**（Git 托管）。
- 对于代码，**强烈推荐结合 Git 远程仓库**，这不仅能备份，还能跨设备协作和历史管理。



---

