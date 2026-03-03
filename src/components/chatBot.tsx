import Ionicons from "@react-native-vector-icons/ionicons";
import { useEffect, useRef, useState } from "react";
import { Animated, FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const W = {
  bg: '#FFF8F0', card: '#FFFFFF', primary: '#E8652D', secondary: '#F5A623',
  accent: '#D4533B', text: '#3D2C2E', textLight: '#8B7272',
  highlight: '#FFF0E5', success: '#4CAF50',
};

const cs = StyleSheet.create({
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  fab: {
    position: 'absolute', right: 24, width: 58, height: 58, borderRadius: 29,
    backgroundColor: W.primary, justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: W.primary, shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4, shadowRadius: 12,
  },
  chatPanel: {
    position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: W.card,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, height: 520,
    elevation: 16, shadowColor: '#000', shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.12, shadowRadius: 16,
  },
  chatHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F0E6DE',
  },
  chatHeaderLeft: {flexDirection: 'row', alignItems: 'center', gap: 10},
  botAvatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: W.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  chatHeaderName: {fontSize: 15, fontWeight: '700', color: W.text},
  chatHeaderStatus: {fontSize: 11, color: W.success, marginTop: 1},
  chatCloseBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: W.highlight,
    justifyContent: 'center', alignItems: 'center',
  },
  chipsRow: {flexGrow: 0, borderBottomWidth: 1, borderBottomColor: '#F0E6DE'},
  chipsContent: {paddingHorizontal: 14, paddingVertical: 10},
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: W.highlight, marginRight: 8,
  },
  chipText: {fontSize: 12, color: W.primary, fontWeight: '600'},
  messageList: {flex: 1},
  messageContent: {paddingVertical: 12, paddingHorizontal: 14},
  bubble: {flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10},
  bubbleBot: {justifyContent: 'flex-start'},
  bubbleUser: {justifyContent: 'flex-end'},
  botAvatarSmall: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: W.primary,
    justifyContent: 'center', alignItems: 'center', marginRight: 6, marginBottom: 2,
  },
  bubbleInner: {maxWidth: '75%', borderRadius: 16, paddingVertical: 9, paddingHorizontal: 13},
  bubbleInnerBot: {backgroundColor: W.highlight, borderBottomLeftRadius: 4},
  bubbleInnerUser: {backgroundColor: W.primary, borderBottomRightRadius: 4},
  bubbleText: {fontSize: 14, color: W.text, lineHeight: 20},
  bubbleTextUser: {color: '#FFF'},
  bubbleTime: {fontSize: 10, color: W.textLight, marginTop: 4, textAlign: 'right'},
  bubbleTimeUser: {color: 'rgba(255,255,255,0.7)'},
  typingDots: {fontSize: 14, color: W.textLight, letterSpacing: 3},
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: '#F0E6DE', gap: 10,
  },
  textInput: {
    flex: 1, backgroundColor: W.highlight, borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: W.text, maxHeight: 80,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: W.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: {backgroundColor: '#E0C8BB'},
});

type Message = {id: string; text: string; from: 'user' | 'bot'; time: string};

const BOT_REPLIES: Record<string, string> = {
  default: "I'm your finance assistant! Ask me about your balance, expenses, or tips.",
  balance: "Your current balance is $12,450.00. You're doing great this month! 💰",
  expense: 'Your total expenses this month are $3,750. Food & shopping are the top categories.',
  income: 'You received $8,200 in income this month — primarily from salary on Mar 1.',
  tip: 'Tip: Try to keep your Food budget under $800 to save an extra $50 this month!',
  hello: 'Hey Harshal! 👋 How can I help you with your finances today?',
  hi: 'Hi there! Ask me anything about your spending, income, or balance.',
};


function getBotReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('balance')) { return BOT_REPLIES.balance; }
  if (t.includes('expense') || t.includes('spend')) { return BOT_REPLIES.expense; }
  if (t.includes('income') || t.includes('salary')) { return BOT_REPLIES.income; }
  if (t.includes('tip') || t.includes('advice')) { return BOT_REPLIES.tip; }
  if (t.includes('hello')) { return BOT_REPLIES.hello; }
  if (t.includes('hi')) { return BOT_REPLIES.hi; }
  return BOT_REPLIES.default;
}

function nowTime() {
  return new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}

const CHIPS = ['My balance', 'Expenses', 'Income', 'Give me a tip'];

