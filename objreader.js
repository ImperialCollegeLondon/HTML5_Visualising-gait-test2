//*************************************************************
// OBJ File reader
//
// read a OBJ  file (3D object) (Wavefront .obj file)  and load that into the webGL 
//
// OBJ file samples from http://people.sc.fsu.edu/~jburkardt/data/obj/obj.html
//
// details on mtl file: https://people.cs.clemson.edu/~dhouse/courses/405/docs/brief-mtl-file-format.html
//
// Benny Lo 
// Aug 12 2017
//****************************************************************

var ObjFilePath="";
function loadOBJFile(inputfilename,finish_callback,MTL_finish_callback) {//load a OBJ file
    //inputfilename -> OBJ file name
    //finish_callback -> call back function to create web GL buffers   
    //MTL_finish_callback->call back function after finish reading the MTL file     
        //find the file path of the obj file (for reading texture and MTL files)
        var indx=0;
        var pindx=inputfilename.indexOf("/",indx+1);
        while (pindx >0)
        {
            indx=pindx;
            pindx=inputfilename.indexOf("/",indx+1);
        }
        ObjFilePath=inputfilename.substring(0,indx+1);

        var request=new XMLHttpRequest();
        request.open("GET",inputfilename);
        //request.responseType='arraybuffer';//read binary array
        request.onreadystatechange=function(){
            if (request.readyState==4)
            {
                //var uint8Array =new Uint8Array(this.response);
                //ReadBinarySTLFile(uint8Array,finish_callback);..read binary array
                ReadOBJFile(this.response,finish_callback,MTL_finish_callback);
            }
        }
        request.send();}
function loadMTLFile(inputfilename,MTL_finish_callback) {//load a MTL file
    var MTLfilename=ObjFilePath+inputfilename;
      var request=new XMLHttpRequest();
        request.open("GET",MTLfilename);
        request.onreadystatechange=function(){
            if (request.readyState==4)
            {
                if (this.response.indexOf("404 Not Foun")>0)
                {
                    console.log("Cannot find the MTL file:"+MTLfilename);                    
                    MTL_finish_callback(undefined);
                }
                else ReadMTLFile(this.response,MTL_finish_callback);
            }
        }
        request.send();}
