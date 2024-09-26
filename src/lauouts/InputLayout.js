import {COLORS} from "../helpers/colors";
import {StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import React from "react";

export const InputLayout = ({onFocus, children}) => {
    return (
        <View style={[styles.container, { borderColor: onFocus ? COLORS.primary : COLORS.disabled}]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.bg,
        borderWidth: 1,
        height: 58,
        marginBottom: 20,
        borderRadius: 10,
        padding: 12,
        width: '100%'
    },
});