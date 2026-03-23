---
title: 本地知识库聊天助手（基于DeepSeek模型）
categories: projects
archive: true
date: 2025-02-14 18:10:09
tags:
---

---

## **本地知识库聊天助手项目文档**

------

## 项目概述

本项目旨在开发一个本地部署的智能知识库聊天助手，用户可以通过上传企业文档（如 PDF、Word 等），并通过自然语言提问来查询文档中的信息。系统使用本地部署的大语言模型 **Ollama** 提供语义理解，结合文档的向量化检索技术（使用 **FAISS**）来提高问答的准确性和效率。整个项目的架构充分考虑了数据隐私与安全，支持离线操作。

## 项目功能

- **文档上传与处理**：用户可以上传 PDF、Word 等格式的文档，系统会自动解析并提取文本内容。
- **本地语义理解**：通过 **Ollama** 本地化部署的语言模型，理解用户提问并生成合理的回答。
- **向量化检索**：文档内容经过**Sentence-BERT**向量化处理后，存储在 **FAISS** 索引中，通过向量相似度检索最相关的答案。
- **用户交互**：提供一个简单的前端界面，用户可以方便地上传文档、输入问题并查看系统的回答。

### 🧠 RAG 架构图

```css
css复制编辑                 🧑‍💻 用户输入提问
                        │
                        ▼
          ┌────────────────────────────┐
          │      文本向量化模块         │ ← Sentence-BERT 
          └────────────────────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │      FAISS 向量数据库检索      │ ← 本地知识库构建的向量索引
         └──────────────────────────────┘
                        │
           Top-k 相关文档片段返回
                        ▼
┌────────────────────────────────────────────┐
│         构造 Prompt（上下文 + 问题）        │
└────────────────────────────────────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │   本地部署大模型生成模块（Ollama）
         └──────────────────────────────┘
                        │
                        ▼
                  🎯 最终回答输出
```

## 技术选型与详细介绍

### 1. **后端框架：Python + Flask**

#### **Flask 框架概述：**

- **Flask** 是一个用 Python 编写的轻量级 Web 框架。它提供了灵活的路由和丰富的扩展，可以快速构建 RESTful API 服务。
- Flask 不强制使用特定的数据库或前端框架，能够根据项目需求灵活调整。

#### **技术选择原因：**

- **易用性**：Flask 的学习曲线较低，适合小型和中型应用的快速开发。
- **扩展性**：Flask 可以通过添加第三方库来扩展功能，比如数据库支持、用户认证、CORS 支持等，非常适合我们需要构建的简单且高效的 API 服务。
- **与 Python 的兼容性**：Flask 与 Python 科学计算库（如 Pandas、NumPy）兼容性好，便于与机器学习模型结合使用。

#### **功能应用：**

- 提供一个 API 接口，用于接收用户上传的文档文件。
- 提供 API 接口，接收用户提问并返回通过 **Ollama** 生成的答案。
- 提供前端页面支持的接口。

#### **示例代码：**

```python
from flask import Flask, request, jsonify
import ollama
import faiss
import numpy as np

app = Flask(__name__)

# 假设已有一个 FAISS 向量索引
index = faiss.IndexFlatL2(512)  # 512 维的向量索引

@app.route('/upload', methods=['POST'])
def upload_document():
    file = request.files['document']
    # 处理文件并提取文本（PDF、Word 等）
    text = process_document(file)
    # 将文本向量化并存储到 FAISS 索引中
    vectors = vectorize_text(text)
    index.add(vectors)
    return jsonify({"message": "Document uploaded successfully!"})

@app.route('/ask', methods=['POST'])
def ask_question():
    user_question = request.json.get('question')
    question_vector = vectorize_text(user_question)
    # 在 FAISS 索引中搜索最相似的文档片段
    _, indices = index.search(np.array([question_vector]), 1)
    # 根据索引返回相关文档
    answer = retrieve_answer_from_index(indices)
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True)
```

------

### 2. **本地语言模型：Ollama**

#### **Ollama 概述：**

- **Ollama** 是一个支持多种大型语言模型的本地推理工具，提供了简易的接口来调用预训练的语言模型。
- 使用 Ollama 可以方便地在本地机器上部署和运行如 LLaMA、Mistral 等大语言模型，避免了使用云服务的隐私问题。

DeepSeek 是由国内团队开源的一系列大语言模型，分为几个方向：

