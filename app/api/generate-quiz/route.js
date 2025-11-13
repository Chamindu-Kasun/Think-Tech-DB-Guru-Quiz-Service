// app/api/generate-quiz/route.js
import { NextResponse } from 'next/server';
import { saveQuizQuestions, getQuizQuestions } from '@/lib/firebase/quizService.js';

// --- Fallback Questions (Comprehensive Database-Guru default set) ---
const fallbackQuestions = [
  // Unit 1: Introduction to Databases
  {
    id: 'db1',
    category: 'Database Fundamentals',
    question: 'What is the main advantage of using a Database Management System over a file system?',
    options: [
      { id: 'a', text: 'Lower storage costs' },
      { id: 'b', text: 'Data redundancy and inconsistency control' },
      { id: 'c', text: 'Faster file access' },
      { id: 'd', text: 'Simpler programming interface' }
    ],
    correctAnswer: 'b',
    explanation: 'DBMS provides better control over data redundancy and maintains data consistency across the system.'
  },
  {
    id: 'db2',
    category: 'Database System Architecture',
    question: 'In the three-level database architecture, which level describes the logical structure of the database?',
    options: [
      { id: 'a', text: 'External level' },
      { id: 'b', text: 'Conceptual level' },
      { id: 'c', text: 'Internal level' },
      { id: 'd', text: 'Physical level' }
    ],
    correctAnswer: 'b',
    explanation: 'The conceptual level describes the logical structure of the entire database for the community of users.'
  },

  // Unit 2: Relational Database Concepts
  {
    id: 'db3',
    category: 'Keys and Constraints',
    question: 'Which type of key can have NULL values?',
    options: [
      { id: 'a', text: 'Primary Key' },
      { id: 'b', text: 'Foreign Key' },
      { id: 'c', text: 'Super Key' },
      { id: 'd', text: 'Candidate Key' }
    ],
    correctAnswer: 'b',
    explanation: 'Foreign keys can have NULL values, indicating that the relationship may not exist for some tuples.'
  },
  {
    id: 'db4',
    category: 'Relational Algebra',
    question: 'Which relational algebra operation is used to combine two relations with the same schema?',
    options: [
      { id: 'a', text: 'Join' },
      { id: 'b', text: 'Project' },
      { id: 'c', text: 'Union' },
      { id: 'd', text: 'Select' }
    ],
    correctAnswer: 'c',
    explanation: 'Union operation combines tuples from two relations that have the same attributes (schema).'
  },

  // Unit 3: Entity-Relationship Modeling
  {
    id: 'db5',
    category: 'ER Model Components',
    question: 'In an ER diagram, what does a diamond shape represent?',
    options: [
      { id: 'a', text: 'Entity' },
      { id: 'b', text: 'Attribute' },
      { id: 'c', text: 'Relationship' },
      { id: 'd', text: 'Primary key' }
    ],
    correctAnswer: 'c',
    explanation: 'A diamond shape in an ER diagram represents a relationship between entities.'
  },
  {
    id: 'db6',
    category: 'Relationship Types and Cardinality',
    question: 'In a one-to-many relationship, where is the foreign key typically placed?',
    options: [
      { id: 'a', text: 'In the "one" side entity' },
      { id: 'b', text: 'In the "many" side entity' },
      { id: 'c', text: 'In a separate relationship table' },
      { id: 'd', text: 'In both entities' }
    ],
    correctAnswer: 'b',
    explanation: 'In a one-to-many relationship, the foreign key is placed in the entity on the "many" side.'
  },

  // Unit 4: Database Design and Normalization
  {
    id: 'db7',
    category: 'Normalization (1NF, 2NF, 3NF, BCNF)',
    question: 'Which normal form eliminates partial dependency?',
    options: [
      { id: 'a', text: 'First Normal Form (1NF)' },
      { id: 'b', text: 'Second Normal Form (2NF)' },
      { id: 'c', text: 'Third Normal Form (3NF)' },
      { id: 'd', text: 'Boyce-Codd Normal Form (BCNF)' }
    ],
    correctAnswer: 'b',
    explanation: '2NF removes partial dependency, ensuring every non-key attribute depends fully on the primary key.'
  },
  {
    id: 'db8',
    category: 'Functional Dependencies',
    question: 'In functional dependency A → B, what does this notation mean?',
    options: [
      { id: 'a', text: 'A is greater than B' },
      { id: 'b', text: 'A functionally determines B' },
      { id: 'c', text: 'A joins with B' },
      { id: 'd', text: 'A is a subset of B' }
    ],
    correctAnswer: 'b',
    explanation: 'A → B means attribute A functionally determines attribute B.'
  },

  // Unit 5: Structured Query Language (SQL)
  {
    id: 'db9',
    category: 'SQL Fundamentals',
    question: 'Which SQL statement is used to extract data from a database?',
    options: [
      { id: 'a', text: 'GET' },
      { id: 'b', text: 'EXTRACT' },
      { id: 'c', text: 'SELECT' },
      { id: 'd', text: 'SHOW' }
    ],
    correctAnswer: 'c',
    explanation: 'The SELECT statement retrieves data from a database table.'
  },
  {
    id: 'db10',
    category: 'SQL Joins and Set Operations',
    question: 'Which SQL keyword is used to remove duplicate rows from the result set?',
    options: [
      { id: 'a', text: 'REMOVE' },
      { id: 'b', text: 'DELETE' },
      { id: 'c', text: 'DISTINCT' },
      { id: 'd', text: 'UNIQUE' }
    ],
    correctAnswer: 'c',
    explanation: 'DISTINCT eliminates duplicate rows from the query result set.'
  },
  {
    id: 'db11',
    category: 'Data Manipulation Language (DML)',
    question: 'Which SQL clause is used to filter records?',
    options: [
      { id: 'a', text: 'FILTER' },
      { id: 'b', text: 'WHERE' },
      { id: 'c', text: 'HAVING' },
      { id: 'd', text: 'CONDITION' }
    ],
    correctAnswer: 'b',
    explanation: 'The WHERE clause is used to filter records that meet certain conditions.'
  },

  // Unit 6: Advanced SQL and Programming
  {
    id: 'db12',
    category: 'Stored Procedures and Functions',
    question: 'What is the main difference between a stored procedure and a function?',
    options: [
      { id: 'a', text: 'Procedures are faster than functions' },
      { id: 'b', text: 'Functions must return a value, procedures may not' },
      { id: 'c', text: 'Procedures can have parameters, functions cannot' },
      { id: 'd', text: 'Functions are compiled, procedures are interpreted' }
    ],
    correctAnswer: 'b',
    explanation: 'Functions must return a value, while procedures may or may not return a value.'
  },
  {
    id: 'db13',
    category: 'Triggers and Cursors',
    question: 'When does a BEFORE trigger execute?',
    options: [
      { id: 'a', text: 'After the triggering event' },
      { id: 'b', text: 'Before the triggering event' },
      { id: 'c', text: 'During the triggering event' },
      { id: 'd', text: 'Only on weekends' }
    ],
    correctAnswer: 'b',
    explanation: 'A BEFORE trigger executes before the triggering event (INSERT, UPDATE, DELETE) occurs.'
  },

  // Unit 7: Transaction Management
  {
    id: 'db14',
    category: 'ACID Properties',
    question: 'What does ACID stand for in database transactions?',
    options: [
      { id: 'a', text: 'Atomicity, Consistency, Isolation, Durability' },
      { id: 'b', text: 'Access, Control, Integration, Data' },
      { id: 'c', text: 'Automated, Controlled, Independent, Distributed' },
      { id: 'd', text: 'Abstract, Concrete, Independent, Dynamic' }
    ],
    correctAnswer: 'a',
    explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability - the four key properties of database transactions.'
  },
  {
    id: 'db15',
    category: 'Concurrency Control',
    question: 'What problem occurs when a transaction reads data that has been modified by another uncommitted transaction?',
    options: [
      { id: 'a', text: 'Lost update' },
      { id: 'b', text: 'Dirty read' },
      { id: 'c', text: 'Phantom read' },
      { id: 'd', text: 'Deadlock' }
    ],
    correctAnswer: 'b',
    explanation: 'A dirty read occurs when a transaction reads uncommitted data from another transaction.'
  },

  // Unit 8: Database Security and Administration
  {
    id: 'db16',
    category: 'Database Security',
    question: 'Which access control model allows the owner of data to determine access privileges?',
    options: [
      { id: 'a', text: 'Mandatory Access Control (MAC)' },
      { id: 'b', text: 'Discretionary Access Control (DAC)' },
      { id: 'c', text: 'Role-Based Access Control (RBAC)' },
      { id: 'd', text: 'Attribute-Based Access Control (ABAC)' }
    ],
    correctAnswer: 'b',
    explanation: 'Discretionary Access Control allows the owner of data to determine who can access it.'
  },
  {
    id: 'db17',
    category: 'Backup and Recovery',
    question: 'What is the purpose of a database checkpoint?',
    options: [
      { id: 'a', text: 'To create a backup copy' },
      { id: 'b', text: 'To force all dirty pages to be written to disk' },
      { id: 'c', text: 'To validate data integrity' },
      { id: 'd', text: 'To compress database files' }
    ],
    correctAnswer: 'b',
    explanation: 'A checkpoint forces all modified (dirty) pages from memory to be written to disk storage.'
  },

  // Unit 9: NoSQL Databases
  {
    id: 'db18',
    category: 'NoSQL Fundamentals',
    question: 'Which of the following is a characteristic of NoSQL databases?',
    options: [
      { id: 'a', text: 'Strict ACID compliance' },
      { id: 'b', text: 'Fixed schema requirements' },
      { id: 'c', text: 'Horizontal scalability' },
      { id: 'd', text: 'SQL-only query language' }
    ],
    correctAnswer: 'c',
    explanation: 'NoSQL databases are designed for horizontal scalability, allowing them to distribute data across multiple servers easily.'
  },
  {
    id: 'db19',
    category: 'CAP Theorem and BASE Properties',
    question: 'According to the CAP theorem, which three properties cannot all be guaranteed simultaneously?',
    options: [
      { id: 'a', text: 'Consistency, Availability, Partition tolerance' },
      { id: 'b', text: 'Confidentiality, Authenticity, Privacy' },
      { id: 'c', text: 'Create, Alter, Partition' },
      { id: 'd', text: 'Commit, Abort, Proceed' }
    ],
    correctAnswer: 'a',
    explanation: 'CAP theorem states that a distributed system cannot simultaneously guarantee Consistency, Availability, and Partition tolerance.'
  },

  // Unit 10: Database Programming and Connectivity
  {
    id: 'db20',
    category: 'Database Connectivity (JDBC, ODBC)',
    question: 'What does JDBC stand for?',
    options: [
      { id: 'a', text: 'Java Database Connectivity' },
      { id: 'b', text: 'JavaScript Database Connection' },
      { id: 'c', text: 'Java Data Broadcasting Component' },
      { id: 'd', text: 'Joint Database Communication' }
    ],
    correctAnswer: 'a',
    explanation: 'JDBC stands for Java Database Connectivity, an API for connecting Java applications to databases.'
  },

  // Unit 11: Data Warehousing and Business Intelligence
  {
    id: 'db21',
    category: 'Data Warehousing',
    question: 'What does ETL stand for in data warehousing?',
    options: [
      { id: 'a', text: 'Extract, Transform, Load' },
      { id: 'b', text: 'Execute, Test, Launch' },
      { id: 'c', text: 'Evaluate, Track, Learn' },
      { id: 'd', text: 'Enter, Transfer, Link' }
    ],
    correctAnswer: 'a',
    explanation: 'ETL stands for Extract, Transform, and Load - the process of moving data into a data warehouse.'
  },
  {
    id: 'db22',
    category: 'OLAP vs OLTP',
    question: 'What is the primary purpose of OLTP systems?',
    options: [
      { id: 'a', text: 'Data analysis and reporting' },
      { id: 'b', text: 'Transaction processing' },
      { id: 'c', text: 'Data warehousing' },
      { id: 'd', text: 'Business intelligence' }
    ],
    correctAnswer: 'b',
    explanation: 'OLTP (Online Transaction Processing) systems are designed for handling day-to-day transaction processing.'
  },

  // Unit 12: Big Data and Distributed Databases
  {
    id: 'db23',
    category: 'Big Data Concepts',
    question: 'Which of the following is NOT one of the traditional "3 Vs" of Big Data?',
    options: [
      { id: 'a', text: 'Volume' },
      { id: 'b', text: 'Velocity' },
      { id: 'c', text: 'Variety' },
      { id: 'd', text: 'Visibility' }
    ],
    correctAnswer: 'd',
    explanation: 'The traditional 3 Vs of Big Data are Volume, Velocity, and Variety. Visibility is not one of them.'
  },
  {
    id: 'db24',
    category: 'Distributed Database Architecture',
    question: 'What is database sharding?',
    options: [
      { id: 'a', text: 'Creating backup copies' },
      { id: 'b', text: 'Partitioning data across multiple databases' },
      { id: 'c', text: 'Compressing database files' },
      { id: 'd', text: 'Encrypting sensitive data' }
    ],
    correctAnswer: 'b',
    explanation: 'Sharding is a method of partitioning data across multiple database instances to improve performance and scalability.'
  },

  // Unit 13: Database Performance Tuning
  {
    id: 'db25',
    category: 'Indexing Strategies',
    question: 'What is the primary purpose of database indexing?',
    options: [
      { id: 'a', text: 'To reduce storage space' },
      { id: 'b', text: 'To improve query performance' },
      { id: 'c', text: 'To ensure data integrity' },
      { id: 'd', text: 'To backup data automatically' }
    ],
    correctAnswer: 'b',
    explanation: 'Database indexing is primarily used to improve query performance by creating faster access paths to data.'
  },
  {
    id: 'db26',
    category: 'Query Optimization Techniques',
    question: 'What is the purpose of a query execution plan?',
    options: [
      { id: 'a', text: 'To schedule database maintenance' },
      { id: 'b', text: 'To show how the database will execute a query' },
      { id: 'c', text: 'To backup query results' },
      { id: 'd', text: 'To validate query syntax' }
    ],
    correctAnswer: 'b',
    explanation: 'A query execution plan shows the steps and methods the database engine will use to execute a query.'
  },

  // Unit 14: Emerging Database Technologies
  {
    id: 'db27',
    category: 'In-Memory Databases',
    question: 'What is the main advantage of in-memory databases?',
    options: [
      { id: 'a', text: 'Lower cost' },
      { id: 'b', text: 'Better security' },
      { id: 'c', text: 'Faster data access' },
      { id: 'd', text: 'Larger storage capacity' }
    ],
    correctAnswer: 'c',
    explanation: 'In-memory databases store data in RAM, providing much faster data access compared to disk-based storage.'
  },
  {
    id: 'db28',
    category: 'Time-Series Databases',
    question: 'Time-series databases are optimized for which type of data?',
    options: [
      { id: 'a', text: 'Customer information' },
      { id: 'b', text: 'Time-stamped data points' },
      { id: 'c', text: 'Geographic coordinates' },
      { id: 'd', text: 'Document content' }
    ],
    correctAnswer: 'b',
    explanation: 'Time-series databases are designed to efficiently handle time-stamped data points, like sensor data or stock prices.'
  },

  // Unit 15: Database Project Development
  {
    id: 'db29',
    category: 'Requirements Analysis',
    question: 'What is the first step in database design?',
    options: [
      { id: 'a', text: 'Creating tables' },
      { id: 'b', text: 'Writing SQL queries' },
      { id: 'c', text: 'Requirements analysis' },
      { id: 'd', text: 'Performance tuning' }
    ],
    correctAnswer: 'c',
    explanation: 'Requirements analysis is the first step to understand what data needs to be stored and how it will be used.'
  },
  {
    id: 'db30',
    category: 'Performance Benchmarking',
    question: 'What is the purpose of database performance benchmarking?',
    options: [
      { id: 'a', text: 'To create user documentation' },
      { id: 'b', text: 'To measure and compare system performance' },
      { id: 'c', text: 'To design the user interface' },
      { id: 'd', text: 'To train database administrators' }
    ],
    correctAnswer: 'b',
    explanation: 'Performance benchmarking measures system performance metrics to evaluate and compare database systems.'
  },
  {
    id: 'db31',
    category: 'Database Languages (DDL, DML, DCL, TCL)',
    question: 'Which category does the GRANT statement belong to?',
    options: [
      { id: 'a', text: 'Data Definition Language (DDL)' },
      { id: 'b', text: 'Data Manipulation Language (DML)' },
      { id: 'c', text: 'Data Control Language (DCL)' },
      { id: 'd', text: 'Transaction Control Language (TCL)' }
    ],
    correctAnswer: 'c',
    explanation: 'GRANT is a Data Control Language (DCL) statement used to give privileges to users.'
  },
  {
    id: 'db32',
    category: 'Data Models',
    question: 'Which data model organizes data in a tree-like structure?',
    options: [
      { id: 'a', text: 'Relational Model' },
      { id: 'b', text: 'Hierarchical Model' },
      { id: 'c', text: 'Network Model' },
      { id: 'd', text: 'Object-Oriented Model' }
    ],
    correctAnswer: 'b',
    explanation: 'The Hierarchical Model organizes data in a tree-like structure with parent-child relationships.'
  },
  {
    id: 'db33',
    category: 'Database Views',
    question: 'What is a database view?',
    options: [
      { id: 'a', text: 'A physical table stored on disk' },
      { id: 'b', text: 'A virtual table based on a query result' },
      { id: 'c', text: 'An index on a table' },
      { id: 'd', text: 'A backup of table data' }
    ],
    correctAnswer: 'b',
    explanation: 'A view is a virtual table that is defined by a query and does not physically store data.'
  },
  {
    id: 'db34',
    category: 'Attribute Types',
    question: 'What is a composite attribute?',
    options: [
      { id: 'a', text: 'An attribute that can have multiple values' },
      { id: 'b', text: 'An attribute composed of multiple sub-attributes' },
      { id: 'c', text: 'An attribute derived from other attributes' },
      { id: 'd', text: 'An attribute that cannot be null' }
    ],
    correctAnswer: 'b',
    explanation: 'A composite attribute is made up of multiple sub-attributes, like an address with street, city, and zip code.'
  },
  {
    id: 'db35',
    category: 'Enhanced ER Modeling',
    question: 'What is specialization in Enhanced ER modeling?',
    options: [
      { id: 'a', text: 'Combining entities into a single entity' },
      { id: 'b', text: 'Creating subgroups within an entity set' },
      { id: 'c', text: 'Linking entities with relationships' },
      { id: 'd', text: 'Normalizing entity attributes' }
    ],
    correctAnswer: 'b',
    explanation: 'Specialization is the process of defining subgroups within an entity set based on distinguishing characteristics.'
  },
  {
    id: 'db36',
    category: 'Advanced Normal Forms (4NF, 5NF)',
    question: 'What does Fourth Normal Form (4NF) eliminate?',
    options: [
      { id: 'a', text: 'Partial dependencies' },
      { id: 'b', text: 'Transitive dependencies' },
      { id: 'c', text: 'Multi-valued dependencies' },
      { id: 'd', text: 'Join dependencies' }
    ],
    correctAnswer: 'c',
    explanation: '4NF eliminates multi-valued dependencies while preserving all functional dependencies.'
  },
  {
    id: 'db37',
    category: 'Data Definition Language (DDL)',
    question: 'Which DDL statement is used to remove a table structure completely?',
    options: [
      { id: 'a', text: 'DELETE' },
      { id: 'b', text: 'TRUNCATE' },
      { id: 'c', text: 'DROP' },
      { id: 'd', text: 'REMOVE' }
    ],
    correctAnswer: 'c',
    explanation: 'DROP statement removes the table structure and all its data permanently from the database.'
  },
  {
    id: 'db38',
    category: 'Lock-based Protocols',
    question: 'What is the main principle of Two-Phase Locking (2PL)?',
    options: [
      { id: 'a', text: 'Locks must be acquired before data access' },
      { id: 'b', text: 'All locks must be acquired before any lock is released' },
      { id: 'c', text: 'Locks can be acquired and released at any time' },
      { id: 'd', text: 'Only shared locks are allowed' }
    ],
    correctAnswer: 'b',
    explanation: 'In 2PL, a transaction must acquire all needed locks before releasing any lock, ensuring serializability.'
  },
  {
    id: 'db39',
    category: 'Document Databases',
    question: 'Which of the following is a popular document database?',
    options: [
      { id: 'a', text: 'MySQL' },
      { id: 'b', text: 'MongoDB' },
      { id: 'c', text: 'Oracle' },
      { id: 'd', text: 'PostgreSQL' }
    ],
    correctAnswer: 'b',
    explanation: 'MongoDB is a popular NoSQL document database that stores data in flexible, JSON-like documents.'
  },
  {
    id: 'db40',
    category: 'Dimensional Modeling',
    question: 'In dimensional modeling, what is a fact table?',
    options: [
      { id: 'a', text: 'A table containing descriptive attributes' },
      { id: 'b', text: 'A table containing measurable business metrics' },
      { id: 'c', text: 'A table for storing lookup values' },
      { id: 'd', text: 'A table for user authentication' }
    ],
    correctAnswer: 'b',
    explanation: 'A fact table contains measurable business metrics (facts) like sales amounts, quantities, etc.'
  }
];

