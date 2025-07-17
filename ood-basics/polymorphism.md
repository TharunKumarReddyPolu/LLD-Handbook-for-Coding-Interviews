# 🎭 Polymorphism in Object-Oriented Programming

## 📝 Definition
Polymorphism means "many forms" and occurs when we have many classes that are related to each other by inheritance. It allows us to perform a single action in different ways and enables you to process objects differently based on their data type.

## 🎯 Key Concepts

### 1. Compile-time Polymorphism (Static/Method Overloading)
- Resolved during compile time
- Method overloading with different parameters
```java
class Calculator {
    // Method overloading
    int add(int a, int b) {
        return a + b;
    }
    
    double add(double a, double b) {
        return a + b;
    }
    
    int add(int a, int b, int c) {
        return a + b + c;
    }
}
```

### 2. Runtime Polymorphism (Dynamic/Method Overriding)
- Resolved during runtime
- Method overriding in inherited classes
```java
class Animal {
    void makeSound() {
        System.out.println("Some sound");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Woof!");
    }
}

class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("Meow!");
    }
}
```

## 💡 Best Practices

1. **Use @Override Annotation**
   - Helps catch errors at compile-time
   - Makes code more readable and maintainable
   ```java
   class Child extends Parent {
       @Override
       void method() { }  // Compiler checks if method exists in Parent
   }
   ```

2. **Program to an Interface**
   - Use interface types for variables
   - Enables flexibility and loose coupling
   ```java
   // Good
   List<String> list = new ArrayList<>();
   
   // Not as flexible
   ArrayList<String> list = new ArrayList<>();
   ```

3. **Use Dynamic Dispatch**
   - Let runtime polymorphism handle method selection
   ```java
   Animal animal = getAnimal();  // Could return Dog or Cat
   animal.makeSound();  // Correct method called based on actual type
   ```

## ⚠️ Common Pitfalls

1. **Overloading vs Overriding Confusion**
   ```java
   class Parent {
       void method(String s) { }
   }
   
   class Child extends Parent {
       // This is overloading, not overriding!
       void method(Object o) { }
   }
   ```

2. **Hiding Static Methods**
   ```java
   class Parent {
       static void method() { }
   }
   
   class Child extends Parent {
       // This hides Parent's method, doesn't override it
       static void method() { }
   }
   ```

3. **Private Method Inheritance**
   ```java
   class Parent {
       private void method() { }
   }
   
   class Child extends Parent {
       // This is a new method, not an override
       void method() { }
   }
   ```

## 🎯 Interview Questions

1. **What's the difference between overloading and overriding?**
   ```java
   // Overloading - same name, different parameters
   class Example {
       void method(int x) { }
       void method(String s) { }
   }
   
   // Overriding - same signature, different implementation
   class Parent {
       void method(int x) { }
   }
   class Child extends Parent {
       @Override
       void method(int x) { }
   }
   ```

2. **How does polymorphism help in achieving loose coupling?**
   ```java
   // Tightly coupled
   ArrayList<String> list = new ArrayList<>();
   
   // Loosely coupled - can change implementation easily
   List<String> list = new ArrayList<>();  // or LinkedList, etc.
   ```

3. **Explain dynamic method dispatch with an example**
   ```java
   class Shape {
       void draw() { }
   }
   
   class Circle extends Shape {
       @Override
       void draw() { }
   }
   
   class Square extends Shape {
       @Override
       void draw() { }
   }
   
   // Usage
   Shape shape = getShape();  // Returns Circle or Square
   shape.draw();  // Correct draw method called at runtime
   ```

## 💻 Practice Exercise

Create a shape hierarchy demonstrating polymorphism:

```java
interface Shape {
    double getArea();
    double getPerimeter();
}

class Circle implements Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * Math.PI * radius;
    }
}

class Rectangle implements Shape {
    private double width;
    private double height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double getArea() {
        return width * height;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * (width + height);
    }
}

// Usage
public class Main {
    public static void printShapeInfo(Shape shape) {
        System.out.println("Area: " + shape.getArea());
        System.out.println("Perimeter: " + shape.getPerimeter());
    }
    
    public static void main(String[] args) {
        Shape circle = new Circle(5);
        Shape rectangle = new Rectangle(4, 6);
        
        printShapeInfo(circle);     // Polymorphic call
        printShapeInfo(rectangle);  // Polymorphic call
    }
}
```

## 📚 Additional Resources

1. [Oracle Java Documentation on Polymorphism](https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html)
2. [Effective Java - Item 52: Use overloading judiciously](https://www.amazon.com/Effective-Java-Joshua-Bloch/dp/0134685997)
3. [Design Patterns using Polymorphism](https://refactoring.guru/design-patterns/strategy) 