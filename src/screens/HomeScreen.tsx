import React, {useState, useRef, useEffect} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  Animated, KeyboardAvoidingView, Platform, TextInput, FlatList, Keyboard,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

type Message = {id: string; text: string; from: 'user' | 'bot'; time: string};

const BOT_REPLIES: Record<string, string> = {
  default: "I'm your finance assistant! Ask me about your balance, expenses, or tips.",
  balance: 'Your current balance is $12,450.00. You\'re doing great this month! 💰',
  expense: 'Your total expenses this month are $3,750. Food & shopping are the top categories.',
  income: 'You received $8,200 in income this month — primarily from salary on Mar 1.',
  tip: 'Tip: Try to keep your Food budget under $800 to save an extra $50 this month!',
  hello: 'Hey Harshal! 👋 How can I help you with your finances today?',
  hi: 'Hi there! Ask me anything about your spending, income, or balance.',
};

function getBotReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('balance')) return BOT_REPLIES.balance;
  if (t.includes('expense') || t.includes('spend')) return BOT_REPLIES.expense;
  if (t.includes('income') || t.includes('salary')) return BOT_REPLIES.income;
  if (t.includes('tip') || t.includes('advice')) return BOT_REPLIES.tip;
  if (t.includes('hello')) return BOT_REPLIES.hello;
  if (t.includes('hi')) return BOT_REPLIES.hi;
  return BOT_REPLIES.default;
}

function now() {
  return new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}

