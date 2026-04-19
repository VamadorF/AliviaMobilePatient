import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Ellipse, Path, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

export type BodyViewMode = 'frontal' | 'posterior';

interface BodyArea {
  id: string;
  label: string;
  shape: 'circle' | 'rounded';
  // posición y tamaño en porcentaje sobre el viewBox 100x200
  x: number;
  y: number;
  w: number;
  h: number;
}

const VIEW_W = 100;
const VIEW_H = 200;

const bodyAreasFrontal: BodyArea[] = [
  { id: 'face', label: 'Cara', shape: 'rounded', x: 50, y: 12, w: 22, h: 18 },
  { id: 'neck', label: 'Cuello', shape: 'rounded', x: 50, y: 30, w: 16, h: 8 },
  { id: 'shoulder-right', label: 'Hombro derecho', shape: 'rounded', x: 70, y: 38, w: 16, h: 10 },
  { id: 'shoulder-left', label: 'Hombro izquierdo', shape: 'rounded', x: 30, y: 38, w: 16, h: 10 },
  { id: 'chest', label: 'Pecho', shape: 'rounded', x: 50, y: 50, w: 32, h: 18 },
  { id: 'abdomen', label: 'Abdomen', shape: 'rounded', x: 50, y: 76, w: 28, h: 18 },
  { id: 'hip-right', label: 'Cadera derecha', shape: 'rounded', x: 58, y: 100, w: 14, h: 10 },
  { id: 'hip-left', label: 'Cadera izquierda', shape: 'rounded', x: 42, y: 100, w: 14, h: 10 },
  { id: 'arm-right', label: 'Brazo derecho', shape: 'rounded', x: 80, y: 60, w: 12, h: 22 },
  { id: 'arm-left', label: 'Brazo izquierdo', shape: 'rounded', x: 20, y: 60, w: 12, h: 22 },
  { id: 'elbow-right', label: 'Codo derecho', shape: 'circle', x: 84, y: 86, w: 8, h: 8 },
  { id: 'elbow-left', label: 'Codo izquierdo', shape: 'circle', x: 16, y: 86, w: 8, h: 8 },
  { id: 'forearm-right', label: 'Antebrazo derecho', shape: 'rounded', x: 84, y: 100, w: 10, h: 16 },
  { id: 'forearm-left', label: 'Antebrazo izquierdo', shape: 'rounded', x: 16, y: 100, w: 10, h: 16 },
  { id: 'hand-right', label: 'Mano derecha', shape: 'rounded', x: 86, y: 120, w: 10, h: 8 },
  { id: 'hand-left', label: 'Mano izquierda', shape: 'rounded', x: 14, y: 120, w: 10, h: 8 },
  { id: 'leg-right', label: 'Pierna derecha', shape: 'rounded', x: 58, y: 132, w: 14, h: 28 },
  { id: 'leg-left', label: 'Pierna izquierda', shape: 'rounded', x: 42, y: 132, w: 14, h: 28 },
  { id: 'knee-right', label: 'Rodilla derecha', shape: 'circle', x: 58, y: 162, w: 12, h: 8 },
  { id: 'knee-left', label: 'Rodilla izquierda', shape: 'circle', x: 42, y: 162, w: 12, h: 8 },
  { id: 'calf-right', label: 'Pantorrilla derecha', shape: 'rounded', x: 58, y: 178, w: 12, h: 14 },
  { id: 'calf-left', label: 'Pantorrilla izquierda', shape: 'rounded', x: 42, y: 178, w: 12, h: 14 },
  { id: 'foot-right', label: 'Pie derecho', shape: 'rounded', x: 58, y: 194, w: 12, h: 6 },
  { id: 'foot-left', label: 'Pie izquierdo', shape: 'rounded', x: 42, y: 194, w: 12, h: 6 },
];

