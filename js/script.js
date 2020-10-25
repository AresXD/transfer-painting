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
  $('.original-image-card').hide()
  $('.referral-image-card').hide()
  $('nav').hide()
  $('footer').css('color', '#ffffff')
})

function uploadOriginalFile (e) {
  const file = e.target.files[0]
  const filename = file.name
  const reader = new FileReader()
  reader.onload = putOriginalImageToCanvas
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
  $('.original-image-card').show()
  $('nav').show()
  $('.main-bg').hide()
}

function uploadReferralFile (e) {
  const file = e.target.files[0]
  const filename = file.name
  const reader = new FileReader()
  reader.onload = putReferralImageToCanvas
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
  $('.referral-image-card').show()
  $('nav').show()
  $('.main-bg').hide()
}

function putOriginalImageToCanvas (event) {
  const img = new Image()
  img.src = event.target.result
  img.onload = function () {
    window.original_color_list_rgb = []
    window.original_color_list1 = []
    window.original_color_list2 = []
    window.original_change_list = [false, false, false, false, false]
    window.original_Ls = []
    window.original_Ls_user = []

    const canv = $('#source_original_image')[0]
    width = canv.width = img.width
    height = canv.height = img.height
    ctx = canv.getContext('2d')
    ctx.drawImage(img, 0, 0)
    img_raw = ctx.getImageData(0, 0, img.width, img.height)

    OriginalPalette.init(img_raw, ctx)
    OriginalPalette.palette(img_raw.data)
    const colors = OriginalPalette.kmeans()
    addOriginalPalette(colors)
    $('#original_palette_e').hide()
    $('#original_confirm_change').hide()
    $('.source_original_image_area').fadeIn(1000)
  }
}

function putReferralImageToCanvas (event) {
  const img = new Image()
  img.src = event.target.result
  img.onload = function () {
    window.referral_color_list_rgb = []
    window.referral_color_list1 = []
    window.referral_color_list2 = []
    window.referral_change_list = [false, false, false, false, false]
    window.referral_Ls = []
    window.referral_Ls_user = []

    const canv = $('#source_referral_image')[0]
    width = canv.width = img.width
    height = canv.height = img.height
    ctx = canv.getContext('2d')
    ctx.drawImage(img, 0, 0)
    img_raw = ctx.getImageData(0, 0, img.width, img.height)

    ReferralPalette.init(img_raw, ctx)
    ReferralPalette.palette(img_raw.data)
    const colors = ReferralPalette.kmeans()
    addReferralPalette(colors)
    $('#referral_palette_e').hide()
    $('#referral_confirm_change').hide()
    $('.source_referral_image_area').fadeIn(1000)
  }
}

