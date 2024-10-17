import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';

interface SocketState {
  socket: typeof Socket | null;
  isConnected: boolean;
  initSocket: () => void;
  disconnectSocket: () => void;
}

const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  isConnected: false,
  initSocket: () => {
    const socket = io('http://localhost:3500');

    socket.on('connect', () => {
      set({ isConnected: true });
      console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
      console.log('Disconnected from socket server');
    });
    set({ socket });
  },
  disconnectSocket: () => {
    set((state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
      return { socket: null, isConnected: false, driverLocation: null };
    });
  },
}));

export default useSocketStore;
 