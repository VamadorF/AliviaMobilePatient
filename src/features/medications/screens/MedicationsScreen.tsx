import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Input, OptionPill, Screen } from '@/shared/components';
import { MedicationSearchInput } from '@/features/medications/components/MedicationSearchInput';
import { MedicationWheel } from '@/features/daily-record/components/MedicationWheel';
import { useMedicationsStore } from '@/features/medications/store/medications.store';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import type { MedicationCatalogItem, MedicationType } from '@/shared/types/domain';

const types: { id: MedicationType; label: string }[] = [
  { id: 'analgesic', label: 'Analgésico' },
  { id: 'antiinflammatory', label: 'Antiinflamatorio' },
  { id: 'muscle-relaxant', label: 'Relajante Muscular' },
  { id: 'other', label: 'Otro' },
];

export const MedicationsScreen: React.FC = () => {
  const meds = useMedicationsStore((s) => s.medications);
  const hydrate = useMedicationsStore((s) => s.hydrate);
  const add = useMedicationsStore((s) => s.add);
  const remove = useMedicationsStore((s) => s.remove);
  const take = useMedicationsStore((s) => s.take);
  const hydrated = useMedicationsStore((s) => s.hydrated);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [substance, setSubstance] = useState('');
  const [clinicalUse, setClinicalUse] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState('8');
  const [type, setType] = useState<MedicationType>('analgesic');

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrate, hydrated]);

  const resetForm = () => {
    setName('');
    setSubstance('');
    setClinicalUse('');
    setDose('');
    setFrequency('8');
    setType('analgesic');
  };

  const handlePickCatalog = (item: MedicationCatalogItem) => {
    setName(item.name);
    setSubstance(item.substance);
    setClinicalUse(item.clinicalUse);
    setDose(item.standardDose);
    setFrequency(String(item.defaultFrequency));
    setType(item.type);
  };

  const handleAdd = async () => {
    if (!name.trim() || !dose.trim()) return;
    await add({
      name: name.trim(),
      dose: dose.trim(),
      type,
      frequency: parseInt(frequency || '8', 10),
      substance: substance.trim() || undefined,
      clinicalUse: clinicalUse.trim() || undefined,
      takenHistory: [],
    });
    resetForm();
    setOpen(false);
  };

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Mis Medicamentos</Text>
          <Text style={styles.subtitle}>{meds.length} registrados</Text>
        </View>
        <Pressable onPress={() => setOpen(true)} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.text.white} />
        </Pressable>
      </View>

      <MedicationWheel medications={meds} onRemove={remove} onTake={take} />

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>Nuevo medicamento</Text>

              <MedicationSearchInput
                value={name}
                onChangeText={setName}
                onSelect={handlePickCatalog}
                placeholder="Ej. Paracetamol o Ibuprofeno"
              />

              <Input
                label="Sustancia activa (opcional)"
                value={substance}
                onChangeText={setSubstance}
                placeholder="Ej. Paracetamol"
              />
              <Input
                label="Uso clínico (opcional)"
                value={clinicalUse}
                onChangeText={setClinicalUse}
                placeholder="Ej. Analgésico no opioide"
              />
              <Input label="Dosis" value={dose} onChangeText={setDose} placeholder="Ej. 500 mg" />
              <Input
                label="Cada cuántas horas"
                value={frequency}
                onChangeText={setFrequency}
                keyboardType="number-pad"
                placeholder="8"
              />

              <Text style={styles.label}>Tipo</Text>
              <View style={styles.typesRow}>
                {types.map((t) => (
                  <OptionPill
                    key={t.id}
                    label={t.label}
                    selected={type === t.id}
                    onPress={() => setType(t.id)}
                  />
                ))}
              </View>

              <View style={styles.modalActions}>
                <View style={{ flex: 1 }}>
                  <Button
                    label="Cancelar"
                    variant="outline"
                    onPress={() => {
                      resetForm();
                      setOpen(false);
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button label="Guardar" onPress={handleAdd} />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {meds.length === 0 ? (
        <Card style={{ marginTop: Spacing.base }}>
          <Text style={styles.tip}>
            Agrega tus medicamentos para llevar un control de las próximas dosis y registrar el
            alivio durante tu registro diario.
          </Text>
        </Card>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  title: { ...Typography.styles.h2, color: Colors.text.primary },
  subtitle: { color: Colors.text.muted },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.medical.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.background.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.background.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    maxHeight: '90%',
  },
  modalTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.base,
  },
  label: {
    ...Typography.styles.label,
    color: Colors.text.primary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  typesRow: { flexDirection: 'row', flexWrap: 'wrap' },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.base,
  },
  tip: { color: Colors.text.muted, fontStyle: 'italic' },
});

export default MedicationsScreen;
