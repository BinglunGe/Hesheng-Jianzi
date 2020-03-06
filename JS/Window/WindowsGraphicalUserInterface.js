var xyGap=[0,0];
var isMoving="False";
var windowsNumber=0;
var currentMovingWindowId=-1;
var windowIndexZMax=0;
var windowFinalPozisation=[0,0];
var changePosition="False";
var windowNow=null;
var topWindowId=0;
function getMousePosization(event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    return [x,y];
}
function clickTitleBar(window) {
    var mTitleBar=$(window);
    var mWindow=mTitleBar.parent().parent();
    isMoving=mTitleBar.attr("isMoving");
    if(isMoving==="True"){
        /*结束移动*/
        var xyBefore=[parseInt(mWindow.css("left")),parseInt(mWindow.css("top"))];
        var xyAfter=getMousePosization();
        xyGap=[xyAfter[0]-xyBefore[0],xyAfter[1]-xyBefore[1]];
        var xyNow=[xyAfter[0]-xyGap[0],xyAfter[1]-xyGap[1]];
        if(changePosition==="False") {
            mWindow.css("left", xyNow[0])
                .css("top", xyNow[1]);
            changePosition="True";
        }
        mTitleBar.css("cursor","default")
            .attr("isMoving","False");
        isMoving="False";
        currentMovingWindowId=-1;
        windowFinalPozisation=xyNow;
    }else{
        /*开始移动*/
        var xyBefore=[parseInt(mWindow.css("left")),parseInt(mWindow.css("top"))];
        var xyAfter=getMousePosization();
        xyGap=[xyAfter[0]-xyBefore[0],xyAfter[1]-xyBefore[1]];
        mTitleBar.attr("isMoving","True");
        isMoving="True";
        mTitleBar.css("cursor","move");
        currentMovingWindowId=mWindow.attr("id");
        if(!(mWindow.attr("z-indexUnchangeable")==="True")){
            mWindow.css("z-index",++windowIndexZMax);
            topWindowId=windowIndexZMax;
        }
        windowNow=window;
    }

}
function moveing(window,xyIn) {
    /*
    var mWindow=$(window);
    var mTitleBar=mWindow.children("._titleBar");
    */
    if(!window){
        return;
    }
    var mTitleBar=$(window);
    var mWindow=mTitleBar.parent().parent();
    if(mWindow.attr("unmoveable")){
        return;
    }
    if(isMoving==="True"){
        if(mWindow.attr("id")==currentMovingWindowId) {
            /*var xyBefore=[mWindow.css("left"),mWindow.css("top")];*/
            /*var xyAfter = getMousePosization();*/
            var xyAfter=xyIn;
            mWindow.css("left", xyAfter[0] - xyGap[0]);
            mWindow.css("top", xyAfter[1] - xyGap[1]);
        }
    }
}
function pushElementToNewWindow(title,pushedWindow,sizeXY,parameters) {
    var _window=$(pushedWindow);
    newWindow(title,_window.html(),sizeXY,parameters);
    _window.remove();
}
function stopBubble(event){
    if(event && event.stopPropagation){
        event.stopPropagation();
    }
    else
        window.event.cancelBubble=true;
}
function newWindow(title,text,sizeXY,parameters) {
    var windowHtml=
        "<div class=\"_window\" id=\"_window"+windowsNumber+"\">\n" +
        "    <div class=\"__shadow _windowShadow\"></div>" +
        "    <div class=\"__window\">\n" +
        "        <div class=\"_titleBar\" isMoving=\"False\" onclick=\"clickTitleBar(this)\">\n" +
        "            <div class=\"noneSelect __left _title\" unselectable=\"on\">"+title+"</div>\n" +
        "            <div class=\"__right\">\n" +
        "                <div class=\"noneSelect __left _window_button _window_button_threeButtonsOnTitleBar _minimize\" onclick=\"_minimize(this);stopBubble(event);\" unselectable=\"on\">-</div>\n" +
        /*"                <div class=\"noneSelect __left _window_button _window_button_threeButtonsOnTitleBar _whatIsThis\" unselectable=\"on\">?</div>\n" +*/
        "                <div class=\"noneSelect __left _window_button _window_button_threeButtonsOnTitleBar _close\" onclick=\"_close(this)\" unselectable=\"on\">x</div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"_contents\">\n" +
        text +
        "        </div>\n" +
        "    </div>\n" +
        "</div>\n";
    $("#_join").append(windowHtml);
    var thisWindow=$("#_window"+windowsNumber++);
    if (sizeXY[0]>0&&sizeXY[1]>1){
        thisWindow
            .css("width",sizeXY[0])
            .css("height",sizeXY[1]);
    }
    windowFinalPozisation[0]+=24;
    windowFinalPozisation[1]+=24;
    thisWindow
        .css("left",windowFinalPozisation[0])
        .css("top",windowFinalPozisation[1]);
    if(!(thisWindow.attr("z-indexUnchangeable")==="True")){
        thisWindow
            .css("z-index",++windowIndexZMax);
        topWindowId=windowIndexZMax;
    }
    try {
        for (var i = 0; i < parameters.length; ++i) {
            switch (parameters[i][0]) {
                case "uncloseable":
                    thisWindow
                        .children(".__window")
                        .children("._titleBar")
                        .children(".__right")
                        .children("._minimize")
                        .css("color", "red")
                        .removeAttr("onclick");
                    console.log(">>#_menubar"+(windowsNumber-1));
                    $(("#_menubar"+(windowsNumber-1)))
                        .css("color", "blue")
                        .removeAttr("onclick");
                    break;
                case "unminimizeable":
                    thisWindow
                        .children(".__window")
                        .children("._titleBar")
                        .children(".__right")
                        .children("._close")
                        .css("color", "red")
                        .removeAttr("onclick");

                    $(("#_menubar"+(windowsNumber-1)))
                        .children("._window_button_threeButtonsOnTitleBar")
                        .css("color", "red")
                        .removeAttr("onclick");
                    break;
                case "unmoveable":
                    thisWindow.attr("unmoveable","True");
                    break;
                case "alwaysOnTheBottom":
                    thisWindow
                        .css("z-index",0)
                        .attr("z-indexUnchangeable","True");
                    break;
                case "position":
                    thisWindow
                        .css("left",parameters[i][1][0][0]+parameters[i][1][0][1])
                        .css("top" ,parameters[i][1][1][0]+parameters[i][1][1][1]);
                    break;
                case "size":
                    thisWindow
                        .css("width", parameters[i][1][0][0]+parameters[i][1][0][1])
                        .css("height",parameters[i][1][1][0]+parameters[i][1][1][1]);
                    break;
                case "noShadow":
                    thisWindow.children("._windowShadow").remove();
                    //thisWindow.height(thisWindow.height()-2);
                    thisWindow
                        .css("border-top","none")
                        .css("border-bottom","none");
                default:

                    break;
            }
        }
    }catch (e) {
        /*console.log(e);*/
    }
    if(windowsNumber>1)addWindowToWindowsManager(windowsNumber-1,title);
}
function addWindowToWindowsManager(id,title) {
    var windowInfomationHTML="\n" +
        "<div class=\"noneSelect buttonLike _infomationOfWindow\" id=\"_menubar"+id+"\" onclick=\"_minimize(this,'byWindowsManager')\" unselectable=\\\"on\">"+
        title+
        "<div class=\"noneSelect __right _window_button _window_button_threeButtonsOnTitleBar _minimize\" onclick=\"_close(this,'byWindowsManager')\" unselectable=\"on\">x</div>\n" +
        /*
        "<div class=\"noneSelect __right _window_button _window_button_threeButtonsOnTitleBar _minimize\" onclick=\"_minimize(this,'byWindowsManager')\" unselectable=\"on\">-</div>\n" +
        */
        "</div>";
    var windowsManagerWindow=$("#windowsManager");
    windowsManagerWindow.append(windowInfomationHTML);
    console.log(title,id);
}
function _minimize(window,comeFrom){
    changePosition="True";
    /*window.stopPropagation();*/
    if(!comeFrom) {
        /*FROM WINMGR*/
        /*$(window).parent().parent().parent().parent().hide();*/
        var mWindow=$(window).parent().parent().parent().parent();
        var mBar=$("#_menubar"+mWindow.attr("id").substring(7));
    }else{
        /*FROM WINDOW*/
        var mBar=$(window);
        var mWindow=$("#_window"+mBar.attr("id").substring(8));
    }

    if(mWindow.is(":hidden")){
        mWindow.show();
        mBar.css("color","black");
        /*隐藏时*/
    }else {
        mWindow.hide();
        mBar.css("color", "red");
        /*显示时*/
    }
}
function _close(window,comeFrom){
    if(!comeFrom) {
        var mWindow=$(window).parent().parent().parent().parent();
        var mBar=$("#_menubar"+mWindow.attr("id").substring(7));
    }else{
        var mBar=$(window).parent();
        var mWindow=$("#_window"+mBar.attr("id").substring(8));
    }
    mWindow.remove();
    mBar.remove();
}

