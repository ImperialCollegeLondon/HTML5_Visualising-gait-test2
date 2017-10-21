//*************************************************************
// Gait visualisation - Skeleton
//
// the skeleton model was downloaded from http://www.cadnav.com
// then 3D Max to convert it to OBJ file
// then used the JNetCAD to convert it to JSON (http://www.johannes-raida.de/jnetcad.htm)
//
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
  //loadBone(pgl,"./3D models/skull1.json","skull");
  loadOBJFile("./3D models/skull.obj",skull_readOBJ_finish,obj3D_readMTL_finish);
  loadBone(pgl,"./3D models/neck1.json","neck");
  loadBone(pgl,"./3D models/torsoa.json","torso1");
  loadBone(pgl,"./3D models/torsob.json","torso2");
  loadBone(pgl,"./3D models/left_upper_arm1.json","leftupperarm");
  loadBone(pgl,"./3D models/left_lower_arm1.json","leftlowerarm");
  loadBone(pgl,"./3D models/right_upper_arm1.json","rightupperarm");
  loadBone(pgl,"./3D models/right_lower_arm1.json","rightlowerarm");
  loadBone(pgl,"./3D models/left_hand1.json","lefthand");
  loadBone(pgl,"./3D models/right_hand1.json","righthand");
  loadBone(pgl,"./3D models/left_upper_leg1.json","leftupperleg");
  loadBone(pgl,"./3D models/right_upper_leg1.json","rightupperleg");
  loadBone(pgl,"./3D models/left_lower_leg1.json","leftlowerleg");
  loadBone(pgl,"./3D models/right_lower_leg1.json","rightlowerleg");
  loadBone(pgl,"./3D models/left_foot1.json","leftfoot");
  loadBone(pgl,"./3D models/right_foot1.json","rightfoot");}
  //--------------------------------------------------------------
function createEmptyTexture(verticelength)
{
  var texture=[];
  var px=0;
  var py=0;
  var whichtexture=0;
  var incx=1.0/(verticelength/3);
  for (var i=0;i<verticelength/3;i++)
  {
    texture.push(px);
    texture.push(py);
    texture.push(whichtexture);
    px+=incx;
    py+=incx;
  }
  return texture;
}
  function obj3D_readMTL_finish(materials)
{}
function skull_readOBJ_finish(nobuffers,vertices,normals,indices,texture,materials,midx,midy,midz,maxrange) {//call back function for handling the OBJ file finishing event
  //nobuffers-> no of buffers needed, as indices can only be 16 bit... 65536
  //vertrices -> vertices read from the obj file
  //normals -> normal read from the obj file
  //indices -> indices of the object - read from the obj file
  //texture -> texture coordinates
  //materials -> name of material used in each vertice
  //midx,midy,midz -> mid point x,y,z
  //maxrange -> the longest axis size
  var obj3D_gl=skeleton_gl;
  var obj3D_noBuffers=nobuffers;
  var obj3D_vertices=[];
  var obj3D_normals=[];
  var obj3D_indices=[];
  var obj3D_texturecoord=[];
  var obj3D_materialNames=[];
  for (var i=0;i<obj3D_noBuffers;i++)
  {
    obj3D_vertices.push(vertices[i]);
    obj3D_normals.push(normals[i]);
    obj3D_indices.push(indices[i]);
    obj3D_materialNames.push(materials[i]);
    if (texture==undefined ||texture[i]==undefined||texture.length<=0||texture[i].length<=0)
        obj3D_texturecoord.push(createEmptyTexture(vertices[i].length));  
    else obj3D_texturecoord.push(texture[i]);        
  }
  var obj3D_vertices_midx=midx;
  var obj3D_vertices_midy=midy;
  var obj3D_vertices_midz=midz;
  var obj3D_vertices_maxrange=maxrange;

  var obj3D_verticeBuffer=[];
  var obj3D_NormalBuffer=[];
  var obj3D_IndexBuffer=[];
  var obj3D_TextureCoordBuffer=[];
  
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
    obj3D_TextureCoordBuffer[i]=obj3D_gl.createBuffer();
    obj3D_gl.bindBuffer(obj3D_gl.ARRAY_BUFFER,obj3D_TextureCoordBuffer[i]);
    obj3D_gl.bufferData(obj3D_gl.ARRAY_BUFFER,new Float32Array(obj3D_texturecoord[i]),obj3D_gl.STATIC_DRAW);
    //obj3D_TextureCoordBuffer[i].itemSize=2;
    obj3D_TextureCoordBuffer[i].itemSize=3;
    obj3D_TextureCoordBuffer[i].numItems=obj3D_texturecoord[i].length/3;    
    
  } 
  skull_VerticeBuffer=obj3D_verticeBuffer[0];
  skull_IndexBuffer=obj3D_IndexBuffer[0];
  skull_NormalBuffer=obj3D_NormalBuffer[0];

