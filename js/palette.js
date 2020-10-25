// eslint-disable-next-line no-unused-vars
const OriginalPalette = {
  init (img, ctx) {
    this.bins = {}
    this.bin_range = 16
    this.bin_size = 256 / this.bin_range
    this.channels = 4
    this.img = img
    this.img_copy = new ImageData(img.width, img.height)
    this.dataArray = img.data
    this.ctx = ctx
    this.K = 5

    for (let i = 0; i < this.bin_range; i++) {
      for (let j = 0; j < this.bin_range; j++) {
        for (let k = 0; k < this.bin_range; k++) {
          const tmp = {
            color: [
              (i + 0.5) * this.bin_size,
              (j + 0.5) * this.bin_size,
              (k + 0.5) * this.bin_size
            ],
            count: 0,
            idx: -1
          }
          tmp.Lab = OriginalColor.rgb2lab(tmp.color)
          this.bins['r' + i + 'g' + j + 'b' + k] = tmp
        }
      }
    }
  },
  palette () {
    const l = this.dataArray.length
    for (let i = 0; i < l; i += this.channels) {
      const R = this.dataArray[i]
      const G = this.dataArray[i + 1]
      const B = this.dataArray[i + 2]
      const ri = Math.floor(R / this.bin_size)
      const gi = Math.floor(G / this.bin_size)
      const bi = Math.floor(B / this.bin_size)
      this.bins['r' + ri + 'g' + gi + 'b' + bi].count++
    }
  },

  distance2 (c1, c2) {
    let res = 0
    for (let i = 0; i < c1.length; i++) {
      res += (c1[i] - c2[i]) * (c1[i] - c2[i])
    }
    return res
  },

  normalize (v) {
    const d = Math.sqrt(this.distance2(v, [0, 0, 0]))
    const res = []
    for (let i = 0; i < v.length; i++) {
      res.push(v[i] / d)
    }
    return res
  },

  add (c1, c2) {
    const res = []
    for (let i = 0; i < c1.length; i++) {
      res.push(c1[i] + c2[i])
    }
    return res
  },

  sub (c1, c2) {
    const res = []
    for (let i = 0; i < c1.length; i++) {
      res.push(c1[i] - c2[i])
    }
    return res
  },

  sca_mul (c, k) {
    const res = []
    for (let i = 0; i < c.length; i++) {
      res.push(c[i] * k)
    }
    return res
  },
  kmeansFirst () {
    const centers = [] // rgb format
    const centers_lab = []
    centers.push([this.bin_size / 2, this.bin_size / 2, this.bin_size / 2]) // black
    centers_lab.push(OriginalColor.rgb2lab(centers[0]))
    const bins_copy = {}
    for (const i in this.bins) {
      bins_copy[i] = this.bins[i].count
    }

    for (let p = 0; p < this.K; p++) {
      let tmp
      let maxc = -1
      for (const i in bins_copy) {
        const d2 = this.distance2(this.bins[i].Lab, centers_lab[p])
        const factor = 1 - Math.exp(-d2 / 6400) // sigma_a:80
        bins_copy[i] *= factor
        if (bins_copy[i] > maxc) {
          maxc = bins_copy[i]
          tmp = []
          for (let j = 0; j < 3; j++) {
            tmp.push(this.bins[i].color[j])
          }
        }
      }
      centers.push(tmp)
      centers_lab.push(OriginalColor.rgb2lab(tmp))
    }
    return centers_lab
  },
  kmeans () {
    let centers = this.kmeansFirst() // lab
    let no_change = false
    while (!no_change) {
      no_change = true
      const sum = []
      for (let i = 0; i < this.K + 1; i++) {
        sum.push({
          color: [0, 0, 0],
          count: 0
        })
      }
      for (let i = 0; i < this.bin_range; i++) {
        for (let j = 0; j < this.bin_range; j++) {
          for (let k = 0; k < this.bin_range; k++) {
            const tmp = this.bins['r' + i + 'g' + j + 'b' + k]
            if (tmp.count === 0) {
              continue
            }

            const lab = tmp.Lab
            let mind = Infinity
            let mini = -1
            for (let p = 0; p < this.K + 1; p++) {
              const d = this.distance2(centers[p], lab)
              if (mind > d) {
                mind = d
                mini = p
              }
            }
            if (mini !== tmp.idx) {
              tmp.idx = mini
              no_change = false
            }
            const m = this.sca_mul(tmp.Lab, tmp.count)
            sum[mini].color = this.add(sum[mini].color, m)
            sum[mini].count += tmp.count
          }
        }
      }

      for (let i = 1; i < this.K + 1; i++) {
        if (sum[i].count) {
          for (let j = 0; j < 3; j++) {
            centers[i][j] = sum[i].color[j] / sum[i].count
          }
        }
      }
    }
    centers = this.sort(centers)
    const centers_rgb = []
    for (let i = 0; i < this.K + 1; i++) {
      centers_rgb.push(OriginalColor.lab2rgb(centers[i]))
    }
    return centers_rgb
  },

  sort (colors) {
    const l = colors.length
    for (let i = l - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (colors[j][0] > colors[j + 1][0]) {
          const tmp = colors[j]
          colors[j] = colors[j + 1]
          colors[j + 1] = tmp
        }
      }
    }
    return colors
  },

  colorTransform (colors1, colors2) {
    this.L1 = [0]
    this.L2 = [0]
    for (let i = 1; i < colors1.length; i++) {
      this.L1.push(colors1[i][0])
      this.L2.push(colors2[i][0])
    }
    this.L1.push(100)
    this.L2.push(100)
    const l = this.dataArray.length
    const out_array = this.img_copy.data

    const cs1 = []
    const cs2 = []
    let k = 0
    for (let i = 0; i < this.K + 1; i++) {
      if (colors2[i] !== false) {
        cs1.push(colors1[i])
        cs2.push(colors2[i])
        k++
      }
    }
    this.sigma = this.getSigma(colors1)
    this.lambda = this.getLambda(cs1)
    // console.log(this.lambda);

    for (let i = 0; i < l; i += this.channels) {
      const R = this.dataArray[i]
      const G = this.dataArray[i + 1]
      const B = this.dataArray[i + 2]
      const alpha = this.dataArray[i + 3]

      const Lab = OriginalColor.rgb2lab([R, G, B])
      let out_lab = [0, 0, 0]

      // TODO: our_lab=transform(cs1,cs2,L,a,b)

      const L = this.colorTransformSingleL(Lab[0])
      // console.log(L);
      for (let p = 0; p < k; p++) {
        let v = this.colorTransformSingleAB(
          [cs1[p][1], cs1[p][2]],
          [cs2[p][1], cs2[p][2]],
          Lab[0],
          Lab
        )
        v[0] = L
        const omega = this.omega(cs1, Lab, p)
        v = this.sca_mul(v, omega)
        out_lab = this.add(out_lab, v)
      }

      const out_rgb = OriginalColor.lab2rgb(out_lab)
      out_array[i] = out_rgb[0]
      out_array[i + 1] = out_rgb[1]
      out_array[i + 2] = out_rgb[2]
      out_array[i + 3] = alpha
    }
    return out_array
  },

  colorTransformSingleL (l) {
    let i
    for (i = 0; i < this.L1.length - 1; i++) {
      if (l >= this.L1[i] && l <= this.L1[i + 1]) {
        break
      }
    }
    const l1 = this.L1[i]
    const l2 = this.L1[i + 1]
    const s = l1 === l2 ? 1 : (l - l1) / (l2 - l1)
    const L1 = this.L2[i]
    const L2 = this.L2[i + 1]
    const L = (L2 - L1) * s + L1
    return L
  },

  colorTransformSingleAB (ab1, ab2, L, x) {
    const color1 = [L, ab1[0], ab1[1]]
    const color2 = [L, ab2[0], ab2[1]]
    if (this.distance2(color1, color2) < 0.0001) {
      return color1
    }
    const d = this.sub(color2, color1)
    const x0 = this.add(x, d)
    const Cb = OriginalColor.labIntersect(color1, color2)
    // x--->x0
    let xb
    if (OriginalColor.isOutLab(x0)) {
      xb = OriginalColor.labBoundary(color2, x0)
    } else {
      xb = OriginalColor.labIntersect(x, x0)
    }
    const dxx = this.distance2(xb, x)
    const dcc = this.distance2(Cb, color1)
    const l2 = Math.min(1, dxx / dcc)
    const xbn = this.normalize(this.sub(xb, x))
    const x_x = Math.sqrt(this.distance2(color1, color2) * l2)
    // console.log(x_x);
    return this.add(x, this.sca_mul(xbn, x_x))
  },

  omega (cs1, Lab, i) {
    let sum = 0
    for (let j = 0; j < cs1.length; j++) {
      sum +=
        this.lambda[j][i] * this.phi(Math.sqrt(this.distance2(cs1[j], Lab)))
    }
    return sum
  },

  getLambda (cs1) {
    const s = []
    const k = cs1.length
    for (let p = 0; p < k; p++) {
      const tmp = []
      for (let q = 0; q < k; q++) {
        tmp.push(this.phi(Math.sqrt(this.distance2(cs1[p], cs1[q]))))
      }
      s.push(tmp)
    }
    const lambda = math.inv(s)
    return lambda
  },

  phi (r) {
    return Math.exp((-r * r) / (2 * this.sigma * this.sigma))
  },
  getSigma (colors) {
    let sum = 0
    for (let i = 0; i < this.K + 1; i++) {
      for (let j = 0; j < this.K + 1; j++) {
        if (i === j) continue
        sum += Math.sqrt(this.distance2(colors[i], colors[j]))
      }
    }
    return sum / (this.K * (this.K + 1))
  },
  putImage (img) {
    this.ctx.putImageData(img, 0, 0)
  }
}