- **DeepSeek-LLM**：通用对话、知识问答
- **DeepSeek-Coder**：代码理解与生成
- **DeepSeek-VL**：多模态，支持图文理解

具有较强的中文理解能力；本地部署无版权问题；与 ChatGPT 效果相近，但更适合中文和私有化部署

#### **技术选择原因：**

- **隐私保护**：所有数据和模型都部署在本地，确保用户的文档和问题不会被上传至云端，提升数据隐私性。
- **高效性**：Ollama 提供简洁的 API，能够高效地调用语言模型进行推理，响应速度快，适合构建问答系统。
- **支持多种模型**：Ollama 支持多种开源预训练模型，如 LLaMA、Mistral 等，能够根据项目需求选择最合适的模型。

#### **功能应用：**

- 使用 Ollama 对用户的提问进行推理，生成合理的回答。
- 集成 Ollama 模型到 Flask 后端，处理提问并与向量检索结果结合提供精确答案。

#### **示例代码：**

```python
import ollama

def get_answer_from_ollama(question):
    # 调用 Ollama 模型生成回答
    response = ollama.chat(prompt=question)
    return response
```

------

### 3. **文档处理模块：PDF、Word 等格式的处理**

#### **文档处理概述：**

- **文档处理模块**负责从上传的文件（如 PDF、Word）中提取文本，并进行清理和预处理，保证提取的文本可以用于后续的向量化和检索操作。
- 这一步非常重要，因为清洗后的文本会直接影响后续语义检索的质量。

#### **技术选型：**

- **pdfminer.six**：用于从 PDF 文件中提取文本。
- **python-docx**：用于从 Word 文件中提取内容。
- **pypandoc**：用于转换其他格式文件（如 Markdown、HTML）为纯文本格式。
- **正则表达式和分段技术**：处理多余的内容（如页码、标题、页眉等），分段或按一定长度切分文档。

#### **功能应用：**

- 提取 PDF、Word 等格式的文档内容，清理无关信息，如页码、标题等。
- 对文档中的内容进行结构化处理，确保文本内容准确，适合向量化处理。

#### **示例代码：**

```python
from pdfminer.high_level import extract_text
from docx import Document

def extract_text_from_pdf(file_path):
    return extract_text(file_path)

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    text = '\n'.join([para.text for para in doc.paragraphs])
    return text
```

------

### 4. **向量化检索：FAISS**

#### **FAISS 概述：**

- **FAISS (Facebook AI Similarity Search)** 是一个由 Facebook AI 研究团队开发的高效相似度搜索库。它是一个用于高维向量数据检索的开源库，专门设计来进行大规模向量搜索任务，能够处理数百万甚至数十亿的向量数据。
- FAISS 通过高效的近似最近邻算法（ANN），在大量向量数据中快速找到与查询向量最相似的向量，广泛应用于图像检索、语音识别、文本检索等任务。适用于本项目中的文档检索。

#### **技术选择原因：**

- **高效性**：FAISS 提供高效的相似度搜索算法，能够处理数百万级别的文档向量，支持多维向量索引。
- **灵活性**：FAISS 支持不同类型的索引结构，如平面索引、倒排索引等，可以根据需求选择最合适的索引方式。

#### **功能应用：**

- 对上传的文档内容进行向量化处理，将这些向量添加到 FAISS 索引中，使用 FAISS 建立向量数据库。
- 当用户提问时，系统会将问题向量化，并在 FAISS 索引中查找最相似的文档内容，提升检索精度。

#### **示例代码：**

```python
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# 使用预训练模型进行文本向量化
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def encode_texts(texts):
    return model.encode(texts)

# 构建 FAISS 索引
def build_faiss_index(vectors):
    index = faiss.IndexFlatL2(vectors.shape[1])  # 创建一个 L2 距离的索引
    index.add(vectors)  # 向索引添加向量
    return index

# 搜索相似文本
def search_similar(query_vector, index, k=5):
    _, indices = index.search(np.array([query_vector]), k)
    return indices
```

------

### 5. **前端：Vue3 + Element Plus**

#### **Vue3 和 Element Plus 概述：**

- **Vue3** 是一种现代的 JavaScript 框架，支持组件化开发、响应式数据绑定等特性，适用于构建交互性强的 Web 应用。
- **Element Plus** 是基于 Vue3 的 UI 组件库，提供了丰富的 UI 元素，如按钮、输入框、表格等，能够帮助快速构建高质量的用户界面。

#### **功能应用：**

