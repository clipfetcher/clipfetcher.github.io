<template>
  <!-- 精華影片顯示 -->
  <div class="m-4">
    <div class="row">
      <div class="col-12 col-md-4 my-2">
        <div v-if="youtube_url" class="embed-responsive embed-responsive-16by9">
          <iframe class="embed-responsive-item" :src="youtube_embed" allowfullscreen></iframe>
        </div>
        <div v-else class="alert alert-info" role="alert">
          <p class="text-center my-4 py-4">
            <span>分析中</span>
          </p>
        </div>
      </div>
      <div class="col-12 col-md-8">
        <b-dropdown
          size="lg"
          variant="link"
          toggle-class="text-decoration-none"
          class="float-right"
          no-caret
        >
          <template v-slot:button-content>
            <i class="fas fa-chevron-circle-down"></i>
          </template>
          <b-dropdown-item :href="'https://www.twitch.tv/videos/' + vod_id" target="_blank">
            <i class="fas fa-link fa-lg m-1" data-toggle="tooltip" title="VOD網址"></i> 原始鏈結
          </b-dropdown-item>
          <b-dropdown-item :to="'/highlight/' + highlight_id" target="_blank">
            <i class="fas fa-share-square fa-lg m-1" data-toggle="tooltip" title="精華連結"></i> 精華頁面
          </b-dropdown-item>
        </b-dropdown>
        <p class="text-left m-0">標題：{{ memo }}</p>
        <p class="text-left m-0">
          實況主：
          <b-link
            :to="'/results?channel_id=' + channel_id"
            @click.prevent="channelSearch"
          >{{ streamerName }}</b-link>
        </p>
        <p class="text-left m-0">
          遊戲分類：
          <b-link :to="'/results?game=' + game" @click.prevent="gameSearch">{{ game }}</b-link>
        </p>
        <p class="text-left m-0">目前分數：{{ avg_score }}</p>
        <p class="text-left m-0">建立者：</p>
        <p class="text-left m-0">觀看次數：</p>
        <div class="float-right m-1">
          <b-list-group horizontal>
            <b-list-group-item variant="success">影片下載</b-list-group-item>
            <b-list-group-item variant="info">影片分析</b-list-group-item>
            <b-list-group-item>影片上傳</b-list-group-item>
            <b-list-group-item class="p-1">
              <b-button class="mx-1" variant="outline-primary" v-b-tooltip.hover title="重新分析">
                <i class="fas fa-redo-alt"></i>
              </b-button>
              <b-button class="mx-1" variant="outline-primary" v-b-tooltip.hover title="編輯精華">
                <i class="fas fa-user-edit"></i>
              </b-button>
              <b-button class="mx-1" variant="outline-primary" v-b-tooltip.hover title="刪除精華">
                <i class="fas fa-trash-alt"></i>
              </b-button>
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
    </div>
    <hr class="my-4" />
  </div>
</template>

<script>
export default {
  name: "AdminHighlightList",
  props: [
    "vod_id",
    "highlight_id",
    "channel_id",
    "streamerName",
    "game",
    "youtube_url",
    "avg_score",
    "memo",
  ],
  data() {
    return {
      text: "",
      appraiseModalShow: false,

      notAccurate: false,
      videoLong: false,
      analysisLong: false,
      validationText: false,
      haveAppraise: false,
    };
  },
  methods: {
    channelSearch: function () {
      this.$router.push({
        name: "HighlightSearch",
        query: { channel_id: this.channel_id },
      });
      if (this.$router.currentRoute.name === "HighlightSearch") {
        this.$router.go(0);
      }
    },
    gameSearch: function () {
      this.$router.push({
        name: "HighlightSearch",
        query: { game: this.game },
      });
      if (this.$router.currentRoute.name === "HighlightSearch") {
        this.$router.go(0);
      }
    },
  },
  computed: {
    youtube_embed: function () {
      let vodData = this.youtube_url;
      vodData = vodData.split("=");
      let url = vodData[1];
      return "https://www.youtube.com/embed/" + url + "?rel=0";
    },
  },
};
</script>