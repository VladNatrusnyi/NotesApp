import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ToDoPage} from "../pages/ToDoPage";
import {RootNavigator} from "./RootNavigator";
import {NavigationContainer} from "@react-navigation/native";
import {Octicons, SimpleLineIcons} from "@expo/vector-icons";
import {COLORS} from "../helpers/colors";

const Tab = createMaterialTopTabNavigator();

export const AppStack = () =>  {
    return (
        <NavigationContainer>
                <Tab.Navigator
                    initialRouteName={'Todo'}
                    screenOptions={{
                      tabBarActiveTintColor: COLORS.primary,
                      tabBarInactiveTintColor: COLORS.lightText,
                      tabBarStyle: { backgroundColor: COLORS.bg },
                      tabBarIndicatorStyle: {
                        backgroundColor: COLORS.primary
                      },
                    }}
                >
                    <Tab.Screen
                        name="Todo"
                        component={ToDoPage}
                        options={{
                            tabBarLabel: 'ToDo',
                            tabBarIcon: ({ color, size }) => (
                                <Octicons name="checklist" size={22} color={color} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="NotesPart"
                        component={RootNavigator}
                        options={{
                            tabBarLabel: 'Notes',
                            tabBarIcon: ({ color, size }) => (
                                <SimpleLineIcons name="notebook" size={22} color={color} />
                            ),
                        }}
                    />
                </Tab.Navigator>
        </NavigationContainer>
    );
}
