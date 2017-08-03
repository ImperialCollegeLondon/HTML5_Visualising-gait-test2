//*************************************************************
// Gait visualisation - right foot sensor
//
// shoe model was downloaded from http://www.cadnav.com
// then 3D Max to convert it to OBJ file
// then used the JNetCAD to convert it to JSON (http://www.johannes-raida.de/jnetcad.htm)
//
//
// Benny Lo 
//Aug 1 2017
//****************************************************************
var right_foot_glcanvas;//canvas on the web page
var right_foot_gl;//the GL
var right_foot_shaderProgram;//the shader program (needs to be loaded)
var right_foot_no_light_shaderProgram;
var right_foot_SensorPositionBuffer;
var right_foot_SensorIndexBuffer;
var right_foot_SensorNormalBuffer;
var right_foot_axisVertexBuffer;
var right_foot_axisNormalBuffer;
var right_foot_mvMatrix; //model-view matrix
var right_foot_pMatrix;  //projection matrix
var right_foot_mvMatrixStack=[];//stack for storing the mvMatrix
var right_foot_mouseDown=false;
var right_foot_lastMouseX=null;
var right_foot_lastMouseY=null;
var right_foot_SensorRotationMatrix;
var right_foot_timer;
var right_foot_viewanglex=15,right_foot_viewangley=-15,right_foot_viewanglez=0;
var right_shoe_verticeBuffer;
var right_shoe_NormalBuffer;
var right_shoe_TextureCoordBuffer;
var right_shoe_IndexBuffer;
var right_foot_currentlyPressedKeys={};//the key being pressed
var right_foot_light_x=-4,right_foot_light_y=4,right_foot_light_z=0.8;
var right_foot_light_text=null;

function right_foot_start() {
  right_foot_glcanvas = document.getElementById("rightfootcanvas");
  right_foot_light_text=document.getElementById("rightlightdir");

  right_foot_gl=initWebGL(right_foot_glcanvas);      // Initialize the GL context
  
  if (!right_foot_gl) return;//Web GL is not available so, quit!
  right_foot_mvMatrix = mat4.create();//create the model matrix 
  right_foot_pMatrix = mat4.create();//create the projection matrx  
  right_foot_SensorRotationMatrix=mat4.create();  
  mat4.identity(right_foot_SensorRotationMatrix,right_foot_SensorRotationMatrix);  
  right_foot_initShaders(); //initialise the shaders     
  right_foot_initBuffers();    
  //loadRightShoe("./3D models/right_shoe_1.json");
  loadRightShoe("./3D models/left_shoe_1.json");
  right_foot_gl.clearColor(0.0,0.0,0.0,1.0);//clear the canvas
  right_foot_gl.enable(right_foot_gl.DEPTH_TEST);  //enable depth test -> d
  right_foot_glcanvas.onmousedown=right_foot_handleMouseDown;
  right_foot_glcanvas.onmouseup=right_foot_handleMouseUp;
  document.onmousemove=right_foot_handleMouseMove;

  right_foot_glcanvas.addEventListener("keydown",right_foot_handleKeyDown);//handle key down events
  right_foot_glcanvas.addEventListener("keyup",right_foot_handleKeyUp);//handle key up events
  //document.onkeydown=right_foot_handleKeyDown;
  
  //setTimer();    
  right_foot_drawScene();  
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function right_foot_initBuffers(){//divide the sphere into triangles through dividing latitudes and longitude bands    
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
    right_foot_SensorPositionBuffer=right_foot_gl.createBuffer();
    right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_SensorPositionBuffer);
    right_foot_gl.bufferData(right_foot_gl.ARRAY_BUFFER,new Float32Array(cubevertices),right_foot_gl.STATIC_DRAW);
    right_foot_SensorPositionBuffer.itemSize=3;
    right_foot_SensorPositionBuffer.numItems=cubevertices.length/3;
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
    right_foot_SensorNormalBuffer=right_foot_gl.createBuffer();
    right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_SensorNormalBuffer);
    right_foot_gl.bufferData(right_foot_gl.ARRAY_BUFFER,new Float32Array(vertexNormals),right_foot_gl.STATIC_DRAW);
    right_foot_SensorNormalBuffer.itemSize=3;
    right_foot_SensorNormalBuffer.numItems=24;
    
    right_foot_SensorIndexBuffer=right_foot_gl.createBuffer();
    right_foot_gl.bindBuffer(right_foot_gl.ELEMENT_ARRAY_BUFFER,right_foot_SensorIndexBuffer);
    right_foot_gl.bufferData(right_foot_gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(cubeVertexIndices),right_foot_gl.STATIC_DRAW);      
    right_foot_SensorIndexBuffer.itemSize=1;
    right_foot_SensorIndexBuffer.numItems=36;

    var arrowvertex=[
	    -0.2,2.3,0,    
	    0,2.5,0,
	    0,2.5,0,
	    0.2,2.3,0,
	    0.2,2.3,0,
	    -0.2,2.3,0,    
	    0,2.5,0,
	    0,-2.5,0,
	    0,2.3,-0.2,
	    0,2.5,0,
	    0,2.5,0,
	    0,2.3,0.2,
	    0,2.3,0.2,
	    0,2.3,-0.2,];
    right_foot_axisVertexBuffer=right_foot_gl.createBuffer();
    right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_axisVertexBuffer);
    right_foot_gl.bufferData(right_foot_gl.ARRAY_BUFFER,new Float32Array(arrowvertex),right_foot_gl.STATIC_DRAW);
    right_foot_axisVertexBuffer.itemSize=3;
    right_foot_axisVertexBuffer.numItems=arrowvertex.length/3;
    right_foot_axisNormalBuffer=right_foot_gl.createBuffer();
    right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_axisNormalBuffer);
    right_foot_gl.bufferData(right_foot_gl.ARRAY_BUFFER,new Float32Array(arrowvertex),right_foot_gl.STATIC_DRAW);
    right_foot_axisNormalBuffer.itemSize=3;
    right_foot_axisNormalBuffer.numItems=arrowvertex.length/3;}
