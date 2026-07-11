import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { ArrowRight, Check, Dices } from 'lucide-react-native';
// Import database functions and types
import { initDB, getCategories, Category } from '../services/DatabaseService';

export default function CategorySelectionScreen({ navigation }: any) {
    const { setCategoryPool, setSelectedCategoryId } = useGame();
    const [categories, setCategories] = useState<Category[]>([]);
    // Change string[] to number[] for database IDs
    const [selected, setSelected] = useState<number[]>([]);
    const [random, setRandom] = useState(false);

    // Fetch categories on mount
    useEffect(() => {
        const loadData = async () => {
            const db = await initDB();
            const loadedCategories = await getCategories(db);
            setCategories(loadedCategories);
        };
        loadData();
    }, []);

    // Update toggle to accept a number ID
    function toggle(id: number) {
        setRandom(false);
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }

    // Use dynamic categories length
    const count = random ? categories.length : selected.length;
    const canProceed = count > 0;

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
                        <ArrowRight size={20} color="#f6eefb" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>اختر الفئات</Text>
                    <View style={styles.spacer} />
                </View>

                {/* Scrollable Content */}
                <ScrollView
                    style={styles.scrollArea}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Random Selection Card */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            setRandom((r) => !r);
                            setSelected([]);
                        }}
                        style={[styles.randomCard, random && styles.randomCardActive]}
                    >
                        <View style={[styles.randomIconBox, random ? styles.randomIconBoxActive : styles.randomIconBoxInactive]}>
                            <Dices size={28} color={random ? "#2a1b38" : "#4ecca3"} />
                        </View>

                        <View style={styles.randomTextContainer}>
                            <Text style={styles.randomTitle}>اختيار عشوائي</Text>
                            <Text style={styles.randomDesc}>دع اللعبة تختار كل الفئات</Text>
                        </View>

                        {random && (
                            <View style={styles.checkBadge}>
                                <Check size={16} color="#2a1b38" strokeWidth={3} />
                            </View>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.dividerText}>أو اختر يدويًا</Text>

                    {/* Category Grid */}
                    <View style={styles.grid}>
                        {categories.map((cat) => {
                            const isSelected = !random && selected.includes(cat.id);

                            return (
                                <TouchableOpacity
                                    key={cat.id.toString()}
                                    activeOpacity={0.7}
                                    onPress={() => toggle(cat.id)}
                                    style={[styles.categoryCard, isSelected && styles.categoryCardActive]}
                                >
                                    {isSelected && (
                                        <View style={styles.categoryCheckBadge}>
                                            <Check size={14} color="#2a1b38" strokeWidth={3} />
                                        </View>
                                    )}
                                    {/* Map to icon and name from DB */}
                                    <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                                    <Text style={styles.categoryTitle}>{cat.name}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                {/* Sticky Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        disabled={!canProceed}
                        activeOpacity={0.8}
                        style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
                        onPress={() => {
                            if (random) {
                                setCategoryPool([]);
                            } else {
                                setCategoryPool(selected);
                            }

                            // CRITICAL FIX: Reset the active round category ID 
                            // to force a fresh pick from the newly updated pool
                            setSelectedCategoryId(null);

                            navigation.navigate('PlayersSetup');
                        }}
                    >
                        {canProceed && (
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>تم اختيار {count}</Text>
                            </View>
                        )}
                        <Text style={[styles.nextButtonText, !canProceed && styles.nextButtonTextDisabled]}>
                            التالي
                        </Text>
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
        backgroundColor: '#2a1b38',
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingTop: 40,
        backgroundColor: 'rgba(42, 27, 56, 0.95)',
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3a2650',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f6eefb',
        flex: 1,
        textAlign: 'center',
    },
    spacer: {
        width: 40,
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 0, // تأكد أنها 0
        flexGrow: 1,      // هذه الخاصية ستجعل المحتوى يتمدد ليغطي الفراغ
    },
    randomCard: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#3a2650',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
        marginBottom: 24,
        marginTop: 10,
    },
    randomCardActive: {
        backgroundColor: 'rgba(78, 204, 163, 0.15)',
        borderColor: '#4ecca3',
    },
    randomIconBox: {
        width: 56,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    },
    randomIconBoxInactive: {
        backgroundColor: '#472e63',
    },
    randomIconBoxActive: {
        backgroundColor: '#4ecca3',
    },
    randomTextContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    randomTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f6eefb',
    },
    randomDesc: {
        fontSize: 14,
        color: '#b9a6cc',
        marginTop: 4,
    },
    checkBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#4ecca3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dividerText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#b9a6cc',
        marginBottom: 12,
        textAlign: 'right',
    },
    grid: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    categoryCard: {
        width: '48%',
        aspectRatio: 1,
        backgroundColor: '#3a2650',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginBottom: 12,
    },
    categoryCardActive: {
        backgroundColor: 'rgba(255, 115, 21, 0.15)',
        borderColor: '#ff7315',
    },
    categoryCheckBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#ff7315',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryEmoji: {
        fontSize: 36,
        marginBottom: 8,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f6eefb',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(246, 238, 251, 0.1)',
        backgroundColor: 'rgba(42, 27, 56, 0.95)',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    nextButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff7315',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        gap: 12,
    },
    nextButtonDisabled: {
        backgroundColor: '#3a2650',
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2a1b38',
    },
    nextButtonTextDisabled: {
        color: '#b9a6cc',
    },
    countBadge: {
        backgroundColor: 'rgba(42, 27, 56, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2a1b38',
    },
});