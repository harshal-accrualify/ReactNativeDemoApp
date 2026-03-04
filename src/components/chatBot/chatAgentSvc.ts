export type NavigationIntent = {
    screen: 'Home' | 'Expense' | 'Cards' | 'Profile';
    params?: Record<string, unknown>;
};

export type ChatResponse = {
    reply: string;
    navigate?: NavigationIntent;
};

class ChatAgentService {
    getResponse = async (message: string): Promise<ChatResponse> => {
        const response = await fetch('http://127.0.0.1:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });
        const data = await response.json();
        const requiredResponse = JSON.parse(data.response);
        // Backend should return: { response: string, navigate?: { screen, params? } }
        return {
            reply: requiredResponse?.content,
            navigate: requiredResponse?.navigation,   // undefined if backend doesn't send it
        };
    };
}

export default ChatAgentService;