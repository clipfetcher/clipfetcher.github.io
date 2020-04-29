<template>
  <!-- 精華影片顯示 -->
  <div class="card-body">
    <div class="row">
      <div class="col-12 col-md-4">
        <div class="embed-responsive embed-responsive-16by9">
          <iframe class="embed-responsive-item" :src="youtube_embed" allowfullscreen></iframe>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <span>{{ vod_id }}</span>
        <p class="text-left m-0">實況主：{{ channel_id }}</p>
        <!--<p class="text-left m-0">標題：</p>-->
        <p class="text-left m-0">遊戲分類：{{ game }}</p>
      </div>
      <div class="col-12 col-md-5 align-self-end">
        <button type="button" class="btn btn-outline-secondary m-1">影片不精準</button>
        <button type="button" class="btn btn-outline-secondary m-1">影片長度過長</button>
        <button type="button" class="btn btn-outline-secondary m-1">影片分析太久</button>
        <button type="button" class="btn btn-outline-secondary m-1">其他</button>
        <br />
        <div class="float-right">
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
          {{ avg_score }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HighlightList",
  props: ["vod_id", "channel_id", "game", "youtube_url", "avg_score"],
  data() {
    return {
      starRating: 0
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
    }
  },
  computed: {
    youtube_embed: function() {
      //https://youtu.be/frguLOUro2E
      let vodData = this.youtube_url;
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