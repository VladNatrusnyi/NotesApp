import {KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View, StyleSheet, Text} from "react-native";
import {COLORS} from "../helpers/colors";
import React from "react";

export const AuthLayout = ({children, title}) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1 }}
        >
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
                <View style={styles.container}>
                    <SafeAreaView style={styles.formContainer}>
                        <Text
                            style={styles.loginTitle}
                        >{title}</Text>
                        {children}
                    </SafeAreaView>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg
    },

    formContainer: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 30,
    },

    loginTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        alignSelf: "center",
        paddingBottom: 24,
        marginTop: 30,
        color: COLORS.primary
    },
});