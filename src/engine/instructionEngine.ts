import { Instruction, Opcode, PipelineStage, ChipComponentId } from '@/types';

export interface ExecutionState {
  pc: number;
  instructions: Instruction[];
  registers: Record<string, number>;
  memory: number[];
  cycleCount: number;
  instructionCount: number;
  currentStage: PipelineStage;
  activeComponent: ChipComponentId;
  activePath: [ChipComponentId, ChipComponentId] | null;
  currentInstruction: Instruction | null;
  isHalted: boolean;
  isStalled: boolean;
  lastLog: string;
  executionHistory: Array<{
    cycle: number;
    pc: number;
    instruction: string;
    stage: PipelineStage;
    details: string;
  }>;
}

export class InstructionEngine {
  public static parseAssembly(code: string): Instruction[] {
    const lines = code.split('\n');
    const instructions: Instruction[] = [];
    let address = 0;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line || line.startsWith(';')) continue;

      // Extract inline comment if any
      let comment = '';
      if (line.includes(';')) {
        const parts = line.split(';');
        line = parts[0].trim();
        comment = parts[1].trim();
      }

      // Parse tokens
      // e.g. "LOAD R1, 10" or "ADD R3, R1, R2"
      const match = line.match(/^([A-Za-z]+)\s*(.*)$/);
      if (!match) continue;

      const opcodeRaw = match[1].toUpperCase() as Opcode;
      const argsRaw = match[2] ? match[2].split(',').map(s => s.trim()) : [];

      const instruction: Instruction = {
        address,
        raw: line,
        opcode: opcodeRaw,
        comment: comment || undefined
      };

      if (opcodeRaw === 'LOAD') {
        // LOAD Dest, Source/Imm
        instruction.dest = argsRaw[0];
        const val = parseInt(argsRaw[1], 10);
        if (!isNaN(val)) {
          instruction.immediate = val;
        } else {
          instruction.src1 = argsRaw[1];
        }
      } else if (opcodeRaw === 'STORE') {
        // STORE Src, Addr
        instruction.src1 = argsRaw[0];
        instruction.immediate = parseInt(argsRaw[1], 10) || 0;
      } else if (opcodeRaw === 'ADD' || opcodeRaw === 'SUB' || opcodeRaw === 'MUL' || 
                 opcodeRaw === 'AND' || opcodeRaw === 'OR' || opcodeRaw === 'XOR') {
        // OP Dest, Src1, Src2
        instruction.dest = argsRaw[0];
        instruction.src1 = argsRaw[1];
        instruction.src2 = argsRaw[2];
      } else if (opcodeRaw === 'JMP') {
        // JMP Target
        const target = parseInt(argsRaw[0], 10);
        instruction.immediate = !isNaN(target) ? target : 0;
      } else if (opcodeRaw === 'BEQ') {
        // BEQ Src1, Src2, Target
        instruction.src1 = argsRaw[0];
        instruction.src2 = argsRaw[1];
        instruction.immediate = parseInt(argsRaw[2], 10) || 0;
      }

