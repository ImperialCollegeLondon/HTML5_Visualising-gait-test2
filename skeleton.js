//*************************************************************
// Gait visualisation - Skeleton
//
// the skeleton model was downloaded from http://www.cadnav.com
// then 3D Max to convert it to OBJ file
//
// By Benny Lo
////////////////////////////////////////////////////////////////////////////////////////
//skeleton vertice variables
var skeleton_gl;
	var skull_VerticeBuffer;
	var skull_NormalBuffer;
	var skull_IndexBuffer;
	var neck_VerticeBuffer;
	var neck_NormalBuffer;
	var neck_IndexBuffer;
	var torso1_VerticeBuffer;
	var torso1_NormalBuffer;
	var torso1_IndexBuffer;
	var torso2_VerticeBuffer;
	var torso2_NormalBuffer;
	var torso2_IndexBuffer;
	var left_upper_arm_VerticeBuffer;
	var left_upper_arm_NormalBuffer;
	var left_upper_arm_IndexBuffer;
	var right_upper_arm_VerticeBuffer;
	var right_upper_arm_NormalBuffer;
	var right_upper_arm_IndexBuffer;
	var left_lower_arm_VerticeBuffer;
	var left_lower_arm_NormalBuffer;
	var left_lower_arm_IndexBuffer;
	var right_lower_arm_VerticeBuffer;
	var right_lower_arm_NormalBuffer;
	var right_lower_arm_IndexBuffer;
	var left_hand_VerticeBuffer;
	var left_hand_NormalBuffer;
	var left_hand_IndexBuffer;
	var right_hand_VerticeBuffer;
	var right_hand_NormalBuffer;
	var right_hand_IndexBuffer;
	var left_upper_leg_VerticeBuffer;
	var left_upper_leg_NormalBuffer;
	var left_upper_leg_IndexBuffer;
	var right_upper_leg_VerticeBuffer;
	var right_upper_leg_NormalBuffer;
	var right_upper_leg_IndexBuffer;
	var left_lower_leg_VerticeBuffer;
	var left_lower_leg_NormalBuffer;
	var left_lower_leg_IndexBuffer;
	var right_lower_leg_VerticeBuffer;
	var right_lower_leg_NormalBuffer;
	var right_lower_leg_IndexBuffer;
	var left_foot_VerticeBuffer;
	var left_foot_NormalBuffer;
	var left_foot_IndexBuffer;
	var right_foot_VerticeBuffer;
	var right_foot_NormalBuffer;
	var right_foot_IndexBuffer;
var skeleton_mvMatrix;
var skeleton_pMatrix;
var skeleton_mvMatrixStack=[];
//skeleton model parameters
  var skeleton_shoulder_width;
  var skeleton_upper_arm_length;
  var skeleton_arm_diameter;
  var skeleton_upper_arm_y_offset;
  var skeleton_upper_arm_z_offset;        
  var skeleton_lower_arm_length;
  var skeleton_lower_arm_diameter;
  var skeleton_lower_arm_x_offset;
  var skeleton_lower_arm_y_offset;
  var skeleton_lower_arm_z_offset;
  var skeleton_hand_length;
  var skeleton_hand_diameter;
  var skeleton_hip_width;
  var skeleton_thigh_y_offset;
  var skeleton_thigh_length;
  var skeleton_thigh_diameter;
  var skeleton_shin_length;
  var skeleton_shin_diameter;       
  var skeleton_foot_length;
  var skeleton_foot_diameter;
