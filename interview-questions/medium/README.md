# Medium Low Level Design Interview Questions

This section contains intermediate-level LLD interview questions that focus on more complex design patterns and system interactions.

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

## Additional Resources
- [Design Patterns](../../design-patterns/README.md)
- [Clean Code Principles](../../best-practices/clean-code.md)
- [Error Handling](../../best-practices/error-handling.md) 