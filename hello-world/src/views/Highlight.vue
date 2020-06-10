<template>
  <div class="highlight">
    <h1>This is a highlight page</h1>
    <p>{{ highlight_id }}</p>
    <p>{{ highlightVideos }}</p>
  </div>
</template>

<script>
export default {
  name: "Highlight",
  props: ["highlight_id"],
  data() {
    return {
      highlightVideos: null
    };
  },
  mounted() {
    this.axios
      .get("https://clip-fetcher.herokuapp.com/api/vod/highlight", {
        params: {
          highlight_id: this.highlight_id
        }
      })
      .then(response => {
        this.highlightVideos = response.data;
      })
      .catch(function(error) {
        console.log(error.response);
      });
  }
};
</script>