---
title: GraduationDesign
date: 2026-3-1
tags: 
categories:
description: 毕业设计项目代码
---





# 项目概览：GraduationDesign-main


## 📁 目录结构


```
GraduationDesign-main/
└── include/
    ├── api_util.h
    ├── conf.h
    ├── db_op.h
    ├── file_handler.h
    ├── protocol.h
    ├── server.h
    ├── thread_pool.h
    ├── user_handler.h
└── src/
    ├── api_util.c
    ├── conf.c
    ├── db_op.c
    ├── file_handler.c
    ├── main.c
    ├── protocol.c
    ├── server.c
    ├── thread_pool.c
    ├── user_handler.c
└── index.html
└── Makefile

```


## 📄 文件内容


### `include/api_util.h`
```h
#ifndef _API_UTIL_H
#define _API_UTIL_H

#include "../include/protocol.h"
#include "../libs/cJSON/cJSON.h"

// 构造标准 JSON 响应
// code: 业务状态码 (0 成功, 非0 失败)
// msg: 提示信息
// data: cJSON 数据对象 (如果传 NULL，则 data 字段为 null)
// 返回: JSON 字符串 (需 free)
char* make_json_response(int code, const char *msg, cJSON *data);

#endif
```

### `include/conf.h`
```h
#ifndef _CONF_H
#define _CONF_H

// 定义配置信息结构体
typedef struct {
    char db_host[64];
    int db_port;
    char db_user[64];
    char db_pass[64];
    char db_name[64];
} Config;

// 加载配置文件
int load_config(const char *filename, Config *conf);

#endif
```

### `include/db_op.h`
```h
#ifndef _DB_OP_H
#define _DB_OP_H

#include "conf.h"
#include <mysql/mysql.h>
#include <pthread.h>
#include <stdbool.h>


// 数据库连接句柄包装（为未来连接池预留结构）
typedef struct {
    MYSQL *conn;
    int index; // 连接池索引，用于调试
} DBConnection;

// 数据库连接池结构体
typedef struct {
    DBConnection *connections;  // 连接数组
    bool*available;  // 连接是否可用标记
    int size;        // 连接池大小
    pthread_mutex_t lock; // 连接池锁-仅用于管理池资源，不用于业务串行化
    pthread_cond_t cond;   // 条件变量-用于等待可用连接
    Config *conf;    // 数据库配置
} DBPool;

// 初始化数据库环境（如 mysql_library_init）
int db_init();

// 连接数据库
DBConnection* db_connect(Config *conf);

// 关闭连接
void db_close(DBConnection *db);

// 执行非查询语句 (INSERT, UPDATE, DELETE)
// 返回: -1失败, >=0 影响的行数
int db_execute_update(DBConnection *db, const char *sql);

// 执行查询语句 (SELECT)
// 返回: MYSQL_RESULT 指针，使用后需调用 mysql_free_result
MYSQL_RES* db_execute_query(DBConnection *db, const char *sql);

// 转义字符串，防止 SQL 注入
// to: 输出缓冲区
// from: 输入字符串
// 返回: 转义后的长度
unsigned long db_escape_string(DBConnection *db, char *to, const char *from, unsigned long length);

// --- 新增连接池管理接口 ---

// 创建连接池
// size: 池中连接数量
DBPool* db_pool_create(Config *conf, int size);

// 从池中获取一个可用连接（阻塞直到有空闲连接）
DBConnection* db_pool_acquire(DBPool *pool);

// 归还连接到池中
void db_pool_release(DBPool *pool, DBConnection *conn);

// 销毁连接池
void db_pool_destroy(DBPool *pool);

#endif
```

### `include/file_handler.h`
```h
#ifndef _FILE_HANDLER_H
#define _FILE_HANDLER_H

#include "../include/db_op.h"
#include "../libs/cJSON/cJSON.h"
#include "../include/protocol.h"

// 辅助函数声明
void get_url_param(const char *url, const char *key, char *output);
// 验证 Token 是否有效
// 返回: 用户ID (>0) 成功, -1 失败
long verify_user_token(DBConnection *db, const char *token);
// 辅助：检查剩余配额是否足够
// 返回 1-足够, 0-不足, -1-错误
// static int check_quota_enough(DBConnection *db, long user_id, long long file_size);
// 预检查上传（秒传/断点续传）
// req_json 包含: md5, file_size, file_name, parent_id
cJSON* handle_upload_check(DBConnection *db, long user_id, const cJSON *req_json);

// 完成上传（更新元数据和配额）
// req_json 包含: md5, file_path (服务器上的实际存储路径)
cJSON* handle_upload_complete(DBConnection *db, long user_id, const cJSON *req_json);

// 处理文件/目录列表请求
// req_json 应包含 parent_id (整数, 0代表根目录)
cJSON* handle_file_list(DBConnection *db, long user_id, const cJSON *req_json);

// 处理创建文件夹请求
// req_json 应包含 parent_id 和 folder_name
cJSON* handle_file_mkdir(DBConnection *db, long user_id, const cJSON *req_json);

// 下载
void handle_file_download(int client_fd, DBConnection *db, long user_id, const cJSON *req_json);
// 分片上传
void handle_upload_chunk(int client_fd, DBConnection *db, long user_id, HttpRequest *req);

// 处理文件预览请求
// client_fd: 客户端套接字
// db: 数据库连接
// user_id: 用户ID (已验证)
// req: HTTP请求结构体
void handle_file_view(int client_fd, DBConnection *db, long user_id, HttpRequest *req);

cJSON* handle_file_rename(DBConnection *db, long user_id, const cJSON *req_json);
cJSON* handle_file_delete(DBConnection *db, long user_id, const cJSON *req_json);
cJSON* handle_file_move(DBConnection *db, long user_id, const cJSON *req_json);


#endif
```

### `include/protocol.h`
```h
#ifndef _PROTOCOL_H
#define _PROTOCOL_H

#include <stdbool.h>

// HTTP 方法枚举
typedef enum {
    HTTP_GET,
    HTTP_POST,
    HTTP_PUT,
    HTTP_DELETE,
    HTTP_OPTIONS,
    HTTP_UNKNOWN
} HttpMethod;

// HTTP 请求结构体
typedef struct {
    HttpMethod method;
    char url[256];      // 请求路径，如 /files/upload
    char *body;         // 请求体（动态分配内存，需释放）
    int body_len;
    // 可根据需要扩展 headers，例如 token, content-type
    char token[128];
    char content_type[128];
    int file_offset;   // 用于读取HTTP头中分片的偏移量
} HttpRequest;

// HTTP 响应状态码
typedef enum {
    HTTP_OK = 200,
    HTTP_BAD_REQUEST = 400,
    HTTP_UNAUTHORIZED = 401,
    HTTP_NOT_FOUND = 404,
    HTTP_INTERNAL_SERVER_ERROR = 500
} HttpStatus;

// HTTP 响应结构体
typedef struct {
    HttpStatus status_code;
    char *body;         // JSON 字符串（动态分配，需释放）
} HttpResponse;

// 解析 HTTP 请求字符串
// buffer: 接收到的 raw 数据
// req: 输出参数，存储解析结果
// 返回: 0 成功, -1 失败
int parse_http_request(const char *buffer, int size, HttpRequest *req);

// 释放 HttpRequest 中的动态内存
void free_http_request(HttpRequest *req);

// 释放 HttpResponse 中的动态内存
void free_http_response(HttpResponse *resp);

#endif
```

### `include/server.h`
```h
#ifndef _SERVER_H
#define _SERVER_H

#include <sys/socket.h>
#include <netinet/in.h>

// 处理客户端请求的函数
// arg: 传递给线程的参数
void process_client_request(void *arg);
// 启动服务器
// port: 监听端口
// thread_count: 线程池线程数
void start_server(int port, int thread_count);

#endif
```

### `include/thread_pool.h`
```h
#ifndef _THREAD_POOL_H
#define _THREAD_POOL_H

typedef struct threadpool_t threadpool_t;

// 任务函数指针类型
typedef void (*thread_func_t)(void *arg);

// 创建线程池
threadpool_t *threadpool_create(int thread_count);

// 向线程池添加任务
int threadpool_add(threadpool_t *pool, thread_func_t function, void *arg);

// 销毁线程池
int threadpool_destroy(threadpool_t *pool);

#endif
```

### `include/user_handler.h`
```h
#ifndef _USER_HANDLER_H
#define _USER_HANDLER_H

#include "../include/db_op.h"
#include "../libs/cJSON/cJSON.h"

// 业务状态码定义
#define USER_OK 0
#define USER_EXIST 1001
#define USER_NOT_FOUND 1002
#define USER_PASS_WRONG 1003
#define USER_DB_ERROR 1004

// 处理注册请求
// 参数: db连接, json请求体
// 返回: cJSON 对象指针(包含响应数据)，需调用者释放
cJSON* handle_register(DBConnection *db, const cJSON *req_json);

// 处理登录请求
// 参数: db连接, json请求体, client_ip (用于日志)
// 返回: cJSON 对象指针
cJSON* handle_login(DBConnection *db, const cJSON *req_json, const char *client_ip);

#endif
```

### `src/api_util.c`
```c
#include "../include/api_util.h"
#include <stdlib.h>
#include <string.h>

char* make_json_response(int code, const char *msg, cJSON *data) {
    cJSON *root = cJSON_CreateObject();
    cJSON_AddNumberToObject(root, "code", code);
    cJSON_AddStringToObject(root, "msg", msg);
    
    if (data != NULL) {
        cJSON_AddItemToObject(root, "data", data);
    } else {
        cJSON_AddNullToObject(root, "data");
    }

    char *json_str = cJSON_PrintUnformatted(root); // 压缩输出，节省带宽
    cJSON_Delete(root);
    return json_str;
}
```

### `src/conf.c`
```c
#include "../include/conf.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// 简单的 key=value 解析函数
static void parse_line(char *line, char *key, char *value) {
    char *p = strchr(line, '=');
    if (p) {
        *p = '\0';
        p++; // 跳过 '='
        // 去除 key 首尾空格
        while (*line == ' ') line++;
        int len = strlen(line);
        while (len > 0 && line[len-1] == ' ') { line[len-1] = '\0'; len--; }
        
        // 去除 value 首尾空格
        while (*p == ' ') p++;
        len = strlen(p);
        while (len > 0 && p[len-1] == ' ') { p[len-1] = '\0'; len--; }

        strcpy(key, line);
        strcpy(value, p);
    }
}

int load_config(const char *filename, Config *conf) {
    FILE *fp = fopen(filename, "r");
    if (!fp) {
        perror("Open config file failed");
        return -1;
    }

    char line[256];
    char key[128], value[128];
    int in_db_section = 0;

    while (fgets(line, sizeof(line), fp)) {
        // 去除换行符
        line[strcspn(line, "\r\n")] = 0;
        
        // 跳过注释和空行
        if (line[0] == '#' || line[0] == '\0') continue;

        // 检查 Section
        if (line[0] == '[') {
            if (strstr(line, "[database]")) {
                in_db_section = 1;
            } else {
                in_db_section = 0;
            }
            continue;
        }

        if (in_db_section) {
            parse_line(line, key, value);
            if (strcmp(key, "db_host") == 0) strcpy(conf->db_host, value);
            else if (strcmp(key, "db_port") == 0) conf->db_port = atoi(value);
            else if (strcmp(key, "db_user") == 0) strcpy(conf->db_user, value);
            else if (strcmp(key, "db_pass") == 0) strcpy(conf->db_pass, value);
            else if (strcmp(key, "db_name") == 0) strcpy(conf->db_name, value);
        }
    }

    fclose(fp);
    return 0;
}
```

