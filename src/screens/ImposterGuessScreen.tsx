import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { ChevronRight, HelpCircle } from 'lucide-react-native';

// Import Context and Database services
import { useGame } from '../context/GameContext';
import { initDB } from '../services/DatabaseService';

export default function ImposterGuessScreen({ navigation }: any) {
    const { imposters, secretWord, selectedCategoryId, updateScore } = useGame();

    const [imposterIndex, setImposterIndex] = useState(0);
    const [wordOptions, setWordOptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Ensure we have a valid array of imposters to prevent crashes
    const safeImposters = imposters && imposters.length > 0 ? imposters : ["مجهول"];
    const totalImposters = safeImposters.length;
    const currentImposterName = safeImposters[imposterIndex];

    // Fetch random words to mix with the actual secret word
    useEffect(() => {
        const fetchWords = async () => {
            if (selectedCategoryId && secretWord) {
                try {
                    const db = await initDB();
                    if (db) {
                        // Fetch 7 random words from the same category that are NOT the secret word
                        const results = await db.getAllAsync<{ word: string }>(
                            'SELECT word FROM words WHERE category_id = ? AND word != ? ORDER BY RANDOM() LIMIT 7',
                            [selectedCategoryId, secretWord]
                        );

                        const options = results.map(r => r.word);
                        options.push(secretWord); // Add the real secret word

                        // Shuffle the options array so the real word is placed randomly
                        const shuffledOptions = options.sort(() => 0.5 - Math.random());
                        setWordOptions(shuffledOptions);
                    }
                } catch (error) {
                    console.error("Error fetching word options:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchWords();
    }, [selectedCategoryId, secretWord]);

    const handleWordGuess = (selectedWord: string) => {
        // Rule: If the imposter guesses the correct secret word, they get 100 points
        if (selectedWord === secretWord) {
            updateScore(currentImposterName, 100);
        }

        if (imposterIndex < totalImposters - 1) {
            // Move to the next imposter
            setImposterIndex(imposterIndex + 1);
        } else {
            // All imposters have guessed, move to the secret word reveal screen
            navigation.navigate('SecretWordReveal');
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                    <ActivityIndicator size="large" color="#4ecca3" />
                </View>
            </SafeAreaView>
        );
    }

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
                    <Text style={styles.title}>توقع الكلمة السرية</Text>
                    <View style={styles.spacer} />
                </View>

                {/* Progress indicator */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressPill}>
                        <HelpCircle size={16} color="#4ecca3" />
                        <Text style={styles.progressPillText}>
                            توقع الضائع {imposterIndex + 1} من {totalImposters}
                        </Text>
                    </View>
                </View>

                {/* Current imposter section */}
                <View style={styles.voterSection}>
                    <Text style={styles.voterLabel}>دورك بالتوقع يا:</Text>
                    <Text style={styles.voterName}>{currentImposterName}</Text>
                    <Text style={styles.voterSubtitle}>ما هي الكلمة السرية؟</Text>
                </View>

                {/* Word options list */}
                <ScrollView
                    style={styles.candidatesScroll}
                    contentContainerStyle={styles.candidatesContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {wordOptions.map((word, index) => (
                        <TouchableOpacity
                            key={`${word}-${index}`} // Using index just in case there are duplicates
                            activeOpacity={0.7}
                            style={styles.candidateCard}
                            onPress={() => handleWordGuess(word)}
                        >
                            <Text style={styles.candidateName}>{word}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

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
        paddingBottom: 1
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
        paddingBottom: 2
    },
    voterSubtitle: {
        fontSize: 16,
        color: '#f6eefb',
        fontWeight: '500',
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
    },
});