const bodyAreasPosterior: BodyArea[] = [
  { id: 'head', label: 'Cabeza', shape: 'rounded', x: 50, y: 12, w: 22, h: 18 },
  { id: 'neck', label: 'Cuello', shape: 'rounded', x: 50, y: 30, w: 16, h: 8 },
  { id: 'shoulder-right', label: 'Hombro derecho', shape: 'rounded', x: 70, y: 38, w: 16, h: 10 },
  { id: 'shoulder-left', label: 'Hombro izquierdo', shape: 'rounded', x: 30, y: 38, w: 16, h: 10 },
  { id: 'back-upper', label: 'Espalda alta', shape: 'rounded', x: 50, y: 52, w: 32, h: 22 },
  { id: 'back-lower', label: 'Espalda baja', shape: 'rounded', x: 50, y: 80, w: 28, h: 16 },
  { id: 'hip-right', label: 'Cadera derecha', shape: 'rounded', x: 58, y: 100, w: 14, h: 10 },
  { id: 'hip-left', label: 'Cadera izquierda', shape: 'rounded', x: 42, y: 100, w: 14, h: 10 },
  { id: 'arm-right', label: 'Brazo derecho', shape: 'rounded', x: 80, y: 60, w: 12, h: 22 },
  { id: 'arm-left', label: 'Brazo izquierdo', shape: 'rounded', x: 20, y: 60, w: 12, h: 22 },
  { id: 'elbow-right', label: 'Codo derecho', shape: 'circle', x: 84, y: 86, w: 8, h: 8 },
  { id: 'elbow-left', label: 'Codo izquierdo', shape: 'circle', x: 16, y: 86, w: 8, h: 8 },
  { id: 'forearm-right', label: 'Antebrazo derecho', shape: 'rounded', x: 84, y: 100, w: 10, h: 16 },
  { id: 'forearm-left', label: 'Antebrazo izquierdo', shape: 'rounded', x: 16, y: 100, w: 10, h: 16 },
  { id: 'hand-right', label: 'Mano derecha', shape: 'rounded', x: 86, y: 120, w: 10, h: 8 },
  { id: 'hand-left', label: 'Mano izquierda', shape: 'rounded', x: 14, y: 120, w: 10, h: 8 },
  { id: 'leg-right', label: 'Pierna derecha', shape: 'rounded', x: 58, y: 132, w: 14, h: 28 },
  { id: 'leg-left', label: 'Pierna izquierda', shape: 'rounded', x: 42, y: 132, w: 14, h: 28 },
  { id: 'knee-right', label: 'Rodilla derecha', shape: 'circle', x: 58, y: 162, w: 12, h: 8 },
  { id: 'knee-left', label: 'Rodilla izquierda', shape: 'circle', x: 42, y: 162, w: 12, h: 8 },
  { id: 'calf-right', label: 'Pantorrilla derecha', shape: 'rounded', x: 58, y: 178, w: 12, h: 14 },
  { id: 'calf-left', label: 'Pantorrilla izquierda', shape: 'rounded', x: 42, y: 178, w: 12, h: 14 },
  { id: 'foot-right', label: 'Pie derecho', shape: 'rounded', x: 58, y: 194, w: 12, h: 6 },
  { id: 'foot-left', label: 'Pie izquierdo', shape: 'rounded', x: 42, y: 194, w: 12, h: 6 },
];

interface BodyMapProps {
  selectedAreas: string[];
  onAreaClick: (area: string) => void;
  viewMode?: BodyViewMode;
  height?: number;
}

const BodySilhouette: React.FC<{ mode: BodyViewMode }> = ({ mode }) => {
  const headD = 'M50,4 C58,4 64,10 64,18 C64,26 58,32 50,32 C42,32 36,26 36,18 C36,10 42,4 50,4 Z';
  const torsoD =
    mode === 'frontal'
      ? 'M30,38 L70,38 L74,52 L72,90 L66,108 L34,108 L28,90 L26,52 Z'
      : 'M30,38 L70,38 L74,52 L72,90 L66,108 L34,108 L28,90 L26,52 Z';
  const leftLeg = 'M34,108 L46,108 L50,160 L48,196 L40,196 L36,160 Z';
  const rightLeg = 'M54,108 L66,108 L62,160 L60,196 L52,196 L50,160 Z';
  const leftArm = 'M28,42 L20,60 L18,90 L22,118 L18,128 L14,128 L12,118 L14,90 L22,58 Z';
  const rightArm = 'M72,42 L80,60 L82,90 L78,118 L82,128 L86,128 L88,118 L86,90 L78,58 Z';
  const fill = '#dbeafe';
  const stroke = '#94a3b8';
  return (
    <>
      <Path d={headD} fill={fill} stroke={stroke} strokeWidth={0.5} />
      <Path d={torsoD} fill={fill} stroke={stroke} strokeWidth={0.5} />
      <Path d={leftArm} fill={fill} stroke={stroke} strokeWidth={0.5} />
      <Path d={rightArm} fill={fill} stroke={stroke} strokeWidth={0.5} />
      <Path d={leftLeg} fill={fill} stroke={stroke} strokeWidth={0.5} />
      <Path d={rightLeg} fill={fill} stroke={stroke} strokeWidth={0.5} />
    </>
  );
};

