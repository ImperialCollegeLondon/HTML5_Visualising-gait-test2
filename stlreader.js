//*************************************************************
// STL File reader
//
// read a STL (3D object) file (either binary or ascii) and load that into webGL 
//
// Benny Lo 
// Aug 12 2017
//****************************************************************

function loadSTLFile(inputfilename,finish_callback) {//load a STL file
    //inputfilename -> STL file name
    //finish_callback -> call back function to create web GL buffers 
        var request=new XMLHttpRequest();
        request.open("GET",inputfilename);
        request.responseType='arraybuffer';
        request.onreadystatechange=function(){
            if (request.readyState==4)
            {
                var uint8Array =new Uint8Array(this.response);
                ReadBinarySTLFile(uint8Array,finish_callback);
            }
        }
        request.send();}
function read32bits(pbinaryarray,indx){return (pbinaryarray[indx+3]<<24)|(pbinaryarray[indx+2]<<16)|(pbinaryarray[indx+1]<<8)|pbinaryarray[indx];}//read a 32 bits integer from buffer with indx 
function Int32bitToFloat(bits){//convert 32-bit integer to floating point
    var sign=((bits>>>31)==0)?1.0:-1.0;
    var e=((bits>>>23)&0xff);
    var m=(e==0)?(bits&0x7fffff)<<1:(bits&0x7fffff)|0x800000;
    return sign*m*Math.pow(2,e-150);}
function read16bits(pbinaryarray,indx){ return pbinaryarray[indx]+pbinaryarray[indx+1]*256;}//read 16 bits integer from biffer with index
function findPrev_addVertice(curvertex,curnorm,vertices,normals){//search for previously loaded verices and return the corresponding indices; otherwise, add the vertices and normals, the return the new index
    for (var i=vertices.length-3;i>=0;i-=3)//search all previously added vertices
    //for (var i=vertices.length-3;i>=0 && i>=vertices.length/2;i-=3)//reduce the search space, although it will have more vertices, but save a bit of computational power
    {
        if (curvertex[0]==vertices[i] && curvertex[1]==vertices[i+1]&&curvertex[2]==vertices[i+2])
            return (i/3);//return the index of the found vertex
    }
    vertices.push(curvertex[0]);vertices.push(curvertex[1]);vertices.push(curvertex[2]);
    normals.push(curnorm[0]);normals.push(curnorm[1]);normals.push(curnorm[2]);
    //return the new index
    return (vertices.length-3)/3;}
function BinaryArrayToString(binaryarray){
    var result="";
    for (var i=0; i<binaryarray.length; i++) 
            result+= String.fromCharCode(binaryarray[i])
    return result;}
function removeleadingspace(pstr){//remove leading spaces of each string line
    var i=0;
    while (pstr[i]==' ') i++;
    return pstr.substring(i,pstr.length);}
function ReadASCIISTLFile(stringarray,finish_callback) {//parse an ASCII STL file
    //stringarray -> STL string
    //finish_callback -> callback function to create WebGL buffers
    var linestr=stringarray.split("\n");
    var strstr=linestr[0].split(" ");
    var nofaces=0;
    if (strstr[0] !="solid")
    {//it is not a STL file
        console.log("it is not a STL file");
        return;
    }
    var lineno=1;
    var tnormal=[];                    
    var tvertex=[];
    var tvertexcount=0;
    var vertices=[];
    var indices=[];
    var normals=[];
    var coords=[];//texture coordinate
    var material_vertice=[];//material used for each vertice
    var meanx=0,meany=0,meanz=0,meancount=0;
    var minx=99999,miny=99999,minz=99999;
    var maxx=-99999,maxy=-999999,maxz=-99999;
    while (lineno < linestr.length)
    {
        if (linestr[lineno].length<4)
            lineno++;
        else {
            var tstr=removeleadingspace(linestr[lineno++]);
            strstr=tstr.split(" ");
            if (strstr[0].length <4) lineno++;
            else if (strstr[0]=="facet")
            {
                nofaces++;                
                if (strstr[1]=="normal")
                {
                    tnormal[0]=parseFloat(strstr[2]);
                    tnormal[1]=parseFloat(strstr[3]);
                    tnormal[2]=parseFloat(strstr[4]);
                }
                tvertexcount=0;
                tstr=removeleadingspace(linestr[lineno++]);
                strstr=tstr.split(" ");
                if (strstr[0]=="outer")//outer loop
                {
                    for (tvertexcount=0;tvertexcount<3;tvertexcount++)
                    {
                        tstr=removeleadingspace(linestr[lineno++]);
                        strstr=tstr.split(" ");
                        if (strstr[0]=="vertex")
                        {
                            tvertex[0]=parseFloat(strstr[1]);
                            tvertex[1]=parseFloat(strstr[2]);
                            tvertex[2]=parseFloat(strstr[3]);
                            meanx+=tvertex[0];
                            meany+=tvertex[1];
                            meanz+=tvertex[2];
                            meancount++;
                            minx=Math.min(minx,tvertex[0]);
                            miny=Math.min(miny,tvertex[1]);
                            minz=Math.min(minz,tvertex[2]);
                            maxx=Math.max(maxx,tvertex[0]);
                            maxy=Math.max(maxx,tvertex[1]);
                            maxz=Math.max(maxx,tvertex[2]);
                            indices.push(findPrev_addVertice(tvertex,tnormal,vertices,normals));
                        }
                    }
                    strstr=linestr[lineno++];//endloop
                    strstr=linestr[lineno++];//endfacet
                }
            }
            else {
                //console.log(strstr[0]);
                lineno++;
            }
        }
    }
    meanx/=meancount;
    meany/=meancount;
    meanz/=meancount;
    var rangex=maxx-minx;
    var rangey=maxy-miny;
    var rangez=maxz-minz;
    var maxrange=Math.max(rangex,Math.max(rangey,rangez));
    var result_vertices=[];
    var result_normals=[];
    var result_indices=[];
    var result_texture=[];
    var result_material_vertices=[];
    result_vertices.push(vertices);
    result_normals.push(normals);
    result_indices.push(indices);
    result_texture.push(coords);
    result_material_vertices.push(material_vertice);
    //call back function to create the webGL buffers for draewing    
    finish_callback(1,result_vertices,result_normals,result_indices,result_texture,result_material_vertices,meanx,meany,meanz,maxrange);}
