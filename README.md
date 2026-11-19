# SILICONVERSE

**Next-Generation Interactive Semiconductor Architecture, Digital Twin and Simulation Environment.**

SILICONVERSE is a browser-based semiconductor exploration workstation and virtual digital twin. It enables engineers, students, and computer architects to inspect procedural 3D silicon, execute assembly programs, inject hardware faults, simulate thermal dissipation, and analyze pipeline microarchitecture in real-time.

---

## Key Features

1. **Procedural 3D Semiconductor Model**:
   - Built with Three.js and React Three Fiber.
   - Ceramic BGA substrate with 100+ metallic solder spheres and gold bonding fingers.
   - Silicon die wafer with perimeter ground rings and micro-circuit etching.
   - 11 distinct functional blocks with specialized heights, materials, and labels:
     - **ALU** (Arithmetic Logic Unit)
     - **Control Unit** (Micro-sequencing unit)
     - **Register File** (32 general-purpose 64-bit registers)
     - **L1 Instruction Cache** (64 KB 8-way SRAM)
     - **L1 Data Cache** (64 KB 8-way SRAM)
     - **L2 Cache** (1024 KB Unified SRAM)
     - **Memory Controller** (Quad-channel DDR5 PHY)
     - **Instruction Decoder** (4-wide micro-op dispatcher)
     - **Program Counter** (64-bit branch resolver)
     - **Bus Interconnect** (256-bit coherent crossbar)
     - **Clock Distribution** (H-tree low-jitter PLL unit)
   - Nickel-plated metallic heat spreader lid with laser engraving.
   - Glowing bus highways with dynamic traveling signal pulses.

2. **Exploded Architecture Dissection**:
   - Continuous separation slider (0% to 100%) separating the 5 physical tiers along the vertical Y-axis.
   - Layer isolation and visibility controls for Package, Interconnect, Functional Blocks, Die, and Substrate.

3. **Cycle-Accurate 5-Stage Signal Flow**:
   - Simulates **FETCH → DECODE → EXECUTE → MEMORY → WRITEBACK**.
   - Highlights active components in 3D and 2D.
   - Step Stage, Step Instruction, Continuous Run, and Speed Adjustment (100ms - 1500ms).

4. **Instruction Simulator & Assembly Lab**:
   - Deterministic 64-bit RISC micro-engine.
   - Supported Opcodes: `LOAD`, `STORE`, `ADD`, `SUB`, `MUL`, `AND`, `OR`, `XOR`, `JMP`, `BEQ`, `HALT`.
   - Sample programs: Fibonacci, Vector Dot Product, Arithmetic Stress, Memory Stride.
   - Live Register File viewer (R0 - R7) and 64-word RAM hex grid.

5. **Fault Injection & Diagnostics**:
   - Emulates hardware failure modes: ALU carry breakdown, L1D cache tag corruption, register metastability race, clock PLL jitter, bus deadlock, and thermal runaway.
   - Live telemetry comparison (nominal baseline vs faulty state).
   - Automated microarchitectural mitigations and reset lines.

6. **Dynamic Thermal Analysis**:
   - Deterministic thermal modeling based on workload capacitive switching and convective heat transfer.
   - Dynamic heatmap color grading: Blue (Cool) → Cyan (Nominal) → Yellow (Warm) → Orange (Hot) → Red (Critical).
   - Automatic `PROCHOT#` hardware thermal throttling engaged at ≥92°C.

7. **Performance Analytics & Telemetry**:
   - Real-time time-series charts powered by Recharts: Clock frequency, Power (W), Junction Temp (°C), IPC, and Memory Bandwidth (GB/s).
   - Export telemetry logs to CSV.

8. **AI Engineering Assistant**:
   - Context-aware local assistant with specialized microarchitectural knowledge.
   - Understands currently selected component, active faults, and thermal status.

9. **Scenario Library & Academic Demonstrations**:
   - Guided experiments for classroom and presentation use with step-by-step instructions, hypotheses, and verification checklists.

---

## Tech Stack

- **Framework**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React
- **3D Graphics**: Three.js, React Three Fiber, @react-three/drei, GSAP
- **Telemetry Charts**: Recharts
- **State Store**: Zustand

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/siliconverse.git
cd siliconverse

# Install dependencies
npm install

# Start the development workstation
npm run dev
```

Open your browser at `http://localhost:5173/`.

### Production Build

```bash
# Compile TypeScript and bundle with Vite
npm run build

# Preview production build locally
npm run preview
```

### Vercel Deployment

SiliconVerse is optimized for zero-config deployment on Vercel:

```bash
npx vercel
```

---

## License

MIT License. Designed and engineered for semiconductor education and digital twin simulation.
