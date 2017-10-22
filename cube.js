//*************************************************************
// cube.js
//
// draw 3D cube
//
// Benny Lo 
// Aug 12 2017
//****************************************************************
function init_cube_buffers(pgl){
    cubevertices=[
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
     cubeVertexIndices=[ 
      0, 1, 2, 0, 2, 3,//front face  
      4, 5, 6, 4, 6, 7,//back face  
      8, 9,10, 8,10,11,//top face  
      12,13,14,12,14,15,//bottom face  
      16,17,18,16,18,19, //right face  
      20,21,22,20,22,23//left face  
      ];    
     //normal buffer
    cubevertexNormals=[
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
    var vertices,normals,indices;
    vertices=pgl.createBuffer();
    pgl.bindBuffer(pgl.ARRAY_BUFFER,vertices);
    pgl.bufferData(pgl.ARRAY_BUFFER,new Float32Array(cubevertices),pgl.STATIC_DRAW);
    vertices.itemSize=3;
    vertices.numItems=cubevertices.length/3;
   
    normals=pgl.createBuffer();
    pgl.bindBuffer(pgl.ARRAY_BUFFER,normals);
    pgl.bufferData(pgl.ARRAY_BUFFER,new Float32Array(cubevertexNormals),pgl.STATIC_DRAW);
    normals.itemSize=3;
    normals.numItems=24;
    
    indices=pgl.createBuffer();
    pgl.bindBuffer(pgl.ELEMENT_ARRAY_BUFFER,indices);
    pgl.bufferData(pgl.ELEMENT_ARRAY_BUFFER,new Uint16Array(cubeVertexIndices),pgl.STATIC_DRAW);      
    indices.itemSize=1;
    indices.numItems=36;
    var results=[];
    results[0]=vertices;
    results[1]=normals;
    results[2]=indices;
    return results;}

function draw_cube(pgl,shaderProgram,p_mvMatrix,p_pMatrix,pvertice,pnormal,pindex,
    scalex,scaley,scalez,
    colorr,colorg,colorb,
    tranx,trany,tranz){ //draw a cube
  //pgl -> pointer to web GL
  //shaderProgram -> shader program
  //p_mvMatrix -> model matrix
  //p_pMatrix -> projection matrix
  //pvertice,pnormal,pindex -> vertice, normal and index buffer
  //scalex,scaley,scalez -> scale
  //colorr,colorg,colorb-> color
  //tranx,trany,tranz->translation positions x,y,z

    var cube_mvMatrix=p_mvMatrix;
    pgl.useProgram(shaderProgram);           
   // pgl.uniform3f(shaderProgram.ambientColorUniform, 0.8,0.8,0.8);      
    pgl.uniform3f(shaderProgram.ambientColorUniform, 0.2,0.2,0.2);      
    pgl.uniform3f(shaderProgram.directionalColorUniform,
      1,1,1);
      //8,8,8);
    pgl.uniform3f(shaderProgram.lineColor,colorr,colorg,colorb);
    mat4.scale(cube_mvMatrix,cube_mvMatrix,[scalex,scaley,scalez]);
    mat4.translate(cube_mvMatrix,cube_mvMatrix,[tranx,trany,tranz]);//rotate to the tilt angle    
    pgl.bindBuffer(pgl.ARRAY_BUFFER,pvertice);  
    pgl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,pvertice.itemSize,pgl.FLOAT,false,0,0);
    pgl.bindBuffer(pgl.ARRAY_BUFFER,pnormal);
    pgl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,pnormal.itemSize,pgl.FLOAT,false,0,0);  
    pgl.bindBuffer(pgl.ELEMENT_ARRAY_BUFFER,pindex);//bind the index buffer
    pgl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, p_pMatrix);
    pgl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, cube_mvMatrix);   
    var normalMatrix=mat3.create();
    mat3.normalFromMat4(normalMatrix,cube_mvMatrix);  //calculate a 3x3 normal matrix (transpose inverse) from a 4x4 matrix
    pgl.uniformMatrix3fv(shaderProgram.nMatrixUniform,false,normalMatrix);  
    pgl.drawElements(pgl.TRIANGLES,pindex.numItems,pgl.UNSIGNED_SHORT,0);}