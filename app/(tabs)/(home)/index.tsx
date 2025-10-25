
import React, { useState } from "react";
import { Stack } from "expo-router";
import { FlatList, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";

// Mock email data
interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
}

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'Jan Novák',
    subject: 'Důležitá zpráva o projektu',
    preview: 'Dobrý den, rád bych s vámi projednal aktuální stav projektu...',
    date: '10:30',
    read: false,
  },
  {
    id: '2',
    from: 'Petra Svobodová',
    subject: 'Pozvánka na schůzku',
    preview: 'Ráda bych vás pozvala na schůzku, která se bude konat příští týden...',
    date: '09:15',
    read: false,
  },
  {
    id: '3',
    from: 'Martin Dvořák',
    subject: 'Odpověď na váš dotaz',
    preview: 'Děkuji za váš email. Rád vám odpovím na vaše otázky...',
    date: 'Včera',
    read: true,
  },
  {
    id: '4',
    from: 'Email.cz Tým',
    subject: 'Novinky v Email.cz',
    preview: 'Představujeme vám nové funkce a vylepšení našeho emailového klienta...',
    date: 'Včera',
    read: true,
  },
  {
    id: '5',
    from: 'Lucie Procházková',
    subject: 'Fotografie z dovolené',
    preview: 'Ahoj! Posílám ti fotky z naší dovolené v Chorvatsku...',
    date: '15.1.',
    read: true,
  },
  {
    id: '6',
    from: 'Tomáš Černý',
    subject: 'Nabídka spolupráce',
    preview: 'Dobrý den, chtěl bych vám nabídnout zajímavou obchodní příležitost...',
    date: '14.1.',
    read: true,
  },
  {
    id: '7',
    from: 'Kateřina Malá',
    subject: 'Potvrzení objednávky',
    preview: 'Vaše objednávka č. 12345 byla úspěšně přijata a bude zpracována...',
    date: '13.1.',
    read: true,
  },
  {
    id: '8',
    from: 'Jiří Veselý',
    subject: 'Připomínka platby',
    preview: 'Dovolujeme si vám připomenout, že se blíží termín platby faktury...',
    date: '12.1.',
    read: true,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>(mockEmails);

  const renderEmailItem = ({ item }: { item: Email }) => (
    <Pressable
      style={({ pressed }) => [
        styles.emailCard,
        pressed && styles.emailCardPressed,
      ]}
      onPress={() => {
        // Mark as read
        setEmails(prevEmails =>
          prevEmails.map(email =>
            email.id === item.id ? { ...email, read: true } : email
          )
        );
        router.push({
          pathname: '/email-detail',
          params: {
            id: item.id,
            from: item.from,
            subject: item.subject,
            date: item.date,
            preview: item.preview,
          },
        });
      }}
    >
      <View style={styles.emailHeader}>
        <View style={styles.emailIconContainer}>
          <IconSymbol
            name={item.read ? "envelope.open.fill" : "envelope.fill"}
            color={item.read ? colors.textSecondary : colors.primary}
            size={Platform.OS === 'android' ? 32 : 24}
          />
        </View>
        <View style={styles.emailContent}>
          <View style={styles.emailTopRow}>
            <Text
              style={[
                styles.emailFrom,
                !item.read && styles.emailFromUnread,
              ]}
              numberOfLines={1}
            >
              {item.from}
            </Text>
            <Text style={styles.emailDate}>{item.date}</Text>
          </View>
          <Text
            style={[
              styles.emailSubject,
              !item.read && styles.emailSubjectUnread,
            ]}
            numberOfLines={1}
          >
            {item.subject}
          </Text>
          <Text style={styles.emailPreview} numberOfLines={2}>
            {item.preview}
          </Text>
        </View>
      </View>
      {!item.read && <View style={styles.unreadIndicator} />}
    </Pressable>
  );

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Compose new email')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="square.and.pencil" color={colors.primary} size={Platform.OS === 'android' ? 28 : 24} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => console.log('Open settings')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol
        name="gear"
        color={colors.primary}
        size={Platform.OS === 'android' ? 28 : 24}
      />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Doručená pošta",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <View style={styles.container}>
        {Platform.OS !== 'ios' && (
          <View style={styles.androidHeader}>
            <Pressable
              onPress={() => console.log('Open settings')}
              style={styles.androidHeaderButton}
            >
              <IconSymbol name="gear" color={colors.primary} size={28} />
            </Pressable>
            <Text style={styles.androidHeaderTitle}>Doručená pošta</Text>
            <Pressable
              onPress={() => console.log('Compose new email')}
              style={styles.androidHeaderButton}
            >
              <IconSymbol name="square.and.pencil" color={colors.primary} size={28} />
            </Pressable>
          </View>
        )}
        <FlatList
          data={emails}
          renderItem={renderEmailItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            Platform.OS !== 'ios' && styles.listContainerWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  androidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  androidHeaderButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  emailCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: Platform.OS === 'android' ? 20 : 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
    minHeight: Platform.OS === 'android' ? 120 : 100,
  },
  emailCardPressed: {
    backgroundColor: colors.highlight,
    transform: [{ scale: 0.98 }],
  },
  emailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  emailIconContainer: {
    marginRight: 16,
    paddingTop: 4,
    minWidth: Platform.OS === 'android' ? 40 : 32,
    alignItems: 'center',
  },
  emailContent: {
    flex: 1,
  },
  emailTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  emailFrom: {
    fontSize: Platform.OS === 'android' ? 18 : 16,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  emailFromUnread: {
    fontWeight: '700',
  },
  emailDate: {
    fontSize: Platform.OS === 'android' ? 15 : 13,
    color: colors.textSecondary,
  },
  emailSubject: {
    fontSize: Platform.OS === 'android' ? 17 : 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  emailSubjectUnread: {
    fontWeight: '700',
  },
  emailPreview: {
    fontSize: Platform.OS === 'android' ? 15 : 14,
    color: colors.textSecondary,
    lineHeight: Platform.OS === 'android' ? 22 : 20,
  },
  headerButtonContainer: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
});
