import { create, StateCreator, SetState } from 'zustand';
import { persist } from 'zustand/middleware';

interface BearState {
  bears: number;
}

interface FriendState {
  friendId: string | null;
  setFriendId: (id: string) => void;
}

export const useBearStore: StateCreator<BearState> = create(set => ({
  bears: 0,
  increasePopulation: () =>
    set((state: BearState) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

export const useFriendStore = create(
  persist(
    set => ({
      friendId: null,
      setFriendId: (id: string) => set({ friendId: id }),
    }),
    {
      name: 'friend-storage', // unique name for sessionStorage item
      getStorage: () => sessionStorage, // use sessionStorage
    }
  )
);
