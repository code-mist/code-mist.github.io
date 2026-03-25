---
title: 技术学习路线图总结
date: 2025-7-7
categories:
description: 技术学习路线图总结，是一个国外网站上的图 总结成文字
---







# 技术学习路线图总结

> 获取详细版本 链接：[http://roadmap.sh](http://roadmap.sh/)

## 1.Android Developer Roadmap 2020
- **编程语言**：Kotlin、Java  
- **开发工具**：Android Studio（Debugger、CPU Profiler、Android SDK、模拟器、SDK Manager）、文件格式（XML）  
- **应用清单**：数据备份、权限、应用组件  
- **应用组件**：Activity（生命周期、任务栈）、广播接收器、服务（Intent Service）、Intent（Intent 过滤器、隐式/显式 Intent）  
- **资源**：字符串（本地化、数量、数组、Span）、字体（XML、可下载）、样式（Styleables、主题）、Drawable（自适应图标、矢量、动画、位图、Mipmap）  
- **用户界面**：UI 组件（输入字段、可点击组件、应用栏、多媒体）、数据视图（适配器、Spinner、RecyclerView）、UI 布局（线性、约束、相对、帧布局）  
- **更多 UI**：进度条、Toast & Snackbar、搜索界面、对话框与选择器、无障碍、屏幕阅读器  
- **数据存储**：SQLite、共享偏好、Realm、文件存储（文件提供器）  
- **质量保证**：Lint 工具（Detekt、KtLint、Android Lint）、测试（Espresso、Robolectric、UI Automator、JUnit、单元/集成/仪器/烟雾测试）  
- **架构**：依赖注入（Koin、Kodein、Dagger、Hilt）、代码（Clean 架构）、展示层（MVVM、MVP、MVI、MVC、VIPER）  
- **构建配置**：构建类型、构建风格、Gradle、Groovy  
- **线程处理**：Handler、协程、Async Task  
- **网络处理**：REST（Retrofit）、GraphQL、数据传输格式（Protocol Buffer、FlatBuffer）、JSON 转换器（Gson、Moshi）  
- **Android Jetpack**：Material Design、Emoji、导航、数据绑定、架构组件（Multidex、Slices、Room、LiveData、ViewModel、Paging Library、WorkManager、Lifecycle）  
- **Google 库**：Firebase（认证、Firestore、远程配置、ML Kit、分析、测试实验室、云消息、应用索引、动态链接）、Google Play 服务（Google Maps、Proguard）  
- **安全**：R8、Keystore、位置、环境、运动、相机  
- **内容提供器**：联系人提供器、日历提供器  
- **动画**：Object Animator、Transition  
- **应用发布**：Play Store、App APK、App Bundle、应用计费、应用链接、应用操作、即时应用  


## 2. ASP.NET Core Developer Roadmap
- **学习先决条件**：C#（C# 9、.NET 5）  
- **通用开发技能**：GIT（VSTS、GitHub、GitLab）、HTTP/HTTPS、dotnet CLI、数据结构与算法  
- **SQL 基础**：存储过程、约束、触发器  
- **SOLID 原则**：SRP、OCP、LSP、ISP、DIP  
- **ASP.NET Core 基础**：MVC、REST、Razor Pages、Razor Components、中间件、筛选器与属性、应用设置与配置、认证与授权  
- **对象关系映射（ORM）**：Entity Framework Core、Dapper、NHibernate  
- **依赖注入**：Microsoft.Extensions.DependencyInjection、AutoFac、Ninject、Castle Windsor、Simple Injector、作用域/瞬态/单例、Scrutor  
- **数据库**：SQL Server、PostgreSQL、MariaDB、MySQL、Azure CosmosDB、Amazon DynamoDB、Elasticsearch、Solr、Redis、MongoDB、LiteDB、Apache Cassandra、RavenDB、CouchDB  
- **缓存**：StackExchange.Redis、Redis、EasyCaching、Memcached、Entity Framework 二级缓存  
- **API 客户端与通信**：OData、REST、gRPC、GraphQL、HotChocolate、GraphQL-dotnet  
- **对象映射**：AutoMapper、Mapster、ExpressMapper、AgileMapper  
- **测试**：xUnit、NUnit、MSTest、Moq、NSubstitute、FakeItEasy、FluentAssertions、Shouldly、WebApplicationFactory、TestServer、SpecFlow、BDDfy、LightBDD、Selenium、Puppeteer Sharp  
- **持续集成与部署**：GitHub Actions、Azure Pipelines、Travis CI、Jenkins、Circle CI、TeamCity  
- **客户端库**：Blazor  
- **模板引擎**：Razor、DotLiquid、Scriban、Fluid  


## 3.Backend Development Roadmap
- **语言选择**：JavaScript、Go、Python、Ruby、Java、C#、PHP、Rust  
- **版本控制**：Git、GitHub、GitLab、Bitbucket  
- **关系型数据库**：PostgreSQL、MySQL、MariaDB、MS SQL、Oracle、SQLite  
- **缓存**：Redis、Memcached、服务端、CDN、客户端  
- **API**：REST、JSON API、SOAP、gRPC、GraphQL、HATEOAS、Open API Specs  
- **认证**：JWT、OAuth、基本认证、令牌认证、Cookie 认证、OpenID、SAML  
- **Web 安全**：哈希（MD5、SHA、scrypt、bcrypt）、HTTPS、OWASP 风险、CORS、SSL/TLS、CSP、服务器安全、API 安全最佳实践  
- **测试**：集成、单元、功能  
- **CI/CD**：ORM、ACID、事务、N+1 问题、规范化、故障模式、性能分析、迁移  
- **数据库扩展**：索引、复制、分片、CAP 定理  
- **软件设计与架构**：架构模式（单体、微服务、SOA、无服务器、服务网格、十二要素应用）、设计原则（GOF 模式、领域驱动设计、TDD、CQRS、事件溯源）、容器化（Docker、LXC）、Kubernetes  
- **Web 服务器**：Nginx、Apache、Caddy、MS IIS  
- **搜索引擎**：Elasticsearch、Solr  
- **消息代理**：RabbitMQ、Kafka  
- **实时数据**：服务器发送事件、WebSockets、长轮询、短轮询  
- **NoSQL 数据库**：文档（MongoDB、CouchDB）、键值（Redis、DynamoDB）、实时（Firebase、RethinkDB）、时序（InfluxDB、TimeScale）、列（Cassandra、Base）、图（Neo4j、AWS Neptune）  
- **可扩展性构建**：监控（指标、监控、遥测、可观测性）、优雅降级、限流、背压、负载转移、熔断器、缓解策略、迁移策略、扩展类型  
- **基础基础设施知识**：DevOps、全栈  


## 4.Data Analyst Roadmap
- **坚实基础**：  
  - Excel 分析/报告：常用函数（IF、DATEDIF、VLOOKUP、REPLACE、UPPER/LOWER、CONCAT、AVERAGE、COUNT、SUM、MIN/MAX）  
  - 数据核心概念：收集、清理、探索、可视化、统计分析、机器学习  
- **编程技能**：  
  - 编程语言：Python、R  
  - 数据操作库：Pandas、Dplyr  
  - 数据可视化库：Matplotlib、Ggplot2  
- **数据管理**：  
  - 数据收集：数据库、CSV 文件、API、网络爬虫  
  - 数据清理：处理缺失值、去重、异常值检测、数据转换（Pandas、Dplyr）  
- **数据分析技术**：  
  - 描述性分析：离散度（范围、方差、标准差）、集中趋势（均值、中位数、众数）、分布空间（偏度、峰度）、生成统计、可视化分布  
  - 统计分析：假设检验、相关性分析、回归  
- **数据可视化**：工具（Tableau、Matplotlib、Ggplot2、Power BI、Seaborn）、图表（条形、直方、线、堆叠、散点、热力、漏斗、饼图）  
- **高级主题**：  
  - 机器学习：类型（强化、无监督、监督）、算法（决策树、朴素贝叶斯、KNN、K-Means、逻辑回归）、框架（Tensorflow、Pytorch）  
  - 模型评估技术  
  - 深度学习（可选）：基础、实践（图像识别、NLP）  
- **大数据技术**：概念、存储（Hadoop、Spark）、处理（并行、MPI、MapReduce）  
- **作品集与学习**：Kaggle 竞赛、在线课程（Coursera、edX、Udemy）、社交  


## 5.DevOps Roadmap (中文)
- **学习编程语言**：Python、Ruby、Go、Rust、C、C++、JavaScript/Node.js  
- **理解系统概念**：进程管理、并发、套接字、POSIX、网络概念、Init.d、systemd、I/O、虚拟化、内存、文件系统、screen、tmux  
- **服务器管理**：Linux（SUSE、Debian、Fedora、Ubuntu、CentOS、RHEL）、Unix、Windows、FreeBSD、OpenBSD、NetBSD  
- **终端操作**：Bash、PowerShell、Vim/Nano/Emacs、GCC、make、nmom、iostat、sar、vmstat、uname、df、history  
- **网络、安全与协议**：邮件、HTTP、HTTPS、FTP、SSL/TLS、SSH、DMARC、SPF、反向代理、缓存、防火墙、负载均衡器  
- **Web 服务器**：IIS、Nginx、Apache、Tomcat、Caddy、Linkerd、Consul  
- **CI/CD 工具**：Gitlab CI、Jenkins、GitHub Actions、Travis CI、Bamboo、TeamCity、Azure DevOps、Circle CI  
- **容器化**：Docker、LXC、Ansible、Salt、Kubernetes、Mesos、Docker Swarm、Nomad  
- **基础设施即代码**：Terraform、CloudFormation、Pulumi  
- **监控与日志**：Prometheus、Nagios、Grafana、Zabbix、Datadog、Jaeger、New Relic、AppDynamics、Instana、OpenTracing、Papertrail、Splunk、Graylog、Elastic Stack  
- **云提供商**：AWS、Google Cloud、Azure、Heroku、Digital Ocean、Linode、Vultr  
- **云设计模式**：可用性、数据管理、设计与实现、管理与监控  


## 6.DevOps Roadmap (English)
- **学习编程语言**：Python、Ruby、Go、Rust、JavaScript/Node.js  
- **操作系统**：Windows、Unix（FreeBSD、OpenBSD、NetBSD）、Linux（Ubuntu/Debian、SUSE、RHEL/Derivatives）  
- **终端知识**：脚本（Bash、PowerShell）、编辑器（Vim/Nano/Emacs）  
- **版本控制**：Git、VCS 托管（GitHub、GitLab、Bitbucket）  
- **容器**：Docker、LXC  
- **网络与协议**：FTP/SFTP、DNS、HTTP、HTTPS、SSL/TLS、SSH、OSI 模型、邮件协议（SMTP、IMAP、POP3、域名密钥）  
- **Web 服务器**：Nginx、Caddy、Tomcat、Apache、IIS  
- **无服务器**：AWS Lambda、Cloudflare、Azure Functions、Vercel、Netlify、GCP Functions  
- **云提供商**：AWS、Azure、Google Cloud、Digital Ocean、Alibaba Cloud、Hetzner、Contabo、Heroku  
- **配置管理**：Ansible、Chef、Puppet、 Provisioning（AWS CDK、CloudFormation、Pulumi、Terraform）  
- **CI/CD 工具**：TeamCity、Jenkins、Travis CI、Circle CI、GitLab CI、Drone、GitHub Actions  
- **秘密管理**：Vault、SOPs、云特定工具  
- **制品管理**：Artifactory、Nexus、Cloud Smith、ArgoCD、FluxCD  
- **GitOps**  
- **服务网格**：Istio、Consul、Linkerd、Envoy  
- **日志管理**：Papertrail、Splunk、Loki、Elastic Stack、Graylog  
- **基础设施监控**：Prometheus、Grafana、Zabbix、Datadog  
- **应用监控**：Jaeger、New Relic、Datadog、Prometheus、OpenTelemetry  
- **容器编排**：GKE/EKS/AKS、AWS ECS/Fargate、Docker Swarm、Kubernetes  
- **云设计模式**：可用性、数据管理、设计与实现、管理与监控  


## 7.Flutter Developer Roadmap 2020
- **热身**：IDE（VS Code、Android Studio、IntelliJ）、安装 Flutter（下载 SDK、git clone、Homebrew、Flutter 命令行：create、doctor、precache）  
- **Dart**：stdlib（Futures/Streams、IO/files/networking、Isolates）、语法（空安全、函数、Mixins、生成器/扩展函数）、构建（pubspec.yaml、包管理器）、开发工具（dartfmt、Dart 分析器、调试、Observatory）、ffi、build_runner  
- **UI**：动画（AnimatedController、Opacity、FadeImage、Transform、AnimatedBuilder）、导航（Hero、Transitions、PassingData）、Widget（Stateless/Stateful、无障碍、InheritedWidget）、样式（Material、Cupertino）、资源（字体、图像、音频/视频）  
- **工具**：持续集成（Bitrise、Codemagic、GitHub actions）、QA（Firebase、Crashlytics、Google Play 测试版、TestFlight、App Center）、热重载/重启、Flavors  
- **平台**：存储（共享偏好、SQLite）、通道（插件、编解码器）  
- **原生集成**：iOS（Xcode、Objective-C、Swift、Apple 认证、AppStore）、Android（Android Studio、Java、Kotlin、应用签名、Google Play Store）  
- **包**：pub.dev（Firebase、RxDart、json_serialization、intl、Dio、camera）、git 依赖、本地包  
- **状态管理**：InheritedWidget、Providers+ScopedModel、BLoC、Redux、MobX  


## 8.Go Developer Roadmap 2020
- **先决条件**：Go、Go 模块、SQL 基础  
- **通用开发技能**：Git、HTTP/HTTPS、数据结构与算法、Scrum/Kanban  
- **Web 框架与路由**：CLI、Echo、Beego、Gin、Revel、Chi  
- **ORM**：Gorm、Xorm  
- **数据库**：关系型（SQL Server、MySQL、MariaDB、CockroachDB、PostgreSQL、Azure CosmosDB、Amazon DynamoDB）、NoSQL（MongoDB、Redis、LiteDB、Apache Cassandra、RavenDB、CouchDB）、搜索（ElasticSearch、Solr、Sphinx）  
- **缓存**：GCache、分布式缓存（Go-Redis、GoMemcache）  
- **日志**：系统（Sentry.io、loggly.com）、框架（Jaeger、Zap、ZeroLog、Logrus）  
- **实时通信**：Melody、Centrifugo、graphql-go、gqlgen  
- **API 客户端**：REST（Gentleman、GRequests、Heimdall）、GraphQL  
- **测试**：Mocking（GoMock）、单元（Testify、Ginkgo、GoMega、GoCheck）、行为（GoDog、GoConvey、GinkGo）、集成、端到端（Selenium、Endly）  
- **消息代理**：RabbitMQ、Apache Kafka、ActiveMQ、Azure Service Bus  
- **微服务**：事件驱动（Watermill、Message-Bus）、RPC（框架、Protocol Buffers、gRPC-Go、twirp、gRPC-gateway）  
- **Go 模式**：创建型、结构型、行为型、同步、消息、稳定性  


## 9.Java Developer Roadmap 2021
- **先决条件**：Java、Gradle/Maven/Library、SQL 基础  
- **通用开发技能**：GIT、HTTP/HTTPS、数据结构与算法、Scrum/Kanban  
- **Web 框架与路由**：CLI、Spring、Play Framework、Spark、Jersey、nanohttpd  
- **ORM**：Hibernate、Ebean  
- **数据库**：关系型（SQL Server、MySQL、MariaDB、PostgreSQL、Azure CosmosDB、Amazon DynamoDB）、NoSQL（MongoDB、Redis、LiteDB、Apache Cassandra、RavenDB、CouchDB）、搜索（ElasticSearch、Solr、Sphinx）  
- **缓存**：Caffeine、分布式（Java-Redis、Java-Memcached）、atmosphere、webbit  
- **日志**：系统（ELK Stack、Sentry.io、loggly.com）、框架（log4j、Zap、TinyLog）  
- **实时通信**：GraphQL  
- **API 客户端**：REST（okhttp、retrofit）  
- **测试**：Mocking（Mockito）、单元（JUnit、Citrus Framework、Truth、Assertj）、行为（cucumber-jvm、cukes、JBehave）、集成、端到端（rest-assured、MockServer、Selenium）  
- **消息代理**：RabbitMQ、Apache Kafka、ActiveMQ、Azure Service Bus、Message-Bus、mbassador  
- **微服务**：事件驱动（Apollo、micronaut）、RPC（Protocol Buffers、gRPC-Java、thrift）  
- **Java 模式**：创建型、结构型、行为型、同步、消息、稳定性  



----

## 10.iOS Developer Roadmap

### 编程语言
- **Swift**：基础语法、面向对象、函数式编程、Optionals、闭包、协议、扩展、泛型、内存管理（ARC）
- **Objective-C**：消息传递、类别、协议、内存管理（MRC）、运行时

### 内存管理
- **ARC（自动引用计数）**：强引用、弱引用、无主引用、循环引用
- **MRC（手动引用计数）**：retain、release、autorelease
- **内存泄漏检测**：Instruments、Leaks 工具
- **自动释放池**：@autoreleasepool 的使用

### 多线程与并发
- **GCD（Grand Central Dispatch）**：队列（串行/并发）、Dispatch Group、信号量
- **NSOperationQueue**：操作、依赖、并发控制
- **线程同步**：锁（@synchronized、NSLock）、信号量、条件变量
- **RunLoop**：原理与应用场景

### UIKit 与界面开发
- **UIView 与 UIViewController**：生命周期、视图层次、布局（Auto Layout、Size Classes）
- **界面组件**：UILabel、UIButton、UITextField、UITableView、UICollectionView
- **动画**：Core Animation、UIView 动画、关键帧动画
- **响应者链**：事件传递与处理

### Cocoa Touch 框架
- **Foundation**：数据类型、集合、文件管理、网络基础
- **Core Motion**：加速度计、陀螺仪
- **后台模式**：后台任务、远程通知

### 设计模式与架构
- **MVC（Model-View-Controller）**：经典架构模式
- **MVVM（Model-View-ViewModel）**：数据绑定、响应式编程
- **VIPER**：模块化架构、职责分离
- **依赖注入**：服务定位器、构造函数注入

### 软件架构与项目组织
- **依赖管理**：CocoaPods、Swift Package Manager、Carthage
- **项目结构**：模块化、分层设计
- **版本控制**：Git 工作流

### 测试与质量保证
- **单元测试**：XCTest、测试驱动开发（TDD）
- **UI 测试**：XCUITest、界面自动化
- **性能优化**：Instruments（Time Profiler、Allocations）

### 开发工具与流程
- **Xcode**：Interface Builder、调试、代码分析
- **持续集成**：Jenkins、Fastlane、GitHub Actions
- **代码签名与发布**：Provisioning Profile、App ID、证书管理

### 网络与数据存储
- **网络请求**：URLSession、Alamofire
- **数据解析**：JSON 解析（Codable）、XML 解析
- **本地存储**：Core Data、UserDefaults、文件系统（FileManager）

### 第三方库与生态系统
- **响应式编程**：RxSwift、ReactiveCocoa
- **图片加载**：SDWebImage、Kingfisher
- **路由**：URLRouter、 Coordination

### 算法与数据结构
- **基础算法**：排序、搜索、树、图
- **复杂度分析**：时间复杂度、空间复杂度
- **常见数据结构**：数组、链表、栈、队列、哈希表

### 安全与隐私
- **代码混淆**：Obfuscation
- **数据加密**：Keychain、CommonCrypto
- **隐私权限**：位置、相机、麦克风权限管理

### 持续学习与社区
- **WWDC 视频**：官方技术大会内容
- **技术博客**：Ray Wenderlich、 objc.io
- **开源项目**：参与贡献，学习最佳实践

----

## 11.自然语言处理（NLP）Roadmap
- **基础模型**  
  - 序列模型：n-gram、Katz-Backoff Model  
  - 循环模型：RNN、LSTM、GRU、Cell State、Vanishing Gradient  
  - 卷积模型：TextCNN、DCNN（Kernel Size = n-gram，Channel = 感知数量）  
  - 递归模型：Syntactically-Unied RNN、RTNN、Matrix-Vector RNN  
- **任务**  
  - POS 标签、解析、命名实体识别、共指消解、情感分析、机器翻译、问答、阅读理解、文本生成、摘要、对话系统、语言建模  
  - 评估指标：BLEU Score、ROUGE Score、Perplexity  
- **分布式表示**  
  - 词表示：NNLM、Embedding（Word Embedding、Character Embedding）  
  - 共现矩阵  
- **语言模型**  
  - 概率计算：P(w_i | w_{i-1})  
- **编码器-解码器模型**  
  - 任务：机器翻译、摘要、源-目标、OOV 问题解决、复制机制  
  - 搜索策略：Greedy Search、Beam Search  
- **词表示到上下文表示**  
  - 词嵌入：CoVe、ELMo、2 Layers LSTM（预训练嵌入）  
- **最先进模型**  
  - 预训练-微调：Deep Transformer、Transformer Based Model、OpenAI-GPT、GPT-2、RoBERTa、DistilBERT  
  - BERT：掩码语言模型、下一句预测（NSP）、通用转换器、归纳 RNN 偏差、零样本学习、大批量训练  
  - XLNet：段级递归与状态复用、Transformer XL、置换语言模型、段递归机制  


## 12.Python 开发者 Roadmap
- **学习基础**  
  - 基础语法、变量与数据类型、条件语句、循环  
  - 类型转换、异常、函数与内置函数、列表/元组/集合/字典  
- **数据结构与算法**  
  - 数组与链表、哈希表、堆/栈/队列、二叉搜索树、递归、排序算法  
- **面向对象编程**  
  - 类、继承、方法与 Dunder 方法  
- **并发**  
  - 多进程、异步、GIL、线程  
- **包管理器**  
  - PyPI、Pip、Conda、uv、Poetry  
- **模块与高级特性**  
  - 内置/自定义模块、Lambda、装饰器、迭代器、正则表达式  
- **学习框架**  
  - 同步框架：Plotly Dash、Pyramid、Fast API、Django、Flask  
  - 异步框架：gevent、aiohttp、Tornado、Sanic  
- **静态类型**  
  - typing、mypy、pyright、pyre、Pydantic  
- **代码格式化**  
  - yapf、black、ruff、Sphinx（文档）  
- **测试**  
  - tox、nose、unittest/pyUnit、doctest、pytest  


## 13.React 开发者 Roadmap（2019）
- **基础**  
  - HTML、CSS、JS 基础（DOM 操作、AJAX、ECMAScript 6+）  
- **通用开发技能**  
  - Git（版本控制）、HTTP/HTTPS、数据结构与算法  
- **React 核心**  
  - 包管理器：npm、Yarn、pnpm  
  - 构建工具：Webpack、Rollup、Parcel  
  - 任务运行器：npm 脚本、gulp  
- **状态管理**  
  - Redux、MobX、异步操作（Redux Thunk、Redux Saga、Redux Observable）、rematch、reselect  
- **样式**  
  - CSS 预处理器：Sass/SCSS、PostCSS、Less、Stylus  
  - CSS 框架：Bootstrap、Materialize、Bulma、Semantic UI  
  - CSS in JS：Styled Components、Radum、Emotion、Aphrodite  
  - CSS 架构：BEM、CSS Modules、Atomic、OOCSS、SMACSS、SUITCSS  
- **路由**  
  - React-Router、Router5、Redux-First Router、Reach Router  
- **类型检查**  
  - PropTypes、TypeScript、Flow  
- **API 客户端**  
  - REST（fetch、SuperAgent、axios）、GraphQL（Apollo、Relay、urql）  
- **测试**  
  - 单元测试：Jest、Enzyme、Sinon、Mocha、Chai、Ava、Jasmine  
  - 集成测试：Karma、Selenium、Cypress、Puppeteer、Nightwatch.js  
- **实用工具库**  
  - Lodash、Moment、classnames、Numeral、RxJS、ImmutableJS、Ramda  
- **国际化（i18n）**  
  - React Intl、React i18next  
- **服务端渲染（SSR）**  
  - Next.js、After.js、Rogue、React on Rails  
- **移动端开发**  
  - React Native、NativeScript、Flutter、Ionic  
- **桌面端开发**  
  - Electron、Proton Native、React Native Windows  


## 14.Rust Web 开发者 Roadmap（2021）
- **先决条件**  
  - Rust 语言（The Book、Rustlings、Rust by Example、Async Programming）  
  - Rustup、Cargo、Crates（包管理）  
- **通用开发技能**  
  - CLI（clap、structopt、argh）、认证（jsonwebtoken、cookies）、日志（log、env_logger、flexi_logger、tracing、slog、fern、log4rs）  
- **Web 框架**  
  - actix-web、gotham、nickel、rocket、tide、tower-web、warp  
- **ORM**  
  - diesel、rustorm  
- **数据库**  
  - 关系型：MySQL、PostgreSQL、MariaDB、SQLite、CockroachDB  
  - NoSQL：MongoDB、Redis、RocksDB  
- **日期与时间**  
  - chrono  
- **缓存**  
  - redis、sled  
- **gRPC 框架**  
  - grpc、grpcio、tonic  
- **GraphQL 框架**  
  - juniper  
- **HTTP 客户端**  
  - reqwest、hyper、curl、delay-timer  
- **测试**  
  - 内置测试、yew  
- **任务调度**  
  - clockwerk  
- **前端开发**  
  - wasm-bindgen、js-sys、web-sys  
- **好用的 crate**  
  - validator、serde、r2d2、lettre  


## 15.后端开发 Roadmap
- **互联网与基础**  
  - 互联网工作原理、HTTP、浏览器机制、DNS、域名、托管  
- **基础前端知识**  
  - HTML、CSS、JavaScript、内存管理、进程间通信、I/O 管理、POSIX 基础  
- **操作系统与通用知识**  
  - 终端用法、进程管理、线程与并发、基本终端命令（grep、awk、sed 等）  
- **编程语言**  
  - Rust、Go、Java、C#、PHP、JavaScript、Python、Ruby  
- **版本控制**  
  - Git 基本用法、仓库托管服务（GitHub、GitLab、Bitbucket）  
- **数据库**  
  - 关系型：PostgreSQL、MySQL、MariaDB、MS SQL、Oracle  
  - NoSQL：MongoDB、RethinkDB、CouchDB、DynamoDB  
- **API**  
  - REST、JSON API、SOAP、HATEOAS、Open API/Swagger、身份验证  
- **缓存**  
  - Redis、Memcached、CDN  
- **网页安全知识**  
  - HTTPS、CORS、SSL/TLS、OWASP 风险、MD5/SHA/scrypt/bcrypt  
- **测试**  
  - 集成测试、单元测试、功能测试、CI/CD  
- **设计和开发原则**  
  - GOF 设计模式、SOLID、KISS、YAGNI、DRY、搜索引擎（Elasticsearch、Solr）  
- **架构模式**  
  - 单片应用、微服务、SOA、CQRS、无服务器化  
- **消息代理**  
  - RabbitMQ、Kafka、Apollo、Relay Modern  
- **GraphQL 与 WebSockets**  
  - GraphQL、WebSockets  
- **Web 服务器**  
  - Nginx、Apache、Caddy、MS IIS  
- **为可扩展性构建**  
  - 缓解策略（优雅降级、限流、背压、负载转移、熔断器）、水平/垂直扩展、可观测性  


## 16.前端开发 Roadmap
- **互联网与基础**  
  - 互联网工作原理、HTTP、浏览器机制、DNS、域名、托管  
- **HTML/CSS/JS 基础**  
  - HTML 基础、语义化 HTML、表单与验证、CSS 基础、布局（浮动、定位、Flexbox、Grid）、JavaScript（DOM 操作、ES6+、模块化、Fetch/Ajax）  
- **版本控制**  
  - Git 基本操作、仓库托管（GitHub、GitLab、Bitbucket）  
- **Web 安全知识**  
  - HTTPS、CSP、CORS、OWASP 风险  
- **包管理工具**  
  - npm、yarn  
- **构建工具**  
  - 任务运行器（npm scripts、Gulp）、模块打包（Webpack、Rollup、Parcel）  
- **现代 CSS**  
  - BEM、OOCSS、SMACSS、Styled Components、CSS Modules、Styled JSX、Emotion、Radum、Glamorou  
- **Web 组件**  
  - HTML 模板、自定义元素、Shadow DOM  
- **CSS 框架**  
  - Reactstrap、Material UI、Tailwind CSS、Chakra UI、Bootstrap、Materialize CSS、Bulma  
- **测试**  
  - Jest、react-testing-library、Cypress、Enzyme、Mocha、Chai、Ava、Jasmine  
- **渐进式网页应用（PWA）**  
  - Storage、Web Sockets、Service Workers、定位、通知、支付、证书  
- **服务端渲染（SSR）**  
  - Next.js、After.js、Universal、Nuxt.js  
- **GraphQL**  
  - Apollo、Relay Modern  
- **移动端应用开发**  
  - React Native、NativeScript、Flutter、Ionic  
- **桌面端应用开发**  
  - Electron、Proton Native  
- **WebAssembly**  
  - WASM 原理与使用  


## 17.数据工程师 Roadmap（2021）
- **CS 基础**  
  - 计算机工作原理、互联网工作原理、Git 版本控制、CLI、Vim、Shell 脚本、Cronjobs  
- **编程语言**  
  - Python（推荐）、Java、Scala  
- **测试**  
  - 单元测试、集成测试、功能测试  
- **数据库基础**  
  - SQL（规范化、ACID 事务）、关系型数据库（MySQL、PostgreSQL、MariaDB、Amazon Aurora）、非关系型数据库（MongoDB、Elasticsearch、Apache CouchDB、Azure CosmosDB）  
- **数据仓库**  
  - AWS S3、Azure Blob Storage、Google Cloud Storage、Snowflake、Presto、Apache Hive、Amazon Redshift、Google BigQuery、Azure Synapse、ClickHouse  
- **集群计算基础**  
  - Apache Hadoop、HDFS、MapReduce、Lambda & Kappa 架构、Managed Hadoop、Amazon EMR、Google Dataproc、Azure Data Lake  
- **数据处理**  
  - 批处理：Apache Pig、Apache Arrow、data build tool  
  - 混合：Apache Spark、Apache Beam、Apache Flink、Apache NiFi  
  - 流处理：Apache Kafka、Apache Storm、Apache Samza、Amazon Kinesis  
- **消息**  
  - Amazon SNS & SQS、Google PubSub、Azure Service Bus、RabbitMQ、Apache ActiveMQ  
- **工作流调度**  
  - Apache Airflow、Google Composer、Apache Oozie、Luigi  
- **监控数据管道**  
  - Prometheus、Datadog、Sentry、StatsD  
- **网络**  
  - 协议（HTTP/HTTPS、TCP、SSH、IP、DNS）、防火墙、VPN、VPC  
- **基础设施即代码**  
  - 容器（Docker、LXC）、容器编排（Kubernetes、Docker Swarm、Apache Mesos、GKE）、基础设施即代码（Terraform、Pulumi、AWS CDK）  
- **CI/CD**  
  - GitHub Actions、Jenkins  
- **身份与访问管理**  
  - Active Directory、Azure Active Directory  
- **数据安全与隐私**  
  - 合规性、加密、密钥管理、数据治理与完整性  


## 18.测试工程师 Roadmap
- **基础概念**  
  - STLC（软件测试生命周期）、SDLC（软件开发生命周期）、TDD（测试驱动开发）、RPA（机器人流程自动化）  
- **测试策略与类型**  
  - 手动测试（核心）、数据驱动测试、兼容性测试、验证与验证（Verification/Validation）  
- **测试规划**  
  - 范围、团队、策略定义  
- **测试用例与场景**  
  - 创建测试用例（翻译用户操作）、报告（关键输出）  
- **自动化测试**  
  - API 测试（CLI 验证后端/DB）、浏览器测试（UI/e2e，如 Cypress）、移动应用测试（原生自动化框架）  
- **非功能测试**  
  - 负载与性能测试  
- **测试管理**  
  - Testlink、Testrail  


## 19.人工智能（AI）Roadmap
- **基础**  
  - 线性代数（矩阵）、数据库基础（关系型/非关系型）、Python 基础（虚拟环境、表达式、变量、数据结构、函数、包安装）、数据格式（JSON、XML、RegEx）  
- **数据科学家路径**  
  - 概率论（分布、贝叶斯定理、期望、方差、假设检验）、统计学（置信区间、蒙特卡洛、中心极限定理）、可视化（Matplotlib、Seaborn、Tableau、Dash）、机器学习（监督/无监督/强化学习：回归、分类、聚类、降维、关联规则）  
- **数据工程师路径**  
  - 数据发现、源与获取、集成、融合、转换与丰富（OpenRefine）、数据湖 vs 数据仓库、Docker 化 Python 应用  
- **机器学习路径**  
  - 概念（输入/属性、成本函数、过拟合/欠拟合、训练/验证/测试数据、精确率/召回率、偏差/方差）、监督学习（回归、分类）、无监督学习（聚类、降维）、强化学习（Q-Learning、情感分析）、工具（scikit-learn、spacy）  
- **深度学习路径**  
  - 神经网络（前馈、自编码器、CNN、GAN、RNN、LSTM、GRU）、损失函数、激活函数、权重初始化、梯度问题、池化、Transformer（编码器/解码器、注意力）、库（PyTorch、TensorFlow）、优化器（SGD、Momentum、Adam）、训练技巧（学习率调度、批量归一化、正则化、迁移学习、早停、Dropout）、工具（Tensorboard、MLFlow）、模型优化（量化、蒸馏）、架构搜索（NAS）  
- **大数据工程师路径**  
  - 架构模式（水平/垂直扩展、MapReduce、数据复制、Job Tracker）、工具（Hadoop、Spark、HDFS、Sqoop、Pig、Flume、Scribe、Elastic Stack、Avro、Flink、Storm、Dask、Numba、Onnx）、数据库（Cassandra、MongoDB、Neo4j）、可扩展性（ZooKeeper、Kubernetes、云服务：AWS SageMaker、Google ML Engine、Azure ML Studio）  

---

