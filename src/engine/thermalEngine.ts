import { ChipComponentId, ThermalTelemetry, SystemTelemetry } from '@/types';
import { CHIP_COMPONENTS } from '@/data/chipComponents';

export class ThermalEngine {
  // Baseline thermal parameters
  private static readonly AMBIENT_TEMP = 24.0; // °C
  private static readonly CRITICAL_TEMP = 100.0; // °C
  private static readonly THROTTLE_TEMP = 92.0; // °C

  // Thermal coefficients per component (W thermal resistance factor)
  private static readonly THERMAL_FACTORS: Record<ChipComponentId, number> = {
    alu: 0.52,
    cu: 0.38,
    registers: 0.22,
    l1i: 0.28,
    l1d: 0.31,
    l2: 0.35,
    mem_ctrl: 0.34,
    decoder: 0.26,
    pc: 0.15,
    bus: 0.32,
    clock: 0.29
  };

  /**
   * Deterministically calculates live temperatures for all 11 components.
   * Equation:
   * T_comp = T_ambient + (Factor_comp * Workload * (1 - CoolingEff * 0.75)) + FaultSpike
   */
  public static calculateThermalState(
    workloadPercent: number, // 0 - 100
    coolingEfficiency: number, // 0 - 100
    activeFaults: string[] = []
  ): ThermalTelemetry {
    const coolingFactor = Math.max(0.05, coolingEfficiency / 100);
    const loadFactor = workloadPercent / 100;
    const componentTemps: Record<ChipComponentId, number> = {} as any;

    let maxTemp = 0;
    let sumTemp = 0;
    let hotspotId: ChipComponentId = 'alu';

    for (const id of Object.keys(CHIP_COMPONENTS) as ChipComponentId[]) {
      const factor = this.THERMAL_FACTORS[id] || 0.3;
      // Base thermal rise
      let temp = this.AMBIENT_TEMP + (factor * 70 * loadFactor * (1 - (coolingFactor * 0.72)));

      // Add fault-specific thermal anomalies
      if (activeFaults.includes('alu_overflow_fault') && id === 'alu') {
        temp += 22.4;
      }
      if (activeFaults.includes('cache_coherence_fault') && id === 'l1d') {
        temp += 12.8;
      }
      if (activeFaults.includes('thermal_runaway_fault')) {
        temp += (id === 'alu' || id === 'cu' ? 44.5 : 24.0);
      }
      if (activeFaults.includes('clock_jitter_fault') && id === 'clock') {
        temp += 18.2;
      }

      // Add slight jitter for realism (+/- 0.3)
      temp = Math.round(temp * 10) / 10;
      componentTemps[id] = temp;

      if (temp > maxTemp) {
        maxTemp = temp;
        hotspotId = id;
      }
      sumTemp += temp;
    }

    const avgTemp = Math.round((sumTemp / Object.keys(CHIP_COMPONENTS).length) * 10) / 10;
    const throttlingActive = maxTemp >= this.THROTTLE_TEMP;
    const fanRpm = Math.round(1200 + (coolingEfficiency * 28) + (maxTemp > 75 ? (maxTemp - 75) * 60 : 0));

    return {
      ambientTemp: this.AMBIENT_TEMP,
      workloadPercent,
      coolingEfficiency,
      fanRpm,
      throttlingActive,
      maxTemperature: maxTemp,
      avgTemperature: avgTemp,
      hotspotComponentId: hotspotId,
      componentTemperatures: componentTemps
    };
  }

  /**
   * Generates a telemetry sample reflecting current execution state & thermal conditions
   */
  public static generateTelemetryPoint(
    timestamp: number,
    thermal: ThermalTelemetry,
    activeFaults: string[],
    cycleCount: number,
    instructionCount: number
  ): SystemTelemetry {
    const d = new Date(timestamp);
    const timeLabel = `${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

    // Base clock 4.8 GHz, throttles if temperature is high or clock fault injected
    let clock = 4.80;
    if (thermal.throttlingActive) {
      clock = Math.max(1.4, 4.80 - ((thermal.maxTemperature - this.THROTTLE_TEMP) * 0.35));
    }
    if (activeFaults.includes('clock_jitter_fault')) {
      clock = Math.min(clock, 2.0);
    }

    // Power consumption: P = P_static + C * V^2 * f
    let power = 22.0 + (thermal.workloadPercent * 0.72) * (clock / 4.8);
    if (activeFaults.includes('thermal_runaway_fault')) {
      power = Math.max(88, power * 1.35);
    }

    // IPC calculation
    let ipc = 2.45;
    if (activeFaults.includes('alu_overflow_fault')) ipc *= 0.38;
    if (activeFaults.includes('cache_coherence_fault')) ipc *= 0.52;
    if (activeFaults.includes('mem_bus_fault')) ipc *= 0.12;
    if (thermal.throttlingActive) ipc *= 0.85;

    // Memory Bandwidth in GB/s
    let memBw = 14.0 + (thermal.workloadPercent * 0.82);
    if (activeFaults.includes('mem_bus_fault')) memBw = 0.4;
    if (activeFaults.includes('cache_coherence_fault')) memBw = Math.min(102.4, memBw * 1.85); // Miss flood

    return {
      timestamp,
      timeLabel,
      cpuUtilization: Math.round(thermal.workloadPercent),
      clockFrequency: Math.round(clock * 100) / 100,
      powerWatts: Math.round(power * 10) / 10,
      ipc: Math.round(ipc * 100) / 100,
      memoryBandwidthGBs: Math.round(memBw * 10) / 10,
      instructionCount,
      cycleCount,
      tempMax: thermal.maxTemperature,
      tempAvg: thermal.avgTemperature
    };
  }
}
