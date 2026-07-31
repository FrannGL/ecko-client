# AGENTS.md

## Project Overview

Ecko Client es una aplicación de chat en tiempo real construida con React 19 y Vite. La arquitectura sigue **Clean Architecture** con separación clara de capas: domain, application, data y presentation.

## Core Technologies

### Frontend Framework & Runtime

- **React 19.2.7** - UI framework con React Compiler support
- **react-router-dom 6** - Client-side routing (Declarative mode with BrowserRouter)
- **React DOM 19.2.7** - DOM rendering
- **Vite 8.0.3** - Build tool y dev server
- **TypeScript 5.9.3** - Lenguaje con strict mode habilitado

### State Management & Data Fetching

- **Zustand 5.0.14** - Global state (auth, UI)
- **TanStack React Query 5.101.4** - Server state management
- **React Hook Form 7.83.0** - Form state
- **@hookform/resolvers 5.5.7** - Form validation resolvers

### Styling & UI

- **Tailwind CSS 4.2.2** - Utility-first CSS
- **@tailwindcss/vite 4.2.2** - Vite plugin para Tailwind
- **Lucide React 1.27.0** - Icon library
- **Radix UI 1.2.16** - Accessible UI primitives
- **@base-ui/react 1.6.0** - Base UI components
- **class-variance-authority 0.7.1** - Component variants
- **clsx 2.1.1** - Utility para classNames

### Data Validation

- **Zod 4.4.3** - TypeScript-first schema validation

### Communication

- **@stomp/stompjs 7.3.0** - WebSocket STOMP client para mensajería real-time
- **Ky 2.0.2** - HTTP client

### Build & Dev Tools

- **Vite 8.0.3** - Bundler y dev server

## Architecture

### Clean Architecture Layers

```
domain/
├── models/          # Rich domain entities with business logic
│                    # (Message, Server, Channel, User classes)
└── repositories/    # Repository interfaces (contracts)
                     # - MessageRepository (send, subscribe abstractions)
                     # - TokenRepository (auth token persistence)
                     # - AuthRepository, ServerRepository, etc.

application/
├── usecases/        # Orchestration & business logic coordination
│   ├── BaseUseCase.ts              # Abstract base class
│   ├── SendMessageUseCase.ts       # Message orchestration
│   ├── CreateServerUseCase.ts      # Server creation
│   ├── JoinServerUseCase.ts        # Server joining
│   ├── CreateChannelUseCase.ts     # Channel orchestration
│   └── index.ts                     # Exports

data/
├── repositories/    # Repository implementations (interfaces → concrete)
├── api/             # HTTP client (Ky) & API calls
├── mappers/         # Data transformation (API → domain)
└── websocket/       # STOMP WebSocket configuration (abstracted)

presentation/
├── pages/           # Route components
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks (React Query + usecases)
├── providers/       # Context providers (auth, UI)
├── store/           # Zustand stores (delegated to repositories)
└── ui/              # Shadcn/Radix UI components
```

### Simplified Data Flow (SPA Pattern)

```
Components → Hooks (React Query) → Use Cases → Repositories → API/WebSocket
         ↓
    Rich Entities
  (Message, Server, User)
     with methods
```

**Key Points:**

- **Application layer** orchestrates validation & transaction boundaries
- **Repositories** abstract all data sources (HTTP, WebSocket)
- **Rich domain entities** encapsulate business logic
- **Clean inversion of dependencies** across all layers

## Architecture Layers

### 1. Domain Layer (Independent)

**Responsibility**: Define business rules and abstractions

- **Models**: Rich entities with methods (`Message.isOwnedBy()`, `Server.hasChannel()`)
- **Repositories**: Interfaces defining contracts (no implementation)
- **Validators**: Zod schemas for data validation

**Example**:

```typescript
// Domain entity with business logic
export class Message {
  isOwnedBy(userId: number): boolean { ... }
  canBeEditedBy(userId: number): boolean { ... }
  getDisplayContent(): string { ... }
}

// Repository interface - defines contract, not implementation
export interface MessageRepository {
  send(channelId: number, input: SendMessageInput): Promise<void>;
  subscribe(channelId: number, callback: (msg: Message) => void): UnsubscribeFunction;
}
```

**No dependencies on**: Data, Presentation, Frameworks

