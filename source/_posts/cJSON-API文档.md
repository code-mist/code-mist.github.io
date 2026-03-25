---
title: cJSON-API文档
date: 2026-1-3
categories:
description: cJSON API文档方便查阅 根据Github仓库的代码进行生成
---





# cJSON API 文档

## 1. 简介
cJSON 是一个超轻量级的、用 C 语言编写的 JSON 解析器和生成器。它采用 MIT 许可证发布，可以轻松地集成到任何 C 语言项目中。cJSON 的核心是一个递归下降解析器，能够将 JSON 文本转换为内存中的 `cJSON` 对象结构，也可以将 `cJSON` 结构反向输出为 JSON 字符串。

本文档详细描述了 cJSON 的所有公开 API 函数、数据类型、宏以及使用注意事项。

## 2. 数据类型
### 2.1 `cJSON` 结构体
`cJSON` 结构体是 cJSON 的核心，用于表示一个 JSON 值（可以是对象、数组、字符串、数字等）。

```c
typedef struct cJSON
{
    struct cJSON *next;      /* 指向链表中的下一个元素，用于遍历数组或对象 */
    struct cJSON *prev;      /* 指向链表中的上一个元素，用于遍历数组或对象 */
    struct cJSON *child;     /* 指向子节点（数组或对象的第一个元素） */

    int type;                /* 当前节点的类型（见下文类型宏） */

    char *valuestring;       /* 如果 type 为 cJSON_String 或 cJSON_Raw，则指向字符串值 */
    int valueint;            /* 已废弃，请使用 cJSON_SetNumberValue 设置数值 */
    double valuedouble;      /* 如果 type 为 cJSON_Number，则为双精度浮点数值 */

    char *string;            /* 当前节点的名称（当作为对象成员时有效） */
} cJSON;
```

### 2.2 `cJSON_bool` 类型
cJSON 使用 `int` 作为布尔类型，通常定义为：

```c
typedef int cJSON_bool;
#define true  ((cJSON_bool)1)
#define false ((cJSON_bool)0)
```

### 2.3 `cJSON_Hooks` 结构体
用于自定义内存管理函数。

```c
typedef struct cJSON_Hooks
{
    void *(CJSON_CDECL *malloc_fn)(size_t sz);   /* 自定义 malloc 函数 */
    void (CJSON_CDECL *free_fn)(void *ptr);      /* 自定义 free 函数 */
} cJSON_Hooks;
```

## 3. 常量与宏
### 3.1 类型标志
| 宏 | 值 | 描述 |
| --- | --- | --- |
| `cJSON_Invalid` | `0` | 无效类型 |
| `cJSON_False` | `1<<0` | JSON `false` |
| `cJSON_True` | `1<<1` | JSON `true` |
| `cJSON_NULL` | `1<<2` | JSON `null` |
| `cJSON_Number` | `1<<3` | JSON 数字 |
| `cJSON_String` | `1<<4` | JSON 字符串 |
| `cJSON_Array` | `1<<5` | JSON 数组 |
| `cJSON_Object` | `1<<6` | JSON 对象 |
| `cJSON_Raw` | `1<<7` | 原始 JSON（不转义） |
| `cJSON_IsReference` | `256` | 标记为引用（不释放内存） |
| `cJSON_StringIsConst` | `512` | 标记字符串为常量（不释放） |


### 3.2 版本信息
```c
#define CJSON_VERSION_MAJOR 1
#define CJSON_VERSION_MINOR 7
#define CJSON_VERSION_PATCH 19
```

### 3.3 嵌套与循环限制
+ `CJSON_NESTING_LIMIT`：解析时允许的最大嵌套深度，默认 1000，防止栈溢出。
+ `CJSON_CIRCULAR_LIMIT`：复制时检测循环引用的深度限制，默认 10000。

## 4. 函数分类说明
### 4.1 版本信息
#### `cJSON_Version`
```c
CJSON_PUBLIC(const char*) cJSON_Version(void);
```

**描述**：返回 cJSON 库的版本字符串，格式为 `"主版本.次版本.修订号"`。