function addOriginalPalette (colors) {
  let tmp = ''
  let tmp_e = ''
  let modals = ''
  original_color_list_rgb = colors
  original_color_list1 = []
  original_color_list2 = []
  for (let i = 0; i < colors.length; i++) {
    const Lab = OriginalColor.rgb2lab(colors[i])
    original_color_list1.push(Lab)
    original_color_list2.push(OriginalColor.rgb2lab(colors[i]))
    window.original_Ls.push(Lab[0])
    window.original_Ls_user.push(Lab[0])
  }
  original_color_list2[0] = false
  for (let i = 1; i < colors.length; i++) {
    tmp +=
      '\
  <div class="col s1_5' +
      (i === 1 ? ' offset-s2 offset-m2 offset-l2' : ' ') +
      ' center-align">\
    <a class="original_plt' +
      i +
      ' z-depth-1 btn-thin btn waves-effect waves-light hide-on-med-and-up"></a>\
    <a class="original_plt' +
      i +
      ' z-depth-1 btn-floating btn waves-effect waves-light hide-on-small-only hide-on-large-only"></a>\
    <a class="original_plt' +
      i +
      ' z-depth-1 btn-floating btn-large waves-effect waves-light hide-on-med-and-down"></a>\
  </div>'
    tmp_e +=
      '\
  <div class="col s1_5' +
      (i === 1 ? ' offset-s2 offset-m2 offset-l2' : ' ') +
      ' center-align">\
    <a class="original_plt' +
      i +
      '_e z-depth-1 btn-thin btn waves-effect waves-light hide-on-med-and-up"></a>\
    <a class="original_plt' +
      i +
      '_e z-depth-1 btn-floating btn waves-effect waves-light hide-on-small-only hide-on-large-only"></a>\
    <a class="original_plt' +
      i +
      '_e z-depth-1 btn-floating btn-large waves-effect waves-light hide-on-med-and-down"></a>\
    <div class="original_plt' +
      i +
      '_p" style="width:1px;height:1px;"></div>\
  </div>'
    modals +=
      '\
  <div id="original_modal' +
      i +
      '" class="modal modal-fixed-footer">\
    <div class="modal-content">\
      <div class="modal-title"><h4><i class="fas fa-palette"></i> 调整颜色</h4></div>\
      <div class="row">\
        <div class="input-field col s6">\
          <input id="original_modal' +
      i +
      '_ori_txt" type="text" class="validate">\
          <label class="active" for="original_modal' +
      i +
      '_ori_txt"><i class="fas fa-play"></i> 原始颜色</label>\
        </div>\
        <div class="col s3 modal-color z-depth-1 btn-thin btn waves-effect waves-light" id="original_modal' +
      i +
      '_ori">\
        </div>\
      </div>\
      <div class="row">\
        <div class="input-field col s6">\
          <input id="original_modal' +
      i +
      '_dst_txt" type="text" class="validate">\
          <label class="active" for="original_modal' +
      i +
      '_dst_txt"><i class="fas fa-forward"></i> 目标颜色</label>\
        </div>\
        <div class="col s3 modal-color z-depth-1 btn-thin btn waves-effect waves-light" id="original_modal' +
      i +
      '_dst" style="display:none;">\
        </div>\
      </div>\
      <div class="row">\
        <form action="#" class="col s6">\
          <p class="range-field color-set-range">\
            <span class="color-tip" style="border-left: 2.5px solid red; padding-left: 10px;">红</span>\
            <input type="range" id="original_range' +
      i +
      '_r" min="0" max="255" onmousemove="changeOriginalColor(' +
      i +
      ');" ontouchmove="changeOriginalColor(' +
      i +
      ');"/>\
          </p>\
          <p class="range-field color-set-range">\
            <span class="color-tip" style="border-left: 2.5px solid green; padding-left: 10px;">绿</span>\
            <input type="range" id="original_range' +
      i +
      '_g" min="0" max="255" onmousemove="changeOriginalColor(' +
      i +
      ');" ontouchmove="changeOriginalColor(' +
      i +
      ');"/>\
          </p>\
          <p class="range-field color-set-range">\
            <span class="color-tip" style="border-left: 2.5px solid blue; padding-left: 10px;">蓝</span>\
            <input type="range" id="original_range' +
      i +
      '_b" min="0" max="255" onmousemove="changeOriginalColor(' +
      i +
      ');" ontouchmove="changeOriginalColor(' +
      i +
      ');"/>\
          </p>\
        </form>\
      </div>\
    </div>\
    <div class="modal-footer">\
    <a class="modal-action modal-close waves-effect waves-green btn-flat" onclick="confirmOriginalChange(' +
      i +
      ');">确认</a>\
    <a class="modal-action modal-close waves-effect waves-green btn-flat">取消</a>\
    </div>\
  </div>'
  }

  $('#original_palette').html(tmp)
  $('#original_palette_e').html(tmp_e)
  $('#original_modals').html(modals)

  for (let i = 1; i < colors.length; i++) {
    const c = colors[i]
    const color = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'
    setTimeout(
      (function (j, cl, rgb) {
        return function () {
          $('.original_plt' + j).attr('style', 'background-color:' + cl + '!important')
          $('.original_plt' + j + ',.original_plt' + j + '_e').click(
            (function (k, co, RGB) {
              return function () {
                $('#original_modal' + j + '_ori,#original_modal' + j + '_dst').attr(
                  'style',
                  'background-color:' + co + '!important'
                )
                $('#original_modal' + j + '_ori_txt').val(co)
                $('#original_range' + j + '_r').val(RGB[0])
                $('#original_range' + j + '_g').val(RGB[1])
                $('#original_range' + j + '_b').val(RGB[2])
                $('#original_modal' + j).openModal()
                changeOriginalColor(j)
              }
            })(j, cl, rgb)
          )
        }
      })(i, color, c),
      600 * (0.5 + i)
    )
  }
  setTimeout(function () {
    $('#original_palette').append(
      '<div id="original_helper" class="col s12 center-align" style="display:none;"><h5><i class="fas fa-arrow-up"></i> 请点击调色盘以重新着色！</h5></div>'
    )
    $('#original_helper').fadeIn(1000)
  }, 2200)
}

