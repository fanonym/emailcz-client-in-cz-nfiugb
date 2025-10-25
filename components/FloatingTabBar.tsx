
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 40,
  borderRadius = 25,
  bottomMargin = 20,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const animatedIndex = useSharedValue(0);

  const handleTabPress = (route: string) => {
    const index = tabs.findIndex((tab) => tab.route === route);
    animatedIndex.value = withSpring(index, {
      damping: 15,
      stiffness: 150,
    });
    router.push(route as any);
  };

  // Determine active tab index
  const activeIndex = tabs.findIndex((tab) => {
    if (tab.name === '(home)') {
      return pathname === '/' || pathname.startsWith('/(tabs)/(home)');
    }
    return pathname.includes(tab.name);
  });

  React.useEffect(() => {
    if (activeIndex !== -1) {
      animatedIndex.value = withSpring(activeIndex, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [activeIndex]);

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    return {
      transform: [
        {
          translateX: interpolate(
            animatedIndex.value,
            tabs.map((_, i) => i),
            tabs.map((_, i) => i * tabWidth)
          ),
        },
      ],
      width: tabWidth,
    };
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={[styles.container, { marginBottom: bottomMargin }]}>
        <BlurView
          intensity={Platform.OS === 'ios' ? 80 : 0}
          tint="light"
          style={[
            styles.tabBar,
            {
              width: containerWidth,
              borderRadius,
              backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.card,
            },
          ]}
        >
          <Animated.View style={[styles.indicator, indicatorStyle]} />
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tab}
                onPress={() => handleTabPress(tab.route)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name={tab.icon as any}
                  size={Platform.OS === 'android' ? 28 : 24}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      color: isActive ? colors.primary : colors.textSecondary,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Platform.OS === 'android' ? 16 : 12,
    paddingHorizontal: 8,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
    minHeight: Platform.OS === 'android' ? 60 : 50,
  },
  label: {
    fontSize: Platform.OS === 'android' ? 13 : 11,
    marginTop: 4,
  },
  indicator: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    backgroundColor: colors.highlight,
    borderRadius: 20,
    zIndex: -1,
  },
});
