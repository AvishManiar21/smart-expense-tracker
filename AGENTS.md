<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Available Agents

This project has specialized agents for different development tasks. All agents are located in `.claude/agents/` directory.

## Development Agents

### 1. **project-structure-architect**
**File**: `project-structure-architect.md`
**Purpose**: Organize and optimize project file/folder structure

Use this agent when you need to:
- Analyze and improve project folder organization
- Refactor component structure (by feature, type, or hybrid)
- Setup proper Next.js 14 App Router structure
- Optimize import paths with path aliases
- Implement scalable folder patterns
- Document project structure
- Move/reorganize files and folders

**Example**: "Organize my components folder" or "Create feature-based structure"

### 2. **nextjs-ts-dev**
**File**: `nextjs-ts-dev.md`
**Purpose**: Next.js 14 + TypeScript development

Use for Next.js App Router pages, components, and TypeScript features.

### 3. **web-dev-js**
**File**: `web-dev-js.md`
**Purpose**: JavaScript web development

Use for JavaScript (non-TypeScript) web development tasks.

### 4. **data-analysis-expert**
**File**: `data-analysis-expert.md`
**Purpose**: Data analysis and visualization

Use for analytics, chart data processing, and statistical analysis.

## Infrastructure Agents

### 5. **db-migration-optimizer**
**File**: `db-migration-optimizer.md`
**Purpose**: Database schema and migrations

Use for database structure, Drizzle ORM migrations, and query optimization.

### 6. **api-webhook-integrator**
**File**: `api-webhook-integrator.md`
**Purpose**: API and webhook integration

Use for external API integrations, webhook handlers, and OAuth flows.

### 7. **cicd-devops-architect**
**File**: `cicd-devops-architect.md`
**Purpose**: CI/CD pipelines and deployment

Use for GitHub Actions, Docker, deployment configuration, and DevOps tasks.

## Quality Assurance Agents

### 8. **test-generator**
**File**: `test-generator.md`
**Purpose**: Test generation and coverage

Use for creating unit tests, integration tests, and improving test coverage.

### 9. **dependency-security-auditor**
**File**: `dependency-security-auditor.md`
**Purpose**: Security audits and dependency management

Use for vulnerability scanning, dependency updates, and security reviews.

### 10. **performance-profiler**
**File**: `performance-profiler.md`
**Purpose**: Performance optimization

Use for analyzing bottlenecks, memory usage, and code optimization.

## Documentation & Monitoring Agents

### 11. **docs-generator**
**File**: `docs-generator.md`
**Purpose**: Documentation generation

Use for creating/updating README, API docs, and code documentation.

### 12. **error-monitor-logger**
**File**: `error-monitor-logger.md`
**Purpose**: Logging and error tracking

Use for implementing logging, monitoring, and error tracking systems.

## Code Review Agents

### 13. **python-code-reviewer**
**File**: `python-code-reviewer.md`
**Purpose**: Python code review

Use for reviewing Python code quality and best practices.

---

## How to Use Agents

Agents are automatically available through Claude Code. To use an agent, use the Task tool with the appropriate agent type:

```typescript
// Example: Using project-structure-architect
Task({
  subagent_type: "general-purpose",
  description: "Organize project structure",
  prompt: "Analyze and reorganize the components folder using feature-based structure"
})
```

Or mention them naturally in conversation:
- "Use the project-structure-architect agent to organize my files"
- "Can the test-generator create tests for my components?"
