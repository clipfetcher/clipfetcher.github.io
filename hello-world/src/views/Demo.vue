<template>
  <div class="container">
    <div class="my-3 p-1">
      <nav class="nav nav-pills nav-justified">
        <a class="nav-item nav-link" :class="{active:inputBar}" @click="changeBar('create')">精華生成</a>
        <a class="nav-item nav-link" :class="{active:!inputBar}" @click="changeBar('search')">精華搜尋</a>
      </nav>

      <transition name="fade" mode="out-in">
        <!-- 精華生成輸入列 -->
        <section class="my-3" v-if="inputBar" key="create">
          <form @submit.prevent="loadVideo">
            <label for="vodData">請輸入你想要分析的 Vod Id 或 Vod 網址</label>
            <div class="input-group">
              <input
                id="vodData"
                type="text"
                class="form-control"
                aria-describedby="videoData"
                placeholder="Vod Id 或 Vod 網址"
                v-model="vodData"
                :class="vodValid ? 'is-Valid' : 'is-invalid'"
              />
              <div class="input-group-append">
                <button id="vodLoadBtn" type="submit" class="btn btn-primary">{{vodLoadBtn}}</button>
              </div>
              <div v-if="!vodValid" class="invalid-feedback">{{ vodErrorData }}</div>
            </div>
          </form>
        </section>

        <!-- 精華搜尋輸入列 -->
        <section class="my-3" v-else-if="!inputBar" key="search">
          <form @submit.prevent="searchVideo">
            <label for="videoSearch">請輸入你想要尋找的精華 Vod Id 或其他關鍵字</label>
            <b-input-group>
              <template v-slot:prepend>
                <b-dropdown :text="videoSearchType" variant="primary">
                  <b-dropdown-item @click="videoSearchType = 'vod_id'">VOD Id</b-dropdown-item>
                  <b-dropdown-item @click="videoSearchType = 'highlight_id'">Highlight Id</b-dropdown-item>
                  <b-dropdown-item @click="videoSearchType = 'game'">Game</b-dropdown-item>
                  <b-dropdown-item @click="videoSearchType = 'channel_id'">Channel Id</b-dropdown-item>
                </b-dropdown>
              </template>
              <input
                id="videoSearch"
                type="text"
                class="form-control"
                aria-describedby="videoSearchText"
                placeholder="輸入您要搜尋的關鍵字"
                v-model="videoSearch"
              />

              <div class="input-group-append">
                <button id="vodSearchBtn" type="submit" class="btn btn-primary">{{ vodSearchBtn }}</button>
              </div>
            </b-input-group>
          </form>
        </section>
      </transition>
    </div>

    <!-- 影片紀錄檔顯示 -->
    <div class="row justify-content-center" v-show="vodShow">
      <div class="col-12 col-md-8">
        <div id="videoShow" class="embed-responsive embed-responsive-16by9 my-2">
          <iframe
            id="videoAnalysis"
            class="embed-responsive-item"
            :src="vidAnalysis"
            scrolling="no"
            allowfullscreen="true"
          ></iframe>
        </div>
      </div>
    </div>

    <!-- 精華影片搜尋顯示 -->
    <div v-show="highlightShow">
      <div v-if="highlightSearch === 'Loading'" class="d-flex justify-content-center my-2">
        <div class="spinner-border text-secondary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else-if="highlightSearch === 'Find'" class="card my-2">
        <h5 class="card-header">精華搜尋結果</h5>
        <HighlightList
          v-for="searchVideo in searchVideos"
          :key="searchVideo.index"
          :vod_id="searchVideo.vod_id"
          :highlight_id="searchVideo.highlight_id"
          :channel_id="searchVideo.channel_id"
          :game="searchVideo.game"
          :youtube_url="searchVideo.youtube_url"
          :avg_score="searchVideo.avg_score"
          :memo="analysisVideo.memo"
        ></HighlightList>
      </div>
      <div v-else class="alert alert-danger" role="alert">
        <p class="text-center my-2 py-2">
          <span>很抱歉！找不到您要搜尋的精華影片！</span>
        </p>
      </div>
    </div>

    <!-- 分析 -->
    <div class="my-4" v-show="vodAnalysisBtnShow">
      <form @submit.prevent="analysisVideo">
        <div class="form-group my-4">
          <label for="memo">備註：</label>
          <input
            type="text"
            class="form-control"
            name="memo"
            id="memo"
            placeholder="輸入您的備註"
            v-model="memo"
            maxlength="20"
          />
        </div>
        <div class="row justify-content-center my-4">
          <div class="col-10 col-md-6">
            <button
              id="videoStartAnalysisBtn"
              type="button"
              class="btn btn-success btn-lg btn-block"
              @click="analysisVideo"
            >開始分析</button>
          </div>
        </div>
      </form>
    </div>

    <div v-show="vodAnalysisSendStatusShow" class="row justify-content-center my-2">
      <div v-if="vodAnalysisSendStatus === 'Loading'">
        <div class="spinner-border text-secondary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else-if="vodAnalysisSendStatus === 'Success'" class="alert alert-info" role="alert">
        <p class="text-center my-2 py-2">
          <span>我們已收到您的分析請求！將會在分析完成後通知您！</span>
          <br />
          <span>你的Id {{ videoHighlightId }}</span>
          <b-link :to="'/highlight/' + videoHighlightId" target="_blank">精華連結</b-link>
        </p>
      </div>
      <div v-else-if="vodAnalysisSendStatus === 'Error'" class="alert alert-danger" role="alert">
        <p class="text-center my-2 py-2">
          <span>很抱歉！分析影片失敗 請重新嘗試！</span>
        </p>
      </div>
    </div>

    <!-- 分析結果顯示 -->
    <div id="videoResult" class="card my-2" v-if="videoResult">
      <h5 class="card-header">分析結果精華影片</h5>
      <HighlightList
        :vod_id="analyseVideos.vod_id"
        :highlight_id="analyseVideos.highlight_id"
        :channel_id="analyseVideos.channel_id"
        :game="analyseVideos.game"
        :youtube_url="analyseVideos.youtube_url"
        :avg_score="analyseVideos.avg_score"
        :memo="analyseVideos.memo"
      ></HighlightList>
    </div>
    <br />
    <hr />
    <!-- 精華檢視顯示 -->
    <div id="videoList my-2">
      <!-- 精華影片顯示 -->
      <h2>最新精華影片</h2>
      <div v-if="videoList === 'Loading'" class="d-flex justify-content-center my-5">
        <div class="spinner-grow text-secondary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else-if="videoList === 'Finish'">
        <HighlightList
          v-for="highlight in highlightVideos"
          :key="highlight.index"
          :vod_id="highlight.vod_id"
          :highlight_id="highlight.highlight_id"
          :channel_id="highlight.channel_id"
          :game="highlight.game"
          :youtube_url="highlight.youtube_url"
          :avg_score="highlight.avg_score"
          :memo="highlight.memo"
        ></HighlightList>
      </div>
    </div>
  </div>
