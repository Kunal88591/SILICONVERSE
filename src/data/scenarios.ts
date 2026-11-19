import { FaultDefinition, GuidedScenario } from '@/types';

export const FAULT_DEFINITIONS: Record<string, FaultDefinition> = {
  'alu_overflow_fault': {
    id: 'alu_overflow_fault',
    title: 'ALU Adder Logic Malfunction',
    componentId: 'alu',
    severity: 'critical',
    description: 'Carry-lookahead adder logic gate breakdown leading to corrupted arithmetic calculation results and unhandled integer overflow exceptions.',
    symptoms: [
      'Erroneous mathematical output in 64-bit integer calculations',
      'Sudden surge in speculative pipeline flushes',
      'Kernel arithmetic panic exceptions during vector workloads'
    ],
    systemConsequences: [
      'Application computation outputs become nondeterministic',
      'IPC drops from ~2.4 to ~0.7 due to repeated instruction recalculation',
      'Increased thermal concentration around ALU core area (+18°C)'
    ],
    telemetryImpact: {
      throughputDropPct: 68,
      tempIncreaseC: 18.5,
      clockPenaltyGHz: 1.2,
      errorRatePct: 42.4
    },
    recommendedActions: [
      'Route arithmetic workloads to secondary integer arithmetic lane',
      'Engage redundant ALU lockstep verification mode',
      'Down-clock the execution core to 3.2 GHz to stabilize gate switching margins'
    ]
  },
  'cache_coherence_fault': {
    id: 'cache_coherence_fault',
    title: 'L1 Data Cache Tag Directory Corruption',
    componentId: 'l1d',
    severity: 'high',
    description: 'SRAM soft-error bit flip inside the L1 Data Cache tag matching directory causing false cache misses and stale memory writes.',
    symptoms: [
      'Catastrophic spike in L1D cache miss rate from 1.6% to 48.2%',
      'Excessive bus arbitration contention on main crossbar',
      'Data hazard stall cycles during LOAD-after-STORE sequences'
    ],
    systemConsequences: [
      'Pipeline stalls waiting for L2/DRAM roundtrips',
      'System memory throughput bottleneck',
      'Potential data divergence between cache and main DRAM'
    ],
    telemetryImpact: {
      throughputDropPct: 54,
      tempIncreaseC: 9.2,
      clockPenaltyGHz: 0.6,
      errorRatePct: 28.5
    },
    recommendedActions: [
      'Trigger full L1D cache line invalidate and flush cycle',
      'Enable parity scrub and write-through fallback policy',
      'Quarantine faulty SRAM way bank and downgrade to 7-way associative operation'
    ]
  },
  'reg_parity_fault': {
    id: 'reg_parity_fault',
    title: 'Register File Multi-Port Timing Race',
    componentId: 'registers',
    severity: 'high',
    description: 'Metastability race condition occurring during concurrent dual-write and four-read cycles on high-frequency register lines R3 and R4.',
    symptoms: [
      'Spontaneous operand bit inversion during simultaneous read/write cycles',
      'Illegal instruction operand exceptions',
      'Register dependency hazard detector lockups'
    ],
    systemConsequences: [
      'Faulty operands fed directly into arithmetic units',
      'Control flow corruption if pointer registers are impacted',
      'Forced hardware pipeline restarts'
    ],
    telemetryImpact: {
      throughputDropPct: 45,
      tempIncreaseC: 6.4,
      clockPenaltyGHz: 0.8,
      errorRatePct: 22.0
    },
    recommendedActions: [
      'Inject pipeline stall cycle between back-to-back register write/read pairs',
      'Migrate active threads to redundant architectural register aliases',
      'Increase register file sense-amp bias voltage'
    ]
  },
  'mem_bus_fault': {
    id: 'mem_bus_fault',
    title: 'Interconnect Crossbar Packet Stoppage',
    componentId: 'bus',
    severity: 'critical',
    description: 'Buffer deadlock in the coherent on-chip crossbar arbiter halting packet transmission between core caches and memory controllers.',
    symptoms: [
      'Zero byte transfer rate across core-to-memory crossbar segment',
      'Total starvation of instruction prefetch queue in L1I',
      'System-wide watchdog timeout warning asserted'
    ],
    systemConsequences: [
      'Execution pipeline completely halts on the next memory access',
      'Memory queue saturation and crossbar deadlock',
      'Host system freeze if unhandled by hardware recovery'
    ],
    telemetryImpact: {
      throughputDropPct: 88,
      tempIncreaseC: 4.1,
      clockPenaltyGHz: 2.4,
      errorRatePct: 74.0
    },
    recommendedActions: [
      'Pulse crossbar credit arbiter hardware reset line',
      'Reroute coherent traffic via secondary bypass ring network',
      'Throttle high-priority DMA traffic bursts'
    ]
  },
  'clock_jitter_fault': {
    id: 'clock_jitter_fault',
    title: 'Clock Distribution PLL Phase Jitter',
    componentId: 'clock',
    severity: 'critical',
    description: 'High thermal noise in PLL voltage-controlled oscillator generating intolerable clock edge jitter and hold-time timing violations.',
    symptoms: [
      'Clock skew exceeding 45 picoseconds across the silicon die',
      'Random flip-flop setup and hold timing violations',
      'Micro-op dispatch phase de-synchronization'
    ],
    systemConsequences: [
      'Widespread nondeterministic logic corruption across all sectors',
      'Sudden core voltage ripple',
      'Immediate hardware safe-mode down-clocking'
    ],
    telemetryImpact: {
      throughputDropPct: 62,
      tempIncreaseC: 14.0,
      clockPenaltyGHz: 2.8,
      errorRatePct: 56.0
    },
    recommendedActions: [
      'Switch clock source to backup crystal oscillator reference',
      'Force PLL loop-filter bandwidth widening',
      'Emergency throttle clock frequency to baseline 1.6 GHz'
    ]
  },
  'thermal_runaway_fault': {
    id: 'thermal_runaway_fault',
    title: 'Die Thermal Overload & Dissipation Failure',
    componentId: 'cu',
    severity: 'critical',
    description: 'Cooling interface breakdown under peak synthetic workload causing junction temperatures to breach silicon critical threshold (105°C).',
    symptoms: [
      'Junction temperature soaring to 108.4°C in central execution matrix',
      'Electromigration risk flags triggered on power rails',
      'Severe hardware thermal throttling engaged (PROCHOT# asserted)'
    ],
    systemConsequences: [
      'Clock frequency forced from 4.8 GHz down to 1.2 GHz safe floor',
      'Dynamic power dissipation curtailed by 70%',
      'System performance degraded by 75% to preserve physical die integrity'
    ],
    telemetryImpact: {
      throughputDropPct: 76,
      tempIncreaseC: 38.0,
      clockPenaltyGHz: 3.4,
      errorRatePct: 15.0
    },
    recommendedActions: [
      'Engage maximum auxiliary thermal cooling pumps / fan RPM at 100%',
      'Activate aggressive duty-cycle clock skipping',
      'Migrate heavy computational workloads to cooler outer silicon sectors'
    ]
  }
};