const W = {
  bg: '#FFF8F0', card: '#FFFFFF', primary: '#E8652D', secondary: '#F5A623',
  accent: '#D4533B', text: '#3D2C2E', textLight: '#8B7272',
  highlight: '#FFF0E5', success: '#4CAF50',
};

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {id: '0', text: "Hi! I'm your AI finance assistant. How can I help you today?", from: 'bot', time: now()},
  ]);
  const [input, setInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const flatRef = useRef<FlatList>(null);

  const openChat = () => {
    setChatVisible(true);
    setChatOpen(true);
    Animated.spring(slideAnim, {toValue: 1, useNativeDriver: true, bounciness: 6}).start();
  };

  const closeChat = () => {
    setChatOpen(false);
    Keyboard.dismiss();
    Animated.spring(slideAnim, {toValue: 0, useNativeDriver: true, bounciness: 0}).start(({finished}) => {
      if (finished) setChatVisible(false);
    });
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = {id: Date.now().toString(), text, from: 'user', time: now()};
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setBotTyping(true);
    setTimeout(() => {
      const botMsg: Message = {id: (Date.now() + 1).toString(), text: getBotReply(text), from: 'bot', time: now()};
      setMessages(prev => [...prev, botMsg]);
      setBotTyping(false);
    }, 900);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({animated: true}), 100);
    }
  }, [messages, botTyping]);

  const chatTranslateY = slideAnim.interpolate({inputRange: [0, 1], outputRange: [500, 0]});
  const chatOpacity = slideAnim.interpolate({inputRange: [0, 0.4, 1], outputRange: [0, 0.6, 1]});

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="dark-content" backgroundColor={W.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
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

      {/* Chat overlay backdrop */}
      {chatOpen && (
        <TouchableOpacity style={st.backdrop} activeOpacity={1} onPress={closeChat} />
      )}

      {/* Chat panel */}
      {chatVisible && (
      <Animated.View
        style={[st.chatPanel, {transform: [{translateY: chatTranslateY}], opacity: chatOpacity, paddingBottom: insets.bottom + 8}]}>
        {/* Header */}
        <View style={st.chatHeader}>
          <View style={st.chatHeaderLeft}>
            <View style={st.botAvatar}>
              <Ionicons name="sparkles" size={16} color="#FFF" />
            </View>
            <View>
              <Text style={st.chatHeaderName}>Finance AI</Text>
              <Text style={st.chatHeaderStatus}>● Online</Text>
            </View>
          </View>
          <TouchableOpacity onPress={closeChat} style={st.chatCloseBtn}>
            <Ionicons name="close" size={20} color={W.textLight} />
          </TouchableOpacity>
        </View>

        {/* Suggested chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.chipsRow}>
          {['My balance', 'Expenses', 'Income', 'Give me a tip'].map(chip => (
            <TouchableOpacity key={chip} style={st.chip} onPress={() => {
              setInput(chip);
            }}>
              <Text style={st.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Messages */}
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={m => m.id}
          style={st.messageList}
          contentContainerStyle={{paddingVertical: 12, paddingHorizontal: 14}}
          renderItem={({item}) => (
            <View style={[st.bubble, item.from === 'user' ? st.bubbleUser : st.bubbleBot]}>
              {item.from === 'bot' && (
                <View style={st.botAvatarSmall}>
                  <Ionicons name="sparkles" size={10} color="#FFF" />
                </View>
              )}
              <View style={[st.bubbleInner, item.from === 'user' ? st.bubbleInnerUser : st.bubbleInnerBot]}>
                <Text style={[st.bubbleText, item.from === 'user' && st.bubbleTextUser]}>{item.text}</Text>
                <Text style={[st.bubbleTime, item.from === 'user' && st.bubbleTimeUser]}>{item.time}</Text>
              </View>
            </View>
          )}
          ListFooterComponent={botTyping ? (
            <View style={[st.bubble, st.bubbleBot]}>
              <View style={st.botAvatarSmall}>
                <Ionicons name="sparkles" size={10} color="#FFF" />
              </View>
              <View style={st.bubbleInnerBot}>
                <Text style={st.typingDots}>● ● ●</Text>
              </View>
            </View>
          ) : null}
        />

        {/* Input row */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={st.inputRow}>
            <TextInput
              style={st.textInput}
              placeholder="Ask about your finances…"
              placeholderTextColor={W.textLight}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              multiline={false}
            />
            <TouchableOpacity
              style={[st.sendBtn, !input.trim() && st.sendBtnDisabled]}
              onPress={sendMessage}
              disabled={!input.trim()}>
              <Ionicons name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
      )}

      {/* FAB */}
      {!chatOpen && (
        <TouchableOpacity style={[st.fab, {bottom: insets.bottom + 24}]} onPress={openChat} activeOpacity={0.85}>
          <Ionicons name="chatbubble-ellipses" size={26} color="#FFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: W.bg},
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

  // FAB
  fab: {position: 'absolute', right: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: W.primary, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: W.primary, shadowOffset: {width: 0, height: 6}, shadowOpacity: 0.4, shadowRadius: 12},

  // Backdrop
  backdrop: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)'},

  // Chat panel
  chatPanel: {position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: W.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: 520, elevation: 16, shadowColor: '#000', shadowOffset: {width: 0, height: -4}, shadowOpacity: 0.12, shadowRadius: 16},
  chatHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0E6DE'},
  chatHeaderLeft: {flexDirection: 'row', alignItems: 'center', gap: 10},
  botAvatar: {width: 36, height: 36, borderRadius: 18, backgroundColor: W.primary, justifyContent: 'center', alignItems: 'center'},
  chatHeaderName: {fontSize: 15, fontWeight: '700', color: W.text},
  chatHeaderStatus: {fontSize: 11, color: W.success, marginTop: 1},
  chatCloseBtn: {width: 32, height: 32, borderRadius: 16, backgroundColor: W.highlight, justifyContent: 'center', alignItems: 'center'},

  // Chips
  chipsRow: {paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0E6DE', flexGrow: 0},
  chip: {paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: W.highlight, marginRight: 8},
  chipText: {fontSize: 12, color: W.primary, fontWeight: '600'},

  // Messages
  messageList: {flex: 1},
  bubble: {flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10},
  bubbleBot: {justifyContent: 'flex-start'},
  bubbleUser: {justifyContent: 'flex-end'},
  botAvatarSmall: {width: 22, height: 22, borderRadius: 11, backgroundColor: W.primary, justifyContent: 'center', alignItems: 'center', marginRight: 6, marginBottom: 2},
  bubbleInner: {maxWidth: '75%', borderRadius: 16, paddingVertical: 9, paddingHorizontal: 13},
  bubbleInnerBot: {backgroundColor: W.highlight, borderBottomLeftRadius: 4},
  bubbleInnerUser: {backgroundColor: W.primary, borderBottomRightRadius: 4},
  bubbleText: {fontSize: 14, color: W.text, lineHeight: 20},
  bubbleTextUser: {color: '#FFF'},
  bubbleTime: {fontSize: 10, color: W.textLight, marginTop: 4, textAlign: 'right'},
  bubbleTimeUser: {color: 'rgba(255,255,255,0.7)'},
  typingDots: {fontSize: 14, color: W.textLight, letterSpacing: 3},

  // Input
  inputRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F0E6DE', gap: 10},
  textInput: {flex: 1, backgroundColor: W.highlight, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: W.text, maxHeight: 80},
  sendBtn: {width: 44, height: 44, borderRadius: 22, backgroundColor: W.primary, justifyContent: 'center', alignItems: 'center'},
  sendBtnDisabled: {backgroundColor: '#E0C8BB'},
});

export default HomeScreen;
