<template>
  <div>
    <div
      class="
        d-flex
        flex-column
        justify-center
        align-center
        pa-5
        fill-height
        transition-ease-in-out
      "
      :style="{ opacity: weather ? 1 : 0 }"
    >
      <img class="weather" style="" :src="weatherImage" alt="" />
      <div class="text-center text-h4 mt-7 grey--text">
        {{ weather ? weather.weatherState : "Ясно" }}
      </div>
      <div class="text-center text-h4 mt-3 mb-7 font-weight-bold">
        {{ weather ? weather.currentTemp + "°" : "0°" }}
      </div>

      <div class="d-flex mx-auto grey--text" style="max-width: 1000px">
        <div class="d-flex flex-column mx-2">
          <div>Ветер: {{ weather ? weather.wind : "0" }}</div>

          <div class="mt-3">
            Влажность: {{ weather ? weather.humidity : "0" }}
          </div>
        </div>

        <div class="d-flex flex-column mx-2 text-right">
          <div>
            Ощущается как {{ weather ? weather.feelsLikeTemp + "°" : "0°" }}
          </div>

          <div class="mt-3">
            {{ weather ? weather.pressure : "0 мм рт. ст." }}
          </div>
        </div>
      </div>

      <div v-if="currentQuote">
        <div class="text-justify mt-7">
          {{ currentQuote.text }}
        </div>
        <div class="text-center">
          <i class="mt-2">— {{ currentQuote.author }}</i>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters({ weather: "getWeather", currentQuote: "getCurrentQuote" }),

    weatherImage() {
      if (!this.weather) return "/day_clear.png";

      switch (this.weather.weatherState.toLowerCase()) {
        case "ясно":
          return "/day_clear.png";
        case "малооблачно":
          return "/cloudy.png";
        case "облачно с прояснениями":
          return "/day_partial_cloud.png";
        case "пасмурно":
          return "/angry_clouds.png";
        case "морось":
          return "/rain.png";
        case "небольшой дождь":
          return "/rain.png";
        case "дождь":
          return "/rain.png";
        case "умеренно сильный дождь":
          return "/rain.png";
        case "сильный дождь":
          return "/rain.png";
        case "длительный сильный дождь":
          return "/rain.png";
        case "ливень":
          return "/rain.png";
        case "град":
          return "/rain.png";
        case "дождь с градом":
          return "/rain.png";
        case "гроза":
          return "/rain_thunder.png";
        case "дождь с грозой":
          return "/rain.png";
        case "дождь со снегом":
          return "/sleet.png";
        case "небольшой снег":
          return "/snow.png";
        case "снег":
          return "/snow.png";
        case "снегопад":
          return "/snow.png";
        default:
          return "/day_clear.png";
      }
    },
  },

  created() {
    document.title = "Misty";

    this.initStore();
  },

  methods: {
    ...mapMutations({ initStore: "INIT_STORE" }),
  },
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: 769px) {
  .weather {
    max-height: 40vh;
  }
}

@media screen and (max-width: 768px) {
  @media (orientation: landscape) {
    .weather {
      max-height: 30vh;
    }
  }

  @media (orientation: portrait) {
    .weather {
      max-width: 50vw;
    }
  }
}
</style>
