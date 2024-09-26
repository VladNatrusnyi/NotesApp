import {TouchableOpacity, Text} from "react-native";

export const TextBtn = ({title, color, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={{
        fontSize: 18,
        textAlign: 'center',
        color: color
      }}>{title}</Text>
    </TouchableOpacity>
  )
}
