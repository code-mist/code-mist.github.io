---
title: cpp questions
date: 2026-04-11 20:26:04
tags: question
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

---

### 多重继承

**多重继承**是指一个派生类同时继承自**两个或多个**父类。派生类将继承所有父类的成员和方法。

```cpp
#include <iostream>
using namespace std;

// 父类 1
class Animal {
public:
    void eat() {
        cout << "Animal is eating" << endl;
    }
};

// 父类 2
class Vehicle {
public:
    void run() {
        cout << "Vehicle is running" << endl;
    }
};

// 派生类继承两个父类
class Car : public Animal, public Vehicle {
public:
    void display() {
        cout << "This is a Car" << endl;
    }
};

int main() {
    Car car;
    car.eat();      // ✓ 继承自 Animal
    car.run();      // ✓ 继承自 Vehicle
    car.display();
    
    return 0;
}
```

**Output:**
```
Animal is eating
Vehicle is running
This is a Car
```

#### 多重继承的问题：钻石问题

**最常见的问题**：当两个父类都继承自同一个祖父类时，会产生歧义。

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    void eat() {
        cout << "Eating..." << endl;
    }
};

class Dog : public Animal {
public:
    void bark() {
        cout << "Woof!" << endl;
    }
};

class Cat : public Animal {
public:
    void meow() {
        cout << "Meow!" << endl;
    }
};

// 问题：DogCat 继承 Dog 和 Cat，都继承自 Animal
// 所以 DogCat 有两个 Animal 副本！
class DogCat : public Dog, public Cat {
};

int main() {
    DogCat dc;
    // dc.eat();  // ✗ 错误！不明确：来自 Dog 的 Animal 还是 Cat 的 Animal？
    
    return 0;
}
```

**输出错误：**
```
error: request for member 'eat' is ambiguous
```

---

#### 解决钻石问题：虚继承

使用 **virtual 关键字**来解决钻石问题。

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    void eat() {
        cout << "Eating..." << endl;
    }
};

// 使用 virtual 继承
class Dog : virtual public Animal {
public:
    void bark() {
        cout << "Woof!" << endl;
    }
};

// 使用 virtual 继承
class Cat : virtual public Animal {
public:
    void meow() {
        cout << "Meow!" << endl;
    }
};

// 现在 DogCat 只有一个 Animal 副本
class DogCat : public Dog, public Cat {
};

int main() {
    DogCat dc;
    dc.eat();     // ✓ 现在可以正常调用
    dc.bark();
    dc.meow();
    
    return 0;
}
```

**Output:**
```
Eating...
Woof!
Meow!
```

---

#### 访问多个父类的同名成员

当两个父类有同名的函数时，需要指定使用哪个。

```cpp
#include <iostream>
using namespace std;

class ClassA {
public:
    void display() {
        cout << "Display from ClassA" << endl;
    }
};

class ClassB {
public:
    void display() {
        cout << "Display from ClassB" << endl;
    }
};

class DerivedClass : public ClassA, public ClassB {
public:
    void show() {
        ClassA::display();  // ✓ 明确调用 ClassA 的 display
        ClassB::display();  // ✓ 明确调用 ClassB 的 display
    }
};

int main() {
    DerivedClass dc;
    dc.show();
    
    // 或者直接调用
    dc.ClassA::display();
    dc.ClassB::display();
    
    return 0;
}
```

**Output:**
```
Display from ClassA
Display from ClassB
Display from ClassA
Display from ClassB
```



---

多重继承的对比表

| 特性         | 单继承 | 多重继承           |
| ------------ | ------ | ------------------ |
| **父类数量** | 1 个   | 2 个或以上         |
| **复杂性**   | 低     | 高                 |
| **歧义问题** | 无     | 有可能（钻石问题） |
| **代码重用** | 好     | 更好               |
| **维护难度** | 简单   | 复杂               |
| **推荐使用** | ⭐⭐⭐⭐⭐  | ⭐⭐⭐                |

---

何时使用多重继承

✅ **使用场景：**
- 一个类需要多个独立的接口或功能
- 模拟现实中的"多重身份"（如学生既是人也是学习者）
- 实现 mixin 模式

