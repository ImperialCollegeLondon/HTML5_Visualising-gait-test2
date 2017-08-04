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
var modelRotationMatrix;
var modelRotationMatrixStack=[];
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

var currentlyPressedKeys={};//the key being pressed
//var zoom_rate=0;
var zoom_rate=5;
var figureposy=2;
var yangle=0;
var xangle=0;
var zangle=0;
//-------------------
var lineVertexBuffer;
var lineNormalBuffer;
//----------------
//3D body model
  var cylinder_shoulder_width=1;    
  var shoulder_width=1.35;  
  var shoulder_y=0.1;
  var shoulder_diameter=0.2;
  var cylinder_arm_diameter=0.12;
  var arm_diameter=0.6;
  var lower_arm_diameter=0.3
  var cone_offset=0.2;//counter for the burge out cone of the cylinders  
  var cylinder_upper_arm_length=0.6;
  var upper_arm_length=1.5;
  var cylinder_upper_arm_y=0;//-0.5
  var upper_arm_z_offset=0.5;
  var upper_arm_y_offset=0.25;
  var lower_arm_y_offset=0.3;
  var lower_arm_z_offset=0.3;
  var lower_arm_x_offset=0.3;
  var left_upper_arm_angle=10;
  var right_upper_arm_angle=10;
  var cylinder_lower_arm_length=0.4
  var lower_arm_length=1.5
  var left_elbow_angle=-20;//yangle+90;
  var right_elbow_angle=-20;
  var hand_length=1;
  var hand_diameter=0.5;
  var thigh_y_offset=-2.2;
  var cylinder_thigh_diameter=0.16;
  var thigh_diameter=0.5;
  var shin_diameter=thigh_diameter;
  var cylinder_shin_diameter=cylinder_thigh_diameter;
  var waist_diameter=0.2;
  var waist_length=0.2;
  var waist_y=-1.8;
  var hip_y=-2.2;
  var hip_diameter=0.3;
  var hip_width=0.7;
  var leg_offset=0.1;
  var cylinder_thigh_length=0.7;
  var thigh_length=2.3;
  var cylinder_shin_length=0.6;
  var shin_length=2;
  var shin_y=-2.2;
  var foot_y=0.1;
  var cylinder_foot_diameter=0.2;
  var cylinder_foot_length=0.3;
  var foot_diameter=0.8;
  var foot_length=1.2;
  var left_hip_angle=0;
  var right_hip_angle=xangle;
  var left_knee_angle=0
  var right_knee_angle=yangle;;
  var left_ankle_angle=0;
  var right_ankle_angle=0;
//--------------
//animation
var animation_step=0;
var upperbodyangle=0;
var waist_x=0;
var upperbodyposy=0;
//------------------------
// start - initialise the buffer and GL
function start() {
  glcanvas = document.getElementById("glcanvas");

  gl=initWebGL(glcanvas);      // Initialize the GL context
  
  if (!gl) return;//Web GL is not available so, quit!
  mvMatrix = mat4.create();//create the model matrix 
  pMatrix = mat4.create();//create the projection matrx  
  moonRotationMatrix=mat4.create();
  mat4.identity(moonRotationMatrix,moonRotationMatrix);
  modelRotationMatrix=mat4.create();  
  mat4.identity(modelRotationMatrix,modelRotationMatrix);  
  //-------
  mat4.rotate(modelRotationMatrix,modelRotationMatrix,degToRad(90),[0,1,0]);//side view
  //-------
  
  initShaders(); //initialise the shaders     
  initBuffers();  
  init_Skeleton(gl,shoulder_width,upper_arm_length,arm_diameter,upper_arm_y_offset,upper_arm_z_offset,                
        lower_arm_length,lower_arm_diameter,lower_arm_x_offset,lower_arm_y_offset,lower_arm_z_offset,
        hand_length,hand_diameter,hip_width,thigh_y_offset,thigh_length,thigh_diameter,
        shin_length,shin_diameter, foot_length,foot_diameter);
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
  document.onkeydown=handleKeyDown;//handle key down events
  document.onkeyup=handleKeyUp;//handle key up events
  
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
  //drawScene();//draw the scene again    
  drawSkeletonScene();
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
function initBuffers(){//divide the sphere into triangles through dividing latitudes and longitude bands
  //divide the sphere into triangles through dividing latitudes and longitude bands
    var radius=parseFloat(document.getElementById("radius").value);;//radius of the sphere
    var roundness=parseInt(document.getElementById("roundness").value);;
    var norows=parseFloat(document.getElementById("norows").value);
    var pbuffers=initCylinderBuffer(radius,roundness,norows,gl);
    CylinderVertexPositionBuffer=pbuffers[0];
    CylinderVertexNormalBuffer=pbuffers[1];
    CylinderVertexIndexBuffer=pbuffers[2];
    //--------
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
      -1.0,0.0,0.0,];
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


    var arrowvertex=[
      -0.2,0.8,0,    
      0,1,0,
      0,1,0,
      0.2,0.8,0,
      0.2,0.8,0,
      -0.2,0.8,0,    
      0,1,0,
      0,0,0,
      0,0.8,-0.2,
      0,1,0,
      0,1,0,
      0,0.8,0.2,
      0,0.8,0.2,
      0,0.8,-0.2,];
    lineVertexBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,lineVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(arrowvertex),gl.STATIC_DRAW);
    lineVertexBuffer.itemSize=3;
    lineVertexBuffer.numItems=arrowvertex.length/3;
    lineNormalBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,lineNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(arrowvertex),gl.STATIC_DRAW);
    lineNormalBuffer.itemSize=3;
    lineNormalBuffer.numItems=arrowvertex.length/3;}
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
  lastMouseX=newX;
  lastMouseY=newY;

}
//-----------------------------------------
//keyboard event handlers
function handleKeyDown(event) {//handler for key down events
  currentlyPressedKeys[event.keyCode]=true; 
  handleKeys();}
