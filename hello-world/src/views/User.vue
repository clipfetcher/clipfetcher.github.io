<template>
  <div>
    <h1>This is an news page</h1>
    <p>uid = {{ uid }}, {{ nation }}</p>
    <p>$route.params.uid = {{ $route.params.uid }}</p>
    <p>$route.params.nation = {{ $route.params.uid }}</p>
  </div>
</template>

<script>
export default {
  name: "User",
  props: ["uid", "nation"]
};
</script>