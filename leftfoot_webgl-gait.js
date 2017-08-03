//*************************************************************
// Gait visualisation - left foot sensor
//
//
//
// Benny Lo 
//Aug 1 2017
//****************************************************************
var left_foot_glcanvas;//canvas on the web page
var left_foot_gl;//the GL
var left_foot_shaderProgram;//the shader program (needs to be loaded)
var left_foot_no_light_shaderProgram;
var left_foot_SensorPositionBuffer;
var left_foot_SensorIndexBuffer;
var left_foot_SensorNormalBuffer;
var left_foot_axisVertexBuffer;
var left_foot_axisNormalBuffer;
var left_foot_mvMatrix; //model-view matrix
var left_foot_pMatrix;  //projection matrix
var left_foot_mvMatrixStack=[];//stack for storing the mvMatrix
var left_foot_mouseDown=false;
var left_foot_lastMouseX=null;
var left_foot_lastMouseY=null;
var left_foot_SensorRotationMatrix;
var left_foot_timer;
var left_foot_viewanglex=15,left_foot_viewangley=-15,left_foot_viewanglez=0;
var left_shoe_verticeBuffer;
var left_shoe_NormalBuffer;
var left_shoe_TextureCoordBuffer;
var left_shoe_IndexBuffer;

function left_foot_start() {
  left_foot_glcanvas = document.getElementById("leftfootcanvas");

  left_foot_gl=initWebGL(left_foot_glcanvas);      // Initialize the GL context
  
  if (!left_foot_gl) return;//Web GL is not available so, quit!
  left_foot_mvMatrix = mat4.create();//create the model matrix 
  left_foot_pMatrix = mat4.create();//create the projection matrx  
  left_foot_SensorRotationMatrix=mat4.create();  
  mat4.identity(left_foot_SensorRotationMatrix,left_foot_SensorRotationMatrix);  
  left_foot_initShaders(); //initialise the shaders     
  left_foot_initBuffers(); 
  loadLeftShoe("./3D models/left_shoe_1.json");  
  left_foot_gl.clearColor(0.0,0.0,0.0,1.0);//clear the canvas
  left_foot_gl.enable(left_foot_gl.DEPTH_TEST);  //enable depth test -> d
  left_foot_glcanvas.onmousedown=left_foot_handleMouseDown;
  left_foot_glcanvas.onmouseup=left_foot_handleMouseUp;
  document.onmousemove=left_foot_handleMouseMove;
  //setTimer();  
  left_foot_drawScene();  
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function left_foot_initBuffers()
{//divide the sphere into triangles through dividing latitudes and longitude bands    
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
    left_foot_SensorPositionBuffer=left_foot_gl.createBuffer();
    left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_SensorPositionBuffer);
    left_foot_gl.bufferData(left_foot_gl.ARRAY_BUFFER,new Float32Array(cubevertices),left_foot_gl.STATIC_DRAW);
    left_foot_SensorPositionBuffer.itemSize=3;
    left_foot_SensorPositionBuffer.numItems=cubevertices.length/3;
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
    left_foot_SensorNormalBuffer=left_foot_gl.createBuffer();
    left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_SensorNormalBuffer);
    left_foot_gl.bufferData(left_foot_gl.ARRAY_BUFFER,new Float32Array(vertexNormals),left_foot_gl.STATIC_DRAW);
    left_foot_SensorNormalBuffer.itemSize=3;
    left_foot_SensorNormalBuffer.numItems=24;
    
    left_foot_SensorIndexBuffer=left_foot_gl.createBuffer();
    left_foot_gl.bindBuffer(left_foot_gl.ELEMENT_ARRAY_BUFFER,left_foot_SensorIndexBuffer);
    left_foot_gl.bufferData(left_foot_gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(cubeVertexIndices),left_foot_gl.STATIC_DRAW);      
    left_foot_SensorIndexBuffer.itemSize=1;
    left_foot_SensorIndexBuffer.numItems=36;

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
    left_foot_axisVertexBuffer=left_foot_gl.createBuffer();
    left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_axisVertexBuffer);
    left_foot_gl.bufferData(left_foot_gl.ARRAY_BUFFER,new Float32Array(arrowvertex),left_foot_gl.STATIC_DRAW);
    left_foot_axisVertexBuffer.itemSize=3;
    left_foot_axisVertexBuffer.numItems=arrowvertex.length/3;
    left_foot_axisNormalBuffer=left_foot_gl.createBuffer();
    left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_axisNormalBuffer);
    left_foot_gl.bufferData(left_foot_gl.ARRAY_BUFFER,new Float32Array(arrowvertex),left_foot_gl.STATIC_DRAW);
    left_foot_axisNormalBuffer.itemSize=3;
    left_foot_axisNormalBuffer.numItems=arrowvertex.length/3;
}
//=========================================
function loadLeftShoe(filename)
{//load the mac book JSON file
  var request=new XMLHttpRequest();
  request.open("GET",filename);
  request.onreadystatechange=function(){
    if (request.readyState==4)
    {
      handleLoadedLeftShoe(JSON.parse(request.responseText));//JSON parse and create the vertices of the laptop
    }
  }
  request.send();
}
function handleLoadedLeftShoe(ShoeData)
{   
  left_shoe_verticeBuffer=left_foot_gl.createBuffer();  
  left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_shoe_verticeBuffer);  
  left_foot_gl.bufferData(left_foot_gl.ARRAY_BUFFER,new Float32Array(ShoeData.vertices),left_foot_gl.STATIC_DRAW);
  left_shoe_verticeBuffer.itemSize=3;  
  left_shoe_verticeBuffer.numItems=ShoeData.vertices.length/3;
  
  left_shoe_NormalBuffer=left_foot_gl.createBuffer();  
  left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_shoe_NormalBuffer);  
  left_foot_gl.bufferData(left_foot_gl.ARRAY_BUFFER,new Float32Array(ShoeData.normals),left_foot_gl.STATIC_DRAW);
  //left_foot_gl.bufferData(left_foot_gl.ARRAY_BUFFER,new Float32Array(ShoeData.vertices),left_foot_gl.STATIC_DRAW);
  left_shoe_NormalBuffer.itemSize=3;  
  left_shoe_NormalBuffer.numItems=ShoeData.normals.length/3;
  //left_shoe_NormalBuffer.numItems=ShoeData.vertices.length/3;

  left_shoe_IndexBuffer=left_foot_gl.createBuffer();
  left_foot_gl.bindBuffer(left_foot_gl.ELEMENT_ARRAY_BUFFER,left_shoe_IndexBuffer);
  var indices=[];
  for (var i=0;i<ShoeData.faces.length;i+=10)
  {
    indices.push(ShoeData.faces[i+1]);
    indices.push(ShoeData.faces[i+2]);
    indices.push(ShoeData.faces[i+3]);
  }
  left_foot_gl.bufferData(left_foot_gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),left_foot_gl.STREAM_DRAW);  
  left_shoe_IndexBuffer.itemSize=1;
  left_shoe_IndexBuffer.numItems=indices.length;  

  
}
//--------------------------------------------------
//mouse handling functions
function left_foot_handleMouseDown(event) {
  left_foot_mouseDown=true;
  left_foot_lastMouseX=event.clientX;
  left_foot_lastMouseY=event.clientY;
}
function left_foot_handleMouseUp(event){  left_foot_mouseDown=false;}
function left_foot_handleMouseMove(event) {
  if (!left_foot_mouseDown)
    return;
  var newX=event.clientX;
  var newY=event.clientY;
  var deltaX=newX-left_foot_lastMouseX;
  var newRotationMatrix=mat4.create();
  mat4.identity(newRotationMatrix,newRotationMatrix);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(deltaX/10),[0,1,0]);
  var deltaY=newY-left_foot_lastMouseY;
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(deltaY/10),[1,0,0]);
  mat4.multiply(left_foot_SensorRotationMatrix,newRotationMatrix,left_foot_SensorRotationMatrix);
  //mat4.multiply(bodyRotationMatrix,newRotationMatrix,bodyRotationMatrix);
  left_foot_lastMouseX=newX;
  left_foot_lastMouseY=newY;
	left_foot_drawScene();
	}