### `src/db_op.c`
```c
#include "../include/db_op.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

int db_init() {
    if (mysql_library_init(0, NULL, NULL)) {
        fprintf(stderr, "could not initialize MySQL library\n");
        return -1;
    }
    return 0;
}

DBConnection* db_connect(Config *conf) {
    DBConnection *db = (DBConnection*)malloc(sizeof(DBConnection));
    if (!db) return NULL;

    db->conn = mysql_init(NULL);
    if (!db->conn) {
        free(db);
        return NULL;
    }

    // 设置字符集为 utf8mb4
    mysql_options(db->conn, MYSQL_SET_CHARSET_NAME, "utf8mb4");

    // 连接数据库
    if (!mysql_real_connect(db->conn, conf->db_host, conf->db_user, 
                            conf->db_pass, conf->db_name, conf->db_port, NULL, 0)) {
        fprintf(stderr, "Connect Error: %s\n", mysql_error(db->conn));
        mysql_close(db->conn);
        free(db);
        return NULL;
    }

    printf("Database connected successfully!\n");
    return db;
}

void db_close(DBConnection *db) {
    if (db) {
        if (db->conn) mysql_close(db->conn);
        free(db);
    }
}

int db_execute_update(DBConnection *db, const char *sql) {
    if (mysql_query(db->conn, sql)) {
        fprintf(stderr, "Update Error: %s\n", mysql_error(db->conn));
        fprintf(stderr, "SQL: %s\n", sql);
        return -1;
    }
    return (int)mysql_affected_rows(db->conn);
}

MYSQL_RES* db_execute_query(DBConnection *db, const char *sql) {
    if (mysql_query(db->conn, sql)) {
        fprintf(stderr, "Query Error: %s\n", mysql_error(db->conn));
        fprintf(stderr, "SQL: %s\n", sql);
        return NULL;
    }
    return mysql_store_result(db->conn);
}

// --- 新增连接池实现 ---

DBPool* db_pool_create(Config *conf, int size) {
    DBPool *pool = (DBPool*)malloc(sizeof(DBPool));
    if (!pool) return NULL;

    pool->connections = (DBConnection*)malloc(sizeof(DBConnection) * size);
    pool->available = (bool*)malloc(sizeof(bool) * size);
    pool->size = size;
    pool->conf = conf; // 保存配置以便重连使用

    if (!pool->connections || !pool->available) {
        free(pool->connections);
        free(pool->available);
        free(pool);
        return NULL;
    }

    // 初始化锁和条件变量
    pthread_mutex_init(&pool->lock, NULL);
    pthread_cond_init(&pool->cond, NULL);

    // 创建连接
    for (int i = 0; i < size; i++) {
        pool->connections[i].index = i;
        pool->available[i] = true; // 初始状态为可用
        
        // 这里复用原有的 db_connect 函数
        MYSQL *conn = mysql_init(NULL);
        if (!conn) {
            fprintf(stderr, "mysql_init failed in pool creation\n");
            continue; // 或者做错误处理
        }
        mysql_options(conn, MYSQL_SET_CHARSET_NAME, "utf8mb4");
        if (!mysql_real_connect(conn, conf->db_host, conf->db_user, 
                                conf->db_pass, conf->db_name, conf->db_port, NULL, 0)) {
            fprintf(stderr, "Connect Error in pool: %s\n", mysql_error(conn));
            pool->connections[i].conn = NULL; // 标记无效
        } else {
            pool->connections[i].conn = conn;
        }
    }

    printf("Database pool created with %d connections.\n", size);
    return pool;
}

// 优化-获取连接：不再持有全局大锁，而是获取独立的连接对象
DBConnection* db_pool_acquire(DBPool *pool) {
    if (!pool || pool->size <= 0) {
        return NULL;
    }
    
    pthread_mutex_lock(&pool->lock);
    
    // 超时计算移至锁内（循环外），确保从“开始等待”时刻计算，避免锁竞争导致的误差
    struct timespec abs_timeout;
    clock_gettime(CLOCK_REALTIME, &abs_timeout);
    abs_timeout.tv_sec += 10;  // 设置绝对超时时间点（当前时间 + 10秒）
    
    while (1) {
        // 遍历寻找可用连接
        for (int i = 0; i < pool->size; i++) {
            if (pool->available[i]) {
                // 如果 conn 为空，说明上次创建或重连失败，跳过
                if (!pool->connections[i].conn) {
                    continue;
                }

                pool->available[i] = false;
                // 找到可用连接，暂时解锁（MySQL操作耗时应尽量在锁外）
                pthread_mutex_unlock(&pool->lock);
                
                // 验证连接是否有效
                if (mysql_ping(pool->connections[i].conn) != 0) {
                    // 连接断开，尝试重连
                    fprintf(stderr, "Connection %d lost, attempting reconnect...\n", i);
                    mysql_close(pool->connections[i].conn);
                    
                    pool->connections[i].conn = mysql_init(NULL);
                    if (pool->connections[i].conn) {
                        mysql_options(pool->connections[i].conn, MYSQL_SET_CHARSET_NAME, "utf8mb4");
                        
                        // 执行数据库连接，使用保存的配置 pool->conf
                        if (!mysql_real_connect(pool->connections[i].conn, 
                                                pool->conf->db_host, 
                                                pool->conf->db_user, 
                                                pool->conf->db_pass, 
                                                pool->conf->db_name, 
                                                pool->conf->db_port, NULL, 0)) {
                            fprintf(stderr, "Reconnect failed: %s\n", mysql_error(pool->connections[i].conn));
                            mysql_close(pool->connections[i].conn);
                            pool->connections[i].conn = NULL; // 标记为无效
                            
                            // 重连失败，需要重新加锁并寻找下一个
                            pthread_mutex_lock(&pool->lock);
                            pool->available[i] = false; // 保持占用状态，防止其他线程拿到无效句柄
                            continue; // 继续循环找下一个
                        }
                    } else {
                        fprintf(stderr, "mysql_init failed during reconnect\n");
                        pthread_mutex_lock(&pool->lock);
                        pool->available[i] = false;
                        continue;
                    }
                }
                
                // 验证或重连成功，返回连接
                return &pool->connections[i];
            }
        }
        
        // 无可用连接，等待（带绝对超时）
        int ret = pthread_cond_timedwait(&pool->cond, &pool->lock, &abs_timeout);
        if (ret == ETIMEDOUT) {
            pthread_mutex_unlock(&pool->lock);
            fprintf(stderr, "DB pool acquire timeout\n");
            return NULL;
        }
    }
}




// 归还连接：标记为可用，唤醒等待线程
void db_pool_release(DBPool *pool, DBConnection *conn) {
    if (!conn) return;

    pthread_mutex_lock(&pool->lock);
    pool->available[conn->index] = true;
    pthread_cond_signal(&pool->cond);
    pthread_mutex_unlock(&pool->lock);
}

void db_pool_destroy(DBPool *pool) {
    if (!pool) return;
    
    for (int i = 0; i < pool->size; i++) {
        if (pool->connections[i].conn) {
            mysql_close(pool->connections[i].conn);
        }
    }
    pthread_mutex_destroy(&pool->lock);
    pthread_cond_destroy(&pool->cond);
    
    free(pool->connections);
    free(pool->available);
    free(pool);
}

// 转义函数保持不变，因为传入的 db 现在是线程独占的，所以线程安全
unsigned long db_escape_string(DBConnection *db, char *to, const char *from, unsigned long length) {
    return mysql_real_escape_string(db->conn, to, from, length);
}
```

