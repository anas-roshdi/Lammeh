import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Animated
} from 'react-native';
import { ArrowLeft, Vote, Eye, EyeOff, Lightbulb, ChevronRight } from 'lucide-react-native';

// استدعاء الذاكرة المركزية وخدمات قاعدة البيانات
import { useGame } from '../context/GameContext';
import { initDB, getCategories } from '../services/DatabaseService';

export default function HintingPhaseScreen({ navigation }: any) {
    // سحب اللاعبين والـ ID الخاص بالفئة من الذاكرة المركزية
    const { players, selectedCategoryId } = useGame();

    const [index, setIndex] = useState(0);
    const [categoryRevealed, setCategoryRevealed] = useState(false);
    const [everyoneHinted, setEveryoneHinted] = useState(false);
    const [round, setRound] = useState(1);
    const [categoryName, setCategoryName] = useState("جاري التحميل..."); // حالة جديدة لاسم الفئة

    // جلب اسم الفئة الحقيقي من قاعدة البيانات
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

    // تأمين المصفوفة في حال كانت فارغة بالخطأ
    const safePlayers = players && players.length > 0 ? players : ["لاعب غير معروف"];
    const total = safePlayers.length;
    const currentPlayer = safePlayers[index];

    // حركة التلاشي السلسة عند تغيير اللاعب
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const handleNextPlayer = () => {
        // إخفاء الفئة تلقائياً لحماية دور اللاعب التالي
        setCategoryRevealed(false);

        // تشغيل حركة التلاشي السلسة
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();

        // تغيير اللاعب والتحقق من اكتمال الجولة في منتصف الأنميشن
        setTimeout(() => {
            if (index === total - 1) {
                setEveryoneHinted(true); // أصبح زر التصويت متاحاً الآن
                setRound((prev) => prev + 1); // الانتقال للجولة التالية
            }
            setIndex((prev) => (prev + 1) % total); // تكرار الأسماء إلى مالانهاية
        }, 150);
    };

    const handleGoToVoting = () => {
        console.log("الإنهاء والانتقال إلى شاشة التصويت");
        navigation.navigate('VotingPhase');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <ChevronRight size={24} color="#f6eefb" />
                    </TouchableOpacity>

                    <Text style={styles.title}>وقت التلميحات</Text>

                    {/* عنصر فارغ للحفاظ على توسيط العنوان */}
                    <View style={{ width: 40 }} />
                </View>

                {/* Content */}
                <View style={styles.content}>

                    {/* كشف وإخفاء الفئة */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setCategoryRevealed(!categoryRevealed)}
                        style={[styles.categoryToggle, categoryRevealed && styles.categoryToggleActive]}
                    >
                        {categoryRevealed ? (
                            <>
                                <EyeOff size={20} color="#4ecca3" />
                                <Text style={styles.categoryToggleTextActive}>الفئة: {categoryName}</Text>
                            </>
                        ) : (
                            <>
                                <Eye size={20} color="#f6eefb" />
                                <Text style={styles.categoryToggleText}>إظهار الفئة</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* رقم الجولة */}
                    <View style={styles.roundBadgeContainer}>
                        <View style={styles.roundBadge}>
                            <Text style={styles.roundBadgeText}>الجولة {round}</Text>
                        </View>
                    </View>

                    {/* بطاقة اللاعب الحالي */}
                    <View style={styles.cardWrapper}>
                        <Animated.View style={[styles.activePlayerCard, { opacity: fadeAnim }]}>

                            <View style={styles.nowHintingBadge}>
                                <Lightbulb size={16} color="#ff7315" />
                                <Text style={styles.nowHintingText}>الآن يلمّح</Text>
                            </View>

                            <Text style={styles.playerName}>{currentPlayer}</Text>

                            <Text style={styles.instructionText}>
                                أعطِ تلميحاً من كلمة واحدة يدل على الكلمة السرية دون كشفها للدخلاء.
                            </Text>

                        </Animated.View>
                    </View>

                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerButtonsRow}>

                        {/* زر اللاعب التالي */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.nextButton}
                            onPress={handleNextPlayer}
                        >
                            <ArrowLeft size={22} color="#2a1b38" />
                            <Text style={styles.nextButtonText}>اللاعب التالي</Text>
                        </TouchableOpacity>

                        {/* زر إنهاء والتصويت */}
                        <TouchableOpacity
                            disabled={!everyoneHinted}
                            activeOpacity={0.8}
                            style={[
                                styles.voteButton,
                                !everyoneHinted ? styles.voteButtonDisabled : styles.voteButtonActive
                            ]}
                            onPress={handleGoToVoting}
                        >
                            <Vote size={20} color={everyoneHinted ? "#f6eefb" : "#b9a6cc"} />
                            <Text style={[
                                styles.voteButtonText,
                                !everyoneHinted ? styles.voteButtonTextDisabled : styles.voteButtonTextActive
                            ]}>
                                إنهاء والتصويت
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>

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
    header: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 45,
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3a2650',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: '#f6eefb',
        flex: 1,
        textAlign: 'center',
    },
    roundBadgeContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    roundBadge: {
        backgroundColor: '#472e63',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    roundBadgeText: {
        color: '#b9a6cc',
        fontSize: 14,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 35,
    },
    categoryToggle: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#472e63',
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(246, 238, 251, 0.1)',
        gap: 12,
        marginBottom: 24,
    },
    categoryToggleActive: {
        backgroundColor: 'rgba(78, 204, 163, 0.15)',
        borderColor: 'rgba(78, 204, 163, 0.4)',
    },
    categoryToggleText: {
        color: '#f6eefb',
        fontSize: 16,
        fontWeight: 'bold',
    },
    categoryToggleTextActive: {
        color: '#4ecca3',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardWrapper: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 70,
    },
    activePlayerCard: {
        alignItems: 'center',
        backgroundColor: '#3a2650',
        borderRadius: 32,
        paddingVertical: 50,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 115, 21, 0.25)',
        elevation: 12,
        shadowColor: '#ff7315',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
    },
    nowHintingBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#472e63',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 8,
        marginBottom: 32,
    },
    nowHintingText: {
        color: '#b9a6cc',
        fontSize: 14,
        fontWeight: '600',
    },
    playerName: {
        fontSize: 54,
        fontWeight: '900',
        color: '#f6eefb',
        marginBottom: 24,
        textAlign: 'center',
    },
    instructionText: {
        fontSize: 14,
        color: '#b9a6cc',
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 260,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(246, 238, 251, 0.1)',
        backgroundColor: 'rgba(42, 27, 56, 0.8)',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 32,
    },
    footerButtonsRow: {
        flexDirection: 'row-reverse',
        gap: 12,
        width: '100%',
    },
    nextButton: {
        flex: 1.4,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff7315',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
        elevation: 4,
        shadowColor: '#ff7315',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    nextButtonText: {
        color: '#2a1b38',
        fontSize: 16,
        fontWeight: 'bold',
    },
    voteButton: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 6,
    },
    voteButtonDisabled: {
        backgroundColor: 'rgba(58, 38, 80, 0.4)',
        borderWidth: 1,
        borderColor: '#472e63',
    },
    voteButtonActive: {
        backgroundColor: '#ff4b4b',
        elevation: 4,
        shadowColor: '#ff4b4b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    voteButtonTextActive: {
        color: '#f6eefb',
    },
    voteButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    voteButtonTextDisabled: {
        color: '#b9a6cc',
    },
});