//=========================================
function loadRightShoe(filename)
{//load the mac book JSON file
  var request=new XMLHttpRequest();
  request.open("GET",filename);
  request.onreadystatechange=function(){
    if (request.readyState==4)
    {
      handleLoadedRightShoe(JSON.parse(request.responseText));//JSON parse and create the vertices of the laptop
    }
  }
  request.send();
}
function isBitSet( value, position ) {

    return value & ( 1 << position );

  }
function handleLoadedRightShoe(ShoeData)
{   
  right_shoe_verticeBuffer=right_foot_gl.createBuffer();  
  right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_shoe_verticeBuffer);  
  right_foot_gl.bufferData(right_foot_gl.ARRAY_BUFFER,new Float32Array(ShoeData.vertices),right_foot_gl.STATIC_DRAW);
  right_shoe_verticeBuffer.itemSize=3;  
  right_shoe_verticeBuffer.numItems=ShoeData.vertices.length/3;
  
  
  right_shoe_IndexBuffer=right_foot_gl.createBuffer();
  right_foot_gl.bindBuffer(right_foot_gl.ELEMENT_ARRAY_BUFFER,right_shoe_IndexBuffer);
  var indices=[];
  var normals=[];
  for (var i=0;i<ShoeData.faces.length;i+=10)
  {
    var type=ShoeData.faces[i];
    var isQuad            = isBitSet( type, 0 );
    var hasMaterial         = isBitSet( type, 1 );
    var hasFaceUv           = isBitSet( type, 2 );
    var hasFaceVertexUv     = isBitSet( type, 3 );
    var hasFaceNormal       = isBitSet( type, 4 );
    var hasFaceVertexNormal = isBitSet( type, 5 );
    var hasFaceColor      = isBitSet( type, 6 );
    var hasFaceVertexColor  = isBitSet( type, 7 );
    if (hasFaceVertexNormal)
    {
      for (var j=0;j<3;j++)
      {
        var normalindex=ShoeData.faces[i+4+j]*3;
        normals.push(ShoeData.normals[normalindex++]);
        normals.push(ShoeData.normals[normalindex++]);
        normals.push(ShoeData.normals[normalindex++]);
      }
    }
    indices.push(ShoeData.faces[i+1]);
    indices.push(ShoeData.faces[i+2]);
    indices.push(ShoeData.faces[i+3]);
  }
  right_foot_gl.bufferData(right_foot_gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),right_foot_gl.STREAM_DRAW);  
  right_shoe_IndexBuffer.itemSize=1;
  right_shoe_IndexBuffer.numItems=indices.length;  
  right_shoe_NormalBuffer=right_foot_gl.createBuffer();  
  right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_shoe_NormalBuffer);  
  //right_foot_gl.bufferData(right_foot_gl.ARRAY_BUFFER,new Float32Array(ShoeData.normals),right_foot_gl.STATIC_DRAW);
  right_foot_gl.bufferData(right_foot_gl.ARRAY_BUFFER,new Float32Array(normals),right_foot_gl.STATIC_DRAW);
  //right_foot_gl.bufferData(right_foot_gl.ARRAY_BUFFER,new Float32Array(ShoeData.vertices),right_foot_gl.STATIC_DRAW);
  right_shoe_NormalBuffer.itemSize=3;  
  //right_shoe_NormalBuffer.numItems=ShoeData.normals.length/3;
  right_shoe_NormalBuffer.numItems=normals.length/3;
  //right_shoe_NormalBuffer.numItems=ShoeData.vertices.length/3;  
}
//-----------------------------------------
//keyboard event handlers
function right_foot_handleKeyDown(event)
{//handler for key down events
  right_foot_currentlyPressedKeys[event.keyCode]=true; 
  right_foot_handleKeys();//handle key pressed events  
}
function right_foot_handleKeyUp(event)
{//handler for key down events
  right_foot_currentlyPressedKeys[event.keyCode]=false;    
}
function right_foot_handleKeys()
{//handler for key pressed
  if (right_foot_currentlyPressedKeys[33])//page up
    right_foot_light_z+=0.1;
  else if (right_foot_currentlyPressedKeys[34])//page down
    right_foot_light_z-=0.1; 
  if (right_foot_currentlyPressedKeys[38]||right_foot_currentlyPressedKeys[87])//up cursor key or w
  {
    //if (yangle<45)
    right_foot_light_y +=0.1;
  }
  else if (right_foot_currentlyPressedKeys[40]|| right_foot_currentlyPressedKeys[83])//down cursor key or x
  {
    //if (yangle>-45)
    right_foot_light_y-=0.1;
  }
  if (right_foot_currentlyPressedKeys[37]||right_foot_currentlyPressedKeys[65])//left cursor key or A    
    right_foot_light_x-=0.1;
  else if (right_foot_currentlyPressedKeys[39]||right_foot_currentlyPressedKeys[68])//right cursor or D
    right_foot_light_x+=0.1;
  if (right_foot_light_text!=null)
  {
    right_foot_light_text.innerHTML="Light direction:"+right_foot_light_x+","+right_foot_light_y+","+right_foot_light_z;
  }
  right_foot_drawScene();
}
//--------------------------------------------------
//mouse handling functions
function right_foot_handleMouseDown(event) {
  right_foot_mouseDown=true;
  right_foot_lastMouseX=event.clientX;
  right_foot_lastMouseY=event.clientY;
}
function right_foot_handleMouseUp(event){  right_foot_mouseDown=false;}
function right_foot_handleMouseMove(event) {
  if (!right_foot_mouseDown)
    return;
  var newX=event.clientX;
  var newY=event.clientY;
  var deltaX=newX-right_foot_lastMouseX;
  var newRotationMatrix=mat4.create();
  mat4.identity(newRotationMatrix,newRotationMatrix);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(deltaX/10),[0,1,0]);
  var deltaY=newY-right_foot_lastMouseY;
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(deltaY/10),[1,0,0]);
  mat4.multiply(right_foot_SensorRotationMatrix,newRotationMatrix,right_foot_SensorRotationMatrix);
  //mat4.multiply(bodyRotationMatrix,newRotationMatrix,bodyRotationMatrix);
  right_foot_lastMouseX=newX;
  right_foot_lastMouseY=newY;
	right_foot_drawScene();
	}
