const shardStatsIntervals = new Map();
function shardStats(i) {
  const intervals = [...shardStatsIntervals.values()];
  intervals.forEach(t => clearInterval(t));

  $.get(`/shard?shardid=${i}`, (data, status) => {
    $(`#exampleModal`).remove()
    $(`#exampleModalLavel`).remove()
    $(`#Modal-Shard-Status-Card-Body`).remove()
    $(`body`).append(`<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
 <div class="modal-dialog modal-sm" role="document">
   <div class="dark-mode modal-content">
     <div class="dark-mode modal-header">
       <h5 class="dark-mode modal-title" id="exampleModalLabel"><b><span id="exampleModalTitle">Status of Shard ${i}</span></b></h5>
       <button type="button" class="close" data-dismiss="modal" aria-label="Close">
         <span aria-hidden="true">&times;</span>
       </button>
     </div>
     <div id="Modal-Shard-Status-Card-Body" class="dark-mode modal-body">
     <p class="shard-modal-button"><b><i id="modal-shard-status${i}"  class="fa fa-circle ${data.color}" aria-hidden="true"> ${data.status}</i></b></p>
     <p class="shard-modal-button"><b><i id="modal-shard-cpu${i}"  class="fa fa-microchip" aria-hidden="true"> ${data.cpu}</i></b></p>
     <p class="shard-modal-button"><b><i id="modal-shard-ram${i}" class="fas fa-memory" aria-hidden="true"> ${data.ram}</i></b></p>
     <p class="shard-modal-button"><b><i id="modal-shard-ping${i}" class="fas fa-table-tennis" aria-hidden="true"> ${data.ping}</i></b></p>
     <p class="shard-modal-button"><b><i id="modal-shard-servercount${i}" class="fa fa-server" aria-hidden="true"> ${data.guildcount}</i></b></p>
   </div>
 </div>
</div>`)


    const timeout = setInterval(() => {
      $.get(`/shard?shardid=${i}`, (newdata, status) => { data = newdata; })
      $('#exampleModalTitle').text(`Status of Shard ${i}`);
      $(`#modal-shard-status${i}`).text(` ` + data.status + ` since ` + formatTime(data.upsince, data.lastupdated));
      $(`#modal-shard-cpu${i}`).text(` ` + data.cpu);
      $(`#modal-shard-ram${i}`).text(` ` + data.ram);
      $(`#modal-shard-ping${i}`).text(` ` + data.ping);
      $(`#modal-shard-servercount${i}`).text(` ` + data.guildcount);
    }, 1000)
    shardStatsIntervals.set(i, timeout)

    $('#exampleModal').modal('show')
  })
}


function refreshStats(i, code) {
  try {
    $.get('status', (data, status) => {
      if (!data) return;
      newdata = data.shards;
      const ids = $("#shard-status-card div[id]").map(function () { return this.id; }).get();
      for (let i = 0; i < ids.length; i++) {
        const shard = newdata.find((x => `shard-button${x.id}` === ids[i]));
        if (shard !== undefined) continue;
        $(`#${ids[i]}`).remove();
      }
      for (let i = 0; i < newdata.length; i++) {
        const color = newdata[i].color;
        const classname = (color === 'green' ? 'normal' : 'redalert');
        const classnamecolor = (newdata[i].color === 'green' ? '#43b581' : '#ED4245');
        if (!$(`#shard-button${i}`).length) {
          $("#shard-status-card").append(`<div id="shard-button${i}" class="shard-button">
                    <p id= "shard-button-name${i}" class="shard-button ${color}"><b>Shard ${newdata[i].id}</b>
                    </p>
                    <div class="shard-button ressource"><i class="fa fa-cog"></i><span>
                        <button id="shard-button-ressource-stats${i}" title="Statistics" class="shard-button managestats" onClick="shardStats(${i}, ${code})"><i class="fa fa-hdd"></i></button>
                        <button id="shard-button-ressource-refresh${i}" title="Refresh Stats"class="shard-button managegreen" onClick="refreshStats(${i}, ${code})"><i class="fa fa-retweet"></i></button>
                        <button id="shard-button-ressource-kill${i}" title="Kill Shard" class="shard-button managered" onClick="killShard(${i}, ${code})"><i class="fa fa-stop"></i></button>
                        </span></div>
                    <p id="shard-button-log${i}" class="shard-button log ${classname}">${newdata[i].message}</p>
                  </div>`)
        } else {

          $(`#shard-button-log${i}`).css('color', classnamecolor)
          $(`#shard-button-log${i}`).text(newdata[i].message);
          $(`#shard-button-name${i}`).removeClass('.shard-button red').addClass(`.shard-button ${color}`);

          $(`#general-status`).text(' ' + data.total.status + ` since ${formatTime(data.total.upsince, data.total.lastupdated)}`).addClass(color)
          $(`#general-status-cpu`).text(' ' + data.total.cpu)
          $(`#general-status-ram`).text(' ' + data.total.ram)
          $(`#general-status-ping`).text(' ' + data.total.ping)
          $(`#general-status-servercount`).text(' ' + data.total.guildcount)
        }
      }
    })
  } catch (error) {
    console.log(error)
  }
}

function killShard(i, code) {
  $.get(`/killShard?shardid=${i}&code=${code}`, (data, status) => {
    $(`#shard-button-log${i}`).css('color', '#ED4245')
    $(`#shard-button-log${i}`).text(`Killing Shard...`);
  })
}


function formatTime(seconds, lastupdatetime) { // day, h, m and s
  if(seconds === 0){
    return new Date(lastupdatetime).toLocaleString();
  }
  seconds = seconds / 1000;
  var days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * (24 * 60 * 60);
  var hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * (60 * 60);
  var minutes = Math.floor(seconds / (60));
  seconds -= minutes * (60);
  return ((0 < days) ? (days + " day ") : "") + hours.toFixed(0) + "h " + minutes.toFixed(0) + "m " + seconds.toFixed(0) + "s";
}