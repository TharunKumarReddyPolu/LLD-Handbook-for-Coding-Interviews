# Hard Low Level Design Interview Questions

This section contains advanced LLD interview questions that focus on complex system design and architectural patterns.

## Questions List

1. [Design a Distributed Job Scheduler](#design-a-distributed-job-scheduler)
2. [Design a Distributed Lock Service](#design-a-distributed-lock-service)
3. [Design a Distributed Cache](#design-a-distributed-cache)
4. [Design a Notification Service](#design-a-notification-service)
5. [Design a Configuration Management System](#design-a-configuration-management-system)

## Design a Distributed Job Scheduler

### Requirements
- Distributed architecture
- Fault tolerance
- Job prioritization
- Task distribution
- State management
- Leader election
- Job recovery

### Example Solution
```java
public class DistributedScheduler {
    private final ZooKeeper zk;
    private final String leaderId;
    private final JobQueue jobQueue;
    private final Map<String, WorkerNode> workers;
    private final JobStateManager stateManager;
    
    public class WorkerNode {
        private String id;
        private NodeStatus status;
        private Set<Job> assignedJobs;
        private long lastHeartbeat;
        
        public void heartbeat() {
            lastHeartbeat = System.currentTimeMillis();
            updateZkState();
        }
        
        public boolean isAlive() {
            return System.currentTimeMillis() - lastHeartbeat < HEARTBEAT_TIMEOUT;
        }
    }
    
    public class Job implements Comparable<Job> {
        private String id;
        private int priority;
        private JobStatus status;
        private String assignedWorker;
        private Map<String, Object> parameters;
        private LocalDateTime scheduledTime;
        
        @Override
        public int compareTo(Job other) {
            int priorityCompare = other.priority - this.priority;
            return priorityCompare != 0 ? priorityCompare 
                : scheduledTime.compareTo(other.scheduledTime);
        }
    }
    
    public void scheduleJob(Job job) {
        // Ensure we're the leader
        if (!isLeader()) {
            forwardToLeader(job);
            return;
        }
        
        // Store job state
        stateManager.saveJob(job);
        
        // Add to distributed queue
        jobQueue.offer(job);
        
        // Notify workers
        notifyWorkers();
    }
    
    private void handleWorkerFailure(String workerId) {
        WorkerNode worker = workers.get(workerId);
        if (worker != null) {
            // Reassign jobs
            for (Job job : worker.assignedJobs) {
                job.setStatus(JobStatus.PENDING);
                jobQueue.offer(job);
            }
            
            // Update cluster state
            workers.remove(workerId);
            updateClusterState();
        }
    }
    
    private void distributeJobs() {
        while (!jobQueue.isEmpty()) {
            Job job = jobQueue.peek();
            WorkerNode worker = findAvailableWorker();
            
            if (worker == null) {
                break; // No available workers
            }
            
            job = jobQueue.poll();
            assignJobToWorker(job, worker);
        }
    }
}

public class JobStateManager {
    private final Database db;
    private final Cache cache;
    
    public void saveJob(Job job) {
        // Save to persistent storage
        db.saveJob(job);
        
        // Update cache
        cache.put(job.getId(), job);
        
        // Notify watchers
        notifyJobStateChange(job);
    }
    
    public Job getJob(String jobId) {
        // Try cache first
        Job job = cache.get(jobId);
        if (job == null) {
            // Fall back to database
            job = db.getJob(jobId);
            if (job != null) {
                cache.put(jobId, job);
            }
        }
        return job;
    }
}

public class LeaderElection {
    private final ZooKeeper zk;
    private final String electionPath;
    private String leaderId;
    
    public void start() {
        // Create ephemeral sequential node
        String path = zk.create(electionPath + "/node-", 
                              new byte[0],
                              ZooDefs.Ids.OPEN_ACL_UNSAFE,
                              CreateMode.EPHEMERAL_SEQUENTIAL);
        
        // Watch for changes
        watchNode(path);
    }
    
    private void watchNode(String path) {
        zk.exists(path, event -> {
            if (event.getType() == EventType.NodeDeleted) {
                // Previous leader died, start election
                handleLeaderFailure();
            }
        });
    }
}
```

### Key Points
- Distributed system design
- Leader election with ZooKeeper
- Job state persistence
- Worker node management
- Fault tolerance mechanisms
- Job recovery strategies

## Design a Distributed Lock Service

### Requirements
- Distributed lock acquisition
- Lock timeout handling
- Deadlock prevention
- Lock reentrance
- Client session management
- High availability

### Example Solution
```java
public class DistributedLock {
    private final String lockPath;
    private final ZooKeeper zk;
    private final String clientId;
    private final int lockTimeout;
    
    public boolean acquire(String resource) throws LockException {
        String lockPath = getLockPath(resource);
        
        try {
            // Create ephemeral node
            zk.create(lockPath, clientId.getBytes(),
                     ZooDefs.Ids.OPEN_ACL_UNSAFE,
                     CreateMode.EPHEMERAL);
            return true;
        } catch (NodeExistsException e) {
            // Check if lock is stale
            if (isLockStale(lockPath)) {
                forceUnlock(lockPath);
                return acquire(resource);
            }
            return false;
        }
    }
    
    public boolean release(String resource) {
        String lockPath = getLockPath(resource);
        try {
            Stat stat = zk.exists(lockPath, false);
            if (stat != null) {
                byte[] data = zk.getData(lockPath, false, stat);
                if (Arrays.equals(data, clientId.getBytes())) {
                    zk.delete(lockPath, stat.getVersion());
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            throw new LockException("Failed to release lock", e);
        }
    }
    
    private boolean isLockStale(String lockPath) {
        try {
            Stat stat = zk.exists(lockPath, false);
            if (stat == null) {
                return true;
            }
            
            byte[] data = zk.getData(lockPath, false, stat);
            String ownerId = new String(data);
            
            // Check if owner is still alive
            return !isClientAlive(ownerId) ||
                   System.currentTimeMillis() - stat.getCtime() > lockTimeout;
        } catch (Exception e) {
            return false;
        }
    }
}

public class LockManager {
    private final Map<String, Lock> activeLocks;
    private final DeadlockDetector deadlockDetector;
    private final SessionManager sessionManager;
    
    public synchronized boolean acquireLock(String clientId, 
                                          String resource,
                                          long timeout) {
        // Check for deadlocks
        if (deadlockDetector.wouldCreateDeadlock(clientId, resource)) {
            throw new DeadlockException("Would create deadlock");
        }
        
        Lock lock = activeLocks.get(resource);
        if (lock == null) {
            lock = new Lock(resource);
            activeLocks.put(resource, lock);
        }
        
        return lock.acquire(clientId, timeout);
    }
    
    public synchronized void releaseLock(String clientId, String resource) {
        Lock lock = activeLocks.get(resource);
        if (lock != null && lock.isOwnedBy(clientId)) {
            lock.release();
            if (!lock.isHeld()) {
                activeLocks.remove(resource);
            }
        }
    }
}

public class DeadlockDetector {
    private final Map<String, Set<String>> resourceGraph;
    
    public boolean wouldCreateDeadlock(String clientId, String resource) {
        // Build wait-for graph
        DirectedGraph graph = buildWaitForGraph();
        graph.addEdge(clientId, resource);
        
        // Check for cycles
        return graph.hasCycle();
    }
    
    private DirectedGraph buildWaitForGraph() {
        DirectedGraph graph = new DirectedGraph();
        for (Map.Entry<String, Set<String>> entry : resourceGraph.entrySet()) {
            String client = entry.getKey();
            for (String resource : entry.getValue()) {
                graph.addEdge(client, resource);
            }
        }
        return graph;
    }
}
```

### Key Points
- Distributed coordination
- ZooKeeper for lock management
- Deadlock detection
- Session management
- Lock timeout handling
- High availability design

## Design a Distributed Cache

### Requirements
- Consistent hashing
- Cache coherence
- Data partitioning
- Replication
- Failure handling
- Cache invalidation

### Example Solution
```java
public class DistributedCache<K, V> {
    private final ConsistentHash<CacheNode> ring;
    private final Map<String, CacheNode> nodes;
    private final ReplicationManager replicationManager;
    private final int replicationFactor;
    
    public V get(K key) {
        String hashKey = hashKey(key);
        List<CacheNode> responsibleNodes = ring.getNodes(hashKey, replicationFactor);
        
        // Try primary node first
        CacheNode primaryNode = responsibleNodes.get(0);
        V value = primaryNode.get(hashKey);
        
        if (value == null) {
            // Try replica nodes
            for (int i = 1; i < responsibleNodes.size(); i++) {
                value = responsibleNodes.get(i).get(hashKey);
                if (value != null) {
                    // Repair primary node
                    primaryNode.put(hashKey, value);
                    break;
                }
            }
        }
        
        return value;
    }
    
    public void put(K key, V value) {
        String hashKey = hashKey(key);
        List<CacheNode> responsibleNodes = ring.getNodes(hashKey, replicationFactor);
        
        // Write to all replicas
        CompletableFuture<Void>[] futures = new CompletableFuture[responsibleNodes.size()];
        for (int i = 0; i < responsibleNodes.size(); i++) {
            CacheNode node = responsibleNodes.get(i);
            futures[i] = CompletableFuture.runAsync(() -> node.put(hashKey, value));
        }
        
        // Wait for quorum
        int quorum = (replicationFactor / 2) + 1;
        CompletableFuture.allOf(Arrays.copyOf(futures, quorum)).join();
    }
}

public class CacheNode {
    private final String id;
    private final Cache<String, Object> localCache;
    private final Map<String, Long> versions;
    
    public void put(String key, Object value) {
        long version = nextVersion();
        versions.put(key, version);
        localCache.put(key, new VersionedValue(value, version));
    }
    
    public Object get(String key) {
        VersionedValue value = localCache.get(key);
        return value != null ? value.getValue() : null;
    }
    
    public void handleNodeFailure(CacheNode failedNode) {
        // Take over failed node's range
        Set<String> keysToReplicate = getKeysInRange(failedNode.getRange());
        for (String key : keysToReplicate) {
            replicateKey(key);
        }
    }
}

public class ConsistentHash<T extends Node> {
    private final TreeMap<Long, T> ring;
    private final HashFunction hashFunction;
    private final int numberOfReplicas;
    
    public void addNode(T node) {
        for (int i = 0; i < numberOfReplicas; i++) {
            ring.put(hashFunction.hash(node.getId() + i), node);
        }
    }
    
    public void removeNode(T node) {
        for (int i = 0; i < numberOfReplicas; i++) {
            ring.remove(hashFunction.hash(node.getId() + i));
        }
    }
    
    public List<T> getNodes(String key, int count) {
        List<T> nodes = new ArrayList<>(count);
        if (ring.isEmpty()) {
            return nodes;
        }
        
        long hash = hashFunction.hash(key);
        Map.Entry<Long, T> entry = ring.ceilingEntry(hash);
        if (entry == null) {
            entry = ring.firstEntry();
        }
        
        nodes.add(entry.getValue());
        while (nodes.size() < count) {
            entry = ring.higherEntry(entry.getKey());
            if (entry == null) {
                entry = ring.firstEntry();
            }
            if (!nodes.contains(entry.getValue())) {
                nodes.add(entry.getValue());
            }
        }
        
        return nodes;
    }
}
```

### Key Points
- Consistent hashing implementation
- Replication strategies
- Failure recovery
- Cache coherence protocol
- Version control
- Quorum-based writes

## Design a Notification Service

### Requirements
- Multiple notification channels
- Message prioritization
- Delivery guarantees
- Rate limiting
- Template management
- Analytics tracking

### Example Solution
```java
public class NotificationService {
    private final Map<String, NotificationChannel> channels;
    private final TemplateEngine templateEngine;
    private final RateLimiter rateLimiter;
    private final NotificationStore store;
    private final AnalyticsTracker analytics;
    
    public void sendNotification(Notification notification) {
        // Check rate limits
        if (!rateLimiter.allowNotification(notification)) {
            handleRateLimitExceeded(notification);
            return;
        }
        
        // Process template
        String content = templateEngine.process(
            notification.getTemplateId(),
            notification.getParameters()
        );
        
        // Select channels
        List<NotificationChannel> selectedChannels = 
            selectChannels(notification.getUser(), notification.getPriority());
        
        // Send via all channels
        List<CompletableFuture<DeliveryResult>> futures = new ArrayList<>();
        for (NotificationChannel channel : selectedChannels) {
            futures.add(CompletableFuture.supplyAsync(() -> 
                channel.send(notification.getUser(), content)
            ));
        }
        
        // Wait for results
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
            .thenAccept(v -> handleDeliveryResults(notification, futures));
    }
    
    private void handleDeliveryResults(
            Notification notification,
            List<CompletableFuture<DeliveryResult>> futures) {
        // Track analytics
        analytics.trackDelivery(notification);
        
        // Store results
        store.saveResults(notification, 
            futures.stream()
                   .map(CompletableFuture::join)
                   .collect(Collectors.toList()));
        
        // Handle failures
        List<DeliveryResult> failures = futures.stream()
            .map(CompletableFuture::join)
            .filter(r -> !r.isSuccess())
            .collect(Collectors.toList());
            
        if (!failures.isEmpty()) {
            handleFailures(notification, failures);
        }
    }
}

public interface NotificationChannel {
    DeliveryResult send(User user, String content);
    boolean canHandle(NotificationType type);
    int getPriority();
}

public class EmailChannel implements NotificationChannel {
    private final EmailClient emailClient;
    private final RetryPolicy retryPolicy;
    
    @Override
    public DeliveryResult send(User user, String content) {
        return retryPolicy.execute(() -> {
            Email email = new Email(user.getEmail(), content);
            return emailClient.send(email);
        });
    }
}

public class PushNotificationChannel implements NotificationChannel {
    private final Map<String, PushProvider> providers;
    
    @Override
    public DeliveryResult send(User user, String content) {
        List<CompletableFuture<DeliveryResult>> futures = new ArrayList<>();
        
        // Send to all user devices
        for (Device device : user.getDevices()) {
            PushProvider provider = providers.get(device.getProvider());
            if (provider != null) {
                futures.add(CompletableFuture.supplyAsync(() ->
                    provider.send(device.getToken(), content)
                ));
            }
        }
        
        // Wait for any success
        return CompletableFuture.anyOf(futures.toArray(new CompletableFuture[0]))
            .thenApply(result -> (DeliveryResult) result)
            .join();
    }
}
```

### Key Points
- Multi-channel support
- Asynchronous processing
- Retry mechanisms
- Template rendering
- Analytics integration
- Failure handling

## Design a Configuration Management System

### Requirements
- Hierarchical configuration
- Dynamic updates
- Version control
- Access control
- Change auditing
- Configuration validation

### Example Solution
```java
public class ConfigurationService {
    private final ConfigStore store;
    private final VersionControl versionControl;
    private final ConfigValidator validator;
    private final AuditLog auditLog;
    private final Cache<String, Configuration> cache;
    
    public Configuration getConfiguration(String path, String version) {
        // Check cache
        String cacheKey = getCacheKey(path, version);
        Configuration config = cache.get(cacheKey);
        if (config != null) {
            return config;
        }
        
        // Load from store
        config = store.load(path, version);
        if (config != null) {
            cache.put(cacheKey, config);
        }
        
        return config;
    }
    
    public void updateConfiguration(
            String path, 
            Configuration newConfig,
            String userId) {
        // Validate new configuration
        List<ValidationError> errors = validator.validate(newConfig);
        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
        
        // Create new version
        String version = versionControl.createVersion(path, newConfig);
        
        // Store configuration
        store.save(path, version, newConfig);
        
        // Invalidate cache
        cache.invalidate(getCacheKey(path, version));
        
        // Log audit entry
        auditLog.logChange(path, version, userId, newConfig);
        
        // Notify subscribers
        notifyConfigurationChanged(path, version);
    }
}

public class Configuration {
    private final Map<String, Object> properties;
    private final Map<String, Configuration> children;
    private final String version;
    private final LocalDateTime lastModified;
    
    public Object getValue(String key) {
        String[] parts = key.split("\\.");
        return getValue(parts, 0);
    }
    
    private Object getValue(String[] parts, int index) {
        if (index == parts.length - 1) {
            return properties.get(parts[index]);
        }
        
        Configuration child = children.get(parts[index]);
        return child != null ? child.getValue(parts, index + 1) : null;
    }
}

public class ConfigValidator {
    private final Map<String, ValidationRule> rules;
    
    public List<ValidationError> validate(Configuration config) {
        List<ValidationError> errors = new ArrayList<>();
        
        // Validate properties
        for (Map.Entry<String, Object> entry : config.getProperties().entrySet()) {
            ValidationRule rule = rules.get(entry.getKey());
            if (rule != null) {
                errors.addAll(rule.validate(entry.getValue()));
            }
        }
        
        // Validate children
        for (Map.Entry<String, Configuration> entry : config.getChildren().entrySet()) {
            errors.addAll(validate(entry.getValue()));
        }
        
        return errors;
    }
}

public class VersionControl {
    private final Git git;
    private final String repositoryPath;
    
    public String createVersion(String path, Configuration config) {
        // Serialize configuration
        byte[] content = serialize(config);
        
        // Create commit
        git.add(path);
        RevCommit commit = git.commit()
            .setMessage("Update configuration: " + path)
            .setAuthor("system", "system@example.com")
            .call();
            
        return commit.getName();
    }
    
    public List<ConfigurationVersion> getHistory(String path) {
        return git.log()
            .addPath(path)
            .call()
            .stream()
            .map(this::toConfigurationVersion)
            .collect(Collectors.toList());
    }
}
```

### Key Points
- Hierarchical configuration management
- Version control integration
- Caching strategy
- Validation framework
- Audit logging
- Change notification

## Additional Resources
- [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [Distributed Systems for Fun and Profit](http://book.mixu.net/distsys/single-page.html)
- [Designing Data-Intensive Applications](https://dataintensive.net/) 