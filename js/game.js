var dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear()+543;
today = dd + '/' + mm + '/' + yyyy;
var cleararray = "";
var randomDegree = 0;
var xGroupGift = 0;
var Eid = "";
var ShowGift = "";
var ShowPrize = "";

$(document).ready(function () {
  if(sessionStorage.getItem("EmpID_RSOC")==null) { location.href = "index.html"; }
  Connect_DB();
  dbGiftRewards = firebase.firestore().collection("RSOCtownhall");
  //document.getElementById('id01').style.display='block';
  CheckData();
});


function CheckData() {
  var str = "";
  gcheck = 0;
  dbGiftRewards.where('EmpID','==',sessionStorage.getItem("EmpID_RSOC"))
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      gcheck = 1;
      Eid = doc.id;
      ShowGift = doc.data().giftcode;
      ShowPrize = doc.data().giftname;
      //console.log("Found : "+gcheck+" --- "+ doc.data().giftcode+" --- "+ doc.data().giftname );
      document.getElementById('loading').style.display='none';
      document.getElementById('ShowWheel1').style.display='block';
      str += '<center>';
      if(doc.data().giftcode=="gift-99") {
        str += '<div style="margin:50px auto 10px auto;"><img src="./img/'+ doc.data().giftcode +'.png" style="width:220px;"/></div>';
        str += '<div class="boxtext" style="margin-top:10px;"><b>เสียใจด้วยน้า</b><br>คุณยังไม่ได้รับรางวัล<br>แล้วมาร่วมกิจกรรมกันใหม่น้า ...<div style="font-size:11px;">Date : '+ doc.data().DateRegister +'</div></div>';
      } else {
        str += '<div style="margin:50px auto 10px auto;"><img src="./img/'+ doc.data().giftcode +'.png"" style="width:220px;"/></div>';
        if(doc.data().StatusSend==1) {
          str += '<div class="boxtext" style="margin-top:20px; color:#000;">ยินดีด้วยคุณได้รับรางวัล<br><b>'+ doc.data().giftname +'</b></div>';
          str += '<div style="margin-top:35px; color:#fff;">ติดต่อรับของรางวัลก่อนกดปุ่มด้านล่าง</div>';
          str += '<div class="btn-t2" style="margin-top:20px;background: #28a745; border:2px solid #fff; color:#fff; padding:10px 35px;" onclick="GetRewards()">!!! อย่าพึ่งกดปุ่มนี้ !!!<br>หากคุณยังไม่ได้รับรางวัล</div>';
        } else if(doc.data().StatusSend==2) {
          str += '<div class="boxtext" style="margin-top:20px; color:#000;">ยินดีด้วยคุณได้รับรางวัล<br><b>'+ doc.data().giftname +'</b><br><br>คุณได้รับรางวัลเรียบร้อยแล้ว<br>'+ doc.data().SendGift +'</div>';
          str += '<div class="btn-t2" style="margin-top:40px;background: #0056ff; border:2px solid #fff; color:#fff; margin-right: 3px;" onclick="Opengift()">ดูรายการของรางวัล</div>';
          str += '<div class="btn-t2" style="margin-top:40px;background: #0056ff; border:2px solid #fff; color:#fff;" onclick="OpenRewards()">รายชื่อผู้ได้รับรางวัล</div>';
          //str += '<div class="btn-t2" style="margin-top:30px;background: #6c757d; border:2px solid #fff; color:#fff; padding:10px 35px;">คุณรับรางวัลเรียบร้อยแล้ว<br>'+ doc.data().SendGift +'</div>';
        }
      }
      str += '</center>';
      $("#DisplayGift").html(str);
    });
    if(gcheck==0) {
      //console.log(gcheck);
      document.getElementById('loading').style.display='none';
      document.getElementById('id01').style.display='block';
      document.getElementById('StartGame').style.display='block';
    }
  });
}



const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 2 },
  { minDegree: 31, maxDegree: 90, value: 1 },
  { minDegree: 91, maxDegree: 150, value: 6 },
  { minDegree: 151, maxDegree: 210, value: 5 },
  { minDegree: 211, maxDegree: 270, value: 4 },
  { minDegree: 271, maxDegree: 330, value: 3 },
];
const data = [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16];
var pieColors = [
  "#3cb219",
  "#e30000",
  "#3cb219",
  "#e30000",
  "#3cb219",
  "#e30000",
  "#3cb219",
  "#e30000",
  "#3cb219",
  "#e30000",
  "#0056ff",
];
let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: {
        display: false,
      },
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});
const valueGenerator = (angleValue) => {
  document.getElementById('ShowWheel').style.display='none';
  document.getElementById('final-value').style.display='none';
  document.getElementById('ShowWheel1').style.display='block';
  SaveReward();
/*
  for (let i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      var varTimerInMiliseconds = 2000;
      setTimeout(function(){ 
        document.getElementById('ShowWheel').style.display='none';
        document.getElementById('final-value').style.display='none';
        document.getElementById('ShowWheel1').style.display='block';
        SaveReward();
      }, varTimerInMiliseconds);
      spinBtn.disabled = false;
      break;
    }
  }
*/
};


