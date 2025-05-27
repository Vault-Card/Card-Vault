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
		<Tabs >
			<Tabs.Screen
				name="index"
				options={{
					title: "Dashboard",
					tabBarIcon: ({ size }) => DashboardIcon()
				}}
			/>
			<Tabs.Screen
				name="collection"
				options={{
					title: "Collection",
					tabBarIcon: ({ }) => CollectionIcon()
				}}
			/>
			{/* <Tabs.Screen
				name="scan"
				options={{
					title: "Scan",
					tabBarIcon: ({ }) => ScanIcon()
				}}
			/> */}
			<Tabs.Screen
				name="marketplace"
				options={{
					title: "Marketplace",
					tabBarIcon: ({ }) => MarketplaceIcon()
				}}
			/>
		</Tabs>
	);
}