- 提供用户友好的前端界面，用户可以方便地上传文档、提问问题并查看回答。
- 支持用户输入问题，后台通过 Flask 调用 Ollama 模型和向量检索返回答案。

#### **示例代码：**

```vue
<template>
  <div>
    <el-upload
      action="/upload"
      :on-success="handleUploadSuccess"
      :before-upload="beforeUpload"
    >
      <el-button>上传文档</el-button>
    </el-upload>
    <el-input v-model="question" placeholder="请输入问题"></el-input>
    <el-button @click="askQuestion">提问</el-button>
    <el-card v-if="answer">
      <p>{{ answer }}</p>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      question: '',
      answer: '',
    };
  },
  methods: {
    async askQuestion() {
      const response = await this.$http.post('/ask', { question: this.question });
      this.answer = response.data.answer;
    },
    handleUploadSuccess() {
      this.$message.success('文件上传成功');
    },
    beforeUpload(file) {
      // 检查文件类型
      return file.type === 'application/pdf';
    }
  }
};
</script>
```

------





### 五、应用场景

为企业内部人员提供了便捷的知识库查询工具，大幅提高了工作效率，减少了人工查询的时间成本。

本地部署方案确保了数据的安全性和隐私性，满足了严格的企业级需求。

提供了灵活的扩展性，系统可根据不同需求进行二次开发和集成，适用于各类行业场景（如企业管理、法律咨询、教育等）。

| 场景                | 描述                                     |
| ------------------- | ---------------------------------------- |
| 💼 企业内部文档助手  | 向系统提问公司规章、流程说明、产品文档   |
| 🧑‍🎓 教育知识库助教   | 学生上传课程资料，快速定位重点、提问复习 |
| 🏛️ 政策法规问答平台  | 政府机关内部文件语义搜索与问答           |
| 📑 法律/合同文档助手 | 快速理解长篇合同、政策材料内容含义       |

### 六、扩展功能（以后）

- ✅ 多用户登录系统，支持知识权限管理
- ✅ 增加 Web 界面（Flask + Vue）支持上传/提问/反馈
- ✅ 用户提问日志记录与反馈优化模型
- ✅ 与企业 OA 系统或微信群机器人打通，实现消息集成



### 七、逻辑框架

1. **项目目标：** 离线构建智能知识问答助手，服务特定用户/企业场景
2. **为何选用本地模型：** 数据私密、可控稳定、无需联网
3. **技术结构：** 文档预处理 ➜ 向量化 ➜ DeepSeek 回答
4. **关键亮点：** 支持多格式文档、中文向量搜索、部署灵活
5. **扩展方向：** 聊天增强、问答评分、语音问答、多用户管理





✅ 为什么我们要将文档转成向量？

✅ 本地模型和云端模型相比有什么优势？

✅ RAG 是什么，它比直接问 ChatGPT 好在哪？

✅ FAISS + Embedding 是解决搜索问题的“脑子”

✅ DeepSeek 是我们离线“嘴巴”——懂中文、能回答



---

## **Sentence-BERT 详细介绍**

**Sentence-BERT**（简称 **SBERT**）是一个基于 BERT（Bidirectional Encoder Representations from Transformers）的改进版本，专门用于生成句子的向量表示（即嵌入）。BERT 本身是一个强大的预训练语言模型，可以生成单词的向量表示，但它的设计是为了处理单个单词的上下文，而不是生成句子的整体语义向量。为了有效地对句子进行表示，**Sentence-BERT** 提出了一个改进的方法，通过对 BERT 进行微调，使其可以更好地生成句子的嵌入。

#### **1. 背景**

BERT 是通过上下文学习单词的表示，主要关注的是 **Masked Language Modeling (MLM)** 和 **Next Sentence Prediction (NSP)**，这使得 BERT 非常适合处理单词和短文本的上下文。但在实际应用中，我们常常需要对整个句子、段落或文档进行表示。BERT 的默认输出是 **每个 Token（单词或子词）的向量**，而不是对整个句子的语义进行编码。

为了解决这个问题，**Sentence-BERT** 通过以下方式对 BERT 进行优化：

1. **句子对微调（Siamese Network 或 Triplet Network）：**
   - **Siamese Network** 采用双塔结构，将同一文本的两个版本（如原始句子和修改过的句子）输入到 BERT 中，通过相似度来训练模型，使得模型学习到能将语义相似的句子映射到相近的向量空间。
   - **Triplet Network** 则使用三元组训练，增加了一个负样本，进一步提升句子表示的区分度。
