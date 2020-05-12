<template>
  <div class="container">
    <!-- Modal -->
    <transition
      @enter="startTransitionModal"
      @after-enter="endTransitionModal"
      @before-leave="endTransitionModal"
      @after-leave="startTransitionModal"
    >
      <div class="modal fade" v-if="showModal" ref="modal">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">{{ title }}</h5>
              <button class="close" type="button" @click="showModal = !showModal">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div class="modal-body">
              <p>影片開始分析！</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="modal-backdrop fade d-none" ref="backdrop"></div>

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
            <div class="input-group">
              <input
                id="videoSearch"
                type="text"
                class="form-control"
                aria-describedby="videoSearchText"
                placeholder="精華 Vod Id 或其他關鍵字"
                v-model="videoSearch"
              />
              <div class="input-group-append">
                <button id="vodSearchBtn" type="submit" class="btn btn-primary">{{ vodSearchBtn }}</button>
              </div>
            </div>
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
          :vod_id="searchVideos.vod_id"
          :channel_id="searchVideos.channel_id"
          :game="searchVideos.game"
          :youtube_url="searchVideos.youtube_url"
          :avg_score="searchVideos.avg_score"
        ></HighlightList>
      </div>
      <div v-else class="alert alert-danger" role="alert">
        <p class="text-center my-2 py-2">
          <span>很抱歉！找不到您要搜尋的精華影片！</span>
        </p>
      </div>
    </div>

    <!-- 分析 -->
    <div class="row justify-content-center my-2" v-show="vodAnalysisBtnShow">
      <div class="col-10 col-md-6">
        <button
          id="videoStartAnalysisBtn"
          type="button"
          class="btn btn-success btn-lg btn-block"
          @click="analysisVideo"
        >開始分析</button>
      </div>
    </div>

    <!-- 分析結果顯示 -->
    <div id="videoResult" class="card my-2" v-if="videoResult">
      <h5 class="card-header">分析結果精華影片</h5>
      <HighlightList
        :vod_id="analyseVideos.vod_id"
        :channel_id="analyseVideos.channel_id"
        :game="analyseVideos.game"
        :youtube_url="analyseVideos.youtube_url"
        :avg_score="analyseVideos.avg_score"
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
          v-for="items in highlightVideos"
          :key="items.id"
          :vod_id="items.vod_id"
          :channel_id="items.channel_id"
          :game="items.game"
          :youtube_url="items.youtube_url"
          :avg_score="items.avg_score"
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
var progressList = false;
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

      vidAnalysis: "",
      vidSearch: "",
      vidSearchShow: "",

      starRating: 0,
      temp_starRating: 0,
      isRating: false,
      //顯示控制
      vodShow: false,
      vodAnalysisBtnShow: false,
      progressList: false,
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

      //modal
      showModal: false,

      //progress bar
      progressBarValueNow: 0,
      progressBarText: "",

      //HighlightList
      highlightVideos: null,

      //search
      searchVideos: null,

      api: null
    };
  },
  components: { HighlightList },
  mounted() {
    this.axios
      .get(ip + "/api/vod", {
        params: {
          vod_id: this.vod
        }
      })
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
      this.progressList = true;
      this.axios
        .post(ip + "/api/vod", {
          vod_id: this.vod_id
        })
        .then(response => {
          //vm.showModal = !vm.showModal;
          //vm.showAnalyseVideo;
          this.api = response;
        })
        .catch(function(error) {
          console.log(error);
          vm.vodAnalysisBtnShow = true;
        });
      //vm.showModal = !vm.showModal;
    },
    searchVideo: function() {
      let vm = this;
      let video = this.videoSearch.split("?");
      let vid = video[0];
      vid = vid.substring(vid.length - 9);
      console.log(vid);
      this.highlightSearch = "Loading";
      this.highlightShow = true;
      this.searchVideos = null;
      this.axios
        .get(ip + "/api/vod/highlight", {
          params: {
            highlight_id: vid
          }
        })
        .then(response => {
          vm.searchVideos = response.data;
          vm.highlightSearch = "Find";
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
        this.progressList = progressList;
        this.videoResult = videoResult;
        this.active = active;
        this.highlightShow = false;
        this.inputBar = !this.inputBar;
      } else if (type === "search" && this.inputBar) {
        this.highlightShow = highlightShow;
        vodShow = this.vodShow;
        vodAnalysisBtnShow = this.vodAnalysisBtnShow;
        progressList = this.progressList;
        videoResult = this.videoResult;
        this.vodShow = false;
        this.vodAnalysisBtnShow = false;
        this.progressList = false;
        this.videoResult = false;
        this.active = false;
        this.inputBar = !this.inputBar;
      }
    },
    startTransitionModal: function() {
      this.$refs.backdrop.classList.toggle("d-block");
      this.$refs.modal.classList.toggle("d-block");
    },
    endTransitionModal: function() {
      this.$refs.backdrop.classList.toggle("show");
      this.$refs.modal.classList.toggle("show");
    }
  }
};
</script>