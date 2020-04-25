<template>
  <div>
    <div id="videoList">
      <!-- 精華影片顯示 -->
      <div class="card my-2">
        <h5 class="card-header">精華影片列表</h5>
        <div class="card-body">
          <div class="row">
            <div class="col-12 col-md-4">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe
                  class="embed-responsive-item"
                  src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-left m-0">實況主：</p>
              <p class="text-left m-0">標題：</p>
              <p class="text-left m-0">遊戲分類：</p>
            </div>
            <div class="col-12 col-md-5 align-self-end">
              <button type="button" class="btn btn-outline-secondary m-1">影片不精準</button>
              <button type="button" class="btn btn-outline-secondary m-1">影片長度過長</button>
              <button type="button" class="btn btn-outline-secondary m-1">影片分析太久</button>
              <button type="button" class="btn btn-outline-secondary m-1">其他</button>
              <br />
              <div class="float-right">{{ starRating }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HighlightList",
  data() {
    return {
      starRating: 0
    };
  }
};
</script>

<style>
</style>