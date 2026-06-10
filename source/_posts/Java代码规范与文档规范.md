---
title: Java代码规范与文档规范
date: 2024-03-22 20:26:04
tags: 
categories: notes
description: 总结一些Java的代码规范与文档规范按照此规范进行编码。
hidden:
mathjax: 
mermaid: 
---



## Java 代码规范与文档规范（完整版）

本规范融合 **Google Java Style Guide** 基础、**Oracle 官方代码约定** 及 **JavaDoc 标准**，适配现代 Java 8+ 开发。建议配合 `Spotless`、`Checkstyle`、`JavaDoc` 等工具落地。

---

## 一、代码规范

### 1.1 命名规范

| 类别                     | 规则                                     | 示例                                               |
| :----------------------- | :--------------------------------------- | :------------------------------------------------- |
| **包名**                 | 全小写，点分隔，无下划线（单词直接拼接） | `com.company.project.util`<br>`org.example.config` |
| **类名 / 接口名**        | 大驼峰（PascalCase）                     | `class FileParser`, `interface DataSource`         |
| **抽象类**               | 以 `Abstract` 或 `Base` 开头（可选）     | `abstract class BaseService`                       |
| **异常类**               | 以 `Exception` 结尾                      | `class ConfigNotFoundException`                    |
| **测试类**               | 以 `Test` 结尾                           | `class ConfigParserTest`                           |
| **枚举**                 | 大驼峰，枚举值全大写+下划线              | `enum Color { RED, GREEN, BLUE }`                  |
| **注解**                 | 大驼峰（可带 `@` 前缀）                  | `@interface JsonField`                             |
| **方法名**               | 小驼峰（camelCase），动词或动宾短语      | `getUserById()`, `sendMessage()`                   |
| **变量名**               | 小驼峰，名词                             | `userName`, `fileCount`                            |
| **常量（static final）** | 全大写 + 下划线                          | `public static final int MAX_SIZE = 1024;`         |
| **类型参数**             | 单个大写字母（推荐 T, E, K, V）          | `<T>`, `<E>`                                       |
| **文件名（.java）**      | 与顶层 public 类名完全一致，大小写敏感   | `ConfigParser.java`                                |

> 📌 **注意**：禁止使用拼音、无意义的缩写（如 `a`, `b` 除外）。布尔变量避免用否定式（`isNotError` → `isValid`）。

### 1.2 注释规范

#### 文件头注释（建议每个类文件都有）

```java
/*
 * Copyright (c) 2026, Company Name. All rights reserved.
 *
 * @author 张三 <zhangsan@example.com>
 * @date   2026-06-10
 * @version 1.0
 * @brief  配置文件解析类。
 */
```

#### 类 / 接口 / 枚举 / 注解注释（JavaDoc）

```java
/**
 * 负责解析 JSON/YAML 格式的配置文件。
 * <p>
 * 线程安全性：该类非线程安全，外部需同步访问。
 * 使用示例：
 * <pre>
 * ConfigParser parser = new ConfigParser();
 * parser.load("config.json");
 * int timeout = parser.getInt("timeout", 30);
 * </pre>
 *
 * @author 张三
 * @version 1.0
 * @since   2.0.0
 */
public class ConfigParser {
    ...
}
```

#### 方法注释（JavaDoc）

```java
/**
 * 计算两个整数的最大公约数（GCD）。
 *
 * @param a 第一个整数（非负）
 * @param b 第二个整数（非负）
 * @return 两数的最大公约数
 * @throws IllegalArgumentException 若 a 和 b 同时为 0
 */
public static int gcd(int a, int b) {
    if (a == 0 && b == 0) {
        throw new IllegalArgumentException("Both a and b cannot be zero.");
    }
    // 实现略
}
```

**字段注释**（简单明了，可用行注释）

```java
/** 默认超时时间（毫秒） */
private static final int DEFAULT_TIMEOUT_MS = 5000;

// 用户会话映射表，线程不安全，仅在单线程中使用
private Map<String, Session> sessionMap;
```

#### 块注释与行内注释

```java
// 单行注释：解释复杂逻辑
/* 多行注释
   用于临时禁用代码或详细说明 */
```

### 1.3 代码格式（基于 Google Java Style）

核心约束（完整细节参考 [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)）：

- **缩进**：2 空格（不允许 Tab）
- **行宽**：最大 100 字符（可调整为 120，团队协商）
- **大括号**：K&R 风格（左括号不换行，右括号独占一行，除非紧跟 `else`）
- **空行**：import 之后、成员之间、方法之间适当空行
- **import**：不使用通配符（`import java.util.*;` 禁止）；分组顺序：`static import` → `java.*` → `javax.*` → `org.*` → `com.*` → 项目内部，每组按字母排序
- **空格**：关键字 `if/for/while` 后有空格；方法名与参数列表的左括号之间无空格；运算符两侧加空格

#### 自动化工具配置

**Maven 项目（pom.xml）**：使用 `spotless-maven-plugin`

```xml
<plugin>
    <groupId>com.diffplug.spotless</groupId>
    <artifactId>spotless-maven-plugin</artifactId>
    <version>2.43.0</version>
    <configuration>
        <java>
            <googleJavaFormat>
                <version>1.18.1</version>
                <style>GOOGLE</style>
            </googleJavaFormat>
            <trimTrailingWhitespace/>
            <endWithNewline/>
        </java>
    </configuration>
</plugin>
```

