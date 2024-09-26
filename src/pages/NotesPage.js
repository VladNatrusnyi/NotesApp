import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {COLORS} from "../helpers/colors";
import {Entypo, FontAwesome} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {equalTo, get, getDatabase, orderByChild, query, ref, onValue} from "firebase/database";
import {setAllNotes} from "../store/notes/notesSlice";
import {NotesList} from "../components/notes/NotesList";
import {PlusBtn} from "../components/PlusBtn";

export const NotesPage = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const { currentUser } = useSelector(state => state.auth)
    const { allNotes } = useSelector(state => state.notes)
    const [isLoading, setIsLoading] = useState(false)

    const [isSearchShow, setIsSearchShow] = useState(false)

    const foo = () => {
        setIsSearchShow(true)
    }

    const hideSearch = () => {
        setIsSearchShow(false)
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <TouchableOpacity
                        onPress={foo}
                        style={{
                            marginRight: 25
                        }}
                    >
                        <FontAwesome name="search" size={24} color={isSearchShow ? COLORS.primary : COLORS.lightText} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {navigation.navigate('Profile')}}
                        style={{
                            marginRight: 25
                        }}
                    >
                        {
                            currentUser &&
                            <Text style={styles.userHeader}>{currentUser.displayName}</Text>
                        }
                    </TouchableOpacity>
                </View>

            )
        });
    }, [navigation, currentUser]);

    const getNotesByCreatorIdOnce = (creatorId) => {
        setIsLoading(true)
        const db = getDatabase();

        const notesRef = ref(db, 'notes');
        const sortedQuery= query(notesRef, orderByChild('creatorId'), equalTo(creatorId));

        get(sortedQuery).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();

                if (data) {
                    const notesArray = Object.keys(data).map((key) => data[key]);
                    dispatch(setAllNotes(notesArray))
                } else {
                    dispatch(setAllNotes(data))
                    console.log('data NONE', data)
                }

                setIsLoading(false)
            } else {
                setIsLoading(false)
                dispatch(setAllNotes(null))
                console.log("No data available");
            }
        }).catch((error) => {
            setIsLoading(false)
            console.error(error);
        });
    }

    const getNotesByCreatorId = (creatorId) => {
        setIsLoading(true)
        const db = getDatabase();

        const notesRef = ref(db, 'notes');
        const sortedQuery= query(notesRef, orderByChild('creatorId'), equalTo(creatorId));

        onValue(sortedQuery, (snapshot) => {

            const data = snapshot.val();

            if (data) {
                const notesArray = Object.keys(data).map((key) => data[key]);
                dispatch(setAllNotes(notesArray))
                setIsLoading(false)
            } else {
                dispatch(setAllNotes(null))
                console.log('Not notes quizzes', data)
                setIsLoading(false)
            }
        });
    };

    useEffect(() => {
        if (currentUser) {
            getNotesByCreatorId(currentUser.uid);
        }
    }, [currentUser]);

    const reloadNotes = () => {
        if (currentUser) {
            getNotesByCreatorIdOnce(currentUser.uid);
        }
    }

    return (
        <View style={styles.wrapper}>
            <NotesList
              hideSearch={hideSearch}
              isSearchShow={isSearchShow}
              notes={allNotes}
              isLoading={isLoading}
              reloadNotes={reloadNotes}
            />

            <PlusBtn />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingHorizontal: 20
    },

    userHeader: {
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: 'bold'
    }
});
