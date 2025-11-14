export const dbUnits = [
  {
    id: "relational-concepts",
    title: "Relational Database Concepts",
    description: "Foundation concepts of relational databases, ACID properties, and basic principles",
    icon: "🏗️",
    color: "from-blue-500 to-blue-600",
    difficulty: "Beginner",
    topics: [
      "Database fundamentals", "Relational model", "ACID properties", "Database terminology"
    ]
  },
  {
    id: "er-modeling",
    title: "Entity-Relationship Modeling",
    description: "Creating and interpreting ER diagrams, entities, attributes, and relationships",
    icon: "🔗",
    color: "from-green-500 to-green-600",
    difficulty: "Beginner",
    topics: [
      "ER diagrams", "Entity sets", "Attributes", "Relationships", "Cardinality"
    ]
  },
  {
    id: "database-design",
    title: "Database Design and Normalization",
    description: "Normalization forms, schema design, and eliminating redundancy",
    icon: "📐",
    color: "from-purple-500 to-purple-600",
    difficulty: "Intermediate",
    topics: [
      "Normal forms", "Functional dependencies", "Schema design", "Denormalization"
    ]
  },
  {
    id: "sql-basics",
    title: "Structured Query Language (SQL)",
    description: "Basic SQL queries, DML, DDL, and fundamental database operations",
    icon: "💾",
    color: "from-indigo-500 to-indigo-600",
    difficulty: "Beginner",
    topics: [
      "SELECT queries", "INSERT, UPDATE, DELETE", "DDL commands", "Basic joins"
    ]
  },
  {
    id: "advanced-sql",
    title: "Advanced SQL and Programming",
    description: "Complex queries, stored procedures, triggers, and advanced SQL features",
    icon: "⚡",
    color: "from-yellow-500 to-orange-500",
    difficulty: "Advanced",
    topics: [
      "Complex joins", "Subqueries", "Stored procedures", "Triggers", "Functions"
    ]
  },
  {
    id: "transactions",
    title: "Transaction Management",
    description: "Concurrency control, locking mechanisms, and transaction isolation",
    icon: "🔄",
    color: "from-red-500 to-red-600",
    difficulty: "Intermediate",
    topics: [
      "ACID properties", "Concurrency control", "Locking", "Isolation levels"
    ]
  },
  {
    id: "security-admin",
    title: "Database Security and Administration",
    description: "User management, permissions, backup strategies, and security best practices",
    icon: "🔐",
    color: "from-gray-600 to-gray-700",
    difficulty: "Intermediate",
    topics: [
      "User management", "Permissions", "Backup and recovery", "Security policies"
    ]
  },
  {
    id: "nosql",
    title: "NoSQL Databases",
    description: "Document, key-value, column-family, and graph databases",
    icon: "📊",
    color: "from-teal-500 to-teal-600",
    difficulty: "Intermediate",
    topics: [
      "Document databases", "Key-value stores", "Column-family", "Graph databases"
    ]
  },
  {
    id: "data-warehousing",
    title: "Data Warehousing and Business Intelligence",
    description: "OLAP, data modeling for analytics, ETL processes, and reporting",
    icon: "📈",
    color: "from-pink-500 to-pink-600",
    difficulty: "Advanced",
    topics: [
      "OLAP vs OLTP", "Star schema", "ETL processes", "Data marts"
    ]
  },
  {
    id: "big-data",
    title: "Big Data and Distributed Databases",
    description: "Distributed systems, sharding, replication, and big data technologies",
    icon: "🌐",
    color: "from-cyan-500 to-cyan-600",
    difficulty: "Advanced",
    topics: [
      "Distributed systems", "Sharding", "Replication", "CAP theorem"
    ]
  },
  {
    id: "performance-tuning",
    title: "Database Performance Tuning",
    description: "Query optimization, indexing strategies, and performance monitoring",
    icon: "🚀",
    color: "from-emerald-500 to-emerald-600",
    difficulty: "Advanced",
    topics: [
      "Query optimization", "Indexing", "Performance monitoring", "Query plans"
    ]
  },
  {
    id: "emerging-tech",
    title: "Emerging Database Technologies",
    description: "Cloud databases, NewSQL, and modern database trends",
    icon: "🔮",
    color: "from-violet-500 to-violet-600",
    difficulty: "Advanced",
    topics: [
      "Cloud databases", "NewSQL", "In-memory databases", "Blockchain databases"
    ]
  },
  {
    id: "project-development",
    title: "Database Project Development",
    description: "Project lifecycle, requirements analysis, and implementation strategies",
    icon: "🛠️",
    color: "from-amber-500 to-amber-600",
    difficulty: "Intermediate",
    topics: [
      "Requirements analysis", "Design methodology", "Implementation", "Testing"
    ]
  }
];

export const getUnitById = (id) => {
  return dbUnits.find(unit => unit.id === id);
};

export const getUnitsByDifficulty = (difficulty) => {
  return dbUnits.filter(unit => unit.difficulty.toLowerCase() === difficulty.toLowerCase());
};