❌ **避免使用：**
- 设计变得过于复杂
- 导致钻石问题
- 只是为了代码复用（用组合代替）

---

最佳实践建议

```cpp
// ✓ 推荐：使用组合代替多重继承
class Student {
private:
    Person person;      // 包含 Person
    Learner learner;    // 包含 Learner
    
public:
    void study() {
        learner.study();
    }
};

// ✗ 避免：过度使用多重继承
class ComplexClass : public A, public B, public C, public D {
    // 太复杂了！
};
```

---

### Virtual（虚函数）详解

**`virtual` 是 C++ 中实现多态的关键字**，它让程序在**运行时**根据对象的实际类型来调用函数，而不是根据指针/引用的声明类型。

---

#### Virtual 的核心作用

##### 不用 virtual（静态绑定）

```cpp
class Animal
{
public:
    void sound()
    { cout<<"Some sound\n"; }
};

class Dog : public Animal
{
public:
    void sound()
    { cout<<"Woof Woof\n"; }
};

int main()
{
    Animal *ptr = new Dog();
    ptr->sound();  // ✗ 输出：Some sound （错误！）
    return 0;
}
```

**问题**：尽管指向 Dog 对象，但因为 `ptr` 是 `Animal*` 类型，所以调用了 `Animal` 的 `sound()`。

---

##### 用 virtual（动态绑定）

```cpp
class Animal
{
public:
    virtual void sound()  // ← 加 virtual
    { cout<<"Some sound\n"; }
};

class Dog : public Animal
{
public:
    void sound()
    { cout<<"Woof Woof\n"; }
};

int main()
{
    Animal *ptr = new Dog();
    ptr->sound();  // ✓ 输出：Woof Woof （正确！）
    return 0;
}
```

**现在正确了**：运行时检查 `ptr` 实际指向 Dog，所以调用 `Dog::sound()`。

---

#### Virtual 的工作原理

| 概念                       | 说明                                           |
| -------------------------- | ---------------------------------------------- |
| **静态绑定（无 virtual）** | 编译时根据指针/引用的声明类型决定调用哪个函数  |
| **动态绑定（有 virtual）** | 运行时根据指针/引用实际指向的对象类型来决定    |
| **实现方式**               | 每个有虚函数的类内部维护一个虚函数表（vTable） |

---

#### Virtual 的五大主要用途

##### 1. **实现多态性**（最重要）

```cpp
class Shape
{
public:
    virtual void draw()
    { cout<<"Drawing Shape\n"; }
};

class Circle : public Shape
{
public:
    void draw()
    { cout<<"Drawing Circle\n"; }
};

class Rectangle : public Shape
{
public:
    void draw()
    { cout<<"Drawing Rectangle\n"; }
};

int main()
{
    Shape *shapes[3];
    shapes[0] = new Circle();
    shapes[1] = new Rectangle();
    shapes[2] = new Shape();
    
    for(int i = 0; i < 3; i++)
    {
        shapes[i]->draw();  // 根据实际对象类型调用不同的 draw()
    }
    // 输出：
    // Drawing Circle
    // Drawing Rectangle
    // Drawing Shape
    return 0;
}
```

---

##### 2. **处理不同派生类对象**

```cpp
class Employee
{
public:
    virtual void calculateSalary()
    { cout<<"Base salary\n"; }
};

class Manager : public Employee
{
public:
    void calculateSalary()
    { cout<<"Manager salary + bonus\n"; }
};

class Developer : public Employee
{
public:
    void calculateSalary()
    { cout<<"Developer salary\n"; }
};

int main()
{
    Employee *emp;
    Manager m;
    Developer d;
    
    emp = &m;
    emp->calculateSalary();  // ✓ Manager salary + bonus
    
    emp = &d;
    emp->calculateSalary();  // ✓ Developer salary
    
    return 0;
}
```

---

##### 3. **虚析构函数**（防止内存泄漏）

```cpp
class Base
{
public:
    virtual ~Base()  // ← 虚析构函数
    { cout<<"Base destructor\n"; }
};

class Derived : public Base
{
public:
    ~Derived()
    { cout<<"Derived destructor\n"; }
};

int main()
{
    Base *ptr = new Derived();
    delete ptr;
    // 输出：
    // Derived destructor
    // Base destructor
    
    return 0;
}
```