function ReadMTLFile(text,MTL_finish_callback)
{
   // console.log(text);
    var materials=[];
    var name=undefined;
    var specular=[];//specular reflection
    var diffuse=[];//diffuse reflectivity
    var ambient=[];//ambient reflectivity
    var emissive=[];//emissive
    var transmission=[];//transmission filter
    var specular_exponent=0;//Ns
    var optical_density=0;
    var illum=0;//illumination model to be used (0-2)
    //0 - constant color illumination, color=Kd
    //1 - diffuse illuminatino model, color=KaIa+Kd{SUM=j=1..1s (N*Lj)Ij}
    //2 - diffuse and specular illumination model, color=KaIa+Kd{SUM j=1..1s, (N*Lj)Ij}+Ks{SUM j=1..1s, ((H*Hj)^Ns)Ij}
    //(https://people.cs.clemson.edu/~dhouse/courses/405/docs/brief-mtl-file-format.html)
    var alpha=0;
    var inverse_alpha=0;
    var diffuse_color_texture_file="";
    var ambient_color_texture_file="";
    var specular_color_texture_file="";
    var linestr=text.split("\n");
    for (var i=0;i<linestr.length;i++)
    {
        var qstr=linestr[i].replaceAll("\r","");
        if (qstr<1)
        {
            if (name != undefined)
            {
                var mat=[];
                mat.push(name);
                mat.push(specular);
                mat.push(diffuse);
                mat.push(ambient);
                mat.push(emissive);
                mat.push(transmission);
                mat.push(specular_exponent);
                mat.push(optical_density);
                mat.push(illum);
                mat.push(alpha);
                mat.push(inverse_alpha);
                mat.push(diffuse_color_texture_file);
                mat.push(ambient_color_texture_file);
                mat.push(specular_color_texture_file);
                materials.push(mat);
                specular=[];
                diffuse=[];
                ambient=[];
                emissive=[];
                transmission=[];                   
                name =undefined;          
            }
        }
        else {
            var pstr=qstr.trimLeft();
            pstr=pstr.trimRight();
            var strstr=pstr.split(" ");
            if (strstr[0]=="#")//comment
            {            }
            else if (strstr[0]=="newmtl")//new material
                name=strstr[1];                
            else if (strstr[0]=="map_Kd")
                diffuse_color_texture_file=ObjFilePath+strstr[1];
            else if (strstr[0]=="map_Ka")
                ambient_color_texture_file=ObjFilePath+strstr[1];
            else if (strstr[0]=="map_Ks")
                specular_color_texture_file=ObjFilePath+strstr[1];
            else if (strstr[0]=="Ns")
                specular_exponent=parseFloat(strstr[1]);//ranges 0 to 1000
            else if (strstr[0]=="illum")
                illum=parseInt(strstr[1]);
            else if (strstr[0]=="d")//opague =1, transparent =0
                alpha=parseFloat(strstr[1]);
            else if (strstr[0]=="Tr")
                inverse_alpha=parseFloat(strstr[1]);
            else if (strstr[0]=="Ni")
                optical_density=parseFloat(strstr[1]);
            else if (strstr[0] == "Ks" || strstr[0] == "Kd" ||strstr[0]=="Ka" ||strstr[0]=="Tf" ||strstr[0]=="Ke")
            {
                if (strstr[1].indexOf("spectral")>0)
                {//Ks spectral file.rfl factor

                }
                else if (strstr[1].indexOf("xyz")>0)
                {//Ks x y z

                }else {
                    var pr=parseFloat(strstr[1]);
                    var pg=parseFloat(strstr[2]);
                    var pb=parseFloat(strstr[3]);
                    if (strstr[0]=="Ks") {//Ks r g b
                        specular.push(pr);
                        specular.push(pg);
                        specular.push(pb);
                    }
                    else if (strstr[0]=="Kd") {//Kd r g b
                        diffuse.push(pr);
                        diffuse.push(pg);
                        diffuse.push(pb);
                    }
                    else if (strstr[0]=="Ka") {//Ka r g b 
                        ambient.push(pr);
                        ambient.push(pg);
                        ambient.push(pb);
                    }
                    else if (strstr[0]=="Ke")
                    {
                        emissive.push(pr);
                        emissive.push(pg);
                        emissive.push(pb);
                    }
                    else if (strstr[0]=="Tf") {
                        transmission.push(pr);
                        transmission.push(pg);
                        transmission.push(pb);
                    }
                }
            }
        }
    }
    if (name != undefined)
    {
        var mat=[];
        mat.push(name);
        mat.push(specular);
        mat.push(diffuse);
        mat.push(ambient);
        mat.push(emissive);
        mat.push(transmission);
        mat.push(specular_exponent);
        mat.push(optical_density);
        mat.push(illum);
        mat.push(alpha);
        mat.push(inverse_alpha);
        mat.push(diffuse_color_texture_file);
        mat.push(ambient_color_texture_file);
        mat.push(specular_color_texture_file);
        materials.push(mat);
    }
    ////
    MTL_finish_callback(materials);    
}
  
function GetDotProduct(vector1,vector2) {//get the dot product between 2 2D vectors
    return vector1[0]*vector2[0]+
        vector1[1]*vector2[1];}
function FindAngle(vector1,vector2){//find angle between 2 2D vectors
    var dotproduct=GetDotProduct(vector1,vector2);
    var v1mag=Math.sqrt(vector1[0]*vector1[0]+vector1[1]*vector1[1]);
    var v2mag=Math.sqrt(vector2[0]*vector2[0]+vector2[1]*vector2[1]);

    var angle=(dotproduct/(v1mag*v2mag));
    if (angle<-1) angle=-1;
    else if (angle>1) angle=1;
    angle=Math.acos(angle);
    var px=v1mag*Math.cos(angle);
    var py=v1mag*Math.sin(angle);
    angle=angle*180/Math.PI;
    if (px==vector2[0] && py==vector2[1]) return angle;
    return 360-angle;    }
function GetDotProduct3D(vector1,vector2)
{//calculate the dot product of two 3D vectors
    return vector1[0]*vector2[0]+vector1[1]*vector2[1]+vector1[2]*vector2[2];
}
function GetVectorMagnitude3D(vector1)
{//get the magnitude of a 3D vector
    return Math.sqrt(vector1[0]*vector1[0]+vector1[1]*vector1[1]+vector1[2]*vector1[2]);
}
function GetUnitVector3D(vector1){//calculate the unit vector of vector1
    var mag=GetVectorMagnitude3D(vector1);
    var result=[];
    result[0]=vector1[0]/mag;
    result[1]=vector1[1]/mag;
    result[2]=vector1[2]/mag;
    return result;}
