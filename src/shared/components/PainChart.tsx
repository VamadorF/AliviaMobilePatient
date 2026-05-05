import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

export type ChartType = 'line' | 'bar';

export interface ChartPoint {
  date: string;
  value: number;
}

interface PainChartProps {
  data: ChartPoint[];
  type?: ChartType;
  height?: number;
  showGrid?: boolean;
  yMax?: number;
  color?: string;
  title?: string;
}

const PADDING = { top: 16, right: 16, bottom: 28, left: 28 };

function formatShort(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date.slice(5);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export const PainChart: React.FC<PainChartProps> = ({
  data,
  type = 'line',
  height = 220,
  showGrid = true,
  yMax = 10,
  color = Colors.primary.base,
  title,
}) => {
  const [size, setSize] = useState({ width: 0, height });

  const innerW = Math.max(0, size.width - PADDING.left - PADDING.right);
  const innerH = Math.max(0, size.height - PADDING.top - PADDING.bottom);

  if (data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.empty}>Sin datos</Text>
      </View>
    );
  }

  const xStep = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const points = data.map((p, i) => ({
    x: PADDING.left + (data.length === 1 ? innerW / 2 : i * xStep),
    y: PADDING.top + innerH - (Math.min(p.value, yMax) / yMax) * innerH,
    value: p.value,
    date: p.date,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ');

  return (
    <View
      style={[styles.container, { height }]}
      onLayout={(e) =>
        setSize({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })
      }
    >
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {size.width > 0 ? (
        <Svg width={size.width} height={size.height}>
          {showGrid
            ? [0, 0.25, 0.5, 0.75, 1].map((t) => {
                const y = PADDING.top + innerH * t;
                return (
                  <Line
                    key={`g-${t}`}
                    x1={PADDING.left}
                    x2={PADDING.left + innerW}
                    y1={y}
                    y2={y}
                    stroke={Colors.border.subtle}
                    strokeWidth={1}
                    strokeDasharray="3 5"
                  />
                );
              })
            : null}

          {[0, 0.5, 1].map((t) => {
            const y = PADDING.top + innerH * t;
            const value = Math.round((1 - t) * yMax);
            return (
              <SvgText
                key={`y-${t}`}
                x={PADDING.left - 6}
                y={y + 3}
                fontSize={10}
                fill={Colors.text.muted}
                textAnchor="end"
              >
                {String(value)}
              </SvgText>
            );
          })}

          {type === 'line' ? (
            <>
              <Path d={linePath} stroke={color} strokeWidth={2.5} fill="none" />
              {points.map((p, i) => (
                <Circle key={i} cx={p.x} cy={p.y} r={4} fill={color} />
              ))}
            </>
          ) : (
            points.map((p, i) => {
              const barW = Math.max(8, xStep * 0.7);
              const x = p.x - barW / 2;
              const y = p.y;
              return (
                <Rect
                  key={i}
                  x={x}
                  y={y}
                  width={barW}
                  height={Math.max(0, PADDING.top + innerH - y)}
                  rx={4}
                  ry={4}
                  fill={color}
                />
              );
            })
          )}

          {points.map((p, i) => {
            if (data.length > 7 && i % Math.ceil(data.length / 6) !== 0) return null;
            return (
              <SvgText
                key={`x-${i}`}
                x={p.x}
                y={size.height - 8}
                fontSize={10}
                fill={Colors.text.muted}
                textAnchor="middle"
              >
                {formatShort(p.date)}
              </SvgText>
            );
          })}
        </Svg>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  title: {
    ...Typography.styles.label,
    color: Colors.text.primary,
    position: 'absolute',
    top: -4,
    left: Spacing.sm,
  },
  empty: {
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});

export default PainChart;
