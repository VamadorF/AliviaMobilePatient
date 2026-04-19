import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import httpClient from '@/shared/services/http/apiClient';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import type { MedicationCatalogItem } from '@/shared/types/domain';

interface MedicationSearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
  onSelect: (item: MedicationCatalogItem) => void;
  placeholder?: string;
  label?: string;
}

export const MedicationSearchInput: React.FC<MedicationSearchInputProps> = ({
  value,
  onChangeText,
  onSelect,
  placeholder = 'Buscar por nombre o sustancia',
  label = 'Nombre',
}) => {
  const [results, setResults] = useState<MedicationCatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value || value.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const id = ++requestId.current;
      try {
        const res = await httpClient.get(
          `/medications/search?q=${encodeURIComponent(value.trim())}`,
        );
        if (id !== requestId.current) return;
        setResults((res.data as MedicationCatalogItem[]) ?? []);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  const handlePick = (item: MedicationCatalogItem) => {
    onSelect(item);
    setOpen(false);
    setResults([]);
  };

  const showDropdown = open && (loading || results.length > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Ionicons name="search" size={18} color={Colors.text.muted} style={styles.icon} />
        <TextInput
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.light}
          style={styles.input}
        />
        {loading ? (
          <ActivityIndicator size="small" color={Colors.medical.blue} style={styles.spinner} />
        ) : null}
      </View>

      {showDropdown ? (
        <View style={styles.dropdown}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
            style={{ maxHeight: 240 }}
          >
            {results.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handlePick(item)}
                style={({ pressed }) => [
                  styles.itemRow,
                  pressed && { backgroundColor: '#f1f5f9' },
                ]}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>
                  {item.substance} · {item.standardDose}
                </Text>
                <Text style={styles.itemUse}>{item.clinicalUse}</Text>
              </Pressable>
            ))}
            {!loading && results.length === 0 ? (
              <Text style={styles.emptyText}>
                Sin coincidencias. Puedes seguir escribiendo libremente.
              </Text>
            ) : null}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative', marginBottom: Spacing.sm, zIndex: 999 },
  label: {
    ...Typography.styles.label,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border.light,
    borderRadius: Radius.lg,
    backgroundColor: Colors.background.white,
    paddingHorizontal: Spacing.sm,
  },
  icon: { marginRight: 6 },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: Colors.text.primary,
    fontSize: 15,
  },
  spinner: { marginLeft: 6 },
  dropdown: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.white,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: Radius.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 999,
  },
  itemRow: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  itemName: { ...Typography.styles.label, color: Colors.text.primary },
  itemSub: { color: Colors.text.muted, fontSize: 12, marginTop: 1 },
  itemUse: { color: Colors.text.secondary, fontSize: 11, marginTop: 2 },
  emptyText: {
    padding: Spacing.sm,
    color: Colors.text.muted,
    fontStyle: 'italic',
    fontSize: 12,
  },
});

export default MedicationSearchInput;