### `src/file_handler.c`
```c
#include "../include/file_handler.h"
#include "../include/db_op.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <fcntl.h>
#include <sys/sendfile.h>
#include <sys/socket.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <pthread.h>
#include <ctype.h>

// 辅助函数：验证 Token
long verify_user_token(DBConnection *db, const char *token) {
    if (!token || strlen(token) == 0) return -1;

    char sql[2048]; // 增大缓冲区
    char esc_token[128];
    db_escape_string(db, esc_token, token, strlen(token));

    snprintf(sql, sizeof(sql), 
             "SELECT user_id FROM users WHERE token='%s' AND token_expire > NOW()", esc_token);

    MYSQL_RES *res = NULL;
    // pthread_mutex_lock(db_lock);
    res = db_execute_query(db, sql);
    // pthread_mutex_unlock(db_lock);

    if (!res) return -1;

    long uid = -1;
    if (mysql_num_rows(res) > 0) {
        MYSQL_ROW row = mysql_fetch_row(res);
        uid = atol(row[0]);
    }
    
    mysql_free_result(res);
    return uid;
}

// 线程安全的URL参数解析函数
void get_url_param(const char *url,const char *key,char *out)
{
    out[0] = '\0';

    const char *q = strchr(url,'?');
    if(!q) return;

    q++;

    char query[512];
    snprintf(query,sizeof(query),"%s",q);

    char *saveptr;
    char *token = strtok_r(query,"&",&saveptr);

    while(token)
    {
        char *eq = strchr(token,'=');
        if(eq)
        {
            *eq = '\0';

            if(strcmp(token,key)==0)
            {
                strcpy(out,eq+1);
                return;
            }
        }

        token = strtok_r(NULL,"&",&saveptr);
    }
}
// 辅助函数：根据文件名获取 MIME 类型
static const char* get_mime_type(const char *filename) {
    const char *ext = strrchr(filename, '.');
    if (!ext) return "application/octet-stream";
    
    // MD 文件严格遵循 UTF-8 编码，必须显式指定，否则浏览器可能误判为 GBK
    if (strcasecmp(ext, ".md") == 0) return "text/plain; charset=utf-8";
    // TXT 和 LOG 文件编码不确定（可能是GBK或UTF-8），去掉 charset 让浏览器自动检测，解决 Windows 记事本乱码
    if (strcasecmp(ext, ".txt") == 0 || strcasecmp(ext, ".log") == 0) return "text/plain";
    
    if (strcasecmp(ext, ".jpg") == 0 || strcasecmp(ext, ".jpeg") == 0)
        return "image/jpeg";
    if (strcasecmp(ext, ".png") == 0)
        return "image/png";
    if (strcasecmp(ext, ".gif") == 0)
        return "image/gif";
    if (strcasecmp(ext, ".pdf") == 0)
        return "application/pdf";
    
    return "application/octet-stream"; // 默认二进制流
}

// 实现文件预览处理函数
void handle_file_view(int client_fd, DBConnection *db, long user_id, HttpRequest *req) {
    // 1. 从 URL 中解析 file_id (GET 请求参数在 URL 中)
    char file_id_str[32] = {0};
    get_url_param(req->url, "file_id", file_id_str);
    
    if (strlen(file_id_str) == 0) {
        const char *err = "HTTP/1.1 400 Bad Request\r\nContent-Length: 0\r\n\r\n";
        send(client_fd, err, strlen(err), 0);
        close(client_fd);
        return;
    }
    long file_id = atol(file_id_str);

    // 2. 查询数据库获取文件信息
    char sql[2048];
    char filename_real[256]; 
    char filepath_real[512];

    snprintf(sql, sizeof(sql), "SELECT file_name, file_path, file_size FROM files WHERE file_id=%ld AND user_id=%ld", file_id, user_id);
    
    MYSQL_RES *res = NULL;
    res = db_execute_query(db, sql);
    
    if (!res || mysql_num_rows(res) == 0) {
        if(res) mysql_free_result(res);
        const char *not_found = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n";
        send(client_fd, not_found, strlen(not_found), 0);
        close(client_fd);
        return;
    }

    MYSQL_ROW row = mysql_fetch_row(res);
    strncpy(filename_real, row[0], sizeof(filename_real));
    filename_real[sizeof(filename_real)-1] = '\0';
    strncpy(filepath_real, row[1], sizeof(filepath_real));
    filepath_real[sizeof(filepath_real)-1] = '\0';
    off_t file_size = atoll(row[2]);
    mysql_free_result(res);

    // 3. 打开物理文件
    int file_fd = open(filepath_real, O_RDONLY);
    if (file_fd < 0) {
        const char *server_err = "HTTP/1.1 500 Internal Server Error\r\nContent-Length: 0\r\n\r\n";
        send(client_fd, server_err, strlen(server_err), 0);
        close(client_fd);
        return;
    }

    // 4. 构造响应头
    const char *mime_type = get_mime_type(filename_real);
    char header[1024];
    snprintf(header, sizeof(header), 
             "HTTP/1.1 200 OK\r\n"
             "Content-Type: %s\r\n"
             "Content-Disposition: inline; filename=\"%s\"\r\n" // 关键：inline 表示浏览器内显示
             "Content-Length: %ld\r\n"
             "Access-Control-Allow-Origin: *\r\n"
             "Connection: close\r\n"
             "\r\n", mime_type, filename_real, (long)file_size);
    
    send(client_fd, header, strlen(header), 0);
    
    // 5. 零拷贝传输文件内容
    sendfile(client_fd, file_fd, NULL, file_size);

    close(file_fd);
    close(client_fd);
}

cJSON* handle_file_list(DBConnection *db, long user_id, const cJSON *req_json) {
    cJSON *root = cJSON_CreateObject();

    cJSON *pid_obj = cJSON_GetObjectItem(req_json, "parent_id");
    int parent_id = pid_obj ? pid_obj->valueint : 0;

    cJSON *fetch_all_obj = cJSON_GetObjectItem(req_json, "fetch_all");
    int fetch_all = (fetch_all_obj && fetch_all_obj->valueint);

    char sql[2048];
    MYSQL_RES *res = NULL;

    if (fetch_all) {
        snprintf(sql, sizeof(sql), 
                 "SELECT file_id, file_name, file_size, file_type, parent_id "
                 "FROM files WHERE user_id=%ld ORDER BY parent_id ASC, file_type ASC", 
                 user_id);
    } else {
        snprintf(sql, sizeof(sql), 
                 "SELECT file_id, file_name, file_size, file_type, create_time "
                 "FROM files WHERE user_id=%ld AND parent_id=%d ORDER BY file_type ASC, create_time DESC", 
                 user_id, parent_id);
    }

    res = db_execute_query(db, sql);
    
    if (!res) {
        cJSON_AddNumberToObject(root, "code", 500);
        cJSON_AddStringToObject(root, "msg", "Database error");
        return root;
    }

    cJSON *data_array = cJSON_CreateArray();
    MYSQL_ROW row;
    while ((row = mysql_fetch_row(res))) {
        cJSON *item = cJSON_CreateObject();
        cJSON_AddNumberToObject(item, "file_id", atol(row[0]));
        cJSON_AddStringToObject(item, "file_name", row[1]);
        cJSON_AddNumberToObject(item, "file_size", atoll(row[2]));
        cJSON_AddNumberToObject(item, "file_type", atoi(row[3]));
        
        if (!fetch_all) {
            cJSON_AddStringToObject(item, "create_time", row[4]);
        } else {
            cJSON_AddNumberToObject(item, "parent_id", atoi(row[4]));
        }
        cJSON_AddItemToArray(data_array, item);
    }
    mysql_free_result(res);

    cJSON_AddNumberToObject(root, "code", 0);
    cJSON_AddStringToObject(root, "msg", "Success");
    cJSON_AddItemToObject(root, "data", data_array);

    return root;
}

cJSON* handle_file_mkdir(DBConnection *db, long user_id, const cJSON *req_json) {
    cJSON *root = cJSON_CreateObject();
    cJSON *name_obj = cJSON_GetObjectItem(req_json, "folder_name");
    cJSON *pid_obj = cJSON_GetObjectItem(req_json, "parent_id");

    if (!name_obj) {
        cJSON_AddNumberToObject(root, "code", 400);
        cJSON_AddStringToObject(root, "msg", "Missing folder_name");
        return root;
    }
    const char *folder_name = name_obj->valuestring;
    int parent_id = pid_obj ? pid_obj->valueint : 0;

    char sql[2048];
    char esc_name[256];
    db_escape_string(db, esc_name, folder_name, strlen(folder_name));
    
    snprintf(sql, sizeof(sql), 
             "SELECT file_id FROM files WHERE user_id=%ld AND parent_id=%d AND file_name='%s' AND file_type=1", 
             user_id, parent_id, esc_name);

    MYSQL_RES *res = NULL;
    res = db_execute_query(db, sql);
    
    if (res && mysql_num_rows(res) > 0) {
        mysql_free_result(res);
        cJSON_AddNumberToObject(root, "code", 400);
        cJSON_AddStringToObject(root, "msg", "Folder already exists");
        return root;
    }
    if (res) mysql_free_result(res);

    snprintf(sql, sizeof(sql), 
             "INSERT INTO files (user_id, file_name, file_size, file_path, file_type, parent_id) "
             "VALUES (%ld, '%s', 0, '/', 1, %d)", 
             user_id, esc_name, parent_id);

    if (db_execute_update(db, sql) > 0) {
        cJSON_AddNumberToObject(root, "code", 0);
        cJSON_AddStringToObject(root, "msg", "Folder created successfully");
    } else {
        cJSON_AddNumberToObject(root, "code", 500);
        cJSON_AddStringToObject(root, "msg", "Failed to create folder");
    }

    return root;
}

// 辅助：检查剩余配额
static int check_quota_enough(DBConnection *db, long user_id, long long file_size) {
    char sql[2048];
    snprintf(sql, sizeof(sql), 
             "SELECT (total_quota - used_quota) as remaining FROM user_storage_quota WHERE user_id=%ld", user_id);
    
    MYSQL_RES *res = NULL;
    int enough = 0;

    res = db_execute_query(db, sql);
    
    if (res) {
        if (mysql_num_rows(res) > 0) {
            MYSQL_ROW row = mysql_fetch_row(res);
            long long remaining = atoll(row[0]);
            if (remaining >= file_size) enough = 1;
        }
        mysql_free_result(res);
    }
    return enough;
}

cJSON* handle_upload_check(DBConnection *db, long user_id, const cJSON *req_json) {
    if (!req_json) {
        cJSON *root = cJSON_CreateObject();
        cJSON_AddNumberToObject(root, "code", 500);
        cJSON_AddStringToObject(root, "msg", "Invalid JSON Request");
        return root;
    }

    cJSON *root = cJSON_CreateObject();
    // 安全获取MD5字段
    cJSON *md5_obj = cJSON_GetObjectItem(req_json, "md5");
    if (!md5_obj || !md5_obj->valuestring) {
        cJSON_AddNumberToObject(root, "code", 400);
        cJSON_AddStringToObject(root, "msg", "Missing or invalid md5 parameter");
        return root;
    }
    const char *md5_raw = md5_obj->valuestring;
    
    // 验证MD5格式（防止路径穿越）
    if (strlen(md5_raw) != 32) {
        cJSON_AddNumberToObject(root, "code", 400);
        cJSON_AddStringToObject(root, "msg", "Invalid MD5 length");
        return root;
    }
    for (int i = 0; i < 32; i++) {
        if (!isxdigit(md5_raw[i])) {
            cJSON_AddNumberToObject(root, "code", 400);
            cJSON_AddStringToObject(root, "msg", "Invalid MD5 format");
            return root;
        }
    }
    
    // 转义MD5防止SQL注入
    char esc_md5[128];
    db_escape_string(db, esc_md5, md5_raw, strlen(md5_raw));
    
    long long file_size = cJSON_GetObjectItem(req_json, "file_size")->valueint;
    const char *file_name = cJSON_GetObjectItem(req_json, "file_name")->valuestring;
    int parent_id = cJSON_GetObjectItem(req_json, "parent_id")->valueint;

    // 正确的参数检查
    if (strlen(esc_md5) == 0 || file_size <= 0) {
        cJSON_AddNumberToObject(root, "code", 400);
        cJSON_AddStringToObject(root, "msg", "Invalid parameters");
        return root;
    }

    // 检查配额
    int quota_status = check_quota_enough(db, user_id, file_size);
    if (quota_status == 0) {
        cJSON_AddNumberToObject(root, "code", 402);
        cJSON_AddStringToObject(root, "msg", "Storage quota exceeded");
        return root;
    }

    // 秒传检测：查询 files 表是否存在该 MD5
    char sql[2048];
    char existing_path[512];
    
    snprintf(sql, sizeof(sql), "SELECT file_path FROM files WHERE md5='%s'", esc_md5);
    MYSQL_RES *res = db_execute_query(db, sql);
    
    if (res && mysql_num_rows(res) > 0) {
        MYSQL_ROW row = mysql_fetch_row(res);
        strncpy(existing_path, row[0], sizeof(existing_path));
        existing_path[sizeof(existing_path)-1] = '\0';
        mysql_free_result(res);
        res = NULL; // 防止后续误释放

        char esc_name[256];
        db_escape_string(db, esc_name, file_name, strlen(file_name));
        
        snprintf(sql, sizeof(sql), 
                 "INSERT INTO files (user_id, file_name, file_size, file_path, file_type, parent_id, md5) "
                 "VALUES (%ld, '%s', %lld, '%s', 0, %d, '%s')", 
                 user_id, esc_name, file_size, existing_path, parent_id, esc_md5);
        
        if (db_execute_update(db, sql) > 0) {
            snprintf(sql, sizeof(sql), "UPDATE user_storage_quota SET used_quota = used_quota + %lld WHERE user_id=%ld", file_size, user_id);
            db_execute_update(db, sql);
            cJSON_AddNumberToObject(root, "code", 0);
            cJSON_AddStringToObject(root, "msg", "Instant upload success");
            cJSON *data = cJSON_CreateObject();
            cJSON_AddStringToObject(data, "status", "instant");
            cJSON_AddItemToObject(root, "data", data);
            return root;
        } else {
            cJSON_AddNumberToObject(root, "code", 500);
            cJSON_AddStringToObject(root, "msg", "DB error during instant upload");
            return root;
        }
    }
    if (res) {
        mysql_free_result(res);
        res = NULL;
    }

    // 断点续传检测
    char record_id_str[64];
    char offset_str[64];
    
    snprintf(sql, sizeof(sql), 
             "SELECT record_id, offset, status FROM file_records WHERE user_id=%ld AND file_md5='%s'", 
             user_id, esc_md5);
    
    res = db_execute_query(db, sql);

    if (res && mysql_num_rows(res) > 0) {
        MYSQL_ROW row = mysql_fetch_row(res);
        strcpy(record_id_str, row[0]);
        strcpy(offset_str, row[1]);
        int status = atoi(row[2]);
        mysql_free_result(res);
        res = NULL;

        if (status == 0) {
            cJSON_AddNumberToObject(root, "code", 0);
            cJSON_AddStringToObject(root, "msg", "Resume upload");
            cJSON *data = cJSON_CreateObject();
            cJSON_AddStringToObject(data, "status", "resume");
            cJSON_AddNumberToObject(data, "offset", atoll(offset_str));
            cJSON_AddItemToObject(root, "data", data);
            return root;
        }
    }
    if (res) {
        mysql_free_result(res);
        res = NULL;
    }

    // 普通上传
    char temp_path[512];
    // 使用已验证的md5_raw（仅含十六进制字符，安全）
    snprintf(temp_path, sizeof(temp_path), "/storage/upload_%ld_%s.tmp", user_id, md5_raw);

    // 在插入前，先删除该文件所有已完成的旧记录（status=1）
    // 解决了重复上传同一文件时的唯一索引冲突问题
    snprintf(sql, sizeof(sql), "DELETE FROM file_records WHERE user_id=%ld AND file_md5='%s' AND status=1", user_id, esc_md5);
    db_execute_update(db, sql); // 忽略结果，无论删没删都继续

    snprintf(sql, sizeof(sql), "INSERT INTO file_records (user_id, file_md5, file_size, file_path, status, offset) "
             "VALUES (%ld, '%s', %lld, '%s', 0, 0)", 
             user_id, esc_md5, file_size, temp_path);
    
    if (db_execute_update(db, sql) > 0) {
        // 插入成功，是新任务
        cJSON_AddNumberToObject(root, "code", 0);
        cJSON_AddStringToObject(root, "msg", "Ready to upload");
        cJSON *data = cJSON_CreateObject();
        cJSON_AddStringToObject(data, "status", "new");
        cJSON_AddNumberToObject(data, "offset", 0);
        cJSON_AddItemToObject(root, "data", data);
    } else {
        // 插入失败，说明存在 status=0 的并发竞争（被其他线程抢先插入了）
        fprintf(stderr, "Concurrent insert detected for MD5 %s, re-querying.\n", esc_md5);
        
        // 再次查询（此时查 status=0 必然能查到，因为是唯一索引限制住了）
        snprintf(sql, sizeof(sql), "SELECT record_id, offset, status FROM file_records WHERE user_id=%ld AND file_md5='%s' AND status=0", user_id, esc_md5);
        MYSQL_RES *res2 = db_execute_query(db, sql);
        if (res2 && mysql_num_rows(res2) > 0) {
            MYSQL_ROW row2 = mysql_fetch_row(res2);
            // 找到了，返回断点续传
            cJSON_AddNumberToObject(root, "code", 0);
            cJSON_AddStringToObject(root, "msg", "Resume upload (Concurrent)");
            cJSON *data = cJSON_CreateObject();
            cJSON_AddStringToObject(data, "status", "resume");
            cJSON_AddNumberToObject(data, "offset", atoll(row2[1]));
            cJSON_AddItemToObject(root, "data", data);
            mysql_free_result(res2);
        } else {
            // 极端情况：如果这里还找不到，说明是 status=1 的残留数据没清干净（虽然前面删了，但为了保险）
            cJSON_AddNumberToObject(root, "code", 500);
            cJSON_AddStringToObject(root, "msg", "Database state error (record exists but not active)");
        }
    }
    return root;
}


void handle_upload_chunk(int client_fd, DBConnection *db, long user_id, HttpRequest *req) {
    char md5[64] = {0};
    char offset_str[32] = {0};
    get_url_param(req->url, "md5", md5);
    get_url_param(req->url, "offset", offset_str);
    int offset = atoi(offset_str);

    // const int CHUNK_SIZE_C = 5 * 1024 * 1024;
    char filepath_real[512]; 
    char sql[2048];

    // 查询路径
    snprintf(sql, sizeof(sql), 
             "SELECT file_path FROM file_records WHERE user_id=%ld AND file_md5='%s' AND status=0", 
             user_id, md5);
    
    MYSQL_RES *res = db_execute_query(db, sql);
    if (!res || mysql_num_rows(res) == 0) {
        if(res) mysql_free_result(res);
        const char *not_found = "HTTP/1.1 404 Not Found\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: 0\r\n\r\n";
        send(client_fd, not_found, strlen(not_found), 0);
        close(client_fd);
        return;
    }

    MYSQL_ROW row = mysql_fetch_row(res);
    strncpy(filepath_real, row[0], sizeof(filepath_real));
    filepath_real[sizeof(filepath_real)-1] = '\0';
    
    mysql_free_result(res);

    if (!req->body || req->body_len == 0) {
        const char *err_header = "HTTP/1.1 400 Bad Request\r\nAccess-Control-Allow-Origin: *\r\n\r\n";
        send(client_fd, err_header, strlen(err_header), 0);
        close(client_fd);
        return;
    }

    const char *dir_path = "/storage";
    struct stat st = {0};
    if (stat(dir_path, &st) == -1) {
        if (mkdir(dir_path, 0777) == -1) {
            const char *err_header = "HTTP/1.1 500 Server Error\r\nAccess-Control-Allow-Origin: *\r\n\r\n";
            send(client_fd, err_header, strlen(err_header), 0);
            close(client_fd);
            return;
        }
    }

    int fd = open(filepath_real, O_WRONLY | O_CREAT, 0644);
    if (fd < 0) {
        const char *err_header = "HTTP/1.1 500 Internal Error\r\nAccess-Control-Allow-Origin: *\r\n\r\n";
        send(client_fd, err_header, strlen(err_header), 0);
        close(client_fd);
        return;
    }

    ssize_t written = pwrite(fd, req->body, req->body_len, (off_t)offset);
    close(fd);
    // 计算新的总偏移量
    long new_total_offset = offset + written;

    if (written > 0) {
        // int new_total_offset = offset + written;
        // 强制更新 DB
        snprintf(sql, sizeof(sql), 
                 "UPDATE file_records SET offset = %ld WHERE user_id=%ld AND file_md5='%s'", 
                 (long)new_total_offset, user_id, md5);
        db_execute_update(db, sql);
    }

    // 返回JSON格式的确认信息，包含新的offset
    char response[256];
    snprintf(response, sizeof(response), 
             "HTTP/1.1 200 OK\r\n"
             "Content-Type: application/json\r\n"
             "Access-Control-Allow-Origin: *\r\n"
             "Content-Length: %d\r\n"
             "\r\n"
             "{\"code\":0,\"data\":{\"offset\":%ld}}", 
             35, new_total_offset);
    send(client_fd, response, strlen(response), 0);
    close(client_fd);
}

cJSON* handle_upload_complete(DBConnection *db, long user_id, const cJSON *req_json) {
    cJSON *root = cJSON_CreateObject();
    
    cJSON *md5_item = cJSON_GetObjectItem(req_json, "md5");
    if (!md5_item || !md5_item->valuestring) {
        cJSON_AddNumberToObject(root, "code", 400);
        cJSON_AddStringToObject(root, "msg", "Missing md5");
        return root;
    }
    const char *md5 = md5_item->valuestring;

    cJSON *name_item = cJSON_GetObjectItem(req_json, "file_name");
    cJSON *pid_item = cJSON_GetObjectItem(req_json, "parent_id");
    
    if (!name_item || !name_item->valuestring) {
        cJSON_AddNumberToObject(root, "code", 400);
        cJSON_AddStringToObject(root, "msg", "Missing file_name");
        return root;
    }
    const char *file_name = name_item->valuestring;
    int parent_id = pid_item ? pid_item->valueint : 0;

    char sql[2048];
    char final_path_real[512]; // 本地缓冲区

    // 查询上传记录
    snprintf(sql, sizeof(sql), 
             "SELECT file_size, file_path FROM file_records WHERE user_id=%ld AND file_md5='%s' AND status=0", 
             user_id, md5);
    
    MYSQL_RES *res = NULL;
    res = db_execute_query(db, sql);
    
    if (!res || mysql_num_rows(res) == 0) {
        if(res) mysql_free_result(res);
        cJSON_AddNumberToObject(root, "code", 404);
        cJSON_AddStringToObject(root, "msg", "Upload record not found");
        return root;
    }

    MYSQL_ROW row = mysql_fetch_row(res);
    long long file_size = atoll(row[0]);
    
    // 拷贝路径
    strncpy(final_path_real, row[1], sizeof(final_path_real));
    final_path_real[sizeof(final_path_real)-1] = '\0';
    
    mysql_free_result(res);

    char esc_name[256];
    db_escape_string(db, esc_name, file_name, strlen(file_name));

    // 插入文件信息 (必须成功)
    snprintf(sql, sizeof(sql), 
             "INSERT INTO files (user_id, file_name, file_size, file_path, file_type, parent_id, md5) "
             "VALUES (%ld, '%s', %lld, '%s', 0, %d, '%s')", 
             user_id, esc_name, file_size, final_path_real, parent_id, md5);

    int insert_ret = db_execute_update(db, sql);
    if (insert_ret <= 0) {
        cJSON_AddNumberToObject(root, "code", 500);
        cJSON_AddStringToObject(root, "msg", "Failed to save file metadata");
        return root;
    }

    snprintf(sql, sizeof(sql), "UPDATE file_records SET status=1 WHERE user_id=%ld AND file_md5='%s'", user_id, md5);
    db_execute_update(db, sql);

    snprintf(sql, sizeof(sql), "UPDATE user_storage_quota SET used_quota = used_quota + %lld WHERE user_id=%ld", file_size, user_id);
    db_execute_update(db, sql);

    snprintf(sql, sizeof(sql), 
             "INSERT INTO audit_logs (user_id, action_type, detail) VALUES (%ld, 'UPLOAD', 'File %s uploaded')", 
             user_id, esc_name);
    db_execute_update(db, sql);

    cJSON_AddNumberToObject(root, "code", 0);
    cJSON_AddStringToObject(root, "msg", "Upload complete");
    return root;
}

void handle_file_download(int client_fd, DBConnection *db, long user_id, const cJSON *req_json) {
    cJSON *id_obj = cJSON_GetObjectItem(req_json, "file_id");
    if (!id_obj) {
        const char *err = "HTTP/1.1 400 Bad Request\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: 0\r\n\r\n";
        send(client_fd, err, strlen(err), 0);
        close(client_fd);
        return;
    }
    long file_id = id_obj->valueint;

    char sql[2048]; // 增大缓冲区
    char filename_real[256]; 
    char filepath_real[512];

    snprintf(sql, sizeof(sql), "SELECT file_name, file_path, file_size FROM files WHERE file_id=%ld AND user_id=%ld", file_id, user_id);
    
    MYSQL_RES *res = NULL;
    res = db_execute_query(db, sql);
    
    if (!res || mysql_num_rows(res) == 0) {
        if(res) mysql_free_result(res);
        const char *not_found = "HTTP/1.1 404 Not Found\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: 0\r\n\r\n";
        send(client_fd, not_found, strlen(not_found), 0);
        close(client_fd);
        return;
    }

    MYSQL_ROW row = mysql_fetch_row(res);
    
    strncpy(filename_real, row[0], sizeof(filename_real));
    filename_real[sizeof(filename_real)-1] = '\0';
    
    strncpy(filepath_real, row[1], sizeof(filepath_real));
    filepath_real[sizeof(filepath_real)-1] = '\0';
    
    off_t file_size = atoll(row[2]); 

    mysql_free_result(res);

    int file_fd = open(filepath_real, O_RDONLY);
    if (file_fd < 0) {
        const char *server_err = "HTTP/1.1 500 Internal Server Error\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: 0\r\n\r\n";
        send(client_fd, server_err, strlen(server_err), 0);
        close(client_fd);
        return;
    }

    char header[1024];
    snprintf(header, sizeof(header), 
             "HTTP/1.1 200 OK\r\n"
             "Content-Type: application/octet-stream\r\n"
             "Content-Disposition: attachment; filename=\"%s\"\r\n"
             "Content-Length: %ld\r\n"
             "Access-Control-Allow-Origin: *\r\n"
             "Connection: close\r\n"
             "\r\n", filename_real, (long)file_size);
    
    send(client_fd, header, strlen(header), 0);
    sendfile(client_fd, file_fd, NULL, file_size);

    close(file_fd);
    close(client_fd);
}

cJSON* handle_file_rename(DBConnection *db, long user_id, const cJSON *req_json) {
    cJSON *root = cJSON_CreateObject();
    cJSON *id_obj = cJSON_GetObjectItem(req_json, "file_id");
    cJSON *name_obj = cJSON_GetObjectItem(req_json, "new_name");

    if (!id_obj || !name_obj) {
        cJSON_AddNumberToObject(root, "code", 400);
        cJSON_AddStringToObject(root, "msg", "Missing parameters");
        return root;
    }

    long file_id = id_obj->valueint;
    const char *new_name = name_obj->valuestring;

    char sql[2048];
    // char current_name[512];
    char esc_name[256];
    
    // 1. 查询信息
    snprintf(sql, sizeof(sql), "SELECT parent_id, file_type, file_name FROM files WHERE file_id=%ld AND user_id=%ld", file_id, user_id);
    MYSQL_RES *res = NULL;
    res = db_execute_query(db, sql);
    
    if (!res || mysql_num_rows(res) == 0) {
        if(res) mysql_free_result(res);
        cJSON_AddNumberToObject(root, "code", 404);
        cJSON_AddStringToObject(root, "msg", "File not found");
        return root;
    }
    MYSQL_ROW row = mysql_fetch_row(res);
    int parent_id = atoi(row[0]);
    mysql_free_result(res);

    // 2. 检查同名
    db_escape_string(db, esc_name, new_name, strlen(new_name));
    snprintf(sql, sizeof(sql), 
             "SELECT file_id FROM files WHERE user_id=%ld AND parent_id=%d AND file_name='%s'", 
             user_id, parent_id, esc_name);
    res = db_execute_query(db, sql);
    if (res && mysql_num_rows(res) > 0) {
        mysql_free_result(res);
        cJSON_AddNumberToObject(root, "code", 400);
        cJSON_AddStringToObject(root, "msg", "Name already exists");
        return root;
    }
    if(res) mysql_free_result(res);

    snprintf(sql, sizeof(sql), "UPDATE files SET file_name='%s' WHERE file_id=%ld", esc_name, file_id);
    if (db_execute_update(db, sql) > 0) {
        cJSON_AddNumberToObject(root, "code", 0);
        cJSON_AddStringToObject(root, "msg", "Rename success");
    } else {
        cJSON_AddNumberToObject(root, "code", 500);
        cJSON_AddStringToObject(root, "msg", "Database error");
    }

    return root;
}

cJSON* handle_file_delete(DBConnection *db, long user_id, const cJSON *req_json) {
    cJSON *root = cJSON_CreateObject();
    cJSON *id_obj = cJSON_GetObjectItem(req_json, "file_id");
    if (!id_obj) {
        cJSON_AddNumberToObject(root, "code", 400);
        cJSON_AddStringToObject(root, "msg", "Missing file_id");
        return root;
    }
    long file_id = id_obj->valueint;
    char sql[2048];
    char filepath_real[512];
    long long file_size = 0;
    int file_type = 0;
    const char *file_md5 = NULL; 

    // 1. 查询信息 (增加 md5)
    snprintf(sql, sizeof(sql), "SELECT file_path, file_size, file_type, md5 FROM files WHERE file_id=%ld AND user_id=%ld", file_id, user_id);
    MYSQL_RES *res = NULL;
    res = db_execute_query(db, sql);

    if (!res || mysql_num_rows(res) == 0) {
        if(res) mysql_free_result(res);
        cJSON_AddNumberToObject(root, "code", 404);
        cJSON_AddStringToObject(root, "msg", "File not found");
        return root;
    }

    MYSQL_ROW row = mysql_fetch_row(res);
    strncpy(filepath_real, row[0], sizeof(filepath_real));
    filepath_real[sizeof(filepath_real)-1] = '\0';
    file_size = atoll(row[1]);
    file_type = atoi(row[2]);
    file_md5 = row[3]; // 获取 MD5
    mysql_free_result(res);

    // 2. 检查文件夹是否为空
    if (file_type == 1) {
        snprintf(sql, sizeof(sql), "SELECT count(*) FROM files WHERE parent_id=%ld", file_id);
        res = db_execute_query(db, sql);
        if (res) {
            MYSQL_ROW count_row = mysql_fetch_row(res);
            if (atoi(count_row[0]) > 0) {
                mysql_free_result(res);
                cJSON_AddNumberToObject(root, "code", 400);
                cJSON_AddStringToObject(root, "msg", "Folder is not empty");
                return root;
            }
            mysql_free_result(res);
        }
    }

    // 3. 删除物理文件
    if (file_type == 0) {
        int should_delete_physical = 1; // 默认删除

        // 检查引用计数
        if (file_md5 && strlen(file_md5) > 0) {
            snprintf(sql, sizeof(sql), "SELECT COUNT(*) FROM files WHERE md5='%s' AND file_id != %ld", file_md5, file_id);
            MYSQL_RES *count_res = db_execute_query(db, sql);
            if (count_res) {
                MYSQL_ROW count_row = mysql_fetch_row(count_res);
                if (count_row && atoi(count_row[0]) > 0) {
                    should_delete_physical = 0; // 还有引用，不删除物理文件
                }
                mysql_free_result(count_res);
            }
        }

        if (should_delete_physical) {
            if (unlink(filepath_real) != 0) {
                perror("Delete physical file failed");
            }
        }
    }

    // 4. 删除数据库记录
    snprintf(sql, sizeof(sql), "DELETE FROM files WHERE file_id=%ld", file_id);
    if (db_execute_update(db, sql) > 0) {
        // 5. 扣减配额
        if (file_type == 0) {
            snprintf(sql, sizeof(sql), "UPDATE user_storage_quota SET used_quota = used_quota - %lld WHERE user_id=%ld", file_size, user_id);
            db_execute_update(db, sql);
        }
        cJSON_AddNumberToObject(root, "code", 0);
        cJSON_AddStringToObject(root, "msg", "Delete success");
    } else {
        cJSON_AddNumberToObject(root, "code", 500);
        cJSON_AddStringToObject(root, "msg", "Database error");
    }
    return root;
}


cJSON* handle_file_move(DBConnection *db, long user_id, const cJSON *req_json) {
    cJSON *root = cJSON_CreateObject();
    cJSON *id_obj = cJSON_GetObjectItem(req_json, "file_id");
    cJSON *target_id_obj = cJSON_GetObjectItem(req_json, "target_parent_id");

    if (!id_obj || !target_id_obj) {
        cJSON_AddNumberToObject(root, "code", 400);
        cJSON_AddStringToObject(root, "msg", "Missing parameters");
        return root;
    }

    long file_id = id_obj->valueint;
    long target_parent_id = target_id_obj->valueint;

    char sql[2048];
    char current_name[256];

    // 1. 检查目标文件夹
    if (target_parent_id != 0) {
        snprintf(sql, sizeof(sql), 
                 "SELECT file_id FROM files WHERE file_id=%ld AND user_id=%ld AND file_type=1", 
                 target_parent_id, user_id);
        MYSQL_RES *res = NULL;
        res = db_execute_query(db, sql);
        
        if (!res || mysql_num_rows(res) == 0) {
            if(res) mysql_free_result(res);
            cJSON_AddNumberToObject(root, "code", 404);
            cJSON_AddStringToObject(root, "msg", "Target folder not found");
            return root;
        }
        mysql_free_result(res);
    }

    // 2. 检查源文件 & 目标同名
    snprintf(sql, sizeof(sql), "SELECT file_name FROM files WHERE file_id=%ld", file_id);
    MYSQL_RES *res = db_execute_query(db, sql);
    if (!res || mysql_num_rows(res) == 0) {
        if(res) mysql_free_result(res);
        cJSON_AddNumberToObject(root, "code", 404);
        cJSON_AddStringToObject(root, "msg", "Source file not found");
        return root;
    }
    
    MYSQL_ROW row = mysql_fetch_row(res);
    strncpy(current_name, row[0], sizeof(current_name));
    current_name[sizeof(current_name)-1] = '\0';
    mysql_free_result(res);

    char esc_name[256];
    db_escape_string(db, esc_name, current_name, strlen(current_name));

    snprintf(sql, sizeof(sql), 
             "SELECT file_id FROM files WHERE user_id=%ld AND parent_id=%ld AND file_name='%s'", 
             user_id, target_parent_id, esc_name);
    res = db_execute_query(db, sql);
    if (res && mysql_num_rows(res) > 0) {
        mysql_free_result(res);
        cJSON_AddNumberToObject(root, "code", 400);
        cJSON_AddStringToObject(root, "msg", "Target already contains a file/folder with this name");
        return root;
    }
    if(res) mysql_free_result(res);

    // 3. 执行移动
    snprintf(sql, sizeof(sql), "UPDATE files SET parent_id=%ld WHERE file_id=%ld", target_parent_id, file_id);
    if (db_execute_update(db, sql) > 0) {
        cJSON_AddNumberToObject(root, "code", 0);
        cJSON_AddStringToObject(root, "msg", "Move success");
    } else {
        cJSON_AddNumberToObject(root, "code", 500);
        cJSON_AddStringToObject(root, "msg", "Database error");
    }

    return root;
}
```

