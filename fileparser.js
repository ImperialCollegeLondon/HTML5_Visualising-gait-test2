//*************************************************************
// Gait visualisation - file parser
//
// parsing sensor data files
//
// Benny Lo 
//July 28 2017
//****************************************************************

function prepareFile(pdata){ //parase the file into an array of strings (of each line)
    var curindex=1;
    linearray=new Array();//empty line array    
    var curlinearray=pdata.split('\n');        
    for (var i=2;i<curlinearray.length-1;i++)    //skip the first 2 lines
        linearray.push(curlinearray[i]);    
    parseSensorData();
    fileready=1;  
    xinc=31.0/trackend_time[0];    
    deginc=90.0/trackend_time[0];
    if (leftheel_strike_time[0][0] < rightheel_strike_time[0][0])
    {      
      left_heel_strike=true;
      left_pelvis_angle=35;
      left_knee_angle=130;
      left_ankle_angle=-30;
      right_pelvis_angle=-20;
      right_knee_angle=50;
      right_ankle_angle=-90;
     // curleftstep=1;
    }
      pelvis_inc=55/heel_strike_time[0][0];
      knee_inc=80/heel_strike_time[0][0];
      ankle_inc=60/heel_strike_time[0][0]
      shoulder_inc=60/heel_strike_time[0][0];
      //currightstep=1;
    curstep++;
  //  console.log("cur leftstep:"+curleftstep+" cur rightstep:"+currightstep);
  }
function GetLine(lineno){//get data from each line
    var result=new Array();    
    var strarray=linearray[lineno].split(',');
    for (var i=0;i<strarray.length;i++)
        result.push(strarray[i]);        
    return result;}
function loadDataFile(filename)
{//load sensor data
    var request=new XMLHttpRequest();
  request.open("GET",filename);
  request.onreadystatechange=function(){
    if (request.readyState==4)
    {
      prepareFile(request.responseText);
    }
  }
  request.send();
}