function Project3DpointToPlaneWithNormal(point3D,unitNorm) {//project a 3D point (point3D) onto a 3D plane with unit normal vector (unitNorm)
    //A'=A-(A.n)n  -> n = unit normal A-> point 3D
    var A_dot_n=GetDotProduct3D(point3D,unitNorm);
    var result=[];
    result[0]=point3D[0]-A_dot_n*unitNorm[0];
    result[1]=point3D[1]-A_dot_n*unitNorm[1];
    result[2]=point3D[2]-A_dot_n*unitNorm[2];
    return result;}
function GetCrossProduct3D(vector1,vector2) {//calculate the cross product between 2 3D vectors
    var result=[];
    result[0]= vector1[1]*vector2[2]-vector1[2]*vector2[1];
    result[1]=-(vector1[0]*vector2[2]-vector1[2]*vector2[0]);
    result[2]=vector1[0]*vector2[1]-vector1[1]*vector2[0];
    return result;}
function GetParameterFor3DpointProjection(planeNormal) {//get the parameters for projecting a 3D point onto a 2D plane with  normal (planeNormal)
    //return the following in an array:
    // the unit normal of the plane
    // the unit vector of the x axis projected onto the plane
    // the unit vector of the y axis projected onto the plane
    var unitNorm=GetUnitVector3D(planeNormal);    
    var x_axis=[];//project x-axis onto the plane first
    x_axis[0]=1;x_axis[1]=0;x_axis[2]=0;
    var newx=Project3DpointToPlaneWithNormal(x_axis,unitNorm);
    var unitnewx=GetUnitVector3D(newx);//get the unit vector
    //find the y-axis -> n x x (cross product)
    var y_axis=GetCrossProduct3D(unitNorm,unitnewx);
    var result=[];
    result[0]=unitNorm;
    result[1]=unitnewx;
    result[2]=y_axis;
    return result;}
function Project3DpointTo2Dplane(point3D,parameters)
{//project a 3D point (point3D) onto a 2D plane based on the parameters
//obtained by calling the function GetParameterFor3DpointProjection
    var unitNorm=parameters[0];
    var unitnewx=parameters[1];
    var unitnewy=parameters[2];
    var newPoint3D=Project3DpointToPlaneWithNormal(point3D,unitNorm);
    var result=[];
    result[0]=GetDotProduct3D(newPoint3D,unitnewx);
    result[1]=GetDotProduct3D(newPoint3D,unitnewy);
    return result;}
function Project3DpointTo2DplaneWithUnitNormal(point3D,unitNorm) {//project a 3D point (point3D) onto a 2D plane with unit normal (unitNorm)    
    var x_axis=[];//project x-axis onto the plane first
    x_axis[0]=1;x_axis[1]=0;x_axis[2]=0;
    var newx=Project3DpointToPlaneWithNormal(x_axis,unitNorm);
    var unitnewx=GetUnitVector3D(newx);//get the unit vector
    //find the y-axis -> n x x (cross product)
    var y_axis=GetCrossProduct3D(unitNorm,unitnewx);
    var newPoint3D=Project3DpointToPlaneWithNormal(point3D,unitNorm);
    var result=[];
    result[0]=GetDotProduct3D(newPoint3D,unitnewx);
    result[1]=GetDotProduct3D(newPoint3D,y_axis);
    return result;}
function Project3DpointTo2DplaneWithNormal(point3D,planeNormal) {//project a 3D point (point3D) onto a 2D plane with normal (planeNormal)
    var unitNorm=GetUnitVector3D(planeNormal);    
    return Project3DpointTo2DplaneWithUnitNormal(point3D,unitNorm);}
function Find2DRotationAngle(vector1) {//determine the angle from the x axis clockwise (start from 3 o'clock)
    var v1mag=Math.sqrt(vector1[0]*vector1[0]+vector1[1]*vector1[1]);
    var cosangle=vector1[0]/v1mag;
    if (cosangle<-1) cosangle=-1;
    else if (cosangle>1) cosangle=1;
    //var sinangle=vector1[1]/v1mag;
    //if (sinangle<-1) sinangle=-1;
    //else if (sinangle>1) sinangle=1;
    cosangle=Math.acos(cosangle)*180/Math.PI;
    //sinangle=Math.asin(sinangle)*180/Math.PI;
    if (vector1[0] >=0 && vector1[1]>=0) //first quardant
        return 360-cosangle;
    else if (vector1[0]<0 && vector1[1]>=0)//2nd quardant
        return 360-cosangle;
    else if (vector1[0]<0 && vector1[1]<0)//3rd quardant
        return cosangle;
    else return cosangle;/*4th quardant*/}
