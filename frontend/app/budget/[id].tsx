import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, SoftColors, shadow } from '@/constants/design';
import { SoftCard, SoftBackdrop } from '@/components/ui/soft';

export default function BudgetDetailScreen() {
  return (
    <View style={styles.root}>
      <SoftBackdrop />
      <SafeAreaView style={styles.container}>
        <Text style={{ color: SoftColors.text }}>Khởi tạo chi tiết ngân sách</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SoftColors.pageBase },
  container: { flex: 1, paddingHorizontal: 18 },
});