function init_Skeleton(pgl,pshoulder_width,pupper_arm_length,parm_diameter,pupper_arm_y_offset,pupper_arm_z_offset,                
        plower_arm_length,plower_arm_diameter,plower_arm_x_offset,plower_arm_y_offset,plower_arm_z_offset,
        phand_length,phand_diameter,
        phip_width,
        pthigh_y_offset,pthigh_length,pthigh_diameter,
        pshin_length,pshin_diameter,       
        pfoot_length,pfoot_diameter){
  skeleton_gl=pgl;
  skeleton_shoulder_width=pshoulder_width;
  skeleton_upper_arm_length=pupper_arm_length;
  skeleton_arm_diameter=parm_diameter;
  skeleton_upper_arm_y_offset=pupper_arm_y_offset;
  skeleton_upper_arm_z_offset=pupper_arm_z_offset;
  skeleton_lower_arm_length=plower_arm_length;
  skeleton_lower_arm_diameter=plower_arm_diameter;
  skeleton_lower_arm_x_offset=plower_arm_x_offset;
  skeleton_lower_arm_y_offset=plower_arm_y_offset;
  skeleton_lower_arm_z_offset=plower_arm_z_offset;
  skeleton_hand_length=phand_length;
  skeleton_hand_diameter=phand_diameter;
  skeleton_hip_width=phip_width;
  skeleton_thigh_y_offset=pthigh_y_offset;
  skeleton_thigh_length=pthigh_length;
  skeleton_thigh_diameter=pthigh_diameter;
  skeleton_shin_length=pshin_length;
  skeleton_shin_diameter=pshin_diameter;
  skeleton_foot_length=pfoot_length;
  skeleton_foot_diameter=pfoot_diameter;
  //load the skeleton obj files (3D models)
  loadOBJFile("./3D models/skull.obj",skull_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/neck.obj",neck_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/torso1.obj",torso1_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/torso2.obj",torso2_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/left_upper_arm.obj",left_upper_arm_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/leftforearm.obj",left_lower_arm_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/right_upper_arm.obj",right_upper_arm_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/rightforearm.obj",right_lower_arm_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/leftwristhand.obj",left_hand_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/rightwristhand.obj",right_hand_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/left_upper_leg.obj",left_upper_leg_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/right_upper_leg.obj",right_upper_leg_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/left_lower_leg.obj",left_lower_leg_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/right_lower_leg.obj",right_lower_leg_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/left_foot.obj",left_foot_readOBJ_finish,obj3D_readMTL_finish);
  loadOBJFile("./3D models/right_foot.obj",right_foot_readOBJ_finish,obj3D_readMTL_finish);
}
  //--------------------------------------------------------------
  function obj3D_readMTL_finish(materials){}//call back function for MTL file finish reading event but ignore all MTL information
function handle_readOBJ_finish(whichgl,nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer) {
  //call back function for handling the OBJ file finishing event
  //nobuffers-> no of buffers needed, as indices can only be 16 bit... 65536
  //vertrices -> vertices read from the obj file
  //normals -> normal read from the obj file
  //indices -> indices of the object - read from the obj file
  //texture -> texture coordinates
  //materials -> name of material used in each vertice
  //midx,midy,midz -> mid point x,y,z
  //maxrange -> the longest axis size
  var obj3D_gl=whichgl;
  var obj3D_noBuffers=nobuffers;
  var obj3D_vertices=[];
  var obj3D_normals=[];
  var obj3D_indices=[];
  for (var i=0;i<obj3D_noBuffers;i++)
  {
    obj3D_vertices.push(vertices[i]);
    obj3D_normals.push(normals[i]);
    obj3D_indices.push(indices[i]);
  }
  for (var i=0;i<obj3D_noBuffers;i++)
  {
    obj3D_verticeBuffer[i]=obj3D_gl.createBuffer();  
    obj3D_gl.bindBuffer(obj3D_gl.ARRAY_BUFFER,obj3D_verticeBuffer[i]);  
    obj3D_gl.bufferData(obj3D_gl.ARRAY_BUFFER,new Float32Array(obj3D_vertices[i]),obj3D_gl.STATIC_DRAW);
    obj3D_verticeBuffer[i].itemSize=3;  
    obj3D_verticeBuffer[i].numItems=obj3D_vertices[i].length/3;

    obj3D_NormalBuffer[i]=obj3D_gl.createBuffer();  
    obj3D_gl.bindBuffer(obj3D_gl.ARRAY_BUFFER,obj3D_NormalBuffer[i]);  
    obj3D_gl.bufferData(obj3D_gl.ARRAY_BUFFER,new Float32Array(obj3D_normals[i]),obj3D_gl.STATIC_DRAW);
    obj3D_NormalBuffer[i].itemSize=3;  
    obj3D_NormalBuffer[i].numItems=obj3D_normals[i].length/3;

    if (obj3D_indices[i].length>0)
    {
      obj3D_IndexBuffer[i]=obj3D_gl.createBuffer();
      obj3D_gl.bindBuffer(obj3D_gl.ELEMENT_ARRAY_BUFFER,obj3D_IndexBuffer[i]);
      obj3D_gl.bufferData(obj3D_gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(obj3D_indices[i]),obj3D_gl.STREAM_DRAW);  
      obj3D_IndexBuffer[i].itemSize=1;
      obj3D_IndexBuffer[i].numItems=obj3D_indices[i].length; 
    }    
  } 
}
function skull_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  
  handle_readOBJ_finish(skeleton_gl,nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  skull_VerticeBuffer=obj3D_verticeBuffer[0];
  skull_IndexBuffer=obj3D_IndexBuffer[0];
  skull_NormalBuffer=obj3D_NormalBuffer[0];  
}