let count = 0;
let resultValue = 101;
spinBtn.addEventListener("click", () => {
  RandomRewards();
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p style="text-align: center;font-size:14px; color:#fff;"><b>Good Luck!</b></p>`;
  //let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  //console.log("random-"+randomDegree);
  //let randomDegree = 5;
  //Interval for rotation animation

  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();
    if (myChart.options.rotation >= 331) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
      if(count==21) {
        clearInterval(rotationInterval);
        valueGenerator(0);
      }
      //console.log(count);
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      clearInterval(rotationInterval);
      valueGenerator(randomDegree);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});


var ArrRewards = [];
var NewRewards = "";
function RandomRewards() { 
  var i = 0;
  Eidewards = "";
  dbGiftRewards.where('LineID','==','')
  .get().then((snapshot)=> {
    snapshot.forEach(doc=>{
      ArrRewards.push([doc.id, doc.data().giftname, doc.data().giftcode ]);
    });
    //console.log(ArrRewards);
    NewRewards = random_item(ArrRewards);
    Eid = NewRewards[0];
    //console.log(NewRewards[1]);
    ReCheckUser();
  });  
}


function ReCheckUser() { 
  dbGiftRewards.where('EmpID','==',sessionStorage.getItem("EmpID_RSOC"))
  .limit(1)
  .get().then((snapshot)=> {
    snapshot.forEach(doc=>{
      document.getElementById('id04').style.display='block';
      //location.href = "game.html";
    });
    //GetCodeRandom(NewRewards[0], NewRewards[1], NewRewards[2]);
    ShowGift = NewRewards[2];
    ShowPrize = NewRewards[1];
    //console.log(NewRewards[1]);
  });  
}


function SaveReward() {
  var str = "";
  var str0 = "";
  
  NewDate();
  var TimeStampDate = Math.round(Date.now() / 1000);
  dbGiftRewards.doc(Eid).update({
    LineID : sessionStorage.getItem("LineID"),
    LineName : sessionStorage.getItem("LineName"),
    LinePicture : sessionStorage.getItem("LinePicture"),
    EmpID : sessionStorage.getItem("EmpID_RSOC"),
    EmpName : sessionStorage.getItem("EmpName_RSOC"),
    Phone : sessionStorage.getItem("EmpPhone"),
    address : sessionStorage.getItem("EmpAddress"),
    ResultQuiz : NewRewards[2],
    StatusSend : 1,
    DateRegister : dateString,
    TimeStamp : TimeStampDate
  });

  //var myTimeout = setTimeout(ShowRewards, 2000);
  document.getElementById('id02').style.display='block';
  if(parseFloat(xGroupGift)==6) {
    str += '<div style="margin:30px auto 0px auto;"><img src="./img/gift-99.png" style="width:260px;"/></div>';
    str += '<center><div class="boxtext"><b>คุณไม่ได้รับรางวัล</b><br><font color="#000000">แล้วมาร่วมกิจกรรมกันใหม่น้า</font></div></center>';        
    str0 += '<div class="btn-1" style="margin-top:25px; margin-bottom: 15px; background:#059c28;">ผลการหมุนรางวัล</div>';
    str0 += '<div style="margin:20px auto 0px auto;"><img src="./img/gift-99.png" style="width:260px;"/></div>';
    str0 += '<center><div class="boxtext"><b>คุณไม่ได้รับรางวัล</b><br>แล้วมาร่วมกิจกรรมกันใหม่น้า</div></center>';
  } else {
    str += '<div style="margin:20px auto 12px auto;"><center><img src="./img/'+ NewRewards[2] +'.png" style="position: relative; width:220px;right: 0%;"></center></div>';
    str += '<center><div class="boxtext" style="margin-top:14px;">ยินดีด้วย ... คุณได้รับรางวัล<br><b>'+ NewRewards[1] +'</b></div></center>';
    str += '<div style="margin-top:35px; color:#fff;">ติดต่อรับของรางวัลก่อนกดปุ่มด้านล่าง</div>';
    str += '<div class="btn-t2" style="margin-top:20px;background: #28a745; border:2px solid #fff; color:#fff; padding:10px 35px;" onclick="GetRewards()">!!! อย่าพึ่งกดปุ่มนี้ !!!<br>หากคุณยังไม่ได้รับรางวัล</div>';
    str0 += '<div class="btn-1" style="margin-top:25px; margin-bottom: 15px; background:#059c28;">ผลการหมุนรางวัล</div>';
    str0 += '<div style="margin:20px auto -10px auto;"><img src="./img/gift-99.gif" style="width:260px;"/></div>';
    str0 += '<center><div class="boxtext"><b>ยินดีด้วย ... คุณได้รับรางวัล</b><br>กดปิดหน้าต่างเพื่อดูรางวัลของคุณ</div></center>';
  }
  $("#DisplayGift").html(str);
  $("#DisplayGiftRewards").html(str0);
}


function GetCodeRandom(id,x,y) {
  //console.log("Random name gift = "+ y +" ("+ x +") -->"+ id);
  //NewDate();
  //var TimeStampDate = Math.round(Date.now() / 1000);
  /*
  randomDegree = 0;
  switch(y) {
    case "gift-01":
      randomDegree = 85;
      xGroupGift = 1;
      xResultQuiz = "";
      break;
    case "gift-02":
      randomDegree = 17;
      xGroupGift = 2;
      break;
    case "gift-03":
      randomDegree = 326;
      xGroupGift = 3;
      break;
    case "gift-04":
      randomDegree = 265;
      xGroupGift = 4;
      break;
    case "gift-05":
      randomDegree = 207;
      xGroupGift = 5;
      break;
    case "gift-99":
      randomDegree = 139;
      xGroupGift = 6;
      break;
    default:
    randomDegree = 17;
    xGroupGift = 2;

  }
  if(parseFloat(randomDegree)==0) {
    location.href = "game.html";
  }
  */
  //console.log("randomDegree = "+randomDegree);
  //SaveData();
}


function GetRewards() {
  var str = "";
  str += '<div class="btn-1" style="margin-top:25px; margin-bottom: 15px;">ยืนยันการรับรางวัล</div>';
  str += '<center><div style="margin:50px auto 30px auto;"><img src="./img/'+ ShowGift +'.png" style="width:220px;"/><div class="boxtext" style="margin-top:20px; color:#000;"><b>'+ ShowPrize +'</b></div></div></center>';
  str += '<div style="color:#fff;font-size: 13px;">หากท่านได้ทำการรับรางวัลเรียบร้อยแล้ว<br><b>ให้ทำการกดยืนยันการรับรางวัลด้านล่าง</b></font></div>';
  str += '<div class="btn-t2" style="margin:20px auto; background: #dc3545; color:#fff; margin-right:5px;" onclick="GiftConfirm()">ยืนยันการรับรางวัล</div>';
  str += '<div class="btn-t2" style="margin:20px auto; background: #28a745; color:#fff;" onclick="CloseAll()">ยังไม่รับตอนนี้</div>';
  $("#DisplayConfirmGift").html(str);
  document.getElementById('id05').style.display='block';
  //alert("Get Rewards");
}

function GiftConfirm() {
  NewDate();
  $("#DisplayGift").html(cleararray);
  document.getElementById('id05').style.display='none';
  document.getElementById('loading').style.display='block';
  dbGiftRewards.doc(Eid).update({
    StatusSend : 2,
    SendGift : dateString
  });
  var myTimeout = setTimeout(CheckData, 1000);
}


function random_item(items) {
  return items[Math.floor(Math.random()*items.length)];   
}


function Opengift() {
  document.getElementById('id03').style.display='block';
}


function Song1() {
  CloseVDO();
  var vid = document.getElementById("myaudio1");
  vid.autoplay = true;
  vid.load();
  document.getElementById('id01').style.display='none';
}


function CloseVDO() {
  var video1 = document.querySelector("#myaudio1");
  video1.pause();
  video1.currentTime = 0;
}


function OpenReload() {
  location.href = "game.html";
}

function OpenRewards() {
  location.href = "rewards.html";
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


function checkZero(data){
  if(data.length == 1){
    data = "0" + data;
  }
  return data;
}


function CloseAll() {
  document.getElementById('id01').style.display='none';
  document.getElementById('id02').style.display='none';
  document.getElementById('id03').style.display='none';
  document.getElementById('id04').style.display='none';
  document.getElementById('id05').style.display='none';
}


