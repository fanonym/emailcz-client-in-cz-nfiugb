
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Platform,
  Alert,
  TextInput,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';

// Conditionally import WebView only on supported platforms
let WebView: any = null;
const isWebViewSupported = Platform.OS === 'ios' || Platform.OS === 'android';

if (isWebViewSupported) {
  try {
    const webViewModule = require('react-native-webview');
    WebView = webViewModule.WebView;
  } catch (error) {
    console.log('WebView not available on this platform');
  }
}

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);
  const webViewRef = useRef<any>(null);

  // Seznam.cz login URL
  const SEZNAM_LOGIN_URL = 'https://login.szn.cz/';

  const handleNativeLogin = async () => {
    if (!email || !password) {
      Alert.alert('Chyba', 'Prosím vyplňte email a heslo');
      return;
    }

    setIsLoading(true);
    
    // For demonstration, we'll use WebView for actual Seznam.cz authentication
    if (isWebViewSupported && WebView) {
      setWebViewUrl(SEZNAM_LOGIN_URL);
      setShowWebView(true);
      setIsLoading(false);
    } else {
      // On unsupported platforms, open in external browser
      try {
        const supported = await Linking.canOpenURL(SEZNAM_LOGIN_URL);
        if (supported) {
          await Linking.openURL(SEZNAM_LOGIN_URL);
          Alert.alert(
            'Přihlášení v prohlížeči',
            'Přihlaste se v prohlížeči a poté se vraťte do aplikace.',
            [
              {
                text: 'Jsem přihlášen',
                onPress: async () => {
                  try {
                    await login(email || 'uzivatel@email.cz', {
                      timestamp: Date.now(),
                      loginMethod: 'external-browser',
                    });
                    console.log('Login successful, navigating to home...');
                    router.replace('/(tabs)/(home)');
                  } catch (error) {
                    console.error('Login error:', error);
                    Alert.alert('Chyba', 'Nepodařilo se přihlásit. Zkuste to prosím znovu.');
                  }
                },
              },
              { text: 'Zrušit', style: 'cancel' },
            ]
          );
        }
      } catch (error) {
        console.error('Error opening URL:', error);
        Alert.alert('Chyba', 'Nepodařilo se otevřít přihlašovací stránku.');
      }
      setIsLoading(false);
    }
  };

  const handleWebViewLogin = async () => {
    if (!isWebViewSupported || !WebView) {
      // On unsupported platforms, open in external browser
      try {
        const supported = await Linking.canOpenURL(SEZNAM_LOGIN_URL);
        if (supported) {
          await Linking.openURL(SEZNAM_LOGIN_URL);
          Alert.alert(
            'Přihlášení v prohlížeči',
            'Přihlaste se v prohlížeči a poté se vraťte do aplikace.',
            [
              {
                text: 'Jsem přihlášen',
                onPress: async () => {
                  try {
                    await login(email || 'uzivatel@email.cz', {
                      timestamp: Date.now(),
                      loginMethod: 'external-browser',
                    });
                    console.log('Login successful, navigating to home...');
                    router.replace('/(tabs)/(home)');
                  } catch (error) {
                    console.error('Login error:', error);
                    Alert.alert('Chyba', 'Nepodařilo se přihlásit. Zkuste to prosím znovu.');
                  }
                },
              },
              { text: 'Zrušit', style: 'cancel' },
            ]
          );
        }
      } catch (error) {
        console.error('Error opening URL:', error);
        Alert.alert('Chyba', 'Nepodařilo se otevřít přihlašovací stránku.');
      }
      return;
    }

    setIsLoading(true);
    setWebViewUrl(SEZNAM_LOGIN_URL);
    setShowWebView(true);
    setIsLoading(false);
  };

  const handleWebViewNavigationStateChange = async (navState: any) => {
    console.log('WebView navigation:', navState.url);

    // Prevent multiple simultaneous login attempts
    if (isProcessingLogin) {
      console.log('Login already in progress, skipping...');
      return;
    }

    // Check if user successfully logged in by detecting redirect or specific URL patterns
    // Seznam.cz typically redirects to email.cz or homepage after successful login
    const isSuccessfulLogin = 
      navState.url.includes('email.cz') ||
      navState.url.includes('homepage.szn.cz') ||
      navState.url.includes('?login=success') ||
      (navState.url.includes('szn.cz') && !navState.url.includes('login.szn.cz'));

    if (isSuccessfulLogin) {
      console.log('Successful login detected, processing...');
      setIsProcessingLogin(true);

      try {
        // Extract email from URL or use the entered email
        const userEmail = email || 'uzivatel@email.cz';
        
        console.log('Calling login function...');
        await login(userEmail, {
          timestamp: Date.now(),
          loginMethod: 'seznam-webview',
          loginUrl: navState.url,
        });

        console.log('Login successful, closing WebView...');
        
        // Close WebView first
        setShowWebView(false);
        setWebViewUrl('');
        
        // Small delay to ensure WebView is closed before navigation
        setTimeout(() => {
          console.log('Navigating to home screen...');
          router.replace('/(tabs)/(home)');
          setIsProcessingLogin(false);
        }, 100);

      } catch (error) {
        console.error('Login error:', error);
        setIsProcessingLogin(false);
        setShowWebView(false);
        Alert.alert('Chyba', 'Nepodařilo se přihlásit. Zkuste to prosím znovu.');
      }
    }
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    Alert.alert('Chyba', 'Nepodařilo se načíst přihlašovací stránku.');
    setShowWebView(false);
    setIsProcessingLogin(false);
  };

  const handleCloseWebView = () => {
    console.log('Closing WebView manually');
    setShowWebView(false);
    setWebViewUrl('');
    setIsProcessingLogin(false);
  };

  // WebView UI (only shown on iOS/Android)
  if (showWebView && isWebViewSupported && WebView) {
    return (
      <SafeAreaView style={styles.webViewContainer} edges={['top']}>
        <View style={styles.webViewHeader}>
          <Pressable
            onPress={handleCloseWebView}
            style={styles.closeButton}
          >
            <IconSymbol name="xmark.circle.fill" size={32} color={colors.primary} />
          </Pressable>
          <Text style={styles.webViewTitle}>Přihlášení Seznam.cz</Text>
          <View style={{ width: 32 }} />
        </View>
        {isProcessingLogin && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.processingText}>Přihlašování...</Text>
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{ uri: webViewUrl }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          onError={handleWebViewError}
          style={styles.webView}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Načítání...</Text>
            </View>
          )}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <IconSymbol
            name="envelope.circle.fill"
            size={Platform.OS === 'android' ? 120 : 100}
            color={colors.primary}
          />
          <Text style={styles.appTitle}>Email.cz</Text>
          <Text style={styles.appSubtitle}>Přihlášení přes Seznam.cz</Text>
        </View>

        {!isWebViewSupported && (
          <View style={styles.platformWarning}>
            <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.warning || '#FF9500'} />
            <Text style={styles.platformWarningText}>
              WebView není podporován na této platformě ({Platform.OS}). 
              Přihlášení bude otevřeno v externím prohlížeči.
            </Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <IconSymbol name="envelope.fill" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Heslo"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <IconSymbol
                name={showPassword ? "eye.slash.fill" : "eye.fill"}
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleNativeLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.card} />
            ) : (
              <>
                <IconSymbol name="arrow.right.circle.fill" size={24} color={colors.card} />
                <Text style={styles.loginButtonText}>Přihlásit se</Text>
              </>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>nebo</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.webLoginButton,
              pressed && styles.webLoginButtonPressed,
            ]}
            onPress={handleWebViewLogin}
          >
            <IconSymbol name="globe" size={24} color={colors.primary} />
            <Text style={styles.webLoginButtonText}>
              {isWebViewSupported 
                ? 'Přihlásit přes Seznam.cz web' 
                : 'Přihlásit v prohlížeči'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.helpButton}
            onPress={() => Alert.alert('Nápověda', 'Pro přihlášení použijte své přihlašovací údaje k Seznam.cz účtu.')}
          >
            <Text style={styles.helpButtonText}>Potřebujete pomoc?</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Přihlášením souhlasíte s podmínkami použití
          </Text>
          <Text style={styles.footerText}>
            Email.cz © 2024
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Platform.OS === 'android' ? 24 : 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 60 : 40,
  },
  appTitle: {
    fontSize: Platform.OS === 'android' ? 36 : 32,
    fontWeight: '800',
    color: colors.text,
    marginTop: 20,
  },
  appSubtitle: {
    fontSize: Platform.OS === 'android' ? 18 : 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  platformWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.warning || '#FF9500',
  },
  platformWarningText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'android' ? 16 : 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.highlight,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: Platform.OS === 'android' ? 18 : 16,
    color: colors.text,
  },
  eyeButton: {
    padding: 4,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: Platform.OS === 'android' ? 18 : 16,
    marginTop: 8,
    gap: 12,
  },
  loginButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: Platform.OS === 'android' ? 18 : 16,
    fontWeight: '700',
    color: colors.card,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.highlight,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },
  webLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: Platform.OS === 'android' ? 18 : 16,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: 12,
  },
  webLoginButtonPressed: {
    backgroundColor: colors.highlight,
    transform: [{ scale: 0.98 }],
  },
  webLoginButtonText: {
    fontSize: Platform.OS === 'android' ? 18 : 16,
    fontWeight: '700',
    color: colors.primary,
  },
  helpButton: {
    alignItems: 'center',
    marginTop: 20,
    padding: 8,
  },
  helpButtonText: {
    fontSize: Platform.OS === 'android' ? 16 : 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  closeButton: {
    padding: 4,
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  processingText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});
