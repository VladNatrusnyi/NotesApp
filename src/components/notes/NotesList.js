import {Button, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useCallback, useLayoutEffect, useMemo, useState} from "react";
import {NotesListItem} from "./NotesListItem";
import {COLORS} from "../../helpers/colors";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {InputLayout} from "../../lauouts/InputLayout";

export const NotesList  = ({isLoading, hideSearch, notes, reloadNotes, isSearchShow}) => {
    const navigation = useNavigation()

    const [searchText, setSearchText] = useState('');
    const [searchTextOnFocus, setSearchTextOnFocus] = useState(false)

    const [layout, setLayout] = useState('grid')

    const notesArr = useMemo(() => {
        if (notes && notes.length) {
            if (searchText.trim()) {
                return notes.filter(el => el.content.includes(searchText))
            } else {
                return notes
            }
        }
    }, [notes, searchText])

    const storeLayout = async (value) => {
        const payload = layout === 'grid' ? 'list' : 'grid'
        try {
            await AsyncStorage.setItem('layout', payload);
            setLayout(payload)
        } catch (e) {
            console.log('Error setting layout from storage', e.message)
        }
    };

    const getLayout = async () => {
        try {
            const value = await AsyncStorage.getItem('layout');
            if (value !== null) {
                setLayout(value)
            }
        } catch (e) {
            console.log('Error getting layout from storage', e.message)
        }
    };

    useLayoutEffect(() => {

        getLayout()

        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={storeLayout}
                    style={{
                        marginLeft: 15
                    }}
                >
                    {
                        layout === 'grid'
                            ? <Ionicons name="list" size={24} color={COLORS.lightText} />
                            : <Ionicons name="grid" size={24} color={COLORS.lightText} />
                    }
                </TouchableOpacity>

            )
        });
    }, [navigation, layout]);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        await reloadNotes()
        setRefreshing(false);
    }, []);


    return (
        <View style={styles.container}>

                {
                    isSearchShow &&
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                        <View style={{flex: 5}}>
                            <InputLayout onFocus={searchTextOnFocus}>
                                <Ionicons name="search" size={26} color={COLORS.primary} />
                                <TextInput
                                    placeholderTextColor={COLORS.disabled}
                                    style={styles.inputField}
                                    placeholder="Search"
                                    autoCapitalize="none"
                                    autoFocus={true}
                                    value={searchText}
                                    onChangeText={(text) => setSearchText(text)}
                                    onFocus={() => setSearchTextOnFocus(true)}
                                    onBlur={() => setSearchTextOnFocus(false)}
                                />
                            </InputLayout>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                hideSearch()
                                setSearchText('')
                            }}
                            style={{flex: 1, paddingBottom: 15}}
                        >
                            <AntDesign name="closecircleo" size={34} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>

                }

            <View style={styles.content}>
                <FlatList
                    key={layout}
                    data={notesArr}
                    numColumns={layout === 'grid' ? 2 : 1}
                    renderItem={(item) => <TouchableOpacity
                        onPress={() => navigation.navigate('NotePage', item.item)}
                        style={styles.listItem}>
                        <NotesListItem noteData={item.item} />
                    </TouchableOpacity> }
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            tintColor={COLORS.primary}
                            refreshing={isLoading}
                            onRefresh={onRefresh}
                        />
                    }
                    ListEmptyComponent={<Text style={styles.notFoundText}>No notes were found in this category.</Text>}
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    notFoundText: {
        textAlign: "center",
        color: COLORS.lightText
    },
    content: {
        flex: 1,
    },
    listItem: {
        flex: 1,
        margin: 5,
    },
    inputField: {
        flex: 4,
        fontSize: 16,
        marginHorizontal: 10,
        color: COLORS.lightText
    },
});
