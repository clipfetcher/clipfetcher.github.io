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
              />
              <div class="input-group-append">
                <button id="vodLoadBtn" type="submit" class="btn btn-primary">{{vodLoadBtn}}</button>
              </div>
            </div>
            <small id="videoData" class="form-text text-muted">請確認 Vod Id 或 Vod 網址正確</small>
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
        <HighlightList :youtubeURL="vidSearchShow"></HighlightList>
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
          id="videoStartAnalysisBtn"
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
    <div id="videoResult" class="card my-2" v-show="videoResult">
      <h5 class="card-header">分析結果精華影片</h5>
      <HighlightList
        vod_id="123"
        channel_id="Test"
        game="Test"
        youtubeURL="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
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
          :key="items.id"
          :vod_id="items.vod_id"
          :channel_id="items.channel_id"
          :game="items.game"
          :youtubeURL="items.youtubeURL"
        ></HighlightList>
      </div>
    </div>
  </div>
</template>

<script>
import HighlightList from "@/components/HighlightList.vue";

var ip = "http://192.168.1.109:3000";
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
      exist: true,

      showModal: false,

      //progress bar
      progressBarValueNow: 0,
      progressBarText: "",

      //apis
      highlightVideos: null
    };
  },
  components: { HighlightList },
  mounted() {
    this.axios
      .get(ip + "/api/vod")
      .then(response => (this.highlightVideos = response.data.data))
      .catch(function(error) {
        console.log(error.response);
      });
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
    loadVideo: function() {
      let vodData = this.vodData;
      //let output = "";
      vodData = vodData.split("?");
      let vid = vodData[0];
      vid = vid.substring(vid.length - 9);
      console.log(vid);
      if (parseInt(vid) && vid <= 999999999) {
        /*
        output =
          '<iframe id="video" class="embed-responsive-item" src="https://player.twitch.tv/?autoplay=false&video=v' +
          vid +
          '"></iframe >';
        $("#videoShow").html(output);
        */
        this.vidAnalysis =
          "https://player.twitch.tv/?autoplay=false&video=v" + vid;
        this.vodLoadBtn = "重新載入";
        this.videoResult = false;
        this.vodShow = true;
        this.vodAnalysisBtnShow = true;
      } else if (vid === "") {
        alert("VOD ID或VOD網址未輸入");
        location.reload();
      } else {
        alert("VOD ID或VOD網址輸入錯誤");
        location.reload();
      }
    },
    analysisVideo: function() {
      let val = 0;
      let call = this;
      this.vodAnalysisBtnShow = false;
      this.progressList = true;
      let interval = setInterval(function() {
        if (val === 100) {
          //$("#analysisFinish").modal("show");
          call.showModal = !call.showModal;
          call.progressList = false;
          call.videoResult = true;
          clearInterval(interval);
        } else {
          val += 10;
        }
        call.progressBarValueNow = val;
        call.progressBarText = val + "%";
      }, 500);
    },
    searchVideo: function() {
      let video = this.videoSearch;
      //let output = "";
      video = video.split("?");
      let vid = video[0];
      vid = vid.substring(vid.length - 9);
      console.log(vid);
      if (parseInt(vid) && vid <= 999999999) {
        /*
        output =
          '<iframe id="video" class="embed-responsive-item" src="https://player.twitch.tv/?autoplay=false&video=v' +
          vid +
          '"></iframe >';
        $("#highlightVideoShow").html(output);
        */
        this.vidSearchShow =
          "https://player.twitch.tv/?autoplay=false&video=v" + vid;
        this.highlightShow = true;
        //this.exist = !this.exist;
      } else if (vid === "") {
        alert("精華影片 ID或VOD網址未輸入");
        location.reload();
      } else {
        alert("精華影片 ID或VOD網址輸入錯誤");
        location.reload();
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