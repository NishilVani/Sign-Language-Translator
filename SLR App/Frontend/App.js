import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import {HomePage} from "./app/screens/HomePage";

import History from "./app/screens/History";
import Translated_Video from "./app/screens/Translated_Video";
import HomePage from "./app/screens/HomePage";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        // <History/>
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
                <Stack.Screen name="History" component={History} options={{ headerShown: false }} />
                <Stack.Screen
                    name="Translated_Video"
                    component={Translated_Video}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
