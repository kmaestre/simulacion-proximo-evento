$('#dataInput').modal()

$(function () {
  $('#content-tab').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
})

const soloNumeros = () => {
  event.target.value = event.target.value.replace(/\D/gi, '')
}
const soloNumeros2 = () => {
  event.target.value = event.target.value.replace(/(\D)/gi, '')
}

const removeBorders = () => {
  event.target.style = ''
  $('errorLabel').css('display', 'none')
}

const setInput = () => {
  let val = event.target.value
  if (val == '') {
    $('#conditionWrapper').css('display', 'none')
    $('#runBtn').attr('disabled', true)
    return
  }
  if ('1' === val || '2' === val) {
    $('#stopLabel').text('Cantidad');
    $('#stopValue2').css('display', 'none')
    $('#stopValue1').css('display', 'block')
  }
  if ('3' === val) {
    $('#stopLabel').text('Tiempo(seg)')
    $('#stopValue1').css('display', 'none')
    $('#stopValue2').css('display', 'block')

  }

  $('#conditionWrapper').css('display', 'block')
  $('#runBtn').attr('disabled', false)
}

const runSimulation = () => {
  let stopOption = document.getElementById('stop').value
  let stopValue = ''
  let initEntities = document.getElementById('entities').value

  if (!initEntities) {
    document.getElementById('entities').style = 'border: 1px solid red; color: red;'
    return
  } else {
    entities = initEntities
  }
  if (stopOption == '1' && document.getElementById('stopValue1').value != '') {
    // preparar condicion de parada para este caso 
    stopValue = document.getElementById('stopValue1').value
  } else if (stopOption == '2' && document.getElementById('stopValue1').value != '') {
    // preparar condicion de parada para este caso
    stopValue = document.getElementById('stopValue1').value
  } else if (stopOption == '3' && document.getElementById('stopValue2').value != '') {
    // preparar condicion de parada para este caso
    stopValue = document.getElementById('stopValue2').value
  } else {
    if (!stopValue) {
      if (stopOption == '1' || stopOption == '2') {
        document.getElementById('stopValue1').style = 'border: 1px solid red; color: red;'
      }
      if (stopOption == '3') {
        document.getElementById('stopValue2').style = 'border: 1px solid red; color: red;'
      }
      return
    }
    alertify.alert('Info', 'La simulacion se detendra al llegar a los ' + parseInt(stopValue) + ' segundos')
  }

  stopCondition = stopOption
  stopConditionValue = stopValue

  setFirstArrivalQuestion()
}
const setFirstDepartureQuestion = () => {
  let html = `
        <div class="modal-body text-center">
          <p>¿Desea indicar el tiempo de la primera <strong>finalizacion de servicio?</strong></p>
          <div class="row">
            <div class="form-group col-5 mx-auto">
              <button class="btn btn-danger btn-block" onclick="fDeparture = null; main()">No</button>
            </div>
            <div class="form-group col-5 mx-auto">
              <button class="btn btn-dark btn-block" onclick="setFirstDeparture()">Si</button>
            </div>
          </div>
        </div>
      `

  $('#form').html(html)
}
const setFirstArrivalQuestion = () => {
  let html = `
        <div class="modal-body text-center">
          <p>¿Desea indicar el tiempo de la primera <strong>solicitud de servicio?</strong></p>
          <div class="row">
            <div class="form-group col-5 mx-auto">
              <button class="btn btn-danger btn-block" onclick="fArrival = null;setFirstDepartureQuestion()">No</button>
            </div>
            <div class="form-group col-5 mx-auto">
              <button class="btn btn-dark btn-block" onclick="setFirstArrival()">Si</button>
            </div>
          </div>
        </div>
      `

  $('#form').html(html)
}
const setFirstArrival = () => {
  let html = `
        <div class="modal-body text-center">
          <div class="form-group col-12 mx-auto">
            <label>Tiempo (seg)</label>
            <input type="text" class="form-control input-sm" id="firstReq" oninput="soloNumeros()" onfocus="removeBorders()">
          </div>
          <div class="form-group col-5 mx-auto">
            <button class="btn btn-dark btn-block" onclick="
              let val = $('#firstReq').val()
              if (val == '') {
                document.getElementById('firstReq').style = 'border: 1px solid red; color: red;'
                return
              }

              fArrival = val
              setFirstDepartureQuestion()
            ">Aceptar</button>
          </div>
        </div>
      `

  $('#form').html(html)
}
const setFirstDeparture = () => {
  let html = `
        <div class="modal-body text-center">
          <div class="form-group col-12 mx-auto">
            <label>Tiempo de Finalizacion <small>(seg)</small>:</label>
            <input type="text" class="form-control input-sm" id="firstDep" onfocus="removeBorders()" oninput="soloNumeros()">
          </div>
          <div class="form-group col-5 mx-auto">
            <button class="btn btn-dark btn-block"  onclick="
              let val = $('#firstDep').val()
              if (val == '') {
                document.getElementById('firstDep').style = 'border: 1px solid red; color: red;'
                return
              }
              fDeparture = val
              main()
            ">Aceptar</button>
          </div>
        </div>
      `

  $('#form').html(html)
}