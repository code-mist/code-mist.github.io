---
title: Git项目管理规范
date: 2024-03-24 20:26:04
tags: 
categories: notes
description: 总结Git的项目开发管理的规范与按照此规范进行开发。
hidden:
mathjax: 
mermaid: 
---



# Git 使用规范文档（基于 Git Flow）

> 版本：v1.0  
> 适用范围：所有使用 Git 进行版本控制的项目  
> 核心模型：Git Flow（`master` / `develop` / `feature` / `release` / `hotfix`）

---

## 1. 目的

- 统一团队的 Git 操作流程，降低协作成本。
- 保证代码历史清晰、可追溯、易于回滚与发布。
- 规范分支、提交信息、合并与发布策略。

---

## 2. 分支模型总览（Git Flow）

| 分支类型    | 分支名示例               | 长期存在 | 来源         | 合并目标                   |
| ----------- | ------------------------ | -------- | ------------ | -------------------------- |
| `master`    | `master`                 | 是       | -            | -（只接收 release/hotfix） |
| `develop`   | `develop`                | 是       | 初始化时创建 | 无（接收 feature/release） |
| `feature/*` | `feature/user-login`     | 否       | `develop`    | `develop`                  |
| `release/*` | `release/v1.2.0`         | 否       | `develop`    | `master` + `develop`       |
| `hotfix/*`  | `hotfix/payment-timeout` | 否       | `master`     | `master` + `develop`       |

### 2.1 分支说明

- **`master` 分支**：生产环境代码，永远保持稳定、可发布的状态。每次发布新版本时，由 `release` 或 `hotfix` 分支合并而来，并打上版本标签。
- **`develop` 分支**：主开发分支，集成所有已完成的功能。代表最新的开发进度。
- **`feature/*` 分支**：用于开发新功能。从 `develop` 创建，完成后合并回 `develop`。
- **`release/*` 分支**：用于准备新版本发布。从 `develop` 创建，只允许修复性提交，完成后合并回 `master` 和 `develop`，并打标签。
- **`hotfix/*` 分支**：用于紧急修复线上问题。从 `master` 创建，修复后合并回 `master` 和 `develop`，并打标签。

---

## 3. 命名规范

### 3.1 分支名

- 只允许小写字母、数字、短横线（`-`）、斜杠（`/`）。
- 格式：`类型/描述`。
- 示例：  
  - `feature/pay-api`  
  - `release/v1.2.0`  
  - `hotfix/login-error`  

### 3.2 标签名

- 格式：`v<major>.<minor>.<patch>`，如 `v2.1.0`。
- 遵循语义化版本（SemVer）。
- 每个发布到 `master` 的合并必须打标签（包括 release 和 hotfix）。

### 3.3 提交信息格式

采用 **Conventional Commits** 规范：

```
<类型>(<可选范围>): <主题>

[可选的正文]

[可选的脚注]
```

**常见类型**：

| 类型       | 说明                           |
| ---------- | ------------------------------ |
| `feat`     | 新功能                         |
| `fix`      | 修复 Bug                       |
| `docs`     | 仅文档修改                     |
| `style`    | 代码格式（不影响逻辑）         |
| `refactor` | 重构（不是新功能也不是修 Bug） |
| `perf`     | 性能优化                       |
| `test`     | 添加或修正测试                 |
| `chore`    | 构建/工具/依赖修改             |

示例：
```
feat(user): 添加手机号登录

- 支持手机号+验证码登录
- 添加验证码发送接口

Closes #123
```

---

## 4. 分支操作详细流程

### 4.1 Feature 分支（新功能）

**创建**  
```bash
git checkout develop
git pull --rebase
git checkout -b feature/your-feature-name
```

**开发过程**  
- 每日至少同步一次 `develop` 的最新改动：  
  ```bash
  git fetch origin
  git rebase origin/develop
  ```
- 保持原子提交，遵循提交信息规范。

**完成并合并回 develop**  
必须通过 Pull Request / Merge Request 进行 Code Review。  
```bash
git checkout develop
git pull --rebase
git merge --no-ff feature/your-feature-name
git branch -d feature/your-feature-name
git push origin develop
```

### 4.2 Release 分支（发布准备）

**创建时机**：`develop` 已达到可发布状态，且本次发布包含的功能点已就绪。

```bash
git checkout develop
git pull --rebase
git checkout -b release/v1.2.0
```

**允许的操作**  
- 修复小 Bug  
- 更新版本号、配置文件、文档  
- 执行最终测试  

**禁止** 在此分支上开发新功能。

