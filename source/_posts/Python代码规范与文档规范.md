---
title: Python代码规范与文档规范
date: 2024-03-22 20:26:04
tags: 
categories: notes
description: 总结一些Python的代码规范与文档规范按照此规范进行编码。
hidden:
mathjax: 
mermaid: 
---

## Python 代码规范与文档规范（完整版）

本规范基于 **PEP 8**（Python 官方风格指南）与 **PEP 257**（文档字符串约定），并补充项目级文档要求。建议配合 `black`、`ruff`、`pydocstyle` 等工具落地。

---

## 一、代码规范

### 1.1 命名规范

| 类别                     | 规则                             | 示例                                             |
| :----------------------- | :------------------------------- | :----------------------------------------------- |
| **模块名（文件名）**     | 小写 + 下划线（snake_case）      | `config_parser.py`, `file_utils.py`              |
| **类名**                 | 大驼峰（PascalCase）             | `class ConfigParser`, `class HTTPClient`         |
| **函数名 / 方法名**      | 小写 + 下划线（snake_case）      | `def parse_data():`, `def get_file_path():`      |
| **变量名**               | 小写 + 下划线                    | `file_count`, `user_name`                        |
| **常量**                 | 全大写 + 下划线                  | `MAX_BUFFER_SIZE = 1024`, `DEFAULT_TIMEOUT = 30` |
| **私有成员（内部使用）** | 单下划线前缀（约定）             | `_internal_cache`, `_parse_impl()`               |
| **“魔术”方法 / 属性**    | 双下划线前后缀（保留）           | `__init__`, `__str__`, `__len__`                 |
| **包名（目录）**         | 小写，尽量简短，无下划线（可选） | `mypackage`, `utils`                             |

> 📌 **重要**：避免使用单字符变量名（除极短作用域如 `i`, `j`, `k` 用于循环）。避免与内置函数/关键字冲突（如不要用 `list`, `dict`, `str` 作为变量名）。

### 1.2 注释规范

#### 文件头注释（推荐，非必须但大型项目建议使用）

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
模块功能简述，例如：提供配置文件的解析和写入功能。

作者：张三 <zhangsan@example.com>
创建日期：2026-06-10
修改记录：
    - 2026-06-10 初始版本
