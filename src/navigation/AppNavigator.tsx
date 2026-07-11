import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Import placeholder screens (We will build these in the UI phase)
import HomeScreen from '../screens/HomeScreen';
import SetupScreen from '../screens/SetupScreen';

// Initialize the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            {/* Main Screen */}
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            {/* Game Setup Screen */}
            <Stack.Screen
                name="Setup"
                component={SetupScreen}
                options={{ title: 'إعدادات اللعبة', headerTitleAlign: 'center' }}
            />
            {/* We will add the rest of the screens here as we build them */}
        </Stack.Navigator>
    );
};

export default AppNavigator;