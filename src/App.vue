<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <v-app-bar absolute app dark style="background-color: #303030" flat>
      <v-row justify="space-between" align="center" no-gutters>
        <v-row no-gutters align="center">
          <div @click="toggleMenu">
            <v-btn ark icon>
              <v-icon> mdi-menu</v-icon>
            </v-btn>
          </div>

          <v-btn @click="addPlace" dark icon>
            <v-icon v-if="isFavPlace">mdi-star</v-icon>
            <v-icon v-else>mdi-star-outline</v-icon>
          </v-btn>

          <Search />
        </v-row>

        <div class="d-flex align-center">
          <v-btn :loading="loadingLocation" @click="getCurrentWeather" icon>
            <v-icon> mdi-map-marker</v-icon>
          </v-btn>
          <div class="mx-1">{{ weather ? weather.locationName : "" }}</div>
        </div>
      </v-row>
    </v-app-bar>

    <notifications position="bottom right" />

    <v-navigation-drawer v-model="showMenu" fixed temporary>
      <v-list>
        <v-list-item
          v-for="(place, index) in favPlaces"
          :key="index"
          @click="navigate(index)"
        >
          <v-list-item-content class="py-2">
            <v-list-item-title>{{ place.name }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon @click.stop="removePlace({ index: index })">
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-dialog
      v-model="showMobileMenu"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark flat>
          <v-btn icon dark @click="showMobileMenu = !showMobileMenu">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <v-spacer />

          <v-btn icon dark @click="editMode = !editMode">
            <v-icon v-if="editMode">mdi-pencil</v-icon>
            <v-icon v-else>mdi-pencil-outline</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list>
          <Search class="mb-1" mobile="true" v-on:onLoadWeather="toggleMenu" />

          <v-list-item
            v-for="(place, index) in favPlaces"
            :key="index"
            @click="navigate(index)"
          >
            <v-list-item-content class="py-2">
              <v-list-item-title>{{ place.name }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                v-show="editMode"
                icon
                @click="removePlace({ index: index })"
              >
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import Search from "@/components/Search";

export default {
  name: "App",
  components: { Search },
  computed: {
    ...mapGetters({
      weather: "getWeather",
      favPlaces: "getFavPlaces",
      isFavPlace: "isFavPlace",
    }),

    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },

  data: () => ({
    loadingLocation: false,
    showMobileMenu: false,
    showMenu: false,
    editMode: false,
  }),

  mounted() {
    this.getCurrentWeather();
  },

  methods: {
    ...mapMutations({
      addPlace: "ADD_FAV_PLACE",
      initStore: "INIT_STORE",
      removePlace: "REMOVE_FAV_PLACE",
    }),
    ...mapActions({ loadFavPlace: "loadFavPlace" }),

    getCurrentWeather() {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      this.loadingLocation = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          this.$store.dispatch("loadWeatherBasedOnCords", {
            long: position.coords.longitude,
            lat: position.coords.latitude,
          });

          this.loadingLocation = false;
        },
        () =>
          this.$notify(
            {
              type: "error",
              title: "Ошибка",
              text: "Не можем определить ваше местоположение",
            },
            options
          )
      );
    },

    toggleMenu() {
      if (this.$vuetify.breakpoint.smAndDown)
        this.showMobileMenu = !this.showMobileMenu;
      else this.showMenu = !this.showMenu;
    },

    navigate(index) {
      if (!this.editMode) {
        this.loadFavPlace(index);
        this.showMobileMenu = false;
        this.showMenu = false;
      }
    },
  },
};
</script>

<style scoped></style>
