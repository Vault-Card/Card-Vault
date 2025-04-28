import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';

import DashboardIcon from '@/components/ui/customIcons/DashboardIcon';
import CollectionIcon from '@/components/ui/customIcons/CollectionIcon';
import MarketplaceIcon from '@/components/ui/customIcons/MarketplaceIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs >
            <Tabs.Screen
                name = "index"
                options = {{
                    title: "Dashboard",
                    tabBarIcon: ({ size }) => DashboardIcon()
                }}
            />
            <Tabs.Screen
                name = "collection"
                options = {{
                    title: "Collection",
                    tabBarIcon: ({}) => CollectionIcon()
                }}
            />
            <Tabs.Screen
                name = "marketplace"
                options = {{
                    title: "Marketplace",
                    tabBarIcon: ({}) => MarketplaceIcon()
                }}
            />
        </Tabs>
  );
}
