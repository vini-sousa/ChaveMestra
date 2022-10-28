import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Veiculos from '../pages/Veiculos';
import Services from '../pages/Services';

const Stack = createNativeStackNavigator();

export function AppRoutes(){
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='Veiculos' component={Veiculos}/>
            <Stack.Screen name='Services' component={Services}/>
        </Stack.Navigator>
    )
}