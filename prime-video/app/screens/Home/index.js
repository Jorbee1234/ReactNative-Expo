import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AmazonLogo from "../../../assets/amazon_logo.png";
import MovieTheWhell from "../../../assets/movies/the_wheel_of_time.png";
import PrimeVideoLogo from "../../../assets/prime_video.png";
import { MoviesCard } from "../../components/MoviesCard/index.js";
import { CRIME } from "../../utils/moviesCrimes";
import { MOVIES } from "../../utils/moviesWatch";
import { MOVIESWATCHING } from "../../utils/moviesWatching";

export const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.PrimeVideoLogoImg} source={PrimeVideoLogo} />
        <Image style={styles.AmazonLogoImg} source={AmazonLogo} />
      </View>

      <View style={styles.category}>
        <TouchableOpacity>
          <Text style={styles.categoryText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.categoryText}>TV Shows</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.categoryText}>Movies</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.categoryText}>Kids</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.contentMovies}
      >
        <TouchableOpacity style={styles.MovieImageThumbnail}>
          <Image
            source={MovieTheWhell}
            style={styles.MovieImageThumbnail}
          ></Image>
        </TouchableOpacity>

        <Text style={styles.movieText}>Continue Watching</Text>

        <FlatList
          data={MOVIESWATCHING}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return <MoviesCard movieURL={item.moviesURL} />;
          }}
          horizontal
          contentContainerStyle={styles.contentList}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.movieText}>Crimes Movies</Text>

        <FlatList
          data={CRIME}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return <MoviesCard movieURL={item.moviesURL} />;
          }}
          horizontal
          contentContainerStyle={styles.contentList}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.movieText}>Watch in your language</Text>

        <FlatList
          data={MOVIES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return <MoviesCard movieURL={item.moviesURL} />;
          }}
          horizontal
          contentContainerStyle={styles.contentList}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232F3E",
    alignItems: "flex-start",
  },

  header: {
    width: "100%",
    paddingTop: 80,
    alignItems: "center",
    justifyContent: "center",
  },

  AmazonLogoImg: {
    marginTop: -32,
    marginLeft: 30,
  },

  category: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 30,
    marginBottom: 15,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFf",
  },

  MovieImageThumbnail: {
    width: "100%",
    alignItems: "center",
  },

  contentList: {
    paddingLeft: 18,
    paddingRight: 30,
  },

  movieText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    padding: 15,
  },

  contentMovies: {},
});
