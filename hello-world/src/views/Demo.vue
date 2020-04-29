<template>
  <div class="container">
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
              <p>影片分析完成！！</p>
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
                placeholder="VodId 或 Vod 網址"
                v-model="vodData"
                @change="checkVodValid"
                @keyup="checkVodValid"
                :class="vodValid ? 'is-Valid' : 'is-invalid'"
              />
              <div class="input-group-append">
                <button
                  id="vodLoadBtn"
                  type="submit"
                  class="btn btn-primary"
                  :class="{disabled: !vodValid}"
                >{{vodLoadBtn}}</button>
              </div>
              <div v-if="!vodValid" class="invalid-feedback">{{ vodErrorData }}</div>
            </div>
          </form>
        </section>

        <!-- 精華搜尋輸入列 -->
        <section class="my-3" v-else-if="!inputBar" key="search">
          <form @submit.prevent="searchVideo">
            <label for="videoSearch">請輸入你想要尋找的 Vod 或 精華影片 Id</label>
            <div class="input-group">
              <input
                id="videoSearch"
                type="text"
                class="form-control"
                aria-describedby="videoSearchText"
                placeholder="Vod 或 精華影片 Id"
                v-model="videoSearch"
              />
              <div class="input-group-append">
                <button id="vodSearchBtn" type="submit" class="btn btn-primary">{{ vodSearchBtn }}</button>
              </div>
            </div>
            <small id="videoSearchText" class="form-text text-muted">請確認 Vod 或 精華影片 Id正確</small>
          </form>
        </section>
      </transition>
    </div>

    <!-- 影片紀錄檔顯示 -->
    <div class="row justify-content-center" v-show="vodShow">
      <div class="col-12 col-md-8">
        <div id="videoShow" class="embed-responsive embed-responsive-16by9 my-2">
          <iframe id="videoAnalysis" class="embed-responsive-item" :src="vidAnalysis"></iframe>
        </div>
      </div>
    </div>

    <!-- 精華影片搜尋顯示 -->
    <div v-show="highlightShow">
      <div v-if="exist" class="card my-2">
        <h5 class="card-header">精華搜尋影片</h5>
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
          <span>很抱歉！您搜尋的精華影片不存在</span>
        </p>
      </div>
    </div>

    <!-- 分析 -->
    <div class="row justify-content-center my-2" v-show="vodAnalysisBtnShow">
      <div class="col-10 col-md-6">
        <button
          v-if="highlightExist"
          type="button"
          class="btn btn-success btn-lg btn-block disabled"
        >此VOD已存在精華影片</button>
        <button
          id="videoStartAnalysisBtn"
          v-else
          type="button"
          class="btn btn-success btn-lg btn-block"
          @click="analysisVideo"
        >開始分析</button>
      </div>
    </div>

    <div id="progressList" class="progress my-2" v-show="progressList">
      <div
        id="progressBar"
        class="progress-bar bg-info"
        role="progressbar"
        :style="{width: progressBarValueNow + '%'}"
        :aria-valuenow="progressBarValueNow"
        aria-valuemin="0"
        aria-valuemax="100"
      >{{ progressBarText }}</div>
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
      <div class="card my-2">
        <h5 class="card-header">最新精華影片</h5>
        <HighlightList
          v-for="items in highlightVideos"
          :key="items.vod_id"
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
//var inputBar = true;
var active = true;
var highlightShow = false;
//var exist = true;

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
      exist: false,
      //api control
      vodValid: true,
      vodErrorData: "",
      vod_id: "",
      analyseVideos: null,
      highlightExist: true,

      //modal
      showModal: false,

      //progress bar
      progressBarValueNow: 0,
      progressBarText: "",

      //HighlightList
      highlightVideos: null,

      //search
      searchVideos: null
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
      .then(response => (this.highlightVideos = response.data))
      .catch(function(error) {
        console.log(error.response);
      });
  },
  methods: {
    checkVodValid: function() {
      let vm = this;
      this.vodErrorData = "";
      let vodData = this.vodData;
      vodData = vodData.split("?");
      let vid = vodData[0];
      vid = vid.substring(vid.length - 9);
      if (parseInt(vid) && vid <= 999999999) {
        this.axios
          .get(ip + "/api/vod/highlight", {
            params: {
              highlight_id: vid
            }
          })
          .then(function() {
            vm.vodValid = false;
            vm.vodErrorData = "此VOD精華已存在";
          })
          .catch(function(error) {
            console.log(error);
            vm.vodValid = true;
          });
      } else if (this.vodData == "") {
        this.vodValid = true;
      } else {
        this.vodValid = false;
        this.vodErrorData = "請確認 Vod Id 或 Vod 網址正確";
      }
    },
    checkHighlightExist: function(vod_id) {
      let vm = this;
      this.axios
        .get(ip + "/api/vod/highlight", {
          params: {
            highlight_id: vod_id
          }
        })
        .then(() => {
          vm.highlightExist = true;
        })
        .catch(function(error) {
          console.log(error);
          vm.highlightExist = false;
        });
    },
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
      this.highlightExist = true;
      if (this.vodValid) {
        let vodData = this.vodData;
        vodData = vodData.split("?");
        let vid = vodData[0];
        vid = vid.substring(vid.length - 9);
        if (parseInt(vid) && vid <= 999999999) {
          this.checkHighlightExist(vid);
          this.vidAnalysis =
            "https://player.twitch.tv/?autoplay=false&video=v" + vid;
          this.vodLoadBtn = "重新載入";
          this.videoResult = false;
          this.vodShow = true;
          this.vodAnalysisBtnShow = true;
          this.vod_id = vid;
        } else if (vid === "") {
          alert("VOD ID或VOD網址未輸入");
          this.vod_id = "";
        } else {
          alert("VOD ID或VOD網址輸入錯誤");
          this.vod_id = "";
        }
      }
    },
    analysisVideo: function() {
      let val = 0;
      let vm = this;
      this.vodAnalysisBtnShow = false;
      this.progressList = true;
      this.axios
        .post(ip + "/api/vod", {
          vod_id: this.vod_id
        })
        .then(() => {
          val += 10;
          vm.progressBarValueNow = val;
          vm.progressBarText = val + "%";
          vm.showModal = !vm.showModal;
          vm.progressList = false;
          clearInterval(interval);
          vm.showAnalyseVideo();
        })
        .catch(function(error) {
          console.log(error);
          clearInterval(interval);
          vm.vodAnalysisBtnShow = true;
        });
      let interval = setInterval(function() {
        if (val == 90) {
          //clearInterval(interval);
        } else {
          val += 10;
        }
        vm.progressBarValueNow = val;
        vm.progressBarText = val + "%";
      }, 500);
    },
    searchVideo: function() {
      let vm = this;
      let video = this.videoSearch.split("?");
      let vid = video[0];
      vid = vid.substring(vid.length - 9);
      console.log(vid);
      this.exist = false;
      this.highlightShow = false;
      this.searchVideos = null;
      if (parseInt(vid) && vid <= 999999999) {
        this.axios
          .get(ip + "/api/vod/highlight", {
            params: {
              highlight_id: vid
            }
          })
          .then(response => {
            vm.searchVideos = response.data;
            vm.exist = true;
            vm.highlightShow = true;
          })
          .catch(function(error) {
            console.log(error);
            vm.exist = false;
            vm.highlightShow = true;
          });
      } else if (vid == "") {
        alert("精華影片 ID或VOD網址未輸入");
      } else {
        alert("精華影片 ID或VOD網址輸入錯誤");
      }
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