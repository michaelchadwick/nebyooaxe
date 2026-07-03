<script setup lang="ts">
import { inject, markRaw, onMounted, ref } from 'vue'
import { useModal } from '@/composables/useModal'
import SettingsForm from '@/components/SettingsForm.vue'
import type { AxiosInstance } from 'axios'

const http = inject('http') as unknown as AxiosInstance

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
    const response = await http!.get(NEBYOOAPPS_SOURCE_URL)

    sites.value = response.data.body
  } catch (e: any) {
    error.value = e.message ?? 'Failed to load items'
  } finally {
    loading.value = false
  }
}

const modal = useModal()

function showHelp() {
  modal.openText({
    title: 'Welcome to Axe',
    html: `
      <p>Toggle some frets on the fretboard, and some stats will be displayed below. Press the "Strum Notes" button to play them. If you toggle certain frets, you may get a chord!</p>

      <p class="buffered">Site by <a href="https://michaelchadwick.info">Michael Chadwick</a> | <a href="https://github.com/michaelchadwick/nebyooaxe">Source code</a></p>
    `,
  })
}

function showSettings() {
  modal.openComp(markRaw(SettingsForm))
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
          <img src="../assets/images/the_n_bw.svg" alt="" />
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

      <button @click="showHelp" id="button-help" class="icon" aria-label="Help" tabindex="-1">
        <font-awesome-icon icon="fa-solid fa-question" />
      </button>
    </div>

    <div class="title">
      <h1>Axe</h1>
    </div>

    <div class="menu-right">
      <!-- TODO: Clicking on these fails on production due to some circular JSON.stringify issue with axios
      <button
        @click="showSettings"
        id="button-settings"
        class="icon"
        aria-label="Settings"
        tabindex="-1"
      >
        <font-awesome-icon icon="fa-solid fa-gear" />
      </button>
      -->
    </div>
  </header>
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

  .menu-left {
    align-items: center;
    display: flex;
    gap: 5px;
    justify-content: flex-start;
    margin: 0;
    padding: 0;
    width: 70px;

    #button-nav img {
      height: 24px;
      width: 24px;
    }

    #nav-overlay {
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

      &.show {
        display: flex;
      }

      #nav-content {
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

        @media (min-width: 415px) {
          width: 325px;
        }

        a {
          color: var(--black);
          text-decoration: none;
        }

        .container {
          align-items: normal;
          padding: 0;

          .nav-header {
            font-size: 20px;
            padding-bottom: 18px;
            padding-left: 18px;
            padding-top: 18px;
          }

          .nav-list a {
            align-items: center;
            background-color: transparent;
            display: flex;
            font-family: 'Changa Bold';
            font-size: 16px;
            font-weight: bold;
            height: 30px;
            justify-content: left;
            padding: 4px 0 4px 18px;

            @media (hover: hover) {
              &:hover {
                background-color: #e9e9e9;
              }
            }
          }
        }

        #button-nav-close {
          font-size: 20px;
          height: 24px;
          position: absolute;
          right: 16px;
          top: 16px;
          width: 24px;

          @media (hover: hover) {
            a:hover {
              color: var(--dark-color);
            }
          }
        }

        .nav-footer {
          display: flex;
        }
      }
    }
  }

  .title {
    font-family: 'Changa Bold', sans-serif;
    font-weight: 700;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0.1em;
    pointer-events: none;
    text-align: center;
    text-transform: uppercase;

    @media (min-width: 768px) {
      font-size: 20px;
    }
  }

  .menu-right {
    display: flex;
    justify-content: flex-end;
    width: 70px;

    button#button-settings {
      display: flex;
      justify-content: flex-end;
      margin-right: 0;
    }
  }

  .modal-footer {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }
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
</style>