function FindVerticeOrders(vertexindices,vertices) {//to determine the order of the vertices (for example, for a square, 
    //make sure that the 2 triangles will cover the square (i.e. 0 1 2 0 2 3 not 0 1 2 0 1 3))
    //this function will project the vertices to an arburatory 2D plane (using on the mid point as the normal),
    //then determine the angles around the origin of each vertices. Then order the vertices based from the smallest to largest angles
    var midx=0,midy=0,midz=0;
   // console.log("vertices");
    vectors=new Array(vertexindices.length);
    for (var i=0;i<vertexindices.length;i++)
    {
        midx+=vertices[vertexindices[i]*3];
        midy+=vertices[vertexindices[i]*3+1];
        midz+=vertices[vertexindices[i]*3+2];
        vectors[i]=new Array();
        vectors[i][0]=(vertices[vertexindices[i]*3]);
        vectors[i][1]=(vertices[vertexindices[i]*3+1]);
        vectors[i][2]=vertices[vertexindices[i]*3+2];
     //   console.log(vertices[vertexindices[i]*3]+","+vertices[vertexindices[i]*3+1]+","+vertices[vertexindices[i]*3+2]);
    }
    midx/=vertexindices.length;
    midy/=vertexindices.length;
    midz/=vertexindices.length;
    var planeNormal=[];
    planeNormal.push(midx);planeNormal.push(midy);planeNormal.push(midz);    
    var projection_params=GetParameterFor3DpointProjection(planeNormal);//get the parameters first
    //project onto an arbitary 2D plane (using mid point as the normal vector)
    var vectors2D=new Array(vertexindices.length);
    var midx2D=0,midy2D=0;
    for (var i=0;i<vertexindices.length;i++)
    {
        vectors2D[i]=Project3DpointTo2Dplane(vectors[i],projection_params);        
        midx2D+=vectors2D[i][0];
        midy2D+=vectors2D[i][1];
    }
    midx2D/=vectors2D.length;
    midy2D/=vectors2D.length;
    //shift to the origin
    //console.log("angles");
    var orders=[];
    var ordersangles=[];
    for (var i=0;i<vectors2D.length;i++)
    {
        vectors2D[i][0]-=midx2D;
        vectors2D[i][1]-=midy2D;
        var angle=Find2DRotationAngle(vectors2D[i]);
        //console.log(angle);   
        var found=false;
        if (orders.length>0)
        {
            for (var j=0;j<orders.length && !found;j++)
            {
                if (angle<ordersangles[j])
                {
                    for (var k=orders.length;k>j;k--)
                    {
                         orders[k]=orders[k-1];
                        ordersangles[k]=ordersangles[k-1];
                    }
                    orders[j]=i+1;//it starts from 1, so add 1
                    ordersangles[j]=angle;
                    found=true;
                }
            }
        }
        if (!found)
        {
            ordersangles.push(angle);
            orders.push(i+1);//it starts from 1, so add 1
        }   
    }
   /* console.log("orders:::");
    for (var i=0;i<orders.length;i++)
    {
        console.log(orders[i]+":"+ordersangles[i]);
    }*/
    return orders;}
String.prototype.replaceAll = function (find, replace) {//replace all appearance of 'find' with replace
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);};
function parseNormalIndex( value ) {//parse the index for the normal vectors
    var index = parseInt( value );
    return ( index >= 0 ? index - 1 : index + 1 ) * 3;}
function FindNormalof2Vectors(vector1,vector2)
{//find the normal vector from 2 vectors
    var cross_prod=GetCrossProduct3D(vector1,vector2);
    var mag=GetVectorMagnitude3D(cross_prod);
    cross_prod[0]/=mag;
    cross_prod[1]/=mag;
    cross_prod[2]/=mag;
    return cross_prod;
}
function FindNormalofTriangle(vertex1,vertex2,vertex3)
{//determine the normal vector of a triangle
    var vector1=[];
    var vector2=[];
    vector1[0]=vertex2[0]-vertex1[0];
    vector1[1]=vertex2[1]-vertex1[1];
    vector1[2]=vertex2[2]-vertex1[2];
    vector2[0]=vertex3[0]-vertex1[0];
    vector2[1]=vertex3[1]-vertex1[1];
    vector2[2]=vertex3[2]-vertex1[2];
    return FindNormalof2Vectors(vector1,vector2);
}
function FindNormalofTriangleFromIndices(vertices,index1,index2,index3)
{//determine the normal vector of a triangle from the vertices array with indices
    var vertex1=[],vertex2=[],vertex3=[];
    for (var i=0;i<3;i++)
    {
        vertex1[i]=vertices[index1*3+i];
        vertex2[i]=vertices[index2*3+i];
        vertex3[i]=vertices[index3*3+i];
    }
    return FindNormalofTriangle(vertex1,vertex2,vertex3);
}

