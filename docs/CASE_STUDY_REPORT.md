# Case Study Report: HR Workflow Designer Module

## Candidate Submission Summary

This project implements a mini HR Workflow Designer module where an HR admin can create and test workflows such as onboarding, leave approval, document verification, and automated internal processes.

The main goal is to demonstrate strong frontend architecture, React Flow usage, dynamic form handling, mock API integration, and workflow simulation.

---

## Requirement Mapping

| Case Study Requirement | Implemented Solution |
|---|---|
| Drag-and-drop workflow canvas | Sidebar nodes can be dragged onto the React Flow canvas |
| Multiple custom nodes | Start, Task, Approval, Automated Step, and End nodes are implemented |
| Connect nodes with edges | React Flow edge connection is enabled with smooth animated edges |
| Select node to edit | Clicking a node opens a right-side Node Form Panel |
| Delete nodes/edges | Toolbar provides deletion for selected node/edge |
| Start node validation | Start node cannot have incoming edges; exactly one Start is expected |
| Dynamic node forms | Each node type has its own controlled form fields |
| Mock automation API | `/api/automations` returns available automated actions |
| Mock simulation API | `/api/simulate` validates and returns a step-by-step execution log |
| Workflow sandbox panel | Bottom panel runs simulation and displays timeline/results |
| Clean architecture | Types, validation, simulation, API, forms, nodes, and canvas are separated |

---

## Design Approach

The UI follows a three-panel layout:

1. **Left Sidebar**: Node library for drag-and-drop creation.
2. **Center Canvas**: React Flow graph editor with nodes, edges, controls, minimap, and validation indicators.
3. **Right Panel**: Dynamic configuration form for the selected node.

A sandbox panel is placed at the bottom-left of the canvas. It serializes the current graph and calls the mock simulation API.

---

## Key Engineering Choices

### React Flow

React Flow was selected because the case study specifically requires a graph-based canvas with custom nodes, edge handling, drag-drop support, and visual workflow editing.

### TypeScript Interfaces

All workflow data is strongly typed through `src/types/workflow.ts`. This makes node configuration safer and easier to extend.

### Mock APIs

The application uses real Next.js route handlers for mock APIs instead of hardcoded local arrays inside components. This keeps the frontend close to a production integration pattern.

### Validation Layer

Validation is separated into `src/lib/validation.ts`. This prevents graph rules from being tightly coupled with UI components.

---

## Completed Bonus Features

- Export workflow as JSON
- Import workflow from JSON
- MiniMap and zoom controls
- Visual validation errors on nodes
- Graph health indicator

---

## Future Enhancements

With more time, the next improvements would be:

1. Auto-layout using Dagre or ElkJS.
2. Undo/redo history.
3. Node version history.
4. Persist workflows in PostgreSQL or Firestore.
5. Playwright E2E tests.
6. Storybook documentation for reusable node components.
7. Authentication and role-based access for HR admins.