const ChatBot = () => {
  const insets = useSafeAreaInsets();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {id: '0', text: "Hi! I'm your AI finance assistant. How can I help you today?", from: 'bot', time: nowTime()},
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
    Animated.spring(slideAnim, {toValue: 0, useNativeDriver: true, bounciness: 0}).start(
      ({finished}) => { if (finished) { setChatVisible(false); } },
    );
  };

  const sendMessage = (override?: string) => {
    const text = (override ?? input).trim();
    if (!text) { return; }
    const userMsg: Message = {id: Date.now().toString(), text, from: 'user', time: nowTime()};
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setBotTyping(true);
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotReply(text),
        from: 'bot',
        time: nowTime(),
      };
      setMessages(prev => [...prev, botMsg]);
      setBotTyping(false);
    }, 900);
  };

  useEffect(() => {
    setTimeout(() => flatRef.current?.scrollToEnd({animated: true}), 100);
  }, [messages, botTyping]);

  const chatTranslateY = slideAnim.interpolate({inputRange: [0, 1], outputRange: [560, 0]});
  const chatOpacity = slideAnim.interpolate({inputRange: [0, 0.4, 1], outputRange: [0, 0.7, 1]});

  return (
    <>
      {/* Backdrop */}
      {chatOpen && (
        <TouchableOpacity style={cs.backdrop} activeOpacity={1} onPress={closeChat} />
      )}

      {/* Chat panel */}
      {chatVisible && (
        <Animated.View
          style={[
            cs.chatPanel,
            {transform: [{translateY: chatTranslateY}], opacity: chatOpacity, paddingBottom: insets.bottom + 8},
          ]}>
          {/* Header */}
          <View style={cs.chatHeader}>
            <View style={cs.chatHeaderLeft}>
              <View style={cs.botAvatar}>
                <Ionicons name="sparkles" size={16} color="#FFF" />
              </View>
              <View>
                <Text style={cs.chatHeaderName}>Finance AI</Text>
                <Text style={cs.chatHeaderStatus}>● Online</Text>
              </View>
            </View>
            <TouchableOpacity onPress={closeChat} style={cs.chatCloseBtn}>
              <Ionicons name="close" size={20} color={W.textLight} />
            </TouchableOpacity>
          </View>

          {/* Suggestion chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={cs.chipsRow}
            contentContainerStyle={cs.chipsContent}>
            {CHIPS.map(chip => (
              <TouchableOpacity key={chip} style={cs.chip} onPress={() => sendMessage(chip)}>
                <Text style={cs.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Messages */}
          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={m => m.id}
            style={cs.messageList}
            contentContainerStyle={cs.messageContent}
            renderItem={({item}) => (
              <View style={[cs.bubble, item.from === 'user' ? cs.bubbleUser : cs.bubbleBot]}>
                {item.from === 'bot' && (
                  <View style={cs.botAvatarSmall}>
                    <Ionicons name="sparkles" size={10} color="#FFF" />
                  </View>
                )}
                <View style={[cs.bubbleInner, item.from === 'user' ? cs.bubbleInnerUser : cs.bubbleInnerBot]}>
                  <Text style={[cs.bubbleText, item.from === 'user' && cs.bubbleTextUser]}>
                    {item.text}
                  </Text>
                  <Text style={[cs.bubbleTime, item.from === 'user' && cs.bubbleTimeUser]}>
                    {item.time}
                  </Text>
                </View>
              </View>
            )}
            ListFooterComponent={
              botTyping ? (
                <View style={[cs.bubble, cs.bubbleBot]}>
                  <View style={cs.botAvatarSmall}>
                    <Ionicons name="sparkles" size={10} color="#FFF" />
                  </View>
                  <View style={cs.bubbleInnerBot}>
                    <Text style={cs.typingDots}>● ● ●</Text>
                  </View>
                </View>
              ) : null
            }
          />

          {/* Input */}
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={cs.inputRow}>
              <TextInput
                style={cs.textInput}
                placeholder="Ask about your finances…"
                placeholderTextColor={W.textLight}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => sendMessage()}
                returnKeyType="send"
                multiline={false}
              />
              <TouchableOpacity
                style={[cs.sendBtn, !input.trim() && cs.sendBtnDisabled]}
                onPress={() => sendMessage()}
                disabled={!input.trim()}>
                <Ionicons name="send" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}

      {/* FAB */}
      {!chatOpen && (
        <TouchableOpacity
          style={[cs.fab, {bottom: insets.bottom + 24}]}
          onPress={openChat}
          activeOpacity={0.85}>
          <Ionicons name="chatbubble-ellipses" size={26} color="#FFF" />
        </TouchableOpacity>
      )}
    </>
  );
};


export default ChatBot;