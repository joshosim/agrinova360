import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';

import HomePage from './home';
import Inventory from './inventory';
import Reports from './reports';
import Workers from './workers';

function TabLayout() {

  const _renderIcon = (routeName: string, selectedTab: string) => {
    let icon = '';

    switch (routeName) {
      case 'home':
        icon = 'home-outline';
        break;
      case 'inventory':
        icon = 'cube-outline';
        break;
      case 'reports':
        icon = 'bar-chart-outline';
        break;
      case 'workers':
        icon = 'person-outline';
        break;
    }

    return (
      <Ionicons
        name={icon as any}
        size={25}
        color={routeName === selectedTab ? 'black' : 'gray'}
      />
    );
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }: any) => (
    <TouchableOpacity onPress={() => navigate(routeName)} style={styles.tabbarItem}>
      {_renderIcon(routeName, selectedTab)}
    </TouchableOpacity>
  );

  const renderCircle = () => (
    <Animated.View style={styles.btnCircleUp}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert('Quick Action')}
      >
        <Ionicons name="add" color="gray" size={25} />
      </TouchableOpacity>
    </Animated.View>
  )

  return (

    <CurvedBottomBar.Navigator
      id="main-bottom-bar"
      type="UP"
      width={400} // Adjust based on your screen width
      height={55}
      circleWidth={50}
      circlePosition="CENTER"
      bgColor="white"
      initialRouteName="home"
      borderTopLeftRight
      borderColor="#E0E0E0"
      borderWidth={1}
      style={styles.bottomBar}
      renderCircle={renderCircle}
      tabBar={renderTabBar}
      shadowStyle={{}}
      screenListeners={{}}
      backBehavior="initialRoute"
      screenOptions={{}}
      defaultScreenOptions={{}}
    >
      <CurvedBottomBar.Screen
        name="home"
        component={HomePage}
        position="LEFT"
      />
      <CurvedBottomBar.Screen
        name="inventory"
        component={Inventory}
        position="LEFT"
      />
      <CurvedBottomBar.Screen
        name="reports"
        component={Reports}
        position="RIGHT"
      />
      <CurvedBottomBar.Screen
        name="workers"
        component={Workers}
        position="RIGHT"
      />
    </CurvedBottomBar.Navigator>

  );
}

export default TabLayout

const styles = StyleSheet.create({
  bottomBar: {},
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8',
    bottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
});