function neck_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  
  handle_readOBJ_finish(skeleton_gl,nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  neck_VerticeBuffer=obj3D_verticeBuffer[0];
  neck_IndexBuffer=obj3D_IndexBuffer[0];
  neck_NormalBuffer=obj3D_NormalBuffer[0];  
}
function torso1_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  
  handle_readOBJ_finish(skeleton_gl,nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  torso1_VerticeBuffer=obj3D_verticeBuffer[0];
  torso1_IndexBuffer=obj3D_IndexBuffer[0];
  torso1_NormalBuffer=obj3D_NormalBuffer[0];  
}
function torso2_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  handle_readOBJ_finish(skeleton_gl,nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  torso2_VerticeBuffer=obj3D_verticeBuffer[0];
  torso2_IndexBuffer=obj3D_IndexBuffer[0];
  torso2_NormalBuffer=obj3D_NormalBuffer[0];  
}

function left_upper_arm_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  var ranges=FindRanges(vertices[0]);
  var BoneVertices=NormaliseVertices(vertices[0],ranges,-1.3,0.1,0.5);   
  var pvertices=[];
  pvertices[0]=BoneVertices;
  handle_readOBJ_finish(skeleton_gl,1,pvertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  left_upper_arm_VerticeBuffer=obj3D_verticeBuffer[0];
  left_upper_arm_IndexBuffer=obj3D_IndexBuffer[0];
  left_upper_arm_NormalBuffer=obj3D_NormalBuffer[0];  
}
function left_lower_arm_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  var ranges=FindRanges(vertices[0]);
  //var BoneVertices=NormaliseVertices(vertices[0],ranges,-5.2,1.8,0.5);   
  var BoneVertices=NormaliseVertices(vertices[0],ranges,-5.2,0.9,0.5);   
  var pvertices=[];
  pvertices[0]=BoneVertices;
  handle_readOBJ_finish(skeleton_gl,1,pvertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  left_lower_arm_VerticeBuffer=obj3D_verticeBuffer[0];
  left_lower_arm_IndexBuffer=obj3D_IndexBuffer[0];
  left_lower_arm_NormalBuffer=obj3D_NormalBuffer[0];  
}
function right_upper_arm_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  var ranges=FindRanges(vertices[0]);
  var BoneVertices=NormaliseVertices(vertices[0],ranges,1.35,0.1,-0.5);   
  var pvertices=[];
  pvertices[0]=BoneVertices;
  handle_readOBJ_finish(skeleton_gl,1,pvertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  right_upper_arm_VerticeBuffer=obj3D_verticeBuffer[0];
  right_upper_arm_IndexBuffer=obj3D_IndexBuffer[0];
  right_upper_arm_NormalBuffer=obj3D_NormalBuffer[0];  
}
function right_lower_arm_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  var ranges=FindRanges(vertices[0]);
  //var BoneVertices=NormaliseVertices(vertices[0],ranges,5,1.9,-0.3);   
  var BoneVertices=NormaliseVertices(vertices[0],ranges,5,0.9,-0.3);   
  var pvertices=[];
  pvertices[0]=BoneVertices;
  handle_readOBJ_finish(skeleton_gl,1,pvertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  right_lower_arm_VerticeBuffer=obj3D_verticeBuffer[0];
  right_lower_arm_IndexBuffer=obj3D_IndexBuffer[0];
  right_lower_arm_NormalBuffer=obj3D_NormalBuffer[0];  
}
function left_hand_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];

  var ranges=FindRanges(vertices[0]);
  //var BoneVertices=pNormaliseVertices(vertices[0],ranges,0,-3.7,0);
  var BoneVertices=pNormaliseVertices(vertices[0],ranges,0,-0.9,0);
  var pvertices=[];
  pvertices[0]=BoneVertices;
  handle_readOBJ_finish(skeleton_gl,1,pvertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer)
  left_hand_VerticeBuffer=obj3D_verticeBuffer[0];
  left_hand_IndexBuffer=obj3D_IndexBuffer[0];
  left_hand_NormalBuffer=obj3D_NormalBuffer[0];  
}
function right_hand_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  var ranges=FindRanges(vertices[0]);
  //var BoneVertices=pNormaliseVertices(vertices[0],ranges,-1.2,-3.8,-0.5);
  var BoneVertices=pNormaliseVertices(vertices[0],ranges,-1,-0.9,-0.6);
  var pvertices=[];
  pvertices[0]=BoneVertices;
  handle_readOBJ_finish(skeleton_gl,1,pvertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  right_hand_VerticeBuffer=obj3D_verticeBuffer[0];
  right_hand_IndexBuffer=obj3D_IndexBuffer[0];
  right_hand_NormalBuffer=obj3D_NormalBuffer[0];  
}
function left_upper_leg_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  var ranges=FindRanges(vertices[0]);
  var BoneVertices=NormaliseVertices(vertices[0],ranges,-1,1.5,0.2);   
  var pvertices=[];
  pvertices[0]=BoneVertices;
  handle_readOBJ_finish(skeleton_gl,1,pvertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  left_upper_leg_VerticeBuffer=obj3D_verticeBuffer[0];
  left_upper_leg_IndexBuffer=obj3D_IndexBuffer[0];
  left_upper_leg_NormalBuffer=obj3D_NormalBuffer[0];  
}
function right_upper_leg_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  var ranges=FindRanges(vertices[0]);
  var BoneVertices=NormaliseVertices(vertices[0],ranges,1.1,1.5,0.2);   
  var pvertices=[];
  pvertices[0]=BoneVertices;
  handle_readOBJ_finish(skeleton_gl,1,pvertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  right_upper_leg_VerticeBuffer=obj3D_verticeBuffer[0];
  right_upper_leg_IndexBuffer=obj3D_IndexBuffer[0];
  right_upper_leg_NormalBuffer=obj3D_NormalBuffer[0];  
}
function left_lower_leg_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  var ranges=FindRanges(vertices[0]);
  var BoneVertices=NormaliseVertices(vertices[0],ranges,-1,2.5,0.5);   
  var pvertices=[];
  pvertices[0]=BoneVertices;
  handle_readOBJ_finish(skeleton_gl,1,pvertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  left_lower_leg_VerticeBuffer=obj3D_verticeBuffer[0];
  left_lower_leg_IndexBuffer=obj3D_IndexBuffer[0];
  left_lower_leg_NormalBuffer=obj3D_NormalBuffer[0];  
}
function right_lower_leg_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  var ranges=FindRanges(vertices[0]);
  var BoneVertices=NormaliseVertices(vertices[0],ranges,1,2.5,0.5);   
  var pvertices=[];
  pvertices[0]=BoneVertices;
  handle_readOBJ_finish(skeleton_gl,1,pvertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  right_lower_leg_VerticeBuffer=obj3D_verticeBuffer[0];
  right_lower_leg_IndexBuffer=obj3D_IndexBuffer[0];
  right_lower_leg_NormalBuffer=obj3D_NormalBuffer[0];  
}
function left_foot_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  var ranges=FindRanges(vertices[0]);
  var BoneVertices=pNormaliseVertices(vertices[0],ranges,0,0,0);   
  var pvertices=[];
  pvertices[0]=BoneVertices;
  handle_readOBJ_finish(skeleton_gl,1,pvertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  left_foot_VerticeBuffer=obj3D_verticeBuffer[0];
  left_foot_IndexBuffer=obj3D_IndexBuffer[0];
  left_foot_NormalBuffer=obj3D_NormalBuffer[0];  
}
function right_foot_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
   var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  var ranges=FindRanges(vertices[0]);
  var BoneVertices=pNormaliseVertices(vertices[0],ranges,0,0,0);   
  var pvertices=[];
  pvertices[0]=BoneVertices;
  handle_readOBJ_finish(skeleton_gl,1,pvertices,normals,indices,texture,materials,midx,midy,midz,maxrange,
                obj3D_verticeBuffer,obj3D_NormalBuffer,obj3D_IndexBuffer);
  right_foot_VerticeBuffer=obj3D_verticeBuffer[0];
  right_foot_IndexBuffer=obj3D_IndexBuffer[0];
  right_foot_NormalBuffer=obj3D_NormalBuffer[0];  
}