**返回值**：指向静态版本字符串的指针。

### 4.2 内存管理钩子
#### `cJSON_InitHooks`
```c
CJSON_PUBLIC(void) cJSON_InitHooks(cJSON_Hooks* hooks);
```

**描述**：设置自定义的内存分配和释放函数。如果传入 `NULL`，则恢复使用标准库的 `malloc`/`free`/`realloc`。

**参数**：

+ `hooks`：指向 `cJSON_Hooks` 结构的指针，可以包含自定义的 `malloc_fn` 和 `free_fn`。若某字段为 `NULL`，则使用默认函数。

### 4.3 解析 JSON
#### `cJSON_Parse`
```c
CJSON_PUBLIC(cJSON *) cJSON_Parse(const char *value);
```

**描述**：将以 null 结尾的 JSON 字符串解析为 `cJSON` 对象。

**参数**：

+ `value`：要解析的 JSON 字符串。

**返回值**：成功返回指向根 `cJSON` 对象的指针，失败返回 `NULL`。

#### `cJSON_ParseWithLength`
```c
CJSON_PUBLIC(cJSON *) cJSON_ParseWithLength(const char *value, size_t buffer_length);
```

**描述**：解析指定长度的 JSON 字符串（不需要以 null 结尾）。

**参数**：

+ `value`：JSON 字符串。
+ `buffer_length`：字符串长度。

**返回值**：成功返回根对象指针，失败返回 `NULL`。

#### `cJSON_ParseWithOpts`
```c
CJSON_PUBLIC(cJSON *) cJSON_ParseWithOpts(const char *value, const char **return_parse_end, cJSON_bool require_null_terminated);
```

**描述**：解析 JSON 字符串，并提供额外选项。

**参数**：

+ `value`：JSON 字符串。
+ `return_parse_end`：如果非 `NULL`，解析结束后将指向字符串中最后一个解析字符的位置；若解析失败，则指向错误位置。
+ `require_null_terminated`：如果为真，则要求 JSON 字符串必须以 `\0` 结尾且之后无多余字符。

**返回值**：成功返回根对象指针，失败返回 `NULL`。

#### `cJSON_ParseWithLengthOpts`
```c
CJSON_PUBLIC(cJSON *) cJSON_ParseWithLengthOpts(const char *value, size_t buffer_length, const char **return_parse_end, cJSON_bool require_null_terminated);
```

**描述**：带长度和选项的解析函数。

**参数**：结合了 `cJSON_ParseWithLength` 和 `cJSON_ParseWithOpts` 的参数。

**返回值**：成功返回根对象指针，失败返回 `NULL`。

#### `cJSON_GetErrorPtr`
```c
CJSON_PUBLIC(const char *) cJSON_GetErrorPtr(void);
```

**描述**：如果上次解析失败，返回指向错误位置的指针。注意：该指针在下次解析前有效。

**返回值**：错误位置的字符串指针，若无错误则返回 `NULL`。

### 4.4 打印 JSON
#### `cJSON_Print`
```c
CJSON_PUBLIC(char *) cJSON_Print(const cJSON *item);
```

**描述**：将 `cJSON` 对象转换为格式化的 JSON 字符串（包含缩进和换行）。返回的字符串需要使用 `cJSON_free` 释放。

**参数**：

+ `item`：要打印的 `cJSON` 对象。

**返回值**：成功返回 JSON 字符串，失败返回 `NULL`。

#### `cJSON_PrintUnformatted`
```c
CJSON_PUBLIC(char *) cJSON_PrintUnformatted(const cJSON *item);
```

**描述**：将 `cJSON` 对象转换为紧凑的 JSON 字符串（无多余空白）。返回的字符串需要使用 `cJSON_free` 释放。

**参数**：

+ `item`：要打印的 `cJSON` 对象。

**返回值**：成功返回 JSON 字符串，失败返回 `NULL`。

#### `cJSON_PrintBuffered`
```c
CJSON_PUBLIC(char *) cJSON_PrintBuffered(const cJSON *item, int prebuffer, cJSON_bool fmt);
```

