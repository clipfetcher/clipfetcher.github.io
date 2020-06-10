<template>
  <div class="container">
    <h4>您的精華影片 {{ highlight_id }}</h4>
    <br />
    <br />
    <div class="m-2">
      <div v-if="highlightPage === 'Loading'" class="d-flex justify-content-center my-2">
        <div class="spinner-border text-secondary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else-if="highlightPage === 'Find'" class="card m-2">
        <div class="m-4">
          <div class="row">
            <div class="col-12 col-md-4 my-2">
              <div v-if="analysisComplete" class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" :src="youtube_embed" allowfullscreen></iframe>
              </div>
              <div v-else class="alert alert-info" role="alert">
                <p class="text-center my-2 py-2">
                  <span>分析中</span>
                </p>
              </div>
            </div>
            <div class="col-12 col-md-8">
              <a
                :href="'https://www.twitch.tv/videos/' + vod_id"
                target="_blank"
                class="card-link float-right"
              >
                <i class="fas fa-link fa-lg" data-toggle="tooltip" title="VOD網址"></i>
              </a>
              <p class="text-left m-0">ID：{{ highlightVideo.vod_id }}</p>
              <p class="text-left m-0">Highlight：{{ highlightVideo.highlight_id }}</p>
              <p class="text-left m-0">實況主：{{ highlightVideo.channel_id }}</p>
              <p class="text-left m-0">遊戲分類：{{ highlightVideo.game }}</p>
              <p class="text-left m-0">目前分數：{{ highlightVideo.avg_score }}</p>
              <p class="text-left m-0">備註：{{ highlightVideo.memo }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="row justify-content-center my-2">
        <div class="alert alert-danger" role="alert">
          <p class="text-center my-2 py-2">
            <span>很抱歉！找不到您的精華影片！</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Highlight",
  props: ["highlight_id"],
  data() {
    return {
      vod_id: "",
      highlightPage: "Loading",
      highlightVideo: null,
      analysisComplete: false
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
        this.highlightVideo = response.data[0];
        if (this.highlightVideo == "" || this.highlightVideo == null)
          this.highlightPage = "Error";
        else {
          this.highlightPage = "Find";
          if (this.highlightVideo.channel_id == "")
            this.analysisComplete = false;
          else this.analysisComplete = true;
        }
        /*
        this.axios
          .post("https://clip-fetcher.herokuapp.com/api/vod/status", {
            vod_id: this.highlight_id
          })
          .then(response => {
            if (this.highlightVideo == "" || this.highlightVideo == null)
              this.highlightPage = "Error";
            else {
              this.highlightPage = "Find";
              if (response.data.status != 2) this.analysisComplete = true;
            }
          })
          .catch(function(error) {
            console.log(error.response);
          });
          */
      })
      .catch(function(error) {
        console.log(error.response);
      });
  },
  computed: {
    youtube_embed: function() {
      let vodData = this.highlightVideo.youtube_url;
      vodData = vodData.split("?");
      let vid = vodData[0];
      vid = vid.split("/");
      let i = 0;
      for (i = 0; i < vid.length; i++);
      let url = vid[i - 1];
      return "https://www.youtube.com/embed/" + url + "?rel=0";
    }
  }
};
</script>