**完成发布**  
```bash
git checkout master
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin master --tags

git checkout develop
git merge --no-ff release/v1.2.0
git branch -d release/v1.2.0
git push origin develop
```

### 4.3 Hotfix 分支（紧急修复）

**创建时机**：线上 `master` 出现严重缺陷，需立即修复。

```bash
git checkout master
git pull --rebase
git checkout -b hotfix/login-error
```

**修复及完成**  
```bash
# 修复完成后
git checkout master
git merge --no-ff hotfix/login-error
git tag -a v1.2.1 -m "Hotfix: fix login error"
git push origin master --tags

git checkout develop
git merge --no-ff hotfix/login-error
git branch -d hotfix/login-error
git push origin develop
```

> 如果此时存在 `release` 分支，则需将 hotfix **同时合并** 到该 `release` 分支（而不是 `develop`），以确保 `release` 分支也包含该修复。

---

## 5. 提交与推送规范

### 5.1 原子性提交
- 一次提交只做一件事。
- 不要将多个不相关的改动混在同一个提交中。

### 5.2 提交前检查
- 确保代码通过本地编译/测试。
- 使用 `git status` 检查多余文件（如 `.DS_Store`、`node_modules/`），应通过 `.gitignore` 排除。

### 5.3 推送前操作
- 先拉取最新代码：`git pull --rebase origin <分支名>`，避免产生多余的 merge 提交。
- 解决完冲突后使用 `git rebase --continue`。

### 5.4 禁止操作
- **禁止** 强制推送到共享分支（`develop`, `master`, `release/*`）。
- **禁止** 在公共分支上 `amend` 已推送的提交。

---

## 6. 合并（Merge）规范

### 6.1 PR/MR 流程
- 所有合并进 `develop` 或 `master` 的代码必须通过 **Pull Request / Merge Request**。
- PR 标题与提交信息应清晰说明改动内容。
- PR 必须通过 CI 检查（至少编译+单测）。
- 至少 1 名 reviewer 批准后方可合并。

### 6.2 合并策略
- 所有合并（feature → develop，release → master/develop，hotfix → master/develop）均使用 `--no-ff` 保留分支历史，方便追溯。
- 禁止使用 `--ff-only`。

### 6.3 冲突解决
- 在本地用 `git merge` 或 `git rebase` 解决冲突，不要在网页上直接点击“解决冲突”。
- 解决后再次运行测试。

---

## 7. 分支保护规则（建议在 Git 服务端设置）

| 分支        | 保护规则                                                     |
| ----------- | ------------------------------------------------------------ |
| `master`    | 禁止直接推送；只允许通过 PR 合并；必须通过 CI + 至少 1 人批准 |
| `develop`   | 禁止直接推送；只允许通过 PR 合并；必须通过 CI                |
| `release/*` | 允许维护者直接推送（仅限小型修复），建议仍走 PR              |

---

## 8. 忽略文件规范

必须配置 `.gitignore`，防止提交：
- 编译产物（`*.class`、`*.o`、`dist/` 等）
- 依赖目录（`node_modules/`、`vendor/`）
- 环境配置文件（`.env`、`*.local`）
- IDE 目录（`.idea/`、`.vscode/`、`*.swp`）
- 日志文件、临时文件

---

## 9. 常用命令速查

| 操作                    | 命令                                                    |
| ----------------------- | ------------------------------------------------------- |
| 开始新功能              | `git checkout -b feature/xxx develop`                   |
| 同步 develop 到功能分支 | `git fetch origin && git rebase origin/develop`         |
| 完成功能分支            | `git checkout develop && git merge --no-ff feature/xxx` |
| 开始发布                | `git checkout -b release/v1.2.0 develop`                |
| 完成发布                | （按 4.2 节步骤）                                       |
| 开始热修复              | `git checkout -b hotfix/xxx master`                     |
| 查看分支图              | `git log --oneline --graph --all`                       |
| 删除本地分支            | `git branch -d <branch>`                                |
| 删除远程分支            | `git push origin --delete <branch>`                     |

---

## 10. 违规与纠正

若出现违规情况（如强制推送到共享分支、提交信息混乱）：
- 由提交者立即纠正，并通过 `revert` 或 `reset` 恢复。
- 团队回顾会议讨论原因，避免重复发生。

---

## 11. 附录：Git 配置推荐

```bash
# 别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all"

# 自动处理行尾（Windows / Mac / Linux）
git config --global core.autocrlf input
```

---

> 📌 本规范为强制标准，如有特殊情况需调整，须经团队评审并更新本文档。

---