function isBitSet( value, position ) {    return value & ( 1 << position );}//check which bit is set
function FindRanges(BoneVertices){//find the max and min value of the vertices of a shape for normalization
  var minx=999999,miny=999999,minz=999999;
  var maxx=-99999,maxy=-99999,maxz=-99999;
  var meanx=0,meany=0,meanz=0;
  for (var i=0;i<BoneVertices.length;i+=3)
  {
    minx=Math.min(minx,BoneVertices[i]);
    miny=Math.min(miny,BoneVertices[i+1]);
    minz=Math.min(minz,BoneVertices[i+2]);
    maxx=Math.max(maxx,BoneVertices[i]);
    maxy=Math.max(maxy,BoneVertices[i+1]);
    maxz=Math.max(maxz,BoneVertices[i+2]);
  }
  var result=[];
  result.push(minx);result.push(maxx);
  result.push(miny);result.push(maxy);
  result.push(minz);result.push(maxz);
  return result;   }
function NormaliseVertices(BoneVertices,ranges,offsetx,offsety,offsetz){//normalise the vertices (to make sure it will fit in a 1x1x1 cube)
  var vertices=[];
  var rangex=ranges[1]-ranges[0];
  var rangey=ranges[3]-ranges[2];
  var rangez=ranges[5]-ranges[4];    
  for (var i=0;i<BoneVertices.length;i+=3)
  {
    vertices.push((BoneVertices[i])/rangex+offsetx);
    vertices.push((BoneVertices[i+1])/rangey+offsety);
    vertices.push((BoneVertices[i+2])/rangez+offsetz);
  }
  return vertices;}
