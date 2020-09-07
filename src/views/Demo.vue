<template>
  <div class="container">
    <div class="my-3 p-1">
      <nav class="nav nav-pills nav-fill">
        <a
          class="nav-item nav-link border rounded"
          :class="{active:inputBar}"
          @click="inputBar = !inputBar"
        >Highlight Generate</a>
        <a
          class="nav-item nav-link border rounded"
          :class="{active:!inputBar}"
          @click="inputBar = !inputBar"
        >Highlight Search</a>
      </nav>

      <transition name="fade" mode="out-in">
        <!-- 精華生成輸入列 -->
        <section class="my-3" v-if="inputBar" key="create">
          <form @submit.prevent="loadVideo">
            <!-- <label for="vodData">請輸入你想要分析的 Vod ID 或 Vod 網址</label> -->
            <div class="input-group">
              <input
                id="vodData"
                type="text"
                class="form-control"
                aria-describedby="videoData"
                placeholder="Twitch Vod Id or URL"
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
            <!-- <label for="videoSearch">請輸入你想要尋找的精華 Vod ID 或其他關鍵字</label> -->
            <b-input-group>
              <template v-slot:prepend>
                <b-dropdown :text="videoSearchType" variant="primary">
                  <b-dropdown-item @click="videoSearchType = 'vod_id'">VOD</b-dropdown-item>
                  <b-dropdown-item @click="videoSearchType = 'highlight_id'">Highlight</b-dropdown-item>
                  <b-dropdown-item @click="videoSearchType = 'game'">Game</b-dropdown-item>
                  <b-dropdown-item @click="videoSearchType = 'channel_id'">Channel</b-dropdown-item>
                </b-dropdown>
              </template>
              <input
                id="videoSearch"
                type="text"
                class="form-control"
                aria-describedby="videoSearchText"
                placeholder="..."
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

    <div v-if="inputBar">
      <!--使用教學-->
      <div class="my-2">
        <b-card-group deck>
          <b-card title="Step 1">
            <b-card-text>輸入您想分析的 Twitch 直播影片網址</b-card-text>
          </b-card>

          <b-card title="Step 2">
            <b-card-text>確認影片正確後點擊自動分析/手動剪輯</b-card-text>
          </b-card>

          <b-card title="Step 3">
            <b-card-text>等待本系統處理您的精華影片</b-card-text>
          </b-card>

          <b-card title="Step 4">
            <b-card-text>分析完成後即可觀看您的精華影片</b-card-text>
          </b-card>
        </b-card-group>
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

      <!-- 分析 -->
      <div class="my-4" v-show="vodAnalysisBtnShow">
        <form @submit.prevent="analysisVideo">
          <div class="form-group my-4">
            <label for="highlightTitle">標題：</label>
            <input
              type="text"
              class="form-control"
              :class="titleValid ? 'is-Valid' : 'is-invalid'"
              name="highlightTitle"
              id="highlightTitle"
              placeholder="為您的精華影片想一個特別的標題..."
              v-model="highlightTitle"
              maxlength="20"
            />
            <div v-if="!titleValid" class="invalid-feedback">{{ titleErrorFeedback }}</div>
          </div>
          <div class="row justify-content-center my-4">
            <div class="col-10 col-md-6">
              <button
                id="videoStartAnalysisBtn"
                type="button"
                class="btn btn-success btn-lg btn-block my-2"
                @click="analysisVideo"
              >自動分析</button>
            </div>
            <div class="col-10 col-md-6">
              <button
                type="button"
                class="btn btn-success btn-lg btn-block my-2"
                @click="manualEditor"
              >手動剪輯</button>
            </div>
          </div>
        </form>
      </div>

      <div v-show="manualEditorShow">
        <div>
          <div class="form-group my-4">
            <label for="highlightTitle">標題：</label>
            <input
              type="text"
              class="form-control"
              :class="titleValid ? 'is-Valid' : 'is-invalid'"
              name="highlightTitle"
              placeholder="為您的精華影片想一個特別的標題..."
              v-model="highlightTitle"
              maxlength="20"
            />
            <div v-if="!titleValid" class="invalid-feedback">{{ titleErrorFeedback }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-8">
            <div class="embed-responsive embed-responsive-16by9 my-1">
              <iframe
                class="embed-responsive-item"
                :src="vidAnalysis"
                scrolling="yes"
                allowfullscreen="true"
              ></iframe>
            </div>
            <div class="justify-content-center">
              <div class="form-row">
                <div class="col-6 col-md-5">
                  <label for="startTime">開始時間：</label>
                  <input
                    type="text"
                    class="form-control"
                    id="startTime"
                    v-model="startTime"
                    required
                  />
                </div>
                <div class="col-6 col-md-5">
                  <label for="endTime">結束時間：</label>
                  <input type="text" class="form-control" id="endTime" v-model="endTime" required />
                </div>
                <div class="col-12 col-md-2">
                  <button
                    id="videoStartAnalysisBtn"
                    type="button"
                    class="btn btn-success btn-lg btn-block my-2"
                    @click="addClipTime"
                  >
                    <i class="far fa-plus-square"></i> 加入
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="card">
              <div class="card-header">
                目前片段
                <span
                  v-if="clip_totalTime <= 20"
                  style="float:right"
                >累積時間 {{ clip_totalTime }} 分鐘</span>
                <span v-else style="float:right;color:red">累積時間 {{ clip_totalTime }} 分鐘</span>
              </div>
              <div class="card-body overflow-auto" style="height: 340px; max-height: 340px;">
                <ul>
                  <li v-for="time in clip_timeSort" :key="time.index">
                    {{ time.start }} ~ {{ time.end }}
                    <button
                      type="button"
                      class="btn btn-outline-info m-1"
                      @click="editClipTime(time)"
                    >
                      <i class="far fa-edit"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-danger m-1"
                      @click="removeClipTime(time)"
                    >
                      <i class="far fa-trash-alt"></i>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-danger btn-lg btn-block my-2"
              @click="cancelManualEditor"
            >取消</button>
            <button type="button" class="btn btn-success btn-lg btn-block my-2">完成剪輯</button>
          </div>
        </div>
      </div>

      <div v-show="vodAnalysisSendStatusShow" class="row justify-content-center m-2">
        <div v-if="vodAnalysisSendStatus === 'Loading'">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div v-else-if="vodAnalysisSendStatus === 'Success'" class="alert alert-info" role="alert">
          <p class="text-center my-2 py-2">
            <span>我們已收到您的分析請求！將會在分析完成後通知您！</span>
            <br />
            <span>你的ID：{{ videoHighlightId }}</span>
            <br />
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
          :streamerName="analyseVideos.streamerName"
          :game="analyseVideos.game"
          :youtube_url="analyseVideos.youtube_url"
          :avg_score="analyseVideos.avg_score"
          :memo="analyseVideos.memo"
        ></HighlightList>
      </div>
    </div>

    <div v-else-if="!inputBar">
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
            :streamerName="searchVideo.streamerName"
            :game="searchVideo.game"
            :youtube_url="searchVideo.youtube_url"
            :avg_score="searchVideo.avg_score"
            :memo="searchVideo.memo"
          ></HighlightList>
        </div>
        <div v-else class="alert alert-danger" role="alert">
          <p class="text-center my-2 py-2">
            <span>很抱歉！找不到您要搜尋的精華影片！</span>
          </p>
        </div>
      </div>
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
          :streamerName="highlight.streamerName"
          :game="highlight.game"
          :youtube_url="highlight.youtube_url"
          :avg_score="highlight.avg_score"
          :memo="highlight.memo"
        ></HighlightList>
      </div>
      <div v-else-if="videoList === 'Empty'" class="alert alert-info" role="alert">
        <p class="text-center my-2 py-2">
          <span>目前還沒有精華影片！！</span>
        </p>
      </div>
      <div v-else class="alert alert-danger" role="alert">
        <p class="text-center my-2 py-2">
          <span>系統連線發生錯誤 請等待問題排除或重新整理頁面嘗試 感謝！</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import HighlightList from "@/components/HighlightList.vue";

export default {
  name: "demo",
  data() {
    return {
      //顯示名稱
      title: "Highlight Clip Fetcher",
      vodLoadBtn: "Load",
      vodAnalysisBtn: "Analysis",
      vodSearchBtn: "Search",
      vodData: "",
      vidId: "",
      videoSearch: "",
      videoSearchType: "Type",

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
      manualEditorShow: false,
      //api control
      titleValid: true,
      titleErrorFeedback: "",
      vodValid: true,
      vodErrorData: "",
      vod_id: "",
      analyseVideos: null,

      //HighlightList
      highlightVideos: null,

      //search
      searchVideos: null,

      videoHighlightId: null,
      highlightTitle: "",
      // manual editor
      clip_time: [],
      startTime: "",
      endTime: "",

      api: null,
    };
  },
  components: { HighlightList },
  mounted() {
    let vm = this;
    this.axios
      .get(process.env.VUE_APP_ROOT_API + "/api/vod/highlight")
      .then((response) => {
        this.highlightVideos = response.data.reverse();
        if (this.highlightVideos.length == 0) this.videoList = "Empty";
        else this.videoList = "Finish";
      })
      .catch(function (error) {
        console.log(error.response);
        vm.videoList = "Error";
      });
  },
  methods: {
    showAnalyseVideo: function () {
      this.videoResult = false;
      let vm = this;
      this.axios
        .get(process.env.VUE_APP_ROOT_API + "/api/vod/highlight", {
          params: {
            highlight_id: this.vod_id,
          },
        })
        .then((response) => {
          this.analyseVideos = response.data;
          vm.videoResult = true;
        })
        .catch(function (error) {
          console.log(error);
          vm.videoResult = false;
        });
    },
    loadVideo: function () {
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
            "Client-ID": "ildytfqanhzvdaprp96m5rkylap16k",
          },
        })
        .get("videos/" + vid)
        .then(() => {
          vm.vidAnalysis =
            "https://player.twitch.tv/?video=v" +
            vid +
            "&autoplay=false&parent=" +
            window.location.hostname;
          vm.vod_id = vid;
          vm.vodValid = true;
          vm.vodLoadBtn = "reload";
          vm.videoResult = false;
          vm.vodShow = true;
          vm.vodAnalysisBtnShow = true;
        })
        .catch(function (error) {
          console.log(error);
          vm.vodValid = false;
          if (vm.vodData == "") {
            vm.vodErrorData = "Input cannot be empty.";
          } else {
            vm.vodErrorData = "Please check Vod's Id or VOD's URL is valid.";
          }
        });
    },
    analysisVideo: function () {
      let vm = this;
      this.checkHighlightTitle();
      if (this.titleValid) {
        this.axios
          .get(process.env.VUE_APP_ROOT_API + "/api/vod/highlight", {
            params: {
              vod_id: vm.vod_id,
              highlight_id: null,
              game: null,
              channel_id: null,
            },
          })
          .then((response) => {
            if (response.data != "") {
              vm.titleValid = false;
              vm.titleErrorFeedback =
                "Vod's Id or VOD's URL is duplicate! You can search the highlight on our website.";
            } else {
              vm.vodAnalysisBtnShow = false;
              vm.vodAnalysisSendStatusShow = true;
              vm.vodAnalysisSendStatus = "Loading";
              vm.axios
                .post(process.env.VUE_APP_ROOT_API + "/api/vod", {
                  vod_id: vm.vod_id,
                  memo: vm.highlightTitle,
                })
                .then((response) => {
                  vm.vodAnalysisSendStatus = "Success";
                  vm.highlightTitle = "";
                  vm.videoHighlightId = response.data.highlight_id;
                })
                .catch(function (error) {
                  console.log(error);
                  vm.vodAnalysisBtnShow = true;
                  vm.vodAnalysisSendStatus = "Error";
                });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    searchVideo: function () {
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
        .get(process.env.VUE_APP_ROOT_API + "/api/vod/highlight", {
          params: {
            vod_id:
              vm.videoSearchType == "搜尋項目" || vm.videoSearchType == "vod_id"
                ? vid
                : null,
            highlight_id: vm.videoSearchType == "highlight_id" ? vid : null,
            game: vm.videoSearchType == "game" ? vid : null,
            channel_id: vm.videoSearchType == "channel_id" ? vid : null,
          },
        })
        .then((response) => {
          vm.searchVideos = response.data;
          if (vm.searchVideos == "") vm.highlightSearch = "Error";
          else vm.highlightSearch = "Find";
          vm.videoSearchType = "搜尋項目";
        })
        .catch(function (error) {
          console.log(error);
          vm.highlightSearch = "Error";
        });
    },
    checkHighlightTitle: function () {
      this.titleErrorFeedback = "";
      if (this.highlightTitle == "") {
        this.titleValid = false;
        this.titleErrorFeedback = "Input cannot be empty.";
      } else this.titleValid = true;
    },
    manualEditor: function () {
      this.checkHighlightTitle();
      if (this.titleValid) {
        this.axios
          .get(process.env.VUE_APP_ROOT_API + "/api/vod/highlight", {
            params: {
              vod_id: this.vod_id,
              highlight_id: null,
              game: null,
              channel_id: null,
            },
          })
          .then((response) => {
            if (response.data != "") {
              window.confirm("發現已分析過資料 是否載入時間軸");
            }
            this.vodShow = false;
            this.vodAnalysisBtnShow = false;
            this.manualEditorShow = true;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    cancelManualEditor: function () {
      this.manualEditorShow = false;
      this.vodAnalysisBtnShow = true;
      this.vodShow = true;
    },
    addClipTime: function () {
      let time = {
        start: this.startTime,
        end: this.endTime,
      };
      this.clip_time.push(time);
    },
    removeClipTime: function (time) {
      this.clip_time.pop(time);
    },
    editClipTime: function (time) {
      this.startTime = time.start;
      this.endTime = time.end;
    },
  },
  computed: {
    clip_timeSort: function () {
      function compare(a, b) {
        let time1 = a.start.split(":");
        let time2 = b.start.split(":");
        let hour1 = time1[0];
        let min1 = time1[1];
        let sec1 = time1[2];
        let hour2 = time2[0];
        let min2 = time2[1];
        let sec2 = time2[2];

        if (hour1 < hour2) return -1;
        if (hour1 > hour2) return 1;
        if (min1 < min2) return -1;
        if (min1 > min2) return 1;
        if (sec1 < sec2) return -1;
        if (sec1 > sec2) return 1;
        return 0;
      }

      let arr = this.clip_time;
      return arr.sort(compare);
    },
    clip_totalTime: function () {
      let total = 0;
      let arr = this.clip_time;
      arr.forEach((element) => {
        let start = element.start.split(":");
        let end = element.end.split(":");
        let startSec =
          parseInt(start[0] * 60 * 60) +
          parseInt(start[1] * 60) +
          parseInt(start[2]);
        let endSec =
          parseInt(end[0] * 60 * 60) + parseInt(end[1] * 60) + parseInt(end[2]);
        let diff = Math.abs(endSec - startSec);
        total += diff / 60;
      });
      return total.toFixed(2);
    },
  },
};
</script>