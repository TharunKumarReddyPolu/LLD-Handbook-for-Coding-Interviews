# Hard Low Level Design Interview Questions

This section contains advanced LLD interview questions that focus on complex system design and architectural patterns.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before attempting Hard questions, ensure you have mastered:
- [Easy Questions](../easy/README.md) - All easy problems
- [Medium Questions](../medium/README.md) - All medium problems
- [All SOLID Principles](../../solid-principles/README.md) - Deep understanding
- [All Design Patterns](../../design-patterns/README.md) - When and why to use each
- [Best Practices](../../best-practices/README.md) - Clean code, testing, error handling

### Advanced Concepts Required
| Concept | Why It's Needed |
|---------|----------------|
| Distributed Systems | Coordination across nodes |
| Leader Election | Single point of coordination |
| Consensus Algorithms | Distributed agreement |
| Consistent Hashing | Data distribution |
| Event-Driven Architecture | Async communication |
| Fault Tolerance | Handling failures gracefully |

### Recommended Patterns for Hard Questions
| Pattern | Used In |
|---------|---------|
| Observer | Distributed notifications |
| Strategy | Pluggable algorithms |
| Factory | Service creation |
| Proxy | Remote access, caching |
| Chain of Responsibility | Request processing |
| State | State machine management |
| Command | Task distribution |

### Interview Approach
```
1. Clarify Requirements & Constraints (5 min)
   - Scale, availability, consistency requirements
         ↓
2. High-Level Architecture (5-7 min)
   - Identify major components and their interactions
         ↓
3. Define APIs & Data Models (5-7 min)
   - Interface contracts between components
         ↓
4. Detail Core Components (15-20 min)
   - Class design with patterns
   - Handle distributed concerns
         ↓
5. Address Failure Scenarios (5-7 min)
   - Node failures, network partitions
         ↓
6. Discuss Trade-offs & Alternatives (5 min)
   - CAP theorem considerations
```