// eslint-disable-next-line no-unused-vars
const ReferralPalette = {
  init (img, ctx) {
    this.bins = {}
    this.bin_range = 16
    this.bin_size = 256 / this.bin_range
    this.channels = 4
    this.img = img
    this.img_copy = new ImageData(img.width, img.height)
    this.dataArray = img.data
    this.ctx = ctx
    this.K = 5

    for (let i = 0; i < this.bin_range; i++) {
      for (let j = 0; j < this.bin_range; j++) {
        for (let k = 0; k < this.bin_range; k++) {
          const tmp = {
            color: [
              (i + 0.5) * this.bin_size,
              (j + 0.5) * this.bin_size,
              (k + 0.5) * this.bin_size
            ],
            count: 0,
            idx: -1
          }
          tmp.Lab = ReferralColor.rgb2lab(tmp.color)
          this.bins['r' + i + 'g' + j + 'b' + k] = tmp
        }
      }
    }
  },
  palette () {
    const l = this.dataArray.length
    for (let i = 0; i < l; i += this.channels) {
      const R = this.dataArray[i]
      const G = this.dataArray[i + 1]
      const B = this.dataArray[i + 2]
      const ri = Math.floor(R / this.bin_size)
      const gi = Math.floor(G / this.bin_size)
      const bi = Math.floor(B / this.bin_size)
      this.bins['r' + ri + 'g' + gi + 'b' + bi].count++
    }
  },

  distance2 (c1, c2) {
    let res = 0
    for (let i = 0; i < c1.length; i++) {
      res += (c1[i] - c2[i]) * (c1[i] - c2[i])
    }
    return res
  },

  normalize (v) {
    const d = Math.sqrt(this.distance2(v, [0, 0, 0]))
    const res = []
    for (let i = 0; i < v.length; i++) {
      res.push(v[i] / d)
    }
    return res
  },

  add (c1, c2) {
    const res = []
    for (let i = 0; i < c1.length; i++) {
      res.push(c1[i] + c2[i])
    }
    return res
  },

  sub (c1, c2) {
    const res = []
    for (let i = 0; i < c1.length; i++) {
      res.push(c1[i] - c2[i])
    }
    return res
  },

  sca_mul (c, k) {
    const res = []
    for (let i = 0; i < c.length; i++) {
      res.push(c[i] * k)
    }
    return res
  },
  kmeansFirst () {
    const centers = [] // rgb format
    const centers_lab = []
    centers.push([this.bin_size / 2, this.bin_size / 2, this.bin_size / 2]) // black
    centers_lab.push(ReferralColor.rgb2lab(centers[0]))
    const bins_copy = {}
    for (const i in this.bins) {
      bins_copy[i] = this.bins[i].count
    }

    for (let p = 0; p < this.K; p++) {
      let tmp
      let maxc = -1
      for (const i in bins_copy) {
        const d2 = this.distance2(this.bins[i].Lab, centers_lab[p])
        const factor = 1 - Math.exp(-d2 / 6400) // sigma_a:80
        bins_copy[i] *= factor
        if (bins_copy[i] > maxc) {
          maxc = bins_copy[i]
          tmp = []
          for (let j = 0; j < 3; j++) {
            tmp.push(this.bins[i].color[j])
          }
        }
      }
      centers.push(tmp)
      centers_lab.push(ReferralColor.rgb2lab(tmp))
    }
    return centers_lab
  },
  kmeans () {
    let centers = this.kmeansFirst() // lab
    let no_change = false
    while (!no_change) {
      no_change = true
      const sum = []
      for (let i = 0; i < this.K + 1; i++) {
        sum.push({
          color: [0, 0, 0],
          count: 0
        })
      }
      for (let i = 0; i < this.bin_range; i++) {
        for (let j = 0; j < this.bin_range; j++) {
          for (let k = 0; k < this.bin_range; k++) {
            const tmp = this.bins['r' + i + 'g' + j + 'b' + k]
            if (tmp.count === 0) {
              continue
            }

            const lab = tmp.Lab
            let mind = Infinity
            let mini = -1
            for (let p = 0; p < this.K + 1; p++) {
              const d = this.distance2(centers[p], lab)
              if (mind > d) {
                mind = d
                mini = p
              }
            }
            if (mini !== tmp.idx) {
              tmp.idx = mini
              no_change = false
            }
            const m = this.sca_mul(tmp.Lab, tmp.count)
            sum[mini].color = this.add(sum[mini].color, m)
            sum[mini].count += tmp.count
          }
        }
      }

      for (let i = 1; i < this.K + 1; i++) {
        if (sum[i].count) {
          for (let j = 0; j < 3; j++) {
            centers[i][j] = sum[i].color[j] / sum[i].count
          }
        }
      }
    }
    centers = this.sort(centers)
    const centers_rgb = []
    for (let i = 0; i < this.K + 1; i++) {
      centers_rgb.push(ReferralColor.lab2rgb(centers[i]))
    }
    return centers_rgb
  },

  sort (colors) {
    const l = colors.length
    for (let i = l - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (colors[j][0] > colors[j + 1][0]) {
          const tmp = colors[j]
          colors[j] = colors[j + 1]
          colors[j + 1] = tmp
        }
      }
    }
    return colors
  },

  colorTransform (colors1, colors2) {
    this.L1 = [0]
    this.L2 = [0]
    for (let i = 1; i < colors1.length; i++) {
      this.L1.push(colors1[i][0])
      this.L2.push(colors2[i][0])
    }
    this.L1.push(100)
    this.L2.push(100)
    const l = this.dataArray.length
    const out_array = this.img_copy.data

    const cs1 = []
    const cs2 = []
    let k = 0
    for (let i = 0; i < this.K + 1; i++) {
      if (colors2[i] !== false) {
        cs1.push(colors1[i])
        cs2.push(colors2[i])
        k++
      }
    }
    this.sigma = this.getSigma(colors1)
    this.lambda = this.getLambda(cs1)
    // console.log(this.lambda);

    for (let i = 0; i < l; i += this.channels) {
      const R = this.dataArray[i]
      const G = this.dataArray[i + 1]
      const B = this.dataArray[i + 2]
      const alpha = this.dataArray[i + 3]

      const Lab = ReferralColor.rgb2lab([R, G, B])
      let out_lab = [0, 0, 0]

      // TODO: our_lab=transform(cs1,cs2,L,a,b)

      const L = this.colorTransformSingleL(Lab[0])
      // console.log(L);
      for (let p = 0; p < k; p++) {
        let v = this.colorTransformSingleAB(
          [cs1[p][1], cs1[p][2]],
          [cs2[p][1], cs2[p][2]],
          Lab[0],
          Lab
        )
        v[0] = L
        const omega = this.omega(cs1, Lab, p)
        v = this.sca_mul(v, omega)
        out_lab = this.add(out_lab, v)
      }

      const out_rgb = ReferralColor.lab2rgb(out_lab)
      out_array[i] = out_rgb[0]
      out_array[i + 1] = out_rgb[1]
      out_array[i + 2] = out_rgb[2]
      out_array[i + 3] = alpha
    }
    return out_array
  },

  colorTransformSingleL (l) {
    let i
    for (i = 0; i < this.L1.length - 1; i++) {
      if (l >= this.L1[i] && l <= this.L1[i + 1]) {
        break
      }
    }
    const l1 = this.L1[i]
    const l2 = this.L1[i + 1]
    const s = l1 === l2 ? 1 : (l - l1) / (l2 - l1)
    const L1 = this.L2[i]
    const L2 = this.L2[i + 1]
    const L = (L2 - L1) * s + L1
    return L
  },

  colorTransformSingleAB (ab1, ab2, L, x) {
    const color1 = [L, ab1[0], ab1[1]]
    const color2 = [L, ab2[0], ab2[1]]
    if (this.distance2(color1, color2) < 0.0001) {
      return color1
    }
    const d = this.sub(color2, color1)
    const x0 = this.add(x, d)
    const Cb = ReferralColor.labIntersect(color1, color2)
    // x--->x0
    let xb
    if (ReferralColor.isOutLab(x0)) {
      xb = ReferralColor.labBoundary(color2, x0)
    } else {
      xb = ReferralColor.labIntersect(x, x0)
    }
    const dxx = this.distance2(xb, x)
    const dcc = this.distance2(Cb, color1)
    const l2 = Math.min(1, dxx / dcc)
    const xbn = this.normalize(this.sub(xb, x))
    const x_x = Math.sqrt(this.distance2(color1, color2) * l2)
    // console.log(x_x);
    return this.add(x, this.sca_mul(xbn, x_x))
  },

  omega (cs1, Lab, i) {
    let sum = 0
    for (let j = 0; j < cs1.length; j++) {
      sum +=
        this.lambda[j][i] * this.phi(Math.sqrt(this.distance2(cs1[j], Lab)))
    }
    return sum
  },

  getLambda (cs1) {
    const s = []
    const k = cs1.length
    for (let p = 0; p < k; p++) {
      const tmp = []
      for (let q = 0; q < k; q++) {
        tmp.push(this.phi(Math.sqrt(this.distance2(cs1[p], cs1[q]))))
      }
      s.push(tmp)
    }
    const lambda = math.inv(s)
    return lambda
  },

  phi (r) {
    return Math.exp((-r * r) / (2 * this.sigma * this.sigma))
  },
  getSigma (colors) {
    let sum = 0
    for (let i = 0; i < this.K + 1; i++) {
      for (let j = 0; j < this.K + 1; j++) {
        if (i === j) continue
        sum += Math.sqrt(this.distance2(colors[i], colors[j]))
      }
    }
    return sum / (this.K * (this.K + 1))
  },
  putImage (img) {
    this.ctx.putImageData(img, 0, 0)
  }
}