### `src/main.c`
```c
#include "../include/conf.h"
#include "../include/db_op.h"
#include "../include/server.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <unistd.h>

Config g_conf;

DBPool *g_db_pool; // 替换全局连接为连接池


int main() {
    // 1. 加载配置
    if (load_config("config/cloud_disk.conf", &g_conf) != 0) return -1;

    // 2. 初始化数据库
    if (db_init() != 0) return -1;

    // 获取cpu核心数
    int cpu_cores = sysconf(_SC_NPROCESSORS_ONLN);
    // 线程池大小 = cpu核心数 * 2
    int thread_count = cpu_cores * 4;

    // 连接池大小 = 线程池大小 * 2
    int pool_size = thread_count * 2;  // 8
    if (pool_size < 4) pool_size = 4;

    printf("CPU cores: %d, Thread pool size: %d, DB pool size: %d\n", 
        cpu_cores, thread_count, pool_size);

    g_db_pool = db_pool_create(&g_conf, pool_size);
    // g_db = db_connect(&g_conf);
    if (!g_db_pool) {
        fprintf(stderr, "DB pool create failed.\n");
        return -1;
    }


    printf("CPU cores: %d, Thread pool size: %d\n", cpu_cores, thread_count);
    // 3. 启动服务器 (端口 8080, 线程池大小根据CPU核心数自动调整)
    start_server(8080, thread_count);

    // 清理资源 
    db_pool_destroy(g_db_pool);
    mysql_library_end();

    return 0;
}
```

