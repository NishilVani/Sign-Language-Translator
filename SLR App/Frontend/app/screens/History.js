import React, { useEffect, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import {
    useFonts,
    // Poppins_100Thin,
    // Poppins_100Thin_Italic,
    // Poppins_200ExtraLight,
    // Poppins_200ExtraLight_Italic,
    // Poppins_300Light,
    // Poppins_300Light_Italic,
    Poppins_400Regular,
    // Poppins_400Regular_Italic,
    // Poppins_500Medium,
    // Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    // Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    // Poppins_700Bold_Italic,
    // Poppins_800ExtraBold,
    // Poppins_800ExtraBold_Italic,
    // Poppins_900Black,
    // Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import RNFS from "react-native-fs";
import { Image } from "react-native";

import Cross from "../assets/Cross.svg";
import Cancel from "../assets/Cancel.svg";
import Bullet from "../assets/Bullet.svg";

export default function History({ navigation }) {
    let [fontsLoaded] = useFonts({
        // Poppins_100Thin,
        // Poppins_100Thin_Italic,
        // Poppins_200ExtraLight,
        // Poppins_200ExtraLight_Italic,
        // Poppins_300Light,
        // Poppins_300Light_Italic,
        Poppins_400Regular,
        // Poppins_400Regular_Italic,
        // Poppins_500Medium,
        // Poppins_500Medium_Italic,
        Poppins_600SemiBold,
        // Poppins_600SemiBold_Italic,
        Poppins_700Bold,
        // Poppins_700Bold_Italic,
        // Poppins_800ExtraBold,
        // Poppins_800ExtraBold_Italic,
        // Poppins_900Black,
        // Poppins_900Black_Italic,
    });
    // Format Date
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const fileName = "/History.json";
    const directory = RNFS.DocumentDirectoryPath + fileName;
    const [data, setdata] = useState({
        history: [],
    });
    useEffect(() => {
        readJSONFromFile().then((jsonData) => {
            if (jsonData != null) {
                setdata(jsonData);
            }
        });
    }, []);
    const readJSONFromFile = async () => {
        try {
            // Read the file content as a string
            const fileContent = await RNFS.readFile(directory, "utf8");

            // Parse the string into JSON
            const jsonData = JSON.parse(fileContent);

            return jsonData;
        } catch (error) {
            console.error("Error reading JSON from file:", error.message);
            return null;
        }
    };

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const dayOfWeek = daysOfWeek[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${dayOfWeek}, ${day} ${month} ${year}`;
    };

    const empty_history = () => {
        update_history([]);
    };
    const delete_row = (index1, index2) => {
        let hs = data;
        hs.history[index1].list = data.history[index1].list
            .slice(0, index2)
            .concat(data.history[index1].list.slice(index2 + 1));
        if (hs.history[index1].list.length == 0) {
            hs.history = data.history.slice(0, index1).concat(data.history.slice(index1 + 1));
        }
        update_history(hs.history);
    };
    const update_history = async (data) => {
        console.log(data);
        setdata({
            history: data,
        });

        try {
            // Convert JavaScript object to JSON string
            const jsonString = JSON.stringify({
                history: data,
            });

            // Write JSON string to the file
            await RNFS.writeFile(directory, jsonString, "utf8");

            console.log("Data has been written to the file successfully!");
        } catch (error) {
            console.error("Error writing data to file:", error);
        }
    };

    //Data

    let render_rows = ({ item }) => {
        return (
            <View style={styles.history_date}>
                <Text style={styles.date_heading}> {formatDate(item.date)} </Text>
                {item.list.map((history, index) => (
                    <View key={index} style={styles.history_row}>
                        {/* <Bullet style={styles.row_bullet} /> */}
                        <Image style={styles.row_bullet} source={require("../assets/Bullet.png")} />
                        <Text style={styles.history_text}>{history}</Text>

                        {/* <Cross
                            onPress={() => delete_row(data.history.indexOf(item), index)}
                            style={styles.history_delete_btn}
                        /> */}
                        <Image
                            onPress={() => delete_row(data.history.indexOf(item), index)}
                            style={styles.history_delete_btn}
                            source={require("../assets/Cross.png")}
                        />
                    </View>
                ))}
            </View>
        );
    };
    const navigate_to_home = () => {
        navigation.navigate("Home");
    };

    if (!fontsLoaded) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#151414",
                }}
            />
        );
    }
    return (
        <View style={styles.container}>
            
            <StatusBar backgroundColor="#151414" barStyle="light-content" />
            <View style={styles.top_headings}>
                <View style={styles.main_headings_parent}>
                    <Text style={styles.main_headings}>{"History"}</Text>
                    <TouchableNativeFeedback onPress={navigate_to_home}>
                        <View style={styles.page_close_btn}>
                            {/* <Cancel /> */}
                            <Image source={require("../assets/Cancel.png")} />
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <Text style={styles.sub_headings}>{"Your Translator History"}</Text>
                <TouchableNativeFeedback onPress={empty_history}>
                    <View style={styles.clr_history_btn}>
                        <Text style={styles.clr_history_btn_text}>{"Clear History"} </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
            <View style={styles.history_list}>
                {data.history.length == 0 ? (
                    <Text style={styles.no_history}>No History</Text>
                ) : (
                    <FlatList data={data.history} renderItem={render_rows} />
                )}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#151414",
        alignItems: "left",
    },
    top_headings: {
        flex: 0.25,
        borderBottomColor: "#5d5d5d",
        borderBottomWidth: 0.8,
        paddingHorizontal: "4%",
    },
    main_headings_parent: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
    },
    main_headings: {
        flex: 0.9,
        color: "white",
        fontFamily: "Poppins_400Regular",
        fontSize: 40,
    },
    page_close_btn: {
        flexGrow: 0.15,
        alignItems: "flex-end",
        justifyContent: "center",
        marginRight: "1%",
    },
    sub_headings: {
        flex: 1,
        color: "white",
        fontFamily: "Poppins_400Regular",
        fontSize: 20,
    },
    clr_history_btn: {
        flex: 0.8,
        height: "80%",
        width: "45%",
        backgroundColor: "white",
        borderRadius: 1000,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "4%",
    },
    clr_history_btn_text: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
    },
    history_list: {
        flex: 0.75,
        paddingHorizontal: "4%",
    },
    history_date: {},
    no_history: {
        flex: 1,
        color: "#5d5d5d",
        fontFamily: "Poppins_400Regular",
        fontSize: 40,
        textAlign: "center",
        textAlignVertical: "center",
    },
    date_heading: {
        color: "white",
        fontFamily: "Poppins_700Bold",
        fontSize: 18,
        marginVertical: "4%",
    },
    history_row: {
        flexGrow: 1,
        flexDirection: "row",
        alignItems: "center",
        marginVertical: "2%",
    },
    row_bullet: {
        // flex: 0.1,
        marginRight: "5%",
    },
    history_text: {
        flex: 1,
        color: "white",
        fontFamily: "Poppins_400Regular",
        fontSize: 20,
    },
    history_delete_btn: {
        marginLeft: "2%",
    },
});
