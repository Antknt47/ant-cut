<template>
  <div id="wrapper">
    <div id="main">
      <b-input-group>
        <b-form-input type="number" v-model="rltNumber" id="rltNumberInput" display="inline"></b-form-input>
        <b-input-group-append>
          <b-button variant="primary" id="directionBtn" v-on:click="onDirectionClick">
            <span v-if="direction === 'horz'">水平</span>
            <span v-else>垂直</span>
          </b-button>          
          <b-button variant="warning" id="outputPath" v-on:click="onOutputPathClick">+</b-button>
          <b-button variant="success" id="inputFile" v-on:click="onOpenFileClick">+</b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  const { dialog } = require('electron').remote
  const remote = window.require('electron').remote
  const cutPng = remote.app.cutPng

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    methods: {
      onDirectionClick () {
        if (this.direction === 'horz' || this.direction == null) {
          this.direction = 'vert'
        } else {
          this.direction = 'horz'
        }
      },
      onOpenFileClick () {
        this.inputFiles = dialog.showOpenDialog({
          filters: [
            { name: 'Images', extensions: ['png'] }
          ],
          properties: ['multiSelections']
        })
        console.log(this.inputFiles)
        cutPng(this.inputFiles, this.outputPath, this.direction, this.rltNumber)
      },
      onOutputPathClick () {
        console.log('this.outputPath:', this.outputPath)
        let path = dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']})
        if (path !== null && path !== undefined && path[0] !== null && path[0] !== undefined) {
          this.outputPath = path[0]
        }
        console.log('this.outputPath:', this.outputPath)
      }
    },
    data: function () {
      return {
        direction: 'horz',
        rltNumber: 3,
        inputFiles: [],
        outputPath: 'C:\\output'
      }
    }
  }
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { 
    font-family: "Microsoft YaHei", 'Source Sans Pro', sans-serif;
  }

  #wrapper {
    background-color: #2f2f2f;
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  .main {
    font-family: "Microsoft YaHei", 'Source Sans Pro', sans-serif;
    color: #000;
  }

  #directionBtn{
    float: left
  }
  #rltNumberInput {
    float: left;
    width: 50px;
  }
</style>
