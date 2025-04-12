import React from 'react'
import { Tabs } from 'expo-router'

import DashboardIcon from '../components/ui/customIcons/DashboardIcon';
import CollectionIcon from '../components/ui/customIcons/CollectionIcon';
import MarketplaceIcon from '../components/ui/customIcons/MarketplaceIcon';

const _layout = () => {
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

export default _layout