**描述**：使用指定大小的缓冲区打印 JSON，可减少内存分配次数。若 `prebuffer` 足够大，则不再重新分配。

**参数**：

+ `item`：要打印的 `cJSON` 对象。
+ `prebuffer`：预估的缓冲区大小（字节）。
+ `fmt`：如果为真，则格式化输出；否则输出紧凑字符串。

**返回值**：成功返回 JSON 字符串，失败返回 `NULL`。

#### `cJSON_PrintPreallocated`
```c
CJSON_PUBLIC(cJSON_bool) cJSON_PrintPreallocated(cJSON *item, char *buffer, const int length, const cJSON_bool format);
```

**描述**：将 JSON 打印到预先分配的缓冲区中，不进行内存分配。缓冲区必须足够大。

**参数**：

+ `item`：要打印的 `cJSON` 对象。
+ `buffer`：输出缓冲区。
+ `length`：缓冲区长度。
+ `format`：如果为真，则格式化输出。

**返回值**：成功返回 `true`，失败返回 `false`。

### 4.5 删除 JSON 对象
#### `cJSON_Delete`
```c
CJSON_PUBLIC(void) cJSON_Delete(cJSON *item);
```

**描述**：递归删除 `cJSON` 对象及其所有子对象，释放相关内存。

**参数**：

+ `item`：要删除的 `cJSON` 对象。

### 4.6 获取数组/对象大小
#### `cJSON_GetArraySize`
```c
CJSON_PUBLIC(int) cJSON_GetArraySize(const cJSON *array);
```

**描述**：返回数组或对象中的元素个数。

**参数**：

+ `array`：指向数组或对象的 `cJSON` 指针。

**返回值**：元素个数。如果传入 `NULL` 或不是数组/对象，返回 0。

### 4.7 获取数组元素
#### `cJSON_GetArrayItem`
```c
CJSON_PUBLIC(cJSON *) cJSON_GetArrayItem(const cJSON *array, int index);
```

**描述**：获取数组中指定索引的元素。

**参数**：

+ `array`：指向数组的 `cJSON` 指针。
+ `index`：索引（从 0 开始）。

**返回值**：指向对应元素的指针，若索引无效或数组无效则返回 `NULL`。

### 4.8 获取对象成员
#### `cJSON_GetObjectItem`
```c
CJSON_PUBLIC(cJSON *) cJSON_GetObjectItem(const cJSON * const object, const char * const string);
```

**描述**：从对象中获取指定名称的成员（不区分大小写）。

**参数**：

+ `object`：指向对象的 `cJSON` 指针。
+ `string`：成员名称。

**返回值**：指向对应成员的指针，若未找到则返回 `NULL`。

#### `cJSON_GetObjectItemCaseSensitive`
```c
CJSON_PUBLIC(cJSON *) cJSON_GetObjectItemCaseSensitive(const cJSON * const object, const char * const string);
```

**描述**：区分大小写地获取对象成员。

**参数**：同上。

**返回值**：指向对应成员的指针，若未找到则返回 `NULL`。

#### `cJSON_HasObjectItem`
```c
CJSON_PUBLIC(cJSON_bool) cJSON_HasObjectItem(const cJSON *object, const char *string);
```

**描述**：检查对象中是否存在指定名称的成员（不区分大小写）。

**返回值**：存在返回 `true`，否则返回 `false`。

### 4.9 获取值
#### `cJSON_GetStringValue`
```c
CJSON_PUBLIC(char *) cJSON_GetStringValue(const cJSON * const item);
```

**描述**：如果项是字符串类型，返回其字符串值；否则返回 `NULL`。

**参数**：

+ `item`：`cJSON` 对象。

**返回值**：字符串指针或 `NULL`。

#### `cJSON_GetNumberValue`
```c
CJSON_PUBLIC(double) cJSON_GetNumberValue(const cJSON * const item);
```

**描述**：如果项是数字类型，返回其双精度值；否则返回 `NAN`。

**参数**：

+ `item`：`cJSON` 对象。

**返回值**：数字值或 `NAN`。

