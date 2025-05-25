import { CaretRight, MagnifyingGlass, Moon, Sun } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Pokemon from "./pokemon/[id]";
import { fetchPoke } from "./services/api";
import { ListPokemon } from "./types/pokemon";

export default function Index() {
  const [pokemons, setPokemons] = useState<ListPokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalVisivel, setModalVisible] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const limit = 20;

  const loadPokemons = async () => {
    if (loading) return;

    setLoading(true);
    const data = await fetchPoke(limit, offset);
    const fetchPokemonData: ListPokemon[] = await Promise.all(
      data.map(async (pokemon: { name: string; url: string }) => {
        const response = await fetch(pokemon.url);
        const details = await response.json();

        return {
          name: pokemon.name,
          image: details.sprites.other["official-artwork"].front_default,
        };
      })
    );
    setPokemons((prev) => [...prev, ...fetchPokemonData]);
    setOffset((prev) => prev + limit);
    setLoading(false);
  };

  useEffect(() => {
    loadPokemons();
  }, []);

  const toggleModal = (pokemonName?: string) => {
    if (pokemonName) {
      setSelectedPokemon(pokemonName);
    }
    setModalVisible(!isModalVisivel);
  };

  const buscarPokemon = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
      );
      if (!response.ok) throw new Error("Pokémon não encontrado");

      const data = await response.json();
      toggleModal(data.name);
    } catch (error) {
      Alert.alert("Erro", "Pokémon não encontrado.");
    }
  };

  const theme = {
    background: darkMode ? "#1c1c1c" : "#F7776A",
    inputBg: darkMode ? "#333" : "#FA9A8B",
    inputText: "#FFF",
    contentBg: darkMode ? "#2c2c2c" : "#FFF",
    contentText: darkMode ? "#EEE" : "#333",
    footerBg: darkMode ? "#1c1c1c" : "#FFF",
    buttonBg: darkMode ? "#444" : "#F7776A",
    buttonText: "#FFF",
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={styles.logo}>Pokedex</Text>

        <Pressable onPress={() => setDarkMode(!darkMode)}>
          {darkMode ? (
            <Moon size={32} color="#FFF" />
          ) : (
            <Sun size={32} color="#FFF" />
          )}
        </Pressable>
      </View>

      <Text style={[styles.info, { color: theme.inputText }]}>
        Encontre seu pokemon pesquisando pelo nome
      </Text>

      <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
        <Pressable onPress={buscarPokemon}>
          <MagnifyingGlass size={32} color="#FFF" />
        </Pressable>
        <TextInput
          style={[styles.input, { color: theme.inputText }]}
          placeholder="Pesquisar"
          placeholderTextColor="#FFF"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={buscarPokemon}
        />
      </View>

      <View style={[styles.content, { backgroundColor: theme.contentBg }]}>
        <Text style={[styles.textContent, { color: theme.contentText }]}>
          Todos os pokemons
        </Text>

        <FlatList
          data={pokemons}
          keyExtractor={(item) => item.name}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => toggleModal(item.name)}
              style={[styles.card, { backgroundColor: theme.contentBg }]}
            >
              <View style={styles.cardInfo}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 60, height: 60 }}
                  resizeMode="contain"
                />

                <View>
                  <Text style={{ color: theme.contentText }}>#{index + 1}</Text>
                  <Text style={{ color: theme.contentText }}>{item.name}</Text>
                </View>
              </View>

              <CaretRight size={32} color={theme.contentText} />
            </Pressable>
          )}
          onEndReached={loadPokemons}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <Text
                style={{
                  textAlign: "center",
                  marginVertical: 16,
                  color: theme.contentText,
                }}
              >
                Carregando...
              </Text>
            ) : null
          }
        />
      </View>

      <Modal
        isVisible={isModalVisivel}
        onBackdropPress={() => toggleModal()}
        style={styles.modal}
        propagateSwipe={true}
        // Removi swipeDirection e onSwipeComplete para evitar conflito
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: darkMode ? "#2c2c2c" : "#FFFFFF" },
          ]}
        >
          {/* Botão de fechar no topo */}
          <View style={styles.modalHeader}>
            <Pressable
              onPress={() => toggleModal()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text
                style={[
                  styles.closeButtonText,
                  { color: darkMode ? "#EEE" : "#333" },
                ]}
              >
                ✕
              </Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <Pokemon name={selectedPokemon} darkMode={darkMode} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const { height: screenHeight } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  logo: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },

  info: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  content: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  textContent: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginVertical: 8,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  modal: {
    justifyContent: "flex-end",
    margin: 0, // Preenche a tela inteira, sem margens externas
  },

  modalContent: {
    height: screenHeight * 0.85, // aumenta para 85% para melhor uso em dispositivos altos
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,

    // Sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    // Sombra Android
    elevation: 12,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: 10,
  },

  closeButtonText: {
    fontSize: 28,
    fontWeight: "600",
  },
});
