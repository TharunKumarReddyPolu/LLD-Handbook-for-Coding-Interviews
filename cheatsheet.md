# LLD Quick Reference 📑

> A comprehensive cheatsheet for Low-Level Design interviews

---

## 📐 SOLID Principles

| Principle | Name | Key Idea | Violation Sign |
|-----------|------|----------|----------------|
| **S** | Single Responsibility | One class, one reason to change | Class doing too many things |
| **O** | Open/Closed | Open for extension, closed for modification | Modifying existing code for new features |
| **L** | Liskov Substitution | Subtypes must be substitutable for base types | Overridden methods breaking contracts |
| **I** | Interface Segregation | Many specific interfaces > one general | Classes implementing unused methods |
| **D** | Dependency Inversion | Depend on abstractions, not concretions | High-level modules depending on low-level |

---

## 🏗️ Design Patterns

### Creational Patterns
*Deal with object creation mechanisms*

| Problem | Pattern | Key Idea | When to Use |
|---------|---------|----------|-------------|
| One instance only | **Singleton** | Static instance, private constructor | Config, Logger, Connection Pool |
| Hide creation logic | **Factory Method** | Delegate creation to subclasses | When exact type is unknown at compile time |
| Complex construction | **Builder** | Step-by-step construction | Objects with many optional parameters |
| Object families | **Abstract Factory** | Factory of factories | Creating related object families |
| Clone existing objects | **Prototype** | Copy existing instance | When object creation is expensive |

### Structural Patterns
*Deal with object composition*

| Problem | Pattern | Key Idea | When to Use |
|---------|---------|----------|-------------|
| Add behavior dynamically | **Decorator** | Wrap and extend | Adding features without subclassing |
| Simplify interface | **Facade** | Unified interface | Simplifying complex subsystems |
| Incompatible interfaces | **Adapter** | Convert interface | Integrating legacy/third-party code |
| Control access | **Proxy** | Surrogate object | Lazy loading, access control, caching |
| Tree structures | **Composite** | Uniform treatment | Part-whole hierarchies |
| Share common state | **Flyweight** | Externalize state | Large number of similar objects |
| Decouple abstraction | **Bridge** | Separate interface from implementation | Multiple dimensions of variation |

### Behavioral Patterns
*Deal with object communication*

| Problem | Pattern | Key Idea | When to Use |
|---------|---------|----------|-------------|
| Notify on changes | **Observer** | Pub-sub mechanism | Event handling, reactive updates |
| Interchangeable algorithms | **Strategy** | Encapsulate algorithms | Multiple ways to do something |
| State-based behavior | **State** | Encapsulate states | Object behavior depends on state |
| Encapsulate requests | **Command** | Request as object | Undo/redo, queuing, logging |
| Sequential access | **Iterator** | Traverse without exposing internals | Collections traversal |
| Reduce coupling | **Mediator** | Central coordinator | Complex object interactions |
| Save/restore state | **Memento** | Snapshot object | Undo functionality |
| Pass along chain | **Chain of Responsibility** | Handler chain | Multiple handlers for request |
| Define skeleton | **Template Method** | Algorithm skeleton in base class | Common algorithm with varying steps |
| Add operations | **Visitor** | Separate algorithm from structure | Operations on object structures |

---

## 🎯 OOP Fundamentals

### Four Pillars of OOP

| Pillar | Definition | Benefit |
|--------|------------|---------|
| **Encapsulation** | Bundle data + methods, hide internals | Data protection, modularity |
| **Abstraction** | Hide complexity, show essentials | Reduced complexity, cleaner interface |
| **Inheritance** | Derive new classes from existing | Code reuse, hierarchy |
| **Polymorphism** | Same interface, different implementations | Flexibility, extensibility |

### Class Relationships

| Relationship | Symbol | Strength | Example |
|--------------|--------|----------|---------|
| **Association** | → | Weak | Teacher → Student |
| **Aggregation** | ◇→ | Medium | Department ◇→ Employee |
| **Composition** | ◆→ | Strong | House ◆→ Room |
| **Inheritance** | ▷ | IS-A | Dog ▷ Animal |
| **Dependency** | ⟶ | Weakest | Order ⟶ PaymentService |

---

## 🔑 Key Design Principles

| Principle | Description |
|-----------|-------------|
| **DRY** | Don't Repeat Yourself |
| **KISS** | Keep It Simple, Stupid |
| **YAGNI** | You Ain't Gonna Need It |
| **Composition over Inheritance** | Prefer HAS-A over IS-A |
| **Program to Interface** | Depend on abstractions |
| **Encapsulate What Varies** | Isolate changing parts |
| **Favor Loose Coupling** | Minimize dependencies |
| **High Cohesion** | Related things together |

---

## 🚀 Quick Pattern Selection Guide

```
Need ONE instance?                    → Singleton
Need to create objects dynamically?   → Factory / Abstract Factory
Complex object with many params?      → Builder
Need to add features at runtime?      → Decorator
Need to simplify complex system?      → Facade
Need to support undo/redo?            → Command + Memento
Behavior changes based on state?      → State
Need to notify multiple objects?      → Observer
Multiple algorithms for same task?    → Strategy
Need to traverse a collection?        → Iterator
```

---

## 📝 Interview Tips

1. **Clarify requirements** before jumping into design
2. **Identify nouns** (classes) and **verbs** (methods) from requirements
3. **Start simple**, then iterate and improve
4. **Apply SOLID** principles throughout
5. **Use design patterns** where they fit naturally - don't force them
6. **Consider extensibility** - what might change in the future?
7. **Draw diagrams** - UML class diagrams help communicate design

---

## 🔗 Quick Links

- [OOD Basics](./ood-basics/README.md)
- [SOLID Principles](./solid-principles/README.md)
- [Design Patterns](./design-patterns/README.md)
- [Best Practices](./best-practices/README.md)
- [Interview Questions](./interview-questions/README.md)
