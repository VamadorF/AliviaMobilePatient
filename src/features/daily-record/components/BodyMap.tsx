import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Ellipse, Line, Path, Rect } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import { AppImages } from '@/shared/assets/images';

const SILHOUETTE_FILL = Colors.background.surfaceElevated;
const SILHOUETTE_STROKE = Colors.border.strong;
const FEATURE_DETAIL = Colors.text.muted;
const HOT_PRIMARY = Colors.status.error;
const HOT_SECOND = `${Colors.primary.base}55`;
const HOT_STROKE_SEL = Colors.status.error;
const HOT_STROKE_DEF = Colors.primary.base;

export type BodyViewMode = 'frontal' | 'posterior';

interface BodyArea {
  id: string;
  label: string;
  shape: 'circle' | 'rounded';
  view: BodyViewMode | 'both';
  x: number;
  y: number;
  w: number;
  h: number;
}

const VIEW_W = 100;
const VIEW_H = 200;

const BODY_AREAS: BodyArea[] = [
  // ===== Cabeza / cuello =====
  { id: 'forehead', label: 'Frente', shape: 'rounded', view: 'frontal', x: 50, y: 10, w: 18, h: 6 },
  { id: 'face', label: 'Rostro', shape: 'rounded', view: 'frontal', x: 50, y: 18, w: 18, h: 8 },
  { id: 'jaw', label: 'Mandíbula', shape: 'rounded', view: 'frontal', x: 50, y: 26, w: 14, h: 6 },
  { id: 'neck-front', label: 'Cuello (frente)', shape: 'rounded', view: 'frontal', x: 50, y: 33, w: 14, h: 6 },
  { id: 'occiput', label: 'Occipital', shape: 'rounded', view: 'posterior', x: 50, y: 14, w: 18, h: 10 },
  { id: 'neck-back', label: 'Nuca', shape: 'rounded', view: 'posterior', x: 50, y: 28, w: 16, h: 6 },

  // ===== Hombros / trapecios =====
  { id: 'shoulder-right', label: 'Hombro derecho', shape: 'rounded', view: 'frontal', x: 70, y: 40, w: 12, h: 8 },
  { id: 'shoulder-left', label: 'Hombro izquierdo', shape: 'rounded', view: 'frontal', x: 30, y: 40, w: 12, h: 8 },
  { id: 'trapezius-right', label: 'Trapecio derecho', shape: 'rounded', view: 'posterior', x: 60, y: 38, w: 14, h: 8 },
  { id: 'trapezius-left', label: 'Trapecio izquierdo', shape: 'rounded', view: 'posterior', x: 40, y: 38, w: 14, h: 8 },
  { id: 'shoulder-back-right', label: 'Hombro posterior derecho', shape: 'rounded', view: 'posterior', x: 72, y: 44, w: 12, h: 8 },
  { id: 'shoulder-back-left', label: 'Hombro posterior izquierdo', shape: 'rounded', view: 'posterior', x: 28, y: 44, w: 12, h: 8 },

  // ===== Tronco frontal =====
  { id: 'chest-right', label: 'Pecho derecho', shape: 'rounded', view: 'frontal', x: 58, y: 52, w: 14, h: 12 },
  { id: 'chest-left', label: 'Pecho izquierdo', shape: 'rounded', view: 'frontal', x: 42, y: 52, w: 14, h: 12 },
  { id: 'abdomen-upper', label: 'Abdomen superior', shape: 'rounded', view: 'frontal', x: 50, y: 70, w: 26, h: 10 },
  { id: 'abdomen-lower', label: 'Abdomen inferior', shape: 'rounded', view: 'frontal', x: 50, y: 84, w: 26, h: 10 },

  // ===== Tronco posterior =====
  { id: 'upper-back', label: 'Espalda alta', shape: 'rounded', view: 'posterior', x: 50, y: 56, w: 30, h: 12 },
  { id: 'mid-back', label: 'Espalda media', shape: 'rounded', view: 'posterior', x: 50, y: 72, w: 28, h: 10 },
  { id: 'lumbar', label: 'Lumbar', shape: 'rounded', view: 'posterior', x: 50, y: 86, w: 26, h: 10 },

  // ===== Caderas / glúteos / ingle =====
  { id: 'hip-right', label: 'Cadera derecha', shape: 'rounded', view: 'frontal', x: 62, y: 100, w: 12, h: 8 },
  { id: 'hip-left', label: 'Cadera izquierda', shape: 'rounded', view: 'frontal', x: 38, y: 100, w: 12, h: 8 },
  { id: 'groin-right', label: 'Ingle derecha', shape: 'circle', view: 'frontal', x: 56, y: 108, w: 8, h: 6 },
  { id: 'groin-left', label: 'Ingle izquierda', shape: 'circle', view: 'frontal', x: 44, y: 108, w: 8, h: 6 },
  { id: 'glute-right', label: 'Glúteo derecho', shape: 'rounded', view: 'posterior', x: 60, y: 102, w: 14, h: 12 },
  { id: 'glute-left', label: 'Glúteo izquierdo', shape: 'rounded', view: 'posterior', x: 40, y: 102, w: 14, h: 12 },

  // ===== Brazos =====
  { id: 'arm-right', label: 'Brazo derecho', shape: 'rounded', view: 'both', x: 80, y: 60, w: 10, h: 18 },
  { id: 'arm-left', label: 'Brazo izquierdo', shape: 'rounded', view: 'both', x: 20, y: 60, w: 10, h: 18 },
  { id: 'elbow-right', label: 'Codo derecho', shape: 'circle', view: 'both', x: 84, y: 82, w: 7, h: 6 },
  { id: 'elbow-left', label: 'Codo izquierdo', shape: 'circle', view: 'both', x: 16, y: 82, w: 7, h: 6 },
  { id: 'forearm-right', label: 'Antebrazo derecho', shape: 'rounded', view: 'both', x: 84, y: 94, w: 9, h: 14 },
  { id: 'forearm-left', label: 'Antebrazo izquierdo', shape: 'rounded', view: 'both', x: 16, y: 94, w: 9, h: 14 },
  { id: 'wrist-right', label: 'Muñeca derecha', shape: 'circle', view: 'both', x: 86, y: 110, w: 6, h: 5 },
  { id: 'wrist-left', label: 'Muñeca izquierda', shape: 'circle', view: 'both', x: 14, y: 110, w: 6, h: 5 },
  { id: 'hand-right', label: 'Mano derecha', shape: 'rounded', view: 'both', x: 87, y: 118, w: 8, h: 7 },
  { id: 'hand-left', label: 'Mano izquierda', shape: 'rounded', view: 'both', x: 13, y: 118, w: 8, h: 7 },
  { id: 'fingers-right', label: 'Dedos mano derecha', shape: 'rounded', view: 'both', x: 89, y: 126, w: 7, h: 5 },
  { id: 'fingers-left', label: 'Dedos mano izquierda', shape: 'rounded', view: 'both', x: 11, y: 126, w: 7, h: 5 },

  // ===== Piernas =====
  { id: 'thigh-right', label: 'Muslo derecho', shape: 'rounded', view: 'frontal', x: 58, y: 124, w: 12, h: 22 },
  { id: 'thigh-left', label: 'Muslo izquierdo', shape: 'rounded', view: 'frontal', x: 42, y: 124, w: 12, h: 22 },
  { id: 'hamstring-right', label: 'Isquiotibial derecho', shape: 'rounded', view: 'posterior', x: 58, y: 124, w: 12, h: 22 },
  { id: 'hamstring-left', label: 'Isquiotibial izquierdo', shape: 'rounded', view: 'posterior', x: 42, y: 124, w: 12, h: 22 },
  { id: 'knee-right', label: 'Rodilla derecha', shape: 'circle', view: 'frontal', x: 58, y: 152, w: 10, h: 7 },
  { id: 'knee-left', label: 'Rodilla izquierda', shape: 'circle', view: 'frontal', x: 42, y: 152, w: 10, h: 7 },
  { id: 'knee-back-right', label: 'Hueco poplíteo derecho', shape: 'circle', view: 'posterior', x: 58, y: 152, w: 10, h: 7 },
  { id: 'knee-back-left', label: 'Hueco poplíteo izquierdo', shape: 'circle', view: 'posterior', x: 42, y: 152, w: 10, h: 7 },
  { id: 'shin-right', label: 'Espinilla derecha', shape: 'rounded', view: 'frontal', x: 58, y: 170, w: 10, h: 18 },
  { id: 'shin-left', label: 'Espinilla izquierda', shape: 'rounded', view: 'frontal', x: 42, y: 170, w: 10, h: 18 },
  { id: 'calf-right', label: 'Pantorrilla derecha', shape: 'rounded', view: 'posterior', x: 58, y: 170, w: 10, h: 18 },
  { id: 'calf-left', label: 'Pantorrilla izquierda', shape: 'rounded', view: 'posterior', x: 42, y: 170, w: 10, h: 18 },

  // ===== Pies =====
  { id: 'foot-right', label: 'Pie derecho (dorso)', shape: 'rounded', view: 'frontal', x: 58, y: 192, w: 12, h: 6 },
  { id: 'foot-left', label: 'Pie izquierdo (dorso)', shape: 'rounded', view: 'frontal', x: 42, y: 192, w: 12, h: 6 },
  { id: 'heel-right', label: 'Talón derecho', shape: 'circle', view: 'posterior', x: 58, y: 190, w: 8, h: 6 },
  { id: 'heel-left', label: 'Talón izquierdo', shape: 'circle', view: 'posterior', x: 42, y: 190, w: 8, h: 6 },
  { id: 'sole-right', label: 'Planta derecha', shape: 'rounded', view: 'posterior', x: 58, y: 196, w: 12, h: 4 },
  { id: 'sole-left', label: 'Planta izquierda', shape: 'rounded', view: 'posterior', x: 42, y: 196, w: 12, h: 4 },
];