### `src/protocol.c`
```c
#include "../include/protocol.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>

static HttpMethod get_method_type(const char *method) {
    if (strcmp(method, "GET") == 0) return HTTP_GET;
    if (strcmp(method, "POST") == 0) return HTTP_POST;
    if (strcmp(method, "PUT") == 0) return HTTP_PUT;
    if (strcmp(method, "DELETE") == 0) return HTTP_DELETE;
    if (strcmp(method, "OPTIONS") == 0) return HTTP_OPTIONS; // 支持 OPTIONS
    return HTTP_UNKNOWN;
}

int parse_http_request(const char *buffer, int size, HttpRequest *req) {
    memset(req, 0, sizeof(HttpRequest));

    // 1. 解析请求行
    char *line_end = strstr(buffer, "\r\n");
    if (!line_end) return -1; // 头部太短

    char method[16] = {0};
    const char *start = buffer;
    const char *space = strchr(start, ' ');
    if (!space || space - start > 15) return -1;
    strncpy(method, start, space - start);
    req->method = get_method_type(method);

    start = space + 1;
    space = strchr(start, ' ');
    if (!space || space - start > 255) return -1;
    strncpy(req->url, start, space - start);
    req->url[space - start] = '\0'; // 确保 URL 结束符

    // 2. 解析 Headers (寻找 Content-Length)
    char *body_start = strstr(buffer, "\r\n\r\n");
    if (!body_start) return -1; // 缺少头部结束符，格式错误

    char *len_ptr = strstr(buffer, "Content-Length:");
    int content_length = 0;
    if (len_ptr) {
        sscanf(len_ptr, "Content-Length: %d", &content_length);
    }

    // 3. 提取 Body (仅在 Content-Length > 0 时分配)
    // 计算 body 指针
    const char *body_ptr = body_start + 4;
    // 计算剩余大小
    int body_len = size - (body_ptr - buffer);

    if (content_length > 0) {
        // 安全检查：防止声明长度比实际收到的还大
        if (content_length > body_len) {
            // 只拷贝能拷贝的
            content_length = body_len;
        }

        req->body = (char*)malloc(content_length + 1);
        if (!req->body) return -1;
        
        memcpy(req->body, body_ptr, content_length);
        req->body[content_length] = '\0';
        req->body_len = content_length;
    } else {
        req->body = NULL;
        req->body_len = 0;
    }

    // 解析 Headers Token 和 File-Offset
    if (strstr(buffer, "Token:")) {
        sscanf(strstr(buffer, "Token:"), "Token: %127s", req->token);
    }
    if (strstr(buffer, "File-Offset:")) {
        sscanf(strstr(buffer, "File-Offset:"), "File-Offset: %d", &req->file_offset);
    }

    return 0;
}

void free_http_request(HttpRequest *req) {
    if (req->body) {
        free(req->body);
        req->body = NULL;
    }
}
```

### `src/server.c`
```c
#include "../include/server.h"
#include "../include/thread_pool.h"
#include "../include/conf.h"
#include "../include/db_op.h"
#include "../include/protocol.h"
#include "../include/api_util.h"
#include "../include/user_handler.h"
#include "../include/file_handler.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>
#include <sys/epoll.h>
#include <pthread.h>

#define MAX_EVENTS 256
#define BUFFER_SIZE (7 * 1024 * 1024) // 2MB 缓冲区
#define MAX_POOL_SIZE 100 // 全局缓冲池

// 全局变量
extern Config g_conf;
extern DBConnection *g_db;
extern DBPool *g_db_pool; // 替换全局连接为连接池


static int set_nonblocking(int sockfd) {
    int flags = fcntl(sockfd, F_GETFL, 0);
    if (flags == -1) return -1;
    return fcntl(sockfd, F_SETFL, flags | O_NONBLOCK);
}

// 设置 Socket 超时，防止恶意或异常请求导致线程长时间阻塞
// 动态设置 Socket 超时（根据请求类型）
static int set_socket_timeout(int sockfd, int is_upload) {
    struct timeval tv;
    if (is_upload) {
        tv.tv_sec = 60;  // 上传请求：60秒超时
    } else {
        tv.tv_sec = 30;   // 普通请求：30秒超时
    }
    tv.tv_usec = 0;
    if (setsockopt(sockfd, SOL_SOCKET, SO_RCVTIMEO, (const char*)&tv, sizeof(tv)) < 0) {
        perror("setsockopt timeout");
        return -1;
    }
    return 0;
}
// 处理客户端请求
void process_client_request(void *arg) {
    int client_fd = *(int*)arg;
    free(arg); 
    // 1. 变量声明区（必须全部在函数开头） 
    char *buffer = NULL;           // 接收缓冲区
    DBConnection *db = NULL;       // 数据库连接（初始化为NULL）
    HttpRequest req;               // HTTP请求结构体
    cJSON *req_json = NULL;        // 解析后的JSON对象
    int total_read = 0;            // 已读取字节数
    int content_length = 0;        // Content-Length
    int header_found = 0;          // 是否找到header结束标记
    int header_len = 0;            // header长度
    int flags = 0;                 // socket标志
    // 初始化关键结构体
    memset(&req, 0, sizeof(req)); // 关键：清零结构体，避免垃圾数据干扰解析
    
    // 1. 分配内存 (减小了 Size)
    buffer = malloc(BUFFER_SIZE);
    if (!buffer) {
        printf("MALLOC FAILED!\n"); // 打印日志排查
        close(client_fd);
        return;
    } 

    // set_socket_timeout(client_fd, is_upload_request);
    // 先设置默认超时
    // 这里直接设置一个能兼容上传的较长超时，或者默认超时
    if (set_socket_timeout(client_fd, 0) < 0) { // 传入0，在函数内部设为30秒或60秒
        goto cleanup;
    }

    // 2. 设置阻塞模式
    flags = fcntl(client_fd, F_GETFL, 0);
    fcntl(client_fd, F_SETFL, flags & ~O_NONBLOCK);

    // 3. 循环读取 Header
    while (total_read < BUFFER_SIZE - 1) {
        int bytes = recv(client_fd, buffer + total_read, (BUFFER_SIZE - 1) - total_read, 0);
        if (bytes < 0) {
            if (errno == EAGAIN || errno == EWOULDBLOCK) {
                // 超时了？正常来说不会 EAGAIN，因为设置了 SO_RCVTIMEO
                // 如果这里触发了，说明超时了
                printf("Timeout or Error\n");
            } else {
                perror("recv error");
            }
            goto cleanup;
        }
        if (bytes == 0) {
            printf("Client closed connection\n");
            goto cleanup;
        }
        total_read += bytes;
        buffer[total_read] = '\0'; 

        char *body_start = strstr(buffer, "\r\n\r\n");
        if (body_start) {
            header_len = body_start - buffer + 4; 
            char *len_ptr = strstr(buffer, "Content-Length:");
            if (len_ptr) {
                sscanf(len_ptr, "Content-Length: %d", &content_length);
            }
            header_found = 1;
            break; 
        }
    }

    // 4. 循环读取 Body
    if (header_found) {
        int total_needed = header_len + content_length;
        // 防止 Content-Length 声称的数值过大，导致 Buffer 溢出
        if (total_needed > BUFFER_SIZE) {
            printf("Request too large (declared %d, buffer %d)\n", total_needed, BUFFER_SIZE);
            goto cleanup;
        }

        while (total_read < total_needed) {
            int bytes = recv(client_fd, buffer + total_read, total_needed - total_read, 0);
            if (bytes < 0) {
                if (errno == EAGAIN || errno == EWOULDBLOCK) {
                     printf("Timeout reading body\n");
                } else {
                    perror("recv body error");
                }
                goto cleanup;
            }
            if (bytes == 0) {
                printf("Client disconnected during body transfer\n");
                goto cleanup;
            }
            total_read += bytes;
        }
    } else {
        printf("Header error\n");
        goto cleanup;
    }

    // 获取数据库连接：改为从连接池获取，且不再持有全局锁
    db = db_pool_acquire(g_db_pool);
    if (!db) {
        fprintf(stderr, "Failed to acquire DB connection.\n");
        const char *err503 = "HTTP/1.1 503 Service Unavailable\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: 0\r\n\r\n";
        send(client_fd, err503, strlen(err503), 0);
        goto cleanup;
    }

    // 5. 解析 HTTP 请求

    if (parse_http_request(buffer, total_read, &req) != 0) {
        const char *bad_resp = "HTTP/1.1 400 Bad Request\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: 0\r\n\r\n";
        send(client_fd, bad_resp, strlen(bad_resp), 0);
        goto cleanup;
    }

    printf("[Thread %lu] Handling: %s %s\n", pthread_self(), 
           (req.method==HTTP_GET?"GET":"POST"), req.url);

    
    // 全局解析 JSON，并确保非 NULL
    // 即使没有 body，也创建一个空对象，方便 file_handler 使用 cJSON_GetObjectItem
    // cJSON *req_json = NULL;
    if (req.method == HTTP_POST && req.body_len > 0) {
        req_json = cJSON_Parse(req.body);
    }
    
    // 如果解析失败（例如 Body 不是 JSON），也创建一个空对象，防止后续函数访问空指针
    if (!req_json) {
        req_json = cJSON_CreateObject();
    }
           // 移除外层全局锁
           // 之前在这里枷锁，导致api串行执行
           // 现在改为在具体处理函数内枷锁
    // 6. 处理 OPTIONS (CORS 预检)
    if (req.method == HTTP_OPTIONS) {
        const char *cors_preflight = 
            "HTTP/1.1 200 OK\r\n"
            "Access-Control-Allow-Origin: *\r\n"
            "Access-Control-Allow-Methods: POST, GET, OPTIONS\r\n"
            "Access-Control-Allow-Headers: Content-Type, Token\r\n"
            "\r\n";
        send(client_fd, cors_preflight, strlen(cors_preflight), 0);
        goto cleanup; 
    }

    cJSON *json_resp_obj = NULL; 

    // --- 用户模块 ---
    if (strcmp(req.url, "/api/user/login") == 0 && req.method == HTTP_POST) {
        // 修改-传入db,移除锁参数
        json_resp_obj = handle_login(db, req_json, "127.0.0.1");
    } 
    else if (strcmp(req.url, "/api/user/register") == 0 && req.method == HTTP_POST) {
        json_resp_obj = handle_register(db, req_json);
    }

    // --- 文件模块 ---
    else if (strncmp(req.url, "/api/files/", 11) == 0) {
        // 改进：支持URL参数中的Token,用于windows.open GET
        char token_from_url[128] = {0};
        get_url_param(req.url, "token", token_from_url);
        // 优先使用Header下的Token, 如果没有则使用url中的
        const char *effective_token = (strlen(req.token) > 0) ? req.token : token_from_url;
        // 验证 Token，传入db, 移除锁参数
        long user_id = verify_user_token(db, effective_token);
        
        if (user_id <= 0) {
            json_resp_obj = cJSON_CreateObject();
            cJSON_AddNumberToObject(json_resp_obj, "code", 401);
            cJSON_AddStringToObject(json_resp_obj, "msg", "Invalid or expired token");
        } else {
            // 文件操作使用同一个 req_json
            if (strcmp(req.url, "/api/files/list") == 0 && req.method == HTTP_POST) {
                json_resp_obj = handle_file_list(db, user_id, req_json);
            }
            else if (strcmp(req.url, "/api/files/mkdir") == 0 && req.method == HTTP_POST) {
                json_resp_obj = handle_file_mkdir(db, user_id, req_json);
            }
            else if (strcmp(req.url, "/api/files/rename") == 0 && req.method == HTTP_POST) {
                json_resp_obj = handle_file_rename(db, user_id, req_json);
            }
            else if (strcmp(req.url, "/api/files/delete") == 0 && req.method == HTTP_POST) {
                json_resp_obj = handle_file_delete(db, user_id, req_json);
            }
            else if (strcmp(req.url, "/api/files/move") == 0 && req.method == HTTP_POST) {
                json_resp_obj = handle_file_move(db, user_id, req_json);
            }
            else if (strcmp(req.url, "/api/files/upload/check") == 0 && req.method == HTTP_POST) {
                json_resp_obj = handle_upload_check(db, user_id, req_json);
            }
            else if (strcmp(req.url, "/api/files/upload/complete") == 0 && req.method == HTTP_POST) {
                json_resp_obj = handle_upload_complete(db, user_id, req_json);
            }
            else if (strncmp(req.url, "/api/files/view", 15) == 0 && req.method == HTTP_GET) {
                handle_file_view(client_fd, db, user_id, &req);
                json_resp_obj = (cJSON*)0x1; //标记处理，防止后续发送JSON响应。
            }
            else if (strcmp(req.url, "/api/files/download") == 0 && req.method == HTTP_POST) {
                handle_file_download(client_fd, db, user_id, req_json);
                json_resp_obj = (cJSON*)0x1; 
            }
            else if (strncmp(req.url, "/api/files/upload/chunk", 23) == 0 && req.method == HTTP_POST) {
                // 这里不传 req_json，而是 &req
                handle_upload_chunk(client_fd, db, user_id, &req);
                json_resp_obj = (cJSON*)0x1; 
            }
            else {
                json_resp_obj = cJSON_CreateObject();
                cJSON_AddNumberToObject(json_resp_obj, "code", 404);
                cJSON_AddStringToObject(json_resp_obj, "msg", "File API Not Found");
            }
        }
    }
    else {
        json_resp_obj = cJSON_CreateObject();
        cJSON_AddNumberToObject(json_resp_obj, "code", 404);
        cJSON_AddStringToObject(json_resp_obj, "msg", "API Not Found");
    }

    // 8. 发送响应
    if (json_resp_obj == (cJSON*)0x1) {
        goto cleanup; // 清理资源
    }

    if(json_resp_obj) {
        char *json_body = cJSON_PrintUnformatted(json_resp_obj); 
        cJSON_Delete(json_resp_obj); 

        if (json_body) {
            char header[512];
            int body_len = strlen(json_body);
            snprintf(header, sizeof(header), 
                    "HTTP/1.1 200 OK\r\n"
                    "Content-Type: application/json\r\n"
                    "Content-Length: %d\r\n"
                    "Access-Control-Allow-Origin: *\r\n"
                    "Access-Control-Allow-Headers: Content-Type, Token\r\n"
                    "Connection: close\r\n"
                    "\r\n", body_len);
            
            send(client_fd, header, strlen(header), 0);
            send(client_fd, json_body, body_len, 0);
            free(json_body);
        }
    }

    // 9. 统一清理标签
cleanup:
    free_http_request(&req);
    // 手动释放 req_json，在函数内部 malloc/parse 的
    if (req_json) cJSON_Delete(req_json);
    free(buffer); 
    close(client_fd);
    // 释放数据库连接回池
    // 保证所有退出路径上归还，不然连接池耗尽
    if (db) db_pool_release(g_db_pool, db);

}

void start_server(int port, int thread_count) {
    threadpool_t *pool = threadpool_create(thread_count);
    printf("Thread pool created with %d threads.\n", thread_count);

    int listen_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (listen_fd < 0) {
        perror("socket");
        exit(1);
    }

    int opt = 1;
    setsockopt(listen_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    struct sockaddr_in server_addr;
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = htonl(INADDR_ANY);
    server_addr.sin_port = htons(port);

    if (bind(listen_fd, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("bind");
        exit(1);
    }

    if (listen(listen_fd, 128) < 0) {
        perror("listen");
        exit(1);
    }

    int epoll_fd = epoll_create1(0);
    if (epoll_fd < 0) {
        perror("epoll_create1");
        exit(1);
    }

    struct epoll_event ev, events[MAX_EVENTS];
    ev.events = EPOLLIN;
    ev.data.fd = listen_fd;
    if (epoll_ctl(epoll_fd, EPOLL_CTL_ADD, listen_fd, &ev) < 0) {
        perror("epoll_ctl");
        exit(1);
    }

    printf("Server started on port %d. Waiting for connections...\n", port);

    while (1) {
        int nfds = epoll_wait(epoll_fd, events, MAX_EVENTS, -1);
        if (nfds == -1) {
            perror("epoll_wait");
            break;
        }

        for (int i = 0; i < nfds; i++) {
            if (events[i].data.fd == listen_fd) {
                struct sockaddr_in client_addr;
                socklen_t client_len = sizeof(client_addr);
                int client_fd = accept(listen_fd, (struct sockaddr*)&client_addr, &client_len);
                if (client_fd < 0) {
                    perror("accept");
                    continue;
                }
                set_nonblocking(client_fd);

                ev.events = EPOLLIN | EPOLLET;
                ev.data.fd = client_fd;
                if (epoll_ctl(epoll_fd, EPOLL_CTL_ADD, client_fd, &ev) < 0) {
                    perror("epoll_ctl: client");
                    close(client_fd);
                }
                printf("New connection: fd=%d\n", client_fd);
            } else {
                int client_fd = events[i].data.fd;
                
                int *pfd = (int*)malloc(sizeof(int));
                *pfd = client_fd;

                epoll_ctl(epoll_fd, EPOLL_CTL_DEL, client_fd, NULL);

                if (threadpool_add(pool, process_client_request, pfd) != 0) {
                    fprintf(stderr, "Thread pool full, dropping request.\n");
                    free(pfd);
                    close(client_fd);
                }
            }
        }
    }

    close(listen_fd);
    close(epoll_fd);
    threadpool_destroy(pool);
}
```