### Learning Path
| Level | Focus | Time Estimate |
|-------|-------|---------------|
| [Easy](../easy/README.md) | OOP basics, simple patterns | 1-2 weeks |
| [Medium](../medium/README.md) | Complex patterns, concurrency | 2-3 weeks |
| 📍 Hard (You're here) | Distributed systems, architecture | 3-4 weeks |

### Tips for Hard Questions
- Start with requirements clarification
- Think about failure modes early
- Apply CAP theorem understanding
- Use established patterns (don't reinvent)
- Discuss monitoring and observability
- Consider operational concerns

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

**Java:**
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

**Python:**
```python
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Dict, Set, List, Optional, Any
import time
import heapq
from functools import total_ordering

class JobStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class NodeStatus(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

@total_ordering
@dataclass
class Job:
    id: str
    priority: int
    status: JobStatus
    assigned_worker: Optional[str] = None
    parameters: Dict[str, Any] = field(default_factory=dict)
    scheduled_time: datetime = field(default_factory=datetime.now)
    
    def __lt__(self, other):
        if self.priority != other.priority:
            return self.priority > other.priority  # Higher priority first
        return self.scheduled_time < other.scheduled_time

class WorkerNode:
    HEARTBEAT_TIMEOUT = 30000  # ms
    
    def __init__(self, node_id: str):
        self.id = node_id
        self.status = NodeStatus.ACTIVE
        self.assigned_jobs: Set[Job] = set()
        self.last_heartbeat = time.time() * 1000
    
    def heartbeat(self):
        self.last_heartbeat = time.time() * 1000
        self._update_zk_state()
    
    def is_alive(self) -> bool:
        return (time.time() * 1000) - self.last_heartbeat < self.HEARTBEAT_TIMEOUT
    
    def _update_zk_state(self):
        pass  # ZooKeeper state update

class DistributedScheduler:
    def __init__(self, zk_client):
        self.zk = zk_client
        self.leader_id: Optional[str] = None
        self.job_queue: List[Job] = []  # Min heap
        self.workers: Dict[str, WorkerNode] = {}
        self.state_manager = JobStateManager()
    
    def schedule_job(self, job: Job):
        if not self._is_leader():
            self._forward_to_leader(job)
            return
        
        self.state_manager.save_job(job)
        heapq.heappush(self.job_queue, job)
        self._notify_workers()
    
    def handle_worker_failure(self, worker_id: str):
        worker = self.workers.get(worker_id)
        if worker:
            for job in worker.assigned_jobs:
                job.status = JobStatus.PENDING
                heapq.heappush(self.job_queue, job)
            del self.workers[worker_id]
            self._update_cluster_state()
    
    def distribute_jobs(self):
        while self.job_queue:
            worker = self._find_available_worker()
            if not worker:
                break
            job = heapq.heappop(self.job_queue)
            self._assign_job_to_worker(job, worker)

class JobStateManager:
    def __init__(self):
        self.cache: Dict[str, Job] = {}
    
    def save_job(self, job: Job):
        self._save_to_db(job)
        self.cache[job.id] = job
        self._notify_job_state_change(job)
    
    def get_job(self, job_id: str) -> Optional[Job]:
        job = self.cache.get(job_id)
        if not job:
            job = self._load_from_db(job_id)
            if job:
                self.cache[job_id] = job
        return job
```

**C++:**
```cpp
#include <string>
#include <map>
#include <set>
#include <queue>
#include <chrono>
#include <memory>
#include <functional>

enum class JobStatus { PENDING, RUNNING, COMPLETED, FAILED };
enum class NodeStatus { ACTIVE, INACTIVE };

struct Job {
    std::string id;
    int priority;
    JobStatus status;
    std::string assignedWorker;
    std::map<std::string, std::string> parameters;
    std::chrono::system_clock::time_point scheduledTime;
    
    bool operator<(const Job& other) const {
        if (priority != other.priority) {
            return priority < other.priority;  // Higher priority first (for max-heap)
        }
        return scheduledTime > other.scheduledTime;
    }
};

class WorkerNode {
private:
    static constexpr long HEARTBEAT_TIMEOUT = 30000;
    std::string id;
    NodeStatus status;
    std::set<std::shared_ptr<Job>> assignedJobs;
    long lastHeartbeat;

public:
    WorkerNode(const std::string& id) : id(id), status(NodeStatus::ACTIVE) {
        heartbeat();
    }
    
    void heartbeat() {
        lastHeartbeat = std::chrono::duration_cast<std::chrono::milliseconds>(
            std::chrono::system_clock::now().time_since_epoch()).count();
    }
    
    bool isAlive() const {
        auto now = std::chrono::duration_cast<std::chrono::milliseconds>(
            std::chrono::system_clock::now().time_since_epoch()).count();
        return now - lastHeartbeat < HEARTBEAT_TIMEOUT;
    }
    
    std::set<std::shared_ptr<Job>>& getAssignedJobs() { return assignedJobs; }
};

class JobStateManager {
private:
    std::map<std::string, std::shared_ptr<Job>> cache;

public:
    void saveJob(std::shared_ptr<Job> job) {
        // Save to persistent storage (database)
        cache[job->id] = job;
        // Notify watchers
    }
    
    std::shared_ptr<Job> getJob(const std::string& jobId) {
        auto it = cache.find(jobId);
        if (it != cache.end()) {
            return it->second;
        }
        // Load from database and cache
        return nullptr;
    }
};

class DistributedScheduler {
private:
    std::string leaderId;
    std::priority_queue<Job> jobQueue;
    std::map<std::string, std::unique_ptr<WorkerNode>> workers;
    JobStateManager stateManager;
    
    bool isLeader() const { return true; }  // Simplified
    WorkerNode* findAvailableWorker();
    void assignJobToWorker(Job& job, WorkerNode* worker);

public:
    void scheduleJob(Job job) {
        if (!isLeader()) {
            // Forward to leader
            return;
        }
        
        auto jobPtr = std::make_shared<Job>(job);
        stateManager.saveJob(jobPtr);
        jobQueue.push(job);
        // Notify workers
    }
    
    void handleWorkerFailure(const std::string& workerId) {
        auto it = workers.find(workerId);
        if (it != workers.end()) {
            for (auto& job : it->second->getAssignedJobs()) {
                job->status = JobStatus::PENDING;
                jobQueue.push(*job);
            }
            workers.erase(it);
        }
    }
    
    void distributeJobs() {
        while (!jobQueue.empty()) {
            WorkerNode* worker = findAvailableWorker();
            if (!worker) break;
            
            Job job = jobQueue.top();
            jobQueue.pop();
            assignJobToWorker(job, worker);
        }
    }
};
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

**Java:**
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

**Python:**
```python
import threading
import time
from typing import Dict, Set, Optional
from collections import defaultdict

class LockException(Exception):
    pass

class DeadlockException(Exception):
    pass

class Lock:
    def __init__(self, resource: str):
        self.resource = resource
        self.owner: Optional[str] = None
        self.lock = threading.Lock()
    
    def acquire(self, client_id: str, timeout: float) -> bool:
        acquired = self.lock.acquire(timeout=timeout)
        if acquired:
            self.owner = client_id
        return acquired
    
    def release(self):
        self.owner = None
        self.lock.release()
    
    def is_owned_by(self, client_id: str) -> bool:
        return self.owner == client_id
    
    def is_held(self) -> bool:
        return self.owner is not None

class DirectedGraph:
    def __init__(self):
        self.edges: Dict[str, Set[str]] = defaultdict(set)
    
    def add_edge(self, from_node: str, to_node: str):
        self.edges[from_node].add(to_node)
    
    def has_cycle(self) -> bool:
        visited = set()
        rec_stack = set()
        
        def dfs(node: str) -> bool:
            visited.add(node)
            rec_stack.add(node)
            
            for neighbor in self.edges.get(node, []):
                if neighbor not in visited:
                    if dfs(neighbor):
                        return True
                elif neighbor in rec_stack:
                    return True
            
            rec_stack.remove(node)
            return False
        
        for node in self.edges:
            if node not in visited:
                if dfs(node):
                    return True
        return False

class DeadlockDetector:
    def __init__(self):
        self.resource_graph: Dict[str, Set[str]] = defaultdict(set)
    
    def would_create_deadlock(self, client_id: str, resource: str) -> bool:
        graph = self._build_wait_for_graph()
        graph.add_edge(client_id, resource)
        return graph.has_cycle()
    
    def _build_wait_for_graph(self) -> DirectedGraph:
        graph = DirectedGraph()
        for client, resources in self.resource_graph.items():
            for resource in resources:
                graph.add_edge(client, resource)
        return graph

class LockManager:
    def __init__(self):
        self._active_locks: Dict[str, Lock] = {}
        self._deadlock_detector = DeadlockDetector()
        self._lock = threading.Lock()
    
    def acquire_lock(self, client_id: str, resource: str, timeout: float) -> bool:
        with self._lock:
            if self._deadlock_detector.would_create_deadlock(client_id, resource):
                raise DeadlockException("Would create deadlock")
            
            lock = self._active_locks.get(resource)
            if lock is None:
                lock = Lock(resource)
                self._active_locks[resource] = lock
        
        return lock.acquire(client_id, timeout)
    
    def release_lock(self, client_id: str, resource: str):
        with self._lock:
            lock = self._active_locks.get(resource)
            if lock and lock.is_owned_by(client_id):
                lock.release()
                if not lock.is_held():
                    del self._active_locks[resource]
```

**C++:**
```cpp
#include <string>
#include <map>
#include <set>
#include <mutex>
#include <chrono>
#include <memory>
#include <stdexcept>

class LockException : public std::runtime_error {
public:
    LockException(const std::string& msg) : std::runtime_error(msg) {}
};

class DeadlockException : public std::runtime_error {
public:
    DeadlockException(const std::string& msg) : std::runtime_error(msg) {}
};

class Lock {
private:
    std::string resource;
    std::string owner;
    std::timed_mutex mutex;

public:
    Lock(const std::string& resource) : resource(resource) {}
    
    bool acquire(const std::string& clientId, long timeoutMs) {
        if (mutex.try_lock_for(std::chrono::milliseconds(timeoutMs))) {
            owner = clientId;
            return true;
        }
        return false;
    }
    
    void release() {
        owner.clear();
        mutex.unlock();
    }
    
    bool isOwnedBy(const std::string& clientId) const {
        return owner == clientId;
    }
    
    bool isHeld() const {
        return !owner.empty();
    }
};

class DirectedGraph {
private:
    std::map<std::string, std::set<std::string>> edges;
    
    bool dfs(const std::string& node, std::set<std::string>& visited,
             std::set<std::string>& recStack) {
        visited.insert(node);
        recStack.insert(node);
        
        for (const auto& neighbor : edges[node]) {
            if (visited.find(neighbor) == visited.end()) {
                if (dfs(neighbor, visited, recStack)) return true;
            } else if (recStack.find(neighbor) != recStack.end()) {
                return true;
            }
        }
        
        recStack.erase(node);
        return false;
    }

public:
    void addEdge(const std::string& from, const std::string& to) {
        edges[from].insert(to);
    }
    
    bool hasCycle() {
        std::set<std::string> visited, recStack;
        for (const auto& pair : edges) {
            if (visited.find(pair.first) == visited.end()) {
                if (dfs(pair.first, visited, recStack)) return true;
            }
        }
        return false;
    }
};

class DeadlockDetector {
private:
    std::map<std::string, std::set<std::string>> resourceGraph;

public:
    bool wouldCreateDeadlock(const std::string& clientId, const std::string& resource) {
        DirectedGraph graph = buildWaitForGraph();
        graph.addEdge(clientId, resource);
        return graph.hasCycle();
    }
    
    DirectedGraph buildWaitForGraph() {
        DirectedGraph graph;
        for (const auto& pair : resourceGraph) {
            for (const auto& resource : pair.second) {
                graph.addEdge(pair.first, resource);
            }
        }
        return graph;
    }
};

class LockManager {
private:
    std::map<std::string, std::unique_ptr<Lock>> activeLocks;
    DeadlockDetector deadlockDetector;
    std::mutex managerMutex;

public:
    bool acquireLock(const std::string& clientId, const std::string& resource, long timeout) {
        std::lock_guard<std::mutex> guard(managerMutex);
        
        if (deadlockDetector.wouldCreateDeadlock(clientId, resource)) {
            throw DeadlockException("Would create deadlock");
        }
        
        auto it = activeLocks.find(resource);
        if (it == activeLocks.end()) {
            activeLocks[resource] = std::make_unique<Lock>(resource);
        }
        
        return activeLocks[resource]->acquire(clientId, timeout);
    }
    
    void releaseLock(const std::string& clientId, const std::string& resource) {
        std::lock_guard<std::mutex> guard(managerMutex);
        
        auto it = activeLocks.find(resource);
        if (it != activeLocks.end() && it->second->isOwnedBy(clientId)) {
            it->second->release();
            if (!it->second->isHeld()) {
                activeLocks.erase(it);
            }
        }
    }
};
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

**Java:**
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

**Python:**
```python
import hashlib
from typing import TypeVar, Generic, Dict, List, Optional, Any
from dataclasses import dataclass
from sortedcontainers import SortedDict
import asyncio

K = TypeVar('K')
V = TypeVar('V')

@dataclass
class VersionedValue:
    value: Any
    version: int

class CacheNode:
    def __init__(self, node_id: str):
        self.id = node_id
        self._local_cache: Dict[str, VersionedValue] = {}
        self._versions: Dict[str, int] = {}
        self._version_counter = 0
    
    def put(self, key: str, value: Any):
        self._version_counter += 1
        self._versions[key] = self._version_counter
        self._local_cache[key] = VersionedValue(value, self._version_counter)
    
    def get(self, key: str) -> Optional[Any]:
        versioned = self._local_cache.get(key)
        return versioned.value if versioned else None
    
    def get_id(self) -> str:
        return self.id

class ConsistentHash:
    def __init__(self, num_replicas: int = 100):
        self._ring: SortedDict = SortedDict()
        self._num_replicas = num_replicas
    
    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode()).hexdigest(), 16)
    
    def add_node(self, node: CacheNode):
        for i in range(self._num_replicas):
            hash_val = self._hash(f"{node.get_id()}{i}")
            self._ring[hash_val] = node
    
    def remove_node(self, node: CacheNode):
        for i in range(self._num_replicas):
            hash_val = self._hash(f"{node.get_id()}{i}")
            if hash_val in self._ring:
                del self._ring[hash_val]
    
    def get_nodes(self, key: str, count: int) -> List[CacheNode]:
        if not self._ring:
            return []
        
        hash_val = self._hash(key)
        nodes = []
        
        # Find starting position
        idx = self._ring.bisect_left(hash_val)
        if idx >= len(self._ring):
            idx = 0
        
        # Collect unique nodes
        seen = set()
        keys = list(self._ring.keys())
        while len(nodes) < count and len(seen) < len(self._ring):
            node = self._ring[keys[idx]]
            if node.get_id() not in seen:
                nodes.append(node)
                seen.add(node.get_id())
            idx = (idx + 1) % len(keys)
        
        return nodes

class DistributedCache(Generic[K, V]):
    def __init__(self, replication_factor: int = 3):
        self._ring = ConsistentHash()
        self._replication_factor = replication_factor
    
    def _hash_key(self, key: K) -> str:
        return str(hash(key))
    
    def get(self, key: K) -> Optional[V]:
        hash_key = self._hash_key(key)
        nodes = self._ring.get_nodes(hash_key, self._replication_factor)
        
        if not nodes:
            return None
        
        # Try primary node first
        value = nodes[0].get(hash_key)
        
        if value is None:
            # Try replica nodes
            for node in nodes[1:]:
                value = node.get(hash_key)
                if value is not None:
                    # Repair primary node
                    nodes[0].put(hash_key, value)
                    break
        
        return value
    
    async def put(self, key: K, value: V):
        hash_key = self._hash_key(key)
        nodes = self._ring.get_nodes(hash_key, self._replication_factor)
        
        # Write to all replicas asynchronously
        tasks = [asyncio.to_thread(node.put, hash_key, value) for node in nodes]
        
        # Wait for quorum
        quorum = (self._replication_factor // 2) + 1
        done, _ = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
```

**C++:**
```cpp
#include <string>
#include <map>
#include <vector>
#include <memory>
#include <functional>
#include <optional>
#include <future>

template<typename T>
struct VersionedValue {
    T value;
    long version;
};

class CacheNode {
private:
    std::string id;
    std::map<std::string, VersionedValue<std::string>> localCache;
    std::map<std::string, long> versions;
    long versionCounter = 0;

public:
    CacheNode(const std::string& id) : id(id) {}
    
    void put(const std::string& key, const std::string& value) {
        versionCounter++;
        versions[key] = versionCounter;
        localCache[key] = {value, versionCounter};
    }
    
    std::optional<std::string> get(const std::string& key) {
        auto it = localCache.find(key);
        if (it != localCache.end()) {
            return it->second.value;
        }
        return std::nullopt;
    }
    
    const std::string& getId() const { return id; }
};

class ConsistentHash {
private:
    std::map<size_t, std::shared_ptr<CacheNode>> ring;
    int numberOfReplicas;
    std::hash<std::string> hasher;

public:
    ConsistentHash(int replicas = 100) : numberOfReplicas(replicas) {}
    
    void addNode(std::shared_ptr<CacheNode> node) {
        for (int i = 0; i < numberOfReplicas; i++) {
            size_t hash = hasher(node->getId() + std::to_string(i));
            ring[hash] = node;
        }
    }
    
    void removeNode(std::shared_ptr<CacheNode> node) {
        for (int i = 0; i < numberOfReplicas; i++) {
            size_t hash = hasher(node->getId() + std::to_string(i));
            ring.erase(hash);
        }
    }
    
    std::vector<std::shared_ptr<CacheNode>> getNodes(const std::string& key, int count) {
        std::vector<std::shared_ptr<CacheNode>> nodes;
        if (ring.empty()) return nodes;
        
        size_t hash = hasher(key);
        auto it = ring.lower_bound(hash);
        if (it == ring.end()) it = ring.begin();
        
        std::set<std::string> seen;
        while (nodes.size() < count && seen.size() < ring.size()) {
            if (seen.find(it->second->getId()) == seen.end()) {
                nodes.push_back(it->second);
                seen.insert(it->second->getId());
            }
            ++it;
            if (it == ring.end()) it = ring.begin();
        }
        
        return nodes;
    }
};

template<typename K, typename V>
class DistributedCache {
private:
    ConsistentHash ring;
    int replicationFactor;
    
    std::string hashKey(const K& key) {
        return std::to_string(std::hash<K>{}(key));
    }

public:
    DistributedCache(int replication = 3) : replicationFactor(replication) {}
    
    std::optional<V> get(const K& key) {
        std::string hashKey = this->hashKey(key);
        auto nodes = ring.getNodes(hashKey, replicationFactor);
        
        if (nodes.empty()) return std::nullopt;
        
        auto value = nodes[0]->get(hashKey);
        if (!value) {
            for (size_t i = 1; i < nodes.size(); i++) {
                value = nodes[i]->get(hashKey);
                if (value) {
                    nodes[0]->put(hashKey, *value);
                    break;
                }
            }
        }
        
        return value;
    }
    
    void put(const K& key, const V& value) {
        std::string hashKey = this->hashKey(key);
        auto nodes = ring.getNodes(hashKey, replicationFactor);
        
        std::vector<std::future<void>> futures;
        for (auto& node : nodes) {
            futures.push_back(std::async(std::launch::async, 
                [&node, &hashKey, &value]() {
                    node->put(hashKey, value);
                }));
        }
        
        // Wait for quorum
        int quorum = (replicationFactor / 2) + 1;
        for (int i = 0; i < quorum && i < futures.size(); i++) {
            futures[i].wait();
        }
    }
};
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

**Java:**
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

**Python:**
```python
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Dict, List, Any, Optional
from enum import Enum
import asyncio

class NotificationType(Enum):
    EMAIL = "email"
    PUSH = "push"
    SMS = "sms"

@dataclass
class DeliveryResult:
    success: bool
    message: str = ""

@dataclass
class User:
    id: str
    email: str
    devices: List['Device'] = None

@dataclass
class Device:
    token: str
    provider: str

@dataclass
class Notification:
    id: str
    user: User
    template_id: str
    parameters: Dict[str, Any]
    priority: int

class NotificationChannel(ABC):
    @abstractmethod
    async def send(self, user: User, content: str) -> DeliveryResult:
        pass
    
    @abstractmethod
    def can_handle(self, notification_type: NotificationType) -> bool:
        pass
    
    @abstractmethod
    def get_priority(self) -> int:
        pass

class EmailChannel(NotificationChannel):
    def __init__(self, email_client, retry_policy):
        self._email_client = email_client
        self._retry_policy = retry_policy
    
    async def send(self, user: User, content: str) -> DeliveryResult:
        async def send_email():
            return await self._email_client.send(user.email, content)
        return await self._retry_policy.execute(send_email)
    
    def can_handle(self, notification_type: NotificationType) -> bool:
        return notification_type == NotificationType.EMAIL
    
    def get_priority(self) -> int:
        return 1

class PushNotificationChannel(NotificationChannel):
    def __init__(self, providers: Dict[str, 'PushProvider']):
        self._providers = providers
    
    async def send(self, user: User, content: str) -> DeliveryResult:
        tasks = []
        for device in user.devices or []:
            provider = self._providers.get(device.provider)
            if provider:
                tasks.append(provider.send(device.token, content))
        
        if not tasks:
            return DeliveryResult(success=False, message="No devices")
        
        # Wait for any success
        done, _ = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
        for task in done:
            result = task.result()
            if result.success:
                return result
        return DeliveryResult(success=False)
    
    def can_handle(self, notification_type: NotificationType) -> bool:
        return notification_type == NotificationType.PUSH
    
    def get_priority(self) -> int:
        return 2

class NotificationService:
    def __init__(self, channels: List[NotificationChannel], 
                 template_engine, rate_limiter, store, analytics):
        self._channels = channels
        self._template_engine = template_engine
        self._rate_limiter = rate_limiter
        self._store = store
        self._analytics = analytics
    
    async def send_notification(self, notification: Notification):
        if not self._rate_limiter.allow_notification(notification):
            self._handle_rate_limit_exceeded(notification)
            return
        
        content = self._template_engine.process(
            notification.template_id,
            notification.parameters
        )
        
        selected_channels = self._select_channels(notification)
        
        tasks = [channel.send(notification.user, content) 
                 for channel in selected_channels]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        await self._handle_delivery_results(notification, results)
    
    async def _handle_delivery_results(self, notification: Notification, 
                                       results: List[DeliveryResult]):
        self._analytics.track_delivery(notification)
        self._store.save_results(notification, results)
        
        failures = [r for r in results if not r.success]
        if failures:
            self._handle_failures(notification, failures)
```

**C++:**
```cpp
#include <string>
#include <vector>
#include <map>
#include <memory>
#include <future>
#include <functional>

enum class NotificationType { EMAIL, PUSH, SMS };

struct DeliveryResult {
    bool success;
    std::string message;
};

struct Device {
    std::string token;
    std::string provider;
};

struct User {
    std::string id;
    std::string email;
    std::vector<Device> devices;
};

struct Notification {
    std::string id;
    User user;
    std::string templateId;
    std::map<std::string, std::string> parameters;
    int priority;
};

class NotificationChannel {
public:
    virtual DeliveryResult send(const User& user, const std::string& content) = 0;
    virtual bool canHandle(NotificationType type) = 0;
    virtual int getPriority() = 0;
    virtual ~NotificationChannel() = default;
};

class EmailChannel : public NotificationChannel {
private:
    std::shared_ptr<EmailClient> emailClient;
    std::shared_ptr<RetryPolicy> retryPolicy;

public:
    DeliveryResult send(const User& user, const std::string& content) override {
        return retryPolicy->execute([&]() {
            return emailClient->send(user.email, content);
        });
    }
    
    bool canHandle(NotificationType type) override {
        return type == NotificationType::EMAIL;
    }
    
    int getPriority() override { return 1; }
};

class PushNotificationChannel : public NotificationChannel {
private:
    std::map<std::string, std::shared_ptr<PushProvider>> providers;

public:
    DeliveryResult send(const User& user, const std::string& content) override {
        std::vector<std::future<DeliveryResult>> futures;
        
        for (const auto& device : user.devices) {
            auto it = providers.find(device.provider);
            if (it != providers.end()) {
                futures.push_back(std::async(std::launch::async,
                    [provider = it->second, &device, &content]() {
                        return provider->send(device.token, content);
                    }));
            }
        }
        
        // Wait for any success
        for (auto& future : futures) {
            auto result = future.get();
            if (result.success) return result;
        }
        
        return {false, "All deliveries failed"};
    }
    
    bool canHandle(NotificationType type) override {
        return type == NotificationType::PUSH;
    }
    
    int getPriority() override { return 2; }
};

class NotificationService {
private:
    std::vector<std::shared_ptr<NotificationChannel>> channels;
    std::shared_ptr<TemplateEngine> templateEngine;
    std::shared_ptr<RateLimiter> rateLimiter;
    std::shared_ptr<NotificationStore> store;
    std::shared_ptr<AnalyticsTracker> analytics;

public:
    void sendNotification(const Notification& notification) {
        if (!rateLimiter->allowNotification(notification)) {
            handleRateLimitExceeded(notification);
            return;
        }
        
        std::string content = templateEngine->process(
            notification.templateId,
            notification.parameters
        );
        
        auto selectedChannels = selectChannels(notification);
        
        std::vector<std::future<DeliveryResult>> futures;
        for (auto& channel : selectedChannels) {
            futures.push_back(std::async(std::launch::async,
                [&channel, &notification, &content]() {
                    return channel->send(notification.user, content);
                }));
        }
        
        // Collect results
        std::vector<DeliveryResult> results;
        for (auto& future : futures) {
            results.push_back(future.get());
        }
        
        handleDeliveryResults(notification, results);
    }
};
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

**Java:**
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

**Python:**
```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Any, List, Optional
from abc import ABC, abstractmethod

@dataclass
class ValidationError:
    field: str
    message: str

class ValidationException(Exception):
    def __init__(self, errors: List[ValidationError]):
        self.errors = errors
        super().__init__(f"Validation failed: {len(errors)} errors")

@dataclass
class Configuration:
    properties: Dict[str, Any] = field(default_factory=dict)
    children: Dict[str, 'Configuration'] = field(default_factory=dict)
    version: str = ""
    last_modified: datetime = field(default_factory=datetime.now)
    
    def get_value(self, key: str) -> Optional[Any]:
        parts = key.split(".")
        return self._get_value(parts, 0)
    
    def _get_value(self, parts: List[str], index: int) -> Optional[Any]:
        if index == len(parts) - 1:
            return self.properties.get(parts[index])
        
        child = self.children.get(parts[index])
        return child._get_value(parts, index + 1) if child else None

class ValidationRule(ABC):
    @abstractmethod
    def validate(self, value: Any) -> List[ValidationError]:
        pass

class ConfigValidator:
    def __init__(self):
        self._rules: Dict[str, ValidationRule] = {}
    
    def validate(self, config: Configuration) -> List[ValidationError]:
        errors = []
        
        # Validate properties
        for key, value in config.properties.items():
            rule = self._rules.get(key)
            if rule:
                errors.extend(rule.validate(value))
        
        # Validate children
        for child in config.children.values():
            errors.extend(self.validate(child))
        
        return errors

class ConfigStore:
    def load(self, path: str, version: str) -> Optional[Configuration]:
        # Load from persistent storage
        pass
    
    def save(self, path: str, version: str, config: Configuration):
        # Save to persistent storage
        pass

class VersionControl:
    def create_version(self, path: str, config: Configuration) -> str:
        # Create new version in git
        import uuid
        return str(uuid.uuid4())[:8]
    
    def get_history(self, path: str) -> List['ConfigurationVersion']:
        # Get version history
        return []

class ConfigurationService:
    def __init__(self, store: ConfigStore, version_control: VersionControl,
                 validator: ConfigValidator, audit_log, cache: Dict[str, Configuration]):
        self._store = store
        self._version_control = version_control
        self._validator = validator
        self._audit_log = audit_log
        self._cache = cache
    
    def _get_cache_key(self, path: str, version: str) -> str:
        return f"{path}:{version}"
    
    def get_configuration(self, path: str, version: str) -> Optional[Configuration]:
        cache_key = self._get_cache_key(path, version)
        config = self._cache.get(cache_key)
        if config:
            return config
        
        config = self._store.load(path, version)
        if config:
            self._cache[cache_key] = config
        
        return config
    
    def update_configuration(self, path: str, new_config: Configuration, user_id: str):
        errors = self._validator.validate(new_config)
        if errors:
            raise ValidationException(errors)
        
        version = self._version_control.create_version(path, new_config)
        self._store.save(path, version, new_config)
        
        cache_key = self._get_cache_key(path, version)
        if cache_key in self._cache:
            del self._cache[cache_key]
        
        self._audit_log.log_change(path, version, user_id, new_config)
        self._notify_configuration_changed(path, version)
    
    def _notify_configuration_changed(self, path: str, version: str):
        # Notify subscribers
        pass
```

**C++:**
```cpp
#include <string>
#include <map>
#include <vector>
#include <memory>
#include <chrono>
#include <optional>
#include <stdexcept>

struct ValidationError {
    std::string field;
    std::string message;
};

class ValidationException : public std::runtime_error {
public:
    std::vector<ValidationError> errors;
    ValidationException(const std::vector<ValidationError>& errs)
        : std::runtime_error("Validation failed"), errors(errs) {}
};

class Configuration {
private:
    std::map<std::string, std::string> properties;
    std::map<std::string, std::shared_ptr<Configuration>> children;
    std::string version;
    std::chrono::system_clock::time_point lastModified;
    
    std::optional<std::string> getValue(const std::vector<std::string>& parts, size_t index) {
        if (index == parts.size() - 1) {
            auto it = properties.find(parts[index]);
            if (it != properties.end()) return it->second;
            return std::nullopt;
        }
        
        auto it = children.find(parts[index]);
        if (it != children.end()) {
            return it->second->getValue(parts, index + 1);
        }
        return std::nullopt;
    }

public:
    std::optional<std::string> getValue(const std::string& key) {
        std::vector<std::string> parts;
        // Split key by '.'
        size_t start = 0, end;
        while ((end = key.find('.', start)) != std::string::npos) {
            parts.push_back(key.substr(start, end - start));
            start = end + 1;
        }
        parts.push_back(key.substr(start));
        
        return getValue(parts, 0);
    }
    
    const std::map<std::string, std::string>& getProperties() const { return properties; }
    const std::map<std::string, std::shared_ptr<Configuration>>& getChildren() const { return children; }
};

class ValidationRule {
public:
    virtual std::vector<ValidationError> validate(const std::string& value) = 0;
    virtual ~ValidationRule() = default;
};

class ConfigValidator {
private:
    std::map<std::string, std::shared_ptr<ValidationRule>> rules;

public:
    std::vector<ValidationError> validate(const Configuration& config) {
        std::vector<ValidationError> errors;
        
        for (const auto& [key, value] : config.getProperties()) {
            auto it = rules.find(key);
            if (it != rules.end()) {
                auto ruleErrors = it->second->validate(value);
                errors.insert(errors.end(), ruleErrors.begin(), ruleErrors.end());
            }
        }
        
        for (const auto& [name, child] : config.getChildren()) {
            auto childErrors = validate(*child);
            errors.insert(errors.end(), childErrors.begin(), childErrors.end());
        }
        
        return errors;
    }
};

class ConfigStore {
public:
    virtual std::shared_ptr<Configuration> load(const std::string& path, const std::string& version) = 0;
    virtual void save(const std::string& path, const std::string& version, 
                     const Configuration& config) = 0;
    virtual ~ConfigStore() = default;
};

class VersionControl {
public:
    virtual std::string createVersion(const std::string& path, const Configuration& config) = 0;
    virtual ~VersionControl() = default;
};

class ConfigurationService {
private:
    std::shared_ptr<ConfigStore> store;
    std::shared_ptr<VersionControl> versionControl;
    std::shared_ptr<ConfigValidator> validator;
    std::map<std::string, std::shared_ptr<Configuration>> cache;
    
    std::string getCacheKey(const std::string& path, const std::string& version) {
        return path + ":" + version;
    }

public:
    std::shared_ptr<Configuration> getConfiguration(const std::string& path, 
                                                     const std::string& version) {
        std::string cacheKey = getCacheKey(path, version);
        auto it = cache.find(cacheKey);
        if (it != cache.end()) {
            return it->second;
        }
        
        auto config = store->load(path, version);
        if (config) {
            cache[cacheKey] = config;
        }
        
        return config;
    }
    
    void updateConfiguration(const std::string& path, 
                            const Configuration& newConfig,
                            const std::string& userId) {
        auto errors = validator->validate(newConfig);
        if (!errors.empty()) {
            throw ValidationException(errors);
        }
        
        std::string version = versionControl->createVersion(path, newConfig);
        store->save(path, version, newConfig);
        
        std::string cacheKey = getCacheKey(path, version);
        cache.erase(cacheKey);
        
        // Log audit entry and notify subscribers
    }
};
```

### Key Points
- Hierarchical configuration management
- Version control integration
- Caching strategy
- Validation framework
- Audit logging
- Change notification

## ❓ Frequently Asked Questions

### Q1: How do I approach distributed system problems in LLD?
**A:** Start with:
1. **Single node design first** - Get the core logic right
2. **Identify distribution challenges** - What needs coordination?
3. **Choose coordination mechanism** - ZooKeeper, consensus, etc.
4. **Handle failures** - Node crashes, network partitions
5. **Design for consistency** - Strong vs eventual

### Q2: What's the difference between hard LLD and system design?
**A:**
| Hard LLD | System Design |
|----------|---------------|
| Write detailed classes | Draw component diagrams |
| Show implementation | Show architecture |
| Focus on code structure | Focus on data flow |
| Handle distributed concerns in code | Discuss trade-offs conceptually |

### Q3: How do I handle leader election in code?
**A:** Common approaches:
- **ZooKeeper:** Ephemeral sequential nodes
- **Raft/Paxos:** Consensus algorithms
- **Database-based:** Row locking
- **Redis:** SETNX with TTL
- Focus on: Leader detection, failover, split-brain prevention

### Q4: How detailed should distributed coordination be?
**A:** Balance between:
- Show you understand the concepts
- Don't implement full consensus from scratch
- Use abstractions (e.g., ZooKeeper client)
- Explain what happens under the hood
- Focus on failure handling

### Q5: How do I handle consistency in distributed caches?
**A:** Options:
| Approach | Consistency | Performance |
|----------|-------------|-------------|
| Write-through | Strong | Lower |
| Write-behind | Eventual | Higher |
| Invalidation | Variable | Medium |
| TTL-based | Eventual | Highest |

Discuss CAP theorem trade-offs.

### Q6: What failure scenarios should I consider?
**A:** Key failures:
- **Node failures:** Crash, restart, slow
- **Network failures:** Partition, latency, packet loss
- **Data failures:** Corruption, inconsistency
- **Cascading failures:** One failure causes more
- Design for: Detection, recovery, prevention

### Q7: How do I show I understand distributed systems without over-engineering?
**A:**
- Mention specific technologies (ZooKeeper, Kafka)
- Explain why you chose them
- Show awareness of failure modes
- Discuss monitoring/observability
- Keep code focused on core logic
- Abstract complex distributed primitives

### Q8: What patterns are essential for hard problems?
**A:**
| Pattern | Use Case |
|---------|----------|
| Leader Election | Coordination |
| Consistent Hashing | Data distribution |
| Circuit Breaker | Fault tolerance |
| Saga | Distributed transactions |
| Event Sourcing | Audit, replay |
| CQRS | Read/write separation |

## Additional Resources
- [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [Distributed Systems for Fun and Profit](http://book.mixu.net/distsys/single-page.html)
- [Designing Data-Intensive Applications](https://dataintensive.net/) 