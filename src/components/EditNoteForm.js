import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
    StyleSheet,
    TouchableOpacity, ActivityIndicator
} from "react-native";
import { actions, RichEditor, RichToolbar }
    from "react-native-pell-rich-editor";
import {useMemo, useRef, useState} from "react";
import {COLORS} from "../helpers/colors";
import {AntDesign} from "@expo/vector-icons";
import { getDatabase, ref, set, push } from "firebase/database";
import {useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";

const handleHead = ({ tintColor }) => (
    <Text style={{ color: tintColor }}>H1</Text>
);

export const EditNoteForm = ({initialData = '', cancel}) => {
    const navigation = useNavigation()

    const { currentUser } = useSelector(state => state.auth)

    const richText = useRef();
    const [isEditorOnFocus, setIsEditorOnFocus] = useState(false)

    const [content, setContent] = useState(initialData.content.trim() ? initialData.content : '');

    const [isLoading, setIsLoading] = useState(false)
    const [errorText, setErrorText] = useState('')

    const isBtnDisabled = useMemo(() => {
        return !content.trim() || content === initialData.content
    }, [content, initialData])

    const saveChanges = () => {
        const db = getDatabase();
        const newNoteIdRef = ref(db, `notes/${initialData.id}`);

        set(newNoteIdRef, {
            ...initialData,
            content: content,
            creationDate: Date.now(),
        })
            .then(() => {
                cancel()
                console.log('Created succesfuly')
                // Data saved successfully!
                setErrorText('')
            })
            .catch((error) => {
                setIsLoading(false)
                console.log('Error Created', error.message)
                setErrorText(error.message)
            });
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.toolsPanelWrapper}>
                <TouchableOpacity onPress={cancel}>
                    <AntDesign name="close" size={24} color={COLORS.lightText} />
                </TouchableOpacity>

                {isLoading &&
                    <ActivityIndicator size="small" color={COLORS.primary} />
                }

                <TouchableOpacity disabled={isBtnDisabled} onPress={saveChanges}>
                    <AntDesign name="check" size={24} color={isBtnDisabled ? 'gray' : COLORS.lightText} />
                </TouchableOpacity>
            </View>
            {
                errorText &&
                <Text style={styles.error}>{errorText}</Text>
            }
            <RichToolbar
                style={{
                    marginVertical: 10,
                    backgroundColor: COLORS.lightBg
                }}
                iconTint={COLORS.lightText}
                selectedIconTint={COLORS.primary}
                editor={richText}

                actions={[ actions.setBold,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                    actions.setStrikethrough,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.heading1,]}

                iconMap={{[actions.heading1]:handleHead,}}
            />
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <KeyboardAvoidingView
                    behavior={
                        Platform.OS ==="ios" ? "padding": "height"}
                    style={{ paddingBottom: 10, paddingHorizontal: 20 }}
                >

                    <RichEditor
                        ref={richText}
                        initialContentHTML={content}
                        editorStyle={{
                            backgroundColor: COLORS.bg,
                            color: COLORS.lightText
                        }}
                        style={{
                            borderRadius: 5,
                            borderWidth: isEditorOnFocus ? 1 : .5,
                            borderColor: isEditorOnFocus ? COLORS.primary : COLORS.disabled,
                        }
                        }
                        onChange={(descriptionText) => setContent(descriptionText)
                        }
                        onFocus={() => setIsEditorOnFocus(true)}
                        onBlur={() => setIsEditorOnFocus(false)}
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    error: {
        textAlign: 'center',
        color: 'red',
        marginTop: 10
    },
    wrapper: {
        flex: 1,
        paddingBottom: 30,
        backgroundColor: COLORS.bg
    },

    toolsPanelWrapper: {
        backgroundColor: COLORS.bg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
        paddingHorizontal: 20,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between"
    }
})