const labelMap: Map<string, string> = new Map(BODY_AREAS.map((a) => [a.id, a.label]));

interface BodyMapProps {
  primaryArea: string;
  secondaryAreas: string[];
  onAreaClick: (area: string) => void;
  viewMode?: BodyViewMode;
  height?: number;
  /** Muestra la ilustración anatómica bajo las zonas táctiles (assets/images/body). */
  showBodyPhoto?: boolean;
}

const BodySilhouette: React.FC<{ mode: BodyViewMode; outlineOnly?: boolean }> = ({
  mode,
  outlineOnly,
}) => {
  const fill = outlineOnly ? 'transparent' : SILHOUETTE_FILL;
  const stroke = SILHOUETTE_STROKE;
  const strokeW = outlineOnly ? 0.9 : 0.6;

  const headD = 'M50,4 C58,4 64,10 64,18 C64,26 58,32 50,32 C42,32 36,26 36,18 C36,10 42,4 50,4 Z';
  const neckD = 'M44,30 L56,30 L56,38 L44,38 Z';
  const torsoD =
    mode === 'frontal'
      ? 'M30,38 C28,42 26,50 26,58 L28,90 L32,108 L40,112 L60,112 L68,108 L72,90 L74,58 C74,50 72,42 70,38 Z'
      : 'M30,38 C28,42 26,50 26,58 L28,90 L32,108 L40,114 L60,114 L68,108 L72,90 L74,58 C74,50 72,42 70,38 Z';
  const leftArm = 'M28,40 C22,46 18,58 16,72 L14,92 L13,112 L12,128 L18,130 L20,128 L22,112 L24,92 L28,72 L32,56 Z';
  const rightArm = 'M72,40 C78,46 82,58 84,72 L86,92 L87,112 L88,128 L82,130 L80,128 L78,112 L76,92 L72,72 L68,56 Z';
  const leftLeg = 'M40,112 C38,118 36,130 36,144 L38,168 L40,188 L42,200 L52,200 L52,188 L52,168 L52,144 C52,130 50,118 48,112 Z';
  const rightLeg = 'M52,112 C52,118 50,130 50,144 L48,168 L48,188 L48,200 L58,200 L60,188 L62,168 L64,144 C64,130 62,118 60,112 Z';

  return (
    <>
      <Path d={headD} fill={fill} stroke={stroke} strokeWidth={strokeW} />
      <Path d={neckD} fill={fill} stroke={stroke} strokeWidth={strokeW} />
      <Path d={torsoD} fill={fill} stroke={stroke} strokeWidth={strokeW} />
      <Path d={leftArm} fill={fill} stroke={stroke} strokeWidth={strokeW} />
      <Path d={rightArm} fill={fill} stroke={stroke} strokeWidth={strokeW} />
      <Path d={leftLeg} fill={fill} stroke={stroke} strokeWidth={strokeW} />
      <Path d={rightLeg} fill={fill} stroke={stroke} strokeWidth={strokeW} />
      {mode === 'frontal' ? (
        <>
          <Ellipse cx={44} cy={16} rx={2} ry={1.2} fill={FEATURE_DETAIL} />
          <Ellipse cx={56} cy={16} rx={2} ry={1.2} fill={FEATURE_DETAIL} />
          <Path d="M46,24 Q50,26 54,24" stroke={FEATURE_DETAIL} strokeWidth={0.6} fill="none" />
        </>
      ) : (
        <>
          <Line x1={50} y1={40} x2={50} y2={108} stroke={FEATURE_DETAIL} strokeWidth={0.5} strokeDasharray="2,2" />
          <Line x1={36} y1={104} x2={64} y2={104} stroke={FEATURE_DETAIL} strokeWidth={0.4} strokeDasharray="1.5,2" />
        </>
      )}
    </>
  );
};