//----------------------------------------
function right_foot_sensor_rotate(anglex,angley,anglez)
{
  	mat4.identity(right_foot_SensorRotationMatrix,right_foot_SensorRotationMatrix);
  	mat4.rotate(right_foot_SensorRotationMatrix,right_foot_SensorRotationMatrix,degToRad(angley),[0,1,0]);  	
  	mat4.rotate(right_foot_SensorRotationMatrix,right_foot_SensorRotationMatrix,degToRad(anglex),[1,0,0]);
  	mat4.rotate(right_foot_SensorRotationMatrix,right_foot_SensorRotationMatrix,degToRad(anglez),[0,0,1]);  	  	
	right_foot_drawScene();
}
//--------------------------------------------
// drawScene
function right_foot_drawScene() {  
  // Clear the canvas before we start drawing on it.
  right_foot_gl.viewport(0,0,right_foot_gl.viewportWidth,right_foot_gl.viewportHeight);
  right_foot_gl.clear(right_foot_gl.COLOR_BUFFER_BIT | right_foot_gl.DEPTH_BUFFER_BIT);  
//setting up the perspective to view the sceene
  mat4.perspective(right_foot_pMatrix,45,right_foot_gl.viewportWidth/right_foot_gl.viewportHeight,0.1,100.0);  //set the projection martix  
  
  mat4.identity(right_foot_mvMatrix,right_foot_mvMatrix);//start with an identity matrix first    
  //draw the y-axis
  right_foot_mvPushMatrix();
  right_foot_gl.useProgram(right_foot_no_light_shaderProgram);           
  gl.uniform1i(right_foot_no_light_shaderProgram.drawLine,true); 
  mat4.translate(right_foot_mvMatrix,right_foot_mvMatrix,[0,0,-5]);//rotate to the tilt angle	
  right_foot_gl.uniform3f(right_foot_no_light_shaderProgram.lineColor,1.0,1.0,1.0);  
  right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_axisNormalBuffer);
  mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewanglez),[0,0,1]);  	
  mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewanglex),[1,0,0]);  
  mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewangley),[0,1,0]);  	
  right_foot_gl.vertexAttribPointer(right_foot_no_light_shaderProgram.vertexNormalAttribute,right_foot_axisNormalBuffer.itemSize,right_foot_gl.FLOAT,false,0,0);    
  right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_axisVertexBuffer);  
  right_foot_gl.vertexAttribPointer(right_foot_no_light_shaderProgram.vertexPositionAttribute,right_foot_axisVertexBuffer.itemSize,right_foot_gl.FLOAT,false,0,0);
  right_foot_gl.uniformMatrix4fv(right_foot_no_light_shaderProgram.pMatrixUniform, false, right_foot_pMatrix);
   right_foot_gl.uniformMatrix4fv(right_foot_no_light_shaderProgram.mvMatrixUniform, false, right_foot_mvMatrix);   
  right_foot_gl.drawArrays(gl.LINES,0,right_foot_axisVertexBuffer.numItems);  
  right_foot_mvPopMatrix();
  //draw the x-axis
  right_foot_mvPushMatrix();
  right_foot_gl.useProgram(right_foot_no_light_shaderProgram);           
  gl.uniform1i(right_foot_no_light_shaderProgram.drawLine,true); 
  mat4.translate(right_foot_mvMatrix,right_foot_mvMatrix,[0,0,-5]);//rotate to the tilt angle	
  right_foot_gl.uniform3f(right_foot_no_light_shaderProgram.lineColor,1.0,0,1.0);  
  var newRotationMatrix=mat4.create();
  mat4.identity(newRotationMatrix,newRotationMatrix);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(90),[0,0,1]);  	
  
  mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewanglez),[0,0,1]);
  mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewanglex),[1,0,0]);
  mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewangley),[0,1,0]);  	    	
  mat4.multiply(right_foot_mvMatrix,right_foot_mvMatrix,newRotationMatrix);
  right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_axisNormalBuffer);
  right_foot_gl.vertexAttribPointer(right_foot_no_light_shaderProgram.vertexNormalAttribute,right_foot_axisNormalBuffer.itemSize,right_foot_gl.FLOAT,false,0,0);    
  right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_axisVertexBuffer);  
  right_foot_gl.vertexAttribPointer(right_foot_no_light_shaderProgram.vertexPositionAttribute,right_foot_axisVertexBuffer.itemSize,right_foot_gl.FLOAT,false,0,0);
  right_foot_gl.uniformMatrix4fv(right_foot_no_light_shaderProgram.pMatrixUniform, false, right_foot_pMatrix);
   right_foot_gl.uniformMatrix4fv(right_foot_no_light_shaderProgram.mvMatrixUniform, false, right_foot_mvMatrix);   
  right_foot_gl.drawArrays(gl.LINES,0,right_foot_axisVertexBuffer.numItems);  
  right_foot_mvPopMatrix();
    //draw the z-axis
  right_foot_mvPushMatrix();
  right_foot_gl.useProgram(right_foot_no_light_shaderProgram);           
  gl.uniform1i(right_foot_no_light_shaderProgram.drawLine,true); 
  mat4.translate(right_foot_mvMatrix,right_foot_mvMatrix,[0,0,-5]);//rotate to the tilt angle	
  right_foot_gl.uniform3f(right_foot_no_light_shaderProgram.lineColor,1.0,1.0,0);  
  var newRotationMatrix=mat4.create();
  mat4.identity(newRotationMatrix,newRotationMatrix);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(90),[1,0,0]);  	
  
  mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewanglez),[0,0,1]);  
  mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewanglex),[1,0,0]);  	
  mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewangley),[0,1,0]);  	
  mat4.multiply(right_foot_mvMatrix,right_foot_mvMatrix,newRotationMatrix);
  right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_axisNormalBuffer);
  right_foot_gl.vertexAttribPointer(right_foot_no_light_shaderProgram.vertexNormalAttribute,right_foot_axisNormalBuffer.itemSize,right_foot_gl.FLOAT,false,0,0);    
  right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_axisVertexBuffer);  
  right_foot_gl.vertexAttribPointer(right_foot_no_light_shaderProgram.vertexPositionAttribute,right_foot_axisVertexBuffer.itemSize,right_foot_gl.FLOAT,false,0,0);
  right_foot_gl.uniformMatrix4fv(right_foot_no_light_shaderProgram.pMatrixUniform, false, right_foot_pMatrix);
   right_foot_gl.uniformMatrix4fv(right_foot_no_light_shaderProgram.mvMatrixUniform, false, right_foot_mvMatrix);   
  right_foot_gl.drawArrays(gl.LINES,0,right_foot_axisVertexBuffer.numItems);  
  right_foot_mvPopMatrix();
  //--------------------------------
  //draw a cube
    /*right_foot_mvPushMatrix();
    mat4.translate(right_foot_mvMatrix,right_foot_mvMatrix,[0,0,-5]);//rotate to the tilt angle
    right_foot_gl.useProgram(right_foot_shaderProgram);        
    right_foot_gl.uniform3f(right_foot_shaderProgram.ambientColorUniform,
        parseFloat(document.getElementById("ambientR").value)*.5,
        parseFloat(document.getElementById("ambientG").value)*.5,
        parseFloat(document.getElementById("ambientB").value)*.5);
        var lightingDirection=[1,1,-5];
        var adjustedLD=vec3.create();//create a vector for the normalised direction
    vec3.normalize(adjustedLD,lightingDirection);  //normalise the lighting direction vector
    vec3.scale(adjustedLD,adjustedLD,-1);//scale by -1  
      mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewanglez),[0,0,1]);  
    mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewanglex),[1,0,0]);  	
    mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewangley),[0,1,0]); 
    mat4.multiply(right_foot_mvMatrix,right_foot_mvMatrix,right_foot_SensorRotationMatrix);
    mat4.scale(right_foot_mvMatrix,right_foot_mvMatrix,[0.6,0.4,0.4]);
    right_foot_gl.uniform3fv(right_foot_shaderProgram.lightingDirectionUniform,adjustedLD);//set the parameter in the shading program
    right_foot_gl.uniform3f(right_foot_shaderProgram.directionalColorUniform,
          parseFloat(document.getElementById("directionalR").value),
          parseFloat(document.getElementById("directionalG").value),
          parseFloat(document.getElementById("directionalB").value));
    right_foot_gl.uniform1i(right_foot_shaderProgram.useLightingUniform,true);  
    right_foot_gl.uniform3f(right_foot_shaderProgram.lineColor,0.5,0.6,1.0);
    right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_SensorPositionBuffer);  
    right_foot_gl.vertexAttribPointer(right_foot_shaderProgram.vertexPositionAttribute,right_foot_SensorPositionBuffer.itemSize,right_foot_gl.FLOAT,false,0,0);
    right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_SensorNormalBuffer);
    right_foot_gl.vertexAttribPointer(right_foot_shaderProgram.vertexNormalAttribute,right_foot_SensorNormalBuffer.itemSize,right_foot_gl.FLOAT,false,0,0);  
    right_foot_gl.bindBuffer(right_foot_gl.ELEMENT_ARRAY_BUFFER,right_foot_SensorIndexBuffer);//bind the index buffer
    right_foot_setMatrixUniforms();  
    right_foot_gl.drawElements(right_foot_gl.TRIANGLES,right_foot_SensorIndexBuffer.numItems,right_foot_gl.UNSIGNED_SHORT,0);  
    right_foot_mvPopMatrix();*/
  //----------------------------------------------
  //draw shoe
  if (right_shoe_verticeBuffer && right_shoe_NormalBuffer)
  {
    right_foot_mvPushMatrix();
    mat4.translate(right_foot_mvMatrix,right_foot_mvMatrix,[1,-1,-4]);//rotate to the tilt angle        
    right_foot_gl.useProgram(right_foot_shaderProgram);        
    right_foot_gl.uniform3f(right_foot_shaderProgram.ambientColorUniform,
     0.3,0.3,0.3);      
    var adjustedLD=vec3.create();//create a vector for the normalised direction
    //var lightingDirection=[0,-5,-4];    
    var lightingDirection=[-22,-21,-16];    
    //var lightingDirection=[right_foot_light_x,right_foot_light_y,right_foot_light_z];
    vec3.normalize(adjustedLD,lightingDirection);  //normalise the lighting direction vector       
    vec3.scale(adjustedLD,adjustedLD,-1);//scale by -1  
    right_foot_gl.uniform3fv(right_foot_shaderProgram.lightingDirectionUniform,adjustedLD);//set the parameter in the shading program
    right_foot_gl.uniform3f(right_foot_shaderProgram.directionalColorUniform,
        0.5,0.5,0.5);
    var newRotationMatrix=mat4.create();
    mat4.identity(newRotationMatrix,newRotationMatrix);
    mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(90),[0,1,0]);    
    mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewanglez),[0,0,1]);  
    mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewanglex),[1,0,0]);   
    mat4.rotate(right_foot_mvMatrix,right_foot_mvMatrix,degToRad(right_foot_viewangley),[0,1,0]);     
    //mat4.scale(right_foot_mvMatrix,right_foot_mvMatrix,[0.5,0.5,0.5]);            
    right_foot_gl.uniform1i(right_foot_shaderProgram.useLightingUniform,true);  
    //right_foot_gl.uniform3f(right_foot_shaderProgram.lineColor,0.5,0.6,1);
    right_foot_gl.uniform3f(right_foot_shaderProgram.lineColor,1,1,1);
    mat4.multiply(right_foot_mvMatrix,right_foot_mvMatrix,right_foot_SensorRotationMatrix);        
    mat4.multiply(right_foot_mvMatrix,right_foot_mvMatrix,newRotationMatrix);    
    right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_shoe_verticeBuffer);  
    right_foot_gl.vertexAttribPointer(right_foot_shaderProgram.vertexPositionAttribute,right_shoe_verticeBuffer.itemSize,right_foot_gl.FLOAT,false,0,0);
    right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_shoe_NormalBuffer);
    right_foot_gl.vertexAttribPointer(right_foot_shaderProgram.vertexNormalAttribute,right_shoe_NormalBuffer.itemSize,right_foot_gl.FLOAT,false,0,0);      
    right_foot_gl.bindBuffer(right_foot_gl.ELEMENT_ARRAY_BUFFER,right_shoe_IndexBuffer);
    right_foot_setMatrixUniforms();  
    right_foot_gl.drawElements(right_foot_gl.TRIANGLES,right_shoe_IndexBuffer.numItems,right_foot_gl.UNSIGNED_SHORT,0);
    //---------------------------
    //draw the sensor cube
    right_foot_gl.uniform3f(right_foot_shaderProgram.ambientColorUniform, 0.8,0.8,0.8);      
    mat4.scale(right_foot_mvMatrix,right_foot_mvMatrix,[0.1,0.2,0.4]);
    right_foot_gl.uniform3f(right_foot_shaderProgram.lineColor,0.5,0.6,1);
    mat4.translate(right_foot_mvMatrix,right_foot_mvMatrix,[5,7,-2.5]);//rotate to the tilt angle    
    right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_SensorPositionBuffer);  
    right_foot_gl.vertexAttribPointer(right_foot_shaderProgram.vertexPositionAttribute,right_foot_SensorPositionBuffer.itemSize,right_foot_gl.FLOAT,false,0,0);
    right_foot_gl.bindBuffer(right_foot_gl.ARRAY_BUFFER,right_foot_SensorNormalBuffer);
    right_foot_gl.vertexAttribPointer(right_foot_shaderProgram.vertexNormalAttribute,right_foot_SensorNormalBuffer.itemSize,right_foot_gl.FLOAT,false,0,0);  
    right_foot_gl.bindBuffer(right_foot_gl.ELEMENT_ARRAY_BUFFER,right_foot_SensorIndexBuffer);//bind the index buffer
    right_foot_setMatrixUniforms();  
    right_foot_gl.drawElements(right_foot_gl.TRIANGLES,right_foot_SensorIndexBuffer.numItems,right_foot_gl.UNSIGNED_SHORT,0);
    //---------------------------
    right_foot_mvPopMatrix();
  }
  
}
// initShaders - Initialize the shaders, so WebGL knows how to light our scene.
function right_foot_initShaders() {
  right_foot_shaderProgram=loadShaders(right_foot_gl, "shader-fs","shader-vs",true);  
  right_foot_no_light_shaderProgram=loadShaders(right_foot_gl, "nolighting_shader-fs","nolighting_shader-vs",false);}
