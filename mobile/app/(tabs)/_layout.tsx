import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { KonumColors } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={22} style={{ marginBottom: -2 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: KonumColors.accent,
        tabBarInactiveTintColor: isDark ? 'rgba(244,246,251,0.45)' : Colors.light.tabIconDefault,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          backgroundColor: isDark ? KonumColors.surface : '#fff',
          borderTopColor: isDark ? KonumColors.border : '#e8e8e8',
        },
        headerStyle: { backgroundColor: isDark ? KonumColors.surface : '#fff' },
        headerTintColor: isDark ? KonumColors.text : Colors.light.text,
        headerTitleStyle: { fontWeight: '800' },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Harita',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Mesajlar',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
        }}
      />
    </Tabs>
  );
}
