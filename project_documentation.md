# AI Search & Planning Playground: Project Documentation

This document serves as the complete reference guide for the AI Search & Planning Playground. It is specifically structured to help you or your teammates build a cohesive presentation covering classic Artificial Intelligence topics from Unit II (Search) and Unit V (Planning).

---

## 1. Project Overview

The **AI Search & Planning Playground** is a unified web application that demonstrates classic Artificial Intelligence concepts through four distinct modules. Instead of isolated scripts, the project provides a highly visual, interactive dashboard to run, compare, and benchmark different algorithms side-by-side.

### Tech Stack
- **Frontend**: React (Vite) with raw CSS for styling and custom animations.
- **Backend**: Python 3 (custom HTTP server, no heavy frameworks).
- **Deployment**: Vercel (zero-config serverless deployment mapping `/api/*` to the Python backend and `/*` to the React frontend).

---

## 2. Module Breakdown & Presentation Structure

When presenting this project, it is highly recommended to present by **algorithm family/concept** rather than by team member. This makes the presentation flow logically through the evolution of AI search techniques.

### Module 1: Uninformed vs. Informed Search (Maze Pathfinding)
**Concept**: Navigating a 10x10 grid with obstacles. 
**Algorithms Demoed**:
- **BFS (Breadth-First Search)** & **DFS (Depth-First Search)**: Demonstrates *uninformed (blind) search*. They explore uniformly or deeply without knowing where the goal is.
- **A\* Search (with Manhattan Distance)**: Demonstrates *informed search*. It uses a heuristic to "guess" the direction of the goal, expanding far fewer nodes.

> [!TIP]
> **Presentation Moment**: Run BFS, then run A* on the exact same maze. The visual animation will clearly show A* exploring a much narrower "frontier" towards the goal, proving the efficiency of heuristic-guided search.

### Module 2: The Power of Heuristics (8-Puzzle)
**Concept**: Solving a 3x3 sliding tile puzzle from a shuffled state.
**Algorithms Demoed**:
- **Uniform Cost Search (UCS)**
- **Greedy Best-First Search**
- **A\* Search**

> [!IMPORTANT]
> **Presentation "Aha" Moment**: The most critical demo here is running **A\*** twice on the same shuffled board—once with the **Misplaced Tiles** heuristic, and once with the **Manhattan Distance** heuristic. 
> The dashboard will show that Manhattan Distance expands significantly fewer nodes because it provides more accurate information (it is a *tighter/more dominant* admissible heuristic).

### Module 3: Local Search & Stochasticity (N-Queens)
**Concept**: Placing 8 queens on an 8x8 chessboard such that no two queens attack each other.
**Algorithms Demoed**:
- **Hill Climbing**: Makes greedy local choices. 
- **Simulated Annealing (SA)**: Uses probabilistic temperature decay.
- **Genetic Algorithm (GA)**: Uses crossover and mutation on a population of boards.

> [!NOTE]
> **Why do runs take different amounts of steps?**
> These are *stochastic* (randomized) algorithms. Because they don't use a fixed random seed in the frontend, Python uses the system clock to generate randomness. The solver starts with a random board, picks random neighbors (SA), or performs random mutations (GA). Therefore, every time you click "Solve", the algorithm takes a completely unique path through the state space.

> [!IMPORTANT]
> **Presentation "Aha" Moment**: Run **Hill Climbing** multiple times until it gets stuck on a "local optimum" (a board with >0 attacking pairs where no single move improves it). Then, run **Simulated Annealing**. Explain how SA successfully escapes these local traps by sometimes rolling the dice to accept *worse* moves early on (when the "Temperature" is high).

### Module 4: Classical Planning (Blocks World)
**Concept**: Moving a set of stacked blocks on a table from a Start arrangement to a Goal arrangement.
**Algorithm Demoed**:
- **State-Space Planner (BFS)**

**Presentation Focus**: Explain the difference between *Search* and *Planning*. In Modules 1-3, we just searched states. In Planning, we reason over **Actions** (e.g., `Move(X, Y)`) that have strict **Preconditions** (Block X must be clear) and **Effects** (Block X is now on Block Y). 

---

## 3. The Shared Dashboard (Conclusion)

The final section of your presentation should highlight the **Dashboard/Leaderboard**. 

Because all four modules were built to share a common `BenchmarkResult` data schema, the dashboard can compare runtimes (`time_taken_ms`) and memory/effort (`nodes_expanded`) across completely different domains.

**Key Takeaway to end the presentation**: "There is no single best algorithm. Uninformed search works for simple state spaces, A* dominates when good heuristics exist, Local Search handles massive spaces like N-Queens where the path doesn't matter, and Planners are required when we must reason about complex action rules."
