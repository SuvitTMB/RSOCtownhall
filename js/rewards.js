var dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
var xClickMenu = "";


$(document).ready(function () {
  if(sessionStorage.getItem("EmpID_RSOC")==null) { location.href = "index.html"; }
  Connect_DB();
});


function Connect_DB() {
  var firebaseConfig = {
    apiKey: "AIzaSyDfTJJ425U4OY0xac6jdhtSxDeuJ-OF-lE",
    authDomain: "retailproject-6f4fc.firebaseapp.com",
    projectId: "retailproject-6f4fc",
    databaseURL: "https://file-upload-6f4fc.firebaseio.com",
    storageBucket: "retailproject-6f4fc.appspot.com",
    messagingSenderId: "653667385625",
    appId: "1:653667385625:web:a5aed08500de80839f0588",
    measurementId: "G-9SKTRHHSW9"
  };
  firebase.initializeApp(firebaseConfig);
  //dbGiftRewards = firebase.firestore().collection("Gift2023Rewards");
  dbGiftRewards = firebase.firestore().collection("RSOCtownhall");
  loadData();
}


function loadData() {
  var i = 0;
  var count = 0;
  var xTopVote = "";
  var dataSet = "";
  var dataSrc = [];
  dbGiftRewards
  .where('StatusSend','==',1)
  .orderBy('giftcode','asc')
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      i = (i+1);
      count++;
      var xNewText = "";
      xNewText += '<div>';
      xNewText += '<div style="width:85%;float: left;color:#777;padding-top:3px;"><b>'+ doc.data().giftname +'</b>';
      xNewText += '<div style="font-size:13px; font-weight:600;color:#0056ff;">'+ doc.data().EmpName +'</div></div>';
      xNewText += '<div style="width:15%;float: left;"><img src="'+ doc.data().LinePicture +'" onerror="javascript:imgError(this)" class="chart-profilt" title="'+ doc.data().LineName +'"></div>';
      xNewText += '</div><div class="clr"></div>';
      dataSet = [xNewText, doc.data().giftname, doc.id, i];
      dataSrc.push(dataSet);
    }); 

    dTable=$('#ex-table').DataTable({
      "bDestroy": true,    
      data: dataSrc,
      columns: [
        { title: "รายชื่อผู้ได้รับรางวัล" }
        ],
        dom: 'lfrtipB',
        buttons: [
            //'copy', 'excelFlash', 'excel', 'pdf', 'print'
        ],
          lengthMenu: [[50, 100, 200, -1], [50, 100, 200, "All"]],
          columnDefs: [ { type: 'number', 'targets': [0] } ],
          order: [[ 0, 'asc']]
        //dom: 'Bfrtip', buttons: [ 'copy', 'csv', 'excel', 'pdf', 'print' ]
      });   
  });
  $('#ex-table').DataTable().destroy();
  $("#ex-table tbody").remove();
}


function ClickID(x,id) {
  location.href = "viewpage.html?gid="+id+"";
}

function GotoHome() {
  location.href = "game.html";
}

function CloseAll() {
  document.getElementById('id01').style.display='none';
}


function NewDate() {
  var today = new Date();
  var day = today.getDate() + "";
  var month = (today.getMonth() + 1) + "";
  var year = today.getFullYear() + "";
  var hour = today.getHours() + "";
  var minutes = today.getMinutes() + "";
  var seconds = today.getSeconds() + "";
  var ampm = hour >= 12 ? 'PM' : 'AM';
  day = checkZero(day);
  month = checkZero(month);
  year = checkZero(year);
  hour = checkZero(hour);
  minutes = checkZero(minutes);
  seconds = checkZero(seconds);
  dateString = day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds +" "+ ampm;
}


function ConvrtDate(str) {
  var date = new Date(str),
  mnth = ("0" + (date.getMonth() + 1)).slice(-2),
  day = ("0" + date.getDate()).slice(-2);
  return [day, mnth, date.getFullYear()+543].join("/");
}


function checkZero(data){
  if(data.length == 1){
    data = "0" + data;
  }
  return data;
}


function imgError(image) {
    image.onerror = "";
    image.src = "./img/box.jpg";
    return true;
}

function imgError1(image) {
    image.onerror = "";
    image.src = "./img/mom-rule.jpg";
    return true;
}
