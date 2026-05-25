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
import { SoftAlert } from '@/components/ui/SoftAlert';

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
      (tx) => tx.categoryId === budget.categoryId && tx.type === 'expense' && new Date(tx.date) >= start && new Date(tx.date) <= end
    );
    const spentAmt = matching.reduce((sum, tx) => sum + tx.amount, 0);
    return {
      spent: spentAmt,
      remaining: budget.amount - spentAmt,
      pct: budget.amount > 0 ? (spentAmt / budget.amount) * 100 : 0,
      daysLeft: 1,
      isOverBudget: spentAmt > budget.amount,
      matchingTransactions: matching,
    };
  }, [budget, transactions]);

  const handleDelete = async () => {
    if (!budget) return;
    try {
      await deleteBudget(budget.id);
      router.back();
    } catch (error) {
      SoftAlert.alert('Không thể xoá ngân sách', error instanceof Error ? error.message : 'Đã có lỗi xảy ra.');
    }
  };

  const confirmDelete = () => {
    SoftAlert.alert('Xoá ngân sách', 'Bạn có chắc muốn xoá ngân sách này?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: handleDelete },
    ]);
  };

  return (
    <View style={styles.root}>
      <SoftBackdrop />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={confirmDelete}>
          <Text style={{ color: Colors.expense }}>Xóa ngân sách</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SoftColors.pageBase },
  container: { flex: 1, paddingHorizontal: 18 },
});