"""
```

#### 类注释

```python
class ConfigParser:
    """
    负责解析 JSON/YAML 配置文件。

    Attributes:
        file_path (str): 当前加载的配置文件路径。
        data (dict): 解析后的配置数据。

    Methods:
        load(path): 从文件加载配置。
        get(key, default): 获取配置项。

    Example:
        >>> parser = ConfigParser()
        >>> parser.load("config.json")
        >>> timeout = parser.get("timeout", 30)
    """
```

#### 函数/方法注释（使用 docstring）

```python
def divide(a: float, b: float) -> float:
    """
    计算两个数的除法。

    Args:
        a (float): 被除数。
        b (float): 除数，不能为 0。

    Returns:
        float: 商。

    Raises:
        ValueError: 当 b 为 0 时抛出。
        TypeError: 当 a 或 b 不是数字时抛出。
    """
    if b == 0:
        raise ValueError("除数不能为 0")
    return a / b
```

**推荐 docstring 格式**：Google 风格（如上）或 NumPy/Sphinx 风格。团队统一。

#### 行内注释

```python
x = x + 1  # 计数器递增（仅当代码本身无法清晰表达意图时使用）

# 复杂逻辑前加块注释
# 根据用户角色计算权限掩码：
# - 管理员：全权限
# - 普通用户：只读
if user.role == 'admin':
    mask = 0xFF
else:
    mask = 0x01
```

### 1.3 代码格式（基于 PEP 8 + black）

- **缩进**：4 个空格（禁止 Tab）
- **行宽**：最大 79 字符（文档字符串/注释 72）或团队约定 ≤ 88（black 默认）
- **空行**：顶级函数/类之间空两行；类内方法之间空一行
- **导入**：每个导入独占一行；分组顺序：标准库 → 第三方库 → 本地模块，每组内按字母排序
- **空格**：逗号后、操作符两侧、冒号后（字典）要有空格；函数参数默认值等号两侧不加空格
- **字符串**：统一使用双引号 `"`（black 默认）或单引号 `'`，保持一致

#### 自动化工具配置

```toml
# pyproject.toml（推荐）
[tool.black]
line-length = 88
target-version = ['py310']

[tool.ruff]
select = ["E", "F", "W", "C", "N", "D"]   # 包含 pydocstyle 规则
ignore = ["D203", "D212"]                 # 根据团队偏好调整

[tool.pydocstyle]
convention = "google"                     # docstring 风格检查
```

运行：
```bash
black .
ruff check . --fix
pydocstyle .
```

---

## 二、文档规范

### 2.1 项目级文档：`README.md`（必须）

```markdown
# 项目名称

一句话简介。

## 功能特性
- 特性1
- 特性2

## 安装与依赖
需要 Python 3.9+。安装依赖：
```bash
pip install -r requirements.txt
```

## 快速开始
```python
from mylib import Parser
parser = Parser()
result = parser.parse("input.txt")
```

## 命令行使用（如有）
```bash
python main.py --help
```

## 目录结构
...
```

### 2.2 模块/包文档

#### 方式一：独立的 `.md` 文件（大型模块）

放在 `docs/` 下，如 `docs/config_parser.md`，内容包含：
- 设计概述
- 类层次图（Mermaid）
- 使用示例

#### 方式二：使用 Sphinx 自动生成文档

```bash
pip install sphinx sphinx-rtd-theme
sphinx-quickstart docs/
```

配置 `conf.py`：
```python
extensions = ['sphinx.ext.autodoc', 'sphinx.ext.napoleon']  # napoleon 支持 Google docstring
napoleon_google_docstring = True
```

生成文档：
```bash
sphinx-build -b html docs/source docs/build
```

> 📌 每个 `.py` 文件内的 docstring 会由 `autodoc` 自动提取，形成 API 文档。

### 2.3 类型注解（Type Hints）

**强制要求**：所有公共函数/方法必须有参数类型和返回值类型注解。

```python
from typing import List, Optional, Dict

def process_items(items: List[str], max_count: Optional[int] = None) -> Dict[str, int]:
    ...
```

使用 `mypy` 进行静态类型检查：
```bash
mypy --strict src/
```

---

## 三、目录与文件组织（推荐）

```
project/
├── pyproject.toml          # black, ruff, mypy, pytest 配置
├── README.md
├── requirements.txt
├── .gitignore
├── src/                    # 源代码（可打包）
│   └── mypackage/
│       ├── __init__.py
│       ├── config_parser.py
│       └── utils.py
├── tests/
│   ├── __init__.py
│   └── test_config_parser.py
├── docs/
│   ├── source/             # Sphinx 源文件
│   ├── build/              # 生成的 HTML
│   └── architecture.md
├── scripts/                # 维护脚本
└── examples/
    └── demo.py
```

---

## 四、工具链集成建议（CI / pre-commit）

创建 `.pre-commit-config.yaml`：

```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 24.0.0
    hooks:
      - id: black
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.3.0
    hooks:
      - id: ruff
        args: [--fix, --exit-non-zero-on-fix]
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: [types-all]
```

安装：
```bash
pip install pre-commit
pre-commit install
```

---

## 五、示例汇总（完整模块展示）

**文件：`src/mypackage/calculator.py`**

```python
#!/usr/bin/env python3
"""
算术运算工具模块。

提供基本的加减乘除功能，并包含类型注解和文档。
"""

def add(a: float, b: float) -> float:
    """返回两个数的和。"""
    return a + b


def divide(a: float, b: float) -> float:
    """
    返回 a 除以 b 的结果。

    Args:
        a: 被除数。
        b: 除数，不能为零。

    Returns:
        商。

    Raises:
        ValueError: 当 b 为 0 时抛出。
    """
    if b == 0:
        raise ValueError("division by zero")
    return a / b
```

**文件：`tests/test_calculator.py`**

```python
import pytest
from mypackage.calculator import divide

def test_divide_normal():
    assert divide(6, 3) == 2

def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(5, 0)
```

---

## 六、规范检查清单（提交前）

- [ ] 命名符合 PEP 8（类：大驼峰；函数/变量：下划线；常量：全大写）
- [ ] 每个公共函数/类有 docstring（Google 风格）
- [ ] 类型注解完整，`mypy` 无报错
- [ ] `black` 已格式化
- [ ] `ruff` 无警告
- [ ] `pydocstyle` 无错误
- [ ] `README.md` 存在且包含安装/运行说明
- [ ] 复杂模块在 `docs/` 下有补充说明

---

**本规范即日起生效，所有新增 Python 代码必须遵循。** 自动化工具（black, ruff, mypy）的输出可作为格式标准，无需人工争论。