import {StyleSheet, Text} from "react-native";
import React from "react";

export const ErrorBlock = ({isErrorMessage, message}) => {
    return (
        <>
            {
                isErrorMessage ?
                <Text style={styles.text}>
                    {message ? message : isErrorMessage}
                </Text>
                    : null
            }
        </>
    )
}

const styles = StyleSheet.create({
    text: {
        textAlign: "center",
        marginTop: 20,
        color: 'red'
    },
})