function pNormaliseVertices(BoneVertices,ranges,offsetx,offsety,offsetz){//normalise the vertices (to make sure it will fit in a 1x1x1 cube)
  var vertices=[];
  var rangex=ranges[1]-ranges[0];
  var rangey=ranges[3]-ranges[2];
  var rangez=ranges[5]-ranges[4];    
  var maxrange=Math.max(rangex,Math.max(rangey,rangez));
  for (var i=0;i<BoneVertices.length;i+=3)
  {
    vertices.push((BoneVertices[i]-ranges[0])/maxrange+offsetx);
    vertices.push((BoneVertices[i+1]-ranges[2])/maxrange+offsety);
    vertices.push((BoneVertices[i+2]-ranges[4])/maxrange+offsetz);
  }
  return vertices;}

function drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
				pmvMatrix,ppMatrix,pshaderProgram,
				pVertexPositionBuffer,pNormalBuffer,pIndexBuffer,
				posx,posy,posz,
				scalex,scaley,scalez,
				rotatex,rotatey,rotatez,
				colorr,colorg,colorb){//draw the bone object
    skeleton_mvMatrix=pmvMatrix;
    skeleton_pMatrix=ppMatrix;
    skeleton_mvPushMatrix();
    var newRotationMatrix=mat4.create();
    mat4.identity(newRotationMatrix,newRotationMatrix);
    mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(rotatey),[0,1,0]);
    mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(rotatex),[1,0,0]);
    mat4.rotate(newRotationMatrix,newRotationMatrix,degToRad(rotatez),[0,0,1]);        
    mat4.translate(pmvMatrix,pmvMatrix,[pfigureposx,pfigureposy,-15+pzoom_rate]);//translate for viewing              
    mat4.multiply(pmvMatrix,pmvMatrix,pmodelRotationMatrix);//rotate with the model
    mat4.translate(pmvMatrix,pmvMatrix,[posx,posy,posz]);//transate to the position 
    mat4.multiply(pmvMatrix,pmvMatrix,newRotationMatrix);//rotate the shape    
    mat4.scale(pmvMatrix,pmvMatrix,[scalex,scaley,scalez]);//scale  
    pgl.uniform3f(pshaderProgram.lineColor,colorr,colorg,colorb);
    pgl.bindBuffer(pgl.ARRAY_BUFFER,pVertexPositionBuffer);  
    pgl.vertexAttribPointer(pshaderProgram.vertexPositionAttribute,pVertexPositionBuffer.itemSize,pgl.FLOAT,false,0,0);
    pgl.bindBuffer(pgl.ARRAY_BUFFER,pNormalBuffer);
    pgl.vertexAttribPointer(pshaderProgram.vertexNormalAttribute,pNormalBuffer.itemSize,pgl.FLOAT,false,0,0);
    pgl.bindBuffer(pgl.ELEMENT_ARRAY_BUFFER,pIndexBuffer);
    skeleton_setMatrixUniforms(pgl,pshaderProgram);
    pgl.drawElements(pgl.TRIANGLES,pIndexBuffer.numItems,pgl.UNSIGNED_SHORT, 0);  
    skeleton_mvPopMatrix();}
