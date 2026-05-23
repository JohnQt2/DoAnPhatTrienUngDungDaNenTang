import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/app-store';
import { useMutations } from '@/hooks/useMutations';
import { Colors, SoftColors, shadow } from '@/constants/design';
import { SoftCard, SoftBackdrop } from '@/components/ui/soft';
import { formatCurrency, formatDate } from '@/utils';
import { getCategoryIconName } from '@/utils/iconography';

export default function BudgetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { budgets, transactions, wallets, getCategoryById } = useStore();
  const { deleteBudget } = useMutations();

  const budget = budgets.find((b) => b.id === id);
  const category = getCategoryById(budget?.categoryId || '');
  const iconName = getCategoryIconName(category?.id);

  const { spent, remaining, pct, daysLeft, isOverBudget, matchingTransactions } = useMemo(() => {
    if (!budget) {
      return { spent: 0, remaining: 0, pct: 0, daysLeft: 0, isOverBudget: false, matchingTransactions: [] };
    }

    const start = new Date(budget.startDate);
    const end = new Date(budget.endDate);

    const matching = transactions.filter(
      (tx) =>
        tx.categoryId === budget.categoryId &&
        tx.type === 'expense' &&
        new Date(tx.date) >= start &&
        new Date(tx.date) <= end
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const spentAmt = matching.reduce((sum, tx) => sum + tx.amount, 0);
    const remainingAmt = budget.amount - spentAmt;
    const pctVal = budget.amount > 0 ? (spentAmt / budget.amount) * 100 : 0;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const diffTime = endDateOnly.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      spent: spentAmt,
      remaining: remainingAmt,
      pct: pctVal,
      daysLeft: diffDays < 0 ? -1 : diffDays,
      isOverBudget: spentAmt > budget.amount,
      matchingTransactions: matching,
    };
  }, [budget, transactions]);

  const barColor = isOverBudget ? Colors.expense : pct > 80 ? Colors.warning : SoftColors.primary;

  return (
    <View style={styles.root}>
      <SoftBackdrop />
      <SafeAreaView style={styles.container}>
        <Text style={{ color: SoftColors.text }}>Tiến độ chi tiêu: {Math.round(pct)}%</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SoftColors.pageBase },
  container: { flex: 1, paddingHorizontal: 18 },
});
