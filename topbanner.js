//------------------------------------------------------------------------------
//Canvas Drawing
var viewportwidth,viewportheight;
function drawTextonBanner(ctx,text,posx,posy,font,color,size,stroke)
{     //draw a text string on the canvas
    ctx.fillStyle = color;
    //ctx.font = "20pt Arial";
    ctx.font=size+"pt "+font;
    ctx.strokeStyle=color;
    if (stroke)
        ctx.strokeText(text,posx,posy);
    ctx.fillText(text, posx, posy);     
}
function drawtopbanner()
{
    viewportwidth = window.innerWidth,
    viewportheight = window.innerHeight
    var topbannercanvas=document.getElementById('topbannercanvas');
    topbannercanvas.setAttribute('width', viewportwidth);
    topbannercanvas.setAttribute('height', 50);
    topbannercanvas.setAttribute('style', "position:fixed; top:0px;left:0px; z-index:1");    
    if (topbannercanvas.getContext) {
        topbannercontext = topbannercanvas.getContext('2d');
        //--------------------------------------------
        //draw the title
        topbannercontext.fillStyle = '#222222'; // Work around for Chrome
        //context0.fillRect(0, 0, 500, 500); // Fill in the canvas with white	
        topbannercontext.fillRect(0, 0, viewportwidth, viewportheight); // Fill in the canvas with white	
        //drawTextonBanner(topbannercontext, "Gait Visualisation", 20, 35, "Arial", '#ffffff', 25, 0);
        //drawTextonBanner(topbannercontext, "The Hamlyn Centre", viewportwidth -355, 35, "Arial", '#8888ff', 25, 0);
        drawTextonBanner(topbannercontext, "Imperial College ", 20, 25, "Arial", '#aaaaff', 11, 1);
        drawTextonBanner(topbannercontext, "London", 20, 45, "Arial", '#8888ff', 11, 1);
    }
    drawbottombar();
}
function drawbottombar() {
    var bottombarcanvas = document.getElementById('bottonbarcanvas');
    bottombarcanvas.setAttribute('width', viewportwidth);
    var toppos = viewportheight - 60;
    bottombarcanvas.setAttribute('style', "position:fixed; top:"+toppos+"px; left:0px; z-index:1");    
    if (bottombarcanvas.getContext) {
        bottombarcontext = bottombarcanvas.getContext('2d');
        bottombarcontext.fillStyle = '#222222'; // Work around for Chrome
        bottombarcontext.fillRect(0, 0, viewportwidth, viewportheight); // Fill in the canvas with white	
        var img = new Image();
        img.onload = function () {
            bottombarcontext.drawImage(img, 0, 0,img.width,img.height,10,10,40,40);
        }
        img.src = 'images/HamlynLogo2.jpg';
        //drawTextonBanner(bottombarcontext, "Imperial College ", viewportwidth - 150, 25, "Arial", '#888888', 10, 1);
        //drawTextonBanner(bottombarcontext, "London", viewportwidth - 150, 45, "Arial", '#888888', 10, 1);
        drawTextonBanner(bottombarcontext, "The Hamlyn Centre", 60, 25,"Arial", '#888888', 10, 1);
        drawTextonBanner(bottombarcontext, "The Institute of Global Health Innovation", 60, 45, "Arial", '#888888', 8, 0);          
        drawTextonBanner(bottombarcontext, "Benny Lo", viewportwidth-150, 25, "Arial", '#888888', 8, 0);          
        drawTextonBanner(bottombarcontext, "Yingnan Sun", viewportwidth-150, 45, "Arial", '#888888', 8, 0);          
    }
}


function onresizefunction() {
    drawtopbanner();
}
function onscrollfunction() {    
    //drawtopbanner();
}
