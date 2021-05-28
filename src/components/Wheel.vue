<template>
  <v-card outlined>
    <v-row align="center">
      <v-col cols="6">
        <center>
          <div style="width: 150px; height: 150px; position: relative">
            <v-progress-circular
              style="position: absolute; top: 25px; left: 25px"
              :size="100"
              :width="10"
              :rotate="speed > -0.1 ? 0 : 180"
              :value="(Math.abs(speed) / 0.84) * 100"
              color="primary"
            >
              {{ speed }}rad/s
            </v-progress-circular>
            <v-progress-circular
              style="position: absolute; top: 17.5px; left: 17.5px"
              :size="115"
              :width="5"
              :rotate="ctarget > -0.1 ? 0 : 180"
              :value="(Math.abs(cspeed) / 0.84) * 100"
            >
            </v-progress-circular>
            <v-progress-circular
              style="position: absolute; top: 10px; left: 10px"
              :size="130"
              :width="5"
              :rotate="ctarget > -0.1 ? 0 : 180"
              :value="(Math.abs(target) / 0.84) * 100"
            >
            </v-progress-circular>
            <v-progress-circular
              style="position: absolute; top: 2.5px; left: 2.5px"
              :size="145"
              :width="5"
              :rotate="ctarget > -0.1 ? 0 : 180"
              :value="(Math.abs(ctarget) / 0.84) * 100"
            >
            </v-progress-circular>
          </div></center
      ></v-col>
      <v-col cols="6">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="overline"> Speed </v-list-item-title>
            <v-list-item-subtitle> {{ speed }}rad/s </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="overline">
              Corrected Speed
            </v-list-item-title>
            <v-list-item-subtitle> {{ cspeed }}rad/s </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="overline"> Target </v-list-item-title>
            <v-list-item-subtitle> {{ target }}rad/s </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="overline">
              Corrected Target
            </v-list-item-title>
            <v-list-item-subtitle> {{ ctarget }}rad/s </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: ["speed", "cspeed", "target", "ctarget"],
  data: () => {
    return {
      rotation: 0,
      speedAbs: 0,
    };
  },
  mounted() {
    setInterval(() => {
      //this.rotation += this.speed * 117.2958;
      this.speedAbs = Math.abs(this.speed);
    }, 100);
  },
};
</script>