function ReadOBJFile(text,finish_callback,MTL_finish_callback)
{//parse the OBJ file
    var linestr=text.split("\n");
    var hasMTLfile=false;
    var nobuffers=1;//no of buffers required (indices max 16-bit; hence, it may need to split vertice buffer)
    var vertices=[];
    var hastexture=false;
    var coords=[];
    var coordsvectors=[];
    var normalvectors=[];
    var normals=[];
    var spaces=[];
    var spacesdim=1;//dimension of parameter space vertices
    var indices=[];
    var smoothindices=[];
    var material_file;
    var curmaterial;
    var materials=[];
    var curobjectname;
    var objects=[];
    var curgroup;
    var groups=[];
    var shading_enable=false;
    var minx=99999,maxx=0;
    var miny=99999,maxy=0;
    var minz=99999,maxz=0;
    var meanx=0,meany=0;meanz=0;
    var nopentagon=0;
    var shading_id=null;
    var faces=[];
    var facenormals=[];
    var faceshadingid=[];
    var minindex=99999,maxindex=0;
    var material_vertice=[];//which material is used for each vertice
    var max16bit=65536;
    var max16bitx3=max16bit*3;
    for (var i=0;i<linestr.length;i++)
    {
        if (linestr[i][0]=='#')
        {///it is an comment, so ignore

        }
        else {
            var pstr=linestr[i].replaceAll("     "," ");
            pstr=pstr.replaceAll("    "," ");
            pstr=pstr.replaceAll("   "," ");
            pstr=pstr.replaceAll("  "," ");
            pstr=pstr.replaceAll("\r","");
            pstr=pstr.replaceAll("\t"," ");
            pstr=pstr.trimRight();
            //if (pstr[pstr.length-1]==" ")
              //  pstr=pstr.substring(0,pstr.length-1);
            pstr=pstr.trimLeft();
            var strstr=pstr.split(" ");            
            if (strstr[0] =="v")//vertices
            {
                var px,py,pz;
                px=parseFloat(strstr[1]);
                py=parseFloat(strstr[2]);
                pz=parseFloat(strstr[3]);
                vertices.push(px);//x
                vertices.push(py);//y
                vertices.push(pz);//z
                minx=Math.min(minx,px);
                miny=Math.min(miny,py);
                minz=Math.min(minz,pz);
                maxx=Math.max(maxx,px);
                maxy=Math.max(maxy,py);
                maxz=Math.max(maxz,pz);
            }
            else if (strstr[0]=="vt")//texture coordinate
            {
                coordsvectors.push(parseFloat(strstr[1]));//u
                coordsvectors.push(parseFloat(strstr[2]));//v                
            }
            else if (strstr[0]=="vn")//normals
            {
                normalvectors.push(parseFloat(strstr[1]));//x
                normalvectors.push(parseFloat(strstr[2]));//y
                normalvectors.push(parseFloat(strstr[3]));//z*/
            }
            else if (strstr[0]=="vp")//parameter space verices
            {
                spaces.push(parseFloat(strstr[1]));
                if (strstr.length>=3)
                {
                    spaces.push(parseFloat(strstr[2]));
                    spaceslen=2;
                }
                else if (strstr.length>=4)
                {
                    spaces.push(parseFloat(strstr[3]));
                    spacesdim=3;
                }
            }
            else if (strstr[0]=="f")//face element
            {
                var type=0;
                if (strstr[1].indexOf("//")>=0)//vertice // normal
                    type=0;                    
                else if (strstr[1].indexOf('/')>=0)//v1/vt/vn  or v1/vt
                    type=1;
                else if (strstr[1].length>=1)//vertices only
                    type=2;
                var qstr;
                var verticeno;
                var textureno;
                var normalno;
                var order=[];         
                var facesindices=[];
                var normalindices=[];
                var textureindices=[];

               /* var pindex=[];
                for ( var j=1;j<strstr.length;j++)
                {
                    verticeno=parseInt(strstr[j])-1;
                    pindex.push(verticeno);                          
                }                   
                var porders=FindVerticeOrders(pindex,vertices);*/
                 for (var j=0,b=2;j<strstr.length-3;j++,b++)
                {
                    order.push(1);order.push(b);order.push(b+1);
                   // order.push(porders[0]);order.push(porders[b-1]);order.push(porders[b]);
                }                                       
                for (var k=0;k<order.length;k++)
                {
                    var j=order[k];
                    switch (type)
                    {
                        case 0:  qstr=strstr[j].split("//");//vertice//normal
                                 verticeno=parseInt(qstr[0])-1;
                                 indices.push(verticeno);
                                 normalno=parseInt(qstr[1])-1;
                                 normalindices.push(normalno);
                                 facesindices.push(verticeno);
                                 material_vertice[verticeno]=curmaterial;
                                 coords[verticeno*3]=0;
                                 coords[verticeno*3+1]=0;                                 
                                 coords[verticeno*3+2]=0;//which texture
                                 minindex=Math.min(minindex,verticeno);
                                 maxindex=Math.max(maxindex,verticeno);
                                 break;
                        case 1:  qstr=strstr[j].split('/');//vertice/texture
                                 if (qstr.length ==2)//v1/vt v2/vt 
                                {//vertice and texture
                                    verticeno=parseInt(qstr[0])-1;
                                    indices.push(verticeno);     
                                    textureno=parseInt(qstr[1])-1;
                                    textureindices.push(textureno);    
                                    facesindices.push(verticeno);      
                                    coords[verticeno*3]=coordsvectors[textureno*2];
                                    coords[verticeno*3+1]=coordsvectors[textureno*2+1];                                                         
                                    coords[verticeno*3+2]=0; //which texture
                                    material_vertice[verticeno]=curmaterial;
                                    minindex=Math.min(minindex,verticeno);
                                    maxindex=Math.max(maxindex,verticeno);
                                    hastexture=true;                                    
                                }
                                else {//v1/vt/vn1 -> vertice/texture/normal
                                    verticeno=parseInt(qstr[0])-1;
                                    indices.push(verticeno);
                                    textureno=parseInt(qstr[1])-1;
                                    coords[verticeno*3]=coordsvectors[textureno*2];
                                    coords[verticeno*3+1]=coordsvectors[textureno*2+1];
                                    coords[verticeno*3+2]=0;//which texture
                                    normalno=parseInt(qstr[2])-1;
                                    normalindices.push(normalno);
                                    facesindices.push(verticeno);
                                    hastexture=true;
                                    material_vertice[verticeno]=curmaterial;                                           
                                    minindex=Math.min(minindex,verticeno);
                                    maxindex=Math.max(maxindex,verticeno);
                                }break;
                        case 2:  if (strstr[j].length>=1){//vertices only
                                    verticeno=parseInt(strstr[j])-1;
                                    indices.push(verticeno);
                                    facesindices.push(verticeno);
                                    material_vertice[verticeno]=curmaterial;
                                    coords[verticeno*3]=0;
                                    coords[verticeno*3+1]=0;
                                    coords[verticeno*3+2]=0;//which texture
                                    minindex=Math.min(minindex,verticeno);
                                    maxindex=Math.max(maxindex,verticeno);
                                }break;
                    }                                    
                }  
                faces.push(facesindices);    
                if (normalindices.length>0)
                    facenormals.push(normalindices);                   
                if (shading_enable)
                    faceshadingid.push(shading_id);
                else  faceshadingid.push("off");
            }
            else if (strstr[0]=="mtllib")//material file
            {
                material_file=strstr[1];
                loadMTLFile(strstr[1],MTL_finish_callback);   
                hasMTLfile=true;             
            }
            else if (strstr[0]=="usemtl")//material name
            {
                curmaterial=strstr[1];
               // console.log(curmaterial);
                materials.push(curmaterial);
            }
            else if (strstr[0]=="o")//object name
            {
                curobjectname=strstr[1];
                objects.push(curobjectname);
            }
            else if (strstr[0]=="g")//groups
            {
                curgroup=strstr[1];
                if (curgroup==null)
                    groups.push(" ");
                else groups.push(curgroup);
                
            }
            else if (strstr[0]=="s")//smooth shading
            {
                if (strstr[1].indexOf("off")!=0)
                {
                    shading_id=strstr[1];
                    shading_enable=true;
                }
                else {
                    shading_id=null;
                    shading_enable=false;
                }                
            }
        }
    }    
    //console.log(minindex+","+maxindex);
    if (minindex>0 && (maxindex*3)>=vertices.length)
    {//rectify the index (just in case the minimum index >0)
        maxindex=0;
        for (var k=0;k<indices.length;k++)
        {
            indices[k]-=minindex;
            maxindex=Math.max(maxindex,indices[k]);
        }  
        for (var j=0;j<faces.length;j++)
        {
            var facesindices=faces[j];
            for (var k=0;k<facesindices.length;k++)
                facesindices[k]-=minindex;
        }      
    }
    if (maxindex*3>=vertices.length)
    {//rectify the index (if the index no > total number of vertices)
        for (var k=0;k<indices.length;k++)
        {
            if (indices[k]>=vertices.length)
                indices[k]=vertices.length-1;
        }
        for (var j=0;j<faces.length;j++)
        {
            var facesindices=faces[j];
            for (var k=0;k<facesindices.length;k++)
            {
                if (facesindices[k]>=vertices.length)
                    facesindices[k]=vertices.length-1;
            }
        }  
    }
    var result_vertices=[];
    var result_normals=[];
    var result_indices=[];
    var result_textures=[];
    var result_material_vertice=[];
    var pnewnormals2index=[];//for storing normal indices for additional vertices (as after splitting the vertice buffer, some vertices of triangles may not be in the same vertice buffer)
    var need_to_split=false;
    if (vertices.length>max16bitx3)
    {
        console.log("too big for the indices to work!");
        //split the vertices and indices
        need_to_split=true;               
        nobuffers=parseInt(vertices.length/(max16bitx3))+1;
         for (var k=0;k<nobuffers;k++)
        {
            var curvertices=new Array();
            for (var i=k*max16bitx3;i<Math.min((k+1)*max16bitx3,vertices.length);i++)
                curvertices.push(vertices[i]);            
            result_vertices.push(curvertices);
            result_indices[k]=[];
            pnewnormals2index[k]=[];
        }        
    }
   /*console.log("no vertices:"+vertices.length);
    console.log("no texture coords:"+coords.length);
    console.log("no normals:"+normals.length);
    console.log("no of normal indices:"+normalindices.length);
    console.log("no spaces:"+spaces.length);
    console.log("no indices:"+indices.length);
    console.log("material file:"+material_file);
    console.log("no material used:"+materials.length);
    console.log("no objects:"+objects.length+" name:"+((objects.length>0)?objects[0]:""));
    console.log("no groups:"+groups.length+" name:"+groups[0]);
    console.log("coords vectors:"+coordsvectors.length);*/
    var pnormals=[];        
    for (var j=0;j<faces.length;j++)
    {
        var facesindices=faces[j];
        var nx=0,ny=0,nz=0;
        if (facenormals[j] !=undefined)
        {//normals already defined for the specific face
            //find the averaged normal
            var normalindices=facenormals[j];
            for (var k=0;k<normalindices.length;k++)
            {
                nx+=normalvectors[normalindices[k]*3];
                ny+=normalvectors[normalindices[k]*3+1];
                nz+=normalvectors[normalindices[k]*3+2];
            }
            nx/=normalindices.length;
            ny/=normalindices.length;
            nz/=normalindices.length;
        }
        else {//no normal is defined -> need to calculate the normal of each triangle
            for (var k=0;k<facesindices.length;k+=3)
            {
                var norm=FindNormalofTriangleFromIndices(vertices,facesindices[k],facesindices[k+1],facesindices[k+2]);
                nx+=norm[0];
                ny+=norm[1];
                nz+=norm[2];
            }
            nx/=facesindices.length;
            ny/=facesindices.length;
            nz/=facesindices.length;            
        } 
        if (need_to_split)
        {            
            for (var k=0;k<facesindices.length;k+=3)
            {
                 var foundbuffer=false;
                for (var q=nobuffers-1;q>=0;q--)
                {                                    
                    var curmax=max16bit*(q+1);
                    var curmin=max16bit*q;
                    if (facesindices[k] <curmax && facesindices[k+1] <curmax && facesindices[k+2]<curmax &&
                        facesindices[k]>=curmin && facesindices[k+1]>=curmin && facesindices[k+2]>=curmin)
                    {
                        result_indices[q].push(facesindices[k]);
                        result_indices[q].push(facesindices[k+1]);
                        result_indices[q].push(facesindices[k+2]);
                        foundbuffer=true;
                    }                    
                }
                if (!foundbuffer)//the vertice is not in the same vertice buffer -> add new vertices and normals
                {//it points to another buffer -> add a new vertex
                    q=nobuffers-1;
                    if (result_vertices[q].length>=(max16bitx3-3))
                    {//no more room to add->create another new buffer...
                        nobuffers++;
                        q=nobuffers-1;
                        result_vertices[q]=[];
                        result_indices[q]=[];
                        pnewnormals2index[q]=[];
                    }
                    for (var l=k;l<k+3;l++)
                    {
                        var ind=facesindices[l]*3;
                        var pindex=result_vertices[q].length/3;
                        result_vertices[q].push(vertices[ind]);
                        result_vertices[q].push(vertices[ind+1]);
                        result_vertices[q].push(vertices[ind+2]);                            
                        result_indices[q].push(pindex);
                        pnewnormals2index[q].push(facesindices[l]);//add a new normal index
                    }
                }
            }
        }       
        pnormals.push(nx);
        pnormals.push(ny);
        pnormals.push(nz);
    }     
    //
    meanx=0;meany=0;meanz=0;meancount=0;
    var normalcounts=[];
    for (var k=0;k<vertices.length;k++)
    {
        normals[k]=0;
        normalcounts[k]=0;
    }
    for (var k=0;k<faces.length;k++)
    {
        var facesindices=faces[k];
        for (var l=0;l<facesindices.length;l++)
        {
            normals[facesindices[l]*3]+=pnormals[k*3];
            normals[facesindices[l]*3+1]+=pnormals[k*3+1];
            normals[facesindices[l]*3+2]+=pnormals[k*3+2];
            normalcounts[facesindices[l]*3]++;
            normalcounts[facesindices[l]*3+1]++;
            normalcounts[facesindices[l]*3+2]++;
        }
    }
    for (var j=0;j<normals.length;j+=3)
    {
        var nx=normals[j]/normalcounts[j];
        var ny=normals[j+1]/normalcounts[j+1];
        var nz=normals[j+2]/normalcounts[j+2];
        var mag=Math.sqrt(nx*nx+ny*ny+nz*nz);
        normals[j]=nx/mag;
        normals[j+1]=ny/mag;
        normals[j+2]=nz/mag;        
    }
    for (var j=0;j<indices.length;j++)
    {
        meanx+=vertices[indices[j]*3];
        meany+=vertices[indices[j]*3+1];
        meanz+=vertices[indices[j]*3+2];
        meancount++;
    }   
    meanx/=meancount;
    meany/=meancount;
    meanz/=meancount;
    var rangex=(maxx-minx);
    var rangey=(maxy-miny);
    var rangez=(maxz-minz);
    var maxrange=Math.max(rangex,Math.max(rangey,rangez));
    if (!hasMTLfile)
        material_vertice=[];
    if (!hastexture)
        coords=[];    
    if (need_to_split)
    {        
        var qnormals=[];
        for (var a=0;a<nobuffers;a++)
        {
            result_normals[a]=[];
            result_textures[a]=[];
            result_material_vertice[a]=[];
            for (var i=a*max16bit;i<Math.min(vertices.length/3,(a+1)*max16bit);i++)
            {
                var ix3=i*3;
                for (var q=0;q<3;q++)
                {
                    result_normals[a].push(normals[ix3+q]);
                    result_textures[a].push(coords[ix3+q]);                       
                }
                result_material_vertice[a].push(material_vertice[i]);
            }

            for(var i=0;i<pnewnormals2index[a].length;i++)
            {
                var ppr=pnewnormals2index[a];
                var indx=ppr[i];    
                result_normals[a].push(normals[indx*3]);
                result_normals[a].push(normals[indx*3+1]);
                result_normals[a].push(normals[indx*3+2]);
                result_textures[a].push(coords[indx*3]);
                result_textures[a].push(coords[indx*3+1]);
                result_textures[a].push(coords[indx*3+2]);
                result_material_vertice[a].push(material_vertice[indx]);
            }    
        }       
    }
    else
    {
     /*   result_vertices=(vertices);
        result_indices=(indices);
        result_normals=(normals);
        result_textures=coords;
        result_material_vertice=material_vertice;
        */
        result_vertices.push(vertices);
        result_indices.push(indices);
        result_normals.push(normals);
        result_textures.push(coords);
        result_material_vertice.push(material_vertice);
    }
    finish_callback(nobuffers,result_vertices,result_normals,result_indices,result_textures,result_material_vertice,meanx,meany,meanz,maxrange);
}



