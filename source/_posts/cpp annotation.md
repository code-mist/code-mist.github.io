---
title: cpp questions
date: 2026-04-11 20:26:04
tags: read
categories:
description: record some knowlegdes that bad memory in learn cpp
hidden:
mathjax: 
mermaid: 
---



### 指针与引用区分

**指针**：

- 是一个变量，它存储的是另一个变量的**内存地址**。
- 可以是 `NULL`（空指针），表示不指向任何对象。使用前必须检查是否有效。
- 可以改变指向。(重定向)
- 通常占用 4 字节（32位系统）或 8 字节（64位系统）的内存空间来存储地址。
- 可以使用自增（`p++`）操作，在内存中移动到下一个位置。



**引用**：

- 是一个变量的**别名**（绰号）。它不是一个新的变量，不占用额外的内存（在底层实现上通常占一个指针的大小，但在语法层面视作原变量本身）。
- **不能为空**。在定义引用时，**必须**立即初始化，而且必须绑定到一个有效的对象上。你不可能有一个“不存在的变量的别名”。
- **一旦初始化，就不能改变指向**。
- 在语法层面上，引用只是别名，不占内存。但在编译器底层，引用通常也是通过指针实现的，所以实际运行时占用的空间和指针一样，但我们在写代码时应该把它理解为“没有开销的别名”。
- `r++` 的意思是“它所代表的那个变量的值加 1”，而不是移动到下一个内存位置。

###  修饰符Public vs Private vs Protected

| 访问修饰符    | 类内部   | 类外部     | 继承类     |
| ------------- | -------- | ---------- | ---------- |
| **public**    | ✓ 可访问 | ✓ 可访问   | ✓ 可访问   |
| **private**   | ✓ 可访问 | ✗ 不可访问 | ✗ 不可访问 |
| **protected** | ✓ 可访问 | ✗ 不可访问 | ✓ 可访问   |

当一个类继承另一个类时，父类（基类）的成员在子类（派生类）中的可访问性取决于**两个因素**：

1. **父类成员的访问修饰符**（public、private、protected）
2. **继承方式**（public、private、protected 继承）

**继承方式与访问权限表** 

| 父类成员      | Public 继承                                | Private 继承                               | Protected 继承                             |
| ------------- | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ |
| **public**    | 派生类内部可访问，类外部可访问             | 派生类内部可访问，类外部**不可访问**       | 派生类内部可访问，类外部**不可访问**       |
| **protected** | 派生类内部可访问，类外部**不可访问**       | 派生类内部可访问，类外部**不可访问**       | 派生类内部可访问，类外部**不可访问**       |
| **private**   | 派生类内部**不可访问**，类外部**不可访问** | 派生类内部**不可访问**，类外部**不可访问** | 派生类内部**不可访问**，类外部**不可访问** |

1. Public 继承（公开继承）

**最常用的继承方式**。父类的 public 成员在子类中仍然是 public，protected 成员仍然是 protected。

2. Private 继承（私有继承）

父类的 public 和 protected 成员在子类中都变成 **private**。**不推荐使用**（违反里氏替换原则）。

3. Protected 继承（受保护的继承）

父类的 public 成员在子类中变成 **protected**，protected 成员仍然是 protected。适用于需要进一步继承的情况。

---

#### 访问受限成员的方法

当父类成员被设为 private 或因继承方式变成 private/protected 时，有几种合法的方式来访问它们。

##### 方法 1：使用 Public Getter 和 Setter 函数

这是**最推荐的方式**。在父类中提供 public 函数来访问和修改 private 成员。

```cpp
#include <iostream>
using namespace std;

class Animal {
private:
    int age = 5;
    string name = "Unknown";

public:
    // Getter functions (read-only access)
    int getAge() {
        return age;
    }
    
    string getName() {
        return name;
    }
    
    // Setter functions (write access)
    void setAge(int newAge) {
        if (newAge > 0) {
            age = newAge;
        }
    }
    
    void setName(string newName) {
        name = newName;
    }
};

class Dog : public Animal {
public:
    void displayInfo() {
        cout << "Name: " << getName() << endl;  // ✓ Use getter
        cout << "Age: " << getAge() << endl;    // ✓ Use getter
    }
};

int main() {
    Dog dog;
    dog.setName("Buddy");    // ✓ Use setter
    dog.setAge(3);           // ✓ Use setter
    dog.displayInfo();
    
    return 0;
}

```

##### 方法 2：使用 Protected 成员 Public继承

将 private 改为 protected，使得派生类可以直接访问。