### 4.10 类型检查函数
所有类型检查函数均返回 `cJSON_bool`，若项为对应类型则返回 `true`，否则返回 `false`。

| 函数原型 | 描述 |
| --- | --- |
| `cJSON_IsInvalid(const cJSON * const item)` | 是否为无效类型 |
| `cJSON_IsFalse(const cJSON * const item)` | 是否为 `false` |
| `cJSON_IsTrue(const cJSON * const item)` | 是否为 `true` |
| `cJSON_IsBool(const cJSON * const item)` | 是否为布尔类型（true/false） |
| `cJSON_IsNull(const cJSON * const item)` | 是否为 `null` |
| `cJSON_IsNumber(const cJSON * const item)` | 是否为数字 |
| `cJSON_IsString(const cJSON * const item)` | 是否为字符串 |
| `cJSON_IsArray(const cJSON * const item)` | 是否为数组 |
| `cJSON_IsObject(const cJSON * const item)` | 是否为对象 |
| `cJSON_IsRaw(const cJSON * const item)` | 是否为原始 JSON |


### 4.11 创建 JSON 项
#### 基本类型创建
| 函数原型 | 描述 |
| --- | --- |
| `cJSON_CreateNull(void)` | 创建 `null` 值 |
| `cJSON_CreateTrue(void)` | 创建 `true` 值 |
| `cJSON_CreateFalse(void)` | 创建 `false` 值 |
| `cJSON_CreateBool(cJSON_bool boolean)` | 根据布尔值创建 `true` 或 `false` |
| `cJSON_CreateNumber(double num)` | 创建数字 |
| `cJSON_CreateString(const char *string)` | 创建字符串（内部复制） |
| `cJSON_CreateRaw(const char *raw)` | 创建原始 JSON（内部复制） |
| `cJSON_CreateArray(void)` | 创建空数组 |
| `cJSON_CreateObject(void)` | 创建空对象 |


#### 引用类型创建
| 函数原型 | 描述 |
| --- | --- |
| `cJSON_CreateStringReference(const char *string)` | 创建字符串引用（不复制字符串，不释放） |
| `cJSON_CreateObjectReference(const cJSON *child)` | 创建对象引用（不复制子对象） |
| `cJSON_CreateArrayReference(const cJSON *child)` | 创建数组引用（不复制子对象） |


#### 数组创建辅助函数
| 函数原型 | 描述 |
| --- | --- |
| `cJSON_CreateIntArray(const int *numbers, int count)` | 从整数数组创建数字数组 |
| `cJSON_CreateFloatArray(const float *numbers, int count)` | 从浮点数数组创建数字数组 |
| `cJSON_CreateDoubleArray(const double *numbers, int count)` | 从双精度数组创建数字数组 |
| `cJSON_CreateStringArray(const char *const *strings, int count)` | 从字符串数组创建字符串数组 |


**注意**：这些函数会为每个元素创建新的 `cJSON` 对象，并在失败时清理已分配内存。

### 4.12 添加项到数组/对象
#### `cJSON_AddItemToArray`
```c
CJSON_PUBLIC(cJSON_bool) cJSON_AddItemToArray(cJSON *array, cJSON *item);
```

**描述**：将 `item` 追加到数组末尾。

**参数**：

+ `array`：目标数组。
+ `item`：要添加的项。

**返回值**：成功返回 `true`，失败返回 `false`。

#### `cJSON_AddItemToObject`
```c
CJSON_PUBLIC(cJSON_bool) cJSON_AddItemToObject(cJSON *object, const char *string, cJSON *item);
```

**描述**：将 `item` 作为对象成员添加到对象中，成员名称为 `string`（内部会复制字符串）。

**参数**：

+ `object`：目标对象。
+ `string`：成员名称。
+ `item`：要添加的项。

**返回值**：成功返回 `true`，失败返回 `false`。

#### `cJSON_AddItemToObjectCS`
```c
CJSON_PUBLIC(cJSON_bool) cJSON_AddItemToObjectCS(cJSON *object, const char *string, cJSON *item);
```

