import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Switch,
    TouchableWithoutFeedback
} from 'react-native';
import { X, Volume2, Vibrate } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsModalProps = {
    visible: boolean;
    onClose: () => void;
};

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);

    // تحميل الإعدادات المحفوظة فور فتح النافذة
    useEffect(() => {
        if (visible) {
            loadSettings();
        }
    }, [visible]);

    const loadSettings = async () => {
        try {
            const savedSound = await AsyncStorage.getItem('isSoundEnabled');
            const savedVibration = await AsyncStorage.getItem('isVibrationEnabled');

            if (savedSound !== null) setSoundEnabled(savedSound === 'true');
            if (savedVibration !== null) setVibrationEnabled(savedVibration === 'true');
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    // حفظ إعدادات الصوت
    const toggleSound = async (value: boolean) => {
        setSoundEnabled(value);
        try {
            await AsyncStorage.setItem('isSoundEnabled', String(value));
        } catch (error) {
            console.error('Error saving sound setting:', error);
        }
    };

    // حفظ إعدادات الاهتزاز
    const toggleVibration = async (value: boolean) => {
        setVibrationEnabled(value);
        try {
            await AsyncStorage.setItem('isVibrationEnabled', String(value));
        } catch (error) {
            console.error('Error saving vibration setting:', error);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>

                            {/* ترويسة النافذة */}
                            <View style={styles.header}>
                                <Text style={styles.title}>الإعدادات</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <X size={20} color="#b9a6cc" />
                                </TouchableOpacity>
                            </View>

                            {/* الخيارات */}
                            <View style={styles.optionsContainer}>

                                {/* خيار المؤثرات الصوتية */}
                                <View style={styles.optionRow}>
                                    <View style={styles.optionInfo}>
                                        <View style={styles.iconContainer}>
                                            <Volume2 size={20} color="#ff7315" />
                                        </View>
                                        <Text style={styles.optionText}>المؤثرات الصوتية</Text>
                                    </View>
                                    <Switch
                                        trackColor={{ false: '#472e63', true: '#4ecca3' }}
                                        thumbColor="#f6eefb"
                                        ios_backgroundColor="#472e63"
                                        onValueChange={toggleSound}
                                        value={soundEnabled}
                                    />
                                </View>

                                {/* فاصل */}
                                <View style={styles.divider} />

                                {/* خيار الاهتزاز */}
                                <View style={styles.optionRow}>
                                    <View style={styles.optionInfo}>
                                        <View style={styles.iconContainer}>
                                            <Vibrate size={20} color="#ff7315" />
                                        </View>
                                        <Text style={styles.optionText}>الاهتزاز</Text>
                                    </View>
                                    <Switch
                                        trackColor={{ false: '#472e63', true: '#4ecca3' }}
                                        thumbColor="#f6eefb"
                                        ios_backgroundColor="#472e63"
                                        onValueChange={toggleVibration}
                                        value={vibrationEnabled}
                                    />
                                </View>

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(22, 14, 30, 0.75)', // خلفية داكنة شفافة
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalContent: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#3a2650',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(246, 238, 251, 0.1)',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
    },
    header: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f6eefb',
    },
    closeButton: {
        padding: 4,
        backgroundColor: '#472e63',
        borderRadius: 12,
    },
    optionsContainer: {
        backgroundColor: 'rgba(42, 27, 56, 0.4)',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    optionRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    optionInfo: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 115, 21, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f6eefb',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(246, 238, 251, 0.05)',
        marginVertical: 4,
    },
});