import {StyleSheet, TouchableOpacity, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {COLORS} from "../helpers/colors";
import React from "react";
import {useNavigation} from "@react-navigation/native";

export const PlusBtn = () => {
    const navigation = useNavigation()
    const click = () => {
        navigation.navigate("NewNote")
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={click}
                style={styles.wrapper}
            >
                <AntDesign name="plus" size={34} color={COLORS.lightText} />
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: '50%',
        bottom: 20,
    },
    wrapper: {
        backgroundColor: COLORS.primary,
        height: 60,
        width: 60,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

});