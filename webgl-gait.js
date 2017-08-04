//*************************************************************
// Gait visualisation
//
//
//
// Benny Lo 
//July 28 2017
//****************************************************************

var glcanvas;//canvas on the web page
var gl;//the GL
var shaderProgram;//the shader program (needs to be loaded)
var no_light_shaderProgram;
var sticksPositionBuffer;
var dummystickNormalBuffer;
var headPositionBuffer;
var headIndexBuffer;
var headNormalBuffer;
var torsoPositionBuffer;
var torsoIndexBuffer;
var torsoNormalBuffer;
var floorPositionBuffer;
var dummyfloorNormalBuffer=null;
var mvMatrix; //model-view matrix
var pMatrix;  //projection matrix
var mvMatrixStack=[];//stack for storing the mvMatrix
//var imageisloaded=false;//make sure the texture image is loaded before rendering
var imageisloaded=true;//make sure the texture image is loaded before rendering
var moonTexture;
var mouseDown=false;
var lastMouseX=null;
var lastMouseY=null;
var moonRotationMatrix;
var bodyRotationMatrix;
var moonTexture;
var timer;
var counter=0;
var figureposx=-15;
//var figureposx=0;
var nosteps=100;
var xinc=31/nosteps;
var curdeg=135;
//var curdeg=90;
var deginc=90/nosteps;
var turning_right=false;
var walking_backward=false;
var turning_left=false;
var walking_foreward=true;
var left_pelvis_angle=-20;
//var left_knee_angle=20;
var left_knee_angle=50;
var left_ankle_angle=-90;
var pelvis_inc=5;
var knee_inc=5;
var ankle_inc=30;
//var pelvis_inc=0.5;
//var knee_inc=0.5;
//var ankle_inc=3;
var left_heel_strike=false;
var zpos=0;
//var right_pelvis_angle=20;
var right_pelvis_angle=35;
var right_knee_angle=130;
//var right_knee_angle=90;
var right_ankle_angle=-90;
var left_shoulder_angle=80,right_shoulder_angle=40;
var right_elbow_angle=80,left_elbow_angle=100;
//var shoulder_inc=6;
var shoulder_inc=0;
var elbow_inc=0;
//var elbow_inc=2;
var fileready=false;
var linearray;
var sensordata;
var sensorrecord=0;
var fileready=false;
var linearray;
var noturns=0;
var turnaround_left=false;
var turnaround_right=false;
var making_turn=false;
var no_left_steps=new Array();
var no_right_steps=new Array();
var trackstart_time=new Array();
var trackend_time=new Array();
var heel_strike_time=new Array(20);
var leftheel_strike_time=new Array(20);
var rightheel_strike_time=new Array(20);
var turn_inc=0;
var curtrack=0;
var curleftstep=0;
var currightstep=0;
var curstep=0;
//sensor record col 
  var sensor_rec_left_accelx=0;
  var sensor_rec_left_accely=1;
  var sensor_rec_left_accelz=2;
  var sensor_rec_left_gyrox=3;
  var sensor_rec_left_gyroy=4;
  var sensor_rec_left_gyroz=5;
  var sensor_rec_left_HS=6;
  var sensor_rec_left_TO=7;
  var sensor_rec_left_turn_left=8;
  var sensor_rec_left_turn_right=9;
  var sensor_rec_left_angleX=10;
  var sensor_rec_left_angleY=11;
  var sensor_rec_left_angleZ=12;
  var sensor_rec_left_FF=13;


  var sensor_rec_right_accelx=14;
  var sensor_rec_right_accely=15;
  var sensor_rec_right_accelz=16;
  var sensor_rec_right_gyrox=17;
  var sensor_rec_right_gyroy=18;
  var sensor_rec_right_gyroz=19;
  var sensor_rec_right_HS=20;
  var sensor_rec_right_TO=21;
  var sensor_rec_right_turn_left=22;
  var sensor_rec_right_turn_right=23;
  var sensor_rec_right_angleX=24;
  var sensor_rec_right_angleY=25;
  var sensor_rec_right_angleZ=26;
  var sensor_rec_right_FF=27;

  var sensor_rec_left_dispx=28;
  var sensor_rec_left_dispy=29;
  var sensor_rec_left_dispz=30;
  var sensor_rec_right_dispx=31;
  var sensor_rec_right_dispy=32;
  var sensor_rec_right_dispz=33;

  var sensor_rec_no_col=34;

