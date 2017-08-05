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
var CylinderVertexNormalBuffer;
var CylinderVertexPositionBuffer;
var CylinderVertexIndexBuffer;
var shaderProgram;//the shader program (needs to be loaded)
var no_light_shaderProgram=null;
var floorPositionBuffer=null;
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
var modelRotationMatrix;
var modelRotationMatrixStack=[];
var moonTexture;
var timer;
var animation_timer;
var counter=0;
var currentlyPressedKeys={};//the key being pressed
//var zoom_rate=0;
var zoom_rate=5;
//var figureposx=-15;
var figureposx=-10;
var figureposy=2;
var nosteps=100;
var xinc=31/nosteps;
var curstep=0;
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
  drawScene();//draw the scene again    
  document.onkeydown=handleKeyDown;//handle key down events
  document.onkeyup=handleKeyUp;//handle key up events
  setAnimatinonTimer();
}
function setAnimatinonTimer(){animation_timer=window.setTimeout(OnAnimationTimer,10);}
function resetAnimationTimer(){
  if (animation_timer){
    window.clearTimeout(animation_timer);
    animation_timer=null;
  }  
  setAnimatinonTimer();}
var walking_direction=1;
function OnAnimationTimer() { 
  if (animation_step<70)
  {
    resetAnimationTimer();
    switch (animation_step)
    {
      case 0:upperbodyangle=0;break;//bend forward
      case 1:case 2:case 3: case 4: case 5://raising the right knee      
      right_hip_angle-=5;
      upperbodyposy-=0.02;
      waist_x+=(walking_direction*0.1);
      right_knee_angle+=10;
      upperbodyangle+=0.5;
      left_upper_arm_angle-=1;
      right_upper_arm_angle+=1;
      break;
      case 6:case 7:case 8: case 9: case 10:
      right_knee_angle-=10;
      left_hip_angle+=2;
      left_knee_angle+=2;
       left_upper_arm_angle-=1;
      right_upper_arm_angle+=1;
      //console.log("right heel strike");
      break;//continue raising the lower leg -> right heel strike
      case 11:case 12:case 13:case 14: case 15:
      waist_x+=(walking_direction*0.1);
      left_hip_angle+=2;//leanng forward (bend the left leg)
       left_upper_arm_angle-=1;
      right_upper_arm_angle+=1;
      break;
      case 16:case 17:case 18:case 19: case 20://right foot flat
      right_hip_angle+=5;
      left_knee_angle+=5;
      upperbodyposy+=0.02;
      left_upper_arm_angle+=1;
      right_upper_arm_angle-=1;
        //console.log("right foot flat");
      break;
      case 21:case 22:case 23:case 24:case 25://mid stance
      left_hip_angle-=2;
      left_knee_angle-=2;      
      upperbodyangle-=0.5;   
      left_upper_arm_angle+=1;
      right_upper_arm_angle-=1;
     // console.log("mid stance");
      break;
      case 26:case 27:case 28:case 29:case 30://standing positinon
      left_hip_angle-=2;
      left_knee_angle-=5;     
      left_upper_arm_angle+=1;
      right_upper_arm_angle-=1;          
      break;
      case 31:case 32:case 33: case 34:case 35://contunue swing the left leg
      left_hip_angle-=5;
      left_knee_angle+=10;
      upperbodyposy-=0.02;
      upperbodyangle+=0.5;
      left_upper_arm_angle+=1;
      right_upper_arm_angle-=1; 
      break;
      case 36:case 37:case 38:case 39:case 40://right heel off
      left_knee_angle-=10;
      right_hip_angle+=2;
      right_knee_angle+=2;
      left_upper_arm_angle+=1;
      right_upper_arm_angle-=1; 
      break;
      case 41:case 42:case 43:case 44: case 45://right toe off
      waist_x+=(walking_direction*0.1);
      right_hip_angle+=2;//leanng forward (bend the right leg)
      left_upper_arm_angle+=1;
      right_upper_arm_angle-=1; 
      break;
      case 46:case 47:case 48:case 49: case 50://left foot flat
      left_hip_angle+=5;
      right_knee_angle+=5;
      upperbodyposy+=0.02;    
      left_upper_arm_angle-=1;
      right_upper_arm_angle+=1;   
      break;
       case 51:case 52:case 53:case 54:case 55://mid stance
      right_hip_angle-=2;
      right_knee_angle-=2;      
      upperbodyangle-=0.5;   
      left_upper_arm_angle-=1;
      right_upper_arm_angle+=1;   
      break;
      case 56:case 57:case 58:case 59:case 60://standing positinon
      right_hip_angle-=2;
      right_knee_angle-=5;        
      left_upper_arm_angle-=1;
      right_upper_arm_angle+=1;     
      break;
      default: 
      if (walking_direction)
      {
        if (waist_x>14)
          waist_x=0;
      //  walking_direction=-1;
      }

      animation_step=-1;break;  
      
    }
    drawScene();
    animation_step++;        
  }
}
//-----------
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
    floorPositionBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,floorPositionBuffer);
    var floorvertices=[
    -2,-0.4,-0.5,    
    -2,-0.4,0.5,
    2,-0.4,-0.5,
    2,-0.4,-0.5,
    2,-0.4,0.5,
    -2,-0.4,0.5,
    ];    
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(floorvertices),gl.STATIC_DRAW);
    floorPositionBuffer.itemSize=3;
    floorPositionBuffer.numItems=6;//floorvertices.length/3;
    dummyfloorNormalBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,dummyfloorNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(floorvertices),gl.STATIC_DRAW);
    dummyfloorNormalBuffer.itemSize=3;
    dummyfloorNormalBuffer.numItems=floorvertices.length/3;

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
    lineNormalBuffer.numItems=arrowvertex.length/3;
 }