function addReferralPalette (colors) {
  let tmp = ''
  let tmp_e = ''
  let modals = ''
  referral_color_list_rgb = colors
  referral_color_list1 = []
  referral_color_list2 = []
  for (let i = 0; i < colors.length; i++) {
    const Lab = ReferralColor.rgb2lab(colors[i])
    referral_color_list1.push(Lab)
    referral_color_list2.push(ReferralColor.rgb2lab(colors[i]))
    window.referral_Ls.push(Lab[0])
    window.referral_Ls_user.push(Lab[0])
  }
  referral_color_list2[0] = false
  for (let i = 1; i < colors.length; i++) {
    tmp +=
      '\
  <div class="col s1_5' +
      (i === 1 ? ' offset-s2 offset-m2 offset-l2' : ' ') +
      ' center-align">\
    <a class="referral_plt' +
      i +
      ' z-depth-1 btn-thin btn waves-effect waves-light hide-on-med-and-up"></a>\
    <a class="referral_plt' +
      i +
      ' z-depth-1 btn-floating btn waves-effect waves-light hide-on-small-only hide-on-large-only"></a>\
    <a class="referral_plt' +
      i +
      ' z-depth-1 btn-floating btn-large waves-effect waves-light hide-on-med-and-down"></a>\
  </div>'
    tmp_e +=
      '\
  <div class="col s1_5' +
      (i === 1 ? ' offset-s2 offset-m2 offset-l2' : ' ') +
      ' center-align">\
    <a class="referral_plt' +
      i +
      '_e z-depth-1 btn-thin btn waves-effect waves-light hide-on-med-and-up"></a>\
    <a class="referral_plt' +
      i +
      '_e z-depth-1 btn-floating btn waves-effect waves-light hide-on-small-only hide-on-large-only"></a>\
    <a class="referral_plt' +
      i +
      '_e z-depth-1 btn-floating btn-large waves-effect waves-light hide-on-med-and-down"></a>\
    <div class="referral_plt' +
      i +
      '_p" style="width:1px;height:1px;"></div>\
  </div>'
    modals +=
      '\
  <div id="referral_modal' +
      i +
      '" class="modal modal-fixed-footer">\
    <div class="modal-content">\
      <div class="modal-title"><h4><i class="fas fa-palette"></i> 调整颜色</h4></div>\
      <div class="row">\
        <div class="input-field col s6">\
          <input id="referral_modal' +
      i +
      '_ori_txt" type="text" class="validate">\
          <label class="active" for="referral_modal' +
      i +
      '_ori_txt"><i class="fas fa-play"></i> 原始颜色</label>\
        </div>\
        <div class="col s3 modal-color z-depth-1 btn-thin btn waves-effect waves-light" id="referral_modal' +
      i +
      '_ori">\
        </div>\
      </div>\
      <div class="row">\
        <div class="input-field col s6">\
          <input id="referral_modal' +
      i +
      '_dst_txt" type="text" class="validate">\
          <label class="active" for="referral_modal' +
      i +
      '_dst_txt"><i class="fas fa-forward"></i> 目标颜色</label>\
        </div>\
        <div class="col s3 modal-color z-depth-1 btn-thin btn waves-effect waves-light" id="referral_modal' +
      i +
      '_dst" style="display:none;">\
        </div>\
      </div>\
      <div class="row">\
        <form action="#" class="col s6">\
          <p class="range-field color-set-range">\
            <span class="color-tip" style="border-left: 2.5px solid red; padding-left: 10px;">红</span>\
            <input type="range" id="referral_range' +
      i +
      '_r" min="0" max="255" onmousemove="changeReferralColor(' +
      i +
      ');" ontouchmove="changeReferralColor(' +
      i +
      ');"/>\
          </p>\
          <p class="range-field color-set-range">\
            <span class="color-tip" style="border-left: 2.5px solid green; padding-left: 10px;">绿</span>\
            <input type="range" id="referral_range' +
      i +
      '_g" min="0" max="255" onmousemove="changeReferralColor(' +
      i +
      ');" ontouchmove="changeReferralColor(' +
      i +
      ');"/>\
          </p>\
          <p class="range-field color-set-range">\
            <span class="color-tip" style="border-left: 2.5px solid blue; padding-left: 10px;">蓝</span>\
            <input type="range" id="referral_range' +
      i +
      '_b" min="0" max="255" onmousemove="changeReferralColor(' +
      i +
      ');" ontouchmove="changeReferralColor(' +
      i +
      ');"/>\
          </p>\
        </form>\
      </div>\
    </div>\
    <div class="modal-footer">\
    <a class="modal-action modal-close waves-effect waves-green btn-flat" onclick="confirmReferralChange(' +
      i +
      ');">确认</a>\
    <a class="modal-action modal-close waves-effect waves-green btn-flat">取消</a>\
    </div>\
  </div>'
  }

  $('#referral_palette').html(tmp)
  $('#referral_palette_e').html(tmp_e)
  $('#referral_modals').html(modals)

  for (let i = 1; i < colors.length; i++) {
    const c = colors[i]
    const color = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'
    setTimeout(
      (function (j, cl, rgb) {
        return function () {
          $('.referral_plt' + j).attr('style', 'background-color:' + cl + '!important')
          $('.referral_plt' + j + ',.referral_plt' + j + '_e').click(
            (function (k, co, RGB) {
              return function () {
                $('#referral_modal' + j + '_ori,#referral_modal' + j + '_dst').attr(
                  'style',
                  'background-color:' + co + '!important'
                )
                $('#referral_modal' + j + '_ori_txt').val(co)
                $('#referral_range' + j + '_r').val(RGB[0])
                $('#referral_range' + j + '_g').val(RGB[1])
                $('#referral_range' + j + '_b').val(RGB[2])
                $('#referral_modal' + j).openModal()
                changeReferralColor(j)
              }
            })(j, cl, rgb)
          )
        }
      })(i, color, c),
      600 * (0.5 + i)
    )
  }
  setTimeout(function () {
    $('#referral_palette').append(
      '<div id="referral_helper" class="col s12 center-align" style="display:none;"><h5><i class="fas fa-arrow-up"></i> 请点击调色盘以重新着色！</h5></div>'
    )
    $('#referral_helper').fadeIn(1000)
  }, 2200)
}