interface PulseLayer {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

const PulseOverlay: React.FC<{ layer: PulseLayer | null }> = ({ layer }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!layer) return;
    scale.value = 0.6;
    opacity.value = 0.7;
    scale.value = withSequence(
      withTiming(1.25, { duration: 180 }),
      withTiming(1, { duration: 220 }),
    );
    opacity.value = withSequence(
      withTiming(0.85, { duration: 180 }),
      withTiming(0, { duration: 600 }),
    );
  }, [layer, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!layer) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.pulse,
        {
          left: layer.left,
          top: layer.top,
          width: layer.width,
          height: layer.height,
        },
        animatedStyle,
      ]}
    />
  );
};

export const BodyMap: React.FC<BodyMapProps> = ({
  primaryArea,
  secondaryAreas,
  onAreaClick,
  viewMode = 'frontal',
  height = 480,
  showBodyPhoto = true,
}) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [pulse, setPulse] = useState<PulseLayer | null>(null);
  const [tooltip, setTooltip] = useState<{ id: string; x: number; y: number } | null>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleAreas = useMemo(
    () => BODY_AREAS.filter((a) => a.view === viewMode || a.view === 'both'),
    [viewMode],
  );

  const { renderW, renderH, offsetX, offsetY } = useMemo(() => {
    if (!containerSize.width || !containerSize.height) {
      return { renderW: 0, renderH: 0, offsetX: 0, offsetY: 0 };
    }
    const svgAspect = VIEW_W / VIEW_H;
    const containerAspect = containerSize.width / containerSize.height;
    let rW: number;
    let rH: number;
    let oX: number;
    let oY: number;
    if (containerAspect > svgAspect) {
      rH = containerSize.height;
      rW = rH * svgAspect;
      oX = (containerSize.width - rW) / 2;
      oY = 0;
    } else {
      rW = containerSize.width;
      rH = rW / svgAspect;
      oX = 0;
      oY = (containerSize.height - rH) / 2;
    }
    return { renderW: rW, renderH: rH, offsetX: oX, offsetY: oY };
  }, [containerSize]);

  useEffect(() => {
    return () => {
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    };
  }, []);

  const handlePress = (area: BodyArea, left: number, top: number, width: number, heightPx: number) => {
    setPulse({ id: `${area.id}-${Date.now()}`, left, top, width, height: heightPx });
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setTooltip({ id: area.id, x: left + width / 2, y: top });
    tooltipTimer.current = setTimeout(() => setTooltip(null), 1500);
    onAreaClick(area.id);
  };

  const isSelected = (id: string) => primaryArea === id || secondaryAreas.includes(id);
  const isPrimary = (id: string) => primaryArea === id;

  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.canvas, { height }]}
        onLayout={(e) =>
          setContainerSize({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          })
        }
      >
        {showBodyPhoto ? (
          <Image
            accessibilityIgnoresInvertColors
            source={
              viewMode === 'frontal' ? AppImages.bodyFrontal : AppImages.bodyPosterior
            }
            style={styles.bodyPhoto}
            resizeMode="contain"
          />
        ) : null}
        <Svg
          style={{ zIndex: 1 }}
          width="100%"
          height="100%"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <BodySilhouette mode={viewMode} outlineOnly={showBodyPhoto} />
          {visibleAreas.map((area) => {
            const selected = isSelected(area.id);
            const primary = isPrimary(area.id);
            const fill = primary
              ? HOT_PRIMARY
              : selected
                ? HOT_SECOND
                : `${Colors.primary.base}28`;
            const stroke = selected ? HOT_STROKE_SEL : HOT_STROKE_DEF;
            const strokeW = primary ? 0.9 : 0.6;
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
                  strokeWidth={strokeW}
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
                strokeWidth={strokeW}
              />
            );
          })}
        </Svg>

        {renderW > 0 &&
          visibleAreas.map((area) => {
            const scaleX = renderW / VIEW_W;
            const scaleY = renderH / VIEW_H;
            const left = offsetX + (area.x - area.w / 2) * scaleX;
            const top = offsetY + (area.y - area.h / 2) * scaleY;
            const width = Math.max(area.w * scaleX, 32);
            const heightPx = Math.max(area.h * scaleY, 32);
            return (
              <Pressable
                key={`hit-${area.id}`}
                accessibilityLabel={area.label}
                accessibilityRole="button"
                onPress={() => handlePress(area, left, top, width, heightPx)}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width,
                  height: heightPx,
                }}
              />
            );
          })}

        <PulseOverlay layer={pulse} />

        {tooltip ? (
          <View
            pointerEvents="none"
            style={[
              styles.tooltip,
              {
                left: Math.max(8, Math.min(tooltip.x - 70, containerSize.width - 148)),
                top: Math.max(8, tooltip.y - 32),
              },
            ]}
          >
            <Text style={styles.tooltipText}>{labelMap.get(tooltip.id) ?? tooltip.id}</Text>
          </View>
        ) : null}
      </View>

      {(primaryArea || secondaryAreas.length > 0) && (
        <View style={styles.selectedBox}>
          <View style={styles.selectedHeader}>
            <View style={styles.dotRed} />
            <Text style={styles.selectedTitle}>Áreas con dolor seleccionadas:</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {(primaryArea ? 1 : 0) + secondaryAreas.length}
              </Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {primaryArea ? (
              <View style={[styles.chip, styles.chipPrimary]}>
                <Text style={styles.badgeMain}>Principal</Text>
                <Text style={styles.chipTextPrimary}>{labelMap.get(primaryArea) ?? primaryArea}</Text>
                <Pressable onPress={() => onAreaClick(primaryArea)} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={Colors.text.onAccent} />
                </Pressable>
              </View>
            ) : null}
            {secondaryAreas.map((id) => (
              <View key={id} style={styles.chip}>
                <Text style={styles.badgeAlso}>También</Text>
                <Text style={styles.chipText}>{labelMap.get(id) ?? id}</Text>
                <Pressable onPress={() => onAreaClick(id)} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={Colors.status.error} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <Text style={styles.hint}>Toca las áreas del cuerpo donde sientes dolor</Text>
      <Text style={styles.hintSmall}>{visibleAreas.length} zonas anatómicas en esta vista</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.background.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  canvas: {
    width: '100%',
    backgroundColor: Colors.background.base,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  bodyPhoto: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.72,
    zIndex: 0,
  },
  pulse: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 100, 121, 0.45)',
    borderWidth: 2,
    borderColor: Colors.status.error,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(15,23,42,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    maxWidth: 140,
  },
  tooltipText: {
    color: Colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedBox: {
    marginTop: Spacing.base,
    backgroundColor: 'rgba(255, 100, 121, 0.1)',
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.strong,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: 6,
  },
  dotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.status.error },
  selectedTitle: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 100, 121, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
  },
  countText: { color: Colors.status.error, fontWeight: '700', fontSize: 12 },
  chipsRow: { flexDirection: 'row', gap: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.background.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 6,
  },
  chipPrimary: {
    backgroundColor: Colors.status.error,
  },
  chipText: { color: Colors.text.secondary, fontWeight: '600', fontSize: 12 },
  chipTextPrimary: { color: Colors.text.onAccent, fontWeight: '700', fontSize: 12 },
  badgeMain: {
    backgroundColor: Colors.background.surfaceElevated,
    color: Colors.status.error,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: '800',
    overflow: 'hidden',
  },
  badgeAlso: {
    backgroundColor: Colors.primary.soft,
    color: Colors.primary.deep,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: '700',
    overflow: 'hidden',
  },
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
