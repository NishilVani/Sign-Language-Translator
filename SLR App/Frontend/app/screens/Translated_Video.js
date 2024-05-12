import React, { useState, useEffect } from "react";
import { Video, ResizeMode } from "expo-av";
import { View, StyleSheet, StatusBar, Image, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import RNFS from "react-native-fs";

import Back from "../assets/Back.svg";

function Translated_Video({ navigation, route }) {
    const { uri, styles } = route.params;
    const [translation_text, set_translation_text] = useState("Loading..");
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;
    const fileName = "/History.json";
    const directory = RNFS.DocumentDirectoryPath + fileName;
    const navigate_to_home = () => {
        navigation.navigate("Home");
    };

    const readJSONFromFile = async () => {
        try {
            // Read the file content as a string
            const fileContent = await RNFS.readFile(directory, "utf8");

            // Parse the string into JSON
            const jsonData = JSON.parse(fileContent);

            console.log("JSON data read from file:", jsonData.history);
            return jsonData;
        } catch (error) {
            console.log("Error reading JSON from file:", error.message);
            return null;
        }
    };

    const savehistory = async (data) => {
        try {
            // Convert JavaScript object to JSON string
            const jsonString = JSON.stringify({
                history: data,
            });

            // Write JSON string to the file
            await RNFS.writeFile(directory, jsonString, "utf8");
        } catch (error) {
            console.error("Error writing data to file:", error);
        }
    };

    var file = {
        uri: "file://" + uri,
        type: "video/mp4",
        name: "video.mp4",
    };
    var body = new FormData();
    body.append("file", file);

    useEffect(() => {
        (async () => {
            axios
                .post("http://192.168.185.22:8000/translate_video/", body, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(function (response) {
                    readJSONFromFile().then((jsonData) => {
                        if (jsonData != null) {
                            let history = jsonData.history;
                            if (
                                history.length > 0 &&
                                history[history.length - 1].date === currentDate
                            ) {
                                history[history.length - 1].list.push(response.data);
                                savehistory(history);
                            } else {
                                console.log("ff");
                                savehistory([
                                    {
                                        date: currentDate,
                                        list: [response.data],
                                    },
                                ]);
                            }
                        } else {
                            savehistory([
                                {
                                    date: currentDate,
                                    list: [response.data],
                                },
                            ]);
                        }
                    });

                    set_translation_text(response.data);
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.message);
                    } else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log(error.message);
                    }
                });
        })();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#151414" barStyle="light-content" />
            <View style={styles.camera_top}>
                <TouchableOpacity onPress={navigate_to_home}>
                    {/* <Back style={[{ marginLeft: "4%" }, styles.history_btn]} /> */}
                    <Image
                        style={[{ marginLeft: "4%" }, styles.history_btn]}
                        source={require("../assets/Back.png")}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.camera_parent}>
                <Video
                    style={[{ height: "100%" }, styles.camera]}
                    source={{
                        uri: uri,
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    isMuted={true}
                    shouldPlay={true}
                />
            </View>
            <View
                style={[
                    {
                        justifyContent: "flex-start",
                        flexGrow: 1,
                        flexDirection: "column",
                    },
                ]}
            >
                <Text
                    style={{
                        marginLeft: "4%",
                        marginTop: "4%",
                        color: "#5d5d5d",
                        fontFamily: "Poppins_600SemiBold",
                        fontSize: 25,
                    }}
                >
                    Result:
                </Text>
                <Text style={[styles.translation, { flexGrow: 1 }]}>{translation_text}</Text>
            </View>
        </View>
    );
}

export default Translated_Video;