// start - initialise the buffer and GL
function start() {
  glcanvas = document.getElementById("glcanvas");

  gl=initWebGL(glcanvas);      // Initialize the GL context
  
  if (!gl) return;//Web GL is not available so, quit!
  mvMatrix = mat4.create();//create the model matrix 
  pMatrix = mat4.create();//create the projection matrx  
  moonRotationMatrix=mat4.create();
  bodyRotationMatrix=mat4.create();
  mat4.identity(moonRotationMatrix,moonRotationMatrix);
  mat4.identity(bodyRotationMatrix,bodyRotationMatrix);
  initShaders(); //initialise the shaders     
  initBuffers();  
  gl.clearColor(0.0,0.0,0.0,1.0);//clear the canvas
  gl.enable(gl.DEPTH_TEST);  //enable depth test -> d
  glcanvas.onmousedown=handleMouseDown;
  glcanvas.onmouseup=handleMouseUp;
  document.onmousemove=handleMouseMove;
  var which_subject=document.getElementById("filechosen");
  var filename="GA21604"+which_subject.value+"_result.csv";
  //console.log(filename);
  var showfilename=document.getElementById("showfilename");
      showfilename.innerHTML="File:"+filename;
  //loadDataFile("GA216042_result.csv");
  //var filename="data_subject_3_with_angles.csv";
  //var filename="GA216042_result.csv";
  loadDataFile(filename);
  setTimer();
}

