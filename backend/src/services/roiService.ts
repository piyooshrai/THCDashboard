import { IClient } from '../models/Client';
import { ITimeLog } from '../models/TimeLog';

export interface ROICalculation {
  timeframe: string;
  clientHourlyValue: number;
  hoursReclaimed: number;
  valueOfReclaimedTime: number;
  vaHoursWorked: number;
  vaCost: number;
  netSavings: number;
  roiPercentage: number;
  dataSources: string[];
  calculationDate: string;
}

export function calculateROI(
  client: IClient,
  timeLogs: ITimeLog[],
  timeframe: 'weekly' | 'monthly' | 'yearly' = 'monthly'
): ROICalculation {
  const hourlyValue = client.hourlyValueOverride || client.calculatedHourlyValue || 50;
  const vaHourlyRate = parseFloat(process.env.DEFAULT_VA_HOURLY_RATE || '60');

  const vaHoursWorked = timeLogs.reduce((sum, log) => sum + log.hoursWorked, 0);

  const weeksInTimeframe = timeframe === 'monthly' ? 4.33 : timeframe === 'yearly' ? 52 : 1;
  const hoursReclaimed = client.baselineAdminHoursPerWeek * weeksInTimeframe;

  const valueOfReclaimedTime = hoursReclaimed * hourlyValue;
  const vaCost = vaHoursWorked * vaHourlyRate;
  const netSavings = valueOfReclaimedTime - vaCost;
  const roiPercentage = vaCost > 0 ? ((netSavings / vaCost) * 100) : 0;

  return {
    timeframe,
    clientHourlyValue: Math.round(hourlyValue * 100) / 100,
    hoursReclaimed: Math.round(hoursReclaimed * 100) / 100,
    valueOfReclaimedTime: Math.round(valueOfReclaimedTime * 100) / 100,
    vaHoursWorked: Math.round(vaHoursWorked * 100) / 100,
    vaCost: Math.round(vaCost * 100) / 100,
    netSavings: Math.round(netSavings * 100) / 100,
    roiPercentage: Math.round(roiPercentage * 100) / 100,
    dataSources: [client.dataSource],
    calculationDate: new Date().toISOString()
  };
}
