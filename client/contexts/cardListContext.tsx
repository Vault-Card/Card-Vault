import { Card } from '@/types/card';
import React, { createContext, useContext, useState, useEffect } from 'react';

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

	// a small surprise
		useEffect(() => {
		setCardList([
			{
				scryfallId: '2d1dfd96-8e17-4ba8-b786-a5cc0ae2ff2d',
				name: 'Siege Wurm',
				imageUrl: 'https://cards.scryfall.io/small/front/2/d/2d1dfd96-8e17-4ba8-b786-a5cc0ae2ff2d.jpg?1572893446',
				set: 'Guilds of Ravnica',
				price: '0.04',
				amount: 198
			},
		]);
	}, []);

	return (
		<CardListContext.Provider value={{ cardList, setCardList }}>
			{children}
		</CardListContext.Provider>
	);
};