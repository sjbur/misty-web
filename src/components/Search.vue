<template>
  <v-autocomplete
    ref="sas"
    v-model="model"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    class="mx-2"
    :class="mobile ? '' : 'd-none d-sm-flex'"
    :style="{ maxWidth: mobile ? 'none' : '400px' }"
    hide-no-data
    light
    hide-details
    hide-selected
    item-text="Description"
    item-value="API"
    placeholder="Поиск"
    solo
    prepend-inner-icon="mdi-magnify"
    return-object
    dense
    rounded
    :menu-props="{
      light: true,
    }"
  ></v-autocomplete>
</template>

<script>
export default {
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    search: null,
  }),

  props: {
    mobile: {
      type: [String, Boolean],
      value: false,
    },
  },

  computed: {
    fields() {
      if (!this.model) return [];

      return Object.keys(this.model).map((key) => {
        return {
          key,
          value: this.model[key] || "n/a",
        };
      });
    },
    items() {
      return this.entries.map((entry) => {
        return entry.name;
      });
    },
  },

  watch: {
    search() {
      if (this.isLoading) return;

      this.isLoading = true;
      setTimeout(
        () =>
          fetch("http://localhost:3000/searchCity?name=" + this.search)
            .then((res) => res.json())
            .then((res) => {
              this.entries = res;
            })
            .finally(() => (this.isLoading = false)),
        1000
      );
    },

    model(val) {
      const newCity = this.entries.filter((entry) => entry.name === val);
      if (newCity.length > 0) {
        const cityUrl = new URL(newCity[0].link);
        const cityId = cityUrl.pathname.replace("/pogoda/", "");

        this.$store.commit("SET_CURRENT_PLACE", {
          value: {
            name: val,
            id: cityId,
          },
        });

        this.$store.dispatch("loadWeather", cityId);

        this.$emit("onLoadWeather");

        this.$nextTick(() => {
          this.model = null;
        });
      }
    },
  },

  methods: {},
};
</script>

<style lang="scss">
.v-select__slot i.v-icon {
  display: none !important;
}
</style>
