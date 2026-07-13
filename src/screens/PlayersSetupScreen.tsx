import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import { ChevronRight, Plus, X, Minus, Dices, ArrowLeft } from 'lucide-react-native';

const MIN_PLAYERS = 3;

export default function PlayersSetupScreen({ navigation }: any) {
    const { players, setPlayers, setImpostersCount } = useGame();
    const [localPlayers, setLocalPlayers] = useState<string[]>(players || []);
    const [localImposters, setLocalImposters] = useState<number>(1);
    const [inputValue, setInputValue] = useState('');
    const [random, setRandom] = useState(false);

    // حساب الحد الأقصى للغرباء (يجب أن يتبقى شخص واحد على الأقل داخل السالفة)
    const maxImposters = Math.max(1, localPlayers.length - 1);
    const canStart = localPlayers.length >= MIN_PLAYERS;

    const clampedImposters = useMemo(
        () => Math.min(localImposters, maxImposters),
        [localImposters, maxImposters]
    );

    const handleStartGame = () => {
        if (localPlayers.length < 3) {
            alert("يجب إضافة 3 لاعبين على الأقل للعب!");
            return;
        }

        // تحديد العدد النهائي للضائعين
        let finalImpostersCount = clampedImposters;
        if (random) {
            // توليد رقم عشوائي بين 1 والحد الأقصى للضائعين
            finalImpostersCount = Math.floor(Math.random() * maxImposters) + 1;
        }

        // حفظ البيانات النهائية في الذاكرة المركزية
        setPlayers(localPlayers);
        setImpostersCount(finalImpostersCount);

        // الانتقال لبدء الجولة
        navigation.navigate('RoleReveal');
    }

    function addPlayer() {
        const name = inputValue.trim();
        if (!name) return;
        setLocalPlayers((prev) => [...prev, name]); // تم التصحيح هنا
        setInputValue('');
        Keyboard.dismiss();
    }

    function removePlayer(index: number) {
        setLocalPlayers((prev) => prev.filter((_, i) => i !== index)); // تم التصحيح هنا
    }

    return (
        <SafeAreaView style={styles.root}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <ChevronRight size={24} color="#f6eefb" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>إعدادات اللاعبين</Text>
                    <View style={styles.spacer} />
                </View>

                {/* Main Content */}
                <ScrollView
                    style={styles.scrollArea}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Add Players Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>أضف اللاعبين</Text>
                            <Text style={styles.sectionSubtitle}>(الحد الأدنى 3)</Text>
                        </View>

                        <View style={styles.inputRow}>
                            <TouchableOpacity style={styles.addButton} onPress={addPlayer}>
                                <Plus size={18} color="#16362b" />
                                <Text style={styles.addButtonText}>إضافة</Text>
                            </TouchableOpacity>

                            <TextInput
                                style={styles.textInput}
                                value={inputValue}
                                onChangeText={setInputValue}
                                placeholder="اسم اللاعب..."
                                placeholderTextColor="#b9a6cc"
                                onSubmitEditing={addPlayer}
                                returnKeyType="done"
                            />
                        </View>

                        {/* تم التصحيح هنا ليستخدم localPlayers */}
                        {localPlayers.length > 0 && (
                            <View style={styles.chipsContainer}>
                                {localPlayers.map((name, i) => (
                                    <View key={`${name}-${i}`} style={styles.chip}>
                                        <TouchableOpacity
                                            style={styles.chipRemoveBtn}
                                            onPress={() => removePlayer(i)}
                                        >
                                            <X size={14} color="#ff4b4b" />
                                        </TouchableOpacity>
                                        <Text style={styles.chipText}>{name}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Imposters Settings Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { marginBottom: 16, textAlign: 'right' }]}>
                            عدد الضائعين
                        </Text>

                        <View style={styles.impostersRow}>

                            {/* Random Toggle */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setRandom(!random)}
                                style={[styles.randomBtn, random && styles.randomBtnActive]}
                            >
                                <Dices size={24} color={random ? "#4ecca3" : "#b9a6cc"} />
                                <Text style={[styles.randomBtnText, random && styles.randomBtnTextActive]}>
                                    عدد{'\n'}عشوائي
                                </Text>
                            </TouchableOpacity>

                            {/* Stepper */}
                            <View style={[styles.stepperContainer, random && styles.stepperDisabled]}>
                                <TouchableOpacity
                                    disabled={random || clampedImposters >= maxImposters}
                                    onPress={() => setLocalImposters(clampedImposters + 1)} // تم التصحيح هنا
                                    style={[styles.stepperBtn, (random || clampedImposters >= maxImposters) && styles.stepperBtnDisabled]}
                                >
                                    <Plus size={20} color="#f6eefb" />
                                </TouchableOpacity>

                                <Text style={styles.stepperValue}>{clampedImposters}</Text>

                                <TouchableOpacity
                                    disabled={random || clampedImposters <= 1}
                                    onPress={() => setLocalImposters(clampedImposters - 1)} // تم التصحيح هنا
                                    style={[styles.stepperBtn, (random || clampedImposters <= 1) && styles.stepperBtnDisabled]}
                                >
                                    <Minus size={20} color="#f6eefb" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </ScrollView>

                {/* Sticky Footer */}
                <View style={styles.footer}>
                    {/* تم التصحيح هنا ليستخدم localPlayers */}
                    {!canStart && (
                        <Text style={styles.warningText}>
                            أضف {MIN_PLAYERS - localPlayers.length} لاعبين على الأقل للبدء
                        </Text>
                    )}

                    <TouchableOpacity
                        disabled={!canStart}
                        activeOpacity={0.8}
                        style={[styles.primaryButton, !canStart && styles.primaryButtonDisabled]}
                        onPress={handleStartGame} // استدعاء دالتنا المصححة
                    >
                        <ArrowLeft size={24} color={canStart ? "#2a1b38" : "#b9a6cc"} />
                        <Text style={[styles.primaryButtonText, !canStart && styles.primaryButtonTextDisabled]}>
                            ابدأ اللعب
                        </Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#2a1b38',
    },
    // Centers the app content and limits its maximum width
    container: {
        flex: 1,
        width: '100%',
        maxWidth: 650,
        alignSelf: 'center',
        backgroundColor: '#2a1b38',
        // Keep your other existing styles below (padding, alignment, etc.)
    },
    header: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 16,
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
        paddingTop: 16,
        paddingBottom: 40,
        gap: 16,
    },
    section: {
        backgroundColor: '#3a2650',
        borderRadius: 24,
        padding: 16,
    },
    sectionHeaderRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f6eefb',
        marginLeft: 6,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#b9a6cc',
    },
    inputRow: {
        flexDirection: 'row-reverse',
        backgroundColor: '#472e63',
        borderRadius: 16,
        padding: 6,
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        color: '#f6eefb',
        paddingHorizontal: 12,
        paddingVertical: 0, // إلغاء الهوامش الافتراضية
        paddingTop: 8,
        textAlignVertical: 'center', // توسيط النص عمودياً
        textAlign: 'right',
        fontSize: 16,
    },
    addButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#4ecca3',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 6,
    },
    addButtonText: {
        color: '#16362b',
        fontWeight: 'bold',
        fontSize: 14,
    },
    chipsContainer: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 16,
    },
    chip: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#472e63',
        paddingVertical: 6,
        paddingRight: 12,
        paddingLeft: 8,
        borderRadius: 20,
        gap: 8,
    },
    chipText: {
        color: '#f6eefb',
        fontSize: 14,
        fontWeight: '500',
    },
    chipRemoveBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 75, 75, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    impostersRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 12,
    },
    randomBtn: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: '#472e63',
        borderRadius: 16,
        paddingHorizontal: 12,
        height: 62,
        gap: 8,
    },
    randomBtnActive: {
        borderColor: '#4ecca3',
        backgroundColor: 'rgba(78, 204, 163, 0.15)',
    },
    randomBtnText: {
        color: '#b9a6cc',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    randomBtnTextActive: {
        color: '#4ecca3',
    },
    stepperContainer: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#472e63',
        borderRadius: 16,
        padding: 6,
        height: 62,
    },
    stepperDisabled: {
        opacity: 0.4,
    },
    stepperBtn: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#2a1b38',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepperBtnDisabled: {
        opacity: 0.4,
    },
    stepperValue: {
        fontSize: 24,
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
    warningText: {
        color: '#b9a6cc',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 12,
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
    primaryButtonDisabled: {
        backgroundColor: '#3a2650',
        elevation: 0,
        shadowOpacity: 0,
    },
    primaryButtonText: {
        color: '#2a1b38',
        fontSize: 18,
        fontWeight: 'bold',
    },
    primaryButtonTextDisabled: {
        color: '#b9a6cc',
    },
});