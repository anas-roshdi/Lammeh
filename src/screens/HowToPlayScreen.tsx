import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView
} from 'react-native';
import {
    ChevronRight,
    Settings,
    EyeOff,
    Lightbulb,
    Vote,
    Target
} from 'lucide-react-native';

// Step data for the "How to Play" guide
const PLAY_STEPS = [
    {
        id: '1',
        icon: <Settings size={24} color="#ff7315" />,
        title: '1. الإعداد واختيار الفئة',
        description: 'أضف أسماء اللاعبين (3 على الأقل)، وحدد عدد "الضائعين" (الدخلاء)، ثم اختر فئة الكلمات التي ستلعبون بها.',
    },
    {
        id: '2',
        icon: <EyeOff size={24} color="#4ecca3" />,
        title: '2. كشف الأدوار بسريّة',
        description: 'مرر الجوال بين اللاعبين. سيظهر لكل لاعب إما "الكلمة السرية" (مثلاً: أسد) أو دور "الضايع" الذي لا يعرف الكلمة.',
    },
    {
        id: '3',
        icon: <Lightbulb size={24} color="#ff7315" />,
        title: '3. وقت التلميحات',
        description: 'بالترتيب، يقول كل لاعب "كلمة واحدة فقط" تلمّح للكلمة السرية. الهدف إثبات أنك تعرفها دون أن تفضحها للضايع!',
    },
    {
        id: '4',
        icon: <Vote size={24} color="#4ecca3" />,
        title: '4. النقاش والتصويت',
        description: 'بعد انتهاء التلميحات، تناقشوا ثم يصوت كل لاعب سراً للشخص الذي يشك بأنه "الضايع".',
    },
    {
        id: '5',
        icon: <Target size={24} color="#ff7315" />,
        title: '5. فرصة الضايع الأخيرة',
        description: 'إذا تم كشف الضايع، تُعطى له فرصة أخيرة لتخمين الكلمة السرية الحقيقية للفوز، أو يخسر الجولة!',
    },
];

export default function HowToPlayScreen({ navigation }: any) {
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
                    <Text style={styles.title}>كيف تلعب؟</Text>
                    <View style={styles.spacer} />
                </View>

                {/* Intro Banner */}
                <View style={styles.introContainer}>
                    <Text style={styles.introTitle}>مرحباً بك في لمّح!</Text>
                    <Text style={styles.introText}>
                        اللعبة التي تختبر ذكاءك في التلميح وقدرتك على الخداع. هل أنت "داخل السالفة" أم "ضايع"؟
                    </Text>
                </View>

                {/* Steps List */}
                <ScrollView
                    style={styles.scrollArea}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {PLAY_STEPS.map((step) => (
                        <View key={step.id} style={styles.stepCard}>
                            <View style={styles.iconContainer}>
                                {step.icon}
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.stepTitle}>{step.title}</Text>
                                <Text style={styles.stepDescription}>{step.description}</Text>
                            </View>
                        </View>
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
        paddingTop: 32,
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
        fontWeight: 'bold',
        color: '#f6eefb',
    },
    spacer: {
        width: 40,
    },
    introContainer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        alignItems: 'center',
    },
    introTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#ff7315',
        marginBottom: 8,
    },
    introText: {
        fontSize: 14,
        color: '#b9a6cc',
        textAlign: 'center',
        lineHeight: 22,
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        gap: 16,
    },
    stepCard: {
        flexDirection: 'row-reverse',
        backgroundColor: '#3a2650',
        borderRadius: 20,
        padding: 20,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(246, 238, 251, 0.05)',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(42, 27, 56, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16, // Space between icon and text in RTL
    },
    textContainer: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f6eefb',
        marginBottom: 6,
        textAlign: 'right',
    },
    stepDescription: {
        fontSize: 13,
        color: '#b9a6cc',
        textAlign: 'right',
        lineHeight: 20,
    },
});