### `src/thread_pool.c`
```c
#include "../include/thread_pool.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <unistd.h>

// 任务结构体
typedef struct task_t {
    thread_func_t function;
    void *arg;
    struct task_t *next;
} task_t;

// 线程池结构体
struct threadpool_t {
    pthread_mutex_t lock;
    pthread_cond_t notify;
    pthread_t *threads;
    task_t *queue_head;
    task_t *queue_tail;
    int thread_count;
    int queue_size;
    int shutdown;
};

// 工作线程的回调函数
static void *threadpool_worker(void *arg) {
    threadpool_t *pool = (threadpool_t *)arg;
    task_t *task;

    while (1) {
        // 加锁
        pthread_mutex_lock(&(pool->lock));

        // 等待条件变量，直到有任务或 shutdown
        while ((pool->queue_size == 0) && (!pool->shutdown)) {
            pthread_cond_wait(&(pool->notify), &(pool->lock));
        }

        if (pool->shutdown) {
            pthread_mutex_unlock(&(pool->lock));
            pthread_exit(NULL);
        }

        // 取出任务
        task = pool->queue_head;
        if (task == NULL) {
            pthread_mutex_unlock(&(pool->lock));
            continue;
        }
        
        pool->queue_head = task->next;
        pool->queue_size--;
        pthread_mutex_unlock(&(pool->lock));

        // 执行任务
        (task->function)(task->arg);
        free(task);
    }
    return NULL;
}

threadpool_t *threadpool_create(int thread_count) {
    threadpool_t *pool = (threadpool_t *)malloc(sizeof(threadpool_t));
    if (!pool) return NULL;

    pool->thread_count = 0;
    pool->queue_size = 0;
    pool->queue_head = NULL;
    pool->queue_tail = NULL;
    pool->shutdown = 0;

    // 初始化锁和条件变量
    if (pthread_mutex_init(&(pool->lock), NULL) != 0 ||
        pthread_cond_init(&(pool->notify), NULL) != 0) {
        free(pool);
        return NULL;
    }

    // 创建线程
    pool->threads = (pthread_t *)malloc(sizeof(pthread_t) * thread_count);
    if (!pool->threads) {
        pthread_mutex_destroy(&(pool->lock));
        pthread_cond_destroy(&(pool->notify));
        free(pool);
        return NULL;
    }

    for (int i = 0; i < thread_count; i++) {
        if (pthread_create(&(pool->threads[i]), NULL, threadpool_worker, (void*)pool) != 0) {
            // 创建失败回滚
            threadpool_destroy(pool);
            return NULL;
        }
        pool->thread_count++;
    }

    return pool;
}

int threadpool_add(threadpool_t *pool, thread_func_t function, void *arg) {
    task_t *new_task = (task_t *)malloc(sizeof(task_t));
    if (!new_task) return -1;

    new_task->function = function;
    new_task->arg = arg;
    new_task->next = NULL;

    pthread_mutex_lock(&(pool->lock));

    if (pool->shutdown) {
        pthread_mutex_unlock(&(pool->lock));
        free(new_task);
        return -1;
    }

    // 加入队列尾部
    if (pool->queue_size == 0) {
        pool->queue_head = new_task;
        pool->queue_tail = new_task;
    } else {
        pool->queue_tail->next = new_task;
        pool->queue_tail = new_task;
    }
    pool->queue_size++;

    // 唤醒一个工作线程
    pthread_cond_signal(&(pool->notify));
    pthread_mutex_unlock(&(pool->lock));

    return 0;
}

int threadpool_destroy(threadpool_t *pool) {
    if (pool == NULL) return -1;

    pthread_mutex_lock(&(pool->lock));
    pool->shutdown = 1;
    pthread_mutex_unlock(&(pool->lock));

    // 唤醒所有线程以退出
    pthread_cond_broadcast(&(pool->notify));

    for (int i = 0; i < pool->thread_count; i++) {
        pthread_join(pool->threads[i], NULL);
    }

    free(pool->threads);
    pthread_mutex_destroy(&(pool->lock));
    pthread_cond_destroy(&(pool->notify));
    free(pool);

    return 0;
}
```

### `src/user_handler.c`
```c
#include "../include/user_handler.h"
#include "../include/db_op.h"
#include <string.h>
#include <stdio.h>
#include <openssl/sha.h>
#include <time.h>

// 默认配额 5GB
#define DEFAULT_QUOTA (5LL * 1024 * 1024 * 1024)

// 辅助函数：计算 SHA256
void compute_sha256(const char *str, char *output) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256_CTX sha256;
    SHA256_Init(&sha256);
    SHA256_Update(&sha256, str, strlen(str));
    SHA256_Final(hash, &sha256);
    for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
        sprintf(output + (i * 2), "%02x", hash[i]);
    }
    output[64] = 0; // 终止符
}

// 辅助函数：生成 Token (简单的随机字符串+时间戳)
void generate_token(char *token) {
    srand(time(NULL));
    static const char alphanum[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (int i = 0; i < 31; i++) {
        token[i] = alphanum[rand() % (sizeof(alphanum) - 1)];
    }
    token[31] = '\0';
}

cJSON* handle_register(DBConnection *db, const cJSON *req_json) {
    cJSON *root = cJSON_CreateObject();
    
    // 1. 获取参数
    cJSON *username_obj = cJSON_GetObjectItem(req_json, "username");
    cJSON *password_obj = cJSON_GetObjectItem(req_json, "password");
    
    if (!username_obj || !password_obj) {
        cJSON_AddNumberToObject(root, "code", USER_DB_ERROR);
        cJSON_AddStringToObject(root, "msg", "Missing parameters");
        return root;
    }

    const char *username = username_obj->valuestring;
    const char *password = password_obj->valuestring;

    // 2. 检查用户是否存在
    char sql[512];
    snprintf(sql, sizeof(sql), "SELECT user_id FROM users WHERE username='%s'", username); 
    
    MYSQL_RES *res = db_execute_query(db, sql);
    if (res) {
        if (mysql_num_rows(res) > 0) {
            cJSON_AddNumberToObject(root, "code", USER_EXIST);
            cJSON_AddStringToObject(root, "msg", "Username already exists");
            mysql_free_result(res);
            return root;
        }
        mysql_free_result(res);
    }

    // 3. 密码加密
    char hashed_pwd[65];
    compute_sha256(password, hashed_pwd);

    // 4. 插入用户
    char esc_user[128];
    db_escape_string(db, esc_user, username, strlen(username));
    
    snprintf(sql, sizeof(sql), "INSERT INTO users (username, password) VALUES ('%s', '%s')", esc_user, hashed_pwd);
    
    if (db_execute_update(db, sql) <= 0) {
        cJSON_AddNumberToObject(root, "code", USER_DB_ERROR);
        cJSON_AddStringToObject(root, "msg", "Database error on insert user");
        return root;
    }

    // 5. 初始化配额 (获取刚插入的 user_id)
    long user_id = mysql_insert_id(db->conn);
    snprintf(sql, sizeof(sql), "INSERT INTO user_storage_quota (user_id, total_quota, used_quota) VALUES (%ld, %lld, 0)", user_id, DEFAULT_QUOTA);
    
    if (db_execute_update(db, sql) <= 0) {
        // 回滚用户注册（简化处理：实际项目中应使用事务）
        snprintf(sql, sizeof(sql), "DELETE FROM users WHERE user_id=%ld", user_id);
        db_execute_update(db, sql);
        cJSON_AddNumberToObject(root, "code", USER_DB_ERROR);
        cJSON_AddStringToObject(root, "msg", "Failed to init quota");
        return root;
    }

    // 6. 成功
    cJSON_AddNumberToObject(root, "code", USER_OK);
    cJSON_AddStringToObject(root, "msg", "Register Success");
    return root;
}

cJSON* handle_login(DBConnection *db, const cJSON *req_json, const char *client_ip) {
    cJSON *root = cJSON_CreateObject();

    // 1. 获取参数
    const char *username = cJSON_GetObjectItem(req_json, "username")->valuestring;
    const char *password = cJSON_GetObjectItem(req_json, "password")->valuestring;

    // 2. 查询用户
    char sql[512];
    char esc_user[128];
    db_escape_string(db, esc_user, username, strlen(username));

    snprintf(sql, sizeof(sql), "SELECT user_id, password FROM users WHERE username='%s'", esc_user);
    MYSQL_RES *res = db_execute_query(db, sql);

    if (!res || mysql_num_rows(res) == 0) {
        if(res) mysql_free_result(res);
        cJSON_AddNumberToObject(root, "code", USER_NOT_FOUND);
        cJSON_AddStringToObject(root, "msg", "User not found");
        return root;
    }

    MYSQL_ROW row = mysql_fetch_row(res);
    long user_id = atol(row[0]);
    const char *db_pwd = row[1];

    // 3. 验证密码
    char hashed_input[65];
    compute_sha256(password, hashed_input);

    if (strcmp(hashed_input, db_pwd) != 0) {
        mysql_free_result(res);
        cJSON_AddNumberToObject(root, "code", USER_PASS_WRONG);
        cJSON_AddStringToObject(root, "msg", "Password incorrect");
        return root;
    }
    mysql_free_result(res);

    // 4. 生成 Token 并更新数据库
    char new_token[32];
    generate_token(new_token);
    
    // Token 有效期：当前时间 + 1小时
    // SQL: DATE_ADD(NOW(), INTERVAL 1 HOUR)
    snprintf(sql, sizeof(sql), "UPDATE users SET token='%s', token_expire=DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE user_id=%ld", new_token, user_id);
    
    if (db_execute_update(db, sql) <= 0) {
        cJSON_AddNumberToObject(root, "code", USER_DB_ERROR);
        cJSON_AddStringToObject(root, "msg", "Token update failed");
        return root;
    }

    // 5. 记录日志 (简化处理-不实现)

    // 6. 返回 Token
    cJSON *data = cJSON_CreateObject();
    cJSON_AddStringToObject(data, "token", new_token);
    cJSON_AddNumberToObject(data, "user_id", user_id);
    
    cJSON_AddNumberToObject(root, "code", USER_OK);
    cJSON_AddStringToObject(root, "msg", "Login Success");
    cJSON_AddItemToObject(root, "data", data);

    return root;
}
```

### `Makefile`
```
CC = gcc
CFLAGS = -Wall -g -I./include -I/usr/local/include/cjson
MYSQL_CFLAGS = $(shell mysql_config --cflags)
MYSQL_LIBS = $(shell mysql_config --libs)

TARGET = bin/cloud_disk
SRCDIR = src
OBJDIR = obj
LIBSDIR = libs/cJSON

# --- 2. 定义所有目标文件 ---
# 这里将 src 下的文件和 libs 下的文件统一放入 OBJS 变量
OBJS = $(OBJDIR)/conf.o \
       $(OBJDIR)/db_op.o \
       $(OBJDIR)/protocol.o \
       $(OBJDIR)/api_util.o \
       $(OBJDIR)/user_handler.o \
       $(OBJDIR)/file_handler.o \
       $(OBJDIR)/thread_pool.o \
       $(OBJDIR)/server.o \
       $(OBJDIR)/main.o \
       $(OBJDIR)/cJSON.o

all: directories $(TARGET)

#  创建目录
directories:
	@mkdir -p $(OBJDIR) bin

# --- 3. 链接规则 ---
$(TARGET): $(OBJS)
	$(CC) $(OBJS) -o $@ $(MYSQL_LIBS) -lm -lpthread -lssl -lcrypto

# --- 4. 编译规则 (src 目录下的 .c) ---
$(OBJDIR)/%.o: $(SRCDIR)/%.c
	$(CC) $(CFLAGS) $(MYSQL_CFLAGS) -c $< -o $@

# --- 5. 编译规则 (libs 目录下的 cJSON.c) ---
$(OBJDIR)/cJSON.o: $(LIBSDIR)/cJSON.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf $(OBJDIR) $(TARGET)

.PHONY: all clean

```

