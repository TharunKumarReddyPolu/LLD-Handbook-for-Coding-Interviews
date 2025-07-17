# 🤝 Association, Aggregation & Composition in Object-Oriented Programming

## 📝 Definition
Object relationships define how objects interact with each other in an object-oriented system. The three main types of relationships are:
1. Association - Objects are related but independent
2. Aggregation - "Has-a" relationship with loose coupling
3. Composition - "Part-of" relationship with strong coupling

## 🎯 Key Concepts

### 1. Association
- Represents a relationship where objects are connected but independent
- Can be one-to-one, one-to-many, or many-to-many
```java
public class Student {
    private List<Course> courses;  // Student takes courses
    
    public void enrollCourse(Course course) {
        courses.add(course);
    }
}

public class Course {
    private List<Student> students;  // Course has students
    
    public void addStudent(Student student) {
        students.add(student);
    }
}
```

### 2. Aggregation
- "Has-a" relationship
- Child can exist independently of parent
```java
public class University {
    private List<Department> departments;  // University has departments
    
    public void addDepartment(Department department) {
        departments.add(department);
    }
}

public class Department {
    private String name;
    // Department can exist without University
}
```

### 3. Composition
- "Part-of" relationship
- Child cannot exist without parent
```java
public class Car {
    private final Engine engine;  // Car owns Engine
    
    public Car() {
        engine = new Engine();  // Engine created with Car
    }
}

public class Engine {
    // Engine cannot exist without Car
}
```

## 💡 Best Practices

1. **Choose the Right Relationship**
   ```java
   // Association - Teacher teaches Student
   class Teacher {
       private List<Student> students;
   }
   
   // Aggregation - Library has Books
   class Library {
       private List<Book> books;  // Books can exist without Library
   }
   
   // Composition - House has Rooms
   class House {
       private final List<Room> rooms;  // Rooms cannot exist without House
       
       public House() {
           rooms = new ArrayList<>();
           rooms.add(new Room("Living Room"));
           rooms.add(new Room("Bedroom"));
       }
   }
   ```

2. **Use Interfaces for Loose Coupling**
   ```java
   // Interface for payment methods
   interface PaymentMethod {
       void processPayment(double amount);
   }
   
   // Different implementations
   class CreditCard implements PaymentMethod {
       @Override
       public void processPayment(double amount) { }
   }
   
   class PayPal implements PaymentMethod {
       @Override
       public void processPayment(double amount) { }
   }
   
   // Order uses payment method through interface
   class Order {
       private PaymentMethod paymentMethod;  // Loose coupling
   }
   ```

3. **Clear Ownership and Lifecycle Management**
   ```java
   // Clear ownership with composition
   public class Document {
       private final List<Page> pages;
       
       public Document() {
           pages = new ArrayList<>();
       }
       
       public void addPage(String content) {
           pages.add(new Page(content));
       }
       
       // Pages are managed by Document
       private class Page {
           private String content;
           
           Page(String content) {
               this.content = content;
           }
       }
   }
   ```

## ⚠️ Common Pitfalls

1. **Circular Dependencies**
   ```java
   // Bad - circular dependency
   class A {
       private B b;
   }
   
   class B {
       private A a;  // Creates circular dependency
   }
   
   // Better - use interfaces or restructure
   interface AInterface {
       void doSomething();
   }
   
   class A implements AInterface {
       private B b;
   }
   
   class B {
       private AInterface a;  // Depends on interface
   }
   ```

2. **Strong Coupling**
   ```java
   // Bad - strongly coupled
   class ShoppingCart {
       private CreditCardPayment payment;  // Specific implementation
   }
   
   // Better - loosely coupled
   class ShoppingCart {
       private PaymentMethod payment;  // Interface
   }
   ```

3. **Memory Leaks in Bidirectional Relationships**
   ```java
   // Potential memory leak
   class Parent {
       private List<Child> children = new ArrayList<>();
       
       public void addChild(Child child) {
           children.add(child);
           child.setParent(this);  // Bidirectional reference
       }
   }
   
   class Child {
       private Parent parent;
       
       public void setParent(Parent parent) {
           this.parent = parent;
       }
   }
   ```