**描述**：与 `cJSON_AddItemToObject` 类似，但将成员名称视为常量（不复制，也不释放）。适用于字符串字面量等保证生命周期长的场景。

#### `cJSON_AddItemReferenceToArray`
```c
CJSON_PUBLIC(cJSON_bool) cJSON_AddItemReferenceToArray(cJSON *array, cJSON *item);
```

**描述**：将 `item` 的引用添加到数组中（不复制 `item`，`item` 的内存由调用者管理）。

#### `cJSON_AddItemReferenceToObject`
```c
CJSON_PUBLIC(cJSON_bool) cJSON_AddItemReferenceToObject(cJSON *object, const char *string, cJSON *item);
```

**描述**：将 `item` 的引用作为对象成员添加。

#### 便捷添加函数（创建并添加）
以下函数创建一个新项并立即添加到对象中，返回新创建的项指针，失败返回 `NULL`。

| 函数原型 | 描述 |
| --- | --- |
| `cJSON_AddNullToObject(cJSON *object, const char *name)` | 添加 `null` |
| `cJSON_AddTrueToObject(cJSON *object, const char *name)` | 添加 `true` |
| `cJSON_AddFalseToObject(cJSON *object, const char *name)` | 添加 `false` |
| `cJSON_AddBoolToObject(cJSON *object, const char *name, cJSON_bool boolean)` | 添加布尔值 |
| `cJSON_AddNumberToObject(cJSON *object, const char *name, double number)` | 添加数字 |
| `cJSON_AddStringToObject(cJSON *object, const char *name, const char *string)` | 添加字符串 |
| `cJSON_AddRawToObject(cJSON *object, const char *name, const char *raw)` | 添加原始 JSON |
| `cJSON_AddObjectToObject(cJSON *object, const char *name)` | 添加空对象 |
| `cJSON_AddArrayToObject(cJSON *object, const char *name)` | 添加空数组 |


### 4.13 移除/删除项
#### `cJSON_DetachItemViaPointer`
```c
CJSON_PUBLIC(cJSON *) cJSON_DetachItemViaPointer(cJSON *parent, cJSON * const item);
```

**描述**：从父对象/数组中分离指定的子项，但不释放其内存。返回该子项指针。

**参数**：

+ `parent`：父对象或数组。
+ `item`：要分离的子项。

**返回值**：成功返回子项指针，失败返回 `NULL`。

#### `cJSON_DetachItemFromArray`
```c
CJSON_PUBLIC(cJSON *) cJSON_DetachItemFromArray(cJSON *array, int which);
```

**描述**：从数组中分离指定索引的子项。

**参数**：

+ `array`：目标数组。
+ `which`：索引（从 0 开始）。

**返回值**：成功返回子项指针，失败返回 `NULL`。

#### `cJSON_DeleteItemFromArray`
```c
CJSON_PUBLIC(void) cJSON_DeleteItemFromArray(cJSON *array, int which);
```

**描述**：从数组中删除并释放指定索引的子项。

#### `cJSON_DetachItemFromObject`
```c
CJSON_PUBLIC(cJSON *) cJSON_DetachItemFromObject(cJSON *object, const char *string);
```

**描述**：从对象中分离指定名称的成员（不区分大小写），不释放内存。

#### `cJSON_DetachItemFromObjectCaseSensitive`
```c
CJSON_PUBLIC(cJSON *) cJSON_DetachItemFromObjectCaseSensitive(cJSON *object, const char *string);
```

**描述**：区分大小写地分离对象成员。

#### `cJSON_DeleteItemFromObject`
```c
CJSON_PUBLIC(void) cJSON_DeleteItemFromObject(cJSON *object, const char *string);
```

**描述**：从对象中删除并释放指定名称的成员（不区分大小写）。

#### `cJSON_DeleteItemFromObjectCaseSensitive`
```c
CJSON_PUBLIC(void) cJSON_DeleteItemFromObjectCaseSensitive(cJSON *object, const char *string);
```

**描述**：区分大小写地删除并释放对象成员。

### 4.14 插入/替换项
#### `cJSON_InsertItemInArray`
```c
CJSON_PUBLIC(cJSON_bool) cJSON_InsertItemInArray(cJSON *array, int which, cJSON *newitem);
```