</template>

<script>
import HighlightList from "@/components/HighlightList.vue";

//var ip = "http://192.168.1.109:3000";
var ip = "https://clip-fetcher.herokuapp.com";
//https://clip-fetcher.herokuapp.com

var vodShow = false;
var vodAnalysisBtnShow = false;
var vodAnalysisSendStatusShow = false;
var videoResult = false;
var active = true;
var highlightShow = false;

export default {
  name: "demo",
  data() {
    return {
      //顯示名稱
      title: "Highlight Clip Fetcher",
      vodLoadBtn: "載入",
      vodAnalysisBtn: "開始分析",
      vodSearchBtn: "搜尋",
      vodData: "",
      vidId: "",
      videoSearch: "",
      videoSearchType: "搜尋項目",

      vidAnalysis: "",
      vidSearch: "",
      vidSearchShow: "",

      starRating: 0,
      temp_starRating: 0,
      isRating: false,
      //顯示控制
      vodShow: false,
      vodAnalysisBtnShow: false,
      vodAnalysisSendStatusShow: false,
      vodAnalysisSendStatus: "Loading",
      videoResult: false,
      inputBar: true,
      active: true,
      highlightShow: false,
      highlightSearch: "Loading",
      videoList: "Loading",
      //api control
      vodValid: true,
      vodErrorData: "",
      vod_id: "",
      analyseVideos: null,

      //HighlightList
      highlightVideos: null,

      //search
      searchVideos: null,

      videoHighlightId: null,
      memo: "",

      api: null
    };
  },
  components: { HighlightList },
  mounted() {
    this.axios
      .get(ip + "/api/vod/highlight")
      .then(response => {
        this.highlightVideos = response.data;
        this.videoList = "Finish";
      })
      .catch(function(error) {
        console.log(error.response);
      });
  },
  methods: {
    showAnalyseVideo: function() {
      this.videoResult = false;
      let vm = this;
      this.axios
        .get(ip + "/api/vod/highlight", {
          params: {
            highlight_id: this.vod_id
          }
        })
        .then(response => {
          this.analyseVideos = response.data;
          vm.videoResult = true;
        })
        .catch(function(error) {
          console.log(error);
          vm.videoResult = false;
        });
    },
    loadVideo: function() {
      this.vodShow = false;
      this.vodAnalysisBtnShow = false;
      this.vodAnalysisSendStatusShow = false;
      this.vodErrorData = "";
      let vm = this;
      let vodData = this.vodData;
      vodData = vodData.split("?");
      let vid = vodData[0];
      vid = vid.substring(vid.length - 9);
      this.axios
        .create({
          baseURL: "https://api.twitch.tv/kraken/",
          headers: {
            Accept: "application/vnd.twitchtv.v5+json",
            "Client-ID": "ildytfqanhzvdaprp96m5rkylap16k"
          }
        })
        .get("videos/" + vid)
        .then(() => {
          vm.vodValid = true;
          vm.vidAnalysis =
            "https://player.twitch.tv/?video=v" + vid + "&autoplay=false";
          vm.vodLoadBtn = "重新載入";
          vm.videoResult = false;
          vm.vodShow = true;
          vm.vodAnalysisBtnShow = true;
          vm.vod_id = vid;
        })
        .catch(function(error) {
          console.log(error);
          vm.vodValid = false;
          if (vm.vodData == "") {
            vm.vodErrorData = "輸入不得為空";
          } else {
            vm.vodErrorData = "請確認 Vod Id 或 Vod 網址正確";
          }
        });
    },
    analysisVideo: function() {
      let vm = this;
      this.vodAnalysisBtnShow = false;
      this.vodAnalysisSendStatusShow = true;
      this.vodAnalysisSendStatus = "Loading";
      this.axios
        .post(ip + "/api/vod", {
          vod_id: this.vod_id,
          memo: this.memo
        })
        .then(response => {
          vm.vodAnalysisSendStatus = "Success";
          this.memo = "";
          this.videoHighlightId = response.data.highlight_id;
        })
        .catch(function(error) {
          console.log(error);
          vm.vodAnalysisBtnShow = true;
          vm.vodAnalysisSendStatus = "Error";
        });
    },
    searchVideo: function() {
      let vm = this;
      let vid;
      if (
        this.videoSearchType == "搜尋項目" ||
        this.videoSearchType == "vod_id"
      ) {
        let video = this.videoSearch.split("?");
        vid = video[0];
        vid = vid.substring(vid.length - 9);
      } else vid = this.videoSearch;

      this.highlightSearch = "Loading";
      this.highlightShow = true;
      this.searchVideos = null;
      this.axios
        .get(ip + "/api/vod/highlight", {
          params: {
            vod_id:
              vm.videoSearchType == "搜尋項目" || vm.videoSearchType == "vod_id"
                ? vid
                : null,
            highlight_id: vm.videoSearchType == "highlight_id" ? vid : null,
            game: vm.videoSearchType == "game" ? vid : null,
            channel_id: vm.videoSearchType == "channel_id" ? vid : null
          }
        })
        .then(response => {
          vm.searchVideos = response.data;
          if (vm.searchVideos == "") vm.highlightSearch = "Error";
          else vm.highlightSearch = "Find";
          vm.videoSearchType = "搜尋項目";
        })
        .catch(function(error) {
          console.log(error);
          vm.highlightSearch = "Error";
        });
    },
    changeBar: function(type) {
      if (type === "create" && !this.inputBar) {
        highlightShow = this.highlightShow;
        this.vodShow = vodShow;
        this.vodAnalysisBtnShow = vodAnalysisBtnShow;
        this.vodAnalysisSendStatusShow = vodAnalysisSendStatusShow;
        this.videoResult = videoResult;
        this.active = active;
        this.highlightShow = false;
        this.inputBar = !this.inputBar;
      } else if (type === "search" && this.inputBar) {
        this.highlightShow = highlightShow;
        vodShow = this.vodShow;
        vodAnalysisBtnShow = this.vodAnalysisBtnShow;
        vodAnalysisSendStatusShow = this.vodAnalysisSendStatusShow;
        videoResult = this.videoResult;
        this.vodShow = false;
        this.vodAnalysisBtnShow = false;
        this.vodAnalysisSendStatusShow = false;
        this.videoResult = false;
        this.active = false;
        this.inputBar = !this.inputBar;
      }
    }
  }
};
</script>