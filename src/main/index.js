'use strict'

import { app, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const fs = require('fs')
const PNG = require('pngjs').PNG

function cutPng (filenames, outputPath, direction, cutNum) {
  console.log('cutPng', filenames, outputPath, direction, cutNum)

  for (let inputIndex in filenames) {
    let filenameNoPng = filenames[inputIndex].split('.')[0].split('\\').pop()
    console.log(filenameNoPng)

    console.log('cut:', filenames[inputIndex])
    fs.createReadStream(filenames[inputIndex])
      .pipe(new PNG({
        filterType: 4
      }))
      .on('parsed', function () {
        let outputFiles = []
        let tgtWidth, tgtHeight
        if (direction === 'horz') {
          tgtWidth = Math.floor(this.width / cutNum)
          tgtHeight = this.height
        } else {
          tgtWidth = this.width
          tgtHeight = Math.floor(this.height / cutNum)
        }
        console.log(this.width, this.height, tgtWidth, tgtHeight)
        for (let i = 0; i < cutNum; ++i) {
          outputFiles[i] = new PNG({width: tgtWidth, height: tgtHeight})
        }

        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            let fileIndex, tgtX, tgtY
            if (direction === 'horz') {
              fileIndex = Math.floor(x / tgtWidth)
              tgtX = Math.floor(x % tgtWidth)
              tgtY = y
            } else {
              fileIndex = Math.floor(y / tgtHeight)
              tgtY = Math.floor(y % tgtHeight)
              tgtX = x
            }

            let idx = (this.width * y + x) << 2
            let tgtidx = (tgtWidth * tgtY + tgtX) << 2
            // invert color
            if (fileIndex >= cutNum) {
              continue
            }

            outputFiles[fileIndex].data[tgtidx] = this.data[idx]
            outputFiles[fileIndex].data[tgtidx + 1] = this.data[idx + 1]
            outputFiles[fileIndex].data[tgtidx + 2] = this.data[idx + 2]
            outputFiles[fileIndex].data[tgtidx + 3] = this.data[idx + 3]
          }
        }
        for (let i = 0; i < cutNum; ++i) {
          outputFiles[i].pack().pipe(fs.createWriteStream(outputPath + '\\' + filenameNoPng + i + '.png'))
        }
      })
  }
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 160,
    useContentSize: true,
    width: 550,
    show: false,
    resizable: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.setMenu(null)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  app.cutPng = cutPng
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
