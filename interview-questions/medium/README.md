# Medium Low Level Design Interview Questions

This section contains intermediate-level LLD interview questions that focus on more complex design patterns and system interactions.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before attempting Medium questions, ensure you have mastered:
- [Easy Questions](../easy/README.md) - Complete all easy problems first
- [All SOLID Principles](../../solid-principles/README.md) - All five principles
- [Design Patterns](../../design-patterns/README.md) - Core patterns from each category
- [Interfaces](../../ood-basics/interfaces.md) - Contract-based design
- [Relationships](../../ood-basics/relationships.md) - Composition & Aggregation

### Recommended Patterns to Know
| Pattern | Used In |
|---------|---------|
| Strategy | Eviction policies, scheduling algorithms |
| Observer | Event notification, pub-sub |
| Factory | Object creation with logic |
| Decorator | Dynamic behavior addition |
| Command | Task encapsulation |
| Template Method | Algorithm skeletons |

### Key Concepts for Medium Level
- Thread safety and concurrency
- Resource management (pooling)
- Caching strategies
- Queue-based processing
- Rate limiting algorithms

### Interview Approach
```
1. Clarify Requirements & Scale (3-5 min)
         ↓
2. Identify Components & Interactions (5-7 min)
         ↓
3. Design Class Hierarchy & Interfaces (5-7 min)
         ↓
4. Implement Core Logic with Patterns (15-20 min)
         ↓
5. Address Concurrency & Edge Cases (5-7 min)
         ↓
6. Discuss Scalability & Improvements (5 min)
```

