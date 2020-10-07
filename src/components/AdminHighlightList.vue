<template>
  <!-- 精華影片顯示 -->
  <div class="m-4" v-show="!isDelete">
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
        <p class="text-left m-0">建立者：{{ author }}</p>
        <div class="float-right m-1">
          <b-list-group horizontal>
            <b-list-group-item variant="info">{{ highlightStatus }}</b-list-group-item>
            <b-list-group-item class="p-1">
              <b-button
                class="mx-1"
                variant="outline-primary"
                v-b-tooltip.hover
                title="重新分析"
                @click="highlightReanalysis"
              >
                <i class="fas fa-redo-alt"></i>
              </b-button>
              <b-button
                class="mx-1"
                variant="outline-primary"
                v-b-tooltip.hover
                title="精華管理"
                @click="highlightManage"
              >
                <i class="fas fa-user-edit"></i>
              </b-button>
              <b-button
                class="mx-1"
                variant="outline-primary"
                v-b-tooltip.hover
                title="刪除精華"
                @click="highlightDelete"
              >
                <i class="fas fa-trash-alt"></i>
              </b-button>
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
    </div>
    <b-collapse v-model="collapseVisible" class="mt-2">
      <b-tabs content-class="mt-3">
        <b-tab title="精華編輯" active>
          <b-card>
            <b-form @submit.prevent="highlightEdit">
              <b-form-group v-if="vod_id != null" label="vod_id">
                <b-form-input v-model="formHighlightEdit.vod_id" type="text"></b-form-input>
              </b-form-group>

              <b-form-group v-if="highlight_id != null" label="highlight_id">
                <b-form-input v-model="formHighlightEdit.highlight_id" type="text"></b-form-input>
              </b-form-group>

              <b-form-group v-if="channel_id != null" label="channel_id">
                <b-form-input v-model="formHighlightEdit.channel_id" type="text"></b-form-input>
              </b-form-group>

              <b-form-group v-if="streamerName != null" label="streamerName">
                <b-form-input v-model="formHighlightEdit.streamerName" type="text"></b-form-input>
              </b-form-group>

              <b-form-group v-if="game != null" label="game">
                <b-form-input v-model="formHighlightEdit.game" type="text"></b-form-input>
              </b-form-group>

              <b-form-group v-if="youtube_url != null" label="youtube_url">
                <b-form-input v-model="formHighlightEdit.youtube_url" type="text"></b-form-input>
              </b-form-group>

              <b-form-group v-if="avg_score != null" label="avg_score">
                <b-form-input v-model="formHighlightEdit.avg_score" type="text" disabled></b-form-input>
              </b-form-group>

              <b-form-group v-if="memo != null" label="memo">
                <b-form-input v-model="formHighlightEdit.memo" type="text"></b-form-input>
              </b-form-group>

              <b-form-group v-if="author != null" label="author">
                <b-form-input v-model="formHighlightEdit.author" type="text"></b-form-input>
              </b-form-group>

              <b-form-group v-if="status != null" label="status">
                <b-form-input v-model="formHighlightEdit.status" type="text"></b-form-input>
              </b-form-group>

              <b-form-group v-if="analysis != null" label="analysis">
                <b-form-input v-model="formHighlightEdit.analysis" type="text" disabled></b-form-input>
              </b-form-group>

              <div v-if="editting">
                <div class="spinner-border text-secondary float-right" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <div v-else>
                <button type="submit" class="btn btn-primary float-right">修改</button>
              </div>
            </b-form>
          </b-card>
        </b-tab>
        <b-tab title="精華評價" @click="highlightAppraise">
          <b-card style="max-height: 20rem;overflow-y: auto;">
            <div v-if="appraiseList === 'Loading'" class="d-flex justify-content-center my-5">
              <div class="spinner-grow text-secondary" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            <div v-else-if="appraiseList === 'Finish'">
              <b-table striped hover :items="appraises" :fields="fields" responsive="sm"></b-table>
            </div>
            <div v-else class="alert alert-danger" role="alert">
              <p class="text-center my-2 py-2">
                <span>系統連線發生錯誤 請等待問題排除或重新整理頁面嘗試 感謝！</span>
              </p>
            </div>
          </b-card>
        </b-tab>
      </b-tabs>
    </b-collapse>
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
    "author",
    "status",
    "analysis",
  ],
  data() {
    return {
      text: "",
      appraiseModalShow: false,
      fields: ["author", "text", "score"],
      appraises: null,
      appraiseList: "Loading",
      formHighlightEdit: {
        vod_id: this.vod_id,
        highlight_id: this.highlight_id,
        channel_id: this.channel_id,
        streamerName: this.streamerName,
        game: this.game,
        youtube_url: this.youtube_url,
        avg_score: this.avg_score,
        memo: this.memo,
        author: this.author,
        status: this.status,
        analysis: this.analysis,
      },

      editting: false,
      notAccurate: false,
      videoLong: false,
      analysisLong: false,
      validationText: false,
      haveAppraise: false,
      isDelete: false,
      collapseVisible: false,
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
    highlightReanalysis() {
      this.axios
        .post(process.env.VUE_APP_ROOT_API + "/api/admin/highlightReanalysis", {
          token: this.$store.state.auth.token,
          vod_id: this.vod_id,
          highlight_id: this.highlight_id,
        })
        .then((response) => {
          console.log(response);
          window.alert("送出成功!");
        })
        .catch(function (error) {
          console.log(error);
          window.alert("送出失敗!");
        });
    },
    highlightManage() {
      this.collapseVisible = !this.collapseVisible;
      this.editting = false;
    },
    highlightEdit() {
      let vm = this;
      this.editting = true;
      this.axios
        .post(process.env.VUE_APP_ROOT_API + "/api/admin/highlightEdit", {
          token: this.$store.state.auth.token,
          vod_id: this.formHighlightEdit.vod_id,
          highlight_id: this.formHighlightEdit.highlight_id,
          channel_id: this.formHighlightEdit.channel_id,
          streamerName: this.formHighlightEdit.streamerName,
          game: this.formHighlightEdit.game,
          youtube_url: this.formHighlightEdit.youtube_url,
          avg_score: this.formHighlightEdit.avg_score,
          memo: this.formHighlightEdit.memo,
          author: this.formHighlightEdit.author,
          status: this.formHighlightEdit.status,
          analysis: this.formHighlightEdit.analysis,
        })
        .then((response) => {
          console.log(response);
          this.editting = false;
          window.alert("修改成功!");
        })
        .catch(function (error) {
          console.log(error);
          vm.editting = false;
          window.alert("修改發生錯誤!");
        });
    },
    highlightAppraise() {
      this.appraiseList = "Loading";
      this.axios
        .get(process.env.VUE_APP_ROOT_API + "/api/admin/highlightAppraise", {
          params: {
            token: this.$store.state.auth.token,
            highlight_id: this.highlight_id,
          },
        })
        .then((response) => {
          this.appraiseList = "Finish";
          this.appraises = response.data;
        })
        .catch(function (error) {
          console.log(error);
          this.appraiseList = "Error";
        });
    },
    highlightDelete() {
      if (window.confirm("確定要刪除嗎?")) {
        this.axios
          .post(process.env.VUE_APP_ROOT_API + "/api/admin/highlightDelete", {
            token: this.$store.state.auth.token,
            highlight_id: this.highlight_id,
          })
          .then((response) => {
            console.log(response);
            window.alert("刪除成功!");
          })
          .catch(function (error) {
            console.log(error);
            window.alert("刪除失敗!");
          });
        this.isDelete = true;
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
    highlightStatus() {
      let text;
      switch (this.status) {
        case "GETINFO":
          text = "獲取資訊中";
          break;
        case "RUNALGO":
          text = "影片分析中";
          break;
        case "FMVODDL":
          text = "影片下載中";
          break;
        case "FMVODCB":
          text = "影片合併中";
          break;
        case "YTVODUL":
          text = "YT上傳中";
          break;
        case "FINISHED":
          text = "已完成";
          break;
        case "NEWANALF":
          text = "建立分析失敗";
          break;
        case "GETINFOF":
          text = "獲取資訊失敗";
          break;
        case "RUNALGOF":
          text = "影片分析失敗";
          break;
        case "FMVODDLF":
          text = "影片下載失敗";
          break;
        case "FMVODCBF":
          text = "影片合併失敗";
          break;
        case "YTVODULF":
          text = "YT上傳失敗";
          break;
        default:
          text = "Empty";
      }
      return text;
    },
  },
};
</script>