import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

const W = {
  bg: '#FFF8F0', card: '#FFFFFF', primary: '#E8652D', secondary: '#F5A623',
  accent: '#D4533B', text: '#3D2C2E', textLight: '#8B7272',
  highlight: '#FFF0E5', success: '#4CAF50',
};

const {width} = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const cards = [
  {id: 1, type: 'Visa', number: '**** **** **** 4532', balance: '$5,240.00', holder: 'HARSHAL D', expiry: '09/27', gradient: ['#E8652D', '#D4533B']},
  {id: 2, type: 'Mastercard', number: '**** **** **** 8901', balance: '$3,120.00', holder: 'HARSHAL D', expiry: '12/26', gradient: ['#F5A623', '#E8652D']},
  {id: 3, type: 'Visa', number: '**** **** **** 2156', balance: '$8,450.00', holder: 'HARSHAL D', expiry: '03/28', gradient: ['#D4533B', '#8B3A3A']},
];

const CardsScreen = () => {
  const [selectedCard, setSelectedCard] = useState(0);

  return (
    <SafeAreaView style={st.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={st.header}>
          <Text style={st.title}>My Cards</Text>
          <TouchableOpacity style={st.addBtn}>
            <Ionicons name="add" size={24} color={W.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={st.cardScroll}
          onScroll={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
            setSelectedCard(idx);
          }}
          scrollEventThrottle={16}>
          {cards.map((c, i) => (
            <View key={c.id} style={[st.creditCard, {backgroundColor: c.gradient[0], width: CARD_WIDTH}]}>
              <View style={st.cardHeader}>
                <Text style={st.cardType}>{c.type}</Text>
                <Ionicons name="wifi" size={24} color="rgba(255,255,255,0.8)" />
              </View>
              <Text style={st.cardNumber}>{c.number}</Text>
              <View style={st.cardFooter}>
                <View>
                  <Text style={st.cardLabel}>Card Holder</Text>
                  <Text style={st.cardValue}>{c.holder}</Text>
                </View>
                <View>
                  <Text style={st.cardLabel}>Expires</Text>
                  <Text style={st.cardValue}>{c.expiry}</Text>
                </View>
                <View>
                  <Text style={st.cardLabel}>Balance</Text>
                  <Text style={st.cardValue}>{c.balance}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={st.dots}>
          {cards.map((_, i) => (
            <View key={i} style={[st.dot, selectedCard === i && st.dotActive]} />
          ))}
        </View>

        <View style={st.actions}>
          {([
            {icon: 'lock-closed' as const, label: 'Lock Card'},
            {icon: 'settings' as const, label: 'Settings'},
            {icon: 'card' as const, label: 'Details'},
            {icon: 'analytics' as const, label: 'Limits'},
          ]).map((a, i) => (
            <TouchableOpacity key={i} style={st.actionItem}>
              <View style={st.actionIcon}>
                <Ionicons name={a.icon} size={22} color={W.primary} />
              </View>
              <Text style={st.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={st.section}>
          <Text style={st.sectionTitle}>Card Transactions</Text>
          {[
            {icon: 'logo-apple' as const, name: 'Apple Store', amount: '-$999', date: 'Today'},
            {icon: 'logo-amazon' as const, name: 'Amazon', amount: '-$54.99', date: 'Yesterday'},
            {icon: 'musical-notes' as const, name: 'Spotify', amount: '-$9.99', date: 'Mar 1'},
            {icon: 'film' as const, name: 'Netflix', amount: '-$15.99', date: 'Mar 1'},
          ].map((tx, i) => (
            <View key={i} style={st.txItem}>
              <View style={[st.txIcon, {backgroundColor: W.highlight}]}>
                <Ionicons name={tx.icon} size={20} color={W.primary} />
              </View>
              <View style={st.txDetails}>
                <Text style={st.txName}>{tx.name}</Text>
                <Text style={st.txDate}>{tx.date}</Text>
              </View>
              <Text style={st.txAmount}>{tx.amount}</Text>
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
  addBtn: {width: 40, height: 40, borderRadius: 20, backgroundColor: W.highlight, justifyContent: 'center', alignItems: 'center'},
  cardScroll: {paddingLeft: 20},
  creditCard: {borderRadius: 20, padding: 24, marginRight: 20, elevation: 8, shadowColor: '#000', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.2, shadowRadius: 16},
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  cardType: {fontSize: 20, fontWeight: '700', color: '#FFF'},
  cardNumber: {fontSize: 22, fontWeight: '600', color: '#FFF', letterSpacing: 2, marginTop: 30, marginBottom: 30},
  cardFooter: {flexDirection: 'row', justifyContent: 'space-between'},
  cardLabel: {fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 4},
  cardValue: {fontSize: 14, fontWeight: '600', color: '#FFF'},
  dots: {flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 8},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0D5CC'},
  dotActive: {backgroundColor: W.primary, width: 24},
  actions: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 24},
  actionItem: {alignItems: 'center', gap: 8},
  actionIcon: {width: 52, height: 52, borderRadius: 16, backgroundColor: W.highlight, justifyContent: 'center', alignItems: 'center'},
  actionLabel: {fontSize: 11, color: W.text, fontWeight: '500'},
  section: {marginTop: 24, paddingHorizontal: 20, paddingBottom: 20},
  sectionTitle: {fontSize: 18, fontWeight: '700', color: W.text, marginBottom: 16},
  txItem: {flexDirection: 'row', alignItems: 'center', backgroundColor: W.card, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 4},
  txIcon: {width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center'},
  txDetails: {flex: 1, marginLeft: 12},
  txName: {fontSize: 15, fontWeight: '600', color: W.text},
  txDate: {fontSize: 12, color: W.textLight, marginTop: 2},
  txAmount: {fontSize: 15, fontWeight: '700', color: W.accent},
});

export default CardsScreen;
