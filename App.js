/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from "react-native";

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";
import { BleManager } from "react-native-ble-plx";
import { encode, hex_to_ascii, decode } from "./base64";

const SERVICE = "4a1ce0b4-edec-4b6b-a95e-5693b240a36d";
const WRITE_CHAR = "90862a62-570b-46aa-95d1-dbadcaff61a1";

const App = () => {
  const [manager] = useState(new BleManager());

  const sendRequest = async (device) => {
    
    
    const allowCommand = encode(hex_to_ascii(
      // "0004D30668656C6C6F0000000000000000010203" set name hello
      "0004D3046162636465666768696A6B6C6D010203"
    ));
    const allowCommandRes = await device.writeCharacteristicWithResponseForService(
      SERVICE,
      WRITE_CHAR,
      allowCommand
    );
    
    const setSecretCommand = encode(hex_to_ascii(
      // "0004D30668656C6C6F0000000000000000010203" set name hello
      "0004D3046162636465666768696A6B6C6D010203"
    ));
    const setSecretCommandRes = await device.writeCharacteristicWithResponseForService(
      SERVICE,
      WRITE_CHAR,
      setSecretCommand
    );
  };

  const scanAndConnect = () => {
    console.log("HE");
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }
      device.name && console.log("device", device.name);
      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === "KoutiDeadd") {
        // Stop scanning as it's not necessary if you are scanning for one device.
        // manager.stopDeviceScan();
        device
          .connect()
          .then((_device) => {
            _device.isConnected().then((e) => {
              // console.log('_device', _device);
              // manager
              //   .readCharacteristicForDevice(
              //     _device.id,
              //     SERVICE,
              //     '9abc01bb-f173-4c56-842b-3f748078c954',
              //   )
              //   .then((e) => {
              //     console.log('e', e);
              //   });
              console.log("isConnected", e);
              e &&
                _device.monitorCharacteristicForService(
                  "4a1ce0b4-edec-4b6b-a95e-5693b240a36d",
                  "9abc01bb-f173-4c56-842b-3f748078c954",

                  (error, characteristic) => {
                    console.log("characteristic", decode(characteristic.value));
                    // console.log("print: ", characteristic.value);
                    console.log("error", error);
                  }
                );
            sendRequest(_device);
            // return device.discoverAllServicesAndCharacteristics();
            device.discoverAllServicesAndCharacteristics().then((e) => {
              console.log(
                "discoverAllServicesAndCharacteristics",
                e.serviceUUIDs
              );
            });
          })
          .then((device) => {
            console.log("device-connecct", device);
            // Do work on device with services and characteristics
          })
          .catch((error) => {
            // Handle errors
            console.log("cconnect-error", error);
          });
        // Proceed with connection.
      }
    });
  };

  useEffect(() => {
    scanAndConnect();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <Text>asdas</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: "absolute",
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
    color: Colors.dark,
  },
  highlight: {
    fontWeight: "700",
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: "600",
    padding: 4,
    paddingRight: 12,
    textAlign: "right",
  },
});

export default App;