function parseSensorData(){
  var nocols=sensor_rec_no_col;
  sensordata=new Array(nocols);
  for (var i=0;i<nocols;i++)
    sensordata[i]=new Array();
  no_left_steps[0]=0;
  no_right_steps[0]=0;
  trackend_time[0]=0;
  trackstart_time[0]=0;
  for (var i=0;i<20;i++)
  {
    leftheel_strike_time[i]=new Array();
    rightheel_strike_time[i]=new Array();
    heel_strike_time[i]=new Array();
  }
  var track_no=0;
  for (var i=0;i<linearray.length;i++)
  {
    var newdata=GetLine(i);     
    var j=0;
    if (newdata.length>=nocols)
    {  
      //left foot accelerometer      
      sensordata[j][i]=parseFloat(newdata[j++]); sensordata[j][i] = parseFloat(newdata[j++]);sensordata[j][i]  = parseFloat(newdata[j++]);
      //left foot gyroscope
      sensordata[j][i] = parseFloat(newdata[j++]); sensordata[j][i]  = parseFloat(newdata[j++]);sensordata[j][i] = parseFloat(newdata[j++]);
      //left HS and TO
      sensordata[j][i] =parseInt(newdata[j++]); sensordata[j][i] =parseInt(newdata[j++]);       
      //turn left and turn right
      sensordata[j][i] =parseInt(newdata[j++]); sensordata[j][i] =parseInt(newdata[j++]); 
      //left foot angle;
      sensordata[j][i]=parseFloat(newdata[j++]); sensordata[j][i] = parseFloat(newdata[j++]);sensordata[j][i]  = parseFloat(newdata[j++]);
      //left flat foot
      sensordata[j][i]=parseInt(newdata[j++]);
      //right foot accelerometer
      sensordata[j][i]  = parseFloat(newdata[j++]); sensordata[j][i]  = parseFloat(newdata[j++]);sensordata[j][i] = parseFloat(newdata[j++]);
      //right foot gyroscope
      sensordata[j][i] = parseFloat(newdata[j++]); sensordata[j][i]  = parseFloat(newdata[j++]);sensordata[j][i]  = parseFloat(newdata[j++]);
      //right foot HS and TO
      sensordata[j][i] =parseInt(newdata[j++]); sensordata[j][i] =parseInt(newdata[j++]); 
      //turn left and turn right
      sensordata[j][i] =parseInt(newdata[j++]); sensordata[j][i] =parseInt(newdata[j++]); 
      //right foot angle
      sensordata[j][i]=parseFloat(newdata[j++]); sensordata[j][i] = parseFloat(newdata[j++]);sensordata[j][i]  = parseFloat(newdata[j++]);
      //right flat foot
      sensordata[j][i]=parseInt(newdata[j++]);
      //left displacement
      sensordata[j][i]  = parseFloat(newdata[j++]); sensordata[j][i]  = parseFloat(newdata[j++]);sensordata[j][i] = parseFloat(newdata[j++]);
      //right displacement
      sensordata[j][i]  = parseFloat(newdata[j++]); sensordata[j][i]  = parseFloat(newdata[j++]);sensordata[j][i] = parseFloat(newdata[j++]);

      if (sensordata[sensor_rec_left_HS][i]==1)
      {//left heel strike
        no_left_steps[track_no]++;
        leftheel_strike_time[track_no].push(i);
        heel_strike_time[track_no].push(i);
      }
      if (sensordata[sensor_rec_right_HS][i]==1)
      {//right heeal strike
        no_right_steps[track_no]++;
        rightheel_strike_time[track_no].push(i);
        heel_strike_time[track_no].push(i);
      }
      if (!making_turn && (sensordata[sensor_rec_left_turn_left][i] ||sensordata[sensor_rec_left_turn_right][i]))
      {
        if (sensordata[sensor_rec_left_turn_left][i])
          turnaround_left=true
        else turnaround_right=true;
        noturns++;
        trackend_time[track_no]=i;
        making_turn=true;
        track_no++;
        no_left_steps[track_no]=0;
        no_right_steps[track_no]=0;
        //if (turnaround_left)
          //console.log("making a left turn");
        //else console.log("making a right turn");
      }
      var endturn=false;
      if (making_turn && sensordata[sensor_rec_left_turn_left][i]==0 && turnaround_left)
      {
        making_turn=false;
        endturn=true;
        turnaround_left=false;
        //console.log("finish making a left turn");
      }
      else if (making_turn&&sensordata[sensor_rec_left_turn_right][i]<1 && turnaround_right)
      {
        making_turn=false;
        endturn=true;
        turnaround_right=false;
        //console.log("finish making a right turn");
      }
      if (endturn)
      {
        trackstart_time[track_no]=i;
      }
    }      
  }
  /*console.log("no turns"+noturns);  
  for (var i=0;i<track_no;i++)
  {
   // console.log("["+i+"]="+no_left_steps[i]+","+no_right_steps[i]);
    //console.log(trackstart_time[i]+":"+trackend_time[i]);
    //console.log("["+i+"]"+leftheel_strike_time[i]+","+rightheel_strike_time[i]+"|");
    var str="["+i+"]";
    for (var j=0;j<leftheel_strike_time[i].length;j++)
    {
      str=str+leftheel_strike_time[i][j]+",";
      if (j<rightheel_strike_time[i].length)
        str=str+rightheel_strike_time[i][j]+"|";
    }
    if (rightheel_strike_time[i].length > leftheel_strike_time[i].length)
      str=str+" ,"+rightheel_strike_time[i][j]+"|";
    console.log(str);
    str="";
    for (var j=0;j<heel_strike_time[i].length;j++)
    { 
      str=str+heel_strike_time[i][j]+",";
    }
    console.log(str);
  }*/
  /*  for (var j=0;j<sensordata[0].length;j++)
    {
        LineGraph_AddData(0,0,sensordata[0][j]);
        LineGraph_AddData(0,1,sensordata[1][j]);
        LineGraph_AddData(0,2,sensordata[2][j]);
    }
    LineGraph_Plot(0);        
  */}