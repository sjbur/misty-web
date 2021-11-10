import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    weather: null,
    currentPlace: {},
    favPlaces: [],

    quotes: [
      {
        text: "Все мы гении. Но если вы будете судить рыбу по её способности взбираться на дерево, она проживёт всю жизнь, считая себя дурой.",
        author: "Альберт Эйнштейн",
      },
      {
        text: "Не бывает безвыходных ситуаций. Бывают ситуации, выход из которых тебя не устраивает.",
        author: "Нара Шикамару",
      },
      {
        text: "Если у тебя есть человек, которому можно рассказать сны, ты не имеешь права считать себя одиноким...",
        author: "Фаина Раневская",
      },
      {
        text: "Нужно иметь что-то общее, чтобы понимать друг друга, и чем-то отличаться, чтобы любить друг друга.",
        author: "Поль Жеральди",
      },
      {
        text: "... самый страшный гнев, гнев бессилия.",
        author: "Михаил Булгаков",
      },
      {
        text: "Несчастным или счастливым человека делают только его мысли, а не внешние обстоятельства. Управляя своими мыслями, он управляет своим счастьем.",
        author: "Фридрих Вильгельм Ницше",
      },
      {
        text: "Пройдите мимо нас и простите нам наше счастье.",
        author: "Фёдор Михайлович Достоевский",
      },
      {
        text: "Лучше молчать и показаться дураком, чем заговорить и развеять все сомнения.",
        author: "Марк Твен",
      },
      {
        text: "Задумчивая душа склоняется к одиночеству.",
        author: "Омар Хайям",
      },
      {
        text: "Красота есть во всем, но не всем дано это видеть.",
        author: "Конфуций",
      },
      {
        text: "Если тебе плюют в спину, значит ты впереди.",
        author: "Конфуций",
      },
    ],
    currentQuote: {},
  },
  mutations: {
    SET_WEATHER(state, { value }) {
      state.weather = value;
    },

    ADD_FAV_PLACE(state) {
      if (state.currentPlace.id)
        state.favPlaces.push({
          name: state.currentPlace.name,
          id: state.currentPlace.id,
        });

      if (state.currentPlace.long && state.currentPlace.lat)
        state.favPlaces.push({
          name: state.currentPlace.name,
          long: state.currentPlace.long,
          lat: state.currentPlace.lat,
        });

      localStorage.setItem("favPlaces", JSON.stringify(state.favPlaces));

      console.log("local fav places: ", localStorage.getItem("favPlaces"));
    },

    REMOVE_FAV_PLACE(state, { index }) {
      state.favPlaces.splice(index, 1);

      localStorage.setItem("favPlaces", JSON.stringify(state.favPlaces));
    },

    SET_CURRENT_PLACE(state, { value }) {
      console.log("set current place", value);
      state.currentPlace = value;
    },

    INIT_STORE(state) {
      const localFavPlaces = localStorage.getItem("favPlaces");

      if (localFavPlaces)
        state.favPlaces = JSON.parse(localStorage.getItem("favPlaces"));
    },

    GET_RANDOM_QUOTE: (state) => {
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }

      let newQuote = state.quotes[getRandomInt(state.quotes.length)];

      if (newQuote.text === state.currentQuote.text)
        newQuote = state.quotes[getRandomInt(state.quotes.length)];

      state.currentQuote = newQuote;
    },
  },
  actions: {
    loadWeather({ commit }, cityId) {
      commit("GET_RANDOM_QUOTE");

      const url = cityId
        ? "http://localhost:3000/?id=" + cityId
        : "http://localhost:3000";
      axios.get(url).then((resp) => {
        commit("SET_WEATHER", { value: resp.data });
      });
    },

    loadWeatherBasedOnCords({ commit }, payload) {
      const url = `http://localhost:3000/?long=${payload.long}&lat=${payload.lat}`;

      commit("GET_RANDOM_QUOTE");

      axios.get(url).then((resp) => {
        commit("SET_WEATHER", { value: resp.data });
        commit("SET_CURRENT_PLACE", {
          value: {
            name: resp.data.locationName,
            long: payload.long,
            lat: payload.lat,
          },
        });
      });
    },

    loadFavPlace({ state, commit, dispatch }, index) {
      const place = state.favPlaces[index];

      console.log(place);

      if (place.long && place.lat) {
        commit("SET_CURRENT_PLACE", {
          value: {
            name: place.name,
            long: place.long,
            lat: place.lat,
          },
        });

        dispatch("loadWeatherBasedOnCords", {
          long: place.long,
          lat: place.lat,
        });
      }

      if (place.id) {
        commit("SET_CURRENT_PLACE", {
          value: {
            name: place.name,
            id: place.id,
          },
        });

        dispatch("loadWeather", place.id);
      }
    },
  },
  getters: {
    getWeather: (state) => {
      return state.weather;
    },

    getFavPlaces: (state) => state.favPlaces,

    isFavPlace: (state) => {
      const foundPlaces = state.favPlaces.filter((place) => {
        return place.name.includes(state.currentPlace.name);
      });

      return foundPlaces.length > 0;
    },

    getCurrentQuote: (state) => state.currentQuote,
  },
  modules: {},
});
