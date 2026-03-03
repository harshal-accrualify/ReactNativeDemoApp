import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

const W = {
  bg: '#FFF8F0', card: '#FFFFFF', primary: '#E8652D', secondary: '#F5A623',
  accent: '#D4533B', text: '#3D2C2E', textLight: '#8B7272',
  highlight: '#FFF0E5', success: '#4CAF50',
};

const menuItems = [
  {icon: 'person-outline' as const, label: 'Personal Info', badge: null},
  {icon: 'card-outline' as const, label: 'Payment Methods', badge: '3'},
  {icon: 'notifications-outline' as const, label: 'Notifications', badge: '5'},
  {icon: 'shield-checkmark-outline' as const, label: 'Security', badge: null},
  {icon: 'help-circle-outline' as const, label: 'Help & Support', badge: null},
  {icon: 'document-text-outline' as const, label: 'Terms & Privacy', badge: null},
];

const ProfileScreen = () => {
  return (
    <SafeAreaView style={st.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={st.header}>
          <Text style={st.title}>Profile</Text>
          <TouchableOpacity style={st.editBtn}>
            <Ionicons name="create-outline" size={20} color={W.primary} />
          </TouchableOpacity>
        </View>

        <View style={st.profileCard}>
          <View style={st.avatar}>
            <Text style={st.avatarText}>HD</Text>
          </View>
          <Text style={st.name}>Harshal Deshattiwar</Text>
          <Text style={st.email}>harshal@example.com</Text>
          <View style={st.statsRow}>
            <View style={st.statItem}>
              <Text style={st.statValue}>$12,450</Text>
              <Text style={st.statLabel}>Balance</Text>
            </View>
            <View style={st.statDivider} />
            <View style={st.statItem}>
              <Text style={st.statValue}>3</Text>
              <Text style={st.statLabel}>Cards</Text>
            </View>
            <View style={st.statDivider} />
            <View style={st.statItem}>
              <Text style={st.statValue}>156</Text>
              <Text style={st.statLabel}>Transactions</Text>
            </View>
          </View>
        </View>

        <View style={st.section}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={st.menuItem}>
              <View style={st.menuIcon}>
                <Ionicons name={item.icon} size={22} color={W.primary} />
              </View>
              <Text style={st.menuLabel}>{item.label}</Text>
              <View style={st.menuRight}>
                {item.badge && (
                  <View style={st.badge}>
                    <Text style={st.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color={W.textLight} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={st.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color={W.accent} />
          <Text style={st.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: W.bg},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15},
  title: {fontSize: 24, fontWeight: '700', color: W.text},
  editBtn: {width: 40, height: 40, borderRadius: 20, backgroundColor: W.highlight, justifyContent: 'center', alignItems: 'center'},
  profileCard: {marginHorizontal: 20, backgroundColor: W.card, borderRadius: 20, padding: 24, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.06, shadowRadius: 8},
  avatar: {width: 80, height: 80, borderRadius: 40, backgroundColor: W.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12},
  avatarText: {fontSize: 28, fontWeight: '700', color: '#FFF'},
  name: {fontSize: 20, fontWeight: '700', color: W.text},
  email: {fontSize: 14, color: W.textLight, marginTop: 4},
  statsRow: {flexDirection: 'row', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F0E6DE', width: '100%', justifyContent: 'space-around'},
  statItem: {alignItems: 'center'},
  statValue: {fontSize: 18, fontWeight: '700', color: W.text},
  statLabel: {fontSize: 12, color: W.textLight, marginTop: 4},
  statDivider: {width: 1, backgroundColor: '#F0E6DE', height: '100%'},
  section: {marginTop: 24, paddingHorizontal: 20},
  menuItem: {flexDirection: 'row', alignItems: 'center', backgroundColor: W.card, borderRadius: 14, padding: 16, marginBottom: 8, elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 4},
  menuIcon: {width: 40, height: 40, borderRadius: 12, backgroundColor: W.highlight, justifyContent: 'center', alignItems: 'center'},
  menuLabel: {flex: 1, fontSize: 15, fontWeight: '600', color: W.text, marginLeft: 12},
  menuRight: {flexDirection: 'row', alignItems: 'center', gap: 8},
  badge: {backgroundColor: W.primary, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2},
  badgeText: {fontSize: 11, fontWeight: '700', color: '#FFF'},
  logoutBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginTop: 24, marginBottom: 40, padding: 16, borderRadius: 14, backgroundColor: '#FFF0ED', gap: 8},
  logoutText: {fontSize: 16, fontWeight: '600', color: W.accent},
});

export default ProfileScreen;
