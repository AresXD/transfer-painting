let canv, file, ctx
let img_raw, width, height
$(document).ready(function () {
  $('.materialboxed').materialbox()
  $('.modal-trigger').leanModal()
  $('.load-card .card-header').hide()
  $('.load-card').css({
    cssText: 'background-color: transparent; box-shadow: none;'
  })
  $('.load-card input').css({
    cssText: 'background-color: rgba(255, 255, 255, 0.5) !important;'
  })
  $('.load-card .btn').css({
    cssText:
      'background-color: rgba(255, 255, 255, 0.5) !important; color: #ffffff !important; border: none !important;'
  })
  $('.image-card').hide()
  $('nav').hide()
  $('footer').css('color', '#ffffff')
})

function uploadFile(e) {
  const file = e.target.files[0]
  const filename = file.name
  const reader = new FileReader()
  reader.onload = putImage2Canvas
  reader.readAsDataURL(file)
  $('html').css('background', '#f6f6f6')
  $('.load-card').css({
    cssText: ''
  })
  $('.load-card input').css({
    cssText: ''
  })
  $('.load-card .btn').css({
    cssText: ''
  })
  $('.load-card .card-header').show()
  $('nav').show()
  $('footer').css('color', '#8590a6')
  $('.big-logo').hide()
  $('.image-card').show()
  $('nav').show()
  $('.main-bg').hide()
}

function putImage2Canvas(event) {
  const img = new Image()
  img.src = event.target.result
  img.onload = function () {
    window.color_list_rgb = []
    window.color_list1 = []
    window.color_list2 = []
    window.change_list = [false, false, false, false, false]
    window.Ls = []
    window.Ls_user = []

    const canv = $('#source_image')[0]
    width = canv.width = img.width
    height = canv.height = img.height
    ctx = canv.getContext('2d')
    ctx.drawImage(img, 0, 0)
    img_raw = ctx.getImageData(0, 0, img.width, img.height)

    Palette.init(img_raw, ctx)
    Palette.palette(img_raw.data)
    const colors = Palette.kmeans()
    addPalette(colors)
    $('#palette_e').hide()
    $('#confirm_change').hide()
    $('.source_image_area').fadeIn(1000)
  }
}

function addPalette(colors) {
  let tmp = ''
  let tmp_e = ''
  let modals = ''
  color_list_rgb = colors
  color_list1 = []
  color_list2 = []
  for (let i = 0; i < colors.length; i++) {
    const Lab = Color.rgb2lab(colors[i])
    color_list1.push(Lab)
    color_list2.push(Color.rgb2lab(colors[i]))
    window.Ls.push(Lab[0])
    window.Ls_user.push(Lab[0])
  }
  color_list2[0] = false
  for (let i = 1; i < colors.length; i++) {
    tmp +=
      '\
  <div class="col s1_5' +
      (i === 1 ? ' offset-s2 offset-m2 offset-l2' : ' ') +
      ' center-align">\
    <a class="plt' +
      i +
      ' z-depth-1 btn-thin btn waves-effect waves-light hide-on-med-and-up"></a>\
    <a class="plt' +
      i +
      ' z-depth-1 btn-floating btn waves-effect waves-light hide-on-small-only hide-on-large-only"></a>\
    <a class="plt' +
      i +
      ' z-depth-1 btn-floating btn-large waves-effect waves-light hide-on-med-and-down"></a>\
  </div>'
    tmp_e +=
      '\
  <div class="col s1_5' +
      (i === 1 ? ' offset-s2 offset-m2 offset-l2' : ' ') +
      ' center-align">\
    <a class="plt' +
      i +
      '_e z-depth-1 btn-thin btn waves-effect waves-light hide-on-med-and-up"></a>\
    <a class="plt' +
      i +
      '_e z-depth-1 btn-floating btn waves-effect waves-light hide-on-small-only hide-on-large-only"></a>\
    <a class="plt' +
      i +
      '_e z-depth-1 btn-floating btn-large waves-effect waves-light hide-on-med-and-down"></a>\
    <div class="plt' +
      i +
      '_p" style="width:1px;height:1px;"></div>\
  </div>'
    modals +=
      '\
  <div id="modal' +
      i +
      '" class="modal modal-fixed-footer">\
    <div class="modal-content">\
      <div class="modal-title"><h4><i class="fas fa-palette"></i> 调整颜色</h4></div>\
      <div class="row">\
        <div class="input-field col s6">\
          <input id="modal' +
      i +
      '_ori_txt" type="text" class="validate">\
          <label class="active" for="modal' +
      i +
      '_ori_txt"><i class="fas fa-play"></i> 原始颜色</label>\
        </div>\
        <div class="col s3 modal-color z-depth-1 btn-thin btn waves-effect waves-light" id="modal' +
      i +
      '_ori">\
        </div>\
      </div>\
      <div class="row">\
        <div class="input-field col s6">\
          <input id="modal' +
      i +
      '_dst_txt" type="text" class="validate">\
          <label class="active" for="modal' +
      i +
      '_dst_txt"><i class="fas fa-forward"></i> 目标颜色</label>\
        </div>\
        <div class="col s3 modal-color z-depth-1 btn-thin btn waves-effect waves-light" id="modal' +
      i +
      '_dst" style="display:none;">\
        </div>\
      </div>\
      <div class="row">\
        <form action="#" class="col s6">\
          <p class="range-field color-set-range">\
            <span class="color-tip" style="border-left: 2.5px solid red; padding-left: 10px;">红</span>\
            <input type="range" id="range' +
      i +
      '_r" min="0" max="255" onmousemove="changeColor(' +
      i +
      ');" ontouchmove="changeColor(' +
      i +
      ');"/>\
          </p>\
          <p class="range-field color-set-range">\
            <span class="color-tip" style="border-left: 2.5px solid green; padding-left: 10px;">绿</span>\
            <input type="range" id="range' +
      i +
      '_g" min="0" max="255" onmousemove="changeColor(' +
      i +
      ');" ontouchmove="changeColor(' +
      i +
      ');"/>\
          </p>\
          <p class="range-field color-set-range">\
            <span class="color-tip" style="border-left: 2.5px solid blue; padding-left: 10px;">蓝</span>\
            <input type="range" id="range' +
      i +
      '_b" min="0" max="255" onmousemove="changeColor(' +
      i +
      ');" ontouchmove="changeColor(' +
      i +
      ');"/>\
          </p>\
        </form>\
      </div>\
    </div>\
    <div class="modal-footer">\
    <a class="modal-action modal-close waves-effect waves-green btn-flat" onclick="confirmChange(' +
      i +
      ');">确认</a>\
    <a class="modal-action modal-close waves-effect waves-green btn-flat">取消</a>\
    </div>\
  </div>'
  }

  $('#palette').html(tmp)
  $('#palette_e').html(tmp_e)
  $('#modals').html(modals)

  for (let i = 1; i < colors.length; i++) {
    const c = colors[i]
    const color = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'
    setTimeout(
      (function (j, cl, rgb) {
        return function () {
          $('.plt' + j).attr('style', 'background-color:' + cl + '!important')
          $('.plt' + j + ',.plt' + j + '_e').click(
            (function (k, co, RGB) {
              return function () {
                $('#modal' + j + '_ori,#modal' + j + '_dst').attr(
                  'style',
                  'background-color:' + co + '!important'
                )
                $('#modal' + j + '_ori_txt').val(co)
                $('#range' + j + '_r').val(RGB[0])
                $('#range' + j + '_g').val(RGB[1])
                $('#range' + j + '_b').val(RGB[2])
                $('#modal' + j).openModal()
                changeColor(j)
              }
            })(j, cl, rgb)
          )
        }
      })(i, color, c),
      600 * (0.5 + i)
    )
  }
  setTimeout(function () {
    $('#palette').append(
      '<div id="helper" class="col s12 center-align" style="display:none;"><h5><i class="fas fa-arrow-up"></i> 请点击调色盘以重新着色！</h5></div>'
    )
    $('#helper').fadeIn(1000)
  }, 2200)
}

