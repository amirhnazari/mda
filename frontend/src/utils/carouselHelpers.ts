import { VitalSign } from "@models/index";

export interface ChartData {
  day: string;
  value: number;
  originalValue: string;
}

export const prepareChartData = (
  vital: VitalSign,
  parseVitalValue: (value: string, type: string) => number
): ChartData[] => {
  return vital.readings.map((reading) => ({
    day: reading.day,
    value: parseVitalValue(reading.value, vital.type),
    originalValue: reading.value,
  }));
};

export const getChartsToDisplay = (
  vitals: VitalSign[],
  activeIndex: number
): VitalSign[] => {
  const totalCharts = vitals.length;
  if (totalCharts === 0) return [];

  if (totalCharts <= 3) {
    return [...vitals];
  } else {
    const prevIndex = (activeIndex - 1 + totalCharts) % totalCharts;
    const nextIndex = (activeIndex + 1) % totalCharts;
    return [vitals[prevIndex], vitals[activeIndex], vitals[nextIndex]];
  }
};

export const navigateCarousel = (
  direction: "left" | "right",
  activeIndex: number,
  totalCharts: number
): number => {
  if (totalCharts === 0) return activeIndex;

  if (direction === "left") {
    return (activeIndex - 1 + totalCharts) % totalCharts;
  } else {
    return (activeIndex + 1) % totalCharts;
  }
};

export const handleChartClick = (
  isCenter: boolean,
  vital: VitalSign,
  vitals: VitalSign[],
  onExpandChart: (vitalType: string) => void,
  onSetActiveIndex: (index: number) => void
) => {
  if (isCenter) {
    onExpandChart(vital.type);
  } else {
    const newIndex = vitals.findIndex((v) => v.type === vital.type);
    onSetActiveIndex(newIndex);
  }
};