function mWindow(title,text,sizeXY,parameters){
    this.title=title;
    this.text=text;
    this.sizeXY=sizeXY;
    this.parameters=parameters;
    this.windows=null;
    this.id=0;
}
    mWindow.prototype.createWindow=function(){
        newWindow(this.title,this.text,this.sizeXY,this.parameters);
        this.id=windowsNumber-1;
        this.windows=$("#_window"+this.id);
    };
    mWindow.prototype.pushElement=function(){
        pushElementToNewWindow(this.title,this.text,this.sizeXY,this.parameters);
    };
    mWindow.prototype.close=function(){
        this.windows.remove();
    };
    mWindow.prototype.changeTitle=function(title){
        this.title=title;
        this.windows.children(".__window").children("._titleBar").children("._title").
            html(this.title);
    };
    mWindow.prototype.changeText=function(text){
        this.text=text;
        this.windows.children(".__window").children("._contents").html(this.text);
    };
    mWindow.prototype.changeSize=function(size){
        this.sizeXY=size;
        /**/
    };
    mWindow.prototype.getTitle=function(){
        return this.title;
    };
    mWindow.prototype.getText=function(){
        return this.text;
    };
    mWindow.prototype.getSize=function(){
        return this.sizeXY;
    };
    mWindow.prototype.getId=function(){
        return this.id;
    };
    mWindow.prototype.getWindow=function(){
        return this.windows;
}




$(document).ready(function(){
    $(document).mousemove(function(e){
        /*$("span").text(e.pageX + ", " + e.pageY);*/
        if(isMoving)moveing(windowNow,[e.pageX,e.pageY]);
    });

    var windowsManager=new mWindow("WindowsManager","<div id=\"windowsManager\"></div>",[240,640],
        [["uncloseable"],["unminimizeable"],["unmoveable"],["alwaysOnTheBottom"],
        ["position",[[0,"px"],[0,"px"]]],["size",[[240,"px"],[100,"%"]]],["noShadow"]]);
    windowsManager.createWindow();
    windowList=[];
    /*var addWindows=new mWindow("New!!","<button onclick=\"windowList.push(new mWindow('Title','Text',[320,240]).createWindow())\">Click me!</button>",
        [320,240]);
    addWindows.createWindow();*/
    GraphicInterface();
    $("#_menubar0")
        .children("._window_button_threeButtonsOnTitleBar")
        .css("color", "red")
        .removeAttr("onclick");

});