//----------------------------------------
function left_foot_sensor_rotate(anglex,angley,anglez)
{

  	mat4.identity(left_foot_SensorRotationMatrix,left_foot_SensorRotationMatrix);
  	mat4.rotate(left_foot_SensorRotationMatrix,left_foot_SensorRotationMatrix,degToRad(angley),[0,1,0]);  	
  	mat4.rotate(left_foot_SensorRotationMatrix,left_foot_SensorRotationMatrix,degToRad(anglex),[1,0,0]);
  	mat4.rotate(left_foot_SensorRotationMatrix,left_foot_SensorRotationMatrix,degToRad(anglez),[0,0,1]);  	  	
	left_foot_drawScene();
}
//--------------------------------------------
// drawScene
function left_foot_drawScene() {  
  // Clear the canvas before we start drawing on it.
  left_foot_gl.viewport(0,0,left_foot_gl.viewportWidth,left_foot_gl.viewportHeight);
  left_foot_gl.clear(left_foot_gl.COLOR_BUFFER_BIT | left_foot_gl.DEPTH_BUFFER_BIT);  
//setting up the perspective to view the sceene
  mat4.perspective(left_foot_pMatrix,45,left_foot_gl.viewportWidth/left_foot_gl.viewportHeight,0.1,100.0);  //set the projection martix  
  
  mat4.identity(left_foot_mvMatrix,left_foot_mvMatrix);//start with an identity matrix first    
  //draw the y-axis
  left_foot_mvPushMatrix();
  left_foot_gl.useProgram(left_foot_no_light_shaderProgram);           
  gl.uniform1i(left_foot_no_light_shaderProgram.drawLine,true); 
  mat4.translate(left_foot_mvMatrix,left_foot_mvMatrix,[0,0,-5]);//rotate to the tilt angle	
  left_foot_gl.uniform3f(left_foot_no_light_shaderProgram.lineColor,1.0,1.0,1.0);  
  left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_axisNormalBuffer);
  mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewanglez),[0,0,1]);  	
  mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewanglex),[1,0,0]);  
  mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewangley),[0,1,0]);  	
  left_foot_gl.vertexAttribPointer(left_foot_no_light_shaderProgram.vertexNormalAttribute,left_foot_axisNormalBuffer.itemSize,left_foot_gl.FLOAT,false,0,0);    
  left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_axisVertexBuffer);  
  left_foot_gl.vertexAttribPointer(left_foot_no_light_shaderProgram.vertexPositionAttribute,left_foot_axisVertexBuffer.itemSize,left_foot_gl.FLOAT,false,0,0);
  left_foot_gl.uniformMatrix4fv(left_foot_no_light_shaderProgram.pMatrixUniform, false, left_foot_pMatrix);
   left_foot_gl.uniformMatrix4fv(left_foot_no_light_shaderProgram.mvMatrixUniform, false, left_foot_mvMatrix);   
  left_foot_gl.drawArrays(gl.LINES,0,left_foot_axisVertexBuffer.numItems);  
  left_foot_mvPopMatrix();
  //draw the x-axis
  left_foot_mvPushMatrix();
  left_foot_gl.useProgram(left_foot_no_light_shaderProgram);           
  gl.uniform1i(left_foot_no_light_shaderProgram.drawLine,true); 
  mat4.translate(left_foot_mvMatrix,left_foot_mvMatrix,[0,0,-5]);//rotate to the tilt angle	
  left_foot_gl.uniform3f(left_foot_no_light_shaderProgram.lineColor,1.0,0,1.0);  
  var newRotationMatrix=mat4.create();
  mat4.identity(newRotationMatrix,newRotationMatrix);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(90),[0,0,1]);  	
  
  mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewanglez),[0,0,1]);
  mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewanglex),[1,0,0]);
  mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewangley),[0,1,0]);  	    	
  mat4.multiply(left_foot_mvMatrix,left_foot_mvMatrix,newRotationMatrix);
  left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_axisNormalBuffer);
  left_foot_gl.vertexAttribPointer(left_foot_no_light_shaderProgram.vertexNormalAttribute,left_foot_axisNormalBuffer.itemSize,left_foot_gl.FLOAT,false,0,0);    
  left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_axisVertexBuffer);  
  left_foot_gl.vertexAttribPointer(left_foot_no_light_shaderProgram.vertexPositionAttribute,left_foot_axisVertexBuffer.itemSize,left_foot_gl.FLOAT,false,0,0);
  left_foot_gl.uniformMatrix4fv(left_foot_no_light_shaderProgram.pMatrixUniform, false, left_foot_pMatrix);
   left_foot_gl.uniformMatrix4fv(left_foot_no_light_shaderProgram.mvMatrixUniform, false, left_foot_mvMatrix);   
  left_foot_gl.drawArrays(gl.LINES,0,left_foot_axisVertexBuffer.numItems);  
  left_foot_mvPopMatrix();
    //draw the z-axis
  left_foot_mvPushMatrix();
  left_foot_gl.useProgram(left_foot_no_light_shaderProgram);           
  gl.uniform1i(left_foot_no_light_shaderProgram.drawLine,true); 
  mat4.translate(left_foot_mvMatrix,left_foot_mvMatrix,[0,0,-5]);//rotate to the tilt angle	
  left_foot_gl.uniform3f(left_foot_no_light_shaderProgram.lineColor,1.0,1.0,0);  
  var newRotationMatrix=mat4.create();
  mat4.identity(newRotationMatrix,newRotationMatrix);
  mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(90),[1,0,0]);  	
  
  mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewanglez),[0,0,1]);  
  mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewanglex),[1,0,0]);  	
  mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewangley),[0,1,0]);  	
  mat4.multiply(left_foot_mvMatrix,left_foot_mvMatrix,newRotationMatrix);
  left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_axisNormalBuffer);
  left_foot_gl.vertexAttribPointer(left_foot_no_light_shaderProgram.vertexNormalAttribute,left_foot_axisNormalBuffer.itemSize,left_foot_gl.FLOAT,false,0,0);    
  left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_axisVertexBuffer);  
  left_foot_gl.vertexAttribPointer(left_foot_no_light_shaderProgram.vertexPositionAttribute,left_foot_axisVertexBuffer.itemSize,left_foot_gl.FLOAT,false,0,0);
  left_foot_gl.uniformMatrix4fv(left_foot_no_light_shaderProgram.pMatrixUniform, false, left_foot_pMatrix);
   left_foot_gl.uniformMatrix4fv(left_foot_no_light_shaderProgram.mvMatrixUniform, false, left_foot_mvMatrix);   
  left_foot_gl.drawArrays(gl.LINES,0,left_foot_axisVertexBuffer.numItems);  
  left_foot_mvPopMatrix();
  //--------------------------------
  //draw a cube
  /*left_foot_mvPushMatrix();
  mat4.translate(left_foot_mvMatrix,left_foot_mvMatrix,[0,0,-5]);//rotate to the tilt angle
  left_foot_gl.useProgram(left_foot_shaderProgram);        
  left_foot_gl.uniform3f(left_foot_shaderProgram.ambientColorUniform,
      parseFloat(document.getElementById("ambientR").value*1.5),
      parseFloat(document.getElementById("ambientG").value*1.5),
      parseFloat(document.getElementById("ambientB").value*1.5));
  var lightingDirection=[
      parseFloat(document.getElementById("lightDirectionX").value),
      parseFloat(document.getElementById("lightDirectionY").value),
      parseFloat(document.getElementById("lightDirectionZ").value)];
      var adjustedLD=vec3.create();//create a vector for the normalised direction
  vec3.normalize(adjustedLD,lightingDirection);  //normalise the lighting direction vector
  vec3.scale(adjustedLD,adjustedLD,-1);//scale by -1  
    mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewanglez),[0,0,1]);  
  mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewanglex),[1,0,0]);  	
  mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewangley),[0,1,0]); 
  mat4.multiply(left_foot_mvMatrix,left_foot_mvMatrix,left_foot_SensorRotationMatrix);
  mat4.scale(left_foot_mvMatrix,left_foot_mvMatrix,[0.6,0.4,0.4]);
  left_foot_gl.uniform3fv(left_foot_shaderProgram.lightingDirectionUniform,adjustedLD);//set the parameter in the shading program
  left_foot_gl.uniform3f(left_foot_shaderProgram.directionalColorUniform,
        parseFloat(document.getElementById("directionalR").value),
        parseFloat(document.getElementById("directionalG").value),
        parseFloat(document.getElementById("directionalB").value));
  left_foot_gl.uniform1i(left_foot_shaderProgram.useLightingUniform,true);  
  left_foot_gl.uniform3f(left_foot_shaderProgram.lineColor,0.5,0.6,1.0);
  left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_SensorPositionBuffer);  
  left_foot_gl.vertexAttribPointer(left_foot_shaderProgram.vertexPositionAttribute,left_foot_SensorPositionBuffer.itemSize,left_foot_gl.FLOAT,false,0,0);
  left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_SensorNormalBuffer);
  left_foot_gl.vertexAttribPointer(left_foot_shaderProgram.vertexNormalAttribute,left_foot_SensorNormalBuffer.itemSize,left_foot_gl.FLOAT,false,0,0);  
  left_foot_gl.bindBuffer(left_foot_gl.ELEMENT_ARRAY_BUFFER,left_foot_SensorIndexBuffer);//bind the index buffer
  left_foot_setMatrixUniforms();  
  left_foot_gl.drawElements(left_foot_gl.TRIANGLES,left_foot_SensorIndexBuffer.numItems,left_foot_gl.UNSIGNED_SHORT,0);  
  left_foot_mvPopMatrix();*/

  //----------------------------------------------
  //draw shoe
  if (left_shoe_verticeBuffer && left_shoe_NormalBuffer)
  {
    left_foot_mvPushMatrix();
    mat4.translate(left_foot_mvMatrix,left_foot_mvMatrix,[1,-1,-4]);//rotate to the tilt angle    
    left_foot_gl.useProgram(left_foot_shaderProgram);        
    left_foot_gl.uniform3f(left_foot_shaderProgram.ambientColorUniform,
     0.3,0.3,0.3);      
    var adjustedLD=vec3.create();//create a vector for the normalised direction
    //var lightingDirection=[10,-5,-4];
    //var lightingDirection=[-4,4,0.8];    
    var lightingDirection=[-22,-21,-16];    
    vec3.normalize(adjustedLD,lightingDirection);  //normalise the lighting direction vector       
    vec3.scale(adjustedLD,adjustedLD,-1);//scale by -1  
    left_foot_gl.uniform3fv(left_foot_shaderProgram.lightingDirectionUniform,adjustedLD);//set the parameter in the shading program
    left_foot_gl.uniform3f(left_foot_shaderProgram.directionalColorUniform,
    	0.5,0.5,0.5);
        //0.2,0.2,0.2);
    var newRotationMatrix=mat4.create();
    mat4.identity(newRotationMatrix,newRotationMatrix);
    mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(90),[0,1,0]);    
    mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewanglez),[0,0,1]);  
    mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewanglex),[1,0,0]);   
    mat4.rotate(left_foot_mvMatrix,left_foot_mvMatrix,degToRad(left_foot_viewangley),[0,1,0]);     
    //mat4.scale(left_foot_mvMatrix,left_foot_mvMatrix,[0.5,0.5,0.5]);            
    left_foot_gl.uniform1i(left_foot_shaderProgram.useLightingUniform,true);  
    //left_foot_gl.uniform3f(left_foot_shaderProgram.lineColor,0.5,0.6,1);
    left_foot_gl.uniform3f(left_foot_shaderProgram.lineColor,1,1,1);
    mat4.multiply(left_foot_mvMatrix,left_foot_mvMatrix,left_foot_SensorRotationMatrix);        
    mat4.multiply(left_foot_mvMatrix,left_foot_mvMatrix,newRotationMatrix);
    left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_shoe_NormalBuffer);
    left_foot_gl.vertexAttribPointer(left_foot_shaderProgram.vertexNormalAttribute,left_shoe_NormalBuffer.itemSize,left_foot_gl.FLOAT,false,0,0);    
  
    left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_shoe_verticeBuffer);  
    left_foot_gl.vertexAttribPointer(left_foot_shaderProgram.vertexPositionAttribute,left_shoe_verticeBuffer.itemSize,left_foot_gl.FLOAT,false,0,0);
    left_foot_gl.bindBuffer(left_foot_gl.ELEMENT_ARRAY_BUFFER,left_shoe_IndexBuffer);
    left_foot_setMatrixUniforms();  
    left_foot_gl.drawElements(left_foot_gl.TRIANGLES,left_shoe_IndexBuffer.numItems,left_foot_gl.UNSIGNED_SHORT,0);
    //---------------------------
    //draw the sensor cube
    left_foot_gl.uniform3f(left_foot_shaderProgram.ambientColorUniform, 0.8,0.8,0.8);      
    left_foot_gl.uniform3f(left_foot_shaderProgram.lineColor,0.5,0.6,1);
    mat4.scale(left_foot_mvMatrix,left_foot_mvMatrix,[0.1,0.2,0.4]);
    mat4.translate(left_foot_mvMatrix,left_foot_mvMatrix,[5,7,-2.5]);//rotate to the tilt angle    
    left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_SensorPositionBuffer);  
    left_foot_gl.vertexAttribPointer(left_foot_shaderProgram.vertexPositionAttribute,left_foot_SensorPositionBuffer.itemSize,left_foot_gl.FLOAT,false,0,0);
    left_foot_gl.bindBuffer(left_foot_gl.ARRAY_BUFFER,left_foot_SensorNormalBuffer);
    left_foot_gl.vertexAttribPointer(left_foot_shaderProgram.vertexNormalAttribute,left_foot_SensorNormalBuffer.itemSize,left_foot_gl.FLOAT,false,0,0);  
    left_foot_gl.bindBuffer(left_foot_gl.ELEMENT_ARRAY_BUFFER,left_foot_SensorIndexBuffer);//bind the index buffer
    left_foot_setMatrixUniforms();  
    left_foot_gl.drawElements(left_foot_gl.TRIANGLES,left_foot_SensorIndexBuffer.numItems,left_foot_gl.UNSIGNED_SHORT,0);
    //---------------------------
    left_foot_mvPopMatrix();
  }
  
  
}
// initShaders - Initialize the shaders, so WebGL knows how to light our scene.
function left_foot_initShaders() {
  left_foot_shaderProgram=loadShaders(left_foot_gl, "shader-fs","shader-vs",true);  
  left_foot_no_light_shaderProgram=loadShaders(left_foot_gl, "nolighting_shader-fs","nolighting_shader-vs",false);}