//setMatrixUniforms - specify the matrix values of uniform variables
function right_foot_setMatrixUniforms() {
    //send the uniform matrices onto the shader (i.e. pMatrix->shaderProgram.pMatrixUniform etc.)
   right_foot_gl.uniformMatrix4fv(right_foot_shaderProgram.pMatrixUniform, false, right_foot_pMatrix);
   right_foot_gl.uniformMatrix4fv(right_foot_shaderProgram.mvMatrixUniform, false, right_foot_mvMatrix);   
   var normalMatrix=mat3.create();
   mat3.normalFromMat4(normalMatrix,right_foot_mvMatrix);  //calculate a 3x3 normal matrix (transpose inverse) from a 4x4 matrix
   right_foot_gl.uniformMatrix3fv(right_foot_shaderProgram.nMatrixUniform,false,normalMatrix);   }
function right_foot_mvPushMatrix(){//store the mvMatrix into a stack first
  var Acopy=mat4.create();
  mat4.copy(Acopy,right_foot_mvMatrix)
  right_foot_mvMatrixStack.push(Acopy);}
function right_foot_mvPopMatrix(){ //get the stored mvMatrix from the stack
  if (right_foot_mvMatrixStack.length==0)
  {
    throw "invalid pop matrix!";
  }
  right_foot_mvMatrix=right_foot_mvMatrixStack.pop();}