import { Card } from '@/types/card';
import React, { createContext, useContext, useState } from 'react';

type CardListState = {
	cardList: Card[],
	setCardList: React.Dispatch<React.SetStateAction<Card[]>>
}

const CardListContext = createContext<CardListState | undefined>(undefined);

export const useCardList = () => {
	const context = useContext(CardListContext);
	if (!context) {
		throw new Error('useCardList must be used within a CardListContextProvider');
	}

	return context
};

export const CardListContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [cardList, setCardList] = useState<Card[]>([]);

	return (
		<CardListContext.Provider value={{ cardList, setCardList }}>
			{children}
		</CardListContext.Provider>
	);
};