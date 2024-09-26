import React from 'react'
import {View, Text, StyleSheet, useWindowDimensions} from "react-native";
import RenderHtml from 'react-native-render-html';
import {COLORS} from "../../helpers/colors";
import {formatDateNow} from "../../helpers/formatDateNow";

export const NotesListItem = React.memo(({noteData}) => {
    const { width } = useWindowDimensions();

    return (
        <View style={styles.container}>
            <View  style={styles.content}>
                <RenderHtml
                    baseStyle={{color: COLORS.lightText}}
                    contentWidth={width}
                    source={{html: noteData.content}}
                />
            </View>

            <View style={styles.timeWrapper}>
                <Text style={styles.timeText}>{formatDateNow(noteData.creationDate)}</Text>
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 20,
        backgroundColor: COLORS.lightBg,
    },

    content: {
        maxHeight: 100,
        overflow: 'hidden'
    },

    timeWrapper: {
        marginTop: 10,

    },

    timeText: {
        color: 'gray'
    }
});