//    right_shoe_TextureCoordBuffer=obj3D_TextureCoordBuffer[0];    
  }

function loadBone(pgl,filename,whichobject){//load the mac book JSON file
  var request=new XMLHttpRequest();
  request.open("GET",filename);
  request.onreadystatechange=function(){
    if (request.readyState==4)
    {
      handleLoadedBone(pgl,JSON.parse(request.responseText),whichobject);//JSON parse and create the vertices of the laptop
    }
  }
  request.send();}
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
function handleLoadedBone(pgl,BoneData,whichobject){     
  var bone_verticeBuffer=pgl.createBuffer();    
  pgl.bindBuffer(pgl.ARRAY_BUFFER,bone_verticeBuffer);    
  var BoneVertices=BoneData.vertices;
  var normalised=false;
  if (whichobject=="leftupperarm"||whichobject=="rightupperarm" || 
    whichobject=="leftlowerarm" || whichobject=="rightlowerarm" ||
    whichobject=="lefthand" || whichobject=="righthand"||
    whichobject=="leftupperleg"||whichobject=="rightupperleg"||
    whichobject=="leftlowerleg"||whichobject=="rightlowerleg"||
    whichobject=="leftfoot" || whichobject=="rightfoot")
  {  //need to normalise the shape for accurate calculations of joint movement
    

    var ranges=FindRanges(BoneData.vertices);
    if (whichobject=="leftupperarm")
      BoneVertices=NormaliseVertices(BoneData.vertices,ranges,-1.3,0.2,0.5);   
    else if (whichobject=="rightupperarm")
      BoneVertices=NormaliseVertices(BoneData.vertices,ranges,1.35,0.1,-0.5);   
    else if (whichobject=="leftlowerarm")     
      BoneVertices=NormaliseVertices(BoneData.vertices,ranges,-5.2,1.8,0.5); 
    else if (whichobject=="rightlowerarm")  
      BoneVertices=NormaliseVertices(BoneData.vertices,ranges,5,1.9,-0.3); 
    else if (whichobject=="lefthand")
      BoneVertices=pNormaliseVertices(BoneData.vertices,ranges,0,-3.7,0); 
    else if (whichobject=="righthand")
      BoneVertices=pNormaliseVertices(BoneData.vertices,ranges,-1.2,-3.8,-0.5); 
    else if (whichobject=="leftupperleg")
      BoneVertices=NormaliseVertices(BoneData.vertices,ranges,-1,1.5,0.2); 
    else if (whichobject=="rightupperleg")
      BoneVertices=NormaliseVertices(BoneData.vertices,ranges,1.1,1.5,0.2); 
    else if (whichobject=="leftlowerleg")
      BoneVertices=NormaliseVertices(BoneData.vertices,ranges,-1,2.5,0.5); 
    else if (whichobject=="rightlowerleg")
      BoneVertices=NormaliseVertices(BoneData.vertices,ranges,1,2.5,0.5); 
    else if (whichobject=="leftfoot")
      BoneVertices=pNormaliseVertices(BoneData.vertices,ranges,0,0,0); 
    else if (whichobject=="rightfoot")
      BoneVertices=pNormaliseVertices(BoneData.vertices,ranges,0,0,0); 
    else BoneVertices=NormaliseVertices(BoneData.vertices,ranges,0,0,0);   
    normalised=true;
  }
  pgl.bufferData(pgl.ARRAY_BUFFER,new Float32Array(BoneVertices),pgl.STATIC_DRAW);
  bone_verticeBuffer.itemSize=3;  
  bone_verticeBuffer.numItems=BoneVertices.length/3; 
  
  var bone_IndexBuffer=pgl.createBuffer();
  pgl.bindBuffer(pgl.ELEMENT_ARRAY_BUFFER,bone_IndexBuffer);
  var indices=[];
  var normals=[];
  for (var i=0;i<BoneData.faces.length;i+=10)
  {
    /*var type=BoneData.faces[i];
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
        var normalindex=BoneData.faces[i+4+j]*3;        
        normals.push(-BoneData.normals[normalindex++]);
        normals.push(-BoneData.normals[normalindex++]-1.5);
        normals.push(-BoneData.normals[normalindex++]);
      }
    }*/
    indices.push(BoneData.faces[i+1]);
    indices.push(BoneData.faces[i+2]);
    indices.push(BoneData.faces[i+3]);    
    //calculate the surface normal
    var ipos0=BoneData.faces[i+1]*3;
    var ipos1=BoneData.faces[i+2]*3;
    var ipos2=BoneData.faces[i+3]*3;
    var ux=BoneVertices[ipos1]-BoneVertices[ipos0];
    var uy=BoneVertices[ipos1+1]-BoneVertices[ipos0+1];
    var uz=BoneVertices[ipos1+2]-BoneVertices[ipos0+2];
    var vx=BoneVertices[ipos2]-BoneVertices[ipos1];
    var vy=BoneVertices[ipos2+1]-BoneVertices[ipos1+1];
    var vz=BoneVertices[ipos2+2]-BoneVertices[ipos1+2];
    var nx=uy*vz-uz*vy;
    var ny=uz*vx-ux*vz+0.05;    
    var nz=ux*vy-uy*vx;
    if (normalised)
      nz+=0.2;
    var nlen=Math.sqrt(nx*nx+ny*ny+nz*nz);
    normals.push(-nx/nlen);
    normals.push(-ny/nlen);
    normals.push(-nz/nlen);
  }
  pgl.bufferData(pgl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),pgl.STREAM_DRAW);  
  bone_IndexBuffer.itemSize=1;
  bone_IndexBuffer.numItems=indices.length;  
  var bone_NormalBuffer=pgl.createBuffer();  
  pgl.bindBuffer(pgl.ARRAY_BUFFER,bone_NormalBuffer);  
  //pgl,.bufferData(gl.ARRAY_BUFFER,new Float32Array(BoneData.normals),pgl,.STATIC_DRAW);
  pgl.bufferData(pgl.ARRAY_BUFFER,new Float32Array(normals),pgl.STATIC_DRAW);
  //pgl,.bufferData(pgl,.ARRAY_BUFFER,new Float32Array(BoneData.vertices),pgl,.STATIC_DRAW);
  bone_NormalBuffer.itemSize=3;  
  //bone_NormalBuffer.numItems=BoneData.normals.length/3;
  bone_NormalBuffer.numItems=normals.length/3;
  //bone_NormalBuffer.numItems=BoneData.vertices.length/3;  
  if (whichobject=="skull")
  {
    skull_VerticeBuffer=bone_verticeBuffer;
    skull_NormalBuffer=bone_NormalBuffer;
    skull_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="neck")
  {
    neck_VerticeBuffer=bone_verticeBuffer;
    neck_NormalBuffer=bone_NormalBuffer;
    neck_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="torso1")
  {
    torso1_VerticeBuffer=bone_verticeBuffer;
    torso1_NormalBuffer=bone_NormalBuffer;
    torso1_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="torso2")
  {
    torso2_VerticeBuffer=bone_verticeBuffer;
    torso2_NormalBuffer=bone_NormalBuffer;
    torso2_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="leftupperarm")
  {
    left_upper_arm_VerticeBuffer=bone_verticeBuffer;
    left_upper_arm_NormalBuffer=bone_NormalBuffer;
    left_upper_arm_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="rightupperarm")
  {
    right_upper_arm_VerticeBuffer=bone_verticeBuffer;
    right_upper_arm_NormalBuffer=bone_NormalBuffer;
    right_upper_arm_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="leftlowerarm")
  {
    left_lower_arm_VerticeBuffer=bone_verticeBuffer;
    left_lower_arm_NormalBuffer=bone_NormalBuffer;
    left_lower_arm_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="rightlowerarm")
  {
    right_lower_arm_VerticeBuffer=bone_verticeBuffer;
    right_lower_arm_NormalBuffer=bone_NormalBuffer;
    right_lower_arm_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="lefthand")
  {
    left_hand_VerticeBuffer=bone_verticeBuffer;
    left_hand_NormalBuffer=bone_NormalBuffer;
    left_hand_IndexBuffer=bone_IndexBuffer;  
  }
  else if (whichobject=="righthand")
  {
    right_hand_VerticeBuffer=bone_verticeBuffer;
    right_hand_NormalBuffer=bone_NormalBuffer;
    right_hand_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="leftupperleg")
  {
    left_upper_leg_VerticeBuffer=bone_verticeBuffer;
    left_upper_leg_NormalBuffer=bone_NormalBuffer;
    left_upper_leg_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="rightupperleg")
  {
    right_upper_leg_VerticeBuffer=bone_verticeBuffer;
    right_upper_leg_NormalBuffer=bone_NormalBuffer;
    right_upper_leg_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="leftlowerleg")
  {
    left_lower_leg_VerticeBuffer=bone_verticeBuffer;
    left_lower_leg_NormalBuffer=bone_NormalBuffer;
    left_lower_leg_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="rightlowerleg")
  {
    right_lower_leg_VerticeBuffer=bone_verticeBuffer;
    right_lower_leg_NormalBuffer=bone_NormalBuffer;
    right_lower_leg_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="leftfoot")
  {
    left_foot_VerticeBuffer=bone_verticeBuffer;
    left_foot_NormalBuffer=bone_NormalBuffer;
    left_foot_IndexBuffer=bone_IndexBuffer;
  }
  else if (whichobject=="rightfoot")
  {
    right_foot_VerticeBuffer=bone_verticeBuffer;
    right_foot_NormalBuffer=bone_NormalBuffer;
    right_foot_IndexBuffer=bone_IndexBuffer;
  }}
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
            //0.5,0.5,0.5);//color
  else drawCylinder(0,1,0,0.24,0.2,0.24,0,0,0,1.0,0.5,0.5);//(posx,posy,posz,scalex,scaley,scalez,rotatex,rotatey,rotatez,colorr,colorg,colorb)
  //neck
  if (neck_VerticeBuffer) drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram,
        neck_VerticeBuffer,neck_NormalBuffer,neck_IndexBuffer,
            0,-1.8,0.5,//position
            0.15,0.15,0.15,//scale
            0,0,0,//rotation
            //1.0,1.0,1.0);//color   
            0.5,0.5,0.5);//color
  else drawCylinder(0,0.65,0,0.1,0.15,0.1,0,0,0,1.0,0.5,0.5);
  if (torso1_VerticeBuffer) drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram,        
        torso1_VerticeBuffer,torso1_NormalBuffer,torso1_IndexBuffer,
            0,-1,0.5,//position
            0.1,0.1,0.1,//scale
            0,0,0,//rotation
            //1.0,1.0,1.0);//color
            0.5,0.5,0.5);//color
  if (torso2_VerticeBuffer)  
      drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram,        
        torso2_VerticeBuffer,torso2_NormalBuffer,torso2_IndexBuffer,
            0,-1,0.5,//position
            0.1,0.1,0.1,//scale
            0,0,0,//rotation
            //.0,1.0,1.0);//color
            0.5,0.5,0.5);//color
  else {
    //shoulder
    drawCylinder(0,shoulder_y,0,shoulder_diameter,cylinder_shoulder_width,shoulder_diameter,0,0,90,1.0,0.5,0.5);
     //torso
    drawCylinder(0,-0.6,0,0.5,1,0.5,0,0,0,1.0,0.5,0.5);  
  }

  //left upper arm  
  var left_upper_z=-(skeleton_upper_arm_length)*Math.sin(degToRad(pleft_upper_arm_angle-20));
  var left_upper_y=-(skeleton_upper_arm_length)*Math.cos(degToRad(pleft_upper_arm_angle-20));
  var cylinder_left_upper_z=-(cylinder_upper_arm_length)*Math.sin(degToRad(pleft_upper_arm_angle));
  var cylinder_left_upper_y=-(cylinder_upper_arm_length)*Math.cos(degToRad(pleft_upper_arm_angle));    
  if (left_upper_arm_VerticeBuffer)
  {
    drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
        left_upper_arm_VerticeBuffer,left_upper_arm_NormalBuffer,left_upper_arm_IndexBuffer,//vertex,normal,buffers
           (skeleton_shoulder_width-skeleton_arm_diameter),left_upper_y+skeleton_upper_arm_y_offset,left_upper_z+skeleton_upper_arm_z_offset,//position           
            skeleton_arm_diameter,skeleton_upper_arm_length,skeleton_arm_diameter,//scale           
            pleft_upper_arm_angle-20,0,0,//rotation
            1.0,1.0,1.0);//color
    //var pleft_upper_z=-(skeleton_upper_arm_length)*Math.sin(degToRad(pleft_upper_arm_angle));
    //var pleft_upper_y=-(skeleton_upper_arm_length)*Math.cos(degToRad(pleft_upper_arm_angle));
    //drawCylinder((skeleton_shoulder_width-skeleton_arm_diameter),pleft_upper_y+skeleton_upper_arm_y_offset,pleft_upper_z+skeleton_upper_arm_z_offset,0.1,skeleton_upper_arm_length,0.1,pleft_upper_arm_angle,0,0,1.0,0.5,0.5);  //for finding the 3D model offsets
  }
  else {
    drawCylinder((cylinder_shoulder_width-cylinder_arm_diameter),cylinder_left_upper_y+cylinder_upper_arm_y ,cylinder_left_upper_z,cylinder_arm_diameter,cylinder_upper_arm_length,cylinder_arm_diameter,
        pleft_upper_arm_angle,0,0,1.0,0.5,0.5);  
  }
  //left lower arm
  var left_lower_z=-(skeleton_lower_arm_length)*Math.sin(degToRad(pleft_lower_arm_angle));
  var left_lower_y=-(skeleton_lower_arm_length)*Math.cos(degToRad(pleft_lower_arm_angle));  
  var cylinder_left_lower_z=-(cylinder_lower_arm_length)*Math.sin(degToRad(pleft_lower_arm_angle+180));
  var cylinder_left_lower_y=-(cylinder_lower_arm_length)*Math.cos(degToRad(pleft_lower_arm_angle+180));  
  if (left_lower_arm_VerticeBuffer)
  {
     drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
       left_lower_arm_VerticeBuffer,left_lower_arm_NormalBuffer,left_lower_arm_IndexBuffer,//vertex,normal,buffers
           (skeleton_shoulder_width-skeleton_arm_diameter)+skeleton_lower_arm_x_offset,left_lower_y+left_upper_y+skeleton_lower_arm_y_offset,
           left_lower_z+left_upper_z+skeleton_lower_arm_z_offset,//position
            skeleton_lower_arm_diameter,skeleton_lower_arm_length,skeleton_lower_arm_diameter,//scale
            pleft_lower_arm_angle,0,0,//rotation
            1.0,1.0,1.0);//color
     //drawCylinder((skeleton_shoulder_width-skeleton_arm_diameter)+skeleton_lower_arm_x_offset,left_lower_y+left_upper_y+skeleton_lower_arm_y_offset,left_lower_z+left_upper_z+lower_arm_z,//position
     //         0.1,skeleton_lower_arm_length,0.1,
     //         pleft_lower_arm_angle,0,0,1.0,1,0.5);
  }
  else drawCylinder((cylinder_shoulder_width-cylinder_arm_diameter),cylinder_left_lower_y+cylinder_left_upper_y*2,
          cylinder_left_lower_z+cylinder_left_upper_z*2,
              cylinder_arm_diameter,cylinder_lower_arm_length,cylinder_arm_diameter,
             pleft_lower_arm_angle+180,0,0,1.0,1,0.5);
  if (left_hand_VerticeBuffer)
  {
    drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
      left_hand_VerticeBuffer,left_hand_NormalBuffer,left_hand_IndexBuffer,//vertex,normal,buffers
           (skeleton_shoulder_width-skeleton_arm_diameter)+skeleton_lower_arm_x_offset,
          left_lower_y+left_upper_y+skeleton_lower_arm_y_offset,
           left_lower_z+left_upper_z+skeleton_lower_arm_z_offset,//position
            skeleton_hand_diameter,skeleton_hand_length,skeleton_hand_diameter,//scale
            pleft_lower_arm_angle+180,0,0,//rotation
            1.0,1.0,1.0);//color
    //drawCylinder((skeleton_shoulder_width-skeleton_arm_diameter)+skeleton_lower_arm_x_offset,left_lower_y+left_upper_y+skeleton_lower_arm_y_offset,left_lower_z+left_upper_z+skeleton_lower_arm_z_offset,//position
      //        0.1,skeleton_hand_length,0.1,pleft_lower_arm_angle,0,0,1.0,1,0.5);
  }
  //upper right arm  
  var right_upper_z=-(skeleton_upper_arm_length)*Math.sin(degToRad(pright_upper_arm_angle-20));
  var right_upper_y=-(skeleton_upper_arm_length)*Math.cos(degToRad(pright_upper_arm_angle-20));  
  var cylinder_right_upper_z=-(cylinder_upper_arm_length)*Math.sin(degToRad(pright_upper_arm_angle));
  var cylinder_right_upper_y=-(cylinder_upper_arm_length)*Math.cos(degToRad(pright_upper_arm_angle));  
  if (right_upper_arm_VerticeBuffer)
  {
  drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
     right_upper_arm_VerticeBuffer,right_upper_arm_NormalBuffer,right_upper_arm_IndexBuffer,            
            -(skeleton_shoulder_width-skeleton_arm_diameter),right_upper_y+skeleton_upper_arm_y_offset,right_upper_z+skeleton_upper_arm_z_offset,//position
            skeleton_arm_diameter,skeleton_upper_arm_length,skeleton_arm_diameter,//scale
            pright_upper_arm_angle-20,0,0,//rotation
            1.0,1.0,1.0);//color
    //var pright_upper_z=-(skeleton_upper_arm_length)*Math.sin(degToRad(pright_upper_arm_angle));
    //var pright_upper_y=-(skeleton_upper_arm_length)*Math.cos(degToRad(pright_upper_arm_angle));  
    //drawCylinder(-(skeleton_shoulder_width-skeleton_arm_diameter),pright_upper_y+skeleton_upper_arm_y_offset,pright_upper_z+skeleton_upper_arm_z_offset,0.1,skeleton_upper_arm_length,0.1,pright_upper_arm_angle,0,0,1.0,0.5,0.5);  //for finding the 3D model offsets
  }
  else drawCylinder(-(cylinder_shoulder_width-cylinder_arm_diameter),cylinder_right_upper_y+cylinder_upper_arm_y,cylinder_right_upper_z,cylinder_arm_diameter,cylinder_upper_arm_length,cylinder_arm_diameter,
            pright_upper_arm_angle,0,0,1.0,0.5,0.5);
  //right lower arm  
  var right_lower_z=-(skeleton_lower_arm_length)*Math.sin(degToRad(pright_lower_arm_angle));
  var right_lower_y=-(skeleton_lower_arm_length)*Math.cos(degToRad(pright_lower_arm_angle));
  var cylinder_right_lower_z=-(cylinder_lower_arm_length)*Math.sin(degToRad(pright_lower_arm_angle+180));
  var cylinder_right_lower_y=-(cylinder_lower_arm_length)*Math.cos(degToRad(pright_lower_arm_angle)+180);  
  if (right_lower_arm_VerticeBuffer)
  {
    drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
    right_lower_arm_VerticeBuffer,right_lower_arm_NormalBuffer,right_lower_arm_IndexBuffer,//vertex,normal,buffers
           -(skeleton_shoulder_width-skeleton_lower_arm_diameter),
           right_lower_y+right_upper_y+skeleton_upper_arm_y_offset,
           right_lower_z+right_upper_z,//position
            skeleton_lower_arm_diameter,skeleton_lower_arm_length,skeleton_lower_arm_diameter,//scale
            pright_lower_arm_angle,0,0,//rotation
            1.0,1.0,1.0);//color
     //drawCylinder(-(skeleton_shoulder_width-skeleton_lower_arm_diameter),right_lower_y+right_upper_y,right_lower_z+right_upper_z,//position
       //      0.1,skeleton_lower_arm_length,0.1,pright_lower_arm_angle,0,0,1.0,1,0.5);
  }
  else drawCylinder(-(cylinder_shoulder_width-cylinder_arm_diameter),cylinder_right_lower_y+cylinder_right_upper_y*2,cylinder_right_upper_z*2+cylinder_right_lower_z,
            cylinder_arm_diameter,cylinder_lower_arm_length,cylinder_arm_diameter,pright_lower_arm_angle+180,0,0,1.0,1,0.5);
  if (right_hand_VerticeBuffer)
  {
    drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
    right_hand_VerticeBuffer,right_hand_NormalBuffer,right_hand_IndexBuffer,//vertex,normal,buffers
           -(skeleton_shoulder_width-skeleton_arm_diameter),
          right_lower_y+right_upper_y+skeleton_lower_arm_y_offset,
           right_lower_z+right_upper_z+skeleton_lower_arm_z_offset,//position
            skeleton_hand_diameter,skeleton_hand_length,skeleton_hand_diameter,//scale
            pright_lower_arm_angle+180,0,0,//rotation
            1.0,1.0,1.0);//color
    //drawCylinder(-(skeleton_shoulder_width-skeleton_arm_diameter)+skeleton_lower_arm_x_offset,right_lower_y+right_upper_y+skeleton_lower_arm_y_offset,right_lower_z+right_upper_z+skeleton_lower_arm_z_offset,//position
      //        0.1,skeleton_hand_length,0.1,pright_lower_arm_angle,0,0,1.0,1,0.5);
  }        
  pPopRotationMatrix();

  if (!torso2_VerticeBuffer)
  {
    //waist
    drawCylinder(0,waist_y,0,waist_diameter,waist_length,waist_diameter,0,0,0,
              1.0,0.5,0.5);
    //hip
    drawCylinder(0,hip_y,0,hip_diameter,skeleton_hip_width,hip_diameter,0,0,90,1.0,0.5,0.5);
  }
  
  //left thigh
  var left_upperleg_z=-(skeleton_thigh_length)*Math.sin(degToRad(pleft_hip_angle));
  var left_upperleg_y=-(skeleton_thigh_length)*Math.cos(degToRad(pleft_hip_angle));
  var cylinder_left_upperleg_z=-cylinder_thigh_length*Math.sin(degToRad(pleft_hip_angle));
  var cylinder_left_upperleg_y=-cylinder_thigh_length*Math.cos(degToRad(pleft_hip_angle));
  if (left_upper_leg_VerticeBuffer)
  {
     drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
    left_upper_leg_VerticeBuffer,left_upper_leg_NormalBuffer,left_upper_leg_IndexBuffer,
         (skeleton_hip_width-0.1),skeleton_thigh_y_offset+left_upperleg_y,
           left_upperleg_z,//position
            skeleton_thigh_diameter,skeleton_thigh_length,skeleton_thigh_diameter,//scale
            pleft_hip_angle,0,0,//rotation
            1.0,1.0,1.0);//color)
    //drawCylinder((skeleton_hip_width-0.1),skeleton_thigh_y_offset+left_upperleg_y,left_upperleg_z,//position
    //           0.1,skeleton_thigh_length,0.1,pleft_hip_angle,0,0,1.0,1,0.5);
    //draw an arrow
     //drawArrow((skeleton_hip_width-0.1),skeleton_thigh_y_offset+left_upperleg_y,left_upperleg_z,
       //     skeleton_thigh_diameter,skeleton_thigh_length,skeleton_thigh_diameter,pleft_hip_angle,0,0,    1.0,0,0);
  }
  else drawCylinder((skeleton_hip_width-0.1),skeleton_thigh_y_offset+cylinder_left_upperleg_y,cylinder_left_upperleg_z,
        cylinder_thigh_diameter,cylinder_thigh_length,cylinder_thigh_diameter,pleft_hip_angle,0,0,1.0,0.5,0.5);
  //right thigh
  var right_upperleg_z=-(skeleton_thigh_length)*Math.sin(degToRad(pright_hip_angle));
  var right_upperleg_y=-(skeleton_thigh_length)*Math.cos(degToRad(pright_hip_angle));
  var cylinder_right_upperleg_z=-(cylinder_thigh_length)*Math.sin(degToRad(pright_hip_angle));
  var cylinder_right_upperleg_y=-(cylinder_thigh_length)*Math.cos(degToRad(pright_hip_angle));
  if (right_upper_leg_VerticeBuffer)
  {
     drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
    right_upper_leg_VerticeBuffer,right_upper_leg_NormalBuffer,right_upper_leg_IndexBuffer,
         -(skeleton_hip_width-0.1),skeleton_thigh_y_offset+right_upperleg_y,
           right_upperleg_z,//position
            skeleton_thigh_diameter,skeleton_thigh_length,skeleton_thigh_diameter,//scale
            pright_hip_angle,0,0,//rotation
            1.0,1.0,1.0);//color)

    //drawCylinder(-(skeleton_hip_width-0.1),skeleton_thigh_y_offset+right_upperleg_y,right_upperleg_z,//position
    //          0.1,skeleton_thigh_length,0.1,pright_hip_angle,0,0,1.0,1,0.5);
  }
  else drawCylinder(-(skeleton_hip_width-0.1),skeleton_thigh_y_offset+cylinder_right_upperleg_y,cylinder_right_upperleg_z,
          cylinder_thigh_diameter,cylinder_thigh_length,cylinder_thigh_diameter,pright_hip_angle,0,0,1.0,0.5,0.5);
  //left lower leg
  var left_lowerleg_z=-(skeleton_shin_length)*Math.sin(degToRad(pleft_leg_angle));
  var left_lowerleg_y=-(skeleton_shin_length)*Math.cos(degToRad(pleft_leg_angle));  
  var cylinder_left_lowerleg_z=-(cylinder_shin_length)*Math.sin(degToRad(pleft_leg_angle));
  var cylinder_left_lowerleg_y=-(cylinder_shin_length)*Math.cos(degToRad(pleft_leg_angle));  
  if (left_lower_leg_VerticeBuffer)
  {
   drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
    left_lower_leg_VerticeBuffer,left_lower_leg_NormalBuffer,left_lower_leg_IndexBuffer,
         (skeleton_hip_width-0.2),skeleton_thigh_y_offset+left_upperleg_y+left_lowerleg_y,left_upperleg_z+left_lowerleg_z,//position
            skeleton_shin_diameter,skeleton_shin_length,skeleton_shin_diameter,//scale
            pleft_leg_angle,0,0,//rotation
            1.0,1.0,1.0);//color)

    //drawCylinder((skeleton_hip_width-0.2),left_lowerleg_y+left_upperleg_y-2.1,left_lowerleg_z+left_upperleg_z,//position
      //       0.1,skeleton_shin_length,0.1,pleft_leg_angle,0,0,1.0,1,0.5);
  }
  else drawCylinder((skeleton_hip_width-0.1),cylinder_left_upperleg_y*2+cylinder_left_lowerleg_y+shin_y,
            cylinder_left_upperleg_z*2+cylinder_left_lowerleg_z,
              cylinder_shin_diameter,cylinder_shin_length,cylinder_shin_diameter,pleft_leg_angle,0,0,1.0,1.0,0.5);
  //right lower leg
  var right_lowerleg_z=-(skeleton_shin_length)*Math.sin(degToRad(pright_leg_angle));
  var right_lowerleg_y=-(skeleton_shin_length)*Math.cos(degToRad(pright_leg_angle));  
  var cylinder_right_lowerleg_z=-(cylinder_shin_length)*Math.sin(degToRad(pright_leg_angle));
  var cylinder_right_lowerleg_y=-(cylinder_shin_length)*Math.cos(degToRad(pright_leg_angle));  
  if (right_lower_leg_VerticeBuffer)
  {
     drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
   right_lower_leg_VerticeBuffer,right_lower_leg_NormalBuffer,right_lower_leg_IndexBuffer,
         -(skeleton_hip_width-0.2),skeleton_thigh_y_offset+right_upperleg_y+right_lowerleg_y,right_upperleg_z+right_lowerleg_z,//position
            skeleton_shin_diameter,skeleton_shin_length,skeleton_shin_diameter,//scale
            pright_leg_angle,0,0,//rotation
            1.0,1.0,1.0);//color)
    //drawCylinder(-(skeleton_hip_width-0.2),skeleton_thigh_y_offset+right_upperleg_y+right_lowerleg_y,right_upperleg_z+right_lowerleg_z,//position
      //       0.1,skeleton_shin_length,0.1,pright_leg_angle,0,0,1.0,1,0.5);

  }
  else drawCylinder(-(skeleton_hip_width-0.1),shin_y+cylinder_right_upperleg_y*2+cylinder_right_lowerleg_y,
        cylinder_right_upperleg_z*2+cylinder_right_lowerleg_z,
          cylinder_shin_diameter,cylinder_shin_length,cylinder_shin_diameter,pright_leg_angle,0,0,1.0,1.0,0.5);
  
  //left foot
  var left_foot_z=-(skeleton_foot_length)*Math.sin(degToRad(pleft_lowleg_angle));
  var left_foot_y=-(skeleton_foot_length)*Math.cos(degToRad(pleft_lowleg_angle));
  var cylinder_left_foot_z=-(cylinder_foot_length)*Math.sin(degToRad(pleft_lowleg_angle-90));
  var cylinder_left_foot_y=-(cylinder_foot_length)*Math.cos(degToRad(pleft_lowleg_angle-90));
  
  if (left_foot_VerticeBuffer)
  {
    drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
  left_foot_VerticeBuffer,left_foot_NormalBuffer,left_foot_IndexBuffer,
         (skeleton_hip_width-0.3),skeleton_thigh_y_offset+left_upperleg_y+left_lowerleg_y,left_upperleg_z+left_lowerleg_z,//position
            skeleton_foot_diameter,skeleton_foot_length,skeleton_foot_diameter,//scale
            pleft_lowleg_angle,0,0,//rotation
            1.0,1.0,1.0);//color)
   // drawCylinder((skeleton_hip_width-0.2),skeleton_thigh_y_offset+left_upperleg_y+left_lowerleg_y,left_upperleg_z+left_lowerleg_z,//position
     //        0.1,skeleton_shin_length,0.1,pleft_leg_angle,0,0,1.0,1,0.5);
  }
 else drawCylinder((skeleton_hip_width-0.1),shin_y+cylinder_left_upperleg_y*2+cylinder_left_lowerleg_y*2+foot_y+cylinder_left_foot_y,
            cylinder_left_foot_z+cylinder_left_upperleg_z*2+cylinder_left_lowerleg_z*2,
        cylinder_foot_diameter,cylinder_foot_length,cylinder_foot_diameter,pleft_lowleg_angle-90,0,0,1.0,0,1.0);
  //right foot
  var right_foot_z=-(skeleton_foot_length)*Math.sin(degToRad(pright_lowleg_angle));
  var right_foot_y=-(skeleton_foot_length)*Math.cos(degToRad(pright_lowleg_angle));
  var cylinder_right_foot_z=-(cylinder_foot_length)*Math.sin(degToRad(pright_lowleg_angle-90));
  var cylinder_right_foot_y=-(cylinder_foot_length)*Math.cos(degToRad(pright_lowleg_angle-90));
  if (right_foot_VerticeBuffer)
  {
     drawBones(pgl,pfigureposx,pfigureposy,pzoom_rate,pmodelRotationMatrix,
        skeleton_mvMatrix,skeleton_pMatrix,pshaderProgram, 
  right_foot_VerticeBuffer,right_foot_NormalBuffer,right_foot_IndexBuffer,
         -(skeleton_hip_width-0.1),skeleton_thigh_y_offset+right_upperleg_y+right_lowerleg_y-0.2,right_upperleg_z+right_lowerleg_z-0.1,//position
            skeleton_foot_diameter,skeleton_foot_length,skeleton_foot_diameter,//scale
            pright_lowleg_angle,0,0,//rotation
            1.0,1.0,1.0);//color)
   // drawCylinder((skeleton_hip_width-0.2),skeleton_thigh_y_offset+left_upperleg_y+left_lowerleg_y,left_upperleg_z+left_lowerleg_z,//position
     //        0.1,skeleton_shin_length,0.1,pleft_leg_angle,0,0,1.0,1,0.5);
  }
  else drawCylinder(-(skeleton_hip_width-0.1),shin_y+cylinder_right_upperleg_y*2+cylinder_right_lowerleg_y*2+foot_y+cylinder_right_foot_y,
            cylinder_right_foot_z+cylinder_right_upperleg_z*2+cylinder_right_lowerleg_z*2,
            cylinder_foot_diameter,cylinder_foot_length,cylinder_foot_diameter,pright_lowleg_angle-90,0,0,1.0,0,1.0);}
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