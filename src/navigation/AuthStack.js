import {createStackNavigator} from "@react-navigation/stack";
import {LoginPage} from "../pages/LoginPage";
import {COLORS} from "../helpers/colors";
import {SignUpPage} from "../pages/SignUpPage";

const Stack = createStackNavigator();

export const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName={'Login'}
            screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: COLORS.bg},
            headerTitleStyle: {color: COLORS.lightText}
        }}>
            <Stack.Screen
                name='Login'
                options={{
                    headerTitle: 'Log In'
                }}
                component={LoginPage}
            />
            <Stack.Screen
                name='Signup'
                options={{
                    headerTitle: 'Sign Up'
                }}
                component={SignUpPage}
            />
        </Stack.Navigator>
    );
}