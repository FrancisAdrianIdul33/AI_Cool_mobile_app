import { Tabs } from 'expo-router';

import { BottomNav } from '@/components/bottom-nav';

export default function AppTabs() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="missions" />
        <Tabs.Screen name="community" />
        <Tabs.Screen name="profile" />
      </Tabs>
      <BottomNav />
    </>
  );
}