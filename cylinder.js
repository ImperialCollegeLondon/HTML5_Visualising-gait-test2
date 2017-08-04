//*********************************************************************
//* Create 3D cylinder
//*
//* by Benny Lo
//* Aug 3 2017
//*
//*********************************************************************
function initCylinderBuffer(radius,circle_resolution,norows,pgl){
  //radius = radius of the cylinder
  //circle_resolution = the roundness of the cylinder
  //norows = the vertical resolution of the cylinder
  //pgl = the Web GL object
  var vertexPositionData=[];
  var normalData=[];
  var textureCoordData=[];
  //find the vertices of a circle first
  var prevx=radius,prevy=0;
  var i=0;    
  var circle_x=new Array();var circle_z=new Array();
  var circle_index=0;
 for (var i=0;i<90;i+=circle_resolution)
  {//first Quadrant
    var angle=i/180.0*Math.PI;
    var x=radius  *Math.cos(angle);
    var y=radius * Math.sin(angle);        
    circle_x[circle_index]=x;      circle_z[circle_index++]=y;   
  }
  for (var i=90;i>=0;i-=circle_resolution)
  {//fourth Quadrant
    var angle=i/180.0*Math.PI;
    var x=radius  *Math.cos(angle);
    var y=radius * Math.sin(angle);    
    circle_x[circle_index]=-x;                    circle_z[circle_index++]=y;  
  }  
  for (var i=0;i<90;i+=circle_resolution)
  {//third Quadrant
    var angle=i/180.0*Math.PI;
    var x=radius  *Math.cos(angle);
    var y=radius * Math.sin(angle);    
    circle_x[circle_index]=-x;                    circle_z[circle_index++]=-y;  
  }  
  for (var i=90;i>=0;i-=circle_resolution)
  {//second Quadrant
    var angle=i/180.0*Math.PI;
    var x=radius  *Math.cos(angle);
    var y=radius * Math.sin(angle);    
    circle_x[circle_index]=x;                    circle_z[circle_index++]=-y;   
  } 
  circle_x[circle_index]=radius;      circle_z[circle_index++]=0.0;   
  var prevy=-1;
  //then create a cylinder    
  var y_resolution=2.0/norows;
  var vertexIndex=0;
  var indexData=[];
  //var u,v;
  for (var y=-1.0;y<=1.0;y+=y_resolution)//only need 2 points
  {
    var prevx=circle_x[0];var prevz=circle_z[0];    
    for (var i=0;i<circle_x.length;i++)
    { //first triangle
      vertexPositionData.push(prevx);
      vertexPositionData.push(prevy);
      vertexPositionData.push(prevz);
      indexData.push(vertexIndex);//0 
      normalData.push(prevx);
      normalData.push(prevy);
      normalData.push(prevz);
      //u=(prevz);
      //v=(y);
      //textureCoordData.push(u);
      //textureCoordData.push(v);
      vertexIndex++;       

      vertexPositionData.push(circle_x[i]);
      vertexPositionData.push(prevy);
      vertexPositionData.push(circle_z[i]);
      indexData.push(vertexIndex);//1
      normalData.push(circle_x[i]);
      normalData.push(prevy);
      normalData.push(circle_z[i]);
        //u=(circle_z[i]);
      //textureCoordData.push(u);
      //textureCoordData.push(v);
      vertexIndex++;

      vertexPositionData.push(prevx);
      vertexPositionData.push(y);
      vertexPositionData.push(prevz);
      indexData.push(vertexIndex);//2
      normalData.push(prevx);
      normalData.push(y);
      normalData.push(prevz);
      //u=prevz;
      //textureCoordData.push(u);
      //textureCoordData.push(v);
      vertexIndex++;
      //second triangle
      /*vertexPositionData.push(circle_x[i]);
      vertexPositionData.push(prevy);
      vertexPositionData.push(circle_z[i]);*/ //no need when using index buffer
      indexData.push(vertexIndex-2);
      //vertexIndex++;//3=1

      /*vertexPositionData.push(prevx);
      vertexPositionData.push(y);
      vertexPositionData.push(prevz);*///no need when using index buffer
      indexData.push(vertexIndex-1);
      //vertexIndex++;//4=2

      vertexPositionData.push(circle_x[i]);
      vertexPositionData.push(y);
      vertexPositionData.push(circle_z[i]);
      indexData.push(vertexIndex);
      normalData.push(circle_x[i]);
      normalData.push(y);
      normalData.push(circle_z[i]);
      //u=(circle_z[i]);
      //textureCoordData.push(u);
      //textureCoordData.push(v);
      vertexIndex++;//5->3
      prevx=circle_x[i];
      prevz=circle_z[i];
    }
    prevy=y;
  }  
  //draw the top and bottom lid
  var cone=-0.2;//the lid with the shape of a cone
  for (var y=-1;y<=1.0;y+=2,cone=-cone)
  {
  //y=-1;
    vertexPositionData.push(circle_x[0]);
    vertexPositionData.push(y);
    vertexPositionData.push(circle_z[0]);
    indexData.push(vertexIndex);//0
    normalData.push(circle_x[0]);
    normalData.push(y);
    normalData.push(circle_z[0]);
    vertexIndex++; 
    var i=1;
    
    for (i=1;i<circle_x.length;i++)
    { 
      vertexPositionData.push(circle_x[i]);
      vertexPositionData.push(y);
      vertexPositionData.push(circle_z[i]);
      indexData.push(vertexIndex);//1
      normalData.push(circle_x[i]);
      normalData.push(y);
      normalData.push(circle_z[i]);
      vertexIndex++;
      vertexPositionData.push(0);
      vertexPositionData.push(y+cone);
      vertexPositionData.push(0);
      indexData.push(vertexIndex);//2
      normalData.push(0);
      normalData.push(y+cone);
      normalData.push(0);
      vertexIndex++;             
      indexData.push(vertexIndex-2);
    }
    vertexPositionData.push(0);
    vertexPositionData.push(y);
    vertexPositionData.push(0);
    indexData.push(vertexIndex);//2
    normalData.push(0);
    normalData.push(y);
    normalData.push(0);
    vertexIndex++; 
    vertexPositionData.push(circle_x[0]);
    vertexPositionData.push(y);
    vertexPositionData.push(circle_z[0]);
    indexData.push(vertexIndex);//0
    normalData.push(circle_x[0]);
    normalData.push(y);
    normalData.push(circle_z[0]);
    vertexIndex++;        
  }
  //build the normal, vertex and texture buffers
  var pCylinderVertexNormalBuffer=pgl.createBuffer();
  pgl.bindBuffer(pgl.ARRAY_BUFFER,pCylinderVertexNormalBuffer);
  pgl.bufferData(pgl.ARRAY_BUFFER,new Float32Array(normalData),pgl.STATIC_DRAW);
  pCylinderVertexNormalBuffer.itemSize=3;
  pCylinderVertexNormalBuffer.numItems=normalData.length/3;   
  var pCylinderVertexPositionBuffer=pgl.createBuffer();
  pgl.bindBuffer(pgl.ARRAY_BUFFER,pCylinderVertexPositionBuffer);
  pgl.bufferData(pgl.ARRAY_BUFFER,new Float32Array(vertexPositionData),pgl.STATIC_DRAW);
  pCylinderVertexPositionBuffer.itemSize=3;
  pCylinderVertexPositionBuffer.numItems=vertexPositionData.length/3;
  var pCylinderVertexIndexBuffer=pgl.createBuffer();
  pgl.bindBuffer(pgl.ELEMENT_ARRAY_BUFFER,pCylinderVertexIndexBuffer);
  pgl.bufferData(pgl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indexData),pgl.STATIC_DRAW);
  pCylinderVertexIndexBuffer.itemSize=1;
  pCylinderVertexIndexBuffer.numItems=indexData.length;
  var result=[];
  result.push(pCylinderVertexPositionBuffer);
  result.push(pCylinderVertexNormalBuffer);
  result.push(pCylinderVertexIndexBuffer);
  return result;
}