function changeOriginalColor (id) {
  const r = $('#original_range' + id + '_r').val()
  const g = $('#original_range' + id + '_g').val()
  const b = $('#original_range' + id + '_b').val()
  const color = 'rgb(' + r + ',' + g + ',' + b + ')'
  $('#original_modal' + id + '_dst').attr(
    'style',
    'background-color:' + color + '!important'
  )
  $('#original_modal' + id + '_dst_txt').val(color)
  $('#original_modal' + id + '_dst').show()
}

function changeReferralColor (id) {
  const r = $('#referral_range' + id + '_r').val()
  const g = $('#referral_range' + id + '_g').val()
  const b = $('#referral_range' + id + '_b').val()
  const color = 'rgb(' + r + ',' + g + ',' + b + ')'
  $('#referral_modal' + id + '_dst').attr(
    'style',
    'background-color:' + color + '!important'
  )
  $('#referral_modal' + id + '_dst_txt').val(color)
  $('#referral_modal' + id + '_dst').show()
}

function confirmOriginalChange (id) {
  const R = $('#original_range' + id + '_r').val()
  const G = $('#original_range' + id + '_g').val()
  const B = $('#original_range' + id + '_b').val()
  const color = 'rgb(' + R + ',' + G + ',' + B + ')'

  const show = true

  const Lab = OriginalColor.rgb2lab([R, G, B])
  original_Ls_user[id] = Lab[0]
  for (let i = 1; i < original_Ls.length; i++) {
    original_Ls[i] = original_Ls_user[i]
    original_color_list2[i][0] = original_Ls[i]
  }
  original_color_list2[id] = Lab
  for (let i = 1; i < original_Ls.length; i++) {
    if (i < id) {
      if (original_Ls[i] > original_Ls[i + 1]) {
        original_Ls[i] = original_Ls[i + 1]
        original_color_list2[i][0] = original_Ls[i + 1]
      }
    }
    if (i > id) {
      if (original_Ls[i] < original_Ls[i - 1]) {
        original_Ls[i] = original_Ls[i - 1]
        original_color_list2[i][0] = original_Ls[i - 1]
      }
    }
  }

  original_change_list[id - 1] = color

  if (show) {
    $('#original_palette_e').show()
    $('#original_helper').hide()
    $('#original_confirm_change').show()
    for (let i = 0; i < original_change_list.length; i++) {
      // let t = color_list_rgb[i + 1];
      // let color1_txt = 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')';
      // let color2_txt = (change_list[i] == false ? color1_txt : change_list[i])
      const idx = i + 1
      const RGB = OriginalColor.lab2rgb(original_color_list2[idx])
      const color2_txt = 'rgb(' + RGB[0] + ',' + RGB[1] + ',' + RGB[2] + ')'
      $('.original_plt' + idx + '_e').show()
      $('.original_plt' + idx + '_p').hide()
      $('.original_plt' + idx + '_e').attr(
        'style',
        'background-color:' + color2_txt + '!important'
      )
    }
  } else {
    $('#original_palette_e').hide()
    $('#original_helper').show()
    $('#original_confirm_change').hide()
  }
}

