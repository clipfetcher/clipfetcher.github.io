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
        <a
          :href="'https://www.twitch.tv/videos/' + vod_id"
          target="_blank"
          class="card-link float-right"
        >
          <i class="fas fa-link fa-lg" data-toggle="tooltip" title="VOD網址"></i>
        </a>
        <b-link
          :to="'/highlight/' + highlight_id"
          target="_blank"
          class="card-link float-right pr-2"
        >
          <i class="fas fa-share-square fa-lg" data-toggle="tooltip" title="精華連結"></i>
        </b-link>
        <p class="text-left m-0">ID：{{ vod_id }}</p>
        <p class="text-left m-0">Highlight：{{ highlight_id }}</p>
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
        <p class="text-left m-0">備註：{{ memo }}</p>
        <b-button
          v-show="!haveAppraise"
          @click="appraiseModalShow = !appraiseModalShow"
          variant="outline-info"
          class="float-right m-1"
        >我要評價</b-button>

        <b-modal v-model="appraiseModalShow" title="精華評價" hide-footer>
          <form @submit.prevent="appraise">
            <div class="form-group">
              <label for="validationText">評論：</label>
              <br />
              <button
                type="button"
                class="btn m-1"
                :class="notAccurate ? 'btn-secondary' : 'btn-outline-secondary'"
                @click="textButton('notAccurate')"
              >影片不精準</button>
              <button
                type="button"
                class="btn m-1"
                :class="videoLong ? 'btn-secondary' : 'btn-outline-secondary'"
                @click="textButton('videoLong')"
              >影片長度過長</button>
              <button
                type="button"
                class="btn m-1"
                :class="analysisLong ? 'btn-secondary' : 'btn-outline-secondary'"
                @click="textButton('analysisLong')"
              >影片分析太久</button>
              <br />
              <input
                type="text"
                class="form-control"
                :class="validationText?'is-invalid':''"
                id="validationText"
                @change="checkText"
                @keyup="checkText"
                v-model="text"
              />
              <div class="invalid-feedback">評論不得為空</div>
            </div>
            <div class="form-group">
              <label for="starRating">分數：</label>
              <br />
              <template v-for="index in 5">
                <i
                  v-if="index <= starRating"
                  :key="index.id"
                  class="text-warning fas fa-star"
                  @click="clickRating(index)"
                  @mouseover="mouseOverRrating(index)"
                  @touchstart="mouseOverRrating(index)"
                  @mouseout="mouseOutRrating"
                  @touchend="mouseOutRrating"
                ></i>
                <i
                  v-else
                  :key="index.id"
                  class="text-warning far fa-star"
                  @click="clickRating(index)"
                  @mouseover="mouseOverRrating(index)"
                  @touchstart="mouseOverRrating(index)"
                  @mouseout="mouseOutRrating"
                  @touchend="mouseOutRrating"
                ></i>
              </template>
              {{ starRating }}
            </div>
            <button type="submit" class="btn btn-primary float-right">送出</button>
          </form>
        </b-modal>
      </div>
    </div>
    <hr class="my-4" />
  </div>
</template>

<script>
export default {
  name: "HighlightList",
  props: [
    "vod_id",
    "highlight_id",
    "channel_id",
    "streamerName",
    "game",
    "youtube_url",
    "avg_score",
    "memo"
  ],
  data() {
    return {
      temp_starRating: 0,
      starRating: 0,
      text: "",
      appraiseModalShow: false,

      notAccurate: false,
      videoLong: false,
      analysisLong: false,
      validationText: false,
      haveAppraise: false
    };
  },
  methods: {
    mouseOverRrating: function(val) {
      this.temp_starRating = this.starRating;
      this.starRating = val;
    },
    mouseOutRrating: function() {
      if (!this.isRating) this.starRating = 0;
      else this.starRating = this.temp_starRating;
      this.temp_starRating = 0;
    },
    clickRating: function(val) {
      this.starRating = this.temp_starRating = val;
      this.isRating = true;
    },
    textButton: function(button) {
      let output = "";
      if (button == "notAccurate") {
        this.notAccurate = !this.notAccurate;
      } else if (button == "videoLong") {
        this.videoLong = !this.videoLong;
      } else if (button == "analysisLong") {
        this.analysisLong = !this.analysisLong;
      }
      if (this.notAccurate) {
        output += " 影片不精準 ";
      }
      if (this.videoLong) {
        output += " 影片長度過長 ";
      }
      if (this.analysisLong) {
        output += " 影片分析太久 ";
      }
      this.text = output;
    },
    checkText: function() {
      if (this.text == "" || this.text == null) {
        this.validationText = true;
      } else {
        this.validationText = false;
      }
    },
    appraise: function() {
      let vm = this;
      if (this.text == "" || this.text == null) {
        this.validationText = true;
      } else {
        this.validationText = false;
        this.axios
          .post(process.env.VUE_APP_ROOT_API + "/api/vod/appraise", {
            highlight_id: this.vod_id,
            text: this.text,
            score: this.starRating
          })
          .then(response => {
            vm.response = response;
            vm.haveAppraise = true;
          })
          .catch(function(error) {
            console.log(error);
          });
        this.appraiseModalShow = !this.appraiseModalShow;
      }
    },
    channelSearch: function() {
      this.$router.push({
        name: "HighlightSearch",
        query: { channel_id: this.channel_id }
      });
      if (this.$router.currentRoute.name === "HighlightSearch") {
        this.$router.go(0);
      }
    },
    gameSearch: function() {
      this.$router.push({
        name: "HighlightSearch",
        query: { game: this.game }
      });
      if (this.$router.currentRoute.name === "HighlightSearch") {
        this.$router.go(0);
      }
    }
  },
  computed: {
    youtube_embed: function() {
      let vodData = this.youtube_url;
      vodData = vodData.split("=");
      let url = vodData[1];
      return "https://www.youtube.com/embed/" + url + "?rel=0";
    }
  }
};
</script>