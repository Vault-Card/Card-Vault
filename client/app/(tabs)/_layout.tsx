import { useColorScheme } from '@/hooks/useColorScheme';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Collection",
					tabBarPosition: "top",
					tabBarIcon: ({ }) => <MaterialIcons name="folder" size={24} color="white" />
				}}
			/>
			<Tabs.Screen
				name="scan"
				options={{
					title: "Scan",
					tabBarPosition: "top",
					tabBarIcon: ({ }) => <MaterialIcons name="camera-alt" size={24} color="white" />
				}}
			/>
			<Tabs.Screen
				name="marketplace"
				options={{
					title: "Marketplace",
					tabBarPosition: "top",
					tabBarIcon: ({ }) => <Entypo name="shop" size={24} color="white" />
				}}
			/>
			<Tabs.Screen
				name="signout"
				options={{
					title: "Sign Out",
					tabBarPosition: "top",
					tabBarIcon: ({ }) => <MaterialIcons name="logout" size={24} color="white" />
				}}
			/>
		</Tabs>
	);
}
