<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6" v-for="i in 4" :key="i">
          <Wheel
            :speed="speed.c[i-1]"
            :cspeed="speed.p[i-1]"
            :target="speed.t[i-1]"
            :ctarget="speed.n[i-1]"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Wheel from "@/components/Wheel";
export default {
  props: ["speed"],
  name: "Home",
  components: {
    Wheel,
  },
};
</script>
