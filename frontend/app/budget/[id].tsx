import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/app-store';
import { useMutations } from '@/hooks/useMutations';
import { Colors, SoftColors, shadow } from '@/constants/design';
import { SoftCard, SoftBackdrop } from '@/components/ui/soft';
import { getCategoryIconName } from '@/utils/iconography';

export default function BudgetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { budgets, transactions, wallets, getCategoryById } = useStore();
  const { deleteBudget } = useMutations();

  const budget = budgets.find((b) => b.id === id);
  const category = getCategoryById(budget?.categoryId || '');
  const iconName = getCategoryIconName(category?.id);

  return (
    <View style={styles.root}>
      <SoftBackdrop />
      <SafeAreaView style={styles.container}>
        <Text style={{ color: SoftColors.text }}>Đang tải dữ liệu của: {category?.name}</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SoftColors.pageBase },
  container: { flex: 1, paddingHorizontal: 18 },
});