### `index.html`
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Linux C Cloud Disk Pro</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 950px; margin: 20px auto; background-color: #f4f6f9; padding: 20px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        input, button { padding: 8px 12px; margin: 5px; border-radius: 4px; border: 1px solid #ccc; font-size: 14px; outline: none; transition: border 0.2s; }
        input:focus { border-color: #2196F3; }
        button { cursor: pointer; border: none; color: white; font-weight: 500; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        button:active { transform: translateY(1px); box-shadow: none; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 4px; overflow: hidden; }
        th, td { border-bottom:1px solid #eee; padding: 12px; text-align: left; }
        th { background-color: #333; color: white; font-weight: 600; }
        tr:nth-child(even) { background-color: #fafafa; }
        tr:hover { background-color: #f0f7ff; }
        .folder { color: #FF9800; font-weight: bold; cursor: pointer; }
        .status { color: #4CAF50; font-size: 0.9em; }
        h2 { margin-top: 0; border-bottom: 2px solid #ddd; padding-bottom: 10px; color: #333; }
        
        /* 任务列表样式 */
        .upload-section { margin-top: 20px; background: white; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .progress-container { background: #e0e0e0; height: 18px; width: 100%; border-radius: 9px; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1); }
        .progress-bar { height: 100%; background: linear-gradient(90deg, #4CAF50, #81C784); transition: width 0.2s; text-align: center; color: white; font-size: 11px; line-height: 18px; font-weight: bold; }
        .btn-action { cursor: pointer; padding:4px 10px; font-size: 12px; border-radius: 3px; border: none; color: white; width: 65px; box-shadow: none; margin-right: 5px;}
        .btn-pause { background: #FF9800; }
        .btn-resume { background: #2196F3; }
        .btn-delete { background: #f44336; }
        .btn-retry { background: #607D8B; }
        .task-table th { background-color: #555; font-size: 13px; padding: 8px; }
        .task-table td { padding: 8px; font-size: 12px; vertical-align: middle; }
        .op-btn { margin-right: 5px; font-size: 12px; padding: 5px 10px; }

        /* 移动文件 模态框样式 (简单下拉) */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 9999; /* 提高 z-index */
        }
        .modal-content {
            background: white; padding: 25px; border-radius: 8px; width: 500px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom:1px solid #eee; padding-bottom: 10px; }
        .modal-title { font-size: 18px; font-weight: bold; }
        .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #999; box-shadow: none; line-height: 1;}
        .close-btn:hover { color: #333; box-shadow: none; }

        /* 下拉选择框样式 */
        select { 
            width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px; 
            background-color: white; outline: none; margin-bottom: 20px;
        }

        /* =========================================================== */
        /* 将 .hidden 放到最后，并加 !important 确保生效 */
        .hidden { display: none !important; }
        /* =========================================================== */
    </style>
    <!-- 引入 SparkMD5 用于计算秒传 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js"></script>
</head>
<body>

    <!-- 登录界面 -->
    <div id="login-view" class="hidden" style="max-width: 400px; margin: 80px auto; padding: 40px; background: white; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); text-align: center;">
        <h2 style="border:none; margin-bottom: 30px; color: #333;">网盘系统</h2>
        <div style="margin-bottom: 20px;">
            <input type="text" id="login-user" placeholder="用户名" style="width: 90%; display: block; margin: 0 auto;">
        </div>
        <div style="margin-bottom: 30px;">
            <input type="password" id="login-pass" placeholder="密码" style="width: 90%; display: block; margin: 0 auto;">
        </div>
        <div>
            <button onclick="doLogin()" style="width: 45%; background-color: #2196F3;">登录</button>
            <button onclick="doRegister()" style="width: 45%; background-color: #4CAF50;">注册</button>
        </div>
        <p id="login-msg" class="status" style="text-align: center; margin-top: 20px; color: #f44336;"></p>
    </div>

    <!-- 主界面 -->
    <div id="main-view" class="hidden">
        <h2>我的云盘</h2>
        
        <!-- 面包屑导航 -->
        <div style="background: white; padding: 15px; margin-bottom: 20px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <div style="font-weight: 500; color: #333;">
                <span>当前路径: </span>
                <span id="current-path" style="color: #2196F3; font-weight: bold;">Root</span>
            </div>
            <div>
                <button onclick="doLogout()" style="background-color: #f44336; font-size: 13px;">退出</button>
                <button onclick="goBack()" style="background-color: #607D8B; font-size: 13px;">返回上级</button>
            </div>
        </div>
        
        <!-- 操作区 -->
        <div class="upload-section">
            <div style="margin-bottom: 15px;">
                <input type="text" id="new-folder-name" placeholder="新建文件夹名称" style="width: 65%;">
                <button onclick="doMkdir()" style="background-color: #009688;">新建文件夹</button>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            
            <div style="display: flex; align-items: center; background: #f9f9f9; padding: 10px; border-radius: 4px;">
                <input type="file" id="file-input" multiple onchange="handleFileSelect(event)" style="border: 1px solid #ddd;">
                <span style="margin-left: 15px; font-size: 13px; color: #666;">提示：支持多选并发上传</span>
            </div>

            <!-- 任务列表 -->
            <h4 style="margin-top: 20px; margin-bottom: 10px; border-left: 4px solid #2196F3; padding-left: 10px;">上传任务列表</h4>
            <table id="upload-task-list" class="task-table">
                <thead>
                    <tr>
                        <th style="width: 30%;">文件名</th>
                        <th style="width: 10%;">大小</th>
                        <th style="width: 35%;">进度</th>
                        <th style="width: 10%;">状态</th>
                        <th style="width: 15%;">操作</th>
                    </tr>
                </thead>
                <tbody id="upload-tbody">
                    <!-- 动态生成任务 -->
                </tbody>
            </table>
        </div>

        <!-- 文件列表 -->
        <h3 style="margin-top: 30px; border-left: 4px solid #4CAF50; padding-left: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">文件浏览</h3>
        <table id="file-list">
            <thead>
                <tr>
                    <th>名称 (悬停查看ID)</th>
                    <th>大小</th>
                    <th>类型</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody id="file-tbody">
                <!-- 文件列表动态生成 -->
            </tbody>
        </table>
    </div>

    <!-- 移动文件 模态框 (简单下拉) -->
    <div id="move-modal" class="hidden modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <span class="modal-title">选择目标文件夹</span>
                <button class="close-btn" onclick="closeMoveModal()">×</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <p style="font-size: 13px; color: #666; margin-top: 0;">请在下拉列表中选择目标位置：</p>
                <select id="move-folder-select">
                    <option value="0" selected>📂 根目录</option>
                    <!-- JS 会动态填充其他文件夹到这里 -->
                </select>
            </div>

            <div style="text-align: right; border-top: 1px solid #eee; padding-top: 15px;">
                <button onclick="closeMoveModal()" style="background-color: #999;">取消</button>
                <button onclick="confirmMove()" style="background-color: #2196F3;">确认移动</button>
            </div>
        </div>
    </div>

    <script>
        // 配置
        const CHUNK_SIZE =5 * 1024 * 1024; // 5MB 分片
        const API_BASE = 'http://192.168.2.131:8080';
        const MAX_CONCURRENT_UPLOADS = 3; // 最大并发上传数
        let token = localStorage.getItem('token');
        let currentParentId = 0;
        let pathStack = [{id: 0, name: 'Root'}];
        let fileToMoveId = null;

        // ---------------------------------------------------------
        // 并发控制器
        // ---------------------------------------------------------
        class UploadQueue {
            constructor(maxConcurrent) {
                this.maxConcurrent = maxConcurrent;
                this.running = 0;
                this.queue = [];
            }

            add(task) {
                this.queue.push(task);
                this.runNext();
            }

            runNext() {
                while (this.running < this.maxConcurrent && this.queue.length > 0) {
                    const task = this.queue.shift();
                    this.running++;
                    task.start().finally(() => {
                        this.running--;
                        this.runNext();
                    });
                }
            }

            getStats() {
                return {
                    running: this.running,
                    waiting: this.queue.length,
                    total: this.running + this.queue.length
                };
            }
        }

        const uploadQueue = new UploadQueue(MAX_CONCURRENT_UPLOADS);
            // 使用 Map 管理活跃任务，支持快速查询和清理
        const activeTasks = new Map(); // key: fileSafeId, value: UploadTask
        // const uploadTasks = [];
        // ---------------------------------------------------------
        // 任务管理器核心类
        // ---------------------------------------------------------
        class UploadTask {
            constructor(file, onComplete, onError) {
                this.file = file;
                this.status = 'PENDING'; 
                this.progress = 0; 
                this.offset = 0;
                this.md5 = null;
                this.controller = null; 
                this.onComplete = onComplete;
                this.onError = onError;
                this.retryCount = 0;
                this.maxRetries = 3; // 最大重试次数
                this.fileSafeId = this.generateFileId(); // 生成唯一ID
                // 本地存储恢复断点
                this.loadFromStorage();
            }
            // 生成唯一文件标识（文件名+大小+最后修改时间）
            generateFileId() {
                // 使用文件名、大小和最后修改时间生成唯一标识
                return `${this.file.name}_${this.file.size}_${this.file.lastModified}`.replace(/\W/g, '_');
            }
            // 从本地存储加载断点
            loadFromStorage() {
                const savedData = localStorage.getItem(`upload_task_${this.fileSafeId}`);
                if (savedData) {
                    const data = JSON.parse(savedData);
                    if (data.md5 && data.offset > 0) {
                        this.md5 = data.md5;
                        this.offset = data.offset;
                        this.progress = Math.floor((this.offset / this.file.size) * 100);
                        console.log(`恢复断点: ${this.offset}字节 (${this.progress}%)`);
                    }
                }
            }

            // 保存断点到本地存储
            saveToStorage() {
                const data = {
                    md5: this.md5,
                    offset: this.offset,
                    fileSize: this.file.size,
                    fileName: this.file.name,
                    lastModified: this.file.lastModified,
                    timestamp: Date.now()
                };
                localStorage.setItem(`upload_task_${this.fileSafeId}`, JSON.stringify(data));
            }

            // 清除本地存储
            clearStorage() {
                localStorage.removeItem(`upload_task_${this.fileSafeId}`);
            }

            async start() {
                if (this.status === 'UPLOADING' || this.status === 'FINISHED') return;
                
                this.status = 'UPLOADING';
                this.controller = new AbortController();
                this.updateUI();

                try {
                    if (!this.md5) {
                        this.updateStatus('计算MD5...');
                        this.md5 = await this.calcMD5();
                    }
                    this.updateStatus('检查上传状态...');
                    const checkRes = await this.checkUpload(this.md5);
                    
                    if (checkRes.status === 'instant') {
                        this.finish();
                        return;
                    }

                    // this.offset = checkRes.offset || 0;
                    const serverOffset = checkRes.offset || 0;
                    this.offset = Math.max(this.offset, serverOffset);
                    // this.offset = Math.max(this.offset, checkRes.offset || 0);
                    // 立即保存断点信息，确保在上传过程中随时可以恢复
                    this.saveToStorage();
                    
                    const totalSize = this.file.size;

                    while (this.offset < totalSize && this.status === 'UPLOADING') {
                        const end = Math.min(this.offset + CHUNK_SIZE, totalSize);
                        const chunk = this.file.slice(this.offset, end);
                        
                        // 添加重试机制
                        let success = false;
                        for (let attempt = 0; attempt < this.maxRetries && !success; attempt++) {
                            try {
                                await this.uploadChunk(this.md5, this.offset, chunk);
                                success = true;
                            } catch (error) {
                                if (attempt === this.maxRetries - 1) {
                                    throw error; // 最后一次重试失败，抛出异常
                                }
                                console.warn(`分片上传失败，重试 ${attempt + 1}/${this.maxRetries}`);
                                await this.delay(1000 * (attempt + 1)); // 指数退避
                            }
                        }
                        
                        // 使用服务端返回的真实偏移量更新本地状态
                        // 不再使用 this.offset = end (乐观更新)
                        const confirmedOffset = await this.uploadChunk(this.md5, this.offset, chunk);
                        // 只有当服务端确认的偏移量大于本地时才更新（防止回退）
                        if (confirmedOffset > this.offset) {
                            this.offset = confirmedOffset;
                        } else {
                            // 如果服务端返回的偏移量没变或异常，强制推进避免死循环，但打印警告
                            console.warn("Server offset mismatch or not advanced. Local: ", this.offset, "Server: ", confirmedOffset);
                            this.offset = end; 
                        }
                        
                        this.progress = Math.floor((this.offset / totalSize) * 100);
                        // 每次成功上传一个分片后，立即保存断点信息
                        this.saveToStorage();
                        this.updateUI();
                    }

                    if (this.status === 'UPLOADING') {
                        this.updateStatus('完成上传，正在合并...');
                        await this.completeUpload(this.md5);
                        this.finish();
                    }

                } catch (error) {
                    console.error('上传出错:', error);
                    if (error.name === 'AbortError') {
                        this.status = 'PAUSED'; 
                        this.saveToStorage(); // 暂停时也保存当前进度
                    } else {
                        // console.error(error);
                        this.status = 'ERROR';
                        this.retryCount++;
                        if (this.retryCount < this.maxRetries) {
                            console.log(`自动重试 ${this.retryCount}/${this.maxRetries}`);
                            this.status = 'PENDING';
                            uploadQueue.add(this); // 重新加入队列
                            return; // 不调用 onError
                        }
                        this.onError(this);
                    }
                    this.updateUI();
                }
            }

            
            delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            updateStatus(text) {
                const row = document.getElementById(`task-${this.fileSafeId}`);
                if (row) {
                    const statusText = row.querySelector('.status-text');
                    if (statusText) statusText.innerText = text;
                }
            }

            pause() {
                if (this.status === 'UPLOADING' && this.controller) {
                    this.controller.abort();
                    this.status = 'PAUSED';
                    this.updateUI();
                }
            }

            async calcMD5() {
                return new Promise((resolve) => {
                    const spark = new SparkMD5.ArrayBuffer();
                    const reader = new FileReader();
                    let currentChunk = 0;
                    const readChunkSize = 5 * 1024 * 1024; 
                    const chunks = Math.ceil(this.file.size / readChunkSize);
                    
                    const loadNext = () => {
                        const start = currentChunk * readChunkSize;
                        const end = Math.min(start + readChunkSize, this.file.size);
                        reader.readAsArrayBuffer(this.file.slice(start, end));
                    };

                    reader.onload = e => {
                        spark.append(e.target.result);
                        currentChunk++;
                        if (currentChunk < chunks) {
                            setTimeout(loadNext, 0); 
                        } else {
                            resolve(spark.end());
                        }
                    };
                    loadNext();
                });
            }

            async checkUpload(md5) {
                const res = await api('/api/files/upload/check', {
                    md5: md5,
                    file_size: this.file.size,
                    file_name: this.file.name,
                    parent_id: currentParentId
                });
                
                const data = res.data;
                if (data.status === 'instant') {
                    this.status = 'FINISHED';
                    this.progress = 100;
                    this.updateUI();
                    this.onComplete(this);
                    return { status: 'instant' };
                }
                return { status: data.status, offset: data.offset };
            }

            async uploadChunk(md5, offset, chunk) {
                const url = `${API_BASE}/api/files/upload/chunk?md5=${md5}&offset=${offset}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Token': token },
                    body: chunk,
                    signal: this.controller.signal
                });
                if (!response.ok) throw new Error('Upload failed');
                
                // 解析服务端返回的真实偏移量，防止进度条跳动
                try {
                    const result = await response.json();
                    if (result.code === 0 && result.data && result.data.offset !== undefined) {
                        return result.data.offset; // 返回真实的偏移量
                    }
                } catch (e) {
                    console.error("Parse chunk response error", e);
                }
                return offset + chunk.size; // 降级处理
            }

            async completeUpload(md5) {
                await api('/api/files/upload/complete', {
                    md5: md5,
                    file_name: this.file.name,
                    parent_id: currentParentId
                });
            }

            finish() {
                this.status = 'FINISHED';
                this.progress = 100;
                this.updateUI();
                this.clearStorage(); // 上传完成后清除本地存储的断点信息
                this.onComplete(this);
            }

            updateUI() {
                const row = document.getElementById(`task-${this.fileSafeId}`);
                if (!row) return;

                const progressBar = row.querySelector('.progress-bar');
                const statusText = row.querySelector('.status-text');
                const btnAction = row.querySelector('.btn-action');

                progressBar.style.width = `${this.progress}%`;
                progressBar.innerText = this.progress < 10 ? '' : `${this.progress}%`;
                
                if (this.status === 'UPLOADING') {
                    statusText.innerText = '上传中';
                    btnAction.innerText = '暂停';
                    btnAction.onclick = () => this.pause();
                    btnAction.className = 'btn-action btn-pause';
                } else if (this.status === 'PAUSED') {
                    statusText.innerText = `暂停 (${(this.offset/1024/1024).toFixed(1)}MB)`;
                    btnAction.innerText = '继续';
                    btnAction.onclick = () => this.start();
                    btnAction.className = 'btn-action btn-resume';
                } else if (this.status === 'FINISHED') {
                    statusText.innerText = '完成';
                    row.remove(); // 直接移除完成的任务行
                } else if (this.status === 'ERROR') {
                    statusText.innerText = '失败';
                    btnAction.innerText = '重试';
                    btnAction.onclick = () => {
                        this.retryCount = 0;
                        uploadQueue.add(this);
                    };
                    btnAction.className = 'btn-action btn-retry';
                }
            }
        }

        // ---------------------------------------------------------
        // 基础 API 功能
        // ---------------------------------------------------------
        
        const uploadTasks = [];

        if (token) {
            showMain();
            loadFiles();
        } else {
            document.getElementById('login-view').classList.remove('hidden');
        }

        async function api(url, data) {
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) headers['Token'] = token;

            try {
                const res = await fetch(API_BASE + url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(data)
                });
                const result =  await res.json();
                // 统一处理 Token 失效的情况
                // 如果返回 401，说明 token 无效，自动清除并刷新页面，从而显示登录页
                if (result.code === 401) {
                    localStorage.removeItem('token');
                    // 提示用户
                    alert("登录已过期，请重新登录");
                    // 刷新页面，重新走初始化流程
                    location.reload(); 
                }
                
                return result; // 返回结果

            } catch (e) {
                console.error(e);
                return { code: -1, msg: e.message };
            }
        }

        function showMain() {
            document.getElementById('login-view').classList.add('hidden');
            document.getElementById('main-view').classList.remove('hidden');
        }

        async function doLogin() {
            const u = document.getElementById('login-user').value;
            const p = document.getElementById('login-pass').value;
            const res = await api('/api/user/login', { username: u, password: p });
            if (res.code === 0) {
                token = res.data.token;
                localStorage.setItem('token', token);
                showMain();
                loadFiles();
            } else {
                document.getElementById('login-msg').innerText = res.msg;
            }
        }

        async function doRegister() {
            const u = document.getElementById('login-user').value;
            const p = document.getElementById('login-pass').value;
            const res = await api('/api/user/register', { username: u, password: p });
            alert(res.msg);
            if (res.code === 0) alert('注册成功，请登录');
        }

        async function doLogout() {
            localStorage.removeItem('token');
            location.reload();
        }

        async function loadFiles() {
            const res = await api('/api/files/list', { parent_id: currentParentId });
            const tbody = document.getElementById('file-tbody');
            tbody.innerHTML = '';
            
            if (res.code === 0) {
                res.data.forEach(f => {
                    const tr = document.createElement('tr');
                    const isFolder = f.file_type ===1;
                    
                    let sizeStr = f.file_size + ' B';
                    if (f.file_size > 1024*1024*1024) sizeStr = (f.file_size/1024/1024/1024).toFixed(2) + ' GB';
                    else if(f.file_size > 1024*1024) sizeStr = (f.file_size/1024/1024).toFixed(2) + ' MB';
                    else if(f.file_size > 1024) sizeStr = (f.file_size/1024).toFixed(2) + ' KB';

                    // 预览按钮逻辑
                    const ext = f.file_name.split('.').pop().toLowerCase();
                    const previewExts = ['txt', 'log', 'md', 'jpg', 'jpeg', 'png', 'gif', 'pdf'];
                    const canPreview = !isFolder && previewExts.includes(ext);
                    
                    let previewBtn = '';
                    if (canPreview) {
                        // 构建 GET 请求 URL，携带 token
                        const viewUrl = `${API_BASE}/api/files/view?file_id=${f.file_id}&token=${token}`;
                        previewBtn = `<button onclick="window.open('${viewUrl}', '_blank')" class="op-btn" style="background-color: #9c27b0;">预览</button>`;
                    }

                    tr.innerHTML = `
                        <td class="${isFolder ? 'folder' : ''}" 
                            title="ID: ${f.file_id}"
                            onclick="${isFolder ? `enterFolder(${f.file_id},'${f.file_name}')` : ''}">
                            ${isFolder ? '[DIR] ' : ''}${f.file_name}
                        </td>
                        <td>${sizeStr}</td>
                        <td>${isFolder ? '文件夹' : '文件'}</td>
                        <td>
                            ${previewBtn}
                            ${!isFolder ? `<button onclick="downloadFile(${f.file_id}, '${f.file_name}')" class="op-btn" style="background-color: #4CAF50;">下载</button>` : ''}
                            <button onclick="doRename(${f.file_id}, '${f.file_name}')" class="op-btn" style="background-color: #FF9800;">改名</button>
                            <button onclick="openMoveModal(${f.file_id})" class="op-btn" style="background-color: #2196F3;">移动</button>
                            <button onclick="doDelete(${f.file_id})" class="op-btn" style="background-color: #f44336;">删除</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        }

        function enterFolder(id, name) {
            pathStack.push({id: id, name: name});
            currentParentId = id;
            updatePath();
            loadFiles();
        }

        function goBack() {
            if (pathStack.length > 1) {
                pathStack.pop();
                currentParentId = pathStack[pathStack.length-1].id;
                updatePath();
                loadFiles();
            }
        }

        function updatePath() {
            const path = pathStack.map(p => p.name).join(' / ');
            document.getElementById('current-path').innerText = path;
        }

        async function doMkdir() {
            const name = document.getElementById('new-folder-name').value;
            if (!name) return;
            const res = await api('/api/files/mkdir', { parent_id: currentParentId, folder_name: name });
            alert(res.msg);
            if (res.code === 0) {
                document.getElementById('new-folder-name').value = '';
                loadFiles();
            }
        }

        // ---------------------------------------------------------
        // 文件操作逻辑 (改名/移动/删除)
        // ---------------------------------------------------------

        async function doRename(fileId, oldName) {
            const newName = prompt("请输入新名称:", oldName);
            if (!newName || newName === oldName) return;

            const res = await api('/api/files/rename', { file_id: fileId, new_name: newName });
            alert(res.msg);
            if (res.code === 0) loadFiles();
        }

        async function doDelete(fileId) {
            if (!confirm("确定要删除吗？如果是文件夹，必须为空才能删除。")) return;

            const res = await api('/api/files/delete', { file_id: fileId });
            alert(res.msg);
            if (res.code === 0) loadFiles();
        }

        async function downloadFile(id, name) {
            const headers = { 'Token': token, 'Content-Type': 'application/json' };
            const res = await fetch(API_BASE + '/api/files/download', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ file_id: id })
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                alert("下载失败: " + res.statusText);
            }
        }

        // ---------------------------------------------------------
        // 文件移动逻辑 (下拉列表)
        // ---------------------------------------------------------

        async function openMoveModal(fileId) {
            fileToMoveId = fileId;
            // 先移除 hidden 类，显示弹窗
            const modal = document.getElementById('move-modal');
            modal.classList.remove('hidden');

            // 重置 Select 内容
            const select = document.getElementById('move-folder-select');
            select.innerHTML = '<option value="0" selected>📂 根目录</option>';

            // 异步加载其他文件夹
            try {
                const res = await api('/api/files/list', { fetch_all: 1 });
                if (res.code !== 0) {
                    alert('加载目录失败');
                    closeMoveModal();
                    return;
                }

                // 遍历所有数据，只添加文件夹
                res.data.forEach(node => {
                    if (node.file_type === 1) {
                        const option = document.createElement('option');
                        option.value = node.file_id;
                        option.text = `📁 ${node.file_name} (ID:${node.file_id})`;
                        select.appendChild(option);
                    }
                });

            } catch (error) {
                console.error(error);
                alert('加载出错，请确保后端已重启');
                closeMoveModal();
            }
        }

        function closeMoveModal() {
            // 添加 hidden 类，强制隐藏
            document.getElementById('move-modal').classList.add('hidden');
            fileToMoveId = null;
        }

        async function confirmMove() {
            const select = document.getElementById('move-folder-select');
            const targetId = parseInt(select.value);

            if (!fileToMoveId) return;
            
            const res = await api('/api/files/move', { file_id: fileToMoveId, target_parent_id: targetId });
            alert(res.msg);
            
            // 无论成功失败，都关闭弹窗
            closeMoveModal();
            
            if (res.code === 0) {
                loadFiles();
            }
        }

        // ---------------------------------------------------------
        // 多文件上传逻辑
        // ---------------------------------------------------------
        function handleFileSelect(event) {
            const files = Array.from(event.target.files);
            const tbody = document.getElementById('upload-tbody');
            
            // 统计结果
            let addedCount = 0;
            let skippedCount = 0;
            let skippedFiles = [];
            
            files.forEach(file => {
                // 先创建真正的任务对象，而不是临时对象
                // 这样确保 ID 是唯一的，且后续所有操作都使用同一个 ID
                const task = new UploadTask(file, () => {
                    loadFiles();
                    // 任务完成后从 Map 中移除（延迟5秒）
                    setTimeout(() => {
                        activeTasks.delete(task.fileSafeId);
                    }, 5000);
                }, (errTask) => {
                    console.error('任务失败:', errTask.file.name);
                });
                
                const fileSafeId = task.fileSafeId; // 使用同一个 ID
                
                // 检查是否有正在上传的同文件
                const existingTask = activeTasks.get(fileSafeId);
                if (existingTask && existingTask.status !== 'FINISHED') {
                    skippedCount++;
                    skippedFiles.push(file.name);
                    console.log(`跳过正在上传的文件: ${file.name}`);
                    return; 
                }

                // 如果之前有已完成的任务，先清理
                if (existingTask && existingTask.status === 'FINISHED') {
                    activeTasks.delete(fileSafeId);
                }

                const tr = document.createElement('tr');
                tr.id = `task-${fileSafeId}`; // 使用同一个 ID 设置 DOM
                
                const stats = uploadQueue.getStats();
                const queueInfo = stats.waiting > 0 ? ` (队列:${stats.waiting})` : '';
                
                tr.innerHTML = `
                    <td>${file.name}</td>
                    <td>${(file.size/1024/1024).toFixed(1)} MB</td>
                    <td>
                        <div class="progress-container">
                            <div class="progress-bar" style="width: 0%">0%</div>
                        </div>
                    </td>
                    <td class="status-text">等待中${queueInfo}</td>
                    <td><button class="btn-action">等待</button></td>
                `;
                tbody.appendChild(tr);

                // 将任务存入 Map
                activeTasks.set(fileSafeId, task);
                
                // 将任务加入队列（队列会自动触发 start）
                uploadQueue.add(task);
                addedCount++;
            });
            
            // 无论是否有文件被跳过，都清空文件选择框
            event.target.value = '';
            
            // 给用户反馈
            if (skippedCount > 0) {
                console.log(`已添加 ${addedCount} 个文件，跳过 ${skippedCount} 个正在上传的文件`);
            }
        }


        // ---------------------------------------------------------
        // 定期清理已完成的任务
        // ---------------------------------------------------------
        setInterval(() => {
            // 清理超过1小时未活动的已完成任务
            const now = Date.now();
            const timeout = 60 * 60 * 1000; // 1小时
            
            activeTasks.forEach((task, key) => {
                if (task.status === 'FINISHED') {
                    // 检查存储的时间戳
                    const savedData = localStorage.getItem(`upload_task_${key}`);
                    if (savedData) {
                        const data = JSON.parse(savedData);
                        if (now - data.timestamp > timeout) {
                            activeTasks.delete(key);
                            localStorage.removeItem(`upload_task_${key}`);
                        }
                    }
                }
            });
            
            // 打印队列状态
            const stats = uploadQueue.getStats();
            if (stats.total > 0) {
                console.log(`上传队列状态: 运行中=${stats.running}, 等待中=${stats.waiting}, 活跃任务=${activeTasks.size}`);
            }
        }, 10000); // 每10秒检查一次
    </script>
</body>
</html>
```