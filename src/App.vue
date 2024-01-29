<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import ConnectWallet from './components/ConnectWallet.vue'
import NftMinter from './components/NftMinter.vue'

const openNftPage = ref(false);
const ethereumAddress = ref("");

async function connectWallet() {
    if(typeof window.ethereum !== "undefined") {
      await window.ethereum.request({method: "eth_requestAccounts"});
      if (window.ethereum.selectedAddress) {
        openNftPage.value = true;
        ethereumAddress.value = window.ethereum.selectedAddress;
        console.log("Connected to wallet with address: " + window.ethereum.selectedAddress);
      }
    }
    else {
      const error = "MetaMask cannot be detected. Make sure you have MetaMask is installed and connected to your wallet";
      console.error(error);
      alert(error);
    }
}
</script>

<template>

    <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

    <div class="wrapper">
      <div v-if="ethereumAddress && ethereumAddress.length > 0" style="position: absolute; top: 10%; font-size: 20px;">
        <span>Connected to wallet with address: {{ethereumAddress}} </span>
      </div>

      <ConnectWallet v-if="!openNftPage" @click="connectWallet"></ConnectWallet>

      <NftMinter v-if="openNftPage"></NftMinter>

      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
    </div>

  <!-- <RouterView /> -->
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
