import { describe, it, expect } from 'vitest';
import { prepareChartData, getChartsToDisplay, navigateCarousel } from '../carouselHelpers';
import { parseVitalValue } from '../vitalSignsConfig';
import { VitalSign } from '@models/index';

const buildVital = (type: VitalSign['type'], values: string[]): VitalSign => ({
  type,
  readings: values.map((value, idx) => ({ day: `Day ${idx + 1}`, value }))
});

describe('carouselHelpers', () => {
  it('prepareChartData converts readings correctly', () => {
    const vital = buildVital('heartRate', ['60 bpm', '65 bpm']);
    const data = prepareChartData(vital, parseVitalValue);
    expect(data).toEqual([
      { day: 'Day 1', value: 60, originalValue: '60 bpm' },
      { day: 'Day 2', value: 65, originalValue: '65 bpm' }
    ]);
  });

  it('getChartsToDisplay returns correct vitals for active index', () => {
    const vitals: VitalSign[] = [
      buildVital('heartRate', []),
      buildVital('bloodPressure', []),
      buildVital('temperature', []),
      buildVital('respiration', [])
    ];

    // activeIndex = 0 should return [last, first, second]
    expect(getChartsToDisplay(vitals, 0).map(v => v.type)).toEqual([
      'respiration', 'heartRate', 'bloodPressure'
    ]);

    // activeIndex = 2 should return [index1, index2, index3]
    expect(getChartsToDisplay(vitals, 2).map(v => v.type)).toEqual([
      'bloodPressure', 'temperature', 'respiration'
    ]);
  });

  it('navigateCarousel cycles indices properly', () => {
    const total = 4;
    expect(navigateCarousel('left', 0, total)).toBe(3);
    expect(navigateCarousel('right', 3, total)).toBe(0);
    expect(navigateCarousel('right', 1, total)).toBe(2);
  });
});