## 🎯 Interview Questions

1. **What's the difference between aggregation and composition?**
   ```java
   // Aggregation - car has a driver
   class Car {
       private Driver driver;  // Driver can exist without car
   }
   
   // Composition - car has an engine
   class Car {
       private final Engine engine;  // Engine cannot exist without car
   }
   ```

2. **How do you implement a many-to-many relationship?**
   ```java
   class Student {
       private List<Course> courses;
       
       public void enrollCourse(Course course) {
           courses.add(course);
           course.addStudent(this);
       }
   }
   
   class Course {
       private List<Student> students;
       
       public void addStudent(Student student) {
           students.add(student);
       }
   }
   ```

3. **When should you use composition over inheritance?**
   ```java
   // Inheritance - might be problematic
   class Stack extends ArrayList<String> { }
   
   // Composition - better approach
   class Stack {
       private List<String> elements = new ArrayList<>();
       
       public void push(String item) {
           elements.add(item);
       }
   }
   ```

## 💻 Practice Exercise

Create a school management system demonstrating different relationships:

```java
// School system with different relationships
public class School {
    private final List<Department> departments;  // Composition
    private List<Student> students;             // Association
    private Address address;                    // Aggregation
    
    public School(String name, Address address) {
        this.departments = new ArrayList<>();
        this.students = new ArrayList<>();
        this.address = address;
    }
    
    public void addDepartment(String name) {
        departments.add(new Department(name));
    }
    
    public void enrollStudent(Student student) {
        students.add(student);
    }
}

public class Department {
    private final String name;
    private List<Teacher> teachers;
    private List<Course> courses;
    
    public Department(String name) {
        this.name = name;
        this.teachers = new ArrayList<>();
        this.courses = new ArrayList<>();
    }
    
    public void addTeacher(Teacher teacher) {
        teachers.add(teacher);
    }
    
    public void addCourse(Course course) {
        courses.add(course);
    }
}

public class Course {
    private String name;
    private Teacher teacher;
    private List<Student> enrolledStudents;
    
    public Course(String name, Teacher teacher) {
        this.name = name;
        this.teacher = teacher;
        this.enrolledStudents = new ArrayList<>();
    }
    
    public void enrollStudent(Student student) {
        enrolledStudents.add(student);
        student.addCourse(this);
    }
}

public class Student {
    private String name;
    private List<Course> courses;
    
    public Student(String name) {
        this.name = name;
        this.courses = new ArrayList<>();
    }
    
    public void addCourse(Course course) {
        courses.add(course);
    }
}

public class Teacher {
    private String name;
    private List<Course> coursesTeaching;
    
    public Teacher(String name) {
        this.name = name;
        this.coursesTeaching = new ArrayList<>();
    }
    
    public void assignCourse(Course course) {
        coursesTeaching.add(course);
    }
}

public class Address {
    private String street;
    private String city;
    private String state;
    private String zipCode;
    
    public Address(String street, String city, String state, String zipCode) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
    }
}

// Usage example
public class SchoolManagementSystem {
    public static void main(String[] args) {
        Address schoolAddress = new Address("123 Education St", "Learning City", "ED", "12345");
        School school = new School("Tech High", schoolAddress);
        
        // Create departments
        school.addDepartment("Computer Science");
        school.addDepartment("Mathematics");
        
        // Create and enroll students
        Student student1 = new Student("John Doe");
        Student student2 = new Student("Jane Smith");
        school.enrollStudent(student1);
        school.enrollStudent(student2);
        
        // Create teachers and courses
        Teacher teacher = new Teacher("Prof. Anderson");
        Course javaCourse = new Course("Java Programming", teacher);
        
        // Enroll students in course
        javaCourse.enrollStudent(student1);
        javaCourse.enrollStudent(student2);
    }
}
```

## 📚 Additional Resources

1. [UML Class Diagram Relationships](https://www.uml-diagrams.org/association.html)
2. [Design Patterns - Structural Patterns](https://refactoring.guru/design-patterns/structural-patterns)
3. [Clean Code - Chapter 10: Classes](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) 