// --- Helper to safely extract JSON from model text output ---
function extractQuestionsFromText(text) {
  if (!text || typeof text !== 'string') return null;
  const cleaned = text.replace(/```json|```/gi, '').trim();
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return null;
}

// --- Supported Database Topics (Based on Comprehensive Database Curriculum) ---
const dbTopics = [
  // Unit 1: Introduction to Databases
  "Database Fundamentals",
  "File Systems vs DBMS",
  "Database System Architecture",
  "Data Models",
  "Database Languages (DDL, DML, DCL, TCL)",
  
  // Unit 2: Relational Database Concepts
  "Relational Model",
  "Keys and Constraints",
  "Relational Algebra",
  "Relational Calculus",
  "Database Views",
  
  // Unit 3: Entity-Relationship Modeling
  "ER Model Components",
  "Attribute Types",
  "Relationship Types and Cardinality",
  "Enhanced ER Modeling",
  "ER Diagram Design",
  
  // Unit 4: Database Design and Normalization
  "Database Design Process",
  "Functional Dependencies",
  "Normalization (1NF, 2NF, 3NF, BCNF)",
//   "Advanced Normal Forms (4NF, 5NF)",
  "Denormalization Strategies",
  
  // Unit 5: Structured Query Language (SQL)
  "SQL Fundamentals",
  "Data Definition Language (DDL)",
  "Data Manipulation Language (DML)",
  "SQL Joins and Set Operations",
  "Aggregate Functions and Subqueries",
  "Indexes and Views",
  
  // Unit 6: Advanced SQL and Programming
//   "Stored Procedures and Functions",
//   "Triggers and Cursors",
//   "Dynamic SQL",
//   "Query Optimization",
  
  // Unit 7: Transaction Management
  "ACID Properties",
  "Concurrency Control",
//   "Lock-based Protocols",
//   "Deadlock Handling",
//   "Recovery Techniques",
  
  // Unit 8: Database Security and Administration
//   "Database Security",
//   "Authentication and Authorization",
//   "Access Control",
//   "Backup and Recovery",
//   "Database Administration",
  
  // Unit 9: NoSQL Databases
//   "NoSQL Fundamentals",
//   "CAP Theorem and BASE Properties",
//   "Document Databases",
//   "Key-Value Stores",
//   "Graph Databases",
//   "NoSQL Data Modeling",
  
  // Unit 10: Database Programming and Connectivity
//   "Database Connectivity (JDBC, ODBC)",
//   "ORM Frameworks",
//   "Database API Integration",
//   "Web Application Database Integration",
  
  // Unit 11: Data Warehousing and Business Intelligence
//   "Data Warehousing",
//   "ETL Processes",
//   "Dimensional Modeling",
//   "OLAP vs OLTP",
//   "Data Mining and Business Intelligence",
  
  // Unit 12: Big Data and Distributed Databases
//   "Big Data Concepts",
//   "Distributed Database Architecture",
//   "Hadoop and Spark",
  "Cloud Database Services",
//   "Database-as-a-Service",
  
  // Unit 13: Database Performance Tuning
  "Query Optimization Techniques",
  "Indexing Strategies",
  "Database Partitioning",
//   "Performance Monitoring",
  
  // Unit 14: Emerging Database Technologies
//   "In-Memory Databases",
//   "NewSQL Databases",
//   "Blockchain Databases",
//   "Time-Series Databases",
//   "Machine Learning Integration",
  
  // Unit 15: Database Project Development
//   "Requirements Analysis",
//   "Database Implementation",
//   "Testing and Deployment",
//   "Performance Benchmarking"
];

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-v3.1:671b-cloud';