export const GUIDED_SCENARIOS: GuidedScenario[] = [
  {
    id: 'scenario_nominal',
    title: 'Scenario 1: Nominal Processor Execution',
    subtitle: 'Baseline Superscalar Operation at Full Efficiency',
    description: 'Explore the microprocessor operating under optimal thermal, voltage, and memory parameters. Observe normal 5-stage pipeline instruction flow and balanced bus traffic.',
    category: 'nominal',
    workload: 45,
    cooling: 85,
    expectedObservations: [
      'Sustained IPC of 2.2 - 2.6 instructions per clock cycle',
      'Die average temperature stabilized between 42°C and 48°C',
      'Zero pipeline hazard stalls or memory arbitration bottlenecks',
      'Clean synchronous signal pulses traversing the internal crossbar bus'
    ],
    stepGuide: [
      'Observe the central 3D chip in its balanced nominal state with green/cyan status indicators.',
      'Navigate to the Signal Flow Lab to observe the continuous 5-stage instruction pipeline.',
      'Check Performance Analytics to inspect the smooth 4.8 GHz clock line and stable power draw.',
      'Verify that all registers in the Instruction Simulator update deterministically.'
    ],
    programToLoad: 'fibonacci'
  },
  {
    id: 'scenario_high_workload',
    title: 'Scenario 2: High Processing Workload & Stress',
    subtitle: 'Intensive Vector Computing & Maximum Thermal Dissipation',
    description: 'Subject the processor die to a sustained 95% computational load simulating real-time physics and deep learning matrix multiplication. Watch thermal dissipation rise and cooling fans ramp up.',
    category: 'stress',
    workload: 95,
    cooling: 75,
    expectedObservations: [
      'ALU and Control Unit become the primary thermal hotspots reaching ~74°C',
      'Aggregate power consumption surges from 45W baseline to ~98W peak',
      'Bus interconnect utilization increases to 82% capacity',
      'Dynamic frequency scaling maintains 4.8 GHz without thermal throttling'
    ],
    stepGuide: [
      'Watch the 3D chip functional blocks transition to warm amber and yellow hues.',
      'Observe the accelerated pulse rates in the 3D Bus Interconnect.',
      'Inspect the Thermal Analysis module to view the dynamic heatmap distribution.',
      'Experiment with lowering cooling efficiency to witness thermal threshold proximity.'
    ],
    programToLoad: 'vector_dot'
  },
  {
    id: 'scenario_alu_failure',
    title: 'Scenario 3: ALU Malfunction & Arithmetic Anomaly',
    subtitle: 'Simulated Logic Gate Breakdown in Integer Pipeline',
    description: 'Inject a hardware carry-logic breakdown in the primary Arithmetic Logic Unit. Observe how calculation errors disrupt instruction retirement and force pipeline stalls.',
    category: 'fault',
    targetComponent: 'alu',
    workload: 65,
    cooling: 80,
    faultToInject: 'alu_overflow_fault',
    expectedObservations: [
      'ALU block glows with critical red warning pulsing in the 3D scene',
      'Immediate drop of 68% in effective instruction throughput',
      'Execution log records unhandled parity and arithmetic discrepancy flags',
      'Diagnostic engine recommends secondary execution lane routing'
    ],
    stepGuide: [
      'Trigger the scenario to inject the ALU failure automatically.',
      'Notice the 3D camera centering on the ALU with critical status rings.',
      'Switch to the Instruction Simulator and step through an ADD/MUL instruction to witness the error state.',
      'Review the Fault Injection Lab to execute the recommended mitigation action.'
    ],
    programToLoad: 'arithmetic_test'
  },
  {
    id: 'scenario_cache_failure',
    title: 'Scenario 4: L1 Data Cache Soft-Error Anomaly',
    subtitle: 'Tag Directory Bit-Flip & Severe Memory Stall',
    description: 'Simulate a particle strike inducing an SRAM soft-error in the L1 Data Cache tag array. Watch L1 miss penalties stall execution stages and flood the L2 cache interface.',
    category: 'fault',
    targetComponent: 'l1d',
    workload: 60,
    cooling: 80,
    faultToInject: 'cache_coherence_fault',
    expectedObservations: [
      'L1D Cache component flashes yellow/orange warning in the 3D view',
      'Memory latency explodes from 4 cycles to 140+ cycles per access',
      'Bus interconnect shows heavy backlog buffering memory fetch requests',
      'IPC plunges from 2.4 to under 1.1 due to memory pipeline bubbles'
    ],
    stepGuide: [
      'Observe the L1 Data Cache highlighting with fault indicators.',
      'Navigate to the Signal Flow Lab and trace the stalled MEMORY stage.',
      'Inspect the Performance Analytics memory bandwidth graph showing the contention spike.',
      'Open the Engineering Assistant to ask: "What happens when the L1 cache fails?"'
    ],
    programToLoad: 'memory_stride'
  },
  {
    id: 'scenario_thermal_overload',
    title: 'Scenario 5: Thermal Overload & Emergency Throttling',
    subtitle: 'Cooling Breakdown Inducing Silicon Safe-Mode',
    description: 'Simulate a fan cooling failure (cooling dropping to 15%) while running maximum workload. Observe junction temperature surging past 95°C and emergency clock throttling kicking in.',
    category: 'fault',
    targetComponent: 'cu',
    workload: 100,
    cooling: 15,
    faultToInject: 'thermal_runaway_fault',
    expectedObservations: [
      'Thermal heatmap lights up with glowing red critical zones across the core',
      'Die peak temperature reaches 104.2°C triggering hardware PROCHOT# flag',
      'Autonomous dynamic frequency scaling slashes clock speed from 4.8 GHz to 1.4 GHz',
      'Power consumption drops sharply as clock gates suppress dynamic draw'
    ],
    stepGuide: [
      'Watch the entire 3D die shift into deep thermal warning colors with pulsing heat waves.',
      'Open Thermal Analysis to view the hotspot progression across the execution units.',
      'Observe how the system prevents permanent physical breakdown via frequency throttling.',
      'Click the "Engage Emergency Cooling" action to restore normal thermal equilibrium.'
    ],
    programToLoad: 'vector_dot'
  },
  {
    id: 'scenario_mem_bus_failure',
    title: 'Scenario 6: Crossbar Bus Communication Interruption',
    subtitle: 'Arbiter Deadlock Halting Inter-Component Signal Traffic',
    description: 'Simulate a protocol deadlock in the coherent on-chip bus interconnect. Watch the entire processor pipeline halt as instruction and data fetches cannot complete.',
    category: 'fault',
    targetComponent: 'bus',
    workload: 50,
    cooling: 85,
    faultToInject: 'mem_bus_fault',
    expectedObservations: [
      'Bus interconnect traces freeze into static warning state in 3D',
      'Execution pipeline completely halts on the next memory access',
      'Zero byte transfer rate across core-to-memory crossbar segment',
      'System-wide watchdog timeout warning asserted'
    ],
    stepGuide: [
      'Notice the glowing cyan bus network flashing red with stoppage indicators.',
      'Check the Signal Flow Lab: all 5 stages freeze at the MEMORY transfer cycle.',
      'Use the Fault Lab to pulse the arbiter hardware reset and clear the deadlock.'
    ],
    programToLoad: 'memory_stride'
  }
];

