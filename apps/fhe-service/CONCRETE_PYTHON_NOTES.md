# Concrete Python API 研究笔记

**日期：** 2024-12-17  
**任务：** Day 2 任务 2.1 - 研究 Concrete Python API

---

## 📚 核心概念

### 1. Concrete Python 简介

Concrete Python 是 Zama 开发的开源 FHE（全同态加密）编译器，基于 TFHE 技术。

**关键特性：**
- 🚀 简单的 Python API
- 🔒 内置安全保证
- ⚡ GPU 加速支持
- 🛠 自动参数选择
- 📊 性能分析工具

### 2. 基本使用模式

#### 编译 FHE 电路

```python
from concrete import fhe

@fhe.compiler({"x": "encrypted"})
def add_one(x: int) -> int:
    return x + 1

# 编译电路
inputset = [0, 1, 2, 3, 4, 5]
circuit = add_one.compile(inputset)

# 生成密钥
circuit.keygen()

# 加密和运行
encrypted = circuit.encrypt(5)
result = circuit.run(encrypted)
decrypted = circuit.decrypt(result)
```

#### 同态运算

```python
@fhe.compiler({"x": "encrypted", "y": "encrypted"})
def add(x: int, y: int) -> int:
    return x + y

circuit = add.compile(inputset)
circuit.keygen()

# 加密两个值
encrypted_x = circuit.encrypt(5)
encrypted_y = circuit.encrypt(3)

# 同态加法
result = circuit.run(encrypted_x, encrypted_y)
decrypted = circuit.decrypt(result)  # 8
```

### 3. 支持的运算

**支持的运算：**
- ✅ 加法 (`+`)
- ✅ 减法 (`-`)
- ✅ 乘法 (`*`)
- ✅ 比较 (`<`, `>`, `<=`, `>=`, `==`, `!=`)
- ✅ 位运算 (`&`, `|`, `^`, `~`)
- ✅ 条件表达式 (`if/else`)

**限制：**
- ⚠️ 除法需要特殊处理
- ⚠️ 浮点数需要转换为整数
- ⚠️ 循环和递归有限制

### 4. 金额加密方案

**方案：** 将金额转换为整数（乘以 100 保留分）

```python
# 金额 100.50 -> 整数 10050
amount_int = int(amount * 100)

# 加密
encrypted = circuit.encrypt(amount_int)

# 解密后转换回浮点数
amount = decrypted_int / 100.0
```

### 5. 密钥管理

**密钥存储：**
- 使用 `pickle` 序列化电路对象（包含密钥）
- 存储到安全目录（`keys/`）
- 密钥文件不应提交到 Git

**密钥加载：**
```python
import pickle

# 保存
with open("keys.pkl", "wb") as f:
    pickle.dump(circuit, f)

# 加载
with open("keys.pkl", "rb") as f:
    circuit = pickle.load(f)
```

---

## 🔧 实现要点

### 1. 输入集（Inputset）

输入集用于编译时优化电路。应该包含所有可能的输入值。

```python
# 对于金额 0-999,999.99
inputset = list(range(0, 100000000))  # 0 到 99,999,999（以分为单位）
```

### 2. 电路编译

编译是耗时操作，应该：
- 只在首次运行时编译
- 保存编译后的电路
- 避免频繁重新编译

### 3. 性能考虑

- **编译时间：** 几分钟到几小时（取决于输入集大小）
- **加密时间：** 毫秒级
- **运行时间：** 秒级（取决于运算复杂度）
- **解密时间：** 毫秒级

---

## 📝 参考资源

- **官方文档：** https://docs.zama.ai/concrete
- **GitHub：** https://github.com/zama-ai/concrete
- **示例代码：** https://docs.zama.ai/concrete/getting-started/examples

---

## ✅ 下一步

1. ✅ 理解基本 API
2. ✅ 设计金额加密方案
3. ⏳ 实现电路编译（`circuit.py`）
4. ⏳ 实现密钥管理
5. ⏳ 编写单元测试

---

**记录人：** 开发团队  
**更新时间：** 2024-12-17