---

### 2. Application Layer (Orchestration)

**Responsibility**: Coordinate domain logic and define transaction boundaries

- **Use Cases**: Classes orchestrating repositories & validation
- **Input/Output Ports**: Explicit types for inputs and returns
- **Business Rules**: Validations and pre-conditions before operations
- **Transaction Boundaries**: Defines atomic operations

**Example**:

```typescript
// Application usecase - orchestrates + validates
export class SendMessageUseCase extends UseCase<SendMessageUseCaseInput, void> {
  constructor(private messageRepository: MessageRepository) {}

  async execute(input: SendMessageUseCaseInput): Promise<void> {
    // Validation (business rules)
    if (!input.channelId || input.channelId <= 0) {
      throw new Error("Invalid channel ID");
    }

    // Orchestration (calls repository)
    await this.messageRepository.send(input.channelId, input.data);

    // Transaction boundary: from validation → to persistence
  }
}
```

**Benefits**:

- ✅ Testeable sin React/UI (plain TypeScript + mocked repositories)
- ✅ Reutilizable en cualquier contexto (API REST, CLI, bot, etc.)
- ✅ Límites claros de qué es una operación atómica
- ✅ Independiente de frameworks

**No dependencies on**: Presentation, UI frameworks (React)

---

### 3. Data Layer (Infrastructure)

**Responsibility**: Implement repository contracts using concrete data sources

- **Repository Implementations**: Concrete implementations with HTTP/WebSocket/Storage
- **API Client**: Ky HTTP client for REST calls
- **WebSocket Client**: STOMP for real-time messaging
- **Mappers**: Transform API responses → Domain entities
- **Token Storage**: localStorage persistence (abstracted via TokenRepository)

**Example**:

```typescript
// Data layer - implements domain contracts
export const messageRepository: MessageRepository = {
  async send(channelId, input) {
    // Implementation detail: uses STOMP WebSocket
    stompSendMessage(`/app/chat.sendMessage/${channelId}`, input);
  },

  subscribe(channelId, callback) {
    // Implementation detail: STOMP subscription
    return subscribeToTopic(`/user/queue/message/${channelId}`, (msg) => {
      const entity = Message.from(JSON.parse(msg.body));
      callback(entity);
    });
  },
};
```

**Key Feature**: Swappable implementations

- Want to switch STOMP → Socket.io? Change implementation only
- Want to add caching layer? Wrap repository without changing contracts
- Want to persist offline? Add local storage layer

**No dependencies on**: Presentation, Application logic

---

### 4. Presentation Layer (React UI)

**Responsibility**: Render UI and orchestrate React Query + use cases

- **Components**: React components (functional, composable)
- **Hooks**: React Query + custom hooks calling use cases
- **Pages**: Route-mapped page components
- **Providers**: Context for auth, UI state
- **Store**: Zustand for global state (auth, UI sidebar, etc.)
- **UI Library**: Shadcn/Radix UI components

**Example**:

```typescript
// Presentation hook - orchestrates usecase + React Query
export function useSendMessage(channelId: number) {
  const usecase = new SendMessageUseCase(messageRepository);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => usecase.execute({ channelId, data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages", channelId] }),
  });
}

// Component - only calls hooks, never repositories directly
export function MessageForm({ channelId }: Props) {
  const { mutate, isPending } = useSendMessage(channelId);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutate({ content: "Hello!" });
    }}>
      <button disabled={isPending}>Send</button>
    </form>
  );
}
```

**Key Principles**:

- Components never call repositories directly
- All business logic flows through use cases
- React Query manages server state (caching, sync, invalidation)
- Zustand manages client-only state (auth, UI)

