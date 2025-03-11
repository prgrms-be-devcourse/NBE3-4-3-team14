'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  JSX,
} from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

interface IWebSocketContext {
  client: Client | null;
  voteUpdates: any;
  setVoteUpdates: (data: any) => void;
}

const WebSocketContext = createContext<IWebSocketContext>({
  client: null,
  voteUpdates: null,
  setVoteUpdates: () => {},
});

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({
  children,
}: WebSocketProviderProps): JSX.Element => {
  const [client, setClient] = useState<Client | null>(null);
  const [voteUpdates, setVoteUpdates] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return; // 서버 사이드 실행 방지

    // 기존 WebSocket이 있다면 완전히 해제
    if (client) {
      console.log('🔌 기존 WebSocket 연결 해제');
      client.deactivate();
      setClient(null);
    }

    const socket = new SockJS('http://localhost:8080/websocket');

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ Global WebSocket 연결 성공');
        const subscription = stompClient.subscribe(
          '/topic/vote-results',
          (message) => {
            try {
              const updatedVote = JSON.parse(message.body);
              console.log(
                '📩 실시간 투표 업데이트 (Redis pub/sub):',
                updatedVote
              );
              setVoteUpdates(updatedVote);
            } catch (err) {
              console.error('JSON 파싱 오류:', err);
            }
          }
        );
        console.log('🔔 구독 등록 완료:', subscription);
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 오류:', frame.headers['message'], frame.body);
      },
      onDisconnect: () => {
        console.log('❌ Global WebSocket 연결 종료');
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      console.log('🔌 WebSocket 연결 해제');
      stompClient.deactivate();
      setClient(null);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ client, voteUpdates, setVoteUpdates }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useGlobalWebSocket = () => useContext(WebSocketContext);
