<template>
  <div class="container">
    <h1>This is an user page</h1>
    <p>uid = {{ uid }}</p>
    <p>$route.params.uid = {{ $route.params.uid }}</p>
  </div>
</template>

<script>
export default {
  name: "User",
  props: ["uid"],
};
</script>