      instructions.push(instruction);
      address++;
    }

    return instructions;
  }

  public static createInitialState(instructions: Instruction[] = []): ExecutionState {
    const memory = new Array(64).fill(0);
    // Pre-populate some RAM test data
    memory[10] = 42;
    memory[11] = 88;
    memory[12] = 120;
    memory[20] = 5;

    return {
      pc: 0,
      instructions,
      registers: {
        R0: 0,
        R1: 0,
        R2: 0,
        R3: 0,
        R4: 0,
        R5: 0,
        R6: 0,
        R7: 0
      },
      memory,
      cycleCount: 0,
      instructionCount: 0,
      currentStage: 'IDLE',
      activeComponent: 'cu',
      activePath: null,
      currentInstruction: instructions.length > 0 ? instructions[0] : null,
      isHalted: false,
      isStalled: false,
      lastLog: 'Processor in reset state. Ready to execute instructions.',
      executionHistory: []
    };
  }

  public static step(
    state: ExecutionState,
    hasAluFault = false,
    hasCacheFault = false,
    hasBusFault = false
  ): ExecutionState {
    if (state.isHalted || state.instructions.length === 0) {
      return {
        ...state,
        currentStage: 'IDLE',
        activePath: null,
        lastLog: state.isHalted ? 'Processor halted.' : 'No instructions loaded.'
      };
    }

    if (hasBusFault) {
      return {
        ...state,
        isStalled: true,
        currentStage: 'MEMORY',
        activeComponent: 'bus',
        activePath: ['bus', 'mem_ctrl'],
        lastLog: 'CRITICAL: Interconnect Crossbar deadlocked. Memory pipeline stalled!'
      };
    }

    const { currentStage, pc, instructions, registers, memory } = state;
    const currentInst = instructions[pc] || null;

    if (!currentInst) {
      return {
        ...state,
        isHalted: true,
        currentStage: 'IDLE',
        activePath: null,
        lastLog: 'Execution finished: End of instruction memory reached.'
      };
    }

    // Five-stage pipeline state machine:
    // FETCH -> DECODE -> EXECUTE -> MEMORY -> WRITEBACK -> (next inst FETCH)
    switch (currentStage) {
      case 'IDLE':
      case 'WRITEBACK': {
        // Transition to FETCH
        const targetInst = instructions[pc];
        if (!targetInst || targetInst.opcode === 'HALT') {
          return {
            ...state,
            isHalted: true,
            currentStage: 'IDLE',
            activeComponent: 'cu',
            activePath: null,
            currentInstruction: targetInst || null,
            lastLog: 'HALT instruction encountered. CPU entered low-power stop mode.'
          };
        }

        return {
          ...state,
          currentStage: 'FETCH',
          activeComponent: 'pc',
          activePath: ['pc', 'l1i'],
          currentInstruction: targetInst,
          cycleCount: state.cycleCount + 1,
          lastLog: `FETCH: Reading instruction at PC=0x${pc.toString(16).padStart(2, '0').toUpperCase()} (${targetInst.raw})`
        };
      }

      case 'FETCH': {
        // Transition to DECODE
        return {
          ...state,
          currentStage: 'DECODE',
          activeComponent: 'decoder',
          activePath: ['l1i', 'decoder'],
          cycleCount: state.cycleCount + 1,
          lastLog: `DECODE: Parsing Opcode ${currentInst.opcode} (Dest: ${currentInst.dest || 'None'}, Args: ${currentInst.src1 || ''} ${currentInst.src2 || ''})`
        };
      }

      case 'DECODE': {
        // Transition to EXECUTE
        return {
          ...state,
          currentStage: 'EXECUTE',
          activeComponent: currentInst.opcode === 'LOAD' || currentInst.opcode === 'STORE' ? 'registers' : 'alu',
          activePath: ['decoder', 'alu'],
          cycleCount: state.cycleCount + 1,
          lastLog: `EXECUTE: Dispatching ${currentInst.opcode} to ${currentInst.opcode === 'LOAD' || currentInst.opcode === 'STORE' ? 'Address Generation Unit' : 'Arithmetic Logic Unit'}`
        };
      }

      case 'EXECUTE': {
        // Compute operation
        const newRegisters = { ...registers };
        const newMemory = [...memory];
        let nextPc = pc + 1;
        let details = '';

        const getVal = (name?: string, imm?: number): number => {
          if (name && name in registers) return registers[name];
          if (imm !== undefined) return imm;
          return 0;
        };

        if (currentInst.opcode === 'LOAD') {
          // Handled in MEMORY stage
          details = `Prepared memory address calculation`;
        } else if (currentInst.opcode === 'STORE') {
          details = `Calculated write destination address RAM[${currentInst.immediate || 0}]`;
        } else if (currentInst.opcode === 'ADD') {
          const v1 = getVal(currentInst.src1);
          const v2 = getVal(currentInst.src2);
          let res = v1 + v2;
          if (hasAluFault) {
            res = (res ^ 0xFF) + 37; // Corrupted calculation
            details = `ALU FAULT: Arithmetic logic error! ${v1} + ${v2} calculated erroneously as ${res}`;
          } else {
            details = `ALU ADD: ${v1} + ${v2} = ${res}`;
          }
          if (currentInst.dest) newRegisters[currentInst.dest] = res;
        } else if (currentInst.opcode === 'SUB') {
          const v1 = getVal(currentInst.src1);
          const v2 = getVal(currentInst.src2);
          let res = v1 - v2;
          if (hasAluFault) {
            res = res - 128;
            details = `ALU FAULT: Subtraction parity discrepancy! Result = ${res}`;
          } else {
            details = `ALU SUB: ${v1} - ${v2} = ${res}`;
          }
          if (currentInst.dest) newRegisters[currentInst.dest] = res;
        } else if (currentInst.opcode === 'MUL') {
          const v1 = getVal(currentInst.src1);
          const v2 = getVal(currentInst.src2);
          const res = v1 * v2;
          details = `ALU MUL: ${v1} * ${v2} = ${res}`;
          if (currentInst.dest) newRegisters[currentInst.dest] = res;
        } else if (currentInst.opcode === 'AND') {
          const v1 = getVal(currentInst.src1);
          const v2 = getVal(currentInst.src2);
          const res = v1 & v2;
          details = `ALU AND: ${v1} & ${v2} = ${res}`;
          if (currentInst.dest) newRegisters[currentInst.dest] = res;
        } else if (currentInst.opcode === 'OR') {
          const v1 = getVal(currentInst.src1);
          const v2 = getVal(currentInst.src2);
          const res = v1 | v2;
          details = `ALU OR: ${v1} | ${v2} = ${res}`;
          if (currentInst.dest) newRegisters[currentInst.dest] = res;
        } else if (currentInst.opcode === 'XOR') {
          const v1 = getVal(currentInst.src1);
          const v2 = getVal(currentInst.src2);
          const res = v1 ^ v2;
          details = `ALU XOR: ${v1} ^ ${v2} = ${res}`;
          if (currentInst.dest) newRegisters[currentInst.dest] = res;
        } else if (currentInst.opcode === 'JMP') {
          const target = currentInst.immediate || 0;
          nextPc = target;
          details = `BRANCH: Unconditional jump to PC=0x${target.toString(16).toUpperCase()}`;
        } else if (currentInst.opcode === 'BEQ') {
          const v1 = getVal(currentInst.src1);
          const v2 = getVal(currentInst.src2);
          if (v1 === v2) {
            nextPc = currentInst.immediate || 0;
            details = `BRANCH: BEQ taken (${v1} == ${v2}). Redirecting PC -> ${nextPc}`;
          } else {
            details = `BRANCH: BEQ not taken (${v1} != ${v2}). Advancing PC sequentially.`;
          }
        }

        return {
          ...state,
          registers: newRegisters,
          memory: newMemory,
          currentStage: 'MEMORY',
          activeComponent: currentInst.opcode === 'LOAD' || currentInst.opcode === 'STORE' ? 'l1d' : 'bus',
          activePath: currentInst.opcode === 'LOAD' || currentInst.opcode === 'STORE' ? ['registers', 'l1d'] : ['alu', 'bus'],
          cycleCount: state.cycleCount + 1,
          lastLog: `MEMORY STAGE: ${details}`
        };
      }

      case 'MEMORY': {
        const newRegisters = { ...state.registers };
        const newMemory = [...state.memory];
        let memDetails = '';

        if (currentInst.opcode === 'LOAD') {
          if (currentInst.dest) {
            let loadedVal = 0;
            if (currentInst.immediate !== undefined) {
              loadedVal = currentInst.immediate;
              memDetails = `LOAD Immediate: Setting ${currentInst.dest} = ${loadedVal}`;
            } else if (currentInst.src1 && currentInst.src1 in state.registers) {
              const addr = state.registers[currentInst.src1] % 64;
              loadedVal = hasCacheFault ? (newMemory[addr] ^ 0x0F) : newMemory[addr];
              memDetails = hasCacheFault 
                ? `L1D CACHE FAULT: Tag match error reading RAM[${addr}]. Corrupted value = ${loadedVal}`
                : `LOAD from RAM[${addr}] -> ${currentInst.dest} = ${loadedVal}`;
            }
            newRegisters[currentInst.dest] = loadedVal;
          }
        } else if (currentInst.opcode === 'STORE') {
          const addr = (currentInst.immediate || 0) % 64;
          const val = currentInst.src1 ? (state.registers[currentInst.src1] || 0) : 0;
          newMemory[addr] = val;
          memDetails = `STORE: Written ${val} from ${currentInst.src1} into RAM[${addr}]`;
        } else {
          memDetails = `No memory access required for ${currentInst.opcode}`;
        }

        return {
          ...state,
          registers: newRegisters,
          memory: newMemory,
          currentStage: 'WRITEBACK',
          activeComponent: 'registers',
          activePath: ['bus', 'registers'],
          cycleCount: state.cycleCount + 1,
          lastLog: `WRITEBACK: ${memDetails}`
        };
      }

      default:
        return state;
    }
  }

  public static completeInstruction(
    state: ExecutionState,
    hasAluFault = false,
    hasCacheFault = false,
    hasBusFault = false
  ): ExecutionState {
    let current = { ...state };
    // Run stages until WRITEBACK finishes or halts
    let safetyCounter = 0;
    while (!current.isHalted && safetyCounter < 10) {
      safetyCounter++;
      const wasAtWriteback = current.currentStage === 'WRITEBACK';
      current = this.step(current, hasAluFault, hasCacheFault, hasBusFault);
      if (wasAtWriteback) {
        // Completed full instruction retirement
        current.instructionCount += 1;
        current.pc += 1;
        break;
      }
    }
    return current;
  }
}