```cpp
#include <iostream>
using namespace std;

class Animal {
protected:  // 改为 protected 而不是 private
    int age = 5;
    string type = "Mammal";

public:
    void eat() {
        cout << "Eating..." << endl;
    }
};

class Dog : public Animal {
public:
    void setAge(int newAge) {
        age = newAge;  // ✓ 可以直接访问 protected 成员
    }
    
    void displayInfo() {
        cout << "Type: " << type << endl;  // ✓ 可以访问
        cout << "Age: " << age << endl;    // ✓ 可以访问
    }
};

int main() {
    Dog dog;
    dog.setAge(4);
    dog.displayInfo();
    
    return 0;
}

```

##### 方法 3：使用 Friend 函数或类

允许指定的函数或类访问 private 成员。

```cpp
#include <iostream>
using namespace std;

class Animal {
private:
    int age = 5;
    string name = "Unknown";
    
public:
    // 声明 friend 函数
    friend void printAnimalInfo(Animal& animal);
    // 或声明 friend 类
    friend class AnimalHelper;
};

// Friend 函数可以访问 private 成员
void printAnimalInfo(Animal& animal) {
    cout << "Name: " << animal.name << endl;   // ✓ 可以访问 private
    cout << "Age: " << animal.age << endl;     // ✓ 可以访问 private
}

// Friend 类可以访问另一个类的 private 成员
class AnimalHelper {
public:
    void updateAnimal(Animal& animal, string newName, int newAge) {
        animal.name = newName;  // ✓ 可以访问
        animal.age = newAge;    // ✓ 可以访问
    }
};

int main() {
    Animal dog;
    printAnimalInfo(dog);
    
    AnimalHelper helper;
    helper.updateAnimal(dog, "Buddy", 3);
    printAnimalInfo(dog);
    
    return 0;
}

```

##### 方法 4：解决 Private 继承的访问问题

使用 **using 关键字**重新暴露父类成员。

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    void eat() {
        cout << "Eating..." << endl;
    }
    
    void sleep() {
        cout << "Sleeping..." << endl;
    }
};

// Private 继承
class Dog : private Animal {
public:
    // 使用 using 关键字重新暴露 public 成员
    using Animal::eat;
    using Animal::sleep;
    
    void bark() {
        cout << "Woof! Woof!" << endl;
    }
};

int main() {
    Dog dog;
    dog.eat();     // ✓ 现在可以访问
    dog.sleep();   // ✓ 现在可以访问
    dog.bark();
    
    return 0;
}

```

##### 方法 6：使用公开的虚函数

在父类中提供 public 虚函数来访问 private 数据。

```cpp
#include <iostream>
using namespace std;

class Animal {
private:
    int age = 5;
    string name = "Unknown";

public:
    // Public virtual function to access private member
    virtual void updateAge(int newAge) {
        if (newAge > 0) {
            age = newAge;
        }
    }
    
    virtual void displayInfo() {
        cout << "Name: " << name << endl;
        cout << "Age: " << age << endl;
    }
};

class Dog : public Animal {
public:
    void updateAge(int newAge) override {
        Animal::updateAge(newAge);  // ✓ 调用父类的 public 函数
    }
};

int main() {
    Dog dog;
    dog.updateAge(3);
    dog.displayInfo();
    
    return 0;
}

```

##### 对比总结表

| 方法               | 安全性 | 灵活性 | 推荐度 | 使用场景           |
| ------------------ | ------ | ------ | ------ | ------------------ |
| **Getter/Setter**  | ⭐⭐⭐⭐⭐  | ⭐⭐⭐    | ⭐⭐⭐⭐⭐  | 数据验证、控制访问 |
| **Protected 成员** | ⭐⭐⭐    | ⭐⭐⭐⭐   | ⭐⭐⭐⭐   | 派生类需要直接修改 |
| **Friend**         | ⭐⭐     | ⭐⭐⭐⭐⭐  | ⭐⭐     | 特殊类/函数访问    |
| **Using 关键字**   | ⭐⭐⭐⭐   | ⭐⭐⭐    | ⭐⭐⭐    | 修复 private 继承  |
| **虚函数**         | ⭐⭐⭐⭐   | ⭐⭐⭐⭐   | ⭐⭐⭐⭐   | 多态访问           |

> 1. **优先使用 Getter/Setter** - 最安全，提供数据验证
> 2. **使用 protected** - 简化派生类的开发
> 3. **避免 friend** - 破坏封装
> 4. **使用 using** - 修复继承问题
> 5. **选择合适的访问权限** - 设计类时就要考虑好