function handleKeyUp(event){  currentlyPressedKeys[event.keyCode]=false;  }//handler for key down events
function handleKeys(){//handler for key pressed
  if (currentlyPressedKeys[33])//page up
    zoom_rate+=1;
  else if (currentlyPressedKeys[34])//page down
    zoom_rate-=1; 
  if (currentlyPressedKeys[38]||currentlyPressedKeys[87])//up cursor key or w
  {
    //if (yangle<45)
    yangle +=5;
  }
  else if (currentlyPressedKeys[40]|| currentlyPressedKeys[83])//down cursor key or x
  {
    //if (yangle>-45)
    yangle-=5;
  }
  if (currentlyPressedKeys[37])//left cursor key or A    
    xangle-=5;
  else if (currentlyPressedKeys[39])//right cursor or D
    xangle+=5;
  if (currentlyPressedKeys[65])//A
    zangle-=5;
  else if (currentlyPressedKeys[68])//D
    zangle+=5;
  //drawScene();
  drawSkeletonScene();
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
function drawCylinder(posx,posy,posz,scalex,scaley,scalez,rotatex,rotatey,rotatez,colorr,colorg,colorb){
  mvPushMatrix();  
  var newRotationMatrix=mat4.create();
  mat4.identity(newRotationMatrix,newRotationMatrix);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(rotatey),[0,1,0]);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(rotatex),[1,0,0]);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(rotatez),[0,0,1]);        
  mat4.translate(mvMatrix,mvMatrix,[figureposx,figureposy,-15+zoom_rate]);//translate for viewing              
  mat4.multiply(mvMatrix,mvMatrix,modelRotationMatrix);//rotate with the model
  mat4.translate(mvMatrix,mvMatrix,[posx,posy,posz]);//transate to the position 
  mat4.multiply(mvMatrix,mvMatrix,newRotationMatrix);//rotate the shape    
  mat4.scale(mvMatrix,mvMatrix,[scalex,scaley,scalez]);//scale  
  gl.uniform3f(shaderProgram.lineColor,colorr,colorg,colorb);
  gl.bindBuffer(gl.ARRAY_BUFFER,CylinderVertexPositionBuffer);  
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,CylinderVertexPositionBuffer.itemSize,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,CylinderVertexNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,CylinderVertexNormalBuffer.itemSize,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,CylinderVertexIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES,CylinderVertexIndexBuffer.numItems,gl.UNSIGNED_SHORT, 0);  
  mvPopMatrix();}
