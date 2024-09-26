import {createStackNavigator} from "@react-navigation/stack";
import {AuthStack} from "./AuthStack";
import {setCurrentUser, setIsLoadingWhenCheckLoginUser} from "../store/auth/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "../../config/firebase";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {MainStack} from "./MainStack";
import {View, Text} from "react-native";
import {COLORS} from "../helpers/colors";

const Stack = createStackNavigator();
export const RootNavigator = () => {
    const dispatch = useDispatch()
    const { currentUser, isLoadingWhenCheckLoginUser } = useSelector(state => state.auth)

    const [isFinish, setIsFinish] = useState(false)


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            dispatch(setIsLoadingWhenCheckLoginUser(true))
            if (user) {

                const userData = {
                    email: user.email,
                    displayName: user.displayName,
                    uid: user.uid,
                }

                dispatch(setCurrentUser(userData))
                dispatch(setIsLoadingWhenCheckLoginUser(false))
                setIsFinish(true)
            } else {
                dispatch(setIsLoadingWhenCheckLoginUser(false))
                setIsFinish(true)
            }
        });
        return () => unsubscribe();
    }, []);

    if (isLoadingWhenCheckLoginUser) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{color: COLORS.primary, fontSize: 34, fontWeight: "bold"}}>NotesApp</Text>
            </View>
        );
    }


    return (
        <>
            {
                isFinish &&

                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false,
                        }}
                    >
                        { currentUser
                            ? <Stack.Screen name="Main" component={MainStack} />
                            : <Stack.Screen
                                name="Auth"
                                component={AuthStack}
                                options={{
                                    headerTitle: 'NotesApp'
                                }}
                            />
                        }
                    </Stack.Navigator>
            }
        </>
    )
}
