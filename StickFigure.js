//*************************************************************
// Gait visualisation -  stick Figure
//
// Create a stick figure for visualsing gait
//
// Benny Lo 
//July 28 2017
//****************************************************************
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
    dummystickNormalBuffer.numItems=stickvertices.length/3;}