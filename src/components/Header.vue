<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useModal } from '@/composables/useModal'
import Modal from '@/components/Modal.vue'

interface Site {
  title: string
  url: string
}

const showApps = ref(false)
const sites = ref<Site[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const toggleApps = () => {
  showApps.value = !showApps.value
}

async function fetchSites() {
  try {
    const NEBYOOAPPS_SOURCE_URL = 'https://dave.neb.host/?sites'
    const response = await axios.get(NEBYOOAPPS_SOURCE_URL)

    sites.value = response.data.body
  } catch (e: any) {
    error.value = e.message ?? 'Failed to load items'
  } finally {
    loading.value = false
  }
}

const helpModal = useModal()

function showHelpModal() {
  helpModal.open(
    'Welcome to Axe',
    'Toggle on some frets on the simplistic fretboard, and some stats will be displayed below. If you toggle certain ones, you will get a chord!',
  )
}

onMounted(fetchSites)
</script>

<template>
  <header>
    <div class="menu-left">
      <div id="nav-links">
        <button
          id="button-nav"
          @click="toggleApps"
          class="icon"
          aria-label="Click for links to more apps by neb.host"
          tabindex="-1"
        >
          <img src="../assets/the_n_bw.svg" alt="" />
        </button>
        <div id="nav-overlay" :class="{ show: showApps }">
          <div id="nav-content">
            <div class="container">
              <div class="nav-header">More Apps By Neb</div>

              <div class="nav-list">
                <template v-for="(site, idx) in sites" :key="idx">
                  <a :href="site.url" target="_blank">
                    {{ site.title }}
                  </a>
                </template>
              </div>

              <div class="nav-footer">
                <!-- vvv neb.host subsite footer -->
                <footer id="footer-neb-host">
                  site by
                  <a
                    style="color: #952828; font-family: 'Consolas', sans-serif; font-size: 14px"
                    href="https://neb.host"
                    >neb.host</a
                  >
                </footer>
                <!-- ^^^ neb.host subsite footer -->
              </div>
            </div>

            <div id="button-nav-close">
              <a href="#" @click="toggleApps">X</a>
            </div>
          </div>
        </div>
      </div>

      <button @click="showHelpModal" id="button-help" class="icon" aria-label="Help" tabindex="-1">
        <font-awesome-icon icon="fa-solid fa-question" />
      </button>
    </div>

    <div class="title">
      <h1>Axe</h1>
    </div>

    <div class="menu-right">
      <!--
      <button id="button-settings" class="icon" aria-label="Settings" tabindex="-1">
        <font-awesome-icon icon="fa-solid fa-gear" />
      </button>
      -->
    </div>
  </header>

  <Modal />
</template>

<style scoped>
header {
  align-items: center;
  background-color: var(--header-color);
  border-bottom: 1px solid var(--base-color);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 50px;
  padding: 0 16px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2;

  button {
    align-items: center;
    background-color: var(--vt-c-beige);
    display: flex;
    height: 40px;

    @media (hover: hover) {
      &:hover {
        background-color: var(--vt-c-beige-light);
      }
    }
  }
}
header .menu-left {
  align-items: center;
  display: flex;
  gap: 5px;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  width: 70px;
}
header .menu-left #button-nav img {
  height: 24px;
  width: 24px;
}
header .menu-left #nav-overlay {
  align-items: unset;
  background-color: transparent;
  display: none;
  height: 100%;
  justify-content: left;
  left: 0;
  position: fixed;
  top: 50px;
  width: 100%;
  z-index: 11;
}
header .menu-left #nav-overlay.show {
  display: flex;
}
header .menu-left #nav-overlay #nav-content {
  background-color: var(--vt-c-white);
  border-radius: 0;
  box-shadow: 3px 5px 5px rgb(0 0 0 / 15%);
  box-sizing: border-box;
  max-height: calc(100% - 52px);
  max-width: 500px;
  overflow-y: auto;
  padding: 0px;
  position: relative;
  top: 0;
  width: 100%;
}
@media (min-width: 415px) {
  header .menu-left #nav-overlay #nav-content {
    width: 325px;
  }
}
header .menu-left #nav-overlay #nav-content a {
  color: var(--black);
  text-decoration: none;
}

header .menu-left #nav-overlay #nav-content .container {
  align-items: normal;
  padding: 0;
}
header .menu-left #nav-overlay #nav-content .container .nav-header {
  font-size: 20px;
  padding-bottom: 18px;
  padding-left: 18px;
  padding-top: 18px;
}
header .menu-left #nav-overlay #nav-content .container .nav-list a {
  align-items: center;
  background-color: transparent;
  display: flex;
  font-family: 'Changa Bold';
  font-size: 16px;
  font-weight: bold;
  height: 30px;
  justify-content: left;
  padding: 4px 0 4px 18px;
}
@media (hover: hover) {
  header .menu-left #nav-overlay #nav-content .container .nav-list a:hover {
    background-color: #e9e9e9;
  }
}
header .menu-left #nav-overlay #nav-content #button-nav-close {
  font-size: 20px;
  height: 24px;
  position: absolute;
  right: 16px;
  top: 16px;
  width: 24px;
}
@media (hover: hover) {
  header .menu-left #nav-overlay #nav-content #button-nav-close a:hover {
    color: var(--dark-color);
  }
}
header .menu-left #nav-overlay #nav-content .nav-footer {
  display: flex;
}
#footer-neb-host {
  background: var(--header-color);
  border-top: 2px solid var(--vt-c-black);
  bottom: 0;
  color: var(--vt-c-black);
  font-family: 'Consolas', sans-serif;
  font-size: 14px;
  font-weight: 500;
  left: 0;
  letter-spacing: initial;
  margin-top: 20px;
  padding: 10px 18px;
  position: absolute;
  right: 0;
  text-align: left;
  width: 100%;
  z-index: 2;
}
header .title {
  font-family: 'Changa Bold', sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0.1em;
  pointer-events: none;
  text-align: center;
  text-transform: uppercase;
}
@media (min-width: 768px) {
  header .title {
    font-size: 20px;
  }
}
header .menu-right {
  display: flex;
  width: 70px;
}
header .menu-right button#button-settings {
  display: flex;
  justify-content: flex-end;
  margin-right: 0;
}
.modal-footer {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
