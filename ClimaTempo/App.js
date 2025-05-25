import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  Appearance,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";

const API_KEY = "xx";

export default function App() {
  const [city, setCity] = useState("Niteroi");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [darkMode, setDarkMode] = useState(
    Appearance.getColorScheme() === "dark"
  );

  const { width } = useWindowDimensions();
  const theme = darkMode ? darkStyles : lightStyles;

  async function fetchWeather(city) {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
      );
      const result = await res.json();

      if (result?.cod === "404") {
        setWeatherData(null);
        setErrorMessage("Cidade não encontrada");
        setLoading(false);
        return;
      }

      setWeatherData(result);
    } catch (error) {
      setErrorMessage("Erro ao buscar dados");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWeather(city);
  }, []);

  return (
    <View
      style={[theme.container, { paddingHorizontal: width < 400 ? 20 : 40 }]}
    >
      <StatusBar style={darkMode ? "light" : "dark"} />

      <TouchableOpacity
        style={theme.themeToggle}
        onPress={() => setDarkMode(!darkMode)}
      >
        <Text style={theme.themeToggleText}>
          {darkMode ? "🌞 Modo Claro" : "🌙 Modo Escuro"}
        </Text>
      </TouchableOpacity>

      <View style={theme.containerTextBox}>
        <TextInput
          placeholder="Cidade"
          placeholderTextColor={darkMode ? "#ccc" : "#888"}
          style={theme.textBox}
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity onPress={() => fetchWeather(city)} style={theme.icon}>
          {loading ? (
            <ActivityIndicator color={darkMode ? "#fff" : "#000"} size={24} />
          ) : (
            <Feather
              name="search"
              size={24}
              color={darkMode ? "#fff" : "#000"}
            />
          )}
        </TouchableOpacity>
      </View>

      {errorMessage && <Text style={theme.textError}>{errorMessage}</Text>}

      {weatherData && !errorMessage && (
        <>
          <Text style={theme.textCity}>{weatherData.name}</Text>
          <Text style={theme.textTemp}>
            {Math.ceil(weatherData.main.temp)}°
          </Text>
          <Image
            style={theme.image}
            source={{
              uri: `https://openweathermap.org/img/wn/${weatherData.weather?.[0].icon}@2x.png`,
            }}
          />
        </>
      )}
    </View>
  );
}

// Estilos claros
const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
  },
  textBox: {
    backgroundColor: "#f0f0f0",
    width: 200,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
  containerTextBox: {
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
  },
  icon: {
    padding: 10,
  },
  textCity: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  textTemp: {
    fontSize: 40,
    fontWeight: "700",
    marginTop: 10,
    color: "#333",
  },
  textError: {
    color: "red",
    marginVertical: 20,
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 100,
  },
  themeToggle: {
    position: "absolute",
    top: 50,
    right: 30,
    padding: 8,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  themeToggleText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

// Estilos escuros
const darkStyles = StyleSheet.create({
  ...lightStyles,
  container: {
    ...lightStyles.container,
    backgroundColor: "#1c1c1e",
  },
  textBox: {
    ...lightStyles.textBox,
    backgroundColor: "#2c2c2e",
    color: "#fff",
  },
  containerTextBox: {
    ...lightStyles.containerTextBox,
    borderColor: "#555",
  },
  textCity: {
    ...lightStyles.textCity,
    color: "#fff",
  },
  textTemp: {
    ...lightStyles.textTemp,
    color: "#fff",
  },
  textError: {
    ...lightStyles.textError,
    color: "#ff6b6b",
  },
  themeToggle: {
    ...lightStyles.themeToggle,
    backgroundColor: "#333",
  },
  themeToggleText: {
    ...lightStyles.themeToggleText,
    color: "#fff",
  },
});
