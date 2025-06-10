import CollectionIcon from '@/components/ui/customIcons/CollectionIcon';
import DashboardIcon from '@/components/ui/customIcons/DashboardIcon';
import MarketplaceIcon from '@/components/ui/customIcons/MarketplaceIcon';
import ScanIcon from '@/components/ui/customIcons/ScanIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Dashboard",
					tabBarPosition: "top",
					tabBarIcon: ({ size }) => DashboardIcon()
				}}
			/>
			<Tabs.Screen
				name="collection"
				options={{
					title: "Collection",
					tabBarPosition: "top",
					tabBarIcon: ({ }) => CollectionIcon()
				}}
			/>
			<Tabs.Screen
				name="scan"
				options={{
					title: "Scan",
					tabBarPosition: "top",
					tabBarIcon: ({ }) => ScanIcon()
				}}
			/>
			<Tabs.Screen
				name="marketplace"
				options={{
					title: "Marketplace",
					tabBarPosition: "top",
					tabBarIcon: ({ }) => MarketplaceIcon()
				}}
			/>
			<Tabs.Screen
				name="signout"
				options={{
					title: "Sign Out",
					tabBarPosition: "top",
					tabBarIcon: ({ }) => MarketplaceIcon()
				}}
			/>
		</Tabs>
	);
}