function setTimer()
{
    timer=window.setTimeout(OnTimer,1);        
}
function resetTimer()
{
    if (timer)
    {
        window.clearTimeout(timer);   timer=null;  }
     setTimer();
}
function OnTimer()
{
  if (!sensordata ||!fileready) 
  {
    resetTimer();
    return;
  }
  if (sensorrecord>=sensordata[0].length) return;
  if (sensorrecord<sensordata[0].length)
  {
      //left foot accelerometer
      LineGraph_AddData(0,0,sensordata[sensor_rec_left_accelx][sensorrecord]);
      LineGraph_AddData(0,1,sensordata[sensor_rec_left_accely][sensorrecord]);
      LineGraph_AddData(0,2,sensordata[sensor_rec_left_accelz][sensorrecord]);    
      LineGraph_Plot(0);    
      //right foot accelerometer
      LineGraph_AddData(1,0,sensordata[sensor_rec_right_accelx][sensorrecord]);
      LineGraph_AddData(1,1,sensordata[sensor_rec_right_accely][sensorrecord]);
      LineGraph_AddData(1,2,sensordata[sensor_rec_right_accelz][sensorrecord]);    
      LineGraph_Plot(1);    
      //left foot gyroscope
      LineGraph_AddData(2,0,sensordata[sensor_rec_left_gyrox][sensorrecord]);
      LineGraph_AddData(2,1,sensordata[sensor_rec_left_gyroy][sensorrecord]);
      LineGraph_AddData(2,2,sensordata[sensor_rec_left_gyroz][sensorrecord]);    
      LineGraph_Plot(2);   
      //right foot gyroscope
      LineGraph_AddData(3,0,sensordata[sensor_rec_right_gyrox][sensorrecord]);
      LineGraph_AddData(3,1,sensordata[sensor_rec_right_gyroy][sensorrecord]);
      LineGraph_AddData(3,2,sensordata[sensor_rec_right_gyroz][sensorrecord]);    
      LineGraph_Plot(3);  
      //LHS LTO, RHS, RTO   
      LineGraph_AddData(4,0,sensordata[sensor_rec_left_HS][sensorrecord]);
      LineGraph_AddData(4,1,sensordata[sensor_rec_left_TO][sensorrecord]);
      LineGraph_AddData(4,2,sensordata[sensor_rec_right_HS][sensorrecord]);    
      LineGraph_AddData(4,3,sensordata[sensor_rec_right_TO][sensorrecord]);    
      LineGraph_Plot(4);  
      if (sensorrecord>=trackend_time[curtrack])
      {
        console.log("start turn");
        curtrack++;
        curleftstep=0;
        currightstep=0;
        curstep=0;
        var turning_time=trackstart_time[curtrack]-trackend_time[curtrack-1];
        if (sensordata[sensor_rec_left_turn_right][sensorrecord])
        {
          turn_inc=(225-curdeg)/(trackstart_time[curtrack]-trackend_time[curtrack-1]);
        }
        else {
          turn_inc=(curdeg-135)/(trackstart_time[curtrack]-trackend_time[curtrack-1]);          
        }
        xinc=31.0/(trackend_time[curtrack]-trackstart_time[curtrack]);  
        deginc=90.0/(trackend_time[curtrack]-trackstart_time[curtrack]);  
        // console.log(timediff);
      }
      //-------------------------------------
      //show the orentation of the sensors
      if (sensordata[sensor_rec_left_FF][sensorrecord]==0)
        left_foot_sensor_rotate(sensordata[sensor_rec_left_angleX][sensorrecord],
                        sensordata[sensor_rec_left_angleY][sensorrecord],sensordata[sensor_rec_left_angleZ][sensorrecord]);      
      else left_foot_sensor_rotate(0,0,0);      
      if (sensordata[sensor_rec_right_FF][sensorrecord]==0)
      {
        right_foot_sensor_rotate(sensordata[sensor_rec_right_angleX][sensorrecord],
                        sensordata[sensor_rec_right_angleY][sensorrecord],sensordata[sensor_rec_right_angleZ][sensorrecord]);      
      }
      else right_foot_sensor_rotate(0,0,0);  
      sensorrecord+=1;      
  }
  else {
   // console.log("no turns:"+noturns);
  }
  initialiseStickFigure(zpos,left_pelvis_angle,left_knee_angle,left_ankle_angle,
        right_pelvis_angle,right_knee_angle,right_ankle_angle,left_shoulder_angle,right_shoulder_angle,
        left_elbow_angle,right_elbow_angle);
  drawScene();//draw the scene again    
  resetTimer();
  counter++;
  //if (counter>=20)
  {
    counter=0;
    
    if (turning_left)
    {
      //curdeg-=deginc;
      curdeg-=turn_inc;
      if (curdeg<=135)
      {
        turning_left=false;
        walking_foreward=true;  
        if (leftheel_strike_time[curtrack] >rightheel_strike_time[curtrack])
        {
          left_pelvis_angle=-20;
          right_pelvis_angle=35;
          left_knee_angle=50;
          right_knee_angle=130;
          left_ankle_angle=-90;
          right_ankle_angle=-90;
          left_shoulder_angle=80;
          right_shoulder_angle=40;
          left_elbow_angle=100;
          right_elbow_angle=80;
          left_heel_strike=false;
        }
        else {
          left_pelvis_angle=35;
          right_pelvis_angle=-20;
          left_knee_angle=130;
          right_knee_angle=50;
          left_ankle_angle=-30;
          right_ankle_angle=-90;
          left_shoulder_angle=140;
          right_shoulder_angle=40;
          left_elbow_angle=56;
          right_elbow_angle=124;
        }     
      }
    }
    else if (walking_backward)
    {      
      if (figureposx>-15)
      {
        figureposx-=xinc;
        curdeg+=deginc;
      }
      else if (figureposx<=-15)
      {
        turning_left=true;
        walking_backward=false;
      }
    }
    else if (turning_right)
    {
      //curdeg+=deginc;
      curdeg+=turn_inc;
      if (curdeg>=225)
      {
        turning_right=false;
        walking_backward=true;  
        if (leftheel_strike_time[curtrack] >rightheel_strike_time[curtrack])
        {
          left_pelvis_angle=-20;
          right_pelvis_angle=35;
          left_knee_angle=50;
          right_knee_angle=130;
          //left_ankle_angle=-90;
          //right_ankle_angle=-90;
          left_shoulder_angle=80;
          right_shoulder_angle=40;
          left_elbow_angle=100;
          right_elbow_angle=80;
          left_heel_strike=false;
        }
        else {
          left_pelvis_angle=35;
          right_pelvis_angle=-20;
          left_knee_angle=130;
          right_knee_angle=50;
          //left_ankle_angle=-30;
          //right_ankle_angle=-30;
          left_shoulder_angle=140;
          right_shoulder_angle=40;
          left_elbow_angle=56;
          right_elbow_angle=124;
        }     
      }

    }
    else if (walking_foreward)
    {    
      if (figureposx<15)// && !left_heel_strike)
      {
        //figureposx+=(xinc/10.0);
        figureposx+=xinc;
        curdeg-=(deginc);           
      }
      else if (figureposx>=15)
      {
        walking_foreward=false;
        turning_right=1;
      }      
    }
  }  
  if (!left_heel_strike)
  {
    if (left_pelvis_angle<=35)
        {
          left_pelvis_angle+=pelvis_inc;        
          if (right_pelvis_angle>-20)
            right_pelvis_angle-=pelvis_inc;
        }
        if (left_knee_angle<130)
        {
          left_knee_angle+=knee_inc; 
          if (right_knee_angle>50)         
            right_knee_angle-=(knee_inc*2);
        }
        else {
          left_heel_strike=true;
          //-------
          if (curstep<heel_strike_time[curtrack].length)
          {
              var timediff=heel_strike_time[curtrack][curstep]-heel_strike_time[curtrack][curstep-1];
              pelvis_inc=55/timediff;
              knee_inc=80/timediff;
              ankle_inc=60/timediff;
              shoulder_inc=60/timediff;
              //console.log(timediff);
             // console.log(knee_inc);
              curleftstep++;
              curstep++;
            }
        //---------
        }
        if (left_ankle_angle>-30)
        {
          l//eft_ankle_angle+=ankle_inc;
          //right_ankle_angle-=ankle_inc;
        }
        if (left_shoulder_angle<140)        
          left_shoulder_angle+=shoulder_inc;        
        if (right_shoulder_angle>40)
          right_shoulder_angle-=shoulder_inc;
        
        right_elbow_angle+=elbow_inc;
  }
  else {

    if (right_knee_angle<130)
    {
      if (left_pelvis_angle>-20)
      {
        left_pelvis_angle-=pelvis_inc;
        right_pelvis_angle+=pelvis_inc;
      }
      if (left_knee_angle>50)
        left_knee_angle-=(knee_inc*2);               
      right_knee_angle+=(knee_inc);
      if (left_ankle_angle>-90) 
      {
       // left_ankle_angle-=ankle_inc;
        //right_ankle_angle+=ankle_inc;
      }
      left_shoulder_angle-=(shoulder_inc);
      if (right_shoulder_angle<140)
        right_shoulder_angle+=shoulder_inc;
      right_elbow_angle-=elbow_inc;
      if (left_elbow_angle<120)
        left_elbow_angle+=elbow_inc;
    }
    else {
      left_heel_strike=false;   
      //-------
      if (curstep<heel_strike_time[curtrack].length)
      {
        var timediff=heel_strike_time[curtrack][curstep]-heel_strike_time[curtrack][curstep-1];
        pelvis_inc=55/timediff;
        knee_inc=80/timediff;
        ankle_inc=60/timediff;
        shoulder_inc=60/timediff;
       // console.log(timediff);
        //console.log(knee_inc);
        currightstep++;
        curstep++;          
      }
        //---------       
    }              
  }
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function initBuffers()
{//divide the sphere into triangles through dividing latitudes and longitude bands
    //--------
    initialiseStickFigure(zpos,left_pelvis_angle,left_knee_angle,left_ankle_angle,right_pelvis_angle,
      right_knee_angle,right_ankle_angle,left_shoulder_angle,right_shoulder_angle,
      left_elbow_angle,right_elbow_angle);
    //---------------------------
    var floorvertices=[
    -2,-0.4,-0.5,    
    -2,-0.4,0.5,
    2,-0.4,-0.5,
    2,-0.4,-0.5,
    2,-0.4,0.5,
    -2,-0.4,0.5,
    ];
    floorPositionBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,floorPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(floorvertices),gl.STATIC_DRAW);
    floorPositionBuffer.itemSize=3;
    floorPositionBuffer.numItems=floorvertices.length/3;
    //-----------------
    dummyfloorNormalBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,dummyfloorNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(floorvertices),gl.STATIC_DRAW);
    dummyfloorNormalBuffer.itemSize=3;
    dummyfloorNormalBuffer.numItems=floorvertices.length/3;
    //-------------------

    var cubevertices=[
      //front face  
      -1.0,-1.0,1.0,
      1.0,-1.0,1.0,  
      1.0,1.0,1.0,  
      -1.0,1.0,1.0,  
      //back face  
      -1.0,-1.0,-1.0,  
      -1.0,1.0,-1.0,  
      1.0,1.0,-1.0,  
      1.0,-1.0,-1.0,  
      //top face  
      -1.0,1.0,-1.0,  
      -1.0,1.0,1.0,  
      1.0,1.0,1.0,  
      1.0,1.0,-1.0, 
      //bottom face  
      -1.0,-1.0,-1.0,  
      1.0,-1.0,-1.0,  
      1.0,-1.0,1.0, 
      -1.0,-1.0,1.0,  
      //right face
      1.0,-1.0,-1.0,  
      1.0,1.0,-1.0,
      1.0,1.0,1.0,  
      1.0,-1.0,1.0,  
      //left face  
      -1.0,-1.0,-1.0,  
      -1.0,-1.0,1.0,  
      -1.0,1.0,1.0,  
      -1.0,1.0,-1.0,  ];
      var cubeVertexIndices=[ 
      0, 1, 2, 0, 2, 3,//front face  
      4, 5, 6, 4, 6, 7,//back face  
      8, 9,10, 8,10,11,//top face  
      12,13,14,12,14,15,//bottom face  
      16,17,18,16,18,19, //right face  
      20,21,22,20,22,23//left face  
      ];
    var headvertices=new Array();
    for (var i=0;i<cubevertices.length;i+=3)
    {
        headvertices[i]=cubevertices[i]*0.5;
        headvertices[i+1]=cubevertices[i+1]*0.5+2;//translate
        headvertices[i+2]=cubevertices[i+2]*0.5;
    }
    headPositionBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,headPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(headvertices),gl.STATIC_DRAW);
    headPositionBuffer.itemSize=3;
    headPositionBuffer.numItems=headvertices.length/3;
     //normal buffer
    var vertexNormals=[
    //front face
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    //back face
    0.0, 0.0,-1.0,
    0.0, 0.0,-1.0,
    0.0, 0.0,-1.0,
    0.0, 0.0,-1.0,
    //top face
    0.0,1.0,0.0,
    0.0,1.0,0.0,
    0.0,1.0,0.0,
    0.0,1.0,0.0,
    //bottom face
    0.0,-1.0,0.0,
    0.0,-1.0,0.0,
    0.0,-1.0,0.0,
    0.0,-1.0,0.0,
    //right face
    1.0,0.0,0.0,
    1.0,0.0,0.0,
    1.0,0.0,0.0,
    1.0,0.0,0.0,
    //left face
    -1.0,0.0,0.0,
    -1.0,0.0,0.0,
    -1.0,0.0,0.0,
    -1.0,0.0,0.0,
    ];
    headNormalBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,headNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexNormals),gl.STATIC_DRAW);
    headNormalBuffer.itemSize=3;
    headNormalBuffer.numItems=24;
    
    headIndexBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,headIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(cubeVertexIndices),gl.STATIC_DRAW);      
    headIndexBuffer.itemSize=1;
    headIndexBuffer.numItems=36;

    var torsovertices=new Array();
    for (var i=0;i<cubevertices.length;i+=3)
    {
        torsovertices[i]=cubevertices[i]*1.2;
        torsovertices[i+1]=cubevertices[i+1]*2-1;//translate
        torsovertices[i+2]=cubevertices[i+2]*1.2;
    }
    torsoPositionBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,torsoPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(torsovertices),gl.STATIC_DRAW);
    torsoPositionBuffer.itemSize=3;
    torsoPositionBuffer.numItems=torsovertices/3;

    torsoNormalBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,torsoNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexNormals),gl.STATIC_DRAW);
    torsoNormalBuffer.itemSize=3;
    torsoNormalBuffer.numItems=24;
    
    torsoIndexBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,torsoIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(cubeVertexIndices),gl.STATIC_DRAW);      
    torsoIndexBuffer.itemSize=1;
    torsoIndexBuffer.numItems=36;

}
function initialiseStickFigure(zpos,leftpelvis_angle,leftknee_angle,leftankle_angle,rightpelvis_angle,
              rightknee_angle,rightankle_angle,leftshoulder_angle,rightshoulder_angle,
              leftelbow_angle,rightelbow_angle)
{
  //var zpos=0;  
  var xpos=0;
  var neck_height=2;
  var torso_height=4;
  var head_width=1;
  var shoulder_width=4;
  var pelvis_width=4;
  var shoulder_left=xpos-shoulder_width/2;
  var shoulder_right=xpos+shoulder_width/2;
  var pelvis_left=xpos-pelvis_width/2;
  var pelvis_right=xpos+pelvis_width/2;
  var head_left=xpos-head_width/2;
  var head_right=xpos+head_width/2;
    var upperleglength=3;
    var lowerleglength=3;
    var footlength=1;
    //var leftpelvis_angle=-20;//180- (angle between the pelvis and the upper left)
    //var rightpelvis_angle=20;
    //var leftknee_angle=20;//angle between upper and lower leg ->knee ankle (=90-theta+this)
    //var rightknee_angle=90;
    //var leftankle_angle=-180;
    //var rightankle_angle=90;
    var rleftpelvis_angle=leftpelvis_angle/180.0*Math.PI;
    var rrightpelvis_angle=rightpelvis_angle/180.0*Math.PI;
    var rleftknee_angle=leftknee_angle/180.0*Math.PI;
    var rrightknee_angle=rightknee_angle/180.0*Math.PI;
    var rleftankle_angle=(leftankle_angle-leftknee_angle)/180.0*Math.PI;
    var rrightankle_angle=(rightankle_angle-rightknee_angle)/180.0*Math.PI;
    var leftpelvis=[pelvis_left,-torso_height,zpos];
    var rightpelvis=[pelvis_right,-torso_height,zpos];
    var leftknee=[pelvis_left,leftpelvis[1]-upperleglength*Math.cos(rleftpelvis_angle),leftpelvis[2]+upperleglength*Math.sin(rleftpelvis_angle)];
    var rightknee=[pelvis_right,rightpelvis[1]-upperleglength*Math.cos(rrightpelvis_angle),rightpelvis[2]+upperleglength*Math.sin(rrightpelvis_angle)];
    var leftankle=[pelvis_left,leftknee[1]-lowerleglength*Math.sin(rleftknee_angle),leftknee[2]-lowerleglength*Math.cos(rleftknee_angle)];
    var rightankle=[pelvis_right,rightknee[1]-lowerleglength*Math.sin(rrightknee_angle),rightknee[2]-lowerleglength*Math.cos(rrightknee_angle)];    
    var lefttoe=[pelvis_left,leftankle[1]+footlength*Math.sin(rleftankle_angle),leftankle[2]-footlength*Math.cos(rleftankle_angle)];
    var righttoe=[pelvis_right,rightankle[1]+footlength*Math.sin(rrightankle_angle),rightankle[2]-footlength*Math.cos(rrightankle_angle)];
    var leftshoulder=[shoulder_left,0,zpos];//shoulder]
    var rightshoulder=[shoulder_right,0,zpos];//shoulder]
    var upper_arm_length=3;
    var lower_arm_length=2;
    //var leftshoulder_angle=40;//angle between the shoulder and the upper arm
    //var rightshoulder_angle=80;
    //var leftelbow_angle=50;
    //var rightelbow_angle=120;
    var rleftshoulder_angle=leftshoulder_angle/180.0*Math.PI;
    var rrightshoulder_angle=rightshoulder_angle/180.0*Math.PI;
    var rleftelblow_angle=(leftelbow_angle-90)/180.0*Math.PI;
    var rrightelbow_angle=(rightelbow_angle-90)/180.0*Math.PI;
    var leftupperarm=[shoulder_left,leftshoulder[1]-upper_arm_length*Math.sin(rleftshoulder_angle),leftshoulder[2]+upper_arm_length*Math.cos(rleftshoulder_angle)];
    var rightupperarm=[shoulder_right,rightshoulder[1]-upper_arm_length*Math.sin(rrightshoulder_angle),rightshoulder[2]+upper_arm_length*Math.cos(rrightshoulder_angle)];
    var leftlowerarm=[shoulder_left,leftupperarm[1]-lower_arm_length*Math.sin(rleftelblow_angle),leftupperarm[2]+lower_arm_length*Math.cos(rleftelblow_angle)];
    var rightlowerarm=[shoulder_right,rightupperarm[1]-lower_arm_length*Math.sin(rrightelbow_angle),rightupperarm[2]+lower_arm_length*Math.cos(rrightelbow_angle)];

    var stickvertices=[
      xpos,-torso_height,zpos,//spine
      xpos,neck_height,zpos,
      head_left,neck_height,zpos,//head
      head_right,neck_height,zpos,
      leftshoulder[0],leftshoulder[1],leftshoulder[2],//shoulder
      rightshoulder[0],rightshoulder[1],rightshoulder[2],
      leftshoulder[0],leftshoulder[1],leftshoulder[2],//left upper arm
      leftupperarm[0],leftupperarm[1],leftupperarm[2],
      rightshoulder[0],rightshoulder[1],rightshoulder[2],//right upper arm
      rightupperarm[0],rightupperarm[1],rightupperarm[2],
      leftupperarm[0],leftupperarm[1],leftupperarm[2],//left lower arm
      leftlowerarm[0],leftlowerarm[1],leftlowerarm[2],
      rightupperarm[0],rightupperarm[1],rightupperarm[2],//right lower arm
      rightlowerarm[0],rightlowerarm[1],rightlowerarm[2],
      leftpelvis[0],leftpelvis[1],leftpelvis[2],//pelvis
      rightpelvis[0],rightpelvis[1],rightpelvis[2],
      leftpelvis[0],leftpelvis[1],leftpelvis[2],//left upper leg
      leftknee[0],leftknee[1],leftknee[2],
      rightpelvis[0],rightpelvis[1],rightpelvis[2],//right upper leg
      rightknee[0],rightknee[1],rightknee[2],
      leftknee[0],leftknee[1],leftknee[2],//left lower leg
      leftankle[0],leftankle[1],leftankle[2],
      rightknee[0],rightknee[1],rightknee[2],//right lower leg
      rightankle[0],rightankle[1],rightankle[2],
      leftankle[0],leftankle[1],leftankle[2],//left foot
      lefttoe[0],lefttoe[1],lefttoe[2],
      rightankle[0],rightankle[1],rightankle[2],//right foot
      righttoe[0],righttoe[1],righttoe[2],
    ];
    sticksPositionBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,sticksPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(stickvertices),gl.STATIC_DRAW);
    sticksPositionBuffer.itemSize=3;
    sticksPositionBuffer.numItems=stickvertices.length/3;
    //---------------
    dummystickNormalBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,dummystickNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(stickvertices),gl.STATIC_DRAW);
    dummystickNormalBuffer.itemSize=3;
    dummystickNormalBuffer.numItems=stickvertices.length/3;
}
function handleMouseDown(event) {
  mouseDown=true;
  lastMouseX=event.clientX;
  lastMouseY=event.clientY;
}
function handleMouseUp(event){
  mouseDown=false;
}
function handleMouseMove(event) {
  if (!mouseDown)
    return;
  var newX=event.clientX;
  var newY=event.clientY;
  var deltaX=newX-lastMouseX;
  var newRotationMatrix=mat4.create();
  mat4.identity(newRotationMatrix,newRotationMatrix);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(deltaX/10),[0,1,0]);
  var deltaY=newY-lastMouseY;
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(deltaY/10),[1,0,0]);
  mat4.multiply(moonRotationMatrix,newRotationMatrix,moonRotationMatrix);
  //mat4.multiply(bodyRotationMatrix,newRotationMatrix,bodyRotationMatrix);
  lastMouseX=newX;
  lastMouseY=newY;

}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// initWebGL -  Initialize WebGL, returning the GL context or null if WebGL isn't available or could not be initialized.
function initWebGL(pcanvas) {
  var pgl = null;
  try {
    pgl = pcanvas.getContext("experimental-webgl");//load the web GL onto the canvas
    pgl.viewportWidth=pcanvas.width;//find out the size of the canvas
    pgl.viewportHeight=pcanvas.height;
  }
  catch(e) {
    console.log("exception caught when getting the webGL context");  
  }
  // If we don't have a GL context, give up now
  if (!pgl) alert("Unable to initialize WebGL. Your browser may not support it.");      
  return pgl;}
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
// drawScene
function drawScene() {
  if (!imageisloaded) return;
  // Clear the canvas before we start drawing on it.
  gl.viewport(0,0,gl.viewportWidth,gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
//setting up the perspective to view the sceene
  mat4.perspective(pMatrix,//set the projection martix
                  45,//field of view is 45 degree
                  gl.viewportWidth/gl.viewportHeight,//the width-to-height ratio of our canvas
                  0.1,//show only further than 0.1 units to the viewport
                  100.0);  //show only within 100 units of the view port

  gl.useProgram(no_light_shaderProgram);
  mat4.identity(mvMatrix,mvMatrix);//start with an identity matrix first
  //------------------------------------------------------
  //draw the floor first
  mvPushMatrix();
  mat4.translate(mvMatrix,mvMatrix,[0,-8,-25]);//rotate to the tilt angle
 
  gl.uniform3f(no_light_shaderProgram.lineColor,0.6,0.4,0.4);
  mat4.scale(mvMatrix,mvMatrix,[13,1,15]);
  gl.uniform1i(no_light_shaderProgram.drawLine,true);
  gl.bindBuffer(gl.ARRAY_BUFFER,dummyfloorNormalBuffer);
  gl.vertexAttribPointer(no_light_shaderProgram.vertexNormalAttribute,dummyfloorNormalBuffer.itemSize,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,floorPositionBuffer);
  gl.vertexAttribPointer(no_light_shaderProgram.vertexPositionAttribute,floorPositionBuffer.itemSize,gl.FLOAT,false,0,0);
   gl.uniformMatrix4fv(no_light_shaderProgram.pMatrixUniform, false, pMatrix);
   gl.uniformMatrix4fv(no_light_shaderProgram.mvMatrixUniform, false, mvMatrix);   
   gl.drawArrays(gl.TRIANGLES,0,floorPositionBuffer.numItems);
  mvPopMatrix();
  //------------------------------------------------
  //draw the stick figure
   mat4.translate(mvMatrix,mvMatrix,[figureposx,0,-15]);//rotate to the tilt angle 
  //mat4.multiply(mvMatrix,mvMatrix,moonRotationMatrix);
  var newRotationMatrix=mat4.create();
  mat4.identity(newRotationMatrix,newRotationMatrix);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(curdeg),[0,1,0]);
  mat4.multiply(mvMatrix,mvMatrix,newRotationMatrix);
  //mat4.translate(mvMatrix,mvMatrix,[0,0,figureposx]);//rotate to the tilt angle
  mat4.scale(mvMatrix,mvMatrix,[0.3,0.5,0.3]);
  gl.uniform3f(no_light_shaderProgram.lineColor,1.0,1.0,1.0);
  gl.bindBuffer(gl.ARRAY_BUFFER,dummystickNormalBuffer);
  gl.vertexAttribPointer(no_light_shaderProgram.vertexNormalAttribute,dummystickNormalBuffer.itemSize,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,sticksPositionBuffer);
  gl.vertexAttribPointer(no_light_shaderProgram.vertexPositionAttribute,sticksPositionBuffer.itemSize,gl.FLOAT,false,0,0);
  gl.uniformMatrix4fv(no_light_shaderProgram.pMatrixUniform, false, pMatrix);
   gl.uniformMatrix4fv(no_light_shaderProgram.mvMatrixUniform, false, mvMatrix);   
   
  //gl.drawArrays(gl.LINE_STRIP,0,sticksPositionBuffer.numItems);
  gl.drawArrays(gl.LINES,0,sticksPositionBuffer.numItems); 
  //--------------------------------
  //draw the head
  mvPushMatrix();
  gl.useProgram(shaderProgram);    
    
  gl.uniform3f(shaderProgram.ambientColorUniform,
      parseFloat(document.getElementById("ambientR").value),
      parseFloat(document.getElementById("ambientG").value),
      parseFloat(document.getElementById("ambientB").value));
    var lightingDirection=[
      parseFloat(document.getElementById("lightDirectionX").value),
      parseFloat(document.getElementById("lightDirectionY").value),
      parseFloat(document.getElementById("lightDirectionZ").value)];
      var adjustedLD=vec3.create();//create a vector for the normalised direction
      vec3.normalize(adjustedLD,lightingDirection);  //normalise the lighting direction vector
      vec3.scale(adjustedLD,adjustedLD,-1);//scale by -1
      gl.uniform3fv(shaderProgram.lightingDirectionUniform,adjustedLD);//set the parameter in the shading program


      gl.uniform3f(shaderProgram.directionalColorUniform,
        parseFloat(document.getElementById("directionalR").value),
        parseFloat(document.getElementById("directionalG").value),
        parseFloat(document.getElementById("directionalB").value));
  gl.uniform1i(shaderProgram.useLightingUniform,true);  
  gl.uniform3f(shaderProgram.lineColor,0,0,0.5);
  gl.bindBuffer(gl.ARRAY_BUFFER,headPositionBuffer);  
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,headPositionBuffer.itemSize,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,headNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,headNormalBuffer.itemSize,gl.FLOAT,false,0,0);  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,headIndexBuffer);//bind the index buffer
  setMatrixUniforms();  
  gl.drawElements(gl.TRIANGLES,headIndexBuffer.numItems,gl.UNSIGNED_SHORT,0);  
  mvPopMatrix();
  //draw torso
  mvPushMatrix();
  gl.bindBuffer(gl.ARRAY_BUFFER,torsoPositionBuffer);  
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,torsoPositionBuffer.itemSize,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,torsoNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,torsoNormalBuffer.itemSize,gl.FLOAT,false,0,0);  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,torsoIndexBuffer);//bind the index buffer
  setMatrixUniforms();  
  gl.drawElements(gl.TRIANGLES,torsoIndexBuffer.numItems,gl.UNSIGNED_SHORT,0);  
  mvPopMatrix();

}
function loadShaders(pgl,fragment,vertex,withlight)
{
  var fragmentShader = getShader(pgl, fragment);//load the fragment shader
  var vertexShader = getShader(pgl, vertex);//load the vertex shader
  // Create the shader program  
  var sprog = pgl.createProgram();
  pgl.attachShader(sprog, vertexShader);
  pgl.attachShader(sprog, fragmentShader);
  pgl.linkProgram(sprog);  
  // If creating the shader program failed, alert  
  if (!pgl.getProgramParameter(sprog, pgl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }  
  pgl.useProgram(sprog);
  //set the vertix attribute in the shader program
  sprog.vertexPositionAttribute = pgl.getAttribLocation(sprog, "aVertexPosition");
  pgl.enableVertexAttribArray(sprog.vertexPositionAttribute);
  sprog.vertexNormalAttribute=pgl.getAttribLocation(sprog,"aVertexNormal");
  pgl.enableVertexAttribArray(sprog.vertexNormalAttribute);
  //set the colour attribute in the shader program
  //shaderProgram.textureCoordAttribute=pgl.getAttribLocation(shaderProgram,"aTextureCoord");
  //pgl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
  if(withlight)
  {
    sprog.nMatrixUniform = pgl.getUniformLocation(sprog, "uNMatrix");
    sprog.samplerUniform=pgl.getUniformLocation(sprog,"uSampler");  
    sprog.useLightingUniform=pgl.getUniformLocation(sprog,"uUsingLighting");
    sprog.ambientColorUniform=pgl.getUniformLocation(sprog,"uAmbientColor");
    sprog.lightingDirectionUniform=pgl.getUniformLocation(sprog,"uLightingDirection");
    sprog.directionalColorUniform=pgl.getUniformLocation(sprog,"uDirectionalColor");
    //sprog.lineColor=pgl.getUniformLocation(sprog,"ulineColor");
    //sprog.drawLine=pgl.getUniformLocation(sprog,"udrawlines");
  }
  sprog.lineColor=pgl.getUniformLocation(sprog,"ulineColor");
  sprog.pMatrixUniform=pgl.getUniformLocation(sprog,"uPMatrix");
  sprog.mvMatrixUniform=pgl.getUniformLocation(sprog,"uMVMatrix");
  //setting the parameters in the shading program  
  return sprog;
}

// initShaders - Initialize the shaders, so WebGL knows how to light our scene.
function initShaders() {
  shaderProgram=loadShaders(gl,"shader-fs","shader-vs",true);
  no_light_shaderProgram=loadShaders(gl,"nolighting_shader-fs","nolighting_shader-vs",false);
}

// getShader - Loads a shader program by scouring the current document, looking for a script with the specified ID.
function getShader(pgl, id) {
  var shaderScript = document.getElementById(id);//get the shading script from the HTML file
  // Didn't find an element with the specified ID; abort.
  if (!shaderScript) {  return null;  }
  // Walk through the source element's children, building the
  // shader source string.
  var theSource = "";
  var currentChild = shaderScript.firstChild;
  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    } 
    currentChild = currentChild.nextSibling;
  }
  // Now find out the type of the shader scripts based on its MIME type.
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = pgl.createShader(pgl.FRAGMENT_SHADER);//create the fragment shader
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = pgl.createShader(pgl.VERTEX_SHADER);//create the vertex shader
  } else {
    return null;  // Unknown shader type
  }
  // Send the source to the shader object
  pgl.shaderSource(shader, theSource);
  // Compile the shader program
  pgl.compileShader(shader);
  // See if it compiled successfully
  if (!pgl.getShaderParameter(shader, pgl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + pgl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

//setMatrixUniforms - specify the matrix values of uniform variables
function setMatrixUniforms() {
    //send the uniform matrices onto the shader (i.e. pMatrix->shaderProgram.pMatrixUniform etc.)
   gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
   gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);   
   var normalMatrix=mat3.create();
   mat3.normalFromMat4(normalMatrix,mvMatrix);  //calculate a 3x3 normal matrix (transpose inverse) from a 4x4 matrix
   gl.uniformMatrix3fv(shaderProgram.nMatrixUniform,false,normalMatrix);   
}

function mvPushMatrix()
{//store the mvMatrix into a stack first
  var Acopy=mat4.create();
  mat4.copy(Acopy,mvMatrix)
  mvMatrixStack.push(Acopy);
}
function mvPopMatrix()
{ //get the stored mvMatrix from the stack
  if (mvMatrixStack.length==0)
  {
    throw "invalid pop matrix!";
  }
  mvMatrix=mvMatrixStack.pop();
}
function degToRad(degrees)
{//calculate the radian from degrees
  return degrees*Math.PI/180;
}