运行：`mvn spotless:apply`

**Gradle 项目**：使用 `gradle-spotless-plugin`

```gradle
plugins {
    id 'com.diffplug.spotless' version '6.25.0'
}
spotless {
    java {
        googleJavaFormat()
        trimTrailingWhitespace()
        endWithNewline()
    }
}
```

---

## 二、文档规范

### 2.1 项目级文档：`README.md`（必须）

```markdown
# 项目名称

一句话简介（如：高性能配置中心客户端）。

## 技术栈
- Java 11+
- Maven / Gradle
- Spring Boot（如有）

## 快速开始

### 依赖添加
Maven:
```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>config-client</artifactId>
    <version>1.0.0</version>
</dependency>
```

### 示例代码
```java
ConfigClient client = new ConfigClient("http://config-server:8080");
String value = client.get("app.name");
```

## 构建与运行
```bash
./mvnw clean package
java -jar target/app.jar
```

## 模块架构
（Mermaid 或图片）
...
```

### 2.2 JavaDoc 生成 API 文档

- 所有公共类、接口、枚举、注解及其公共/protected 方法必须有 JavaDoc
- 生成命令（Maven）：

```bash
mvn javadoc:javadoc   # 生成到 target/site/apidocs
```

- 配置 `pom.xml` 插件确保 UTF-8 和编码规范：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-javadoc-plugin</artifactId>
    <version>3.6.3</version>
    <configuration>
        <charset>UTF-8</charset>
        <docencoding>UTF-8</docencoding>
        <links>
            <link>https://docs.oracle.com/en/java/javase/11/docs/api/</link>
        </links>
    </configuration>
</plugin>
```

### 2.3 核心模块补充文档（架构设计）

在 `docs/` 目录下为复杂模块编写单独的 `.md` 文件，例如 `docs/config-parser-design.md`，内容包括：

- 模块职责
- 类图和时序图（PlantUML / Mermaid）
- 关键算法解释
- 配置说明

---

## 三、目录结构推荐

```
project/
├── README.md
├── pom.xml / build.gradle
├── .gitignore
├── .editorconfig          # 统一 IDE 格式
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/company/project/
│   │   │       ├── config/
│   │   │       ├── service/
│   │   │       └── util/
│   │   └── resources/
│   │       ├── logback.xml
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/company/project/
│               └── config/
│                   └── ConfigParserTest.java
├── docs/
│   ├── api/               # JavaDoc 生成输出
│   ├── architecture.md
│   └── module-details.md
└── scripts/
```

---

## 四、工具链集成（CI / pre-commit）

结合 `pre-commit` 框架（适用于 Java）：

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/macisamuele/language-formatters-pre-commit-hooks
    rev: v2.13.0
    hooks:
      - id: pretty-format-java
        args: [--autofix, --google-style]
```

或直接使用 Maven / Gradle 插件在构建时执行：

**Maven**：`mvn spotless:check`（CI 检查）+ `mvn spotless:apply`（本地格式化）

**Gradle**：`gradle spotlessJavaCheck` / `gradle spotlessApply`

**静态分析**：Checkstyle（配合 `google_checks.xml`），可通过 `mvn checkstyle:check` 执行。

---

## 五、示例代码（完整类）

```java
package com.example.util;

/**
 * 数学工具类，提供常用安全运算。
 *
 * @author 张三
 * @since 1.0.0
 */
public final class MathUtils {

    private MathUtils() {
        throw new UnsupportedOperationException("Utility class");
    }

    /**
     * 计算两个整数的最大公约数（GCD）。
     *
     * @param a 第一个整数（非负）
     * @param b 第二个整数（非负）
     * @return 两个数的最大公约数
     * @throws IllegalArgumentException 如果 a 和 b 同时为 0
     */
    public static int gcd(int a, int b) {
        if (a == 0 && b == 0) {
            throw new IllegalArgumentException("Both a and b cannot be zero.");
        }
        a = Math.abs(a);
        b = Math.abs(b);
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

对应测试类（示例）：

```java
package com.example.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MathUtilsTest {

    @Test
    void testGcdNormal() {
        assertEquals(5, MathUtils.gcd(10, 15));
        assertEquals(7, MathUtils.gcd(14, 21));
    }

    @Test
    void testGcdWithZero() {
        assertEquals(5, MathUtils.gcd(0, 5));
        assertEquals(8, MathUtils.gcd(8, 0));
    }

    @Test
    void testGcdBothZero() {
        assertThrows(IllegalArgumentException.class, () -> MathUtils.gcd(0, 0));
    }
}
```

---

## 六、规范检查清单（提交前）

- [ ] 类名、方法名、变量名符合命名规范
- [ ] 所有公共元素有 JavaDoc（类、公共方法、常量）
- [ ] 无 `System.out.println` 等调试代码，使用日志框架
- [ ] `mvn spotless:check` 通过（格式统一）
- [ ] `mvn checkstyle:check` 无严重违规
- [ ] 无编译警告（尤其是泛型、资源未关闭等）
- [ ] `README.md` 已更新（含构建运行说明）
- [ ] 核心模块变更已补充 `docs/` 下的设计文档

---

**本规范即日起生效。** 代码格式以 `spotless` 自动格式化的结果为准，无需人工争论。API 文档采用 JavaDoc 标准自动生成并发布到项目站点。