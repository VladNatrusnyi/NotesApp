import {
    Button,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {COLORS} from "../helpers/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {InputLayout} from "../lauouts/InputLayout";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {MainBtn} from "../components/MainBtn";
import BottomSheet from "@gorhom/bottom-sheet";
import {TextBtn} from "../components/TextBtn";

export const ToDoPage = () => {

    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);

    const loadTasks = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem('tasks');
            if (storedTasks !== null) {
                setTasks(JSON.parse(storedTasks));
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const saveTasks = async (data) => {
        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(data));
            await loadTasks()
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    };

    const addTask = async () => {
        if (task.trim() !== '') {
            const newTask = { id: Date.now(), text: task };
            await saveTasks([...tasks, newTask]);
            await setTask('');
        }
    };

    const removeValue = async () => {
        try {
            await AsyncStorage.removeItem('tasks')
        } catch(e) {
            console.error('Error removing tasks:', e);
        }
    }

    const removeTask = async (taskId) => {
        const updatedTasks = tasks.filter((t) => t.id !== taskId);
        console.log('updatedTasks', updatedTasks)
        if (!updatedTasks.length) {
            await removeValue()
            setTasks(updatedTasks);
        } else {
            await saveTasks(updatedTasks);
        }

    };

    useEffect(() => {
        loadTasks();
    }, []);

    const [todoTextOnFocus, setTodoTextOnFocus] = useState(false)

    const renderTaskItem = ({ item }) => (
        <View style={styles.itemWrapper}>
            <Text style={styles.itemText}>{item.text}</Text>
            <TextBtn title={'Remove'} color={COLORS.primary} onPress={() => removeTask(item.id)} />
        </View>
    );



    const bottomSheetRef = useRef(null);
    const [modalHeight, setModalHeight] = useState(0)
    const snapPoints = useMemo(() => [120, '90%'], []);
    const handleSheetChanges = useCallback((index) => {
        setModalHeight(index)
        console.log('handleSheetChanges', index);
    }, []);
    const openModal = () => {
        setModalHeight(1)
    }


    return (
        <>
            <View style={{flex: 1}}>
                <View style={styles.container}>

                    <FlatList
                        data={tasks}
                        renderItem={(item) => renderTaskItem(item)}
                        keyExtractor={(item) => item.id.toString()}
                        style={{ marginTop: 16 }}
                        numColumns={2}
                    />
                </View>
                <BottomSheet
                    backgroundStyle={{borderWidth: 2 ,borderColor: COLORS.primary, backgroundColor: COLORS.bg}}
                    ref={bottomSheetRef}
                    index={modalHeight}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                >
                    <View style={styles.contentContainer}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        >
                            {
                                modalHeight === 0
                                    ?<MainBtn
                                        onPress={openModal}
                                        text={'Create Task'}
                                        // isLoading={isLoading}
                                        // disabled={isDisabled}
                                    />
                                    : <>
                                        <InputLayout onFocus={todoTextOnFocus}>
                                            <TextInput
                                                placeholderTextColor={COLORS.disabled}
                                                style={styles.inputField}
                                                placeholder="Enter task"
                                                value={task}
                                                onChangeText={(text) => setTask(text)}
                                                onFocus={() => setTodoTextOnFocus(true)}
                                                onBlur={() => setTodoTextOnFocus(false)}
                                            />
                                        </InputLayout>

                                        <MainBtn
                                            customStyle={{marginBottom: 10}}
                                            onPress={addTask}
                                            text={'Create'}
                                            disabled={!task.trim()}
                                        />

                                    <TextBtn onPress={() => setModalHeight(0)} title={'Cansel'} color={COLORS.primary} />
                                    </>
                            }
                        </KeyboardAvoidingView>
                    </View>
                </BottomSheet>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        padding: 20
    },
    itemWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        marginHorizontal: 5,
        marginVertical: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: COLORS.lightBg,
        borderRadius: 10
    },
    itemText: {
        color: COLORS.lightText,
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.bg
    },
    inputField: {
        fontSize: 16,
        marginHorizontal: 10,
        flex: 10,
        color: COLORS.lightText
    },
    button: {
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        display: 'none',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        marginBottom: 15
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 18
    }
});
