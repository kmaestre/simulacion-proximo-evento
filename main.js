//parametros inciales
var fArrival;
var fDeparture;

//variables globales
var arrivals = [];
var departures = [];
var clock = 0;
var entities = 0;
var eventList = [];
var rgNumber = [];
var stopCondition = '3'
var stopConditionValue = 4000
/*Variables para analisis*/
var arrivalCount = 0
var departureCount = 0
var maxQueue = 0
var lastArrived = 0
var TBA_Acum = 0;
var lastDeparture = 0
var TBD_Acum = 0 
var idleTime = 0
var generatedEvent

const weibull = (g, a, b, u) => {
  return (g + b * (-Math.log(u)) ** (1 / a))
}
const sortEventList = () => {
  eventList.sort((a, b) => (a.time - b.time))
}
//si ocurre E2, generar proximo E2 si NE != 0 y E1 si no existe en lista
const execE2 = () => {
  departureCount += 1
  entities -= 1
  let res = { activeEvent: null, generated: '', ris: [] }
  res.activeEvent = eventList.splice(0, 1)[0]
  clock = res.activeEvent.time
  let newE2 = null
  let newE1 = null
  if (entities > 0) {
    res.ris.push(Math.random())
    newE2 = generateEvent(2, res.ris[res.ris.length - 1])
    eventList.push(newE2)
  }
  if (!arrivalExists()) {
    res.ris.push(Math.random())
    newE1 = generateEvent(1, res.ris[res.ris.length - 1])
    eventList.push(newE1)
  }

  if (newE2 && newE1) {
    res.generated += `E2<sub>(${newE2.time.toFixed(2)})</sub>/E1<sub>(${newE1.time.toFixed(2)})</sub>`
  } else if (newE1 && !newE2) {
    res.generated += `E1<sub>(${newE1.time.toFixed(2)})</sub>`
  } else if (!newE1 && newE2) {
    res.generated += `E2<sub>(${newE2.time.toFixed(2)})</sub>`
  } else if (!newE2 && !newE1) {
    res.generated = '-'
  }

  if (res.ris.length == 0) res.ris = '-'

  sortEventList()
  return res
}
//si ocurre E1, generar nuevo E1 y E2 si no existe en lista
const execE1 = () => {
  entities += 1
  arrivalCount += 1
  let res = { activeEvent: null, generated: null, ris: [] }
  res.activeEvent = eventList.splice(0, 1)[0]
  clock = res.activeEvent.time
  res.ris.push(Math.random())
  let newE1 = generateEvent(1, res.ris[0])
  let newE2 = null
  eventList.push(newE1)
  if (!departureExists()) {
    res.ris.push(Math.random())
    newE2 = generateEvent(2, res.ris[1])
    eventList.push(newE2)
  }

  res.generated = `E1<sub>(${newE1.time.toFixed(2)})</sub>${newE2 ? '/E2<sub>(' + newE2.time.toFixed(2) + ')</sub>' : ''}`

  sortEventList()
  return res
}
const getNextEvent = () => {
  let event;
  let pos = 0;
  for (let i = 0; i < eventList.length; i++) {
    if (i == 0) event = eventList[0]
    else if (event.time > eventList[i].time) {
      event = eventList[i]
      pos = i
    }
  }

  return pos
}
const printEventList = () => {
  let arr = '';
  eventList.forEach(e => {
    arr = arr + '' + (e.type + '<sub>(') + (e.time.toFixed(2)) + ')</sub> '
  })

  return arr
}
const arrivalExists = () => {
  let res = false
  for (let i = 0; i < eventList.length; i++) {
    if (eventList[i].type == 'E1') {
      res = true
      break
    }
  }

  return res
}
const departureExists = () => {
  let res = false
  for (let i = 0; i < eventList.length; i++) {
    if (eventList[i].type == 'E2') {
      res = true
      break
    }
  }

  return res
}
const generateEvent = (t, u) => {
  if (t == 1) {
    let w = weibull(0, 1.06793, 112.482, u)
    arrivals.push([w, u])
    return { type: 'E1', time: clock + w, ri: u }
  } else {
    let w = weibull(26.954, 1.10966, 34.2411, u)
    departures.push([w, u])
    return { type: 'E2', time: clock + w, ri: u }
  }
}
const printEventRow = (a, b, c, d, e, f) => {
  $('tbody').append(`<tr>
          <td>${(a).toFixed(2)}</td>
          <td>${b}</td>
          <td>${c}</td>
          <td>${d}</td>
          <td>${e}</td>
          <td class="text-left">${f}</td>
        </tr>`)
}
const main = () => {
  $('#entradadatos').toggleClass('d-none')
  setTimeout(function () {
    $('#tabla').toggleClass('d-none')
  }, 500)
  let stop = false

  if (entities > 0 && !fDeparture && !fArrival) {
    eventList.push(generateEvent(1, Math.random()))
  }
  if (fDeparture) {
    eventList.push({type: 'E2', time: parseFloat(fDeparture), ri: 0})
  }
  if (fArrival){
    eventList.push({type: 'E1', time: parseFloat(fArrival), ri: 0})
  }

  if (stopCondition == '3') {
    eventList.push({ type: 'E3', time: stopConditionValue, ri: 0 })
  }

  sortEventList()

  printEventRow(clock, '-', entities, '-', '-', printEventList())
  while (!stop) {
    if (entities && entities > maxQueue) maxQueue = entities - 1
    if (stopCondition == '1' && stopConditionValue <= arrivalCount) break
    else if (stopCondition == '2' && stopConditionValue <= departureCount) break
    else if (stopCondition == '3' && stopConditionValue <= clock) {
      clock = stopConditionValue
      eventList.splice(0, 1)
      printEventRow(stopConditionValue, 'E3', entities, '-', '-', printEventList())
      break
    }
    sortEventList()
    Ri = Math.random()
    if (!entities) {
      if (arrivalExists()) {
        let prevClock = clock
        let { generated, ris } = execE1()
        idleTime += clock - prevClock
        sortEventList()
        printEventRow(clock, 'E1', entities, `${ris == '-' ? ris : ris.length == 1 ? ris[0].toFixed(3) : ris[0].toFixed(3) + '/' + ris[1].toFixed(3)}`, generated, printEventList())
      } else {
        let newEvent = generateEvent(1, Ri)
        eventList.push(newEvent)
        sortEventList()
        EG = 'E1<sub>(' + newEvent.time.toFixed(2) + ')</sub>'
        printEventRow(clock, '-', entities, Ri.toFixed(3), EG, printEventList())
      }
    } else {
      if (eventList.length && eventList[0].type == 'E1') {
        let { ris, generated } = execE1()
        sortEventList()
        printEventList()
        printEventRow(clock, 'E1', entities, `${ris.length == 1 ? ris[0].toFixed(3) : ris[0].toFixed(3) + '/' + ris[1].toFixed(3)}`, generated, printEventList())
      } else if (eventList.length && eventList[0].type == 'E2') {
        let { ris, generated } = execE2()
        sortEventList()
        printEventList()
        printEventRow(clock, 'E2', entities, `${ris == '-' ? ris : (ris.length == 1) ? ris[0].toFixed(3) : ris[0].toFixed(3) + '/' + ris[1].toFixed(3)}`, generated, printEventList())
      }
    }

    if (stopCondition == '3' && eventList[0].type == 'E3') {
      clock = stopConditionValue
    }

  }

  $('#patrones').append(`
    <table class="table table-bordered table-striped table-sm" style="width:100%">
      <thead>
        <tr><th>Nº</th><th>Patron de Llegada</th><th>Ri</th></tr>
      </thead>
      <tbody id="patLlegada"></tbody>
    </table>
`)
  arrivals.forEach((a, i) => {
    $('#patLlegada').append(`<tr><td>${i}</td><td>${a[0].toFixed(3)}</td><td>${a[1].toFixed(3)}</td></tr>`)
  })

  $('#patrones').append(`
    <table class="table table-bordered table-striped table-sm" style="width:100%">
      <thead>
        <tr><th>Nº</th><th>Patron de Servicio</th></tr>
      </thead>
      <tbody id="patSalida"></tbody>
    </table>
`)
  departures.forEach((d, i) => {
    $('#patSalida').append(`<tr><td>${i}</td><td>${d[0].toFixed(3)}</td><td>${d[1].toFixed(3)}</td></tr>`)
  })

  $('#tabla').append(`
    <div class="col-10 mx-auto mb-1 card px-3 py-2">
      <h4 class="text-center">Resultados</h4> 
      <span><strong>Solicitudes de Servicio:</strong> ${arrivalCount}</span>
      <span><strong>Entidades Atendidas:</strong> ${departureCount}</span>
      <span><strong>Maximo de clientes en Cola:</strong> ${maxQueue}</span>
      <span><strong>Maximo de Entidades en el Sistema:</strong> ${maxQueue+1}</span>
      <span><strong>Tiempo de Ocio:</strong> ${idleTime.toFixed(2)} Seg</span><span><strong>Tiempo de Uso:</strong> ${(clock - idleTime).toFixed(2)} Seg</span>
      <span><strong>Eventos pendientes:</strong> ${printEventList()}</span>
    </div>
  `)
}


/*
  push eventos que ocurren a los respectivos arreglos para calcular tiempos entre llegada y otras cosas
*/