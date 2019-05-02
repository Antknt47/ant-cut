<template>
  <div id="wrapper">
    <div id="main">
      <b-input-group>
        <b-form-input type="number" v-model="rltNumber" id="rltNumberInput" display="inline" v-b-tooltip.hover title="生成图片数"></b-form-input>
        <b-input-group-append>
          <b-button variant="primary" id="directionBtn" v-on:click="onDirectionClick" v-b-tooltip.hover title="切割方向">
            <span v-if="direction === 'horz'">↔</span>
            <span v-else>↕️</span>
          </b-button>          
          <b-button variant="primary" id="outputPath" v-on:click="onOutputPathClick" v-b-tooltip.hover title="输出路径">📁</b-button>
          <b-button variant="primary" id="inputFile" v-on:click="onOpenFileClick" v-b-tooltip.hover title="输入文件">📄</b-button>
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
  #directionBtn {
    width: 40px;
  }
</style>