function ReadBinarySTLFile(binaryarray,finish_callback){
    //parse the sTL binary bufferarray
    var filetype=String.fromCharCode(binaryarray[0],binaryarray[1],binaryarray[2],binaryarray[3],binaryarray[4],binaryarray[5]);
    if (filetype!="binary")
    {//it is a ascii STL file 
        ReadASCIISTLFile(BinaryArrayToString(binaryarray),finish_callback);
        return;
    }
    //finish_callback -> call back function - call to create webGL buffers once the file is read
    var noTriangles= read32bits(binaryarray,80);//binaryarray[80]+binaryarray[81]*256+binaryarray[82]*65536+binaryarray[83]*16777216;
    //console.log("notriangles:"+noTriangles);
    var vertices=[];
    var normals=[];
    var attrs=[];    
    var indices=[];
    var coords=[];
    var material_vertice=[];//material used for each vertice
    var meanx=0,meany=0,meanz=0,meancount=0;
    var minx=9999,miny=9999,minz=99999;
    var maxx=-99999,maxy=-99999,maxz=-999999;
    for (n = 84; n < binaryarray.length; ) {//ignore the first 80 bytes -> header
        var tnormal=[];
        tnormal[0]=Int32bitToFloat(read32bits(binaryarray,n));n+=4;       
        tnormal[1]=Int32bitToFloat(read32bits(binaryarray,n));n+=4;
        tnormal[2]=Int32bitToFloat(read32bits(binaryarray,n));n+=4;
        var vertex1=[],vertex2=[],vertex3=[];
        vertex1[0]=Int32bitToFloat(read32bits(binaryarray,n));n+=4;//x
        vertex1[1]=Int32bitToFloat(read32bits(binaryarray,n));n+=4;//y
        vertex1[2]=Int32bitToFloat(read32bits(binaryarray,n));n+=4;//z
        vertex2[0]=Int32bitToFloat(read32bits(binaryarray,n));n+=4;
        vertex2[1]=Int32bitToFloat(read32bits(binaryarray,n));n+=4;
        vertex2[2]=Int32bitToFloat(read32bits(binaryarray,n));n+=4;
        vertex3[0]=Int32bitToFloat(read32bits(binaryarray,n));n+=4;
        vertex3[1]=Int32bitToFloat(read32bits(binaryarray,n));n+=4;
        vertex3[2]=Int32bitToFloat(read32bits(binaryarray,n));n+=4;
        meanx+=vertex1[0];
        meany+=vertex1[1];
        meanz+=vertex1[2];meancount++;
        meanx+=vertex2[0];
        meany+=vertex2[1];
        meanz+=vertex2[2];meancount++;
        meanx+=vertex3[0];
        meany+=vertex3[1];
        meanz+=vertex3[2];meancount++;
        minx=Math.min(minx,vertex1[0]);
        minx=Math.min(minx,vertex2[0]);
        minx=Math.min(minx,vertex3[0]);        
        miny=Math.min(minx,vertex1[1]);
        miny=Math.min(minx,vertex2[1]);
        miny=Math.min(minx,vertex3[1]);
        minz=Math.min(minx,vertex1[2]);
        minz=Math.min(minx,vertex2[2]);
        minz=Math.min(minx,vertex3[2]);

        maxx=Math.max(maxx,vertex1[0]);
        maxx=Math.max(maxx,vertex2[0]);
        maxx=Math.max(maxx,vertex3[0]);        
        maxy=Math.max(maxy,vertex1[1]);
        maxy=Math.max(maxy,vertex2[1]);
        maxy=Math.max(maxy,vertex3[1]);
        maxz=Math.max(maxz,vertex1[2]);
        maxz=Math.max(maxz,vertex2[2]);
        maxz=Math.max(maxz,vertex3[2]);
        var attr=read16bits(binaryarray,n);n+=2;
        indices.push(findPrev_addVertice(vertex1,tnormal,vertices,normals));//no need to add vertices 
        indices.push(findPrev_addVertice(vertex2,tnormal,vertices,normals));//no need to add vertices 
        indices.push(findPrev_addVertice(vertex3,tnormal,vertices,normals));//no need to add vertices         
        attrs.push(attr);        
    }
    var rangex=maxx-minx;
    var rangey=maxy-miny;
    var rangez=maxz-minz;
    var maxrange=Math.max(rangex,Math.max(rangey,rangez));
    meanx/=meancount;
    meany/=meancount;
    meanz/=meancount;
    var result_vertices=[];
    var result_normals=[];
    var result_indices=[];
    var result_texture=[];
    var result_material_vertices=[];
    result_vertices.push(vertices);
    result_normals.push(normals);
    result_indices.push(indices);
    result_texture.push(coords);
    result_material_vertices.push(material_vertice);
    //call back function to create the webGL buffers for draewing
    finish_callback(1,result_vertices,result_normals,result_indices,result_texture,result_material_vertices,meanx,meany,meanz,maxrange);}
