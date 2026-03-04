import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import ChatBot from '../components/chatBot/chatBot';
import ChatAgentService from '../components/chatBot/chatAgentSvc';

// ─── Shared ─────────────────────────────────────────────────────────────────

const W = {
  bg: '#FFF8F0', card: '#FFFFFF', primary: '#E8652D', secondary: '#F5A623',
  accent: '#D4533B', text: '#3D2C2E', textLight: '#8B7272',
  highlight: '#FFF0E5', success: '#4CAF50',
};


// ─── HomeScreen Styles ───────────────────────────────────────────────────────
const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: W.bg},
  scrollContent: {paddingBottom: 100},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15},
  greeting: {fontSize: 14, color: W.textLight},
  userName: {fontSize: 22, fontWeight: '700', color: W.text, marginTop: 2},
  notifBtn: {width: 44, height: 44, borderRadius: 22, backgroundColor: W.card, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.08, shadowRadius: 8},
  balanceCard: {marginHorizontal: 20, backgroundColor: W.primary, borderRadius: 20, padding: 24, elevation: 8, shadowColor: W.primary, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.3, shadowRadius: 16},
  balanceLabel: {fontSize: 14, color: 'rgba(255,255,255,0.8)'},
  balanceAmount: {fontSize: 34, fontWeight: '800', color: '#FFF', marginTop: 6},
  balanceRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 20},
  stat: {flexDirection: 'row', alignItems: 'center', gap: 8},
  statIcon: {width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center'},
  statLabel: {fontSize: 12, color: 'rgba(255,255,255,0.7)'},
  statVal: {fontSize: 16, fontWeight: '600', color: '#FFF'},
  section: {marginTop: 24, paddingHorizontal: 20},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16},
  sectionTitle: {fontSize: 18, fontWeight: '700', color: W.text, marginBottom: 16},
  seeAll: {fontSize: 14, color: W.primary, fontWeight: '600', marginBottom: 16},
  quickActions: {flexDirection: 'row', justifyContent: 'space-between'},
  actionItem: {alignItems: 'center', gap: 8},
  actionIcon: {width: 56, height: 56, borderRadius: 16, backgroundColor: W.highlight, justifyContent: 'center', alignItems: 'center'},
  actionLabel: {fontSize: 12, color: W.text, fontWeight: '500'},
  txItem: {flexDirection: 'row', alignItems: 'center', backgroundColor: W.card, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 4},
  txIcon: {width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center'},
  txDetails: {flex: 1, marginLeft: 12},
  txName: {fontSize: 15, fontWeight: '600', color: W.text},
  txDate: {fontSize: 12, color: W.textLight, marginTop: 2},
  txAmount: {fontSize: 15, fontWeight: '700'},
});

// ─── HomeScreen Component ─────────────────────────────────────────────────────
const HomeScreen = () => {
  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="dark-content" backgroundColor={W.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scrollContent}>
        <View style={st.header}>
          <View>
            <Text style={st.greeting}>Good Morning</Text>
            <Text style={st.userName}>Harshal</Text>
          </View>
          <TouchableOpacity style={st.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color={W.text} />
          </TouchableOpacity>
        </View>

        <View style={st.balanceCard}>
          <Text style={st.balanceLabel}>Total Balance</Text>
          <Text style={st.balanceAmount}>$12,450.00</Text>
          <View style={st.balanceRow}>
            <View style={st.stat}>
              <View style={st.statIcon}>
                <Ionicons name="arrow-up-circle" size={20} color={W.success} />
              </View>
              <View>
                <Text style={st.statLabel}>Income</Text>
                <Text style={st.statVal}>$8,200</Text>
              </View>
            </View>
            <View style={st.stat}>
              <View style={st.statIcon}>
                <Ionicons name="arrow-down-circle" size={20} color={W.accent} />
              </View>
              <View>
                <Text style={st.statLabel}>Expense</Text>
                <Text style={st.statVal}>$3,750</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={st.section}>
          <Text style={st.sectionTitle}>Quick Actions</Text>
          <View style={st.quickActions}>
            {([
              {icon: 'send' as const, label: 'Send'},
              {icon: 'download' as const, label: 'Receive'},
              {icon: 'swap-horizontal' as const, label: 'Transfer'},
              {icon: 'qr-code' as const, label: 'QR Pay'},
            ]).map((action, index) => (
              <TouchableOpacity key={index} style={st.actionItem}>
                <View style={st.actionIcon}>
                  <Ionicons name={action.icon} size={22} color={W.primary} />
                </View>
                <Text style={st.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={st.section}>
          <View style={st.sectionHeader}>
            <Text style={st.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={st.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {([
            {icon: 'cart' as const, name: 'Shopping', amount: '-$240', date: 'Today', color: '#FF6B6B'},
            {icon: 'restaurant' as const, name: 'Restaurant', amount: '-$58', date: 'Today', color: '#FFA726'},
            {icon: 'car' as const, name: 'Transport', amount: '-$32', date: 'Yesterday', color: '#42A5F5'},
            {icon: 'briefcase' as const, name: 'Salary', amount: '+$8,200', date: 'Mar 1', color: '#66BB6A'},
          ]).map((item, index) => (
            <TouchableOpacity key={index} style={st.txItem}>
              <View style={[st.txIcon, {backgroundColor: item.color + '20'}]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={st.txDetails}>
                <Text style={st.txName}>{item.name}</Text>
                <Text style={st.txDate}>{item.date}</Text>
              </View>
              <Text style={[st.txAmount, {color: item.amount.startsWith('+') ? W.success : W.text}]}>
                {item.amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Chat Bot */}
      <ChatBot />
    </SafeAreaView>
  );
};



export default HomeScreen;
