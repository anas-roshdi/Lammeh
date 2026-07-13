import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { ChevronRight, Users } from 'lucide-react-native';

// استدعاء الذاكرة المركزية للعبة
import { useGame } from '../context/GameContext';

export default function VotingPhaseScreen({ navigation }: any) {
    // جلب أسماء اللاعبين الحقيقيين من الذاكرة المركزية
    const { players, imposters, updateScore } = useGame();
    const [voterIndex, setVoterIndex] = useState(0);
    const [votes, setVotes] = useState<Record<string, string>>({});
    // تأمين المصفوفة لتجنب أي أخطاء برمجية في حال كانت فارغة
    const safePlayers = players && players.length > 0 ? players : ["لاعب غير معروف"];

    const totalVoters = safePlayers.length;
    const currentVoterName = safePlayers[voterIndex];

    // تصفية القائمة لإخفاء اسم اللاعب الحالي (حتى لا يصوت لنفسه) باستخدام المصفوفة الديناميكية
    const candidates = safePlayers.filter((name) => name !== currentVoterName);

    const handleVote = (candidateName: string) => {
        // Save the current voter's choice
        const updatedVotes = { ...votes, [currentVoterName]: candidateName };
        setVotes(updatedVotes);

        if (voterIndex < totalVoters - 1) {
            setVoterIndex(voterIndex + 1);
        } else {
            // ==========================================
            // ALL PLAYERS HAVE VOTED - CALCULATE SCORES
            // ==========================================

            // 1. Normal players who guessed correctly get 100 points
            safePlayers.forEach(player => {
                if (!imposters.includes(player)) {
                    const votedFor = updatedVotes[player];
                    if (imposters.includes(votedFor)) {
                        updateScore(player, 100);
                    }
                }
            });

            // 2. Imposters who received ZERO votes get 100 points
            imposters.forEach(imposter => {
                // Count how many people voted for this imposter
                const votesReceived = Object.values(updatedVotes).filter(v => v === imposter).length;
                if (votesReceived === 0) {
                    updateScore(imposter, 100);
                }
            });

            // Proceed to reveal screen
            navigation.navigate('ImposterReveal');
        }
    };

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>

                {/* Header - زر الرجوع في اليمين */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <ChevronRight size={24} color="#f6eefb" />
                    </TouchableOpacity>
                    <Text style={styles.title}>وقت التصويت</Text>
                    <View style={styles.spacer} />
                </View>

                {/* مؤشر تقدم المصوتين */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressPill}>
                        <Users size={16} color="#4ecca3" />
                        <Text style={styles.progressPillText}>
                            تصويت اللاعب {voterIndex + 1} من {totalVoters}
                        </Text>
                    </View>
                </View>

                {/* قسم الناخب الحالي */}
                <View style={styles.voterSection}>
                    <Text style={styles.voterLabel}>دورك يا:</Text>
                    <Text style={styles.voterName}>{currentVoterName}</Text>
                    <Text style={styles.voterSubtitle}>من تظن أنه الضائع؟</Text>
                </View>

                {/* قائمة المرشحين (بشكل عمودي) */}
                <ScrollView
                    style={styles.candidatesScroll}
                    contentContainerStyle={styles.candidatesContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {candidates.map((name) => (
                        <TouchableOpacity
                            key={name}
                            activeOpacity={0.7}
                            style={styles.candidateCard}
                            onPress={() => handleVote(name)}
                        >
                            <Text style={styles.candidateName}>{name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f6eefb',
    },
    spacer: {
        width: 40,
    },
    progressContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    progressPill: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#472e63',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    progressPillText: {
        color: '#b9a6cc',
        fontSize: 14,
        fontWeight: 'bold',
    },
    voterSection: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 32,
        paddingHorizontal: 24,
    },
    voterLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#b9a6cc',
        marginBottom: 8,
    },
    voterName: {
        fontSize: 48,
        fontWeight: '900',
        color: '#ff7315',
        marginBottom: 16,
        textAlign: 'center',
        paddingBottom: 8
    },
    voterSubtitle: {
        fontSize: 16,
        color: '#f6eefb',
        paddingBottom: 1
    },
    candidatesScroll: {
        flex: 1,
    },
    candidatesContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        gap: 12,
    },
    candidateCard: {
        backgroundColor: '#3a2650',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(246, 238, 251, 0.05)',
    },
    candidateName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f6eefb',
        paddingBottom: 1
    },
});