### Learning Path
| Level | Focus | Time Estimate |
|-------|-------|---------------|
| [Easy](../easy/README.md) | OOP basics, simple patterns | 1-2 weeks |
| 📍 Medium (You're here) | Complex patterns, concurrency | 2-3 weeks |
| [Hard](../hard/README.md) | Distributed systems, architecture | 3-4 weeks |

### Tips for Medium Questions
- Think about thread safety early
- Use design patterns appropriately
- Consider extensibility (OCP)
- Handle failure scenarios
- Discuss trade-offs

## Questions List

1. [Design a Task Scheduler](#design-a-task-scheduler)
2. [Design a Cache System](#design-a-cache-system)
3. [Design a Rate Limiter](#design-a-rate-limiter)
4. [Design a Message Queue](#design-a-message-queue)
5. [Design a Connection Pool](#design-a-connection-pool)

## Design a Task Scheduler

### Requirements
- Schedule tasks to run at specific times
- Support recurring tasks
- Handle task priorities
- Manage task dependencies
- Provide task status tracking

### Example Solution

#### Java
```java
public class Task {
    private String id;
    private String name;
    private int priority;
    private LocalDateTime scheduledTime;
    private Duration interval;
    private Set<Task> dependencies;
    private TaskStatus status;
    
    public boolean canExecute() {
        return dependencies.stream()
                         .allMatch(task -> task.getStatus() == TaskStatus.COMPLETED);
    }
}

public class TaskScheduler {
    private PriorityQueue<Task> taskQueue;
    private Map<String, Task> tasks;
    private ExecutorService executor;
    
    public TaskScheduler(int threadPoolSize) {
        taskQueue = new PriorityQueue<>((t1, t2) -> 
            t1.getPriority() != t2.getPriority() 
                ? t2.getPriority() - t1.getPriority()
                : t1.getScheduledTime().compareTo(t2.getScheduledTime()));
        tasks = new ConcurrentHashMap<>();
        executor = Executors.newFixedThreadPool(threadPoolSize);
    }
    
    public void scheduleTask(Task task) {
        tasks.put(task.getId(), task);
        taskQueue.offer(task);
    }
    
    public void start() {
        while (true) {
            Task task = taskQueue.peek();
            if (task != null && task.getScheduledTime().isBefore(LocalDateTime.now())) {
                task = taskQueue.poll();
                if (task.canExecute()) {
                    executeTask(task);
                } else {
                    taskQueue.offer(task); // Requeue if dependencies not met
                }
            }
        }
    }
    
    private void executeTask(Task task) {
        executor.submit(() -> {
            try {
                task.execute();
                if (task.isRecurring()) {
                    task.updateNextScheduledTime();
                    taskQueue.offer(task);
                }
            } catch (Exception e) {
                handleTaskError(task, e);
            }
        });
    }
}
```

#### Python
```python
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Set, Dict, Optional
import heapq
from concurrent.futures import ThreadPoolExecutor

class TaskStatus(Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

@dataclass
class Task:
    id: str
    name: str
    priority: int
    scheduled_time: datetime
    interval: Optional[timedelta] = None
    dependencies: Set['Task'] = field(default_factory=set)
    status: TaskStatus = TaskStatus.PENDING
    
    def can_execute(self) -> bool:
        return all(task.status == TaskStatus.COMPLETED 
                   for task in self.dependencies)
    
    def __lt__(self, other):
        if self.priority != other.priority:
            return self.priority > other.priority
        return self.scheduled_time < other.scheduled_time

class TaskScheduler:
    def __init__(self, thread_pool_size: int):
        self._task_queue: list = []
        self._tasks: Dict[str, Task] = {}
        self._executor = ThreadPoolExecutor(max_workers=thread_pool_size)
    
    def schedule_task(self, task: Task) -> None:
        self._tasks[task.id] = task
        heapq.heappush(self._task_queue, task)
    
    def _execute_task(self, task: Task) -> None:
        try:
            task.execute()
            if task.interval:
                task.scheduled_time += task.interval
                heapq.heappush(self._task_queue, task)
        except Exception as e:
            self._handle_task_error(task, e)
```

#### C++
```cpp
#include <queue>
#include <unordered_map>
#include <thread>
#include <chrono>
#include <functional>

enum class TaskStatus { PENDING, RUNNING, COMPLETED, FAILED };

struct Task {
    std::string id;
    std::string name;
    int priority;
    std::chrono::system_clock::time_point scheduledTime;
    std::set<Task*> dependencies;
    TaskStatus status = TaskStatus::PENDING;
    
    bool canExecute() const {
        for (const auto* dep : dependencies) {
            if (dep->status != TaskStatus::COMPLETED) return false;
        }
        return true;
    }
    
    bool operator<(const Task& other) const {
        if (priority != other.priority) return priority < other.priority;
        return scheduledTime > other.scheduledTime;
    }
};

class TaskScheduler {
private:
    std::priority_queue<Task> taskQueue;
    std::unordered_map<std::string, Task> tasks;
    std::vector<std::thread> workers;
    
public:
    TaskScheduler(int threadPoolSize) {
        for (int i = 0; i < threadPoolSize; ++i) {
            workers.emplace_back(&TaskScheduler::workerThread, this);
        }
    }
    
    void scheduleTask(const Task& task) {
        tasks[task.id] = task;
        taskQueue.push(task);
    }
};
```

### Key Points
- Priority Queue for task scheduling
- Observer pattern for task status updates
- Strategy pattern for different task types
- Thread pool for execution
- Error handling and recovery

## Design a Cache System

### Requirements
- Support different eviction policies (LRU, LFU)
- Set capacity constraints
- Handle concurrent access
- Support time-based expiration
- Optional persistence

### Example Solution
```java
public interface EvictionPolicy<K> {
    void keyAccessed(K key);
    K evictKey();
}

public class LRUEvictionPolicy<K> implements EvictionPolicy<K> {
    private LinkedHashSet<K> cache;
    
    @Override
    public void keyAccessed(K key) {
        cache.remove(key);
        cache.add(key);
    }
    
    @Override
    public K evictKey() {
        K first = cache.iterator().next();
        cache.remove(first);
        return first;
    }
}

public class Cache<K, V> {
    private final Map<K, V> storage;
    private final EvictionPolicy<K> evictionPolicy;
    private final int capacity;
    private final ReadWriteLock lock;
    
    public V get(K key) {
        lock.readLock().lock();
        try {
            V value = storage.get(key);
            if (value != null) {
                evictionPolicy.keyAccessed(key);
            }
            return value;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    public void put(K key, V value) {
        lock.writeLock().lock();
        try {
            if (storage.size() >= capacity) {
                K evictKey = evictionPolicy.evictKey();
                storage.remove(evictKey);
            }
            storage.put(key, value);
            evictionPolicy.keyAccessed(key);
        } finally {
            lock.writeLock().unlock();
        }
    }
}
```

### Key Points
- Strategy pattern for eviction policies
- Observer pattern for cache events
- Thread safety with read-write locks
- Factory pattern for cache creation

## Design a Rate Limiter

### Requirements
- Support different rate limiting algorithms
- Handle distributed systems
- Provide configurable time windows
- Support multiple rate limits per client
- Efficient token bucket implementation

### Example Solution
```java
public interface RateLimiter {
    boolean tryAcquire(String clientId);
}

public class TokenBucketRateLimiter implements RateLimiter {
    private final Map<String, TokenBucket> buckets;
    private final int capacity;
    private final int refillRate;
    
    private class TokenBucket {
        private int tokens;
        private long lastRefillTime;
        
        public synchronized boolean tryConsume() {
            refill();
            if (tokens > 0) {
                tokens--;
                return true;
            }
            return false;
        }
        
        private void refill() {
            long now = System.currentTimeMillis();
            long timePassed = now - lastRefillTime;
            int newTokens = (int) (timePassed * refillRate / 1000);
            tokens = Math.min(capacity, tokens + newTokens);
            lastRefillTime = now;
        }
    }
    
    @Override
    public boolean tryAcquire(String clientId) {
        TokenBucket bucket = buckets.computeIfAbsent(clientId,
            k -> new TokenBucket());
        return bucket.tryConsume();
    }
}
```

### Key Points
- Strategy pattern for different algorithms
- Thread safety considerations
- Efficient time window handling
- Distributed system support

## Design a Message Queue

### Requirements
- Support pub/sub pattern
- Ensure message persistence
- Handle multiple topics
- Provide message acknowledgment
- Support message replay

### Example Solution
```java
public class Message {
    private String id;
    private String topic;
    private byte[] payload;
    private Map<String, String> headers;
    private LocalDateTime timestamp;
}

public class Topic {
    private String name;
    private List<Partition> partitions;
    private Map<String, Consumer> consumers;
    private BlockingQueue<Message> messageQueue;
    
    public void publish(Message message) {
        messageQueue.offer(message);
        notifyConsumers(message);
    }
    
    private void notifyConsumers(Message message) {
        for (Consumer consumer : consumers.values()) {
            consumer.onMessage(message);
        }
    }
}

public class MessageBroker {
    private Map<String, Topic> topics;
    private MessageStore messageStore;
    
    public void createTopic(String topicName) {
        topics.putIfAbsent(topicName, new Topic(topicName));
    }
    
    public void publish(String topic, Message message) {
        Topic t = topics.get(topic);
        if (t != null) {
            messageStore.store(message);
            t.publish(message);
        }
    }
    
    public void subscribe(String topic, Consumer consumer) {
        Topic t = topics.get(topic);
        if (t != null) {
            t.addConsumer(consumer);
        }
    }
}
```

### Key Points
- Observer pattern for pub/sub
- Strategy pattern for message handling
- Factory pattern for topic creation
- Thread safety for message delivery

## Design a Connection Pool

### Requirements
- Manage database connections
- Support connection timeouts
- Handle connection validation
- Implement connection reuse
- Support connection limits

### Example Solution
```java
public class ConnectionPool {
    private Queue<Connection> available;
    private Set<Connection> inUse;
    private final int maxConnections;
    private final long timeout;
    
    public synchronized Connection getConnection() throws TimeoutException {
        long startTime = System.currentTimeMillis();
        while (available.isEmpty() && inUse.size() >= maxConnections) {
            long waitTime = timeout - (System.currentTimeMillis() - startTime);
            if (waitTime <= 0) {
                throw new TimeoutException("Connection timeout");
            }
            try {
                wait(waitTime);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException(e);
            }
        }
        
        Connection conn = available.isEmpty() 
            ? createConnection() 
            : available.poll();
            
        if (validateConnection(conn)) {
            inUse.add(conn);
            return conn;
        }
        
        return getConnection(); // Retry with new connection
    }
    
    public synchronized void releaseConnection(Connection conn) {
        if (inUse.remove(conn)) {
            available.offer(conn);
            notifyAll();
        }
    }
    
    private boolean validateConnection(Connection conn) {
        try {
            return !conn.isClosed() && conn.isValid(1);
        } catch (SQLException e) {
            return false;
        }
    }
}
```

### Key Points
- Object pool pattern
- Thread safety for connection management
- Strategy pattern for validation
- Timeout handling
- Connection lifecycle management

## ❓ Frequently Asked Questions

### Q1: How do I handle concurrency in LLD problems?
**A:** Common approaches:
| Technique | When to Use |
|-----------|-------------|
| synchronized/locks | Shared mutable state |
| Concurrent collections | Thread-safe data structures |
| Atomic variables | Simple counters/flags |
| Producer-consumer | Task queues |
| Read-write locks | Read-heavy scenarios |

### Q2: When should I use a queue vs direct method calls?
**A:** Use queues when:
- Producer and consumer work at different speeds
- Need to handle backpressure
- Want async/non-blocking behavior
- Need persistence/durability
- Want to decouple components

### Q3: How do I design for extensibility?
**A:** Apply these principles:
- Define interfaces for variable behavior
- Use composition over inheritance
- Apply Strategy pattern for algorithms
- Follow Open/Closed Principle
- Inject dependencies

### Q4: How detailed should my solution be?
**A:** Medium problems require:
- Complete class structure
- Key algorithms implemented
- Thread safety considerations
- Error handling
- Trade-off discussions
- Extensibility points identified

### Q5: How do I choose between different caching strategies?
**A:**
| Strategy | When to Use |
|----------|-------------|
| LRU | General purpose, access recency matters |
| LFU | Access frequency matters |
| TTL | Time-sensitive data |
| Write-through | Strong consistency needed |
| Write-behind | Performance priority |

### Q6: What's the difference between these problems and system design?
**A:**
| LLD (Low Level Design) | System Design |
|----------------------|---------------|
| Class/code level | Architecture level |
| Single process | Distributed systems |
| OOP, patterns | Scalability, reliability |
| Implementation focus | Component interaction |
| Write actual code | Draw diagrams |

### Q7: How do I handle time-based features (timeouts, scheduling)?
**A:** Options:
- ScheduledExecutorService (Java)
- Timer threads
- Delay queues
- External schedulers (cron, Quartz)
- Mention trade-offs of each approach

## Additional Resources
- [Design Patterns](../../design-patterns/README.md)
- [Clean Code Principles](../../best-practices/clean-code.md)
- [Error Handling](../../best-practices/error-handling.md) 