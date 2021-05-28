<template>
  <v-app class="fadeIn">
    <v-navigation-drawer app permanent>
      <v-list-item>
        <v-list-item-action>
          <status-indicator
            :pulse="connected"
            :status="connected ? 'active' : ''"
          />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title
            v-html="connected ? 'connected' : 'disconnected'"
            class="overline"
          >
          </v-list-item-title>
          <v-scale-transition>
            <span class="text-caption" v-show="connected">
              {{ portName }}
            </span>
          </v-scale-transition>
        </v-list-item-content>
        <v-list-item-avatar v-if="connected">
          <v-icon v-html="!connectionMethod ? 'usb' : 'bluetooth_connected'" />
        </v-list-item-avatar>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2 text-center grey--text">
          <v-fade-transition>
            <span
              v-html="
                connectedToServer
                  ? 'CONNECTED TO FORWARDER'
                  : 'DISCONNECTED FROM FORWARDER'
              "
              v-show="connectionEventNew"
              class="overline"
            />
          </v-fade-transition>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <router-view :speed="speed" />
    </v-main>
  </v-app>
</template>

<script>
import { StatusIndicator } from "vue-status-indicator";
import { io } from "socket.io-client";

export default {
  components: {
    StatusIndicator,
  },
  mounted() {
    this.socket = io("http://localhost:3000");
    this.socket
      .on("connect", () => {
        this.connectionEventNew = true;
        setTimeout(() => {
          this.connectionEventNew = false;
        }, 3000);
        this.connectedToServer = true;
      })
      .on("disconnected", () => {
        this.connectedEpoch = Date.now();
        setTimeout(() => {
          this.connectionEventNew = false;
        }, 3000);
        this.connectedToServer = false;
      })
      .on("connected", (data) => {
        this.connected = data.connected;
        this.connectionMethod = data.method;
        this.portName = data.name;
      })
      .on("speed", (speed) => {
        this.speed = speed
      });
  },
  data: () => {
    return {
      speed: null,
      socket: null,
      connectionEventNew: false,
      connectedToServer: false,
      connected: false,
      portName: null,
      connectionMethod: false,
    };
  },
};
</script>

<style>
.fadeIn {
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 0.2s;
}
@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>