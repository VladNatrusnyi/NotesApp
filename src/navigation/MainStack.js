import {createStackNavigator} from "@react-navigation/stack";
import {COLORS} from "../helpers/colors";
import {NotesPage} from "../pages/NotesPage";
import {CreateNotePage} from "../pages/CreateNotePage";
import {NotePage} from "../pages/NotePage";
import {ProfilePage} from "../pages/ProfilePage";

const Stack = createStackNavigator();

export const MainStack = () => {
    return (
        <Stack.Navigator
            initialRouteName={'Notes'}
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: COLORS.bg},
                headerTitleStyle: {color: COLORS.lightText}
            }}>
            <Stack.Screen
                name='Notes'
                options={{
                    headerTitle: 'Notes',
                    headerTintColor: COLORS.primary,
                }}
                component={NotesPage}
            />
            <Stack.Screen
                name='NewNote'
                options={{
                    headerTitle: 'New note',
                  headerTintColor: COLORS.primary,
                }}
                component={CreateNotePage}
            />
            <Stack.Screen
                name='NotePage'
                component={NotePage}
                options={{
                  headerTintColor: COLORS.primary,
                }}
            />
            <Stack.Screen
                name='Profile'
                component={ProfilePage}
                options={{
                  headerTintColor: COLORS.primary,
                }}
            />

        </Stack.Navigator>
    );
}