////////////////////////////////////////////////
//mouse handling functions
function handleMouseDown(event) {
  mouseDown=true;
  lastMouseX=event.clientX;
  lastMouseY=event.clientY;}
function handleMouseUp(event){mouseDown=false;}
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
  mat4.multiply(modelRotationMatrix,newRotationMatrix,modelRotationMatrix);  
  lastMouseX=newX;
  lastMouseY=newY;
  drawScene();}
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
  drawScene();}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// initWebGL -  Initialize WebGL, returning the GL context or null if WebGL isn't available or could not be initialized.
function initWebGL() {
  var gl = null;
  try {
    gl = glcanvas.getContext("experimental-webgl");//load the web GL onto the canvas
    gl.viewportWidth=glcanvas.width;//find out the size of the canvas
    gl.viewportHeight=glcanvas.height;
  }
  catch(e) {
    console.log("exception caught when getting the webGL context");  
  }
  // If we don't have a GL context, give up now
  if (!gl) alert("Unable to initialize WebGL. Your browser may not support it.");      
  return gl;}
//draw a cylinder
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
function drawScene() {
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
/*  var lightingDirection=[
      parseFloat(document.getElementById("lightDirectionX").value),
      parseFloat(document.getElementById("lightDirectionY").value),
      parseFloat(document.getElementById("lightDirectionZ").value)];*/
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
  
  //right_hip_angle=yangle;
  //right_knee_angle=xangle;
  //right_ankle_angle=zangle;
  //right_elbow_angle=xangle;
  //right_upper_arm_angle=yangle;
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
function loadShaders(fragment,vertex,withlight){
  var fragmentShader = getShader(gl, fragment);//load the fragment shader
  var vertexShader = getShader(gl, vertex);//load the vertex shader
  // Create the shader program  
  var sprog = gl.createProgram();
  gl.attachShader(sprog, vertexShader);
  gl.attachShader(sprog, fragmentShader);
  gl.linkProgram(sprog);  
  // If creating the shader program failed, alert  
  if (!gl.getProgramParameter(sprog, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }  
  gl.useProgram(sprog);
  //set the vertix attribute in the shader program
  sprog.vertexPositionAttribute = gl.getAttribLocation(sprog, "aVertexPosition");
  gl.enableVertexAttribArray(sprog.vertexPositionAttribute);
  //set the colour attribute in the shader program
  //shaderProgram.textureCoordAttribute=gl.getAttribLocation(shaderProgram,"aTextureCoord");
  //gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
  sprog.vertexNormalAttribute=gl.getAttribLocation(sprog,"aVertexNormal");
  gl.enableVertexAttribArray(sprog.vertexNormalAttribute);
  if(withlight)
  {
    sprog.nMatrixUniform = gl.getUniformLocation(sprog, "uNMatrix");
    sprog.samplerUniform=gl.getUniformLocation(sprog,"uSampler");  
    sprog.useLightingUniform=gl.getUniformLocation(sprog,"uUsingLighting");
    sprog.ambientColorUniform=gl.getUniformLocation(sprog,"uAmbientColor");
    sprog.lightingDirectionUniform=gl.getUniformLocation(sprog,"uLightingDirection");
    sprog.directionalColorUniform=gl.getUniformLocation(sprog,"uDirectionalColor");        
  }
  sprog.lineColor=gl.getUniformLocation(sprog,"ulineColor");
  sprog.pMatrixUniform=gl.getUniformLocation(sprog,"uPMatrix");
  sprog.mvMatrixUniform=gl.getUniformLocation(sprog,"uMVMatrix");
  //setting the parameters in the shading program
  return sprog;}
// initShaders - Initialize the shaders, so WebGL knows how to light our scene.
function initShaders() {  
  no_light_shaderProgram=loadShaders("nolighting_shader-fs","nolighting_shader-vs",false);
  shaderProgram=loadShaders( "shader-fs","shader-vs",true);}
// getShader - Loads a shader program by scouring the current document, looking for a script with the specified ID.
function getShader(gl, id) {
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
    shader = gl.createShader(gl.FRAGMENT_SHADER);//create the fragment shader
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);//create the vertex shader
  } else {
    return null;  // Unknown shader type
  }
  // Send the source to the shader object
  gl.shaderSource(shader, theSource);
  // Compile the shader program
  gl.compileShader(shader);
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;}
//setMatrixUniforms - specify the matrix values of uniform variables
function setMatrixUniforms() {
    //send the uniform matrices onto the shader (i.e. pMatrix->shaderProgram.pMatrixUniform etc.)
   gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
   gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);   
   var normalMatrix=mat3.create();
   mat3.normalFromMat4(normalMatrix,mvMatrix);  //calculate a 3x3 normal matrix (transpose inverse) from a 4x4 matrix   
   gl.uniformMatrix3fv(shaderProgram.nMatrixUniform,false,normalMatrix);   }
function mvPushMatrix(){//store the mvMatrix into a stack first
  var Acopy=mat4.create();
  mat4.copy(Acopy,mvMatrix)
  mvMatrixStack.push(Acopy);}
function mvPopMatrix(){ //get the stored mvMatrix from the stack
  if (mvMatrixStack.length==0)
  {
    throw "invalid pop matrix!";
  }
  mvMatrix=mvMatrixStack.pop();}
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
function degToRad(degrees)
 {//calculate the radian from degrees
   return degrees*Math.PI/180;
 }

