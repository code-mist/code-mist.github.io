---
title: 演示Python注释的使用
categories: code
date: 2025-7-1
description: 演示Python编程中的正确使用注释。
---





"""

这是一个演示模块，展示了如何使用 Google 风格的文档注释。

本模块包含一些数学运算函数作为示例。
"""

def add_numbers(a: float, b: float) -> float:
    """计算两个数字的和。

​    此函数接收两个浮点数参数，返回它们的算术和。

​    Args:
​        a (float): 第一个加数
​        b (float): 第二个加数

​    Returns:
​        float: 两个输入参数的和

​    Raises:
​        TypeError: 如果任一参数不是数值类型
​        
​    Example:
​        >>> add_numbers(3.5, 2)
​        5.5
​        >>> add_numbers(-1, 1)
​        0.0
​    """
​    try:
​        return a + b
​    except TypeError as e:
​        raise TypeError("两个参数必须都是数值类型") from e


class Calculator:
    """一个简单的计算器类。
    
    此类提供了基本的数学运算功能。
    
    Attributes:
        memory (float): 计算器的记忆存储值
       
        model (str): 计算器型号名称
    """
    
    def __init__(self, model: str = "Standard"):
        """初始化计算器实例。
        
        Args:
            model (str): 计算器的型号名称，默认为"Standard"
        """
        self.memory = 0.0
        self.model = model
    
    def multiply(self, x: float, y: float) -> float:
        """计算两个数的乘积。
        
        此方法将两个数相乘，并将结果存储在内存中。
        
        Args:
            x (float): 第一个因数
            y (float): 第二个因数
            
        Returns:
            float: 两个参数的乘积
            
        Note:
            此操作会更新memory属性为计算结果
        """
        result = x * y
       
        self.memory = result
        return result
    
    def get_memory(self) -> float:
        """获取当前存储在内存中的值。
        
        Returns:
            float: memory属性的当前值
        """
        return self.memory


if __name__ == "__main__":
    # 演示函数的使用
​    print(f"3 + 5 = {add_numbers(3, 5)}")
​    
    # 演示类的使用
​    calc = Calculator("Scientific")
​    product = calc.multiply(4, 7)
​    print(f"4 * 7 = {product}")
​    print(f"Memory value: {calc.get_memory()}")