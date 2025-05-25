import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { api, fetchPokemonByName } from "../services/api";

interface Props {
  name: string | null;
  darkMode: boolean;
}

interface Evolotion {
  name: string;
  image: string;
}

export default function Pokemon({ name, darkMode }: Props) {
  const [pokemon, setPokemon] = useState<any>(null);
  const [evolution, setEvolution] = useState<Evolotion[]>([]);

  const styles = getStyles(darkMode);

  const saveEvolution = (chain: any): string[] => {
    const evolutions: string[] = [];
    let current = chain;
    while (current) {
      evolutions.push(current.species.name);
      current = current.evolves_to[0];
    }
    return evolutions;
  };

  useEffect(() => {
    const loadPokemon = async () => {
      if (!name) return;

      try {
        const response = await fetchPokemonByName(name);
        setPokemon(response);

        const speciesURL = response.species.url;
        const speciesResponse = await api.get(speciesURL);
        const evolutionURL = speciesResponse.data.evolution_chain.url;
        const evolutionResponse = await api.get(evolutionURL);
        const evolutions = saveEvolution(evolutionResponse.data.chain);

        const evolutionImages = await Promise.all(
          evolutions.map(async (evoName) => {
            const evoResponse = await fetchPokemonByName(evoName);
            return {
              name: evoName,
              image:
                evoResponse.sprites.other["official-artwork"].front_default,
            };
          })
        );

        setEvolution(evolutionImages);
      } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
      }
    };

    loadPokemon();
  }, [name]);

  if (!pokemon) {
    return (
      <Text style={styles.loadingText}>
        Carregando informações do Pokémon...
      </Text>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }} // opcional para espaçamento
    >
      <View style={styles.header}>
        <Image
          source={{
            uri: pokemon.sprites.other["official-artwork"].front_default,
          }}
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.namePokemon}>
        #{pokemon.id} - {pokemon.name}
      </Text>

      <View style={styles.typesContainer}>
        {pokemon.types.map((t: any) => (
          <Text key={t.type.name} style={styles.typePokemon}>
            {t.type.name.toUpperCase()}
          </Text>
        ))}
      </View>

      <View style={styles.infoPokemon}>
        <View style={styles.info}>
          <Text style={styles.infoText1}>{pokemon.weight / 10} KG</Text>
          <Text style={styles.infoText2}>Peso</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoText1}>{pokemon.height / 10} m</Text>
          <Text style={styles.infoText2}>Altura</Text>
        </View>
      </View>

      <Text style={styles.namePokemon}>Habilidades</Text>

      <View style={styles.infoPokemon}>
        {pokemon.abilities.map((a: any) => (
          <View key={a.ability.name} style={styles.info}>
            <Text style={styles.infoText1}>{a.ability.name}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.namePokemon}>Evoluções</Text>

      <View style={styles.footer}>
        {evolution.map((evo, index) => (
          <View key={evo.name || index} style={styles.footerCardContainer}>
            <View style={styles.footerCard}>
              <Image
                source={{ uri: evo.image }}
                style={{ width: 50, height: 50 }}
              />
            </View>
            <Text style={styles.infoText2}>{evo.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#121212" : "#F9F9F9",
      padding: 16,
    },

    header: {
      backgroundColor: isDarkMode ? "#1E1E1E" : "#EFEFEF",
      alignItems: "center",
      justifyContent: "center",
      padding: 30,
      borderRadius: 10,
      shadowColor: isDarkMode ? "#000" : "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.8 : 0.05,
      shadowRadius: 3,
      elevation: 2,
      marginBottom: 20,
    },

    namePokemon: {
      fontSize: 26,
      marginVertical: 12,
      fontWeight: "bold",
      textAlign: "center",
      color: isDarkMode ? "#fff" : "#333",
    },

    typesContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      marginBottom: 20,
    },

    typePokemon: {
      fontSize: 16,
      paddingVertical: 4,
      paddingHorizontal: 10,
      backgroundColor: isDarkMode ? "#333" : "#EEE",
      borderRadius: 12,
      color: isDarkMode ? "#ccc" : "#555",
      overflow: "hidden",
      fontWeight: "500",
    },

    infoPokemon: {
      flexDirection: "row",
      gap: 15,
      justifyContent: "center",
      flexWrap: "wrap",
      marginBottom: 20,
    },

    info: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderWidth: 1,
      borderRadius: 6,
      borderColor: isDarkMode ? "#333" : "#E2E2E2",
      backgroundColor: isDarkMode ? "#222" : "#FAFAFA",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.8 : 0.03,
      shadowRadius: 2,
      elevation: 1,
    },

    infoText1: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#eee" : "#444",
      marginBottom: 5,
    },

    infoText2: {
      color: isDarkMode ? "#ccc" : "#444",
    },

    footer: {
      flexDirection: "row",
      gap: 15,
      justifyContent: "space-between",
      flexWrap: "wrap",
      marginTop: 20,
    },

    footerCardContainer: {
      width: 88,
      alignItems: "center",
    },

    footerCard: {
      backgroundColor: isDarkMode ? "#1E1E1E" : "#EFEFEF",
      padding: 15,
      borderWidth: 1,
      borderColor: isDarkMode ? "#333" : "#E2E2E2",
      borderRadius: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.8 : 0.05,
      shadowRadius: 2,
      elevation: 2,
      marginBottom: 8,
    },

    loadingText: {
      color: isDarkMode ? "#fff" : "#333",
      fontSize: 16,
      textAlign: "center",
      marginTop: 20,
    },
  });
