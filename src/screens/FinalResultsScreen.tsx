import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { Trophy, Medal, Settings, Play, LogOut } from 'lucide-react-native';

// استدعاء الذاكرة المركزية
import { useGame } from '../context/GameContext';

export default function FinalResultsScreen({ navigation }: any) {
    // جلب اللاعبين، النقاط، ودوال التحكم بالجولات من الذاكرة
    const { players, scores, nextRoundContext, resetGame } = useGame();

    // تأمين المصفوفة وتحويلها إلى قائمة مرتبة حسب النقاط (من الأعلى للأقل)
    const safePlayers = players && players.length > 0 ? players : [];
    const LEADERBOARD = safePlayers.map((name, index) => ({
        id: index.toString(),
        name: name,
        score: scores[name] || 0 // إذا لم يكن لديه نقاط نعتبرها 0
    })).sort((a, b) => b.score - a.score);

    // Handlers for the bottom actions
    const handleNextRound = () => {
        // تهيئة الذاكرة لجولة جديدة (تصفير الكلمة والضائعين مع الاحتفاظ بالنقاط واللاعبين)
        nextRoundContext();
        navigation.navigate('RoleReveal');
    };

    const handleChangeSettings = () => {
        // العودة لشاشة الفئات لتغيير الإعدادات
        navigation.navigate('CategorySelection');
    };

    const handleEndGame = () => {
        // تصفير اللعبة بالكامل للبدء من جديد من الصفر
        resetGame();
        navigation.navigate('Home');
    };

    // Helper function to render correct icon based on player's rank
    const renderRankIcon = (index: number) => {
        if (index === 0) return <Trophy size={24} color="#FFD700" />; // Gold
        if (index === 1) return <Medal size={24} color="#C0C0C0" />;   // Silver
        if (index === 2) return <Medal size={24} color="#CD7F32" />;   // Bronze
        return <Text style={styles.rankNumber}>{index + 1}</Text>;     // Others
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerIconContainer}>
                        <Trophy size={32} color="#ff7315" />
                    </View>
                    <Text style={styles.title}>النتائج والترتيب</Text>
                    <Text style={styles.subtitle}>من هو الملك؟</Text>
                </View>

                {/* Leaderboard List */}
                <ScrollView
                    style={styles.scrollArea}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {LEADERBOARD.map((player, index) => {
                        const isTopThree = index < 3;
                        return (
                            <View
                                key={player.id}
                                style={[
                                    styles.playerCard,
                                    isTopThree ? styles.topPlayerCard : styles.normalPlayerCard
                                ]}
                            >
                                <View style={styles.rankContainer}>
                                    {renderRankIcon(index)}
                                </View>

                                <Text style={[styles.playerName, isTopThree && styles.topPlayerName]}>
                                    {player.name}
                                </Text>

                                <View style={styles.scoreContainer}>
                                    <Text style={styles.scoreNumber}>{player.score}</Text>
                                    <Text style={styles.scoreText}>نقطة</Text>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

                {/* Footer Actions - Designed to avoid clutter */}
                <View style={styles.footer}>

                    {/* Primary Action: Next Round */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.primaryButton}
                        onPress={handleNextRound}
                    >
                        <Play size={24} color="#2a1b38" fill="#2a1b38" />
                        <Text style={styles.primaryButtonText}>الجولة التالية</Text>
                    </TouchableOpacity>

                    {/* Secondary Action: Change Category/Settings */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.secondaryButton}
                        onPress={handleChangeSettings}
                    >
                        <Settings size={20} color="#b9a6cc" />
                        <Text style={styles.secondaryButtonText}>تغيير الفئة أو الإعدادات</Text>
                    </TouchableOpacity>

                    {/* Danger/Tertiary Action: End Game */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.dangerButton}
                        onPress={handleEndGame}
                    >
                        <LogOut size={16} color="#ff4b4b" />
                        <Text style={styles.dangerButtonText}>إنهاء اللعبة والعودة للرئيسية</Text>
                    </TouchableOpacity>

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

    // Header Styles
    header: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 16,
    },
    headerIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 115, 21, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#f6eefb',
        marginBottom: 4,
        paddingBottom: 4
    },
    subtitle: {
        fontSize: 16,
        color: '#b9a6cc',
    },

    // List Styles
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
        gap: 12,
    },
    playerCard: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
    },
    topPlayerCard: {
        backgroundColor: '#3a2650',
        borderColor: 'rgba(255, 115, 21, 0.3)',
        elevation: 4,
        shadowColor: '#ff7315',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    normalPlayerCard: {
        backgroundColor: '#3a2650', // Same background but without glowing borders
        borderColor: 'transparent',
        opacity: 0.9,
    },
    rankContainer: {
        width: 32,
        alignItems: 'center',
        marginLeft: 16,
    },
    rankNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#b9a6cc',
    },
    playerName: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f6eefb',
        textAlign: 'right',
        paddingBottom: 2
    },
    topPlayerName: {
        fontSize: 20,
        color: '#ff7315', // Highlight top players' names
    },
    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2a1b38',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    scoreNumber: {
        fontSize: 18,
        fontWeight: '900',
        color: '#4ecca3',
        lineHeight: 22,
    },
    scoreText: {
        fontSize: 10,
        color: '#b9a6cc',
    },

    // Footer Actions Styles
    footer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(246, 238, 251, 0.05)',
        backgroundColor: 'rgba(42, 27, 56, 0.9)',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 24,
        gap: 12, // Space between stacked buttons
    },
    primaryButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff7315',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 12,
        elevation: 4,
        shadowColor: '#ff7315',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    primaryButtonText: {
        color: '#2a1b38',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#472e63',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 10,
    },
    secondaryButtonText: {
        color: '#f6eefb',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dangerButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginTop: 4,
        gap: 8,
    },
    dangerButtonText: {
        color: '#ff4b4b',
        fontSize: 14,
        fontWeight: 'bold',
    },
});