**描述**：在数组的指定索引处插入新项，原位置及之后的项后移。

**参数**：

+ `array`：目标数组。
+ `which`：插入位置索引。
+ `newitem`：要插入的项。

**返回值**：成功返回 `true`，失败返回 `false`。

#### `cJSON_ReplaceItemViaPointer`
```c
CJSON_PUBLIC(cJSON_bool) cJSON_ReplaceItemViaPointer(cJSON * const parent, cJSON * const item, cJSON * replacement);
```

**描述**：用 `replacement` 替换父对象/数组中的指定子项 `item`。原 `item` 会被删除。

**参数**：

+ `parent`：父对象或数组。
+ `item`：要被替换的子项。
+ `replacement`：新的项。

**返回值**：成功返回 `true`，失败返回 `false`。

#### `cJSON_ReplaceItemInArray`
```c
CJSON_PUBLIC(cJSON_bool) cJSON_ReplaceItemInArray(cJSON *array, int which, cJSON *newitem);
```

**描述**：替换数组中指定索引的项。

#### `cJSON_ReplaceItemInObject`
```c
CJSON_PUBLIC(cJSON_bool) cJSON_ReplaceItemInObject(cJSON *object, const char *string, cJSON *newitem);
```

**描述**：替换对象中指定名称的成员（不区分大小写）。

#### `cJSON_ReplaceItemInObjectCaseSensitive`
```c
CJSON_PUBLIC(cJSON_bool) cJSON_ReplaceItemInObjectCaseSensitive(cJSON *object, const char *string, cJSON *newitem);
```

**描述**：区分大小写地替换对象成员。

### 4.15 复制与比较
#### `cJSON_Duplicate`
```c
CJSON_PUBLIC(cJSON *) cJSON_Duplicate(const cJSON *item, cJSON_bool recurse);
```

**描述**：复制一个 `cJSON` 项。如果 `recurse` 为真，则递归复制所有子项；否则只复制当前节点（其 `child` 指针将置为 `NULL`）。

**参数**：

+ `item`：要复制的项。
+ `recurse`：是否递归复制子项。

**返回值**：新复制的项指针，失败返回 `NULL`。

#### `cJSON_Compare`
```c
CJSON_PUBLIC(cJSON_bool) cJSON_Compare(const cJSON * const a, const cJSON * const b, const cJSON_bool case_sensitive);
```

**描述**：递归比较两个 JSON 项是否相等。

**参数**：

+ `a`、`b`：要比较的项。
+ `case_sensitive`：对于对象键，是否区分大小写。

**返回值**：相等返回 `true`，否则返回 `false`。

### 4.16 最小化（去除空白）
#### `cJSON_Minify`
```c
CJSON_PUBLIC(void) cJSON_Minify(char *json);
```

**描述**：原地去除 JSON 字符串中的空白字符（空格、制表符、回车、换行）以及 C 风格注释（`//` 和 `/* */`）。**注意**：输入字符串必须可写，不能是字符串常量。

**参数**：

+ `json`：要最小化的 JSON 字符串。

### 4.17 辅助函数与宏
#### 设置数值
```c
#define cJSON_SetIntValue(object, number) ((object) ? (object)->valueint = (object)->valuedouble = (number) : (number))
CJSON_PUBLIC(double) cJSON_SetNumberHelper(cJSON *object, double number);
#define cJSON_SetNumberValue(object, number) ((object != NULL) ? cJSON_SetNumberHelper(object, (double)number) : (number))
```

**描述**：设置数字项的值。推荐使用 `cJSON_SetNumberValue` 宏，它会同时更新 `valueint` 和 `valuedouble` 字段（注意 `valueint` 已废弃）。

#### 设置字符串值
```c
CJSON_PUBLIC(char*) cJSON_SetValuestring(cJSON *object, const char *valuestring);
```

**描述**：修改字符串项的值。如果新字符串长度不超过原字符串长度，则原地复制；否则重新分配内存。仅当 `object` 为字符串类型且不是引用时有效。

