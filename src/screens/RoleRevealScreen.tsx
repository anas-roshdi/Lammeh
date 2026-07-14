import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Animated,
    Pressable,
    ActivityIndicator
} from 'react-native';
import { ChevronRight, Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGame } from '../context/GameContext';
import { initDB, getRandomWord, getCategories } from '../services/DatabaseService';
import { Audio } from 'expo-av';

const HOLD_DURATION = 1100;

export default function RoleRevealScreen({ navigation }: any) {
    // Add secretWord and imposters to the destructured context to use them for checks
    const { players, impostersCount, selectedCategoryId, secretWord, imposters, setSecretWord, setImposters, categoryPool, setSelectedCategoryId } = useGame();

    const [isLoading, setIsLoading] = useState(true);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [localSecretWord, setLocalSecretWord] = useState<string>('');
    const [localImposters, setLocalImposters] = useState<string[]>([]);
    const [revealed, setRevealed] = useState(false);

    const holdProgress = useRef(new Animated.Value(0)).current;

    // Ref to lock the fetch process and prevent double-fetching bugs
    const isFetching = useRef(false);

    useEffect(() => {
        const setupRound = async () => {
            // 1. Prevent duplicate executions caused by state re-renders
            if (isFetching.current) return;
            isFetching.current = true;

            try {
                const db = await initDB();
                if (db) {
                    let finalCategoryId = selectedCategoryId;

                    // If a category hasn't been selected for this round yet
                    if (finalCategoryId === null) {
                        const cats = await getCategories(db);
                        let pool = categoryPool.length > 0 ? categoryPool : cats.map((c: any) => c.id);
                        const randomIndex = Math.floor(Math.random() * pool.length);
                        finalCategoryId = pool[randomIndex];
                        setSelectedCategoryId(finalCategoryId);
                    }

                    // Fetch the word based on the selected category
                    if (finalCategoryId) {
                        const word = await getRandomWord(db, finalCategoryId);
                        if (word) {
                            setLocalSecretWord(word);
                            setSecretWord(word);
                        } else {
                            setLocalSecretWord('كلمة مجهولة');
                            setSecretWord('كلمة مجهولة');
                        }
                    }
                }

                // Randomly distribute the "imposter" role
                const safePlayers = players && players.length > 0 ? [...players] : ["لاعب افتراضي"];
                const shuffledPlayers = safePlayers.sort(() => 0.5 - Math.random());
                const pickedImposters = shuffledPlayers.slice(0, impostersCount || 1);

                setLocalImposters(pickedImposters);
                setImposters(pickedImposters);

            } catch (error) {
                console.error("Error setting up the round:", error);
                setLocalSecretWord('خطأ في النظام');
            } finally {
                setIsLoading(false);
            }
        };

        // 2. Only run setup if we don't already have a secret word in the global context
        if (!secretWord) {
            setupRound();
        } else {
            // Sync local state to match the context and skip fetching
            setLocalSecretWord(secretWord);
            setLocalImposters(imposters);
            setIsLoading(false);
        }

        // Include all necessary dependencies
    }, [players, impostersCount, selectedCategoryId, categoryPool, secretWord, imposters]);

    const PLAYER_TOTAL = players?.length || 1;
    const PLAYER_INDEX = currentPlayerIndex + 1;
    const currentPlayerName = players?.[currentPlayerIndex] || "لاعب غير معروف";
    const isImposter = localImposters.includes(currentPlayerName);

    const PLAYER = {
        name: currentPlayerName,
        role: isImposter ? "الضائع" : localSecretWord,
        roleHint: isImposter
            ? "اكتشف الكلمة السرية دون أن ينكشف أمرك"
            : "أنت داخل السالفة، لمح لها بذكاء",
    };

    const playRevealSound = async () => {
        try {
            const savedSound = await AsyncStorage.getItem('isSoundEnabled');

            if (savedSound === null || savedSound === 'true') {
                const { sound } = await Audio.Sound.createAsync(
                    require('../../assets/sounds/reveal.mp3')
                );

                await sound.playAsync();

                sound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded && status.didJustFinish) {
                        sound.unloadAsync();
                    }
                });
            }
        } catch (error) {
            console.error('Error playing reveal sound: ', error);
        }
    };

    const handlePressIn = () => {
        if (revealed) return;

        Animated.timing(holdProgress, {
            toValue: 1,
            duration: HOLD_DURATION,
            useNativeDriver: false,
        }).start(async ({ finished }) => {
            if (finished) {
                setRevealed(true);

                const savedVibration = await AsyncStorage.getItem('isVibrationEnabled');
                if (savedVibration === null || savedVibration === 'true') {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }

                await playRevealSound();
            }
        });
    };

    const handlePressOut = () => {
        if (revealed) return;
        holdProgress.stopAnimation();
        Animated.timing(holdProgress, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const handleNextPlayer = () => {
        if (currentPlayerIndex < PLAYER_TOTAL - 1) {
            setRevealed(false);
            holdProgress.setValue(0);
            setCurrentPlayerIndex((prev) => prev + 1);
        } else {
            navigation.navigate('HintingPhase');
        }
    };

    const passReady = revealed;
    const isLastPlayer = currentPlayerIndex === PLAYER_TOTAL - 1;

    const cardScale = holdProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.96]
    });

    const fillScale = holdProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 25]
    });

    if (isLoading) {
        return (
            <SafeAreaView style={styles.root}>
                <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                    <ActivityIndicator size="large" color="#ff7315" />
                    <Text style={{ color: '#b9a6cc', marginTop: 16 }}>جاري تجهيز السالفة وتوزيع الأدوار...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <ChevronRight size={24} color="#b9a6cc" />
                    </TouchableOpacity>
                    <View style={styles.progressBadge}>
                        <Text style={styles.progressBadgeText}>
                            اللاعب {PLAYER_INDEX} من {PLAYER_TOTAL}
                        </Text>
                    </View>
                    <View style={styles.spacer} />
                </View>

                <View style={styles.dotsContainer}>
                    {Array.from({ length: PLAYER_TOTAL }).map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                i < PLAYER_INDEX ? styles.dotActive : styles.dotInactive
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.mainContent}>
                    <Text style={styles.passSubtitle}>مرر الجوال إلى</Text>
                    <Text style={styles.playerName}>{PLAYER.name}</Text>

                    <Pressable
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        style={styles.cardWrapper}
                    >
                        <Animated.View style={[
                            styles.secretCard,
                            revealed ? styles.secretCardRevealed : styles.secretCardHidden,
                            { transform: [{ scale: revealed ? 1 : cardScale }] }
                        ]}>
                            {!revealed && (
                                <Animated.View style={[
                                    styles.fillBackground,
                                    { transform: [{ scale: fillScale }] }
                                ]} />
                            )}
                            {revealed ? (
                                <View style={styles.revealedContent}>
                                    <Text style={styles.roleText}>{PLAYER.role}</Text>
                                    <Text style={styles.roleHint}>{PLAYER.roleHint}</Text>
                                    <View style={styles.warningContainer}>
                                        <EyeOff size={14} color="#b9a6cc" />
                                        <Text style={styles.warningText}>لا تدع أحداً يرى الشاشة</Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.hiddenContent}>
                                    <View style={styles.lockIconContainer}>
                                        <Lock size={36} color="#ff7315" />
                                    </View>
                                    <Text style={styles.holdText}>اضغط مطولاً لكشف دورك</Text>
                                    <Text style={styles.holdSubtext}>استمر بالضغط حتى تظهر البطاقة</Text>
                                </View>
                            )}
                        </Animated.View>
                    </Pressable>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        disabled={!passReady}
                        activeOpacity={0.8}
                        style={[styles.primaryButton, !passReady && styles.primaryButtonDisabled]}
                        onPress={handleNextPlayer}
                    >
                        <ArrowLeft size={20} color={passReady ? "#2a1b38" : "#b9a6cc"} />
                        <Text style={[styles.primaryButtonText, !passReady && styles.primaryButtonTextDisabled]}>
                            {isLastPlayer ? "ابدأ التلميحات" : "مرر للاعب التالي"}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.footerHintText}>
                        {passReady ? "أخفِ دورك ثم مرر الجوال" : "اكشف دورك أولاً قبل التمرير"}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#2a1b38',
    },
    container: {
        flex: 1,
        maxWidth: 650,
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 35,
        paddingBottom: 16,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(58, 38, 80, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#4a3563',
    },
    progressBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: 'rgba(58, 38, 80, 0.7)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#4a3563',
        gap: 8,
    },
    progressBadgeText: {
        color: '#b9a6cc',
        fontSize: 14,
        fontWeight: '500',
    },
    spacer: {
        width: 40,
    },
    dotsContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        gap: 8,
        marginTop: 16,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
    dotActive: {
        width: 24,
        backgroundColor: '#ff7315',
    },
    dotInactive: {
        width: 12,
        backgroundColor: '#4a3563',
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        paddingHorizontal: 30,
    },
    passSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#b9a6cc',
        marginBottom: 4,
    },
    playerName: {
        fontSize: 36,
        fontWeight: '900',
        color: '#f6eefb',
        paddingBottom: 5
    },
    cardWrapper: {
        width: '100%',
        maxHeight: 650,
        maxWidth: 650,
        aspectRatio: 3 / 4,
        marginTop: 32,
    },
    secretCard: {
        flex: 1,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        overflow: 'hidden',
    },
    secretCardHidden: {
        backgroundColor: '#3a2650',
        borderWidth: 2,
        borderColor: 'rgba(255, 115, 21, 0.4)',
        borderStyle: 'dashed',
    },
    secretCardRevealed: {
        backgroundColor: '#3a2650',
        borderWidth: 2,
        borderColor: 'rgba(78, 204, 163, 0.6)',
        elevation: 10,
        shadowColor: '#4ecca3',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    fillBackground: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 115, 21, 0.2)',
        zIndex: 0,
    },
    hiddenContent: {
        alignItems: 'center',
        zIndex: 1,
    },
    lockIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 115, 21, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 115, 21, 0.3)',
        marginBottom: 24,
    },
    holdText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f6eefb',
    },
    holdSubtext: {
        fontSize: 14,
        color: '#b9a6cc',
        marginTop: 8,
        textAlign: 'center',
    },
    revealedContent: {
        alignItems: 'center',
        zIndex: 1,
    },

    roleText: {
        textAlign: 'center',
        flexShrink: 1,
        flexWrap: 'wrap',
        width: '100%',
        fontSize: 48,
        fontWeight: '900',
        color: '#f6eefb',
        marginBottom: 16,
        paddingBottom: 7
    },
    roleHint: {
        fontSize: 14,
        color: '#b9a6cc',
        textAlign: 'center',
        lineHeight: 22,
    },
    warningContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginTop: 24,
        gap: 6,
    },
    warningText: {
        fontSize: 12,
        color: '#b9a6cc',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(246, 238, 251, 0.1)',
        backgroundColor: 'rgba(42, 27, 56, 0.8)',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 32,
    },
    primaryButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff7315',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 12,
    },
    primaryButtonDisabled: {
        backgroundColor: 'rgba(58, 38, 80, 0.6)',
        borderWidth: 1,
        borderColor: '#4a3563',
    },
    primaryButtonText: {
        color: '#2a1b38',
        fontSize: 16,
        fontWeight: 'bold',
    },
    primaryButtonTextDisabled: {
        color: '#b9a6cc',
    },
    footerHintText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#b9a6cc',
        marginTop: 12,
    },
});