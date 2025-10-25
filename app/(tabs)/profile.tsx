
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Odhlásit se',
      'Opravdu se chcete odhlásit?',
      [
        {
          text: 'Zrušit',
          style: 'cancel',
        },
        {
          text: 'Odhlásit',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Chyba', 'Nepodařilo se odhlásit. Zkuste to prosím znovu.');
            }
          },
        },
      ]
    );
  };

  const settingsOptions = [
    {
      id: '1',
      icon: 'person.fill',
      title: 'Účet',
      description: 'Spravujte svůj účet Email.cz',
    },
    {
      id: '2',
      icon: 'bell.fill',
      title: 'Oznámení',
      description: 'Nastavení upozornění a notifikací',
    },
    {
      id: '3',
      icon: 'envelope.badge.fill',
      title: 'Podpis emailu',
      description: 'Upravte svůj emailový podpis',
    },
    {
      id: '4',
      icon: 'folder.fill',
      title: 'Složky',
      description: 'Organizujte své emaily do složek',
    },
    {
      id: '5',
      icon: 'shield.fill',
      title: 'Soukromí a zabezpečení',
      description: 'Nastavení ochrany a bezpečnosti',
    },
    {
      id: '6',
      icon: 'paintbrush.fill',
      title: 'Vzhled',
      description: 'Přizpůsobte si vzhled aplikace',
    },
    {
      id: '7',
      icon: 'info.circle.fill',
      title: 'O aplikaci',
      description: 'Verze 1.0.0',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {Platform.OS !== 'ios' && (
        <View style={styles.androidHeader}>
          <Text style={styles.androidHeaderTitle}>Nastavení</Text>
        </View>
      )}
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <IconSymbol name="person.circle.fill" size={Platform.OS === 'android' ? 100 : 80} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{user?.name || 'Uživatel Email.cz'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'uzivatel@email.cz'}</Text>
          <View style={styles.authBadge}>
            <IconSymbol name="checkmark.shield.fill" size={16} color={colors.primary} />
            <Text style={styles.authBadgeText}>Přihlášeno přes Seznam.cz</Text>
          </View>
        </View>

        <View style={styles.settingsSection}>
          {settingsOptions.map((option) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.settingItem,
                pressed && styles.settingItemPressed,
              ]}
              onPress={() => console.log(`Open ${option.title}`)}
            >
              <View style={styles.settingIconContainer}>
                <IconSymbol
                  name={option.icon as any}
                  size={Platform.OS === 'android' ? 28 : 24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{option.title}</Text>
                <Text style={styles.settingDescription}>{option.description}</Text>
              </View>
              <IconSymbol
                name="chevron.right"
                size={Platform.OS === 'android' ? 24 : 20}
                color={colors.textSecondary}
              />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          onPress={handleLogout}
        >
          <IconSymbol name="arrow.right.square.fill" size={Platform.OS === 'android' ? 24 : 20} color={colors.card} />
          <Text style={styles.logoutButtonText}>Odhlásit se</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  androidHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
    elevation: 2,
  },
  androidHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Platform.OS === 'android' ? 20 : 16,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: Platform.OS === 'android' ? 32 : 24,
    marginBottom: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  avatarLarge: {
    marginBottom: 16,
  },
  userName: {
    fontSize: Platform.OS === 'android' ? 24 : 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  userEmail: {
    fontSize: Platform.OS === 'android' ? 16 : 15,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  authBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  authBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  settingsSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Platform.OS === 'android' ? 20 : 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
    minHeight: Platform.OS === 'android' ? 80 : 70,
  },
  settingItemPressed: {
    backgroundColor: colors.highlight,
  },
  settingIconContainer: {
    width: Platform.OS === 'android' ? 48 : 40,
    height: Platform.OS === 'android' ? 48 : 40,
    borderRadius: Platform.OS === 'android' ? 24 : 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Platform.OS === 'android' ? 18 : 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: Platform.OS === 'android' ? 15 : 14,
    color: colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: Platform.OS === 'android' ? 20 : 16,
    gap: 12,
    minHeight: Platform.OS === 'android' ? 60 : 50,
  },
  logoutButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  logoutButtonText: {
    fontSize: Platform.OS === 'android' ? 18 : 16,
    fontWeight: '700',
    color: colors.card,
  },
});
