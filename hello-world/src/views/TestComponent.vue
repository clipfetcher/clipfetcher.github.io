<template>
  <div class="container">
    <button
      class="btn btn-primary m-5"
      type="button"
      @click="showModal = !showModal"
    >Launch demo modal</button>

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
  </div>
</template>

<script>
//import HighlightList from "@/components/HighlightList.vue";

export default {
  name: "test",
  data() {
    return {
      title: "Test",
      showModal: false
    };
  },
  methods: {
    startTransitionModal() {
      this.$refs.backdrop.classList.toggle("d-block");
      this.$refs.modal.classList.toggle("d-block");
    },
    endTransitionModal() {
      this.$refs.backdrop.classList.toggle("show");
      this.$refs.modal.classList.toggle("show");
    }
  }
  //components: { HighlightList }
};
</script>