function confirmReferralChange (id) {
  const R = $('#referral_range' + id + '_r').val()
  const G = $('#referral_range' + id + '_g').val()
  const B = $('#referral_range' + id + '_b').val()
  const color = 'rgb(' + R + ',' + G + ',' + B + ')'

  const show = true

  const Lab = ReferralColor.rgb2lab([R, G, B])
  referral_Ls_user[id] = Lab[0]
  for (let i = 1; i < referral_Ls.length; i++) {
    referral_Ls[i] = referral_Ls_user[i]
    referral_color_list2[i][0] = referral_Ls[i]
  }
  referral_color_list2[id] = Lab
  for (let i = 1; i < referral_Ls.length; i++) {
    if (i < id) {
      if (referral_Ls[i] > referral_Ls[i + 1]) {
        referral_Ls[i] = referral_Ls[i + 1]
        referral_color_list2[i][0] = referral_Ls[i + 1]
      }
    }
    if (i > id) {
      if (referral_Ls[i] < referral_Ls[i - 1]) {
        referral_Ls[i] = referral_Ls[i - 1]
        referral_color_list2[i][0] = referral_Ls[i - 1]
      }
    }
  }

  referral_change_list[id - 1] = color

  if (show) {
    $('#referral_palette_e').show()
    $('#referral_helper').hide()
    $('#referral_confirm_change').show()
    for (let i = 0; i < referral_change_list.length; i++) {
      // let t = color_list_rgb[i + 1];
      // let color1_txt = 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')';
      // let color2_txt = (change_list[i] == false ? color1_txt : change_list[i])
      const idx = i + 1
      const RGB = ReferralColor.lab2rgb(referral_color_list2[idx])
      const color2_txt = 'rgb(' + RGB[0] + ',' + RGB[1] + ',' + RGB[2] + ')'
      $('.referral_plt' + idx + '_e').show()
      $('.referral_plt' + idx + '_p').hide()
      $('.referral_plt' + idx + '_e').attr(
        'style',
        'background-color:' + color2_txt + '!important'
      )
    }
  } else {
    $('#referral_palette_e').hide()
    $('#referral_helper').show()
    $('#referral_confirm_change').hide()
  }
}

$('.original-image #original_file_path')[0].onchange = uploadOriginalFile
$('.referral-image #referral_file_path')[0].onchange = uploadReferralFile