function drawArrow(posx,posy,posz,scalex,scaley,scalez,rotatex,rotatey,rotatez,colorr,colorg,colorb){//draw an arrow
  gl.useProgram(no_light_shaderProgram);        
  mvPushMatrix();
  var newRotationMatrix=mat4.create();
  mat4.identity(newRotationMatrix,newRotationMatrix);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(rotatex),[0,1,0]);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(rotatey),[1,0,0]);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(rotatez),[0,0,1]);        
  mat4.translate(mvMatrix,mvMatrix,[figureposx,figureposy,-15+zoom_rate]);//translate for viewing              
  mat4.multiply(mvMatrix,mvMatrix,modelRotationMatrix);//rotate with the model
  mat4.translate(mvMatrix,mvMatrix,[posx,posy,posz]);//transate to the position 
  mat4.multiply(mvMatrix,mvMatrix,newRotationMatrix);//rotate the shape    
  mat4.scale(mvMatrix,mvMatrix,[scalex,scaley,scalez]);//scale  
  gl.uniform3f(no_light_shaderProgram.lineColor,colorr,colorg,colorb);

  gl.bindBuffer(gl.ARRAY_BUFFER,lineNormalBuffer);  
  gl.vertexAttribPointer(no_light_shaderProgram.vertexNormalAttribute,lineNormalBuffer.itemSize,gl.FLOAT,false,0,0);    
  gl.bindBuffer(gl.ARRAY_BUFFER,lineVertexBuffer);  
  gl.vertexAttribPointer(no_light_shaderProgram.vertexPositionAttribute,lineVertexBuffer.itemSize,gl.FLOAT,false,0,0);
  gl.uniformMatrix4fv(no_light_shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(no_light_shaderProgram.mvMatrixUniform, false, mvMatrix);   
  gl.drawArrays(gl.LINES,0,lineVertexBuffer.numItems);  
  mvPopMatrix();
  gl.useProgram(shaderProgram);        }
// drawScene  
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

// drawSkeletonScene
function drawSkeletonScene() {
  if (!imageisloaded) return;
  if (!floorPositionBuffer||!no_light_shaderProgram) return;
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
  gl.bindBuffer(gl.ARRAY_BUFFER,dummyfloorNormalBuffer);
  gl.vertexAttribPointer(no_light_shaderProgram.vertexNormalAttribute,dummyfloorNormalBuffer.itemSize,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,floorPositionBuffer);
  gl.vertexAttribPointer(no_light_shaderProgram.vertexPositionAttribute,floorPositionBuffer.itemSize,gl.FLOAT,false,0,0);
  gl.uniformMatrix4fv(no_light_shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(no_light_shaderProgram.mvMatrixUniform, false, mvMatrix);   
  gl.drawArrays(gl.TRIANGLES,0,floorPositionBuffer.numItems);
  mvPopMatrix();
  
  //==================================================================================
  //draw 3D shape person
  //set up the shader and lighting first
  gl.useProgram(shaderProgram);        
  gl.uniform3f(shaderProgram.ambientColorUniform,
      parseFloat(document.getElementById("ambientR").value),
      parseFloat(document.getElementById("ambientG").value),
      parseFloat(document.getElementById("ambientB").value));
  var lightingDirection=[2,2,2];
  var adjustedLD=vec3.create();//create a vector for the normalised direction
  vec3.normalize(adjustedLD,lightingDirection);  //normalise the lighting direction vector
  vec3.scale(adjustedLD,adjustedLD,-1);//scale by -1  
  gl.uniform3fv(shaderProgram.lightingDirectionUniform,adjustedLD);//set the parameter in the shading program

  gl.uniform3f(shaderProgram.directionalColorUniform,
        parseFloat(document.getElementById("directionalR").value),
        parseFloat(document.getElementById("directionalG").value),
        parseFloat(document.getElementById("directionalB").value));
  gl.uniform3f(shaderProgram.lineColor,1.0,1.0,1.0);
  gl.uniform1i(shaderProgram.useLightingUniform,true);  
  //draw the 3D shapes using cylinders
  var right_lower_arm_angle=180+right_elbow_angle+right_upper_arm_angle;
  var left_lower_arm_angle=180+left_elbow_angle+left_upper_arm_angle;
  var left_leg_angle=left_hip_angle+left_knee_angle;
  var right_leg_angle=right_hip_angle+right_knee_angle;
  var left_lowleg_angle=left_ankle_angle+left_leg_angle;
  var right_lowleg_angle=right_ankle_angle+right_leg_angle;

  mvPushMatrix();
  mat4.translate(mvMatrix,mvMatrix,[waist_x,upperbodyposy,0]);
  drawSkeleton(gl,figureposx,figureposy,zoom_rate,modelRotationMatrix,upperbodyangle,
        mvMatrix,pMatrix,shaderProgram,       
        PushRotationMatrix,PopRotationMatrix,        
        left_upper_arm_angle,right_upper_arm_angle,                
        left_hip_angle,right_hip_angle,                                
        right_lower_arm_angle,left_lower_arm_angle,
        left_leg_angle,right_leg_angle,left_lowleg_angle,right_lowleg_angle);
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
function PushRotationMatrix(){
    var Acopy=mat4.create();
    mat4.copy(Acopy,modelRotationMatrix);
    modelRotationMatrixStack.push(Acopy);}
function PopRotationMatrix(){
    if (modelRotationMatrixStack.length==0)
    {
      throw "invalid pop rotational matrix";
    }
    modelRotationMatrix=modelRotationMatrixStack.pop();
}