//setMatrixUniforms - specify the matrix values of uniform variables
function left_foot_setMatrixUniforms() {
    //send the uniform matrices onto the shader (i.e. pMatrix->shaderProgram.pMatrixUniform etc.)
   left_foot_gl.uniformMatrix4fv(left_foot_shaderProgram.pMatrixUniform, false, left_foot_pMatrix);
   left_foot_gl.uniformMatrix4fv(left_foot_shaderProgram.mvMatrixUniform, false, left_foot_mvMatrix);   
   var normalMatrix=mat3.create();
   mat3.normalFromMat4(normalMatrix,left_foot_mvMatrix);  //calculate a 3x3 normal matrix (transpose inverse) from a 4x4 matrix
   left_foot_gl.uniformMatrix3fv(left_foot_shaderProgram.nMatrixUniform,false,normalMatrix);   }
function left_foot_mvPushMatrix(){//store the mvMatrix into a stack first
  var Acopy=mat4.create();
  mat4.copy(Acopy,left_foot_mvMatrix)
  left_foot_mvMatrixStack.push(Acopy);}
function left_foot_mvPopMatrix(){ //get the stored mvMatrix from the stack
  if (left_foot_mvMatrixStack.length==0)
  {
    throw "invalid pop matrix!";
  }
  left_foot_mvMatrix=left_foot_mvMatrixStack.pop();}