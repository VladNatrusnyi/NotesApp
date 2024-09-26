import {Platform, SafeAreaView, StatusBar, View} from "react-native";
import {Provider} from "react-redux";
import {store} from "./src/store";

import {AppStack} from "./src/navigation/AppStack";
import {COLORS} from "./src/helpers/colors";
import {GestureHandlerRootView} from "react-native-gesture-handler";


const App = () => {
  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
          <Provider store={store} >
              <View style={{flex: 1, backgroundColor: COLORS.bg}}>
                  <SafeAreaView style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 40}}>
                      <AppStack />
                  </SafeAreaView>
              </View>
          </Provider>
      </GestureHandlerRootView>
  );
};

export default App;