**重要**：如果没有 `virtual ~Base()`，只会调用 Base 的析构函数，Derived 的资源不会被释放。

---

##### 4. **纯虚函数**（定义接口）

```cpp
class Shape
{
public:
    virtual void draw() = 0;  // ← 纯虚函数
    virtual ~Shape() {}
};

class Circle : public Shape
{
public:
    void draw()
    { cout<<"Drawing Circle\n"; }
};

int main()
{
    // Shape s;  // ✗ 错误！不能创建抽象类对象
    Circle c;
    c.draw();  // ✓ 正确
    
    Shape *ptr = new Circle();
    ptr->draw();  // ✓ 正确
    
    return 0;
}
```

**用途**：
- `= 0` 表示纯虚函数
- 包含纯虚函数的类是**抽象类**，不能直接创建对象
- 强制派生类必须实现这个函数

---

##### 5. **向上转型安全使用**

```cpp
class Animal
{
public:
    virtual void makeSound() = 0;
};

class Cat : public Animal
{
public:
    void makeSound()
    { cout<<"Meow\n"; }
};

class Dog : public Animal
{
public:
    void makeSound()
    { cout<<"Woof\n"; }
};

void processAnimal(Animal *a)  // 接受任何 Animal 派生类
{
    a->makeSound();  // 自动调用正确的函数
}

int main()
{
    Cat cat;
    Dog dog;
    
    processAnimal(&cat);  // ✓ 输出：Meow
    processAnimal(&dog);  // ✓ 输出：Woof
    
    return 0;
}
```

---

#### Virtual 的重要规则

##### 1. **子类重写时不需要写 virtual**（但推荐写）

```cpp
class Base
{
public:
    virtual void func() { }
};

class Derived : public Base
{
public:
    void func() { }  // ✓ 可以不写 virtual
    // 但推荐写：
    // virtual void func() { }  // ✓ 更清晰
};
```

---

##### 2. **虚函数不能是静态函数**

```cpp
class Base
{
public:
    virtual static void func() { }  // ✗ 错误！
};
```

---

##### 3. **虚函数不能是模板函数**

```cpp
class Base
{
public:
    template <typename T>
    virtual void func(T x) { }  // ✗ 错误！
};
```

---

##### 4. **函数签名必须完全相同**

```cpp
class Base
{
public:
    virtual void func(int x) { }
};

class Derived : public Base
{
public:
    void func(double x) { }  // ✗ 不是重写（签名不同）
    void func(int x) { }     // ✓ 正确的重写
};
```

---

#### Virtual 的性能开销

| 方面         | 开销                                       |
| ------------ | ------------------------------------------ |
| **内存**     | 每个对象增加一个虚函数指针（通常 8 字节）  |
| **速度**     | 虚函数调用比普通函数慢（需要查询虚函数表） |
| **何时使用** | 需要多态时使用，性能关键代码可以避免       |

```cpp
// 性能对比
class Base
{
public:
    void normalFunc() { }      // 快：直接调用
    virtual void virtualFunc() { }  // 慢：查表后调用
};
```

---

#### 使用场景总结

| 场景                    | 用途                               |
| ----------------------- | ---------------------------------- |
| **需要多种实现**        | 用虚函数让不同派生类有不同行为     |
| **基类指针指向派生类**  | 必须用虚函数才能调用派生类的函数   |
| **设计框架或库**        | 用虚函数定义接口，让用户自定义实现 |
| **动物/形状等分类系统** | 虚函数是完美的设计方案             |
| **避免内存泄漏**        | 虚析构函数是必须的                 |

---

**总结**：`virtual` 是 C++ 多态的核心，让程序能够**在运行时根据对象实际类型来调用正确的函数**，而不是根据指针类型。这是面向对象设计中非常重要的特性。

---

### 泛型编程

**泛型编程是一种编程方法，允许你编写可以处理多种数据类型的代码，而不需要为每种类型重复编写相同的逻辑。** 用一个通用的、与类型无关的方式来解决问题。

