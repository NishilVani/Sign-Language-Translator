import { useEffect, useRef, useState } from "react";
import {
    PermissionsAndroid,
    View,
    StyleSheet,
    StatusBar,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { useIsFocused } from "@react-navigation/core";
import {
    useFonts,
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import { Camera, getCameraFormat, useCameraDevice } from "react-native-vision-camera";

import History from "../assets/history1.svg";
import Flip_cam from "../assets/camera_flip.svg";

export default function HomePage({ navigation, route }) {
    let [fontsLoaded] = useFonts({
        // Poppins_100Thin,
        // Poppins_100Thin_Italic,
        // Poppins_200ExtraLight,
        // Poppins_200ExtraLight_Italic,
        // Poppins_300Light,
        // Poppins_300Light_Italic,
        // Poppins_400Regular,
        // Poppins_400Regular_Italic,
        // Poppins_500Medium,
        // Poppins_500Medium_Italic,
        Poppins_600SemiBold,
        // Poppins_600SemiBold_Italic,
        // Poppins_700Bold,
        // Poppins_700Bold_Italic,
        // Poppins_800ExtraBold,
        // Poppins_800ExtraBold_Italic,
        // Poppins_900Black,
        // Poppins_900Black_Italic,
    });
    const [Type, setType] = useState("back");
    const device = useCameraDevice(Type);
    const isFocused = useIsFocused();
    const [cam_height, set_cam_height] = useState("100%");
    const format = getCameraFormat(device, [
        { videoAspectRatio: 3 / 4 },
        { videoResolution: { width: 480, height: 640 } },
    ]);
    const [HasCameraPer, setHasCameraPer] = useState(null);
    // const [record, setRecord] = useState(null);
    const cameraRef = useRef(null);
    const [active, setactive] = useState(false);

    const handle_active = () => {
        if (active == true) {
            setactive(false);
            stopVideo();
        } else {
            setactive(true);
            takeVideo();
        }
    };

    useEffect(() => {
        checkPermission();
    }, [HasCameraPer]);

    useEffect(
        () =>
            navigation.addListener("focus", () => {
                setTimeout(() => {
                    set_cam_height(cam_height == "100%" ? "99%" : "100%");
                }, 1000);
            }),
        [navigation, cam_height]
    );

    const checkPermission = async () => {
        const newCameraPermission = await Camera.requestCameraPermission();

        setHasCameraPer(newCameraPermission);
    };
    const handle_camSwitch = () => {
        Type == "back" ? setType("front") : setType("back");
    };
    const navigate_to_history = () => {
        navigation.navigate("History");
    };

    const takeVideo = async () => {
        await cameraRef.current.startRecording({
            onRecordingFinished: (video) => {
                navigation.navigate("Translated_Video", { uri: video.path, styles: styles });
            },
            onRecordingError: (error) => console.error(error),
        });
        setTimeout(async () => {
            await cameraRef.current.stopRecording();
            setactive(false);
        }, 1500);
    };
    const stopVideo = async () => {
        await cameraRef.current.stopRecording();
        setactive(false);
    };
    if (device == null) return <NoCameraDeviceError />;
    else if (!fontsLoaded) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#151414",
                }}
            />
        );
    } else if (!isFocused) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#151414",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text>Re-Open the App</Text>
            </View>
        );
    } else if (HasCameraPer == null) {
        <View
            style={{
                flex: 1,
                backgroundColor: "#151414",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Text>Allow Camera Permissions To Use the App</Text>
        </View>;
    } else {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#151414" barStyle="light-content" />
                <View style={styles.camera_top}>
                    <Text style={styles.app_name}>Sign Language Translator</Text>
                </View>
                <View style={styles.camera_parent}>
                    <Camera
                        ref={cameraRef}
                        style={styles.camera}
                        device={device}
                        isActive={true}
                        format={format}
                        video={true}
                        fps={30}
                        height={cam_height}
                    />
                </View>
                <View style={styles.camera_actions}>
                    <View style={styles.camera_flip_parent}>
                        {active == true ? null : (
                            <TouchableOpacity onPress={navigate_to_history}>
                                <Image
                                    style={styles.history_btn}
                                    source={require("../assets/History.png")}
                                />
                                {/* <History style={styles.history_btn} /> */}
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.record_btn_parent}>
                        <TouchableOpacity onPress={handle_active}>
                            <View
                                style={
                                    active == true
                                        ? [styles.record_btn, styles.record_btn_active]
                                        : styles.record_btn
                                }
                            >
                                <View
                                    style={
                                        active == true
                                            ? [styles.record_btn_dot, styles.record_btn_dot_active]
                                            : styles.record_btn_dot
                                    }
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.camera_flip_parent}>
                        {active == true ? null : (
                            <TouchableOpacity onPress={handle_camSwitch}>
                                <Image
                                    style={styles.camera_flip}
                                    source={require("../assets/camera_flip.png")}
                                />
                                {/* <Flip_cam style={styles.camera_flip} /> */}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#151414",
        alignItems: "left",
    },
    camera_top: {
        height: "7%",
        width: "100%",
        justifyContent: "center",
    },
    app_name: {
        color: "white",
        fontFamily: "Poppins_600SemiBold",
        fontSize: 24,
        textAlign: "center",
    },
    camera_parent: {
        flex: 2.4,
        flex_grow: 1,
    },
    camera: {
        width: "100%",
    },
    translation: {
        color: "white",
        fontFamily: "Poppins_600SemiBold",
        fontSize: 48,
        marginLeft: "4%",
        flex: 0.4,
    },
    camera_actions: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    record_btn_parent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    record_btn: {
        height: 80,
        width: 80,
        borderColor: "white",
        borderWidth: 3,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    record_btn_active: {
        borderWidth: 0,
        backgroundColor: "#F44040",
    },
    record_btn_dot: {
        height: 60,
        width: 60,
        backgroundColor: "white",
        borderRadius: 100,
    },
    record_btn_dot_active: {
        borderRadius: 8,
        height: 32,
        width: 32,
        borderColor: "white",
        backgroundColor: "#F44040",
        borderWidth: 3,
    },
    camera_flip_parent: {
        flex: 1,
        alignItems: "center",
    },
    camera_flip: {
        height: 40,
        width: 40,
    },
    // history_btn: {
    //     height: 100,
    //     width: 100,
    // },
});