function changeColor(id) {
  const r = $('#range' + id + '_r').val()
  const g = $('#range' + id + '_g').val()
  const b = $('#range' + id + '_b').val()
  const color = 'rgb(' + r + ',' + g + ',' + b + ')'
  $('#modal' + id + '_dst').attr(
    'style',
    'background-color:' + color + '!important'
  )
  $('#modal' + id + '_dst_txt').val(color)
  $('#modal' + id + '_dst').show()
}

function confirmChange(id) {
  const R = $('#range' + id + '_r').val()
  const G = $('#range' + id + '_g').val()
  const B = $('#range' + id + '_b').val()
  const color = 'rgb(' + R + ',' + G + ',' + B + ')'

  const show = true

  const Lab = Color.rgb2lab([R, G, B])
  Ls_user[id] = Lab[0]
  for (let i = 1; i < Ls.length; i++) {
    Ls[i] = Ls_user[i]
    color_list2[i][0] = Ls[i]
  }
  color_list2[id] = Lab
  for (let i = 1; i < Ls.length; i++) {
    if (i < id) {
      if (Ls[i] > Ls[i + 1]) {
        Ls[i] = Ls[i + 1]
        color_list2[i][0] = Ls[i + 1]
      }
    }
    if (i > id) {
      if (Ls[i] < Ls[i - 1]) {
        Ls[i] = Ls[i - 1]
        color_list2[i][0] = Ls[i - 1]
      }
    }
  }

  change_list[id - 1] = color

  if (show) {
    $('#palette_e').show()
    $('#helper').hide()
    $('#confirm_change').show()
    for (let i = 0; i < change_list.length; i++) {
      // let t = color_list_rgb[i + 1];
      // let color1_txt = 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')';
      // let color2_txt = (change_list[i] == false ? color1_txt : change_list[i])
      const idx = i + 1
      const RGB = Color.lab2rgb(color_list2[idx])
      const color2_txt = 'rgb(' + RGB[0] + ',' + RGB[1] + ',' + RGB[2] + ')'
      $('.plt' + idx + '_e').show()
      $('.plt' + idx + '_p').hide()
      $('.plt' + idx + '_e').attr(
        'style',
        'background-color:' + color2_txt + '!important'
      )
    }
  } else {
    $('#palette_e').hide()
    $('#helper').show()
    $('#confirm_change').hide()
  }
}

$('#file_path')[0].onchange = uploadFile
