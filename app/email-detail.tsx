
import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmailDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const { from, subject, date, preview } = params;

  // Mock full email content
  const fullContent = `${preview}

Dobrý den,

Děkuji za váš email a zájem o naši nabídku. Rád bych vám poskytl více informací o našich službách a produktech.

V příloze naleznete detailní dokumentaci a cenovou nabídku. Pokud budete mít jakékoliv dotazy, neváhejte mě kontaktovat.

Těším se na další spolupráci.

S pozdravem,
${from}

---
Email.cz - Váš spolehlivý emailový partner
www.email.cz`;

  const renderHeaderRight = () => (
    <View style={styles.headerActions}>
      <Pressable
        onPress={() => console.log('Reply to email')}
        style={styles.headerButton}
      >
        <IconSymbol name="arrowshape.turn.up.left.fill" color={colors.primary} size={Platform.OS === 'android' ? 26 : 22} />
      </Pressable>
      <Pressable
        onPress={() => console.log('Delete email')}
        style={styles.headerButton}
      >
        <IconSymbol name="trash.fill" color={colors.accent} size={Platform.OS === 'android' ? 26 : 22} />
      </Pressable>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Email",
          headerRight: renderHeaderRight,
          headerBackTitle: "Zpět",
        }}
      />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.avatarContainer}>
                <IconSymbol name="person.circle.fill" color={colors.primary} size={Platform.OS === 'android' ? 56 : 48} />
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.fromText}>{from}</Text>
                <Text style={styles.dateText}>{date}</Text>
              </View>
            </View>
            <Text style={styles.subjectText}>{subject}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.contentSection}>
            <Text style={styles.contentText}>{fullContent}</Text>
          </View>

          <View style={styles.actionButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.replyButton,
                pressed && styles.actionButtonPressed,
              ]}
              onPress={() => console.log('Reply to email')}
            >
              <IconSymbol name="arrowshape.turn.up.left.fill" color={colors.card} size={Platform.OS === 'android' ? 24 : 20} />
              <Text style={styles.actionButtonText}>Odpovědět</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.forwardButton,
                pressed && styles.actionButtonPressed,
              ]}
              onPress={() => console.log('Forward email')}
            >
              <IconSymbol name="arrowshape.turn.up.right.fill" color={colors.card} size={Platform.OS === 'android' ? 24 : 20} />
              <Text style={styles.actionButtonText}>Přeposlat</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: Platform.OS === 'android' ? 20 : 16,
  },
  header: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: Platform.OS === 'android' ? 20 : 16,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  fromText: {
    fontSize: Platform.OS === 'android' ? 20 : 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  dateText: {
    fontSize: Platform.OS === 'android' ? 15 : 14,
    color: colors.textSecondary,
  },
  subjectText: {
    fontSize: Platform.OS === 'android' ? 22 : 20,
    fontWeight: '700',
    color: colors.text,
    lineHeight: Platform.OS === 'android' ? 30 : 28,
  },
  divider: {
    height: 1,
    backgroundColor: colors.highlight,
    marginVertical: 16,
  },
  contentSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: Platform.OS === 'android' ? 20 : 16,
    marginBottom: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  contentText: {
    fontSize: Platform.OS === 'android' ? 17 : 16,
    lineHeight: Platform.OS === 'android' ? 28 : 24,
    color: colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'android' ? 18 : 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
    minHeight: Platform.OS === 'android' ? 60 : 50,
  },
  replyButton: {
    backgroundColor: colors.primary,
  },
  forwardButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  actionButtonText: {
    fontSize: Platform.OS === 'android' ? 17 : 16,
    fontWeight: '600',
    color: colors.card,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
