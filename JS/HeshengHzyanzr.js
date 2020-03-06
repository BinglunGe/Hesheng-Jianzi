function BasicFunctions(){
    this.convertTable={
        "HESHENGJIANZI":GuanhuaHeshengJianzi,
    };
    this.interfaceDictionary= {
        "EN":{
            "EN":"ENGLISH",
            "CHS":"SIMPLIFIED CHINESE",
            "CHT":"TRADITIONAL CHINESE",
            "JP":"JAPANESE",
            "Start":"START",
            "New Convert Window":"NEW CONVERT WINDOW",
            "New Convert":"CONVERT WINDOW",
            "Setting":"SETTING",
        },
        "CHS":{
            "EN":"英文",
            "CHS":"简体中文",
            "CHT":"繁体中文",
            "JP":"日文",
            "Start":"开始",
            "New Convert Window":"新建转换窗口",
            "New Convert":"转换窗口",
            "Setting":"设置",
        },
        "CHT":{
            "EN":"英文",
            "CHS":"簡體中文",
            "CHT":"繁體中文",
            "JP":"日文",
            "Start":"開始",
            "New Convert Window":"新建轉換視窗",
            "New Convert":"轉換視窗",
            "Setting":"設定",
        },
        "JP":{
            "EN":"英語",
            "CHS":"中国語簡体",
            "CHT":"中国語繁体",
            "JP":"日本語",
            "Start":"スタート",
            "New Convert Window":"変換ウィンドウを做成する",
            "New Convert":"変換ウィンドウ",
            "Setting":"設定",
        },
    };
    this.nowLanguage="EN";
    this.nowLanguage=this.getSystemLanguage();
}
    BasicFunctions.prototype.getSystemLanguage=function(){
        if($.cookie("LANG"))return $.cookie("LANG");
        var systemLanguage="EN";
        switch((navigator.browserLanguage || navigator.language).toLowerCase()){
            case "zh-cn":
                systemLanguage = "CHS";
                break;
            case "zh-tw":
                systemLanguage = "CHT";
                break;
            case "zh-hk":
                systemLanguage = "CHT";
                break;
            case "zh-mo":
                systemLanguage = "CHT";
                break;
            case "ja-jp":
                systemLanguage = "JA";
                break;
            default:
                systemLanguage = "EN";
        }
        return systemLanguage;
    };
    BasicFunctions.prototype.getInterfaceText=function (textInEnglish) {
        return this.interfaceDictionary[this.nowLanguage][textInEnglish];
    };
function GraphicInterface() {
    this.basicFunctions=new BasicFunctions();
    var StartWindowHtml =
        "<div class=\"bigButtonInStartWindow _window_button\" onclick=\"new AddWindow('Convert')\">\n" +
        this.basicFunctions.getInterfaceText("New Convert Window") +
        "</div>"+
        "<div class=\"bigButtonInStartWindow _window_button\" onclick=\"new AddWindow('Setting')\">\n" +
        this.basicFunctions.getInterfaceText("Setting") +
        "</div>";
    var StartWindow=new mWindow(this.basicFunctions.getInterfaceText("Start"),
        StartWindowHtml,[800,600],[["uncloseable"]]);
    StartWindow.createWindow();
}
function AddWindow(windowName) {
    this.basicFunctions=new BasicFunctions();
    switch (windowName) {
        case "Setting":
            this.openSettingWindow();
            break;
        case "Convert":
            this.openConvertWindow();
    }
    return;
}
    AddWindow.prototype.openConvertWindow=function(){
        var windowHtml="<table width='100%'>\n" +
            "    <tr>\n" +
            "        <td width=\"45%\">\n" +
            "            <textarea id='textarea"+windowsNumber+"' style='width: 100%;' rows='28'></textarea>\n" +
            "        </td>\n" +
            "        <td height='100%'><div class='_window_button' onclick='convert("+windowsNumber+")'>--></div></td>\n"+
            "        <td width=\"45%\">\n" +
            "            <pre id= \"div"+windowsNumber+"\" style='height: 559px;width:100%;word-break: break-all;'></pre>\n" +
            "        </td>\n" +
            "    </tr>\n" +
            "</table>";
        var convertWindow=new mWindow(this.basicFunctions.getInterfaceText("New Convert"),windowHtml,
            [800,600],);
        convertWindow.createWindow();
    };
    AddWindow.prototype.openSettingWindow=function () {
        var languagesList=Object.keys(this.basicFunctions.interfaceDictionary);
        var languagesListHtml="";
        for (var language in languagesList){
            console.log(languagesList);
            languagesListHtml+="<div class='_window_button' style='padding: 4px;' onclick='changeLanguageTo(\""+languagesList[language]+"\")'>"+
                this.basicFunctions.getInterfaceText(languagesList[language])+"</div><br/>";
        }
        var settingWindow=new mWindow(
            this.basicFunctions.getInterfaceText("Setting"),
            languagesListHtml,
            [240,320],
        );
        settingWindow.createWindow();
    };
function changeLanguageTo(language) {
    $.cookie('LANG', language, { expires: 7, path: '/' });
    location.reload();
}
function convert(number) {
    var inputArea=$("#textarea"+number);
    var outputArea=$("#div"+number);
    outputArea.text(convertByRule(inputArea.val()));
    return inputArea.val();
}

function convertByRule(inStr) {
    var basicFunctions=new BasicFunctions();
    var rules=basicFunctions.convertTable["HESHENGJIANZI"].split("\n");
    var outStr=inStr;
    for(var i in rules){
        //console.log(rules[i-1],"-->",outStr);
        if(rules[i][0]===" "){
            continue;
        }
        if(rules[i][0]==="'"){
            var splitedParameters=rules[i].split(" ");
            for(var j in splitedParameters[1]){
                outStr=outStr.replace(new RegExp(splitedParameters[1][j], "gm"), splitedParameters[2][j]);
            }
        }else{
            var splitedParameters=rules[i].split("/");
            outStr=outStr.replace(new RegExp(splitedParameters[1],"g"), splitedParameters[2]);
        }
    }
    console.log(outStr);
    return outStr;
}