<template>
  <div class="container">
    <div class="my-3 p-1">
      <nav class="nav nav-pills nav-fill">
        <a
          class="nav-item nav-link border rounded"
          :class="{ active: inputBar }"
          @click="inputBar = !inputBar"
          >Highlight Generate</a
        >
        <a
          class="nav-item nav-link border rounded"
          :class="{ active: !inputBar }"
          @click="inputBar = !inputBar"
          >Highlight Search</a
        >
      </nav>

      <transition name="fade" mode="out-in">
        <!-- 精華生成輸入列 -->
        <section class="my-3" v-if="inputBar" key="create">
          <form @submit.prevent="loadVideo">
            <div class="input-group">
              <input
                id="vodData"
                type="text"
                class="form-control"
                aria-describedby="videoData"
                placeholder="您想要分析的 Twitch 網址"
                v-model="inputBarText"
                :class="vodValid ? 'is-Valid' : 'is-invalid'"
              />
              <div class="input-group-append">
                <button id="vodLoadBtn" type="submit" class="btn btn-primary">
                  {{ vodLoadBtn }}
                </button>
              </div>
              <div v-if="!vodValid" class="invalid-feedback">
                {{ vodErrorData }}
              </div>
            </div>
          </form>
        </section>

        <!-- 精華搜尋輸入列 -->
        <section class="my-3" v-else-if="!inputBar" key="search">
          <form @submit.prevent="searchVideo">
            <b-input-group>
              <template v-slot:prepend>
                <b-dropdown :text="videoSearchType" variant="primary">
                  <b-dropdown-item @click="videoSearchType = 'vod_id'"
                    >VOD</b-dropdown-item
                  >
                  <b-dropdown-item @click="videoSearchType = 'highlight_id'"
                    >Highlight</b-dropdown-item
                  >
                  <b-dropdown-item @click="videoSearchType = 'game'"
                    >Game</b-dropdown-item
                  >
                  <b-dropdown-item @click="videoSearchType = 'streamerName'"
                    >Streamer</b-dropdown-item
                  >
                  <b-dropdown-item @click="videoSearchType = 'author'"
                    >Author</b-dropdown-item
                  >
                  <b-dropdown-item @click="videoSearchType = 'title'"
                    >Title</b-dropdown-item
                  >
                </b-dropdown>
              </template>
              <input
                id="videoSearch"
                type="text"
                class="form-control"
                aria-describedby="videoSearchText"
                placeholder="..."
                v-model="inputBarText"
              />

              <div class="input-group-append">
                <button id="vodSearchBtn" type="submit" class="btn btn-primary">
                  {{ vodSearchBtn }}
                </button>
              </div>
            </b-input-group>
          </form>
        </section>
      </transition>
    </div>

    <div v-if="inputBar">
      <!--使用教學-->
      <div class="accordion" role="tablist">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.tutorial variant="light"
              >查看使用教學</b-button
            >
          </b-card-header>
          <b-collapse
            id="tutorial"
            visible
            accordion="my-accordion"
            role="tabpanel"
          >
            <b-card-body>
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
              <b-card-text class="text-center mt-2">
                使用本系統功能即代表您已閱讀並了解
                <b-link to="/terms-of-service" target="_blank">
                  服務條款 </b-link
                >及<b-link to="/privacy-notice" target="_blank">
                  隱私權聲明
                </b-link>
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>

      <!-- 影片紀錄檔顯示 -->
      <div class="row justify-content-center" v-show="vodShow">
        <div class="col-12 col-md-8">
          <div
            id="videoShow"
            class="embed-responsive embed-responsive-16by9 my-2"
          >
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
            <div v-if="!titleValid" class="invalid-feedback">
              {{ titleErrorFeedback }}
            </div>
          </div>
          <div class="row justify-content-center my-4">
            <div class="col-10 col-md-6">
              <button
                id="videoStartAnalysisBtn"
                type="button"
                class="btn btn-success btn-lg btn-block my-2"
                @click="analysisVideo"
              >
                自動分析
              </button>
            </div>
            <div class="col-10 col-md-6">
              <button
                type="button"
                class="btn btn-success btn-lg btn-block my-2"
                @click="manualEditor"
              >
                手動剪輯
              </button>
            </div>
          </div>
        </form>
      </div>

      <div ref="editorPage">
        <div v-show="manualEditorShow">
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
            <div v-if="!titleValid" class="invalid-feedback">
              {{ titleErrorFeedback }}
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-lg-8">
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
                  <div class="col-12 col-md-6">
                    <label for="startTime">開始時間：</label>
                    <div class="form-row">
                      <div class="col-3">
                        <select
                          v-model="startTime.hour"
                          class="form-control"
                          required
                        >
                          <option v-for="time in timecodeHour" :key="time.key">
                            {{ time }}
                          </option>
                        </select>
                      </div>
                      <span class="col-1 px-0 align-middle text-center">:</span>
                      <div class="col-3">
                        <div class="form-group">
                          <select
                            v-model="startTime.minute"
                            class="form-control"
                            required
                          >
                            <option v-for="time in timecode" :key="time.key">
                              {{ time }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <span class="col-1 px-0 align-middle text-center">:</span>
                      <div class="col-3">
                        <div class="form-group">
                          <select
                            v-model="startTime.second"
                            class="form-control"
                            required
                          >
                            <option v-for="time in timecode" :key="time.key">
                              {{ time }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <label for="endTime">結束時間：</label>
                    <div class="form-row">
                      <div class="col-3">
                        <select
                          v-model="endTime.hour"
                          class="form-control"
                          required
                        >
                          <option v-for="time in timecodeHour" :key="time.key">
                            {{ time }}
                          </option>
                        </select>
                      </div>
                      <span class="col-1 px-0 align-middle text-center">:</span>
                      <div class="col-3">
                        <div class="form-group">
                          <select
                            v-model="endTime.minute"
                            class="form-control"
                            required
                          >
                            <option v-for="time in timecode" :key="time.key">
                              {{ time }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <span class="col-1 px-0 align-middle text-center">:</span>
                      <div class="col-3">
                        <div class="form-group">
                          <select
                            v-model="endTime.second"
                            class="form-control"
                            required
                          >
                            <option v-for="time in timecode" :key="time.key">
                              {{ time }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <button
                      id="videoStartAnalysisBtn"
                      type="button"
                      class="btn btn-success btn-lg btn-block my-4"
                      @click="addClipTime"
                    >
                      <i class="fas fa-plus mr-2"></i> 加入片段
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-4">
              <div class="card">
                <div
                  class="card-body overflow-auto px-0"
                  style="height: 340px; max-height: 340px"
                >
                  <table class="table table-borderless">
                    <tbody>
                      <tr
                        v-for="time in clip_timeSort"
                        :key="time.index"
                        @click="editClipTime(time)"
                      >
                        <td class="px-0 align-middle text-center" colspan="4">
                          {{ time.start }} ~ {{ time.end }}
                        </td>
                        <td>
                          <p class="text-center my-0 p-0">
                            <button
                              type="button"
                              class="btn btn-outline-info ml-1 my-1 py-1"
                              @click="editClipTime(time)"
                            >
                              <i class="far fa-edit"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-outline-danger ml-1 my-1 py-1"
                              @click="removeClipTime(time)"
                            >
                              <i class="far fa-trash-alt"></i>
                            </button>
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="card-footer">
                  <span
                    :class="[clip_totalTime <= 30 ? '' : 'text-danger']"
                    style="float: right"
                    >累積時間 {{ clip_totalTime }} 分鐘</span
                  >
                </div>
              </div>
              <button
                type="button"
                class="btn btn-danger btn-lg btn-block my-2"
                @click="cancelManualEditor()"
              >
                取消剪輯
              </button>
              <button
                type="button"
                class="btn btn-success btn-lg btn-block my-2"
                @click="manualAnalysis()"
              >
                完成剪輯
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-show="vodAnalysisSendStatusShow"
        class="row justify-content-center m-2"
      >
        <div v-if="vodAnalysisSendStatus === 'Loading'">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div
          v-else-if="vodAnalysisSendStatus === 'Success'"
          class="alert alert-info"
          role="alert"
        >
          <p class="text-center my-2 py-2">
            <span>影片處理中</span>
            <br />
            <span>處理完畢後您可透過下方連結觀看精華影片</span>
            <br />
            <b-link :to="'/highlight/' + videoHighlightId" target="_blank"
              >精華連結</b-link
            >
          </p>
        </div>
        <div
          v-else-if="vodAnalysisSendStatus === 'Error'"
          class="alert alert-danger"
          role="alert"
        >
          <p class="text-center my-2 py-2">
            <span>很抱歉！分析影片失敗 請重新嘗試！</span>
          </p>
        </div>
      </div>
    </div>

    <div v-else-if="!inputBar">
      <!-- 精華影片搜尋顯示 -->
      <div v-show="highlightShow">
        <div
          v-if="highlightSearch === 'Loading'"
          class="d-flex justify-content-center my-2"
        >
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
            :start_at="searchVideo.start_at"
            :duration="searchVideo.duration"
            :avg_score="searchVideo.avg_score"
            :memo="searchVideo.memo"
            :author="searchVideo.author"
            :status="searchVideo.status"
            :analyzeType="searchVideo.analyzeType"
            v-on:manual="setManualEditor"
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
      <div
        v-if="videoList === 'Loading'"
        class="d-flex justify-content-center my-5"
      >
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
          :start_at="highlight.start_at"
          :duration="highlight.duration"
          :avg_score="highlight.avg_score"
          :memo="highlight.memo"
          :author="highlight.author"
          :status="highlight.status"
          :analyzeType="highlight.analyzeType"
          v-on:manual="setManualEditor"
        ></HighlightList>
      </div>
      <div
        v-else-if="videoList === 'Empty'"
        class="alert alert-info"
        role="alert"
      >
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
      inputBarText: "",
      vidId: "",
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
      startTime: {
        hour: "00",
        minute: "00",
        second: "00",
      },
      endTime: {
        hour: "00",
        minute: "00",
        second: "00",
      },

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
      .catch(() => {
        vm.videoList = "Error";
      });
  },
  methods: {
    loadVideo: function () {
      this.vodShow = false;
      this.vodAnalysisBtnShow = false;
      this.vodAnalysisSendStatusShow = false;
      this.manualEditorShow = false;
      this.vodErrorData = "";
      this.highlightTitle = "";
      let vm = this;
      let vodData = this.inputBarText;
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
          vm.vodShow = true;
          vm.vodAnalysisBtnShow = true;
        })
        .catch(function (error) {
          console.log(error);
          vm.vodValid = false;
          if (vm.inputBarText == "") {
            vm.vodErrorData = "請輸入您想分析的直播影片網址";
          } else {
            vm.vodErrorData = "請輸入正確的直播影片網址";
          }
        });
    },
    analysisVideo: function () {
      let vm = this;
      this.titleValid = true;
      this.titleErrorFeedback = "";
      this.checkHighlightTitle();
      if (this.titleValid) {
        this.vodAnalysisBtnShow = false;
        this.vodAnalysisSendStatusShow = true;
        this.vodAnalysisSendStatus = "Loading";
        this.axios
          .get(process.env.VUE_APP_ROOT_API + "/api/vod/highlight", {
            params: {
              vod_id: vm.vod_id,
            },
          })
          .then((response) => {
            if (response.data != "") {
              vm.vodAnalysisBtnShow = true;
              vm.vodAnalysisSendStatusShow = false;
              vm.titleValid = false;
              vm.titleErrorFeedback =
                "這部影片已經有人分析過囉 您可以在精華搜尋找到這部影片的分析結果";
            } else {
              vm.vodAnalysisBtnShow = false;
              vm.vodAnalysisSendStatusShow = true;
              vm.vodAnalysisSendStatus = "Loading";
              vm.axios
                .post(process.env.VUE_APP_ROOT_API + "/api/vod", {
                  token: this.$store.state.auth.token,
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
        let video = this.inputBarText.split("?");
        vid = video[0];
        vid = vid.substring(vid.length - 9);
      } else vid = this.inputBarText;

      this.highlightSearch = "Loading";
      this.highlightShow = true;
      this.searchVideos = null;
      this.axios
        .get(process.env.VUE_APP_ROOT_API + "/api/vod/highlight", {
          params: {
            vod_id:
              this.videoSearchType == "搜尋項目" ||
              this.videoSearchType == "vod_id"
                ? vid
                : null,
            highlight_id: this.videoSearchType == "highlight_id" ? vid : null,
            game: this.videoSearchType == "game" ? vid : null,
            channel_id: this.videoSearchType == "channel_id" ? vid : null,
            streamerName: this.videoSearchType == "streamerName" ? vid : null,
            author: this.videoSearchType == "author" ? vid : null,
            memo: this.videoSearchType == "title" ? vid : null,
          },
        })
        .then((response) => {
          this.searchVideos = response.data;
          if (this.searchVideos == "") this.highlightSearch = "Error";
          else this.highlightSearch = "Find";
          this.videoSearchType = "搜尋項目";
        })
        .catch(() => {
          vm.highlightSearch = "Error";
        });
    },
    checkHighlightTitle: function () {
      this.titleValid = true;
      this.titleErrorFeedback = "";
      if (this.highlightTitle == "") {
        this.titleValid = false;
        this.titleErrorFeedback = "Input cannot be empty.";
      } else this.titleValid = true;
    },
    manualEditor: function () {
      this.checkHighlightTitle();
      let isValid = this.titleValid;
      if (this.$store.state.auth.isLogin == false) {
        isValid = false;
        window.alert(
          "尚未登入 此功能僅供會員使用! 如您已是會員 請先登入後使用!"
        );
      }
      if (isValid) {
        this.vodShow = false;
        this.vodAnalysisBtnShow = false;
        this.manualEditorShow = true;
        this.clip_time = [];
        this.startTime = {
          hour: "00",
          minute: "00",
          second: "00",
        };
        this.endTime = {
          hour: "00",
          minute: "00",
          second: "00",
        };
      }
    },
    checkTime(time) {
      if (parseInt(time) < 10) time = "0" + time;
    },
    cancelManualEditor: function () {
      this.manualEditorShow = false;
      this.vodAnalysisBtnShow = true;
      this.vodShow = true;
    },
    manualAnalysis() {
      let vm = this;
      this.checkHighlightTitle();
      let isValid = this.titleValid;
      if (this.clip_totalTime > 30) {
        isValid = false;
        window.alert("剪輯片段時間總和超過30分鐘 請減少片段！");
      }
      if (this.$store.state.auth.isLogin == false) {
        isValid = false;
        window.alert(
          "尚未登入 此功能僅供會員使用! 如您已是會員 請先登入後使用!"
        );
      }
      if (isValid) {
        this.vodAnalysisBtnShow = false;
        this.manualEditorShow = false;
        this.vodAnalysisSendStatusShow = true;
        this.vodAnalysisSendStatus = "Loading";
        this.axios
          .post(process.env.VUE_APP_ROOT_API + "/api/vod/manualEditor", {
            token: this.$store.state.auth.token,
            vod_id: this.vod_id,
            memo: this.highlightTitle,
            start_at: this.clip_startTime,
            duration: this.clip_duration,
          })
          .then((response) => {
            console.log(response);
            this.vodAnalysisSendStatus = "Success";
            this.highlightTitle = "";
            this.videoHighlightId = response.data.highlight_id;
          })
          .catch(function (error) {
            vm.manualEditorShow = true;
            vm.vodAnalysisBtnShow = false;
            vm.vodShow = false;
            vm.vodAnalysisSendStatus = "Error";
            if (error.response) {
              if (error.response.status === 400) {
                window.alert(
                  "尚未登入 此功能僅供會員使用! 如您已是會員 請先登入後使用!"
                );
              } else {
                window.alert("送出失敗!");
              }
            } else {
              window.alert("送出失敗!");
            }
          });
      }
    },
    setManualEditor(vod_id, start_at, duration) {
      let vm = this;
      if (this.$store.state.auth.isLogin == false) {
        window.alert(
          "尚未登入 此功能僅供會員使用! 如您已是會員 請先登入後使用!"
        );
      } else {
        this.axios
          .create({
            baseURL: "https://api.twitch.tv/kraken/",
            headers: {
              Accept: "application/vnd.twitchtv.v5+json",
              "Client-ID": "ildytfqanhzvdaprp96m5rkylap16k",
            },
          })
          .get("videos/" + vod_id)
          .then(() => {
            this.inputBar = true;
            this.vidAnalysis =
              "https://player.twitch.tv/?video=v" +
              vod_id +
              "&autoplay=false&parent=" +
              window.location.hostname;
            this.inputBarText = vod_id;
            this.vod_id = vod_id;
            this.vodValid = true;
            this.vodLoadBtn = "reload";
            this.vodShow = true;
            this.vodAnalysisBtnShow = true;
            this.titleValid = true;
            this.highlightTitle = "";
            this.titleErrorFeedback = "";

            this.clip_time = [];

            let start,
              durationTime,
              startSec,
              durationSec,
              end,
              hour,
              minute,
              second,
              time;
            for (let i = 0; i < start_at.length && i < duration.length; i++) {
              start = start_at[i].split(":");
              durationTime = duration[i].split(":");
              startSec =
                parseInt(start[0] * 60 * 60) +
                parseInt(start[1] * 60) +
                parseInt(start[2]);
              durationSec =
                parseInt(durationTime[0] * 60 * 60) +
                parseInt(durationTime[1] * 60) +
                parseInt(durationTime[2]);
              end = Number(startSec) + Number(durationSec);
              hour = Math.floor(end / 60 / 60);
              hour = hour >= 10 ? hour : "0" + hour;
              minute = Math.floor(end / 60) % 60;
              minute = minute >= 10 ? minute : "0" + minute;
              second = end % 60;
              second = second >= 10 ? second : "0" + second;

              time = {
                start: start_at[i],
                end: hour + ":" + minute + ":" + second,
              };
              this.clip_time.push(time);
            }
            this.startTime = {
              hour: "00",
              minute: "00",
              second: "00",
            };
            this.endTime = {
              hour: "00",
              minute: "00",
              second: "00",
            };
            this.vodShow = false;
            this.vodAnalysisBtnShow = false;
            this.manualEditorShow = true;

            this.$nextTick(function () {
              vm.$refs.editorPage.scrollIntoView({ behavior: "smooth" });
            });
          })
          .catch(() => {
            window.alert(
              "存取原始Vod時發生問題! 可能為Vod不存在或網路發生問題"
            );
          });
      }
    },
    addClipTime: function () {
      let reg = /[0-4][0-9]:[0-5][0-9]:[0-5][0-9]/;
      let startTime =
        this.startTime.hour +
        ":" +
        this.startTime.minute +
        ":" +
        this.startTime.second;
      let endTime =
        this.endTime.hour +
        ":" +
        this.endTime.minute +
        ":" +
        this.endTime.second;
      let startSec =
        parseInt(this.startTime.hour * 60 * 60) +
        parseInt(this.startTime.minute * 60) +
        parseInt(this.startTime.second);
      let endSec =
        parseInt(this.endTime.hour * 60 * 60) +
        parseInt(this.endTime.minute * 60) +
        parseInt(this.endTime.second);
      if (reg.test(startTime) && reg.test(endTime) && startSec < endSec) {
        let time = {
          start: startTime,
          end: endTime,
        };
        this.clip_time.push(time);
      } else {
        window.alert("片段時間輸入不正確!");
      }
    },
    removeClipTime: function (time) {
      this.clip_time.splice(this.clip_time.indexOf(time), 1);
    },
    editClipTime: function (time) {
      let start = time.start.split(":");
      let end = time.end.split(":");
      this.startTime.hour = start[0];
      this.startTime.minute = start[1];
      this.startTime.second = start[2];
      this.endTime.hour = end[0];
      this.endTime.minute = end[1];
      this.endTime.second = end[2];
      // this.removeClipTime(time);
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
    clip_startTime() {
      let arr = this.clip_timeSort;
      let startTime = [];
      arr.forEach((element) => {
        startTime.push(element.start);
      });
      return startTime;
    },
    clip_duration() {
      let arr = this.clip_timeSort;
      let duration = [];
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
        let hour = Math.floor(diff / 60 / 60);
        hour = hour >= 10 ? hour : "0" + hour;
        let minute = Math.floor(diff / 60) % 60;
        minute = minute >= 10 ? minute : "0" + minute;
        let second = diff % 60;
        second = second >= 10 ? second : "0" + second;
        duration.push(hour + ":" + minute + ":" + second);
      });
      return duration;
    },
    timecode() {
      let tc = [];
      for (let i = 0; i < 61; i++) {
        if (i < 10) tc.push("0" + i);
        else tc.push(i);
      }
      return tc;
    },
    timecodeHour() {
      let tc = [];
      for (let i = 0; i < 49; i++) {
        if (i < 10) tc.push("0" + i);
        else tc.push(i);
      }
      return tc;
    },
  },
};
</script>