export const BodyMap: React.FC<BodyMapProps> = ({
  selectedAreas,
  onAreaClick,
  viewMode = 'frontal',
  height = 480,
}) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const areas = viewMode === 'posterior' ? bodyAreasPosterior : bodyAreasFrontal;

  const allLabels = useMemo(() => {
    const combined = [...bodyAreasFrontal, ...bodyAreasPosterior];
    const map = new Map<string, string>();
    combined.forEach((a) => map.set(a.id, a.label));
    return map;
  }, []);

  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.canvas, { height }]}
        onLayout={(e) => setContainerSize({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })}
      >
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <BodySilhouette mode={viewMode} />
          {areas.map((area) => {
            const isSelected = selectedAreas.includes(area.id);
            const fill = isSelected ? 'rgba(239,68,68,0.55)' : 'rgba(59,130,246,0.18)';
            const stroke = isSelected ? '#dc2626' : '#3b82f6';
            if (area.shape === 'circle') {
              return (
                <Ellipse
                  key={`svg-${area.id}`}
                  cx={area.x}
                  cy={area.y}
                  rx={area.w / 2}
                  ry={area.h / 2}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={0.6}
                />
              );
            }
            return (
              <Rect
                key={`svg-${area.id}`}
                x={area.x - area.w / 2}
                y={area.y - area.h / 2}
                width={area.w}
                height={area.h}
                rx={2}
                ry={2}
                fill={fill}
                stroke={stroke}
                strokeWidth={0.6}
              />
            );
          })}
        </Svg>
        {containerSize.width > 0 &&
          areas.map((area) => {
            const scaleX = containerSize.width / VIEW_W;
            const scaleY = containerSize.height / VIEW_H;
            const left = (area.x - area.w / 2) * scaleX;
            const top = (area.y - area.h / 2) * scaleY;
            const width = area.w * scaleX;
            const heightPx = area.h * scaleY;
            return (
              <Pressable
                key={`hit-${area.id}`}
                accessibilityLabel={area.label}
                onPress={() => onAreaClick(area.id)}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width: Math.max(width, 38),
                  height: Math.max(heightPx, 38),
                }}
              />
            );
          })}
      </View>

      {selectedAreas.length > 0 ? (
        <View style={styles.selectedBox}>
          <View style={styles.selectedHeader}>
            <View style={styles.dotRed} />
            <Text style={styles.selectedTitle}>Áreas con dolor seleccionadas:</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{selectedAreas.length}</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {selectedAreas.map((id) => (
              <View key={id} style={styles.chip}>
                <Text style={styles.chipText}>{allLabels.get(id) ?? id}</Text>
                <Pressable onPress={() => onAreaClick(id)} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color="#b91c1c" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}

      <Text style={styles.hint}>Toca las áreas del cuerpo donde sientes dolor</Text>
      <Text style={styles.hintSmall}>{areas.length} áreas anatómicas disponibles</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.background.white,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  canvas: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedBox: {
    marginTop: Spacing.base,
    backgroundColor: '#fff5f5',
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: 6,
  },
  dotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ef4444' },
  selectedTitle: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  countBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
  },
  countText: { color: '#b91c1c', fontWeight: '700', fontSize: 12 },
  chipsRow: { flexDirection: 'row', gap: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 6,
  },
  chipText: { color: '#991b1b', fontWeight: '600', fontSize: 12 },
  hint: {
    marginTop: Spacing.sm,
    textAlign: 'center',
    fontSize: 12,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
  hintSmall: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.text.light,
  },
});

export default BodyMap;
