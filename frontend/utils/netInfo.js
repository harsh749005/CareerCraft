import NetInfo from '@react-native-community/netinfo';
    const netInfoHandler = NetInfo.addEventListener(state => {
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
  });
  
  // To unsubscribe to these update, just use:
  export default netInfoHandler;