**返回值**：成功返回新的 `valuestring` 指针，失败返回 `NULL`。

#### 设置布尔值
```c
#define cJSON_SetBoolValue(object, boolValue) ( \
    (object != NULL && ((object)->type & (cJSON_False|cJSON_True))) ? \
    (object)->type=((object)->type &(~(cJSON_False|cJSON_True)))|((boolValue)?cJSON_True:cJSON_False) : \
    cJSON_Invalid\
)
```

**描述**：设置布尔项的值。如果对象不是布尔类型，则返回 `cJSON_Invalid`。

#### 遍历数组/对象
```c
#define cJSON_ArrayForEach(element, array) \
    for(element = (array != NULL) ? (array)->child : NULL; element != NULL; element = element->next)
```

**描述**：用于遍历数组或对象的所有子项。`element` 是 `cJSON*` 类型的循环变量。

#### 内存分配/释放
```c
CJSON_PUBLIC(void *) cJSON_malloc(size_t size);
CJSON_PUBLIC(void) cJSON_free(void *object);
```

**描述**：使用当前设置的内存管理函数分配或释放内存。通常用于释放由 `cJSON_Print` 等函数返回的字符串。

## 5. 注意事项
1. **内存管理**：由 `cJSON_Parse` 创建的 `cJSON` 对象必须通过 `cJSON_Delete` 释放。由 `cJSON_Print` 返回的字符串必须通过 `cJSON_free` 释放。
2. **错误处理**：解析失败时，可通过 `cJSON_GetErrorPtr` 获取错误位置，但该指针在下次解析前有效。
3. **引用类型**：使用 `cJSON_IsReference` 标记的项不会被递归删除。添加引用项时需确保原对象生命周期长于引用者。
4. **线程安全**：cJSON 不是线程安全的，全局错误指针和内存钩子需要调用者自行同步。
5. **整数范围**：`valueint` 字段已废弃，但为保持兼容性仍存在。设置数值时请使用 `cJSON_SetNumberValue` 宏。
6. **嵌套深度**：解析深度受 `CJSON_NESTING_LIMIT` 限制，超出将返回解析失败。
7. **字符串常量**：当使用 `cJSON_AddItemToObjectCS` 添加常量键时，必须确保该字符串在整个对象生命周期内有效。
8. **最小化**：`cJSON_Minify` 会原地修改输入字符串，不能用于字符串常量。

## 6. 示例
以下是一个简单的使用示例：

```c
#include <stdio.h>
#include "cJSON.h"

int main() {
    // 解析 JSON
    const char *json_string = "{\"name\":\"cJSON\",\"version\":1.7,\"features\":[\"lightweight\",\"fast\"]}";
    cJSON *root = cJSON_Parse(json_string);
    if (root == NULL) {
        const char *error_ptr = cJSON_GetErrorPtr();
        if (error_ptr != NULL) {
            fprintf(stderr, "Error before: %s\n", error_ptr);
        }
        return 1;
    }

    // 获取对象成员
    cJSON *name = cJSON_GetObjectItem(root, "name");
    if (cJSON_IsString(name) && (name->valuestring != NULL)) {
        printf("Name: %s\n", name->valuestring);
    }

    // 修改版本号
    cJSON *version = cJSON_GetObjectItem(root, "version");
    if (cJSON_IsNumber(version)) {
        cJSON_SetNumberValue(version, 1.8);
    }

    // 添加新字段
    cJSON_AddStringToObject(root, "license", "MIT");

    // 打印格式化 JSON
    char *printed = cJSON_Print(root);
    if (printed) {
        printf("%s\n", printed);
        cJSON_free(printed);
    }

    // 清理
    cJSON_Delete(root);
    return 0;
}
```

## 7. 版本历史
当前版本基于 cJSON 1.7.19，API 稳定。

---

本文档根据 cJSON 源码（v1.7.19）编写，涵盖了所有公开 API 及关键宏。如有疑问，请参考官方 GitHub 仓库：[https://github.com/DaveGamble/cJSON](https://github.com/DaveGamble/cJSON)

