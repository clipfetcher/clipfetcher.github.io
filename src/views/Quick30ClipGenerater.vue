<template>
  <div class="container">
    <form @submit.prevent="clipGenerate">
      <div class="form-group">
        <label for="vod_id">VodID</label>
        <input type="text" class="form-control" id="vod_id" v-model="vod_id" />
      </div>
      <div class="form-group">
        <label for="clipStartTime">Start Time</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            id="clipStartTime"
            v-model="startTime"
          />
          <div class="input-group-append">
            <button type="button" class="btn btn-primary" @click="addClip()">
              Add
            </button>
          </div>
        </div>
      </div>
      <br />
      <button type="submit" class="btn btn-primary mx-2">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Quick30",
  data() {
    return {
      vod_id: "",
      start_at: null,
      duration: null,
      startTime: "",
    };
  },
  methods: {
    clipGenerate() {
      if (this.vod_id != "" && this.start_at != null && this.duration != null) {
        this.axios
          .post(process.env.VUE_APP_ROOT_API + "/api/vod/manualEditor", {
            token: this.$store.state.auth.token,
            vod_id: this.vod_id,
            memo: this.vod_id,
            start_at: this.start_at,
            duration: this.duration,
          })
          .then(() => {
            console.log("Success");
            this.vod_id = "";
            this.start_at = null;
            this.duration = null;
            this.startTime = "";
          })
          .catch(() => {
            console.log("Fail");
          });
      }
    },
    addClip() {
      let defaultDuration = "00:00:30";
      this.start_at = this.startTime.split(" ");
      this.duration = Array(this.start_at.length).fill(defaultDuration);
      this.startTime = "";
    },
  },
};
</script>