export const SAMPLE_PROGRAMS: Record<string, { name: string; description: string; code: string }> = {
  fibonacci: {
    name: 'Fibonacci Sequence Generator',
    description: 'Calculates the first 8 numbers in the Fibonacci series using registers R1, R2, R3, and stores results to RAM.',
    code: `; SiliconVerse Assembly Lab
; Program: Fibonacci Sequence Generator
; Computes Fibonacci numbers and stores in memory

LOAD R1, 0          ; R1 = Fib(0) = 0
LOAD R2, 1          ; R2 = Fib(1) = 1
STORE R1, 10        ; RAM[10] = Fib(0)
STORE R2, 11        ; RAM[11] = Fib(1)
LOAD R4, 12         ; R4 = Memory storage pointer

; Loop iteration 1
ADD R3, R1, R2      ; R3 = Fib(2) = 1
STORE R3, 12        ; Store Fib(2)
LOAD R1, R2         ; Advance R1
LOAD R2, R3         ; Advance R2

; Loop iteration 2
ADD R3, R1, R2      ; R3 = Fib(3) = 2
STORE R3, 13        ; Store Fib(3)
LOAD R1, R2         ; Advance R1
LOAD R2, R3         ; Advance R2

; Loop iteration 3
ADD R3, R1, R2      ; R3 = Fib(4) = 3
STORE R3, 14        ; Store Fib(4)
LOAD R1, R2         ; Advance R1
LOAD R2, R3         ; Advance R2

; Loop iteration 4
ADD R3, R1, R2      ; R3 = Fib(5) = 5
STORE R3, 15        ; Store Fib(5)

HALT                ; Terminate execution`
  },
  vector_dot: {
    name: 'Vector Dot Product (SIMD Emulation)',
    description: 'Multiplies two vectors [A1, A2, A3] and [B1, B2, B3] and accumulates the scalar dot product into R0.',
    code: `; SiliconVerse Assembly Lab
; Program: Vector Dot Product
; Accumulates A[i] * B[i] into accumulator register R0

LOAD R1, 15         ; Vector A[0] = 15
LOAD R2, 4          ; Vector B[0] = 4
MUL R3, R1, R2      ; R3 = 15 * 4 = 60
ADD R0, R0, R3      ; Accumulate into R0

LOAD R1, 8          ; Vector A[1] = 8
LOAD R2, 7          ; Vector B[1] = 7
MUL R3, R1, R2      ; R3 = 8 * 7 = 56
ADD R0, R0, R3      ; Accumulate into R0

LOAD R1, 12         ; Vector A[2] = 12
LOAD R2, 5          ; Vector B[2] = 5
MUL R3, R1, R2      ; R3 = 12 * 5 = 60
ADD R0, R0, R3      ; Final dot product in R0 (176)

STORE R0, 50        ; Write scalar result to RAM[50]
HALT                ; Completed`
  },
  arithmetic_test: {
    name: 'Arithmetic & Logic Stress Validation',
    description: 'Exhaustive verification of ADD, SUB, MUL, AND, OR, XOR operations across general-purpose registers.',
    code: `; SiliconVerse Assembly Lab
; Program: Arithmetic & Logic Verification
; Tests all major ALU hardware datapaths

LOAD R1, 120        ; Operand 1 = 120 (0x78)
LOAD R2, 45         ; Operand 2 = 45  (0x2D)

ADD R3, R1, R2      ; R3 = 120 + 45 = 165
SUB R4, R1, R2      ; R4 = 120 - 45 = 75
MUL R5, R1, R2      ; R5 = 120 * 45 = 5400

AND R6, R1, R2      ; R6 = 120 AND 45 = 40
OR  R7, R1, R2      ; R7 = 120 OR 45  = 125
XOR R0, R1, R2      ; R0 = 120 XOR 45 = 85

STORE R3, 20        ; Store ADD result
STORE R4, 21        ; Store SUB result
STORE R5, 22        ; Store MUL result
HALT`
  },
  memory_stride: {
    name: 'Memory Stride Cache Benchmark',
    description: 'Sequentially reads and writes with stride distances to benchmark L1 cache hit vs miss latency.',
    code: `; SiliconVerse Assembly Lab
; Program: Memory Stride Cache Benchmark
; Tests consecutive and strided memory accesses

LOAD R1, 100        ; Base value 100
STORE R1, 0         ; RAM[0] = 100 (Cache Line 0)
STORE R1, 1         ; RAM[1] = 100 (Cache Line 0 Hit)
STORE R1, 2         ; RAM[2] = 100 (Cache Line 0 Hit)

LOAD R2, 200        ; Base value 200
STORE R2, 16        ; RAM[16] = 200 (Cache Line 1 Boundary)
STORE R2, 32        ; RAM[32] = 200 (Cache Line 2 Boundary)
STORE R2, 48        ; RAM[48] = 200 (Cache Line 3 Boundary)

LOAD R3, 0          ; Read RAM[0]
LOAD R4, 16         ; Read RAM[16]
ADD R5, R3, R4      ; R5 = 300
STORE R5, 60        ; Output result
HALT`
  }
};