// Helper function to call Ollama API
async function callOllama(prompt) {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.response;
}

export async function POST(request) {
  let count = 40; 
  
  try {
    const requestData = await request.json();
    const { topics = dbTopics, difficulty = ['beginner', 'intermediate', 'advanced'], language = 'english' } = requestData;
    count = requestData.count || 40; // Update count with request value

    // Check if Ollama is available, otherwise try Firebase, then fallback questions
    try {
      const healthCheck = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
      if (!healthCheck.ok) {
        throw new Error('Ollama not responding');
      }
    } catch (error) {
      console.warn('Ollama not available, trying Firebase questions');
      
      // Try to get questions from Firebase
      const firebaseQuestions = await getQuizQuestions(count, { language });

      if (firebaseQuestions.length > 0) {
        console.log(`Retrieved ${firebaseQuestions.length} questions from Firebase`);
        return NextResponse.json({
          quiz: firebaseQuestions,
          source: 'firebase',
          warning: 'Using saved questions from Firebase - Ollama server not available'
        });
      }

      // If no Firebase questions available, use hardcoded fallback
      return NextResponse.json({
        quiz: fallbackQuestions.slice(0, Math.min(count, fallbackQuestions.length)),
        source: 'fallback',
        warning: 'Using hardcoded fallback questions - Ollama and Firebase unavailable'
      });
    }

    const difficultyStr = Array.isArray(difficulty) ? difficulty.join(', ') : difficulty;

    // --- Database-Guru-specific Prompt ---
    const prompt = `You are an expert database instructor creating multiple-choice questions (MCQs) for students learning database systems.

Generate ${count} high-quality, conceptually correct, and exam-standard MCQs in ${language}.
Questions must follow a professional style like university-level or certification-style (e.g., Oracle, DBMS courses).

Each question must:
1. Be relevant to database systems and their practical applications.
2. Have exactly four options labeled "a", "b", "c", "d".
3. Contain exactly one correct answer.
4. Include a short, accurate explanation.
5. Cover different ${difficultyStr}-level concepts.
6. Use clear and precise database terminology.

### Topics to Cover:
${Array.isArray(topics) ? topics.join(', ') : topics}

### Expected JSON Output Format:
[
  {
    "id": "q1",
    "category": "SQL | Normalization | ER Modeling | etc.",
    "question": "string",
    "options": [
      { "id": "a", "text": "string" },
      { "id": "b", "text": "string" },
      { "id": "c", "text": "string" },
      { "id": "d", "text": "string" }
    ],
    "correctAnswer": "a" | "b" | "c" | "d",
    "explanation": "string"
  }
]

IMPORTANT: Only return the JSON array. Do not include any markdown formatting, commentary, or explanations outside the JSON.

Example:
[
  {
    "id": "q_sample_1",
    "category": "SQL",
    "question": "Which SQL keyword is used to remove duplicate rows from the result set?",
    "options": [
      { "id": "a", "text": "REMOVE" },
      { "id": "b", "text": "DELETE" },
      { "id": "c", "text": "DISTINCT" },
      { "id": "d", "text": "UNIQUE" }
    ],
    "correctAnswer": "c",
    "explanation": "DISTINCT eliminates duplicate rows from the query result set."
  }
]`;

    const text = await callOllama(prompt);
    const cleanText = text.replace(/```json|```/gi, '').trim();

    let questions = null;
    try {
      const parsed = JSON.parse(cleanText);
      if (Array.isArray(parsed)) questions = parsed;
      else if (parsed?.quiz && Array.isArray(parsed.quiz)) questions = parsed.quiz;
    } catch {
      questions = extractQuestionsFromText(cleanText);
    }

    if (!Array.isArray(questions)) {
      // Try Firebase fallback if Ollama parsing fails
      const firebaseQuestions = await getQuizQuestions(count, { language });

      if (firebaseQuestions.length > 0) {
        return NextResponse.json({
          quiz: firebaseQuestions,
          source: 'firebase',
          warning: 'Used Firebase questions due to Ollama parse failure'
        });
      }

      return NextResponse.json({
        quiz: fallbackQuestions.slice(0, count),
        source: 'fallback',
        warning: 'Used hardcoded fallback due to parse failure',
        raw: cleanText
      });
    }

    // Save successful Ollama questions to Firebase (async, don't wait)
    const metadata = {
      topics,
      difficulty,
      language,
      source: 'ollama',
      model: OLLAMA_MODEL
    };
    
    saveQuizQuestions(questions, metadata).then((success) => {
      if (success) {
        console.log('Successfully saved questions to Firebase');
      } else {
        console.warn('Failed to save questions to Firebase');
      }
    }).catch((error) => {
      console.error('Error saving to Firebase:', error);
    });

    return NextResponse.json({ 
      quiz: questions,
      source: 'ollama'
    });

  } catch (error) {
    console.error('Ollama API Error:', error);
    const msg = error?.message ?? String(error);

    // Try Firebase as fallback before using hardcoded questions
    try {
      const requestData = await request.json();
      const { language = 'english' } = requestData;
      
      const firebaseQuestions = await getQuizQuestions(count, { language });

      if (firebaseQuestions.length > 0) {
        return NextResponse.json({
          quiz: firebaseQuestions,
          source: 'firebase',
          error: `Ollama error: ${msg}`,
          warning: 'Using saved questions from Firebase due to Ollama error'
        });
      }
    } catch (firebaseError) {
      console.error('Firebase fallback also failed:', firebaseError);
    }

    // Final fallback to hardcoded questions
    if (msg.includes('Connection') || msg.toLowerCase().includes('fetch') || msg.includes('404')) {
      return NextResponse.json({
        quiz: fallbackQuestions.slice(0, Math.min(count, fallbackQuestions.length)),
        source: 'fallback',
        error: 'Ollama and Firebase unavailable — showing hardcoded fallback content'
      });
    }

    return NextResponse.json({
      quiz: fallbackQuestions.slice(0, Math.min(count, fallbackQuestions.length)),
      source: 'fallback',
      error: msg,
      warning: 'Returning hardcoded fallback questions due to an error'
    }, { status: 200 });
  }
}