import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

const W = {
  bg: '#FFF8F0', card: '#FFFFFF', primary: '#E8652D', secondary: '#F5A623',
  accent: '#D4533B', text: '#3D2C2E', textLight: '#8B7272',
  highlight: '#FFF0E5', success: '#4CAF50',
};


const categories = [
  {icon: 'fast-food' as const, name: 'Food', amount: 850, color: '#FF6B6B', percent: 35,
    budget: 1000, transactions: 24, avgPerDay: 28, topSpend: 'Zomato – $120'},
  {icon: 'car' as const, name: 'Transport', amount: 420, color: '#FFA726', percent: 17,
    budget: 500, transactions: 18, avgPerDay: 14, topSpend: 'Uber – $85'},
  {icon: 'game-controller' as const, name: 'Entertainment', amount: 350, color: '#42A5F5', percent: 14,
    budget: 400, transactions: 10, avgPerDay: 12, topSpend: 'Netflix – $15'},
  {icon: 'cart' as const, name: 'Shopping', amount: 680, color: '#AB47BC', percent: 28,
    budget: 700, transactions: 15, avgPerDay: 23, topSpend: 'Amazon – $210'},
  {icon: 'medkit' as const, name: 'Health', amount: 150, color: '#66BB6A', percent: 6,
    budget: 300, transactions: 5, avgPerDay: 5, topSpend: 'Pharmacy – $60'},
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const ExpenseScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState(2);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const totalExpense = categories.reduce((sum, c) => sum + c.amount, 0);

  const toggleExpand = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(prev => (prev === i ? null : i));
  };

  return (
    <SafeAreaView style={st.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={st.header}>
          <Text style={st.title}>Expenses</Text>
          <TouchableOpacity style={st.filterBtn}>
            <Ionicons name="filter" size={20} color={W.text} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.monthRow}>
          {months.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={[st.monthChip, selectedMonth === i && st.monthChipActive]}
              onPress={() => setSelectedMonth(i)}>
              <Text style={[st.monthText, selectedMonth === i && st.monthTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={st.totalCard}>
          <Text style={st.totalLabel}>Total Spent</Text>
          <Text style={st.totalAmount}>${totalExpense.toLocaleString()}</Text>
          <View style={st.barContainer}>
            {categories.map((cat, i) => (
              <View key={i} style={[st.barSegment, {width: `${cat.percent}%`, backgroundColor: cat.color}]} />
            ))}
          </View>
        </View>

        <View style={st.section}>
          <Text style={st.sectionTitle}>Categories</Text>
          {categories.map((cat, i) => {
            const isExpanded = expandedIndex === i;
            const remaining = cat.budget - cat.amount;
            return (
              <View key={i} style={st.catWrapper}>
                <TouchableOpacity
                  style={[st.catItem, isExpanded && st.catItemExpanded]}
                  onPress={() => toggleExpand(i)}
                  activeOpacity={0.8}>
                  <View style={[st.catIcon, {backgroundColor: cat.color + '20'}]}>
                    <Ionicons name={cat.icon} size={22} color={cat.color} />
                  </View>
                  <View style={st.catDetails}>
                    <Text style={st.catName}>{cat.name}</Text>
                    <View style={st.progressBg}>
                      <View style={[st.progressFill, {width: `${cat.percent}%`, backgroundColor: cat.color}]} />
                    </View>
                  </View>
                  <View style={st.catRight}>
                    <Text style={st.catAmount}>${cat.amount}</Text>
                    <Text style={st.catPercent}>{cat.percent}%</Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={W.textLight}
                    style={st.chevron}
                  />
                </TouchableOpacity>
                {isExpanded && (
                  <View style={[st.expandedCard, {borderTopColor: cat.color + '40'}]}>
                    <View style={st.expandRow}>
                      <View style={st.expandStat}>
                        <Text style={st.expandStatLabel}>Budget</Text>
                        <Text style={[st.expandStatValue, {color: cat.color}]}>${cat.budget}</Text>
                      </View>
                      <View style={st.expandDivider} />
                      <View style={st.expandStat}>
                        <Text style={st.expandStatLabel}>Remaining</Text>
                        <Text style={[st.expandStatValue, {color: remaining >= 0 ? W.success : W.accent}]}>
                          {remaining >= 0 ? `$${remaining}` : `-$${Math.abs(remaining)}`}
                        </Text>
                      </View>
                      <View style={st.expandDivider} />
                      <View style={st.expandStat}>
                        <Text style={st.expandStatLabel}>Txns</Text>
                        <Text style={st.expandStatValue}>{cat.transactions}</Text>
                      </View>
                      <View style={st.expandDivider} />
                      <View style={st.expandStat}>
                        <Text style={st.expandStatLabel}>Avg/day</Text>
                        <Text style={st.expandStatValue}>${cat.avgPerDay}</Text>
                      </View>
                    </View>
                    <View style={st.expandTopRow}>
                      <Ionicons name="star" size={13} color={cat.color} />
                      <Text style={st.expandTopLabel}> Top spend: </Text>
                      <Text style={[st.expandTopValue, {color: cat.color}]}>{cat.topSpend}</Text>
                    </View>
                    <View style={st.budgetBarBg}>
                      <View style={[st.budgetBarFill, {width: `${Math.min((cat.amount / cat.budget) * 100, 100)}%`, backgroundColor: cat.color}]} />
                    </View>
                    <Text style={st.budgetBarHint}>{Math.round((cat.amount / cat.budget) * 100)}% of budget used</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={st.section}>
          <Text style={st.sectionTitle}>Recent Expenses</Text>
          {[
            {icon: 'cafe' as const, name: 'Starbucks', amount: '-$5.50', time: '2h ago'},
            {icon: 'bus' as const, name: 'Bus Ticket', amount: '-$2.00', time: '5h ago'},
            {icon: 'pizza' as const, name: 'Pizza Hut', amount: '-$18.00', time: 'Yesterday'},
          ].map((exp, i) => (
            <View key={i} style={st.expItem}>
              <View style={[st.expIcon, {backgroundColor: W.highlight}]}>
                <Ionicons name={exp.icon} size={20} color={W.primary} />
              </View>
              <View style={st.expDetails}>
                <Text style={st.expName}>{exp.name}</Text>
                <Text style={st.expTime}>{exp.time}</Text>
              </View>
              <Text style={st.expAmount}>{exp.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: W.bg},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15},
  title: {fontSize: 24, fontWeight: '700', color: W.text},
  filterBtn: {width: 40, height: 40, borderRadius: 20, backgroundColor: W.card, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.06, shadowRadius: 4},
  monthRow: {paddingHorizontal: 16, marginBottom: 20},
  monthChip: {paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: W.card, marginHorizontal: 4, elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 2},
  monthChipActive: {backgroundColor: W.primary},
  monthText: {fontSize: 14, fontWeight: '600', color: W.textLight},
  monthTextActive: {color: '#FFF'},
  totalCard: {marginHorizontal: 20, backgroundColor: W.card, borderRadius: 20, padding: 24, elevation: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.06, shadowRadius: 8},
  totalLabel: {fontSize: 14, color: W.textLight},
  totalAmount: {fontSize: 32, fontWeight: '800', color: W.text, marginTop: 4},
  barContainer: {flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 16, gap: 2},
  barSegment: {height: '100%', borderRadius: 4},
  section: {marginTop: 24, paddingHorizontal: 20, paddingBottom: 20},
  sectionTitle: {fontSize: 18, fontWeight: '700', color: W.text, marginBottom: 16},
  catWrapper: {marginBottom: 10},
  catItem: {flexDirection: 'row', alignItems: 'center', backgroundColor: W.card, borderRadius: 14, padding: 14, elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 4},
  catItemExpanded: {borderBottomLeftRadius: 0, borderBottomRightRadius: 0},
  chevron: {marginLeft: 8},
  expandedCard: {backgroundColor: W.card, borderTopWidth: 1, borderBottomLeftRadius: 14, borderBottomRightRadius: 14, paddingHorizontal: 14, paddingBottom: 14, paddingTop: 12, elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 4},
  expandRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12},
  expandStat: {flex: 1, alignItems: 'center'},
  expandStatLabel: {fontSize: 11, color: W.textLight, marginBottom: 3},
  expandStatValue: {fontSize: 15, fontWeight: '700', color: W.text},
  expandDivider: {width: 1, height: 32, backgroundColor: '#F0E6DE'},
  expandTopRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  expandTopLabel: {fontSize: 12, color: W.textLight},
  expandTopValue: {fontSize: 12, fontWeight: '600'},
  budgetBarBg: {height: 6, backgroundColor: '#F0E6DE', borderRadius: 3, overflow: 'hidden', marginBottom: 4},
  budgetBarFill: {height: '100%', borderRadius: 3},
  budgetBarHint: {fontSize: 11, color: W.textLight, textAlign: 'right'},
  catIcon: {width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center'},
  catDetails: {flex: 1, marginLeft: 12},
  catName: {fontSize: 15, fontWeight: '600', color: W.text, marginBottom: 6},
  progressBg: {height: 6, backgroundColor: '#F0E6DE', borderRadius: 3, overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: 3},
  catRight: {alignItems: 'flex-end', marginLeft: 12},
  catAmount: {fontSize: 15, fontWeight: '700', color: W.text},
  catPercent: {fontSize: 12, color: W.textLight, marginTop: 2},
  expItem: {flexDirection: 'row', alignItems: 'center', backgroundColor: W.card, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 4},
  expIcon: {width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center'},
  expDetails: {flex: 1, marginLeft: 12},
  expName: {fontSize: 15, fontWeight: '600', color: W.text},
  expTime: {fontSize: 12, color: W.textLight, marginTop: 2},
  expAmount: {fontSize: 15, fontWeight: '700', color: W.accent},
});

export default ExpenseScreen;
