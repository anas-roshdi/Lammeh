import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Animated
} from 'react-native';
import { Sparkles, HelpCircle, ArrowLeft } from 'lucide-react-native';

// Import Context and Database services
import { useGame } from '../context/GameContext';
import { initDB, getCategories } from '../services/DatabaseService';

export default function SecretWordRevealScreen({ navigation }: any) {
    // Fetch the secret word and category ID from the global state
    const { secretWord, selectedCategoryId } = useGame();

    // State to toggle between suspense and reveal phases
    const [isRevealed, setIsRevealed] = useState(false);
    const [categoryName, setCategoryName] = useState("جاري التحميل...");

    // Animation values
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const revealScaleAnim = useRef(new Animated.Value(0.5)).current;
    const revealOpacityAnim = useRef(new Animated.Value(0)).current;

    // Fetch the real category name and icon from the database
    useEffect(() => {
        const fetchCategory = async () => {
            if (selectedCategoryId) {
                const db = await initDB();
                if (db) {
                    const cats = await getCategories(db);
                    const cat = cats.find(c => c.id === selectedCategoryId);
                    if (cat) {
                        setCategoryName(`${cat.name} ${cat.icon}`);
                    } else {
                        setCategoryName('فئة مجهولة');
                    }
                }
            }
        };
        fetchCategory();
    }, [selectedCategoryId]);

    useEffect(() => {
        // 1. Start the pulsing animation for suspense
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
            ])
        );
        pulse.start();

        // 2. Trigger the spring reveal animation after 3.5 seconds
        const timer = setTimeout(() => {
            pulse.stop();
            setIsRevealed(true);

            Animated.parallel([
                Animated.spring(revealScaleAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: true
                }),
                Animated.timing(revealOpacityAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true
                }),
            ]).start();
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    // Fallback if secret word is missing
    const displayWord = secretWord || "كلمة مجهولة";

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {!isRevealed ? (
                    /* ==================== SUSPENSE PHASE ==================== */
                    <View style={styles.suspenseContainer}>
                        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
                            <HelpCircle size={48} color="#ff7315" />
                        </Animated.View>
                        <Text style={styles.suspenseTitle}>تجهيز الكلمة السرية...</Text>
                        <Text style={styles.suspenseSubtitle}>هل نجح الضائعون في التخمين؟</Text>
                    </View>
                ) : (
                    /* ==================== REVEAL PHASE ==================== */
                    <View style={styles.revealContainer}>

                        <View style={styles.revealHeader}>
                            <Text style={styles.revealHeaderTitle}>نهاية الجولة</Text>
                        </View>

                        <View style={styles.cardWrapper}>
                            <Animated.View
                                style={[
                                    styles.revealCard,
                                    {
                                        opacity: revealOpacityAnim,
                                        transform: [{ scale: revealScaleAnim }]
                                    }
                                ]}
                            >
                                <View style={styles.wordBadge}>
                                    <Sparkles size={24} color="#2a1b38" />
                                </View>

                                <Text style={styles.revealSubtitle}>الكلمة السرية كانت...</Text>
                                <Text style={styles.secretWordText}>{displayWord}</Text>

                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryBadgeText}>من فئة: {categoryName}</Text>
                                </View>
                            </Animated.View>
                        </View>

                        {/* Footer button to go to final game scoreboard / leaderboard */}
                        <View style={styles.footer}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.primaryButton}
                                onPress={() => {
                                    navigation.navigate('FinalResults');
                                }}
                            >
                                <ArrowLeft size={24} color="#2a1b38" />
                                <Text style={styles.primaryButtonText}>شاشة النتائج والترتيب</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#2a1b38',
    },
    container: {
        flex: 1,
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center',
    },

    // Suspense styles
    suspenseContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    pulseCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 115, 21, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 115, 21, 0.4)',
        marginBottom: 40,
    },
    suspenseTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#f6eefb',
        marginBottom: 12,
    },
    suspenseSubtitle: {
        fontSize: 16,
        color: '#b9a6cc',
    },

    // Reveal styles
    revealContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    revealHeader: {
        alignItems: 'center',
        paddingTop: 45,
        paddingBottom: 16,
    },
    revealHeaderTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#f6eefb',
    },
    cardWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    revealCard: {
        width: '100%',
        backgroundColor: '#ff7315', // Vibrant orange card for the ultimate word reveal
        borderRadius: 32,
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
        elevation: 16,
        shadowColor: '#ff7315',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.4,
        shadowRadius: 32,
    },
    wordBadge: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#f6eefb',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    revealSubtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2a1b38',
        marginBottom: 12,
        opacity: 0.8,
    },
    secretWordText: {
        fontSize: 60,
        fontWeight: '900',
        color: '#2a1b38', // Dark text on light orange surface for maximum readability
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 68,
    },
    categoryBadge: {
        backgroundColor: '#2a1b38',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
    },
    categoryBadgeText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#f6eefb',
    },

    // Footer styles
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    primaryButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6eefb',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 12,
        elevation: 4,
        shadowColor: '#f6eefb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    primaryButtonText: {
        color: '#2a1b38',
        fontSize: 18,
        fontWeight: 'bold',
    },
});