2. **通过特定任务进行微调：**
   - 例如，Sentence-BERT 通常通过 **自然语言推理（NLI）** 和 **对比学习任务**（比如通过训练相似句子的对比）进行优化，从而提高生成句子向量时的准确性。
3. **输出固定维度的句子向量：**
   - 在传统的 BERT 中，输入的是词或子词的向量，输出的是 **Token Embeddings**。而 Sentence-BERT 将句子转化为一个固定维度的向量（通常是 768 或 512 维），便于后续的相似度计算、检索等任务。

#### **2. Sentence-BERT 的优势**

- **高效的句子表示：** 在原始 BERT 中，为了获得句子嵌入，通常需要对整个句子进行 [CLS] token 以及其他 tokens 的向量处理，而 **Sentence-BERT** 通过微调提供了更简洁高效的生成句子向量的方法。
- **适合文本匹配：** **Sentence-BERT** 特别适用于句子对任务（如文本匹配、语义相似度计算），能够高效地对句子进行编码并进行对比。
- **高效的相似度检索：** 由于 Sentence-BERT 输出的是固定维度的向量，因此可以用来构建向量检索系统，利用如 FAISS 等工具快速进行检索。

#### **3. Sentence-BERT 的应用场景**

- **语义文本相似度计算：** 判断两段文本之间的语义相似度，广泛应用于搜索引擎、问答系统、推荐系统等领域。
- **文本匹配任务：** 比如句子对分类任务、语义相似度评分、翻译质量评估等。
- **信息检索：** 用于基于文本向量进行文档检索，如根据问题查询最相关的文档或答案。
- **聚类分析：** 将文本转换为向量后，可以利用聚类算法对相似的文本进行分组。

------

### **4. Sentence-BERT 使用**

#### **安装 Sentence-BERT**

```bash
pip install sentence-transformers
```

#### **基本用法：**

1. **加载模型：** 可以加载 `Sentence-BERT` 提供的多个预训练模型，也可以使用自己的数据进行微调。

```python
from sentence_transformers import SentenceTransformer

# 加载预训练模型
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
```

1. **文本向量化：**

```python
# 示例句子
sentences = ["我喜欢自然语言处理", "深度学习在AI领域应用广泛"]

# 使用 Sentence-BERT 将文本转化为向量
sentence_embeddings = model.encode(sentences)

# 输出句子嵌入
for i, sentence in enumerate(sentences):
    print(f"Sentence: {sentence}")
    print(f"Embedding: {sentence_embeddings[i]}")
```

1. **文本相似度计算：**
   - 通过计算两个句子向量的 **余弦相似度** 来判断它们的相似度。

```python
from sklearn.metrics.pairwise import cosine_similarity

# 计算相似度
similarity = cosine_similarity([sentence_embeddings[0]], [sentence_embeddings[1]])
print(f"Cosine similarity: {similarity[0][0]}")
```

1. **保存与加载模型：**
   - **保存模型：**

```python
model.save('my_model')
```

- **加载已保存的模型：**

```python
model = SentenceTransformer('my_model')
```

#### **5. 微调 Sentence-BERT**

Sentence-BERT 还可以通过特定的数据集进行微调。比如，您可以使用一个包含成对句子及其相似度标签的数据集来微调模型，使得模型生成的句子向量更加符合您的需求。

1. **准备数据：** 你需要准备一对句子和它们的相似度标签。
   - 数据格式如下：每对句子有一个标签，通常是一个 0 到 1 之间的值，表示这对句子的相似度。
2. **使用 `SentenceTransformer` 进行微调：**

```python
from sentence_transformers import SentenceTransformer, SentencesDataset, losses
from torch.utils.data import DataLoader

# 加载预训练模型
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# 准备微调数据
train_samples = [
    ('我喜欢自然语言处理', '自然语言处理非常有趣', 0.9),
    ('我喜欢看电影', '我喜欢阅读书籍', 0.3),
    # 更多的句子对和相似度
]

# 创建数据集
train_data = SentencesDataset(train_samples, model)
train_dataloader = DataLoader(train_data, batch_size=16, shuffle=True)

# 使用对比损失进行训练
train_loss = losses.CosineSimilarityLoss(model)
model.fit(train_objectives=[(train_dataloader, train_loss)], epochs=1, warmup_steps=100)
```

1. **评估与推理：**

微调后的模型可以通过 `encode` 方法生成句子向量，适用于相似度计算、文本检索等任务。

------

