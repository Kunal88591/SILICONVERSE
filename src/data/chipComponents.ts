import { ChipComponentMetadata, ChipComponentId } from '@/types';

export const CHIP_COMPONENTS: Record<ChipComponentId, ChipComponentMetadata> = {
  alu: {
    id: 'alu',
    name: 'ALU',
    fullName: 'Arithmetic Logic Unit',
    category: 'execution',
    description: 'High-performance 64-bit multi-stage superscalar arithmetic and bitwise logic unit featuring dual integer execution pipelines, carry-lookahead adders, and hardware barrel shifter.',
    functionalRole: 'Performs integer arithmetic (ADD, SUB, MUL) and logical operations (AND, OR, XOR, SHIFT) dictated by decoded instructions.',
    transistorCount: '380 Million',
    siliconArea: '2.84 mm²',
    powerRating: '24.5 W',
    clockDomain: '4.80 GHz Core',
    layer: 'functional',
    position: [-1.4, 0.22, 1.3],
    dimensions: [2.2, 0.35, 1.8],
    color: '#FF6B00',
    emissiveColor: '#FF4400',
    connections: ['registers', 'cu', 'bus', 'decoder'],
    specifications: {
      'Pipeline Stages': '3-stage integer execution',
      'Data Width': '64-bit integer, SIMD lane ready',
      'Peak Operations': '9.6 GOPS / core',
      'Branch Resolution': 'Single-cycle branch evaluation',
      'ALU Bypass Networks': 'Direct forward from WB stage'
    },
    detailedExplanation: [
      'The Arithmetic Logic Unit (ALU) serves as the computational nucleus of the execution engine.',
      'It contains dual 64-bit arithmetic pipelines capable of executing addition, subtraction, 2s-complement inversion, and two-cycle integer multiplications.',
      'Dedicated hardware bit-manipulation matrices accelerate cryptographic shift operations and parity calculation.',
      'An ultra-fast operand bypass network feeds execution results directly into consecutive dependent instructions without stalling for register write-back.'
    ]
  },
  cu: {
    id: 'cu',
    name: 'Control Unit',
    fullName: 'Central Micro-Sequencing Control Unit',
    category: 'control',
    description: 'Hardware finite state machine and microcode control matrix coordinating signal dispatch, branch evaluation, and pipeline stall arbitration across all functional blocks.',
    functionalRole: 'Generates control multiplexer selection signals, pipeline synchronization pulses, and exception handling triggers.',
    transistorCount: '190 Million',
    siliconArea: '1.45 mm²',
    powerRating: '8.2 W',
    clockDomain: '4.80 GHz Core',
    layer: 'functional',
    position: [1.4, 0.22, 1.3],
    dimensions: [2.0, 0.35, 1.8],
    color: '#387BFF',
    emissiveColor: '#1A5CFF',
    connections: ['decoder', 'alu', 'registers', 'clock', 'mem_ctrl', 'pc'],
    specifications: {
      'Micro-op Dispatch': '4 micro-ops per clock cycle',
      'Control Matrix': 'Hardwired fast decode + ROM microcode',
      'Branch Prediction': 'TAGE-style branch history table',
      'Interrupt Vectors': '64 prioritized hardware vectors'
    },
    detailedExplanation: [
      'The Control Unit acts as the grand conductor of the microarchitecture.',
      'Upon receiving decoded instruction signals, it asserts precise control lines that govern multiplexers, ALU operation selectors, memory read/write strobes, and register write-enable gates.',
      'It manages hazard detection units that automatically insert stall bubbles or initiate register forwarding when RAW (Read-After-Write) hazards appear.'
    ]
  },
  registers: {
    id: 'registers',
    name: 'Register File',
    fullName: 'Multi-Port General Purpose Register File',
    category: 'storage',
    description: 'Ultra-low latency 32-entry 64-bit multi-ported register array equipped with 4 read ports and 2 write ports for simultaneous superscalar operand extraction.',
    functionalRole: 'Stores immediate operands, memory pointers, and intermediate calculation results accessible within sub-nanosecond clock phases.',
    transistorCount: '95 Million',
    siliconArea: '0.92 mm²',
    powerRating: '6.4 W',
    clockDomain: '4.80 GHz Core',
    layer: 'functional',
    position: [0.0, 0.22, 0.0],
    dimensions: [1.8, 0.38, 1.4],
    color: '#8B5CF6',
    emissiveColor: '#7C3AED',
    connections: ['alu', 'cu', 'decoder', 'bus', 'mem_ctrl'],
    specifications: {
      'Register Count': '32 Architecture Registers (R0 - R31)',
      'Port Structure': '4 Read Ports, 2 Write Ports',
      'Access Latency': '1 clock cycle (0.21 ns)',
      'Register Renaming': 'Supported via 64 physical PRF entries'
    },
    detailedExplanation: [
      'The Register File represents the fastest accessible storage tier in the processor hierarchy.',
      'Dual read ports supply operands simultaneously to the ALU inputs, while independent write ports allow simultaneous write-back of memory load results and computational results.',
      'Register zero (R0) is hardwired to 0x00000000 to simplify zero-comparisons and clearing operations.'
    ]
  },
  l1i: {
    id: 'l1i',
    name: 'L1 Inst Cache',
    fullName: 'Level 1 Instruction Cache (L1I)',
    category: 'storage',
    description: '64 KB 8-way set-associative ultra-fast instruction cache with dedicated instruction prefetcher and branch target buffer (BTB).',
    functionalRole: 'Stores machine instruction blocks close to the fetch stage to prevent pipeline starvation caused by main memory latency.',
    transistorCount: '520 Million',
    siliconArea: '3.10 mm²',
    powerRating: '11.2 W',
    clockDomain: '4.80 GHz Core',
    layer: 'functional',
    position: [-2.8, 0.22, -0.6],
    dimensions: [1.6, 0.32, 2.2],
    color: '#10B981',
    emissiveColor: '#059669',
    connections: ['pc', 'decoder', 'l2', 'bus'],
    specifications: {
      'Cache Capacity': '64 KB High-density 6T SRAM',
      'Associativity': '8-way set associative',
      'Line Size': '64 Bytes per cache line',
      'Hit Latency': '3 clock cycles',
      'Prefetch Engine': 'Stream and stride instruction prefetch'
    },
    detailedExplanation: [
      'The L1 Instruction Cache stores contiguous instruction blocks fetched ahead of time.',
      'Coupled with the Program Counter (PC) and Branch Target Buffer, it continuously feeds a 32-byte instruction stream to the instruction aligner and decoder.',
      'Achieves an average hit rate above 98.4% on standard workloads.'
    ]
  },
  l1d: {
    id: 'l1d',
    name: 'L1 Data Cache',
    fullName: 'Level 1 Data Cache (L1D)',
    category: 'storage',
    description: '64 KB 8-way set-associative write-back data cache with non-blocking miss support (8 MSHRs) and store-to-load forwarding queues.',
    functionalRole: 'Provides fast read/write operand access for memory-bound instructions (LOAD and STORE).',
    transistorCount: '540 Million',
    siliconArea: '3.25 mm²',
    powerRating: '12.8 W',
    clockDomain: '4.80 GHz Core',
    layer: 'functional',
    position: [2.8, 0.22, -0.6],
    dimensions: [1.6, 0.32, 2.2],
    color: '#00E5FF',
    emissiveColor: '#00B4D8',
    connections: ['alu', 'registers', 'l2', 'mem_ctrl', 'bus'],
    specifications: {
      'Cache Capacity': '64 KB 6T Dual-Port SRAM',
      'Associativity': '8-way set associative',
      'Policy': 'Write-Back with Write-Allocate',
      'Hit Latency': '4 clock cycles',
      'Bandwidth': 'Up to 2 x 64-bit loads and 1 store / cycle'
    },
    detailedExplanation: [
      'The L1 Data Cache sits directly beside the execution core to handle dynamic memory accesses.',
      'It utilizes a non-blocking architecture, meaning CPU execution can continue processing instruction streams even when a data cache miss occurs.',
      'Integrated store buffers ensure that speculative writes are not committed until retirement.'
    ]
  },
  l2: {
    id: 'l2',
    name: 'L2 Cache',
    fullName: 'Level 2 Unified High-Capacity Cache',
    category: 'storage',
    description: '1 MB unified 16-way set-associative cache serving as the secondary high-bandwidth buffer between L1 caches and system memory.',
    functionalRole: 'Buffers instructions and data misses from both L1I and L1D, dramatically reducing costly bus round-trips to main DRAM.',
    transistorCount: '1.85 Billion',
    siliconArea: '7.40 mm²',
    powerRating: '19.6 W',
    clockDomain: '3.60 GHz Uncore',
    layer: 'functional',
    position: [0.0, 0.22, -2.4],
    dimensions: [5.2, 0.32, 1.5],
    color: '#0284C7',
    emissiveColor: '#0369A1',
    connections: ['l1i', 'l1d', 'mem_ctrl', 'bus'],
    specifications: {
      'Cache Capacity': '1024 KB Unified SRAM',
      'Associativity': '16-way set associative',
      'Hit Latency': '12 clock cycles',
      'Inclusion Policy': 'Non-inclusive / Non-exclusive (NINE)',
      'ECC Protection': 'Single-Error Correct, Double-Error Detect (SECDED)'
    },
    detailedExplanation: [
      'The Level 2 Cache acts as a vast reservoir of instructions and operands.',
      'When an L1 cache miss occurs, the request hits the L2 in approximately 12 cycles, compared to 140+ cycles required for an off-chip DRAM round-trip.',
      'Hardware ECC circuitry ensures data integrity against soft errors induced by cosmic ray ionization.'
    ]
  },
  mem_ctrl: {
    id: 'mem_ctrl',
    name: 'Memory Controller',
    fullName: 'Integrated DDR5/LPDDR5 Integrated Memory Controller',
    category: 'interconnect',
    description: 'Multi-channel integrated memory controller managing high-speed off-chip DRAM command scheduling, bank refresh, and impedance calibration.',
    functionalRole: 'Translates internal physical memory requests into DDR5 command sequences (ACTIVATE, READ, WRITE, PRECHARGE).',
    transistorCount: '410 Million',
    siliconArea: '3.60 mm²',
    powerRating: '14.2 W',
    clockDomain: '3.20 GHz PHY',
    layer: 'functional',
    position: [0.0, 0.22, -3.6],
    dimensions: [4.4, 0.28, 0.8],
    color: '#D97706',
    emissiveColor: '#B45309',
    connections: ['l2', 'bus', 'cu'],
    specifications: {
      'Channels': 'Quad-Channel 64-bit sub-channels',
      'Peak Bandwidth': '102.4 GB/s peak transfer rate',
      'Command Queue': '64-entry out-of-order memory scheduler',
      'PHY Interface': 'Sub-nanosecond impedance matching'
    },
    detailedExplanation: [
      'The integrated Memory Controller bridges the internal on-chip interconnect to the external board-level memory bus.',
      'It contains an intelligent reordering scheduler that prioritizes DRAM bank hits and minimizes row-buffer open/close switching penalties.',
      'Thermal sensors dynamically throttle external refresh intervals to optimize sustained throughput.'
    ]
  },
  decoder: {
    id: 'decoder',
    name: 'Instruction Decoder',
    fullName: 'Hardware Opcode Pre-Decoder & Dispatcher',
    category: 'control',
    description: 'High-throughput 4-wide instruction decoder mapping variable-length instruction formats into uniform internal RISC-like micro-operations.',
    functionalRole: 'Deconstructs raw byte streams into opcode tokens, register specifiers, and immediate sign-extended constants.',
    transistorCount: '160 Million',
    siliconArea: '1.30 mm²',
    powerRating: '7.5 W',
    clockDomain: '4.80 GHz Core',
    layer: 'functional',
    position: [-1.4, 0.22, 0.0],
    dimensions: [1.8, 0.35, 1.4],
    color: '#38BDF8',
    emissiveColor: '#0284C7',
    connections: ['l1i', 'cu', 'registers', 'alu', 'pc'],
    specifications: {
      'Decode Width': '4 instructions / clock cycle',
      'Micro-op Fuse': 'Macro-op and micro-op fusion supported',
      'Immediate Generator': '32-bit sign and zero-extension in parallel',
      'Decode Latency': '2 pipeline clock stages'
    },
    detailedExplanation: [
      'The Instruction Decoder translates high-level assembly commands (like LOAD, ADD, JMP) into internal micro-operations.',
      'It identifies operand dependencies, determines which functional execution port will receive the computation, and forwards control bits to the Control Unit.',
      'Macro-op fusion collapses common test-and-branch pairs into single execution micro-ops to boost IPC.'
    ]
  },
  pc: {
    id: 'pc',
    name: 'Program Counter',
    fullName: 'Instruction Pointer & Branch Target Resolver',
    category: 'control',
    description: '64-bit precision instruction address sequencing register with integrated return address stack (RAS) and branch target redirect unit.',
    functionalRole: 'Maintains the memory address of the next instruction to be fetched and executed in the CPU pipeline.',
    transistorCount: '45 Million',
    siliconArea: '0.45 mm²',
    powerRating: '3.1 W',
    clockDomain: '4.80 GHz Core',
    layer: 'functional',
    position: [-2.8, 0.22, 1.3],
    dimensions: [1.4, 0.35, 1.4],
    color: '#EC4899',
    emissiveColor: '#DB2777',
    connections: ['l1i', 'cu', 'decoder', 'bus'],
    specifications: {
      'Pointer Width': '64-bit canonical addressing',
      'Increment Stride': '+4 bytes default sequential step',
      'Return Address Stack': '32-entry hardware RAS for function CALL/RET',
      'Branch Mispredict Penalty': '14 cycles pipeline flush'
    },
    detailedExplanation: [
      'The Program Counter (PC) governs execution flow continuity.',
      'Under standard sequential execution, it increments automatically by the instruction byte stride.',
      'When jump instructions, branch tests, or subroutine calls occur, the PC is instantaneously updated with the calculated target branch address.'
    ]
  },
  bus: {
    id: 'bus',
    name: 'Bus Interconnect',
    fullName: 'High-Bandwidth Coherent On-Chip Crossbar Network',
    category: 'interconnect',
    description: 'Ultra-wide low-latency segmented packet crossbar interconnect linking execution cores, cache hierarchies, and memory controllers.',
    functionalRole: 'Transports data packets, address tags, snooping coherence broadcasts, and control arbitration messages across the die.',
    transistorCount: '310 Million',
    siliconArea: '2.90 mm²',
    powerRating: '16.5 W',
    clockDomain: '4.00 GHz Mesh',
    layer: 'interconnect',
    position: [0.0, 0.42, 0.0],
    dimensions: [5.8, 0.15, 4.8],
    color: '#00E5FF',
    emissiveColor: '#00E5FF',
    connections: ['alu', 'cu', 'registers', 'l1i', 'l1d', 'l2', 'mem_ctrl', 'decoder', 'pc'],
    specifications: {
      'Interconnect Type': 'Bi-directional Ring / Segmented Crossbar',
      'Data Bus Width': '256-bit coherent payload per link',
      'Coherence Protocol': 'MOESI cache directory protocol',
      'Bisection Bandwidth': '512 GB/s aggregate internal throughput'
    },
    detailedExplanation: [
      'The Bus Interconnect is the central circulatory system of the semiconductor.',
      'It utilizes segmented pipelines and credit-based flow control to prevent packet buffer overflow during heavy memory traffic.',
      'Hardware snooping lines continuously enforce cache coherency across L1 instruction, L1 data, and L2 shared cache domains.'
    ]
  },
  clock: {
    id: 'clock',
    name: 'Clock Distribution',
    fullName: 'Resonant Low-Jitter Clock Distribution & PLL Unit',
    category: 'timing',
    description: 'Low-skew H-tree differential clock distribution network driven by high-stability Phase-Locked Loops (PLL) and clock-gating power switches.',
    functionalRole: 'Generates and synchronously distributes gigahertz clock edge signals to billions of flip-flops across the silicon die.',
    transistorCount: '70 Million',
    siliconArea: '0.75 mm²',
    powerRating: '9.8 W',
    clockDomain: '4.80 GHz Base',
    layer: 'functional',
    position: [0.0, 0.22, 2.5],
    dimensions: [1.6, 0.32, 1.0],
    color: '#F59E0B',
    emissiveColor: '#D97706',
    connections: ['cu', 'alu', 'registers', 'bus', 'decoder'],
    specifications: {
      'PLL Synthesizers': 'Dual LC-tank low-phase-noise PLLs',
      'Clock Skew': '< 8 picoseconds die-wide variation',
      'Dynamic Frequency Scaling': '1.2 GHz power saving to 5.4 GHz boost',
      'Fine-Grained Clock Gating': '> 85% idle sector clock suppression'
    },
    detailedExplanation: [
      'The Clock Distribution Unit is the metronome of the microprocessor.',
      'Using a symmetrical H-tree metallic wiring geometry, it ensures clock edges reach distant sectors of the silicon die at precisely the same picosecond.',
      'Active autonomous clock gating shuts off clock signals to inactive functional units to drastically curtail dynamic capacitive power dissipation.'
    ]
  }
};

export const CHIP_COMPONENT_IDS: ChipComponentId[] = Object.keys(CHIP_COMPONENTS) as ChipComponentId[];
