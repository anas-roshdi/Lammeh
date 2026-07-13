// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameProvider } from './src/context/GameContext'; // Import the provider
import { I18nManager } from 'react-native';

// Force the app to use Left-to-Right layout so your custom design doesn't flip automatically
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

// استدعاء الشاشات
import HomeScreen from './src/screens/HomeScreen';
import CategorySelectionScreen from './src/screens/CategorySelectionScreen';
import PlayersSetupScreen from './src/screens/PlayersSetupScreen';
import RoleRevealScreen from './src/screens/RoleRevealScreen';
import HintingPhaseScreen from './src/screens/HintingPhaseScreen';
import VotingPhaseScreen from './src/screens/VotingPhaseScreen';
import ImposterRevealScreen from './src/screens/ImposterRevealScreen';
import ImposterGuessScreen from './src/screens/ImposterGuessScreen';
import SecretWordRevealScreen from './src/screens/SecretWordRevealScreen';
import FinalResultsScreen from './src/screens/FinalResultsScreen';
import HowToPlayScreen from './src/screens/HowToPlayScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />

          {/* إضافة شاشة كيفية اللعب */}
          <Stack.Screen
            name="HowToPlay"
            component={HowToPlayScreen}
            options={{ headerShown: false }}
          />
          {/* إضافة شاشة اختيار الفئات */}
          <Stack.Screen
            name="CategorySelection"
            component={CategorySelectionScreen}
            options={{ headerShown: false }}
          />
          {/* شاشة إعدادات اللاعبين */}
          <Stack.Screen
            name="PlayersSetup"
            component={PlayersSetupScreen}
            options={{ headerShown: false }}
          />
          {/* شاشة كشف الدور */}
          <Stack.Screen
            name="RoleReveal"
            component={RoleRevealScreen}
            options={{ headerShown: false }}
          />
          {/* شاشة إعطاء التلميحات */}
          <Stack.Screen
            name="HintingPhase"
            component={HintingPhaseScreen}
            options={{ headerShown: false }}
          />
          {/* شاشة التصويت */}
          <Stack.Screen
            name="VotingPhase"
            component={VotingPhaseScreen}
            options={{ headerShown: false }}
          />
          {/* شاشة كشف الدخيل */}
          <Stack.Screen
            name="ImposterReveal"
            component={ImposterRevealScreen}
            options={{ headerShown: false }}
          />
          {/* شاشة تخمين الكلمة السرية */}
          <Stack.Screen
            name="ImposterGuess"
            component={ImposterGuessScreen}
            options={{ headerShown: false }}
          />
          {/* شاشة كشف الكلمة السرية */}
          <Stack.Screen
            name="SecretWordReveal"
            component={SecretWordRevealScreen}
            options={{ headerShown: false }}
          />
          {/* شاشة النتائج النهائية */}
          <Stack.Screen
            name="FinalResults"
            component={FinalResultsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}