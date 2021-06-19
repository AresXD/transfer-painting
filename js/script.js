let canv, file, ctx
let img_raw, width, height
let originalImageIsDone = false
let referralImageIsDone = false

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
    $('.source_original_image_area').fadeIn(1000)
    originalImageIsDone = true
    if (originalImageIsDone && referralImageIsDone) {
      $('#confirm_change').show()
    }
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
    $('.source_referral_image_area').fadeIn(1000)
    referralImageIsDone = true
    if (originalImageIsDone && referralImageIsDone) {
      $('#confirm_change').show()
    }
  }
}

function addOriginalPalette (colors) {
  let tmp = ''
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
  }

  $('#original_palette').html(tmp)

  for (let i = 1; i < colors.length; i++) {
    const c = colors[i]
    const color = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'
    setTimeout(
      (function (j, cl, rgb) {
        return function () {
          $('.original_plt' + j).attr('style', 'background-color:' + cl + '!important')
        }
      })(i, color, c),
      600 * (0.5 + i)
    )
  }
}

function addReferralPalette (colors) {
  let tmp = ''
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
  }

  $('#referral_palette').html(tmp)

  for (let i = 1; i < colors.length; i++) {
    const c = colors[i]
    const color = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'
    setTimeout(
      (function (j, cl, rgb) {
        return function () {
          $('.referral_plt' + j).attr('style', 'background-color:' + cl + '!important')
        }
      })(i, color, c),
      600 * (0.5 + i)
    )
  }
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

$('.original-image #original_file_path')[0].onchange = uploadOriginalFile
$('.referral-image #referral_file_path')[0].onchange = uploadReferralFile