---

#### 泛型编程的核心思想

不依赖于具体的数据类型，而是使用 **类型参数** 来代表任何数据类型。

```cpp
template<class T>  // T 是类型参数
T min(T &a, T &b)
{
    return(a<b)?a:b;
}
```

这个函数对 **所有支持比较运算符 `<` 的类型都有效**。

---

#### 泛型编程 vs 传统编程

##### 传统编程（不使用泛型）

```cpp
// 为每种类型写一个函数
int min_int(int a, int b) { return(a<b)?a:b; }
float min_float(float a, float b) { return(a<b)?a:b; }
double min_double(double a, double b) { return(a<b)?a:b; }
char min_char(char a, char b) { return(a<b)?a:b; }

int main()
{
    cout << min_int(5, 3);        // 调用 min_int
    cout << min_float(5.5, 3.3);  // 调用 min_float
    cout << min_double(5.5, 3.3); // 调用 min_double
}
```

**问题：**
- 代码重复很多
- 难以维护
- 如果要改逻辑，需要改所有函数
- 容易出错

---

##### 泛型编程（使用模板）

```cpp
// 只需一个模板函数
template<class T>
T min(T &a, T &b)
{
    return(a<b)?a:b;
}

int main()
{
    cout << min(5, 3);           // T = int
    cout << min(5.5, 3.3);       // T = float
    cout << min('A', 'B');       // T = char
}
```

**优点：**
- 代码简洁
- 易于维护
- 逻辑改一次，所有类型都适用
- 减少重复代码

---

#### 泛型编程的三种主要方式

##### 1. 函数模板（Function Template）

```cpp
template<class T>
T add(T a, T b)
{
    return a + b;
}

int main()
{
    cout << add(5, 3);      // T = int，输出 8
    cout << add(5.5, 3.3);  // T = float，输出 8.8
}
```

---

##### 2. 类模板（Class Template）

```cpp
template<class T>
class Box
{
private:
    T value;
public:
    void setValue(T v) { value = v; }
    T getValue() { return value; }
};

int main()
{
    Box<int> intBox;        // T = int
    intBox.setValue(10);
    cout << intBox.getValue();  // 输出 10

    Box<string> strBox;     // T = string
    strBox.setValue("Hello");
    cout << strBox.getValue();  // 输出 Hello
}
```

---

##### 3. 模板特化（Template Specialization）

```cpp
// 通用模板
template<class T>
void print(T a)
{
    cout << "通用模板: " << a << endl;
}

// 特化模板（只针对 int）
template<>
void print<int>(int a)
{
    cout << "整数特化: " << a << endl;
}

int main()
{
    print(5);      // 输出: 整数特化: 5
    print(5.5);    // 输出: 通用模板: 5.5
    print("Hi");   // 输出: 通用模板: Hi
}
```

---

#### 泛型编程的优势

| 优势         | 说明                         |
| ------------ | ---------------------------- |
| **代码重用** | 一个函数/类适用多种类型      |
| **易于维护** | 改一次代码，所有类型都受益   |
| **类型安全** | 编译时类型检查，运行时无误   |
| **性能高**   | 编译时生成代码，无运行时开销 |
| **灵活性**   | 支持任何支持相关运算符的类型 |

---

#### 泛型编程的限制

```cpp
template<class T>
T divide(T a, T b)
{
    return a / b;  // 不是所有类型都支持 /
}

// 这样调用会出错：
// divide("Hello", "World");  // 编译错误！字符串不支持除法
```

**泛型编程要求：** 传入的类型必须支持模板内使用的所有运算符。

---

#### 现实应用

**C++ 标准库大量使用泛型编程：**

```cpp
#include<vector>
#include<algorithm>
using namespace std;

int main()
{
    vector<int> intVec = {5, 2, 8, 1};
    vector<string> strVec = {"dog", "cat", "bird"};
    
    // sort() 是通用模板，适用所有类型
    sort(intVec.begin(), intVec.end());
    sort(strVec.begin(), strVec.end());
    
    return 0;
}
```

`vector` 和 `sort()` 都是泛型的，可以处理任何数据类型。

---



