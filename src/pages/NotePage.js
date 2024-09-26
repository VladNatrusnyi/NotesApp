import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import React, {useLayoutEffect, useMemo, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {COLORS} from "../helpers/colors";
import {formatDateNow} from "../helpers/formatDateNow";
import RenderHtml from "react-native-render-html";
import {CreateNotePage} from "./CreateNotePage";
import {EditNoteForm} from "../components/EditNoteForm";
import {useSelector} from "react-redux";
import {AntDesign} from "@expo/vector-icons";
import {getDatabase, remove, ref} from "firebase/database";

export const NotePage = ({route}) => {
    const initialData = route.params
    const navigation = useNavigation()

    const { allNotes } = useSelector(state => state.notes)

    const currentNote = useMemo(() => {
        if (allNotes) {
            return allNotes.find(el => el.id === initialData.id)
        }
    }, [allNotes, isEdit])

    const { width } = useWindowDimensions();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteNote = async () => {
        try {
            const db = getDatabase();
            const quizRef = ref(db, `notes/${initialData.id}`);
            await remove(quizRef);
            console.log(`Note ${initialData.id} successfully deleted.`);

            setLoading(false);
            navigation.navigate('Notes')
        } catch (error) {
            console.error(`Error deleting note: ${error.message}`);
            setError(`Error deleting note: ${error.message}`);
            setLoading(false);
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <Text style={{ color: COLORS.primary, fontSize: 16, fontWeight: "bold"}}>{currentNote ? formatDateNow(currentNote.creationDate) : ''}</Text>,
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert('Delete confirmation', 'Are you sure you want to delete this note?', [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            {text: 'OK', onPress: deleteNote},
                        ]);
                    }}
                    style={{
                        marginRight: 25
                    }}
                >
                    {
                        loading
                            ? <ActivityIndicator size="small" color={COLORS.primary} />
                            : <AntDesign name="delete" size={24} color={COLORS.primary} />

                    }
                </TouchableOpacity>

            )
        });
    }, [navigation, currentNote]);

    const [isEdit, setIsEdit] = useState(false)

    return (
        <>
            {
                currentNote
                    ? isEdit
                        ? <EditNoteForm initialData={currentNote} cancel={() => setIsEdit(false)} />
                        : <View style={styles.wrapper}>
                            {
                                error &&
                                <Text style={styles.error}>{error}</Text>
                            }
                            <ScrollView>
                                <TouchableOpacity onPress={() => setIsEdit(true)}>
                                    <RenderHtml
                                        baseStyle={{color: COLORS.lightText}}
                                        contentWidth={width}
                                        source={{html: currentNote.content}}
                                    />
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    : <View style={styles.wrapper}></View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 30,
        flex: 1,
        backgroundColor: COLORS.bg
    },

    error: {
        textAlign: 'center',
        color: 'red'
    }
})