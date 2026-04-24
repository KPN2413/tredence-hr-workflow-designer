# Tredence HR Workflow Designer

A functional prototype for the **Tredence Full Stack Engineering Intern case study**: an HR Workflow Designer built with **Next.js, React, TypeScript, Tailwind CSS, and React Flow**.

The application allows an HR admin to visually create, configure, validate, export/import, and simulate workflows such as onboarding, leave approval, document verification, and internal automation flows.

---

## 1. Features Implemented

| Requirement | Status | Notes |
|---|---:|---|
| React/Next.js application | Done | Built using Next.js App Router and TypeScript |
| React Flow canvas | Done | Drag/drop nodes, connect edges, delete, zoom, minimap, controls |
| Custom node types | Done | Start, Task, Approval, Automated Step, End |
| Node configuration forms | Done | Type-specific controlled forms in right-side panel |
| Dynamic automated action form | Done | Params change based on selected mock API action |
| Mock API integration | Done | `/api/automations` and `/api/simulate` route handlers |
| Workflow sandbox panel | Done | Serializes graph, posts to simulate API, shows execution timeline |
| Graph validation | Done | Missing connections, invalid start/end structure, cycles, unreachable nodes |
| Export/import JSON | Done | Bonus feature for saving/restoring workflow graphs |
| Clean architecture | Done | Separate canvas, node, form, API, validation, and type layers |

---

## 2. Tech Stack

- **Next.js**: application framework
- **React + TypeScript**: strongly typed UI implementation
- **@xyflow/react**: React Flow canvas and graph editor
- **Tailwind CSS**: responsive UI styling
- **Lucide React**: icons
- **Mock API routes**: local Next.js route handlers for automation and simulation

---

## 3. How to Run Locally

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

For production build:

```bash
npm run build
npm start
```

---

## 4. Folder Structure

```txt
src/
  app/
    api/
      automations/route.ts     # GET /api/automations mock action list
      simulate/route.ts        # POST /api/simulate workflow simulation
    layout.tsx
    page.tsx
    globals.css

  components/
    canvas/
      WorkflowDesigner.tsx     # Main orchestration component
      Sidebar.tsx              # Drag/drop node palette
      NodeFormPanel.tsx        # Right-side config panel
      SandboxPanel.tsx         # Simulation panel
      Toolbar.tsx              # Reset/delete/export/import actions
    forms/
      FormPrimitives.tsx       # Reusable input/select/toggle components
      KeyValueEditor.tsx       # Metadata/custom field editor
      NodeForms.tsx            # Type-specific node forms
    nodes/
      BaseNode.tsx             # Shared custom node UI
      CustomNodes.tsx          # Start/Task/Approval/Automated/End nodes
      index.ts                 # React Flow nodeTypes map

  hooks/
    useAutomations.ts          # Fetches automation list
    useSimulation.ts           # Handles simulation API state
    useWorkflowJson.ts         # Export/import workflow JSON helpers

  lib/
    mockApi.ts                 # Client API abstraction
    mockData.ts                # Mock automation definitions
    simulator.ts               # Simulation logic
    validation.ts              # Graph validation logic
    workflowDefaults.ts        # Node labels/default config/factory
    classNames.ts              # Classname utility

  types/
    workflow.ts                # Central TypeScript interfaces
```

---

## 5. Core Architecture Decisions

### 5.1 Separation of concerns

The project separates:

- **Canvas logic** in `WorkflowDesigner.tsx`
- **Node rendering** in `components/nodes`
- **Form rendering** in `components/forms`
- **Workflow validation** in `lib/validation.ts`
- **Mock API calls** in `lib/mockApi.ts`
- **Simulation logic** in `lib/simulator.ts`
- **Shared types** in `types/workflow.ts`

This keeps the design scalable if new node types or backend APIs are added later.

### 5.2 Type-safe node configuration

Each node type has its own configuration interface:

- `StartConfig`
- `TaskConfig`
- `ApprovalConfig`
- `AutomatedConfig`
- `EndConfig`

The forms update only the selected node's typed configuration.

### 5.3 Mock API abstraction

The UI does not directly hardcode mock responses. It calls:

- `GET /api/automations`
- `POST /api/simulate`

This makes it easy to replace the mock layer with a real backend later.

### 5.4 Workflow validation

Before simulation, the graph is validated for:

- exactly one Start node
- at least one End node
- Start node should not have incoming edges
- End node should not have outgoing edges
- non-start nodes need incoming connections
- non-end nodes need outgoing connections
- cycle detection
- unreachable nodes
- required Task and Automation fields

Validation errors are shown both in the graph health badge and on specific nodes/forms.

---

## 6. Mock API Contract

### GET `/api/automations`

Returns automated actions:

```json
{
  "data": [
    {
      "id": "send_email",
      "label": "Send Email",
      "description": "Send an email notification to an employee, manager, or HR owner.",
      "params": ["to", "subject"]
    }
  ]
}
```

### POST `/api/simulate`

Accepts:

```json
{
  "nodes": [],
  "edges": []
}
```

Returns:

```json
{
  "ok": true,
  "errors": [],
  "steps": [
    {
      "nodeId": "task-1",
      "nodeType": "task",
      "title": "Collect Documents",
      "status": "success",
      "message": "Step executed."
    }
  ],
  "serializedWorkflow": {
    "nodes": [],
    "edges": []
  }
}
```

---

## 7. Assumptions

- No authentication is implemented because the case study explicitly says authentication is not required.
- No database persistence is used because backend persistence is not required.
- Simulation is deterministic and mock-based.
- Workflow validation is intentionally strict to demonstrate graph reasoning.
- UI is inspired by the reference designs but not a pixel-perfect clone, as allowed by the case study.

---

## 8. What I Would Add With More Time

- Undo/redo stack
- Auto-layout using Dagre or ElkJS
- Node version history
- Collaborative editing
- Real backend persistence with PostgreSQL or Firestore
- E2E tests using Playwright
- Unit tests for validation and simulation logic
- Role-based workflow templates for onboarding, leave, compliance, and document verification

---

## 9. Submission Note

This repository demonstrates the required frontend engineering skills: React Flow proficiency, modular React architecture, dynamic forms, mock API design, graph validation, and a simulation sandbox.
