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

cutPng(['C:\\Users\\Administrator\\Desktop\\png\\17last.png'],
  'C:\\Users\\Administrator\\Desktop\\png\\output',
  'vert',
  4)
