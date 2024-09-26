import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {COLORS} from "../helpers/colors";

export const AddAuthBlock = ({text, linkText, onPressLink}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text} </Text>
            <TouchableOpacity onPress={onPressLink}>
                <Text style={styles.btnText}> {linkText}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'},
    text: {color: COLORS.disabled, fontWeight: '600', fontSize: 14},
    btnText: {color: COLORS.primary, fontWeight: '600', fontSize: 14}
})