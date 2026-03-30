---
title: 关于SQLite的趣事
tags: 
categories: notes
description: 关于SQLite的一些有趣的内容
date: 2025-01-13 15:51:13
---

原文链接：[关于 SQLite 的疯狂和有趣的事实集合 - blag](https://avi.im/blag/2024/sqlite-facts/)

---

1. SQLite 是部署最多、使用最多的数据库。有超过一万亿（1000000000000000 或一百万）个 SQLite 数据库正在积极使用。

   它由[三个人](https://www.sqlite.org/crew.html)维护。他们不允许外部贡献。

2. SQLite 的使用量可能比所有其他数据库引擎的总和还要多。数十亿个 SQLite 副本存在于野外。它无处不在。

   

3. 它也可能是部署最多的五个软件模块之一。

   

4. [Hwaci](https://hwaci.com/) 是 SQLite 背后的公司。他们也喜欢音乐（？

   ![img](https://avi.im/blag/images/2024/sqlite-fact-3.png)

5. SQLite 起源于一艘美国军舰。D. Richard Hipp （DRH） 正在为海军驱逐舰 USS Oscar Austin 构建软件。每当服务器出现故障时，现有软件就会停止工作（这是在 2000 年代）。对于一艘战列舰来说，这是不可接受的。

   因此，DRH 提出了一个问题：如果数据库在没有任何服务器的情况下工作呢？用 DRH 的话来说：

   > 为什么我们甚至需要一个服务器？为什么我不能直接从磁盘驱动器上拉出它？这样，如果计算机足够健康，它就可以运行我们的应用程序，我们没有可能失败并导致我们失败的依赖项，我环顾四周，没有 SQL 数据库引擎可以做到这一点，与我一起工作的一个人说，“Richard，你为什么不写一个呢？“好吧，我试一试。”我没有立即这样做，但后来，资金中断了。那是在 2000 年，如果我没记错的话，纽特·金里奇和比尔·克林顿正在发生某种争吵，所以所有的政府合同都被关闭了，所以我失业了几个月，我想，“好吧，我现在就写那个数据库引擎吧。

6. 与大多数使用标准许可证（如 MIT 或 GPL）的开源项目不同，SQLite 不附带 OSI 批准的许可证。

   

   相反，SQLite 被发布到公共领域，并且限制更少。

   另请注意，在一些不承认公有领域的国家/地区/司法管辖区，这可能是[一个问题](https://opensource.org/blog/public-domain-is-not-open-source)。因此，SQLite [出售许可证](https://www.sqlite.org/purchase/license)，称为“所有权保证”。

7. 他们不允许外部贡献。*你不能*只是发送一个 pull request 并希望补丁会被接受。

   

8. 开源，而不是开放贡献

   

   为 SQLite 做贡献是仅限邀请的（我没有源代码）。只有在您收到邀请并签署了一份宣誓书，将你的贡献献给公共领域后，你才能提交补丁。

9. 他们是怎么做饭的？

   SQLite 中的每一行代码都有超过 600 行测试代码。测试覆盖库中 100% 的分支（和 100% [的 MC/DC](https://en.wikipedia.org/wiki/Modified_condition/decision_coverage)）。该测试套件非常多样化，包括模糊测试、边界值测试、回归测试以及模拟操作系统崩溃、电源损失、I/O 错误和内存不足错误的测试。

   SQLite 最初是作为 [Tcl 扩展](https://www.sqlite.org/tclsqlite.html)开始的，其主要测试套件是用 Tcl 编写的。

10. 有趣的是，一些 SQLite 测试是专有的。名为 [TH3 （Test Harness 3）](https://www.sqlite.org/th3.html) 的测试套件可实现代码的 100% 分支覆盖率，是专有的，不开放访问。

    我不知道有任何其他项目使代码免费，但测试套件是付费的。

    然而，他们无法销售 TH3 的一份副本。DRH 在播客中说：

    > 100% MCD 测试，称为 TH3。那是专有的。我的想法是，我们将这些测试出售给航空电子设备制造商，并以这种方式赚钱。我们正好卖了零份，所以这并没有真正奏效。

    为了获得访问权限，需要成为 SQLite Consortium 的一员，每年的费用为 120K 美元。

11. 这是一个有趣的商业模式。他们通过许可证、付费支持、维护服务、联盟成员资格和商业扩展来产生收入。

12. SQLite 没有行为准则 （CoC），而是源自《圣本笃规则》第 4 章中的“善行工具”的[道德准则](https://sqlite.org/codeofethics.html)

    

13. 在 SQLite 中：代替法律声明，这里有一个[祝福](https://github.com/sqlite/sqlite/blob/624cb96/src/wal.c#L4,#L9)：

    

    所有的源代码文件都附带了一个祝福。

14. SQLite 的速度如此之快，它们与 .对于某些用例，您可以使用 SQLite 而不是文件系统，这可以加快 35% 的速度。`fopen`

    

15. SQLite 与 Redis（猜猜哪个更快？

    

    对于[某些用例](https://x.com/iavins/status/1849422515027763227)，由于网络堆栈和（反）序列化开销，SQLite 可能比 Redis 更快。

16. 但是，与大多数数据库不同的是，SQLite 只有一个写入器模型。不能有多个并发写入器。

    最近在 2010 年，通过添加 WAL 模式，这种情况也发生了变化。在此之前，您可以拥有读者或作家，但永远不能在一起。

17. 还有其他一些事情在其他数据库中很常见，但在 SQLite 中却不常见：

    - 默认值为 rollback journal 模式，该模式限制您拥有多个读取器或单个写入器
    - 外键已禁用;他们是自愿加入的
    - 它是 “弱类型”。SQLite 称其为“类型亲和性”。这意味着即使你已经定义了一个类型，你也可以在列中插入任何内容。强类型列是可选的（由 [`STRICT`](https://www.sqlite.org/stricttables.html) 表）。
    - 您在其他数据库中期望的许多 [`ALTER` 命令](https://sqlite.org/omitted.html)不起作用。例如，您不能向现有列添加约束。（他们最近添加了重命名列名称的功能）

    这里有一整套[怪癖。](https://www.sqlite.org/quirks.html)

18. 我讨厌它不强制类型。这完全是 YOLO：

    ```sql
    CREATE TABLE user(id INTEGER);
    INSERT into user VALUES ("YOLO!"); --- This works!
    ```

    不仅如此，如果你给出一些随机类型，它不会引发任何错误。

    `CREATE TABLE t(value TIMMYSTAMP);`

    没有类型，但 SQLite 很高兴地接受这一点。`TIMMYSTAMP`

    SQLite 有五种类型：、、、、、 .想知道什么被诅咒的东西吗？类型亲和性通过[子字符串匹配](https://www.sqlite.org/datatype3.html#determination_of_column_affinity)工作！`NULL``INTEGER``REAL``TEXT``BLOB`

    ```sql
    CREATE TABLE t(value SPONGEBLOB) --- This is BLOB type!
    ```

    所以，是的，这也发生了：

    > 请注意，由于 “POINT” 末尾的 “INT” ，声明的 “FLOAT POINT” 类型将提供 INTEGER 关联，而不是 REAL 关联。

19. 这是我[最喜欢的传说](https://x.com/iavins/status/1865746403072389612)之一。SQLite 不得不将默认前缀从 更改为用户在半夜开始给开发人员打电话`sqlite_``etilqs_`

    

20. SQLite 非常重视向后兼容性

    > SQLite 版本 3 的所有版本都可以读取和写入由第一个 SQLite 3 版本（版本 3.0.0）创建的数据库文件，其历史可以追溯到 2004 年 6 月 18 日。这就是 “向后兼容性”。开发人员承诺为 SQLite 3 的所有未来版本保持数据库文件格式的向后兼容性。

21. 但是他们非常重视向后兼容性，以至于即使他们[发布了一个 bug](https://x.com/iavins/status/1851276312876326980)，他们也不会修复它

    

22. SQLite 的作者 D. Richard Hipp （DRH） 认为现有的版本控制系统不合适。所以他写了自己的书，叫[做 Fossil](https://fossil-scm.org/home/doc/trunk/www/fossil-v-git.wiki)。当然，Fossil 是由 SQLite 提供支持的。

    这让我想起了 Linus 是如何编写 Git 的。

    DRH 还编写了自己的解析器生成器，名为 Lemon。

23. DRH 根据 Donald Knuth 的 TAOCP 一书中的算法编写了 B 树，并在旅行时在飞机上对其进行编码（基于超级）

24. SQLite 发音为“Ess-Cue-El-ite”。不过，没有官方指南。[SQLite 论坛](https://web.archive.org/web/20201126110450/http://sqlite.1065341.n5.nabble.com/SQLite-Pronunciation-td88186.html#message88194)中提到的 DRH：

    > 我写了 SQLite，我认为它应该发音为“S-Q-L-ite”。就像一种矿物。但是我很酷你们想怎么发音就怎么发音。
    >
    > :-)