function drawSkeleton(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,pupperbodyangle,
				pmvMatrix,ppMatrix,pshaderProgram,		        		        
				pPushRotationMatrix,pPopRotationMatrix,
        pleft_upper_arm_angle,pright_upper_arm_angle,                
        pleft_hip_angle,pright_hip_angle,                        
        pright_lower_arm_angle,pleft_lower_arm_angle,
        pright_wrist_angle,pleft_wrist_angle,
        pleft_leg_angle,pright_leg_angle,pleft_lowleg_angle,pright_lowleg_angle)
{  
  pPushRotationMatrix();
  mat4.rotate(pmodelRotationMatrix,pmodelRotationMatrix,degToRad(pupperbodyangle),[1,0,0]);//side view  
  //draw the head
  skeleton_mvMatrix=pmvMatrix;
  skeleton_pMatrix=ppMatrix;
  if (skull_VerticeBuffer)
   drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram,
        skull_VerticeBuffer,skull_NormalBuffer,skull_IndexBuffer,
            0,-1.8,0.5,//position
            0.15,0.15,0.15,//scale
            0,0,0,//rotation
            1,1,1);//color
  //neck
  if (neck_VerticeBuffer) drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram,
        neck_VerticeBuffer,neck_NormalBuffer,neck_IndexBuffer,
            0,-1.8,0.5,//position
            0.15,0.15,0.15,//scale
            0,0,0,//rotation
            1.0,1.0,1.0);//color   
  if (torso1_VerticeBuffer) drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram,        
        torso1_VerticeBuffer,torso1_NormalBuffer,torso1_IndexBuffer,
            0,-1,0.5,//position
            0.1,0.1,0.1,//scale
            0,0,0,//rotation
            1.0,1.0,1.0);//color
  if (torso2_VerticeBuffer)  
      drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram,        
        torso2_VerticeBuffer,torso2_NormalBuffer,torso2_IndexBuffer,
            0,-1,0.5,//position
            0.1,0.1,0.1,//scale
            0,0,0,//rotation
            1.0,1.0,1.0);//color
  //left upper arm  
  var left_upper_z=-(skeleton_upper_arm_length)*Math.sin(degToRad(pleft_upper_arm_angle-20));
  var left_upper_y=-(skeleton_upper_arm_length)*Math.cos(degToRad(pleft_upper_arm_angle-20));
  if (left_upper_arm_VerticeBuffer)
  {
    drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
        left_upper_arm_VerticeBuffer,left_upper_arm_NormalBuffer,left_upper_arm_IndexBuffer,//vertex,normal,buffers
           (skeleton_shoulder_width-skeleton_arm_diameter),left_upper_y+skeleton_upper_arm_y_offset,left_upper_z+skeleton_upper_arm_z_offset,//position           
            skeleton_arm_diameter,skeleton_upper_arm_length,skeleton_arm_diameter,//scale           
            pleft_upper_arm_angle-20,0,0,//rotation
            2.0,2.0,2.0);//color
  }
  //left lower arm
  var left_lower_z=-(skeleton_lower_arm_length)*Math.sin(degToRad(pleft_lower_arm_angle));
  var left_lower_y=-(skeleton_lower_arm_length)*Math.cos(degToRad(pleft_lower_arm_angle));  
  if (left_lower_arm_VerticeBuffer)
  {
     drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
       left_lower_arm_VerticeBuffer,left_lower_arm_NormalBuffer,left_lower_arm_IndexBuffer,//vertex,normal,buffers
           (skeleton_shoulder_width-skeleton_arm_diameter)+skeleton_lower_arm_x_offset,left_lower_y+left_upper_y+skeleton_lower_arm_y_offset,
           left_lower_z+left_upper_z+skeleton_lower_arm_z_offset,//position
            skeleton_lower_arm_diameter,skeleton_lower_arm_length,skeleton_lower_arm_diameter,//scale
            pleft_lower_arm_angle,0,0,//rotation
            2.0,2.0,2.0);//color
  }
  if (left_hand_VerticeBuffer)
  {
    drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
      left_hand_VerticeBuffer,left_hand_NormalBuffer,left_hand_IndexBuffer,//vertex,normal,buffers
           (skeleton_shoulder_width-skeleton_arm_diameter)+skeleton_lower_arm_x_offset,
          left_lower_y+left_upper_y+skeleton_lower_arm_y_offset,
           left_lower_z+left_upper_z+skeleton_lower_arm_z_offset,//position
            skeleton_hand_diameter,skeleton_hand_length,skeleton_hand_diameter,//scale
            //pleft_lower_arm_angle+180,0,0,//rotation
            pleft_wrist_angle,0,0,//rotation
            2.0,2.0,2.0);//color
  }
  //upper right arm  
  var right_upper_z=-(skeleton_upper_arm_length)*Math.sin(degToRad(pright_upper_arm_angle-20));
  var right_upper_y=-(skeleton_upper_arm_length)*Math.cos(degToRad(pright_upper_arm_angle-20));  
  if (right_upper_arm_VerticeBuffer)
  {
    drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
        right_upper_arm_VerticeBuffer,right_upper_arm_NormalBuffer,right_upper_arm_IndexBuffer,            
            -(skeleton_shoulder_width-skeleton_arm_diameter),
            right_upper_y+skeleton_upper_arm_y_offset,right_upper_z+skeleton_upper_arm_z_offset,//position
            skeleton_arm_diameter,skeleton_upper_arm_length,skeleton_arm_diameter,//scale
            pright_upper_arm_angle-20,0,0,//rotation
            2.0,2.0,2.0);//color
  }
  //right lower arm  
  var pright_upper_z=-(skeleton_upper_arm_length)*Math.sin(degToRad(pright_upper_arm_angle-20));
  var pright_upper_y=-(skeleton_upper_arm_length)*Math.cos(degToRad(pright_upper_arm_angle-20));  

  var right_lower_z=-(skeleton_lower_arm_length)*Math.sin(degToRad(pright_lower_arm_angle));
  var right_lower_y=-(skeleton_lower_arm_length)*Math.cos(degToRad(pright_lower_arm_angle));
    /*draw_cube(gl,shaderProgram,mvMatrix,pMatrix,cube[0],cube[1],cube[2],
    1,1,1,//scalex,y,z
    5,0,0,//color rgb
    -(skeleton_shoulder_width-skeleton_lower_arm_diameter)-4,
           right_lower_y+right_upper_y+skeleton_upper_arm_y_offset,
           right_lower_z+right_upper_z);//translate to x,y,z
    //5,0.9,-0.3*/    
  if (right_lower_arm_VerticeBuffer)
  {
    drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
        right_lower_arm_VerticeBuffer,right_lower_arm_NormalBuffer,right_lower_arm_IndexBuffer,//vertex,normal,buffers
           -(skeleton_shoulder_width-skeleton_lower_arm_diameter),
           right_lower_y+pright_upper_y+skeleton_upper_arm_y_offset,
           right_lower_z+pright_upper_z,//position
            skeleton_lower_arm_diameter,skeleton_lower_arm_length,skeleton_lower_arm_diameter,//scale
            pright_lower_arm_angle,0,0,//rotation
            2.0,2.0,2.0);//color
  }
  if (right_hand_VerticeBuffer)
  {
    drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
    right_hand_VerticeBuffer,right_hand_NormalBuffer,right_hand_IndexBuffer,//vertex,normal,buffers
           -(skeleton_shoulder_width-skeleton_arm_diameter),
          right_lower_y+right_upper_y+skeleton_lower_arm_y_offset,
           right_lower_z+right_upper_z+skeleton_lower_arm_z_offset,//position
            skeleton_hand_diameter,skeleton_hand_length,skeleton_hand_diameter,//scale
            //pright_lower_arm_angle+180,0,0,//rotation
            pright_wrist_angle,0,0,
            2.0,2.0,2.0);//color
  }        
  pPopRotationMatrix();
  
  //left thigh
  var left_upperleg_z=-(skeleton_thigh_length)*Math.sin(degToRad(pleft_hip_angle));
  var left_upperleg_y=-(skeleton_thigh_length)*Math.cos(degToRad(pleft_hip_angle));
  if (left_upper_leg_VerticeBuffer)
  {
     drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
    left_upper_leg_VerticeBuffer,left_upper_leg_NormalBuffer,left_upper_leg_IndexBuffer,
         (skeleton_hip_width-0.1),skeleton_thigh_y_offset+left_upperleg_y,
           left_upperleg_z,//position
            skeleton_thigh_diameter,skeleton_thigh_length,skeleton_thigh_diameter,//scale
            pleft_hip_angle,0,0,//rotation
            2.0,2.0,2.0);//color)
  }
  //right thigh
  var right_upperleg_z=-(skeleton_thigh_length)*Math.sin(degToRad(pright_hip_angle));
  var right_upperleg_y=-(skeleton_thigh_length)*Math.cos(degToRad(pright_hip_angle));
  if (right_upper_leg_VerticeBuffer)
  {
     drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
    right_upper_leg_VerticeBuffer,right_upper_leg_NormalBuffer,right_upper_leg_IndexBuffer,
         -(skeleton_hip_width-0.1),skeleton_thigh_y_offset+right_upperleg_y,
           right_upperleg_z,//position
            skeleton_thigh_diameter,skeleton_thigh_length,skeleton_thigh_diameter,//scale
            pright_hip_angle,0,0,//rotation
            2.0,2.0,2.0);//color)
  }
  //left lower leg
  var left_lowerleg_z=-(skeleton_shin_length)*Math.sin(degToRad(pleft_leg_angle));
  var left_lowerleg_y=-(skeleton_shin_length)*Math.cos(degToRad(pleft_leg_angle));  
  if (left_lower_leg_VerticeBuffer)
  {
   drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
    left_lower_leg_VerticeBuffer,left_lower_leg_NormalBuffer,left_lower_leg_IndexBuffer,
         (skeleton_hip_width-0.2),skeleton_thigh_y_offset+left_upperleg_y+left_lowerleg_y,left_upperleg_z+left_lowerleg_z,//position
            skeleton_shin_diameter,skeleton_shin_length,skeleton_shin_diameter,//scale
            pleft_leg_angle,0,0,//rotation
            2.0,2.0,2.0);//color)
  }
  //right lower leg
  var right_lowerleg_z=-(skeleton_shin_length)*Math.sin(degToRad(pright_leg_angle));
  var right_lowerleg_y=-(skeleton_shin_length)*Math.cos(degToRad(pright_leg_angle));  
  if (right_lower_leg_VerticeBuffer)
  {
     drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
   right_lower_leg_VerticeBuffer,right_lower_leg_NormalBuffer,right_lower_leg_IndexBuffer,
         -(skeleton_hip_width-0.2),skeleton_thigh_y_offset+right_upperleg_y+right_lowerleg_y,right_upperleg_z+right_lowerleg_z,//position
            skeleton_shin_diameter,skeleton_shin_length,skeleton_shin_diameter,//scale
            pright_leg_angle,0,0,//rotation
            2.0,2.0,2.0);//color)
  }
  
  //left foot
  var left_foot_z=-(skeleton_foot_length)*Math.sin(degToRad(pleft_lowleg_angle));
  var left_foot_y=-(skeleton_foot_length)*Math.cos(degToRad(pleft_lowleg_angle));  
  if (left_foot_VerticeBuffer)
  {
    drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
  left_foot_VerticeBuffer,left_foot_NormalBuffer,left_foot_IndexBuffer,
         (skeleton_hip_width-0.3),skeleton_thigh_y_offset+left_upperleg_y+left_lowerleg_y,left_upperleg_z+left_lowerleg_z,//position
            skeleton_foot_diameter,skeleton_foot_length,skeleton_foot_diameter,//scale
            pleft_lowleg_angle,0,0,//rotation
            2.0,2.0,2.0);//color)
 }
  //right foot
  var right_foot_z=-(skeleton_foot_length)*Math.sin(degToRad(pright_lowleg_angle));
  var right_foot_y=-(skeleton_foot_length)*Math.cos(degToRad(pright_lowleg_angle));
  if (right_foot_VerticeBuffer)
  {
     drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
  right_foot_VerticeBuffer,right_foot_NormalBuffer,right_foot_IndexBuffer,
         -(skeleton_hip_width-0.1),skeleton_thigh_y_offset+right_upperleg_y+right_lowerleg_y-0.2,right_upperleg_z+right_lowerleg_z-0.1,//position
            skeleton_foot_diameter,skeleton_foot_length,skeleton_foot_diameter,//scale
            pright_lowleg_angle,0,0,//rotation
            2.0,2.0,2.0);//color)
  }
}
function skeleton_mvPushMatrix(){//store the mvMatrix into a stack first
  var Acopy=mat4.create();
  mat4.copy(Acopy,skeleton_mvMatrix)
  skeleton_mvMatrixStack.push(Acopy);}
function skeleton_mvPopMatrix(){ //get the stored mvMatrix from the stack
  if (skeleton_mvMatrixStack.length==0)
  {
    throw "invalid pop matrix!";
  }
  skeleton_mvMatrix=skeleton_mvMatrixStack.pop();}
function skeleton_setMatrixUniforms(pgl,pshaderProgram) {
    //send the uniform matrices onto the shader (i.e. pMatrix->pshaderProgram.pMatrixUniform etc.)
   pgl.uniformMatrix4fv(pshaderProgram.pMatrixUniform, false, skeleton_pMatrix);
   pgl.uniformMatrix4fv(pshaderProgram.mvMatrixUniform, false, skeleton_mvMatrix);   
   var normalMatrix=mat3.create();
   mat3.normalFromMat4(normalMatrix,skeleton_mvMatrix);  //calculate a 3x3 normal matrix (transpose inverse) from a 4x4 matrix   
   pgl.uniformMatrix3fv(pshaderProgram.nMatrixUniform,false,normalMatrix);   }