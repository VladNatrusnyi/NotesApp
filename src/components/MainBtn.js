import {ActivityIndicator, StyleSheet, Text, TouchableOpacity} from "react-native";
import {COLORS} from "../helpers/colors";

export const MainBtn = ({onPress, text, isLoading = false, disabled = false, customStyle}) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            style={{...styles.button, backgroundColor: disabled ? COLORS.disabled : COLORS.primary, ...customStyle}}
            onPress={onPress}
        >
            {
                isLoading
                    ? <ActivityIndicator animating={true} color={COLORS.lightText} />
                    : <Text style={styles.buttonText}>{text}</Text>
            }

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 18
    }
})