**No dependencies on**: Domain, Application (only consume via hooks)

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                           │
│  Components → Hooks (React Query + Use Cases) → Zustand Store      │
└────────────────────────┬────────────────────────────────────────────┘
                         │ calls
                         ▼
        ┌────────────────────────────────────┐
        │     APPLICATION LAYER              │
        │  Use Cases (Validation + Orchest)  │
        │  - SendMessageUseCase              │
        │  - CreateServerUseCase             │
        │  - JoinServerUseCase               │
        │  - CreateChannelUseCase            │
        └────────┬─────────────────────────┬─┘
                 │ calls                   │
        ┌────────▼─────────────────────┐  │
        │   DOMAIN LAYER               │  │
        │  Rich Entities + Interfaces  │  │
        │  - Message, Server entities  │  │
        │  - Repository interfaces     │  │
        └──────────────────────────────┘  │
                                          │
        ┌────────────────────────────────▼─┐
        │      DATA LAYER                   │
        │  Repository Implementations       │
        │  - HTTP (Ky) / WebSocket (STOMP) │
        │  - Mappers (JSON → Entities)     │
        │  - Token Storage (localStorage)  │
        └────────────────────────────────┬─┘
                                         │ calls
                                         ▼
                    ┌─────────────────────────────┐
                    │ External Services            │
                    │ - Backend API                │
                    │ - WebSocket Server           │
                    │ - Browser Storage            │
                    └─────────────────────────────┘
```

---

## Development

### Setup Commands

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Production server
pnpm start
```

### Linting & Formatting

```bash
# Check linting issues
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check

# Type checking
pnpm typecheck
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - All TypeScript strict checks active
- **Type imports** - Use `type` keyword for type imports (enforced by ESLint)
- **No `any`** - Avoid explicit `any` (warnings enforced)
- **Unused variables** - Prefix with `_` if intentionally unused
- **Module resolution** - Use path aliases: `~/*` and `@/*` (both resolve to `./app/*`)

### Naming Conventions

- **Components** - PascalCase (e.g., `MessageList.tsx`)
- **Hooks** - camelCase with `use` prefix (e.g., `useMessages.ts`)
- **Stores** - camelCase with `Store` suffix (e.g., `authStore.ts`)
- **Repository interfaces** - PascalCase with `.repository.ts` (e.g., `auth.repository.ts`)
- **Repository implementations** - PascalCase with `.repository.impl.ts` (e.g., `auth.repository.impl.ts`)

### Code Organization

- **Single responsibility** - One primary export per file
- **Barrel exports** - Use `index.ts` for exporting multiple items from a directory
- **Functional components** - Use functional components with hooks
- **Props interfaces** - Define props inline or as `ComponentNameProps` interface
- **No console.log** - Use `console.warn()` or `console.error()` only (enforced by ESLint)
- **const over let** - Prefer `const` (enforced by ESLint)

### Import Organization

- External imports first
- Type imports with separate type lines
- Local imports last
- Enforced by `@trivago/prettier-plugin-sort-imports`

### React Patterns

- **Hooks** - Use React hooks for side effects and state
- **Composition** - Favor component composition over prop drilling
- **Error Boundaries** - Use `ErrorBoundary.tsx` for error handling
- **Controlled forms** - Use React Hook Form for form management
- **React Query mutations** - Server-side operations via `useMutation` in hooks

## Project Configuration

### Tailwind CSS

- **Config**: Default Tailwind with custom extensions
- **Utilities**: Use utility classes for styling
- **Animations**: Integrated with `tw-animate-css`

### ESLint

- **Parser** - TypeScript ESLint Parser
- **Recommended rules** - Based on `@eslint/js` and `@typescript-eslint`
- **Ignores** - node_modules, dist, build

### Prettier

- **Plugins** - `@trivago/prettier-plugin-sort-imports` for import sorting
- **Format on save** - Recommended in VS Code

### Path Aliases

```
~ → ./app/
@ → ./app/
```

## Development Workflow

### Adding a New Feature

#### Step-by-Step

1. **Define rich domain model** in `domain/models/YourEntity.ts`
   - Create a class with business logic methods (not just a type)
   - Implement methods for domain rules: `isOwnedBy()`, `canBeDeleted()`, etc.
   - Define Zod schema for validation
   - Provide `Entity.from(data)` factory method

2. **Create repository interface** in `domain/repositories/yourEntity.repository.ts`
   - Abstract all data sources (HTTP, WebSocket, cache)
   - Define contracts for queries and mutations
   - No implementation details here

3. **Implement repository** in `data/repositories/yourEntity.repository.impl.ts`
   - Implement all interface methods
   - Use Zod schemas to validate/parse API responses
   - Transform raw data into rich entities using `Entity.from()`
   - Handle transports (Ky for HTTP, STOMP for WebSocket)

4. **Create React Query hooks** in `presentation/hooks/useYourEntity.ts`
   - `useQuery` hooks call repository read methods
   - `useMutation` hooks call repository write methods
   - Handle cache invalidation on success
   - Let React Query manage state and errors

5. **Use in components**
   - Call hooks, never call repositories directly
   - Use entity methods for business logic
   - Leverage hook return values for UI state

#### Example: Rich Entity

```typescript
// domain/models/message.ts
export class Message {
  constructor(private data: MessageData) {}

  isOwnedBy(userId: number): boolean {
    return this.data.authorId === userId;
  }

  canBeEditedBy(userId: number): boolean {
    return this.isOwnedBy(userId) && !this.isDeleted();
  }

  static from(data: MessageData): Message {
    return new Message(data);
  }
}
```

#### Example: Repository with Abstraction

```typescript
// domain/repositories/message.repository.ts
export interface MessageRepository {
  getByChannel(channelId: number): Promise<Message[]>;
  send(channelId: number, input: SendMessageInput): Promise<void>; // ← Abstraction!
  subscribe(channelId: number, callback: (msg: Message) => void): UnsubscribeFunction;
}

// data/repositories/message.repository.impl.ts
export const messageRepository: MessageRepository = {
  async send(channelId, input) {
    stompSendMessage(`/app/chat.sendMessage/${channelId}`, input);
  },
};
```

#### Example: Hook Pattern

```typescript
export function useCreateServer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServerInput) => serverRepository.create(data), // → Calls repository, not direct API
    onSuccess: () => qc.invalidateQueries({ queryKey: ["servers"] }),
  });
}
```

#### Implemented Clean Architecture Patterns

**Rich Message Entity** - Encapsulates domain logic:

```typescript
// domain/models/message.ts
export class Message implements MessageData {
  isOwnedBy(userId: number): boolean {
    /* ... */
  }
  canBeEditedBy(userId: number): boolean {
    /* ... */
  }
  isDeleted(): boolean {
    /* ... */
  }
  getDisplayContent(): string {
    /* ... */
  }
  static from(data: MessageData): Message {
    /* ... */
  }
}
```

**Token Repository** - Abstracts token persistence:

```typescript
// domain/repositories/token.repository.ts
export interface TokenRepository {
  save(tokens: TokenPair): Promise<void>;
  retrieve(): Promise<TokenPair | null>;
  clear(): Promise<void>;
}

// data/repositories/token.repository.impl.ts
// Implementation with localStorage (swappable without changing presentation)
```

**WebSocket in Repository** - Abstracts real-time transport:

```typescript
// domain/repositories/message.repository.ts
export interface MessageRepository {
  send(channelId: number, input: SendMessageInput): Promise<void>;
  subscribe(channelId: number, callback: (msg: Message) => void): UnsubscribeFunction;
}

// data/repositories/message.repository.impl.ts
// Wraps STOMP client, returns Message entities
// Presentation uses via hooks, never direct STOMP calls
```

### File Changes Checklist

- [ ] TypeScript strict mode compliance
- [ ] No `any` types
- [ ] Proper type imports
- [ ] ESLint passes (`pnpm lint`)
- [ ] Prettier formatted (`pnpm format`)
- [ ] Type checking passes (`pnpm typecheck`)

## Architecture & Data Flow

### Why Simplified Architecture?

In a **React 19 SPA with React Query** + **Clean Architecture**:

**Benefits:**

- **No use cases**: Hooks + React Query + Rich Entities handle encapsulation
- **No actions**: Server-side form submission not applicable in SPA
- **No loaders**: React Query handles async data fetching and caching
- **Inversion of Dependencies**: Repositories abstract transports (HTTP/WebSocket)
- **Domain Logic**: Rich entities encapsulate business rules, not scattered in components
- **Testability**: Repositories provide seams for testing; entities are pure
- **Maintainability**: Clear separation of concerns across layers

**Trade-offs:**

- Slightly more boilerplate than "hooks directly calling API"
- Worth it for medium+ projects (Ecko scales well)

### Real-time Features

- **WebSocket abstraction**: STOMP client encapsulated in `MessageRepository`
  - `send(channelId, input)` - Send message via WebSocket (abstracted transport)
  - `subscribe(channelId, callback)` - Subscribe to real-time updates
  - Factory: Returns `UnsubscribeFunction` for cleanup
  - Raw STOMP topics wrapped as repository methods
- **Message subscriptions**: `useMessagesManager.ts` + hook subscriptions use repository
- **Transport layer**: Fully abstracted - swappable without changing presentation
- **Consistency**: All real-time operations flow through repositories

## Domain Model Patterns

### Rich Entities (Not Anemic DTOs)

Entities encapsulate domain-specific behavior:

```typescript
// ✅ Rich Entity with methods
class Message {
  isOwnedBy(userId): boolean {
    /* ... */
  }
  canBeEditedBy(userId): boolean {
    /* ... */
  }
  isDeleted(): boolean {
    /* ... */
  }
  getDisplayContent(): string {
    /* ... */
  }
}

// vs ❌ Anemic DTO
type Message = {
  id: number;
  content: string;
  // No methods, just data
};
```

### Token Management

- **TokenRepository** interface abstracts token persistence (`domain/repositories/token.repository.ts`)
- **TokenRepository implementation** handles localStorage (`data/repositories/token.repository.impl.ts`)
- **AuthStore** delegates to repository (not direct localStorage)
- **Benefit**: Token storage is pluggable (could swap localStorage → AsyncStorage → secure storage)

### Inversion of Dependencies

**Correct Flow:**

```
Presentation → Repository Interface (domain) → Concrete Repository (data) → Infrastructure
```

**Example - WebSocket:**

- Presentation doesn't call `stompSendMessage()` directly
- Instead: `messageRepository.send()` (abstraction)
- Implementation delegates to STOMP (swappable)

## Skills & Practices

### Applied Skills

- **react-19** - React 19 patterns with hooks and React Compiler
- **react-router-dom** - Client-side routing (Declarative mode: BrowserRouter, Routes, Route components)
- **typescript** - Strict TypeScript patterns + type safety
- **clean-architecture** - Full Clean Architecture implementation:
  - Inversion of dependencies ✅
  - Rich domain entities ✅
  - Repository pattern for data access ✅
  - Abstraction of transports (HTTP/WebSocket) ✅
  - Token persistence abstracted ✅

### React Compiler (RC)

React Compiler automatically optimizes your components and hooks. **Manual memoization (`useCallback`, `useMemo`, `React.memo`) is not needed** when the compiler is active.

#### Configuration

- **babel-plugin-react-compiler@rc** - Enabled in `vite.config.ts` via `vite-plugin-babel`
- **eslint-plugin-react-hooks@^6.0.0-rc.1** - Integrated into ESLint for rule validation
- **Target**: React 19+

#### Guidelines

- Write normal functions and calculations without wrapping in `useCallback` or `useMemo`
- The compiler detects which components/hooks need optimization and applies it automatically
- ESLint violations indicate the compiler has skipped optimizing those components (they'll still work)
- `"use no memo"` can opt-out specific components if issues arise (temporary escape hatch)

#### DevTools

- React DevTools 5.0+ shows "Memo ✨" badge on optimized components

### Quality Standards

- Type safety: strict mode enabled
- Code cleanliness: ESLint + Prettier integration
- Accessibility: Radix UI primitives for a11y
- Performance: React Query for efficient data fetching + React Compiler automatic optimization

## Production

### Build Output

- **SPA mode** - Pure client-side React application
- **Client assets optimized by Vite** - Tree-shaked, minified, code-split
- **No server-side rendering** - Backend is separate (handled by API server)
- **Environment variables** - Configure in `.env` or `.env.local` (API endpoint, WebSocket URL, etc.)

### Deployment

- **Build**: `pnpm build` → outputs to `dist/`
- **Deploy**: Serve `dist/` folder as static files (CDN, GitHub Pages, Vercel, Netlify, etc.)
- **API**: Points to backend server (configured in env variables)

## Useful Commands Reference

| Command          | Purpose                          |
| ---------------- | -------------------------------- |
| `pnpm dev`       | Start dev server with hot reload |
| `pnpm build`     | Build for production (SPA)       |
| `pnpm lint`      | Check code quality               |
| `pnpm lint:fix`  | Auto-fix linting issues          |
| `pnpm format`    | Format code with Prettier        |
| `pnpm typecheck` | Run TypeScript type checking     |
