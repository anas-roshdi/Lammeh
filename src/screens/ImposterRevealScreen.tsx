import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Animated
} from 'react-native';
import { Search, UserX, ArrowLeft } from 'lucide-react-native';

// استدعاء الذاكرة المركزية
import { useGame } from '../context/GameContext';

export default function ImposterRevealScreen({ navigation }: any) {
    // جلب أسماء الضائعين الحقيقيين من الذاكرة المركزية
    const { imposters } = useGame();

    // تأمين المصفوفة لتجنب الأخطاء في حال عدم وجود ضائعين
    const safeImposters = imposters && imposters.length > 0 ? imposters : ["مجهول"];

    const [isRevealed, setIsRevealed] = useState(false);

    // أنميشن الترقب والظهور
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const revealScaleAnim = useRef(new Animated.Value(0.5)).current;
    const revealOpacityAnim = useRef(new Animated.Value(0)).current;

    // ملاحظة: سنقوم لاحقاً ببرمجة هذا المتغير ليعتمد على نتيجة شاشة التصويت الفعلية
    const WAS_CAUGHT = true;

    useEffect(() => {
        // Start pulsing animation
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
            ])
        );
        pulse.start();

        // Trigger reveal after 3.5 seconds
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

        // Cleanup timer
        return () => clearTimeout(timer);
    }, []);

    // تحديد هل يوجد ضايع واحد أم أكثر لضبط النطق والعرض
    const isMultiple = safeImposters.length > 1;

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>

                {!isRevealed ? (
                    /* ==================== مرحلة الترقب ==================== */
                    <View style={styles.suspenseContainer}>
                        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
                            <Search size={48} color="#ff7315" />
                        </Animated.View>
                        <Text style={styles.suspenseTitle}>جاري فرز الأصوات...</Text>
                        <Text style={styles.suspenseSubtitle}>لحظات ونكشف المستور!</Text>
                    </View>
                ) : (
                    /* ==================== مرحلة الكشف والاعلان ==================== */
                    <View style={styles.revealContainer}>

                        <View style={styles.revealHeader}>
                            <Text style={styles.revealHeaderTitle}>النتيجة النهائية</Text>
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
                                <View style={styles.imposterBadge}>
                                    <UserX size={20} color="#f6eefb" />
                                </View>

                                {/* يتغير النص هنا تلقائياً حسب العدد */}
                                <Text style={styles.revealSubtitle}>
                                    {isMultiple ? "الـضـائـعـيـن هـم..." : "الـضـائـع هـو..."}
                                </Text>

                                {/* عرض الأسماء ديناميكياً */}
                                <View style={styles.namesContainer}>
                                    {safeImposters.map((name) => (
                                        <Text
                                            key={name}
                                            style={[
                                                styles.imposterName,
                                                isMultiple ? styles.multipleNamesStyle : styles.singleNameStyle
                                            ]}
                                        >
                                            {name}
                                        </Text>
                                    ))}
                                </View>


                            </Animated.View>
                        </View>

                        {/* الفوتر */}
                        <View style={styles.footer}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.primaryButton}
                                onPress={() => navigation.navigate("ImposterGuess")}
                            >
                                <ArrowLeft size={24} color="#2a1b38" />
                                <Text style={styles.primaryButtonText}>التالي: الكلمة السرية</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}

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
        backgroundColor: '#2a1b38',
    },
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
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#ff4b4b',
        borderRadius: 32,
        alignItems: 'center',
        paddingVertical: 44,
        paddingHorizontal: 24,
        elevation: 16,
        shadowColor: '#ff4b4b',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.4,
        shadowRadius: 32,
        maxHeight: 550,
        maxWidth: 650,
        height: '55%',

    },
    imposterBadge: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(246, 238, 251, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    revealSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(246, 238, 251, 0.8)',
        marginBottom: 16,
        letterSpacing: 2,
        paddingBottom: 1
    },
    namesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 28,
        width: '100%',
    },
    imposterName: {
        fontWeight: '900',
        color: '#ffffff',
        textAlign: 'center',
        paddingBottom: 15
    },
    singleNameStyle: {
        fontSize: 60,
        lineHeight: 68,
    },
    multipleNamesStyle: {
        fontSize: 42,
        lineHeight: 50,
        marginVertical: 4,
    },
    statusCaught: {
        backgroundColor: 'rgba(246, 238, 251, 0.2)',
    },
    statusEscaped: {
        backgroundColor: '#2a1b38',
    },

    statusTextCaught: {
        color: '#ffffff',
    },
    statusTextEscaped: {
        color: '#ff7315',
    },
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