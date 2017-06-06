/*  %CopyRight
    ToolsRel: %Toolsrel */
var gFocusObj = null;
var bRichTextEnabled = 0;
var gRichTextField = null;
var bTimer = null;
var objBeforeOrAfterFocusSave = null; //% IE8 bug workaround fix: save the object before or after the oject to set focus on since we need to set focus on a different object before setting focus on the object we want focus on.
var objToBeFocus = null; //% object id whose object is to be set focus on
var gcurSearchRowId = "";
var gActiveBtn = null;
if (window.showhide == null) {
    window.showhide = function (obj, bShow) {
        if (obj == null)
            return;
        if (!isFModeLayout())
            obj.style.zIndex = 99991;
        if (bShow) {
            var scrollY = ptCommonObj2.getScrollY();
            var x = ptCommonObj2.getScrollX();
            if (browserInfoObj2.isIE && ("%Direction" === "rtl"))
                x = obj.parentNode.scrollWidth - obj.parentNode.clientWidth - obj.parentNode.scrollLeft;
            x = (x > 0) ? (0 - x) : x;
            if (obj.parentNode.tagName.toLowerCase() !== "body") {
                var topCoord = getPgltTopY(obj); //% This is pagelet case, override
                scrollY = topCoord.y;
                x = topCoord.x;
            }
            if (scrollY != 0 || obj.style.top != "")
                obj.style.top = scrollY + 'px';
            obj.style. % AlignEnd;
            x + 'px';
            obj.style.visibility = "visible";
            obj.style.display = "block";
        }
        else {
            obj.style.visibility = "hidden";
            obj.style.display = "none";
        }
    };
}
function getPgltTopY(obj) {
    //% additional code for pagelets
    var topY = ptCommonObj2.getScrollY();
    var topX = ptCommonObj2.getScrollX();
    if (window.ptalPageletArea || (parent && parent.ptalPageletArea))
        var objGP = document.getElementById(this.ptalPageletArea.ptalPagelet.hoverElementId);
    else
        var objGP = ptUtil.getGrandParent(obj);
    //% in WorkCenter(WC): objGP will point to a div wrapper that has a style.height and style.width, overflow=auto
    //% this objGP will contain the PIA component page 
    if (objGP.style.height != "" && browserInfoObj2.isIE) {
        //% WC pagelet in IE
        topY = objGP.scrollTop;
        if ("%Direction" === "ltr")
            topX = (objGP.scrollLeft > 0) ? -objGP.scrollLeft : 0;
        else
            topX = (objGP.offsetLeft > 0 && ((objGP.scrollWidth - objGP.scrollLeft) == objGP.clientWidth)) ? 0 : (0 - (objGP.scrollWidth - objGP.scrollLeft - objGP.clientWidth));
    }
    else {
        var gpScrollTop = objGP.scrollTop;
        //% case for portal homepage pagelets or non-IE browser+WC pagelets
        var p = obj.parentNode;
        while (p && (p.tagName.toLowerCase() !== "li" && p.tagName.toLowerCase() !== "body")) {
            if (p.tagName.toLowerCase() == "div" && p.id.indexOf("WSRPDIV") >= 0)
                break; //% this is a wsrp portlet
            p = p.parentNode;
        }
        if (p) {
            if (p.tagName.toLowerCase() == "body") {
                return { x: topX, y: topY };
            }
            //% look for pageletHeader 
            var pgltTop = 0, pgltHeader = ptUtil.getElemsByClass("PTPAGELETHEADER", p, "table");
            if (pgltHeader[0]) {
                pgltTop = pgltHeader[0].offsetHeight + 4;
            }
            else {
                pgltHeader = ptUtil.getElemsByClass("PTPAGELETBODY", p, "table")[0];
                if (!pgltHeader) {
                    pgltHeader = p; //% <li> element
                }
                pgltTop = pgltHeader.offsetTop + 4;
            }
            if (p.tagName.toLowerCase() === "li" && objGP.style.height != "") {
                //% non-IE, WC pglt
                //% topY = pgltHeader.length ? p.offsetTop + pgltTop : p.offsetTop;
                topY = (gpScrollTop <= 0) ? 0 : gpScrollTop;
                //% topX = (objGP.scrollWidth!=objGP.clientWidth) ? 20 : 0 ;
                topX = (objGP.scrollLeft > 0) ? (0 - objGP.scrollLeft) : 0;
            }
            else {
                if (p.id.indexOf("WSRPDIV") >= 0) {
                    var tempY = ptCommonObj2.getPosition(p).y;
                    topY = (tempY > topY) ? tempY : topY;
                }
                else {
                    topY = (topY > p.offsetTop) ? (topY - p.offsetTop) : (gpScrollTop ? gpScrollTop + pgltTop : pgltTop);
                }
                if ((p.offsetLeft + p.offsetWidth) > document.body.clientWidth) {
                    topX = (p.offsetLeft + p.offsetWidth) - document.body.clientWidth - document.body.scrollLeft;
                    topX = (topX < 0) ? 0 : topX;
                }
                else {
                    if ("%Direction" === "rtl") {
                        topX = (p.offsetLeft > 0 && ((document.body.scrollWidth - document.body.scrollLeft) >= document.body.clientWidth)) ? 0 : (0 - p.offsetLeft);
                    }
                    else
                        topX = 0; //%IE	
                }
            }
        } //% end of if(p)
    }
    return { x: topX, y: topY };
}
function setSaveText_() { }
 % FormName(txt);
{
    var saveobj = document.getElementById("SAVED_%FormName");
    if (saveobj) {
        if (txt == "")
            txt = '%Message(124, 341, Saving...)'; //% default to 'Saving...' if no message text provided
        document.getElementById("ptStatusText_%FormName").innerHTML = txt;
        showhide(saveobj, true);
        document.getElementById("saveWait_%FormName").style.display = "";
    }
}
function processing_() { }
 % FormName(opt, waittime);
{
    var waitobj = document.getElementById("WAIT_%FormName");
    var saveobj = document.getElementById("SAVED_%FormName");
    var saveWaitObj = document.getElementById("saveWait_%FormName");
    updateWindowTitleFromFakeBC(); //% Call to update the window title for the remote page content
    if (opt == 0) {
        showhide(waitobj, false);
        showhide(saveobj, false);
        return;
    }
    if (opt == 1) {
        if (saveobj && (saveobj.style.visibility != "hidden") && (saveobj.style.display != "none")
            && (saveWaitObj.style.display != "none"))
            return;
        showhide(waitobj, true);
        showhide(saveobj, false);
        if (typeof bTimer != "undefined" && bTimer != null)
            clearTimeout(bTimer);
        return;
    }
    if (opt == 2) {
        showhide(waitobj, false);
        setSaveText_ % FormName('%Message(124, 174, Saved)');
        if (saveWaitObj)
            saveWaitObj.style.display = "none";
        bTimer = setTimeout("processing_%FormName(0)", waittime);
        //% execute the following code only when page is saved (opt==2) and we are in activity guide.
        if ((typeof top.ptaiAguide == 'object') && top.ptaiAguide.ptaiItemId != null && top.ptaiAguide.ptaiItemId) {
            AgPostMessage();
        }
    }
}
function isAltKey(evt) {
    if (!evt && window.event)
        evt = window.event;
    if (!evt)
        return false;
    if (evt.altKey)
        return true;
    if (evt.modifiers)
        return (evt.modifiers & Event.ALT_MASK) != 0;
    return false;
}
function isCtrlKey(evt) {
    if (!evt && window.event)
        evt = window.event;
    if (!evt)
        return false;
    if (evt.ctrlKey)
        return true;
    if (evt.modifiers)
        return (evt.modifiers & Event.CONTROL_MASK) != 0;
    return false;
}
function isShiftKey(evt) {
    if (!evt && window.event)
        evt = window.event;
    if (!evt)
        return false;
    if (evt.shiftKey)
        return true;
    if (evt.modifiers)
        return (evt.modifiers & Event.SHIFT_MASK) != 0;
    return false;
}
function getKeyCode(evt) {
    if (!evt && window.event)
        evt = window.event;
    if (!evt)
        return 0;
    if (evt.keyCode)
        return evt.keyCode;
    if (evt.which)
        return evt.which;
    return 0;
}
function cancelBubble(evt) {
    if (!evt && window.event)
        evt = window.event;
    if (!evt)
        return;
    if (typeof evt.cancelBubble != "undefined")
        evt.cancelBubble = true;
    if (typeof evt.stopPropagation != "undefined" && evt.stopPropagation)
        evt.stopPropagation();
}
function isPromptKey(evt) {
    if (isAltKey(evt) && getKeyCode(evt) == "5".charCodeAt(0)) {
        cancelBubble(evt);
        return true;
    }
    return false;
}
function getEventTarget(evt) {
    if (!evt && window.event)
        evt = window.event;
    if (!evt)
        return null;
    if (evt.srcElement)
        return evt.srcElement;
    if (evt.target)
        return evt.target;
    return null;
}
function getModifiers(evt) {
    var res = "";
    if (isAltKey(evt))
        res += "A";
    if (isCtrlKey(evt))
        res += "C";
    if (isShiftKey(evt))
        res += "S";
    return res;
}
var nLastKey_ =  % FormName;
0;
var oLastKeyEvent = null;
var gKeyDownTarget = null;
function doKeyDown_() { }
 % FormName(evt);
{
    oLastKeyEvent = evt;
    var target = getEventTarget(evt);
    gKeyDownTarget = target;
    if (!isFModeLayout() && !PT_handleTabKeyForModalDialog(evt))
        return false;
    if (target && target.form && target.form.name != "%FormName")
        return findHandler("doKeyDown_" + target.form.name, evt);
    nLastKey_ % FormName;
    getKeyCode(evt);
    var bKeyUp = target && target.getAttribute('onkeyup') != null;
    if (isFModeLayout() && nLastKey_ % FormName == 13 && bKeyUp)
        evt.preventDefault();
    if (nLastKey_ % FormName != "\t".charCodeAt(0)) {
        if (isGridNav(evt))
            ptGridObj_ % FormName.doArrowNavGrid(evt);
        if (isTypeAheadEl(evt))
            ptTAObj_ % FormName.KeyUpDown(evt);
        if (browserInfoObj2.isSafari && nLastKey_ % FormName == 27) {
            var evt2 = document.createEvent('Event');
            evt2.initEvent('keypress', true, true);
            evt2.keyCode = evt.keyCode;
            target.dispatchEvent(evt2);
        }
        return true;
    }
    if (isCtrlKey(evt))
        return tryFocus(oFirstTab_ % FormName);
    if (isAltKey(evt) || (isShiftKey(evt) && !isGridNav(evt)))
        return true;
    if (target == oLastTab_ % FormName) {
        if (oFirstTB_ % FormName) {
            if (!bTabOverTB_ % FormName)
                return true;
        }
        if (oFirstPg_ % FormName) {
            if (!bTabOverPg_ % FormName)
                return tryFocus(oFirstPg_ % FormName);
        }
        if (bTabOverNonPS_ % FormName || oFirstTB_ % FormName != null || oFirstPg_ % FormName != null)
            return tryFocus(oFirstTab_ % FormName);
        return true;
    }
    if (target == oLastTB_ % FormName) {
        if (oFirstPg_ % FormName) {
            if (!bTabOverPg_ % FormName)
                return tryFocus(oFirstPg_ % FormName);
        }
        if (bTabOverNonPS_ % FormName || oFirstPg_ % FormName != null)
            return tryFocus(oFirstTab_ % FormName);
        return true;
    }
    if (target == oLastPg_ % FormName) {
        if (bTabOverNonPS_ % FormName)
            return tryFocus(oFirstTab_ % FormName);
        return true;
    }
    //% typeahead is interested in tab key, see 1858794000 for details.
    if (nLastKey_ % FormName == "\t".charCodeAt(0) && isTypeAheadEl(evt)) {
        ptTAObj_ % FormName.KeyUpDown(evt);
        return true;
    }
}
function getLastKey_() { }
 % FormName();
{
    var nTemp = nLastKey_ % FormName;
    nLastKey_ % FormName;
    0;
    return nTemp;
}
function doKeyUp_() { }
 % FormName(evt);
{
    var target = getEventTarget(evt);
    if (isFModeLayout() && target && (target.getAttribute('onkeyup') != null
        || target.getAttribute('onkeydown') != null))
        return;
    if (!isFModeLayout() && !PT_handleTabKeyForModalDialog(evt))
        return false;
    if (target && target.form && target.form.name != "%FormName")
        return findHandler("doKeyUp_" + target.form.name, evt);
    var key = getKeyCode(evt);
    var keyChar = String.fromCharCode(key);
    if (isCtrlKey(evt) && key == 220) {
        ptConsole2.active();
        return false;
    }
    if (keyChar == "\r" && (!(isButton(target) || isRowAct(target)) || !isFModeLayout()) || key == 27) {
        //% hit enter key on delete row button, display delete row warning message
        if (target != null && target.id.indexOf("$delete") != -1) {
            if (!evt)
                return;
            return;
        }
        if (key == 27) {
            if (typeof (bDoModal_ % FormName) != "undefined" && bDoModal_ % FormName && modalID != null)
                doUpdateParent(document. % FormName, '#ICCancel');
            else if (isFModeLayout() && bInModal)
                submitAction_ % FormName(document. % FormName, '#ICCancel');
            return;
        }
        if (isFModeLayout() && key == 27)
            closeLastModal(evt, target);
        return;
    }
    if (!routeKeyEvent(evt))
        return false;
    var bAlt = isAltKey(evt);
    var bCtrl = isCtrlKey(evt);
    var bNotMine = false;
    if (bAlt) {
        if (bCtrl || altKey_ % FormName.indexOf(keyChar) < 0) {
            if (keyChar == "9" || key == 220 || key == 186)
                return true;
            else if (keyChar == "2")
                if (bCtrl)
                    bNotMine = true;
                else
                    bNotMine = false;
            else if (keyChar == "3" || keyChar == "4")
                if (bCtrl)
                    bNotMine = true;
                else
                    bNotMine = false;
            else
                bNotMine = true;
        }
    }
    else if (bCtrl) {
        if (key == 88 || key == 120) {
            ptConsole2.deactive();
            return false;
        }
        keyChar = String.fromCharCode(key | 0x40);
        if (ctrlKey_ % FormName.indexOf(keyChar) < 0)
            bNotMine = true;
    }
    else if ((key == 32 || key == 13) && (isButton(target)) || (key == 13 && isRowAct(target))) {
        bNotMine = false;
    }
    else {
        if (baseKey_ % FormName.indexOf(keyChar) < 0)
            bNotMine = true;
    }
    if (bNotMine) {
        //% pass the key event to another frame or the iframe key event handler
        if (bAlt || bCtrl) {
            //% do frame search
            var navFrame = parent.frames["NAV"];
            if (!navFrame) {
                navFrame = parent.frames["UniversalHeader"];
            }
            if (navFrame && navFrame.parentKeyHandler && !isCrossDomain(navFrame)) {
                navFrame.parentKeyHandler(window, key, bAlt, bCtrl);
                //% check for iframe template
            }
            else if (parent.ptIframe && parent.ptIframe.parentKeyHandler && !isCrossDomain(parent)) {
                parent.ptIframe.parentKeyHandler(window, key, bAlt, bCtrl);
            }
            else if (parent.parent.ptIframe && parent.parent.ptIframe.parentKeyHandler && !isCrossDomain(parent.parent)) {
                parent.parent.ptIframe.parentKeyHandler(window, key, bAlt, bCtrl);
            }
        }
        if (isGridNav(evt))
            ptCommonObj2.terminateEvent(evt);
        if (isTypeAheadEl(evt))
            ptTAObj_ % FormName.GiveOptions(evt);
        return true;
    }
    var code = getModifiers(evt) + keyChar;
    if (target && target.name)
        document. % FormName.ICFocus.value;
    target.name;
    if (code == "A8")
        if (!doDeleteKey_ % FormName(target))
            return false;
    if (code == "A\xbf") {
        if (window.FindString_ % FormName
            && document. % FormName.ICFind
            && findScroll(target)) {
            if (!FindString_ % FormName(document. % FormName.ICFind))
                return false;
        }
        else
            return false;
    }
    if (code == "A7")
        if (!doInsertKey_ % FormName(target))
            return false;
    if (code == "A\xbc" || code == "A\xbe" || code == "A\xde")
        if (!activeLink(target, code))
            return false;
    if (code == 'A5') {
        var id_s = target.id.split("$")[0];
        var occ_s = target.id.split("$")[1];
        var pid = id_s + "$prompt";
        if (occ_s && typeof occ_s != "undefined")
            pid += "$" + occ_s;
        var pobj = document.getElementById(pid);
        var operation = "";
        if (!pobj || typeof pobj == "undefined") {
            pid = id_s + "$spellcheck";
            if (occ_s && typeof occ_s != "undefined")
                pid += "$" + occ_s;
            pobj = document.getElementById(pid);
            if (pobj && typeof pobj != "undefined")
                operation = "$spellcheck";
        }
        if (!pobj || typeof pobj == "undefined") {
            pid = target.id + "$prompt";
            pobj = document.getElementById(pid);
            if (!pobj || typeof pobj == "undefined")
                return false;
        }
    }
    if (key == 13 && !ptCommonObj2.isSearchPage(target.form)
        || (key == 32 || key == 13) && isButton(target)
        || key == 13 && isRowAct(target)) {
        if (target.getAttribute('onclick') != null && (target.getAttribute('href') == null || key == 32 && target.getAttribute('href') == 'javascript:void(0);')) {
            if (isFModeLayout() && target != gKeyDownTarget)
                return;
            target.onclick();
            return;
        }
        else if (modalZoomName != null) {
            doUpdateParent(document. % FormName, '#ICReturn');
            return;
        }
        else if (isFModeLayout()) {
            if (target != gKeyDownTarget || key == 13 && typeof target.tagName != "undefined" && (target.tagName == "a" || target.tagName == "A"))
                return;
            var sScript = target.getAttribute('href');
            var bScript = (isOnClickCancelBubble(target) && sScript != null && sScript.indexOf("javascript:") != -1) ? true : false;
            if (bScript)
                eval(sScript);
            return;
        }
        else if (typeof event != "undefined")
            submitAction_ % FormName(document. % FormName, event.srcElement.id);
        else
            submitAction_ % FormName(document. % FormName, evt.target.id);
    }
    else {
        if (target && target.form)
            addchg_ % FormName(target);
        if (code == 'A5') {
            submitAction_ % FormName(document. % FormName, "#KEY" + code + operation, target.id);
        }
        else if (bAlt) {
            if (key == 49)
                setSaveText_ % FormName('%Message(124, 341, Saving...)', true, false);
            //Only submitAction if the key has meaning here
            if (altKey_ % FormName.indexOf(keyChar) >= 0 || keyChar == "2" || keyChar == "3" || keyChar == "4") {
                var tmpToolPB = null;
                if (keyChar == "2" && (((tmpToolPB = document.getElementById("#ICList")) == null) || tmpToolPB.disabled))
                    return false;
                if (keyChar == "3" && (((tmpToolPB = document.getElementById("#ICNextInList")) == null) || tmpToolPB.disabled))
                    return false;
                if (keyChar == "4" && (((tmpToolPB = document.getElementById("#ICPrevInList")) == null) || tmpToolPB.disabled))
                    return false;
                if (keyChar == "2" || keyChar == "3" || keyChar == "4") {
                    var url = "javascript:submitAction_%FormName(document.%FormName, \'#KEY" + code + "\')";
                    if (!saveWarning("", null, "", url))
                        return false;
                }
                if (!ptCommonObj2.isSearchPage(target.form) && (code == "A\xbc" || code == "A\xbe" || code == "A\xde") && gActiveBtn && target.name == null) {
                    document. % FormName.ICFocus.value;
                    gActiveBtn.name;
                    submitAction_ % FormName(document. % FormName, gActiveBtn.name);
                }
                else
                    submitAction_ % FormName(document. % FormName, "#KEY" + code);
            }
        }
        else {
            submitAction_ % FormName(document. % FormName, "#KEY" + code);
        }
    }
    return false;
}
function delPageBarAndTabs() {
    var obj = document.getElementById('%FormNamedivPAGEBAR');
    if (obj != null && typeof obj != 'undefined')
        obj.innerHTML = "";
    obj = document.getElementById('%FormNamedivPSPANELTABS');
    if (obj != null && typeof obj != 'undefined')
        obj.innerHTML = "";
    obj = document.getElementById('%FormNamedivPSPANELTABLINKS');
    if (obj != null && typeof obj != 'undefined')
        obj.innerHTML = "";
}
function activeLink(obj, akey) {
    var scrl = findScroll(obj);
    var btnid;
    if (!scrl) {
        //% check in search page
        if (akey == "A\xbc")
            btnid = "#ICPrevPage";
        else if (akey == "A\xbe")
            btnid = "#ICNextPage";
        else
            return false;
        var btn = document.getElementById(btnid);
        if (btn)
            return true;
        else
            return false;
    }
    if (akey == "A\xbc")
        btnid = "\$hup\$";
    else if (akey == "A\xbe")
        btnid = "\$hdown\$";
    else if (akey == "A\xde")
        btnid = "\$hviewall\$";
    btnid = scrl.id.replace(/\$scroll[im]?\$/, btnid);
    var btn = document.getElementById(btnid);
    gActiveBtn = btn;
    if (btn)
        return true;
    return false;
}
function findHandler(handlerName, evt) {
    var obj = window[handlerName];
    if (typeof obj == "function")
        return obj(evt);
    return true;
}
function keyHandler(keyCode, bIsAlt, bIsCtrl) {
    return keyHandler_ % FormName(keyCode, bIsAlt, bIsCtrl);
}
function keyHandler_() { }
 % FormName(keyCode, bIsAlt, bIsCtrl);
{
    var keyChar = String.fromCharCode(keyCode);
    var code = "";
    if (bIsAlt) {
        code = "A";
        if (bIsCtrl || altKey_ % FormName.indexOf(keyChar) < 0)
            return false;
    }
    else if (bIsCtrl) {
        code = "C";
        keyChar = String.fromCharCode(keyCode | 0x40);
        if (ctrlKey_ % FormName.indexOf(keyChar) < 0)
            return false;
    }
    else
        return false;
    code += keyChar;
    if (code == "A8" || code == "A\xbf" || code == "A7")
        return false;
    if (target && target.form)
        addchg_ % FormName(target);
    submitAction_ % FormName(document. % FormName, "#KEY" + code);
    return true;
}
function doDeleteKey_() { }
 % FormName(obj);
{
    if (!window.DeleteCheck2_ % FormName)
        return false;
    var scroll = findScroll(obj);
    if (!scroll)
        return false;
    var bFocusable = true;
    //obj.id.length == 0 is for IE browser.
    //obj.nodeName == 'BODY' is for FF and Chrome
    if ((obj.nodeName == 'BODY' || obj.id.length == 0) && preID_ % FormName != null) {
        var temp = obj.ownerDocument.getElementById(preID_ % FormName);
        if (typeof temp != 'undefined')
            obj = temp;
        bFocusable = false;
    }
    if (scroll.id.search(/^(.*)(\$scroll[im]?\$)(.*)$/, "$fdelete$") < 0)
        buttonid = scroll.id;
    else
        buttonid = RegExp["$1"] + "$fdelete$" + RegExp["$3"];
    if (document.getElementById(buttonid))
        return DeleteCheck2_ % FormName(buttonid);
    if (bFocusable) {
        if (obj.id == null || obj.id.search(/\$(\d*)(\$\$\d*)?$/) < 0)
            return false;
    }
    else {
        if (obj.id == null || obj.id.search(/tr(.*)\$(\d*)_row(\d*)?/) < 0)
            return false;
    }
    var row = bFocusable ? RegExp.$1 : RegExp.$3 - 1;
    if (buttonid.search(/^(.*)(\$fdelete\$)(.*)$/) < 0)
        return false;
    buttonid = RegExp["$1"] + "$delete$" + row + "$$" + RegExp["$3"];
    if (document.getElementById(buttonid))
        return DeleteCheck2_ % FormName(buttonid);
    return false;
}
function doInsertKey_() { }
 % FormName(obj);
{
    if (!window.AddMultiple_ % FormName)
        return false;
    var scroll = findScroll(obj);
    if (!scroll)
        return false;
    var bHasInsertBtn = false;
    if (scroll.id.search(/^(.*)(\$scroll[im]?\$)(.*)$/, "$fnew$") < 0)
        buttonid = scroll.id;
    else
        buttonid = RegExp["$1"] + "$fnew$" + RegExp["$3"];
    if (document.getElementById(buttonid))
        bHasInsertBtn = true;
    if (obj.id == null || obj.id.search(/\$(\d*)(\$\$\d*)?$/) < 0)
        return false;
    var row = RegExp.$1;
    //% id for insert button on this row...
    if (buttonid.search(/^(.*)(\$fnew\$)(.*)$/) < 0)
        return false;
    buttonid = RegExp["$1"] + "$new$" + row + "$$" + RegExp["$3"];
    if (!bHasInsertBtn) {
        if (document.getElementById(buttonid))
            bHasInsertBtn = true;
    }
    if (!bHasInsertBtn) {
        /* try multiple insert key */
        buttonid = RegExp["$1"] + "$newm$" + row + "$$" + RegExp["$3"];
        if (document.getElementById(buttonid))
            bHasInsertBtn = true;
    }
    if (bHasInsertBtn) {
        if (scroll.id.match(/\$scrollm\$/))
            return AddMultiple_ % FormName(document. % FormName.ICAddCount);
        if (scroll.id.match(/\$scrolli\$/))
            return true;
    }
    return false;
}
function findScroll(obj) {
    var temp = null;
    if (obj.nodeName == 'BODY' && preID_ % FormName != null) {
        temp = obj.ownerDocument.getElementById(preID_ % FormName);
        if (typeof temp != 'undefined')
            obj = temp;
    }
    while (obj) {
        if (typeof obj.id != "undefined")
            if (obj.id.match(/\$scroll/))
                return obj;
        if (typeof obj.parentNode != "undefined")
            obj = obj.parentNode;
        else if (typeof obj.offsetParent != "undefined")
            obj = obj.offsetParent;
        else
            return null;
    }
}
if (window.doKeyPress_ % FormName == null) {
    window.doKeyPress_ % FormName;
    function (evt) {
        oLastKeyEvent = evt;
        var event = evt ? evt : window.evt;
        var target = getEventTarget(event);
        if (target && target.form)
            addchg_ % FormName(target);
        if (isFModeLayout() && target && (target.getAttribute('onkeyup') != null
            || target.getAttribute('onkeydown') != null))
            return;
        if (target && target.form && target.form.name != "%FormName")
            return findHandler("doKeyPress_" + target.form.name, event);
        var key = getKeyCode(event);
        var keyChar = String.fromCharCode(key);
        if (key == 27) {
            if (!(glObjTr.isEmpty(glObjTr.sOpen))) {
                glObjTr.removePrevMenu(event);
                return true;
            }
            if (typeof window.bEscOnCal != 'undefined' && window.bEscOnCal == true) {
                window.bEscOnCal = false;
                return;
            }
            //% ESC key pressed when mouseover popup page is displayed
            if (!isFModeLayout() && MOpopupObj_ % FormName && typeof (MOpopupObj_ % FormName.bIs_shown) != "undefined" && MOpopupObj_ % FormName.bIs_shown)
                return MOpopupObj_ % FormName.StopAccess(event); // close mouseover popup
            if (typeof (bDoModal_ % FormName) != "undefined" && bDoModal_ % FormName)
                return true;
            else if (isTypeAheadEl(event))
                return true;
        }
        if (keyChar != "\r" && key != 27)
            return true;
        //% check whether the ENTER key is pressed on a grid zoom popup page or not.  If so, check whether the grid zoom "return"
        //% button with id "ICOKZG" was in-focus when the ENTER key is pressed.  If not, return true.
        var objGridZoom = document.getElementById("ICZoomGrid");
        if (objGridZoom && typeof objGridZoom != "undefined") {
            if (keyChar == "\r" && !(target.href || typeof target.onclick == "function") && objGridZoom.value == 1 && target.id != "ICOKZG")
                return true;
        }
        //% process Alt-9 and Alt-\
        if (!routeKeyEvent(event))
            return false;
        if (target && key != 27) {
            if (!isOnClickCancelBubble(target) && (typeof target.onclick == "function" || target.href)
                && target.type != "radio" && target.type != "checkbox")
                return true;
            if (target.type == "textarea")
                return true;
            if (key != 13 && isOnClickCancelBubble(target))
                return true;
        }
        var code = getModifiers(event) + keyChar;
        if (target && target.name)
            document. % FormName.ICFocus.value;
        target.name;
        /*var rc = ShowOrCloseModalOnEnter(key, target, "#KEY" + code);
         if (rc == 1)
             return true;
         else if (rc == -1)
             return false;*/
        //% No need to trigger refresh for typeahead on ENTER key. #1921503000  
        if (key == 13) {
            if (isTypeAheadEl(event) && ptTAObj_ % FormName.IsGrabHighlighted()) {
                return false;
            }
            if (isFModeLayout() && isPopupRequest(target.form, target.id))
                return false;
            var sScript = target.getAttribute('href');
            var bSubmitScript = (sScript != null && sScript.indexOf("javascript:") != -1) ? true : false;
            if (bSubmitScript) {
                eval(sScript);
                return false;
            }
        }
        submitAction_ % FormName(document. % FormName, "#KEY" + code);
        return false;
    }
}
function isOnClickCancelBubble(target) {
    if (!target || typeof target.onclick != "function")
        return false;
    var sString = String(target.onclick);
    if (sString.indexOf("javascript:cancelBubble(event);") == -1)
        return false;
    return true;
}
var oFirstTab_ =  % FormName;
null;
var oLastTab_ =  % FormName;
null;
var oFirstTB_ =  % FormName;
null;
var oLastTB_ =  % FormName;
null;
var oFirstPg_ =  % FormName;
null;
var oLastPg_ =  % FormName;
null;
var nFirstTBIndex = 5000;
var nFirstPgIndex = 10000;
function checkTabIndex(obj) {
    if (obj.tabIndex && obj.tabIndex >= 0) {
        if (obj.tabIndex < nFirstTBIndex) {
            if (oLastTab_ % FormName == null || obj.tabIndex > oLastTab_ % FormName.tabIndex)
                oLastTab_ % FormName;
            obj;
            if (oFirstTab_ % FormName == null || obj.tabIndex < oFirstTab_ % FormName.tabIndex)
                oFirstTab_ % FormName;
            obj;
        }
        else if (obj.tabIndex < nFirstPgIndex) {
            if (oLastTB_ % FormName == null || obj.tabIndex > oLastTB_ % FormName.tabIndex)
                oLastTB_ % FormName;
            obj;
            if (oFirstTB_ % FormName == null || obj.tabIndex < oFirstTB_ % FormName.tabIndex)
                oFirstTB_ % FormName;
            obj;
        }
        else {
            if (oLastPg_ % FormName == null || obj.tabIndex > oLastPg_ % FormName.tabIndex)
                oLastPg_ % FormName;
            obj;
            if (oFirstPg_ % FormName == null || obj.tabIndex < oFirstPg_ % FormName.tabIndex)
                oFirstPg_ % FormName;
            obj;
        }
    }
}
function setEventHandlers_() { }
 % FormName(sFirst, sLast, bMac);
{
    var focus1, focus2;
    focus1 = function (evt) { doFocus_ % FormName(this, true, true); };
    focus2 = function (evt) { doFocus_ % FormName(this, false, true); };
    fchange = function (evt) { addchg_ % FormName(this); };
    var i;
    if (sFirst != "") {
        var docanchors = null;
        if (isFModeLayout())
            docanchors = document.querySelectorAll('A,.psc_rowact[tabindex]');
        else
            docanchors = document.anchors;
        var docanclen = docanchors.length;
        for (i = 0; i < docanclen; ++i) {
            if (docanchors[i].id == sFirst)
                break;
        }
        for (++i; i < docanclen; ++i) {
            var anc = docanchors[i];
            if (anc.id == sLast)
                break;
            checkTabIndex(anc);
            checkAccessKeys(anc);
            if (typeof anc.onfocus != "function")
                anc.onfocus = focus1;
        }
    }
    var frm = document. % FormName;
    if (!frm)
        return;
    var frmlen = frm.length;
    objBeforeOrAfterFocusSave = null; //% save the node before/after the focus node
    var objBefore = null; //% object before the focus node
    var bAfter = 0; //% if no object before the focus object, need to pick up the object after the focus node.
    var b = navigator.userAgent.toLowerCase();
    var bIE = browserInfoObj2.isIE;
    var bIE8 = (bIE && b.indexOf("trident/4.0;") != -1) ? 1 : 0; //% ie8
    for (i = 0; i < frmlen; ++i) {
        var frmi = frm[i];
        if (frmi.type == "hidden")
            continue;
        //% It's IE8 and objToBeFocus: focus object id is not null.  objToBeFocus is set in C++ code (CICBlock::GenOnLoad). frmi object is not disabled.
        //% In addition, avoid picking up fields on mouseover popup page when the mouse over popup page is hidden. 
        if (bIE8 && objToBeFocus && !objBeforeOrAfterFocusSave && !frmi.isDisabled &&
            !(frmi.offsetParent && frmi.offsetParent.offsetParent && frmi.offsetParent.offsetParent.offsetParent &&
                frmi.offsetParent.offsetParent.className == "PSPAGECONTAINER" && frmi.offsetParent.offsetParent.offsetParent.style.visibility == "hidden")) {
            if (frmi.id != objToBeFocus) {
                objBefore = frmi;
                if (bAfter && objBefore) {
                    objBeforeOrAfterFocusSave = objBefore;
                    bAfter = 0;
                }
            }
            else {
                if (objBefore)
                    objBeforeOrAfterFocusSave = objBefore;
                else
                    bAfter = 1;
            }
        }
        checkTabIndex(frmi);
        checkAccessKeys(frmi);
        if (typeof frmi.onblur != "function") {
            frmi.onblur = fchange;
        }
        if (typeof frmi.onchange != "function") {
            frmi.onchange = fchange;
        }
        if (typeof frmi.onfocus != "function") {
            if (!isOnClickCancelBubble(frmi) && typeof frmi.onclick == "function")
                frmi.onfocus = focus1;
            else
                frmi.onfocus = focus2;
        }
    }
}
if (window.setKeyEventHandler_ % FormName == null) {
    window.setKeyEventHandler_ % FormName;
    function () {
        if (typeof (baseKey_ % FormName) != "undefined") {
            document.onkeyup = doKeyUp_ % FormName;
            if (baseKey_ % FormName.indexOf("\r") >= 0 || baseKey_ % FormName.indexOf("\x1b") >= 0)
                document.onkeypress = doKeyPress_ % FormName;
        }
        document.onkeydown = doKeyDown_ % FormName;
    }
}
var oTop = null;
var oBottom = null;
if (window.routeKeyEvent == null) {
    window.routeKeyEvent = function (evt) {
        if (!isAltKey(evt) || isCtrlKey(evt))
            return true;
        var key = getKeyCode(evt);
        var keyChar = String.fromCharCode(key);
        if (keyChar == "9" && oTop != null) {
            oTop.focus();
            return false;
        }
        if (key == 220 && oBottom != null) {
            oBottom.focus();
            return false;
        }
        return true;
    };
}
if (window.checkAccessKeys == null) {
    window.checkAccessKeys = function (obj) {
        var attr = obj.getAttribute("PSaccesskey");
        if (attr == "9")
            oTop = obj;
        else if (attr == "\\")
            oBottom = obj;
    };
}
function setFocus_() { }
 % FormName(fldname, indx, oDoc0);
{
    if (isFModeLayout() && isTouchKeyboard())
        return;
    if (isFModeLayout() && (fldname.indexOf("$hdown") != -1 || fldname.indexOf("$srt") != -1)) {
        if (gKeyDownTarget)
            fldname = gKeyDownTarget.id;
        else {
            DoTabbing(null, null, true);
            return;
        }
    }
    gRichTextField = fldname;
    if (typeof CKEDITOR != 'undefined') {
        for (var instanceName in CKEDITOR.instances) {
            if (instanceName == fldname) {
                bRichTextEnabled = 1;
                gRichTextField = fldname;
            }
        }
    }
    if (bRichTextEnabled == 0) {
        var oDoc = null;
        if (!oDoc0 || typeof oDoc0 == "undefined")
            oDoc = document;
        else
            oDoc = oDoc0;
        var obj = null;
        if (oDoc. % FormName) {
            obj = oDoc. % FormName.elements[fldname];
            if (!obj)
                obj = oDoc. % FormName[fldname];
        }
        if (!obj)
            obj = oDoc.getElementById(fldname);
        if (!obj) {
            findFocusableElement(fldname);
            return false;
        }
        if (indx >= 0 && obj.length && indx < obj.length)
            obj = obj[indx];
        if (isFModeLayout())
            expandParent(obj);
        if (!oDoc0 || typeof oDoc0 == "undefined")
            return !tryFocusNew(obj);
        else
            return !tryFocus0New(obj);
    }
}
// Traverse dom for modal popup and find the focusable field
function findFocusableElement(fldname) {
    var currentNode = document.getElementById(document. % FormName.name + "div" + fldname);
    if (currentNode) {
        var element;
        var b = navigator.userAgent.toLowerCase();
        var bIE = browserInfoObj2.isIE;
        var bIE8 = (bIE && b.indexOf("trident/4.0;") != -1) ? 1 : 0;
        if (!bIE8) {
            if (currentNode.parentNode.parentNode.parentNode.parentNode.nodeName == "TABLE") {
                // QuerySelectorAll property works in non IE8 browsers
                var nodeList = currentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll("input, a, textarea");
                if (nodeList) {
                    for (var i = 0; i < nodeList.length; i++) {
                        element = nodeList[i];
                        if (element && element.tabIndex > 0 && element.type != "hidden") {
                            try {
                                tryFocus0New(element);
                                break;
                            }
                            catch (e) {
                                return;
                            }
                        }
                    }
                }
            }
        }
        else {
            // If it is IE8 Browser
            var element;
            for (var i = 0; i < document. % FormName.elements.length; i++) {
                element = document. % FormName.elements[i];
                if (element && element.tabIndex > 0 && element.type != "hidden") {
                    try {
                        tryFocus0New(element);
                        break;
                    }
                    catch (e) {
                        return;
                    }
                }
            }
        }
    }
    return false;
}
//% create tryFocusNew to be called by setFocus_%FormName to avoid regression
function tryFocusNew(obj) {
    if (!tryFocus0New(obj))
        gFocusObj = obj;
    return;
}
//% create tryFocus0New to be called by setFocus_%FormName to avoid regression
function tryFocus0New(obj) {
    if (obj && typeof obj.focus != "undefined" && !obj.disabled && obj.style.visibility != "hidden") {
        var bIE = browserInfoObj2.isIE;
        var bNeedDelay = bIE;
        var tgName = null;
        if (typeof obj.tagName != "undefined")
            tgName = (obj.tagName).toLowerCase();
        var objType = null;
        if (typeof obj.type != "undefined")
            objType = (obj.type).toLowerCase();
        //% for dropdown/input control in IE8 only, use workaround fix
        if (bNeedDelay && tgName != null && objType != null) {
            if (!(tgName.indexOf("select") == 0 || tgName.indexOf("input") == 0 || tgName === "a"))
                bNeedDelay = 0;
            else if (tgName.indexOf("input") == 0) {
                if (!(objType.indexOf("checkbox") == 0 || objType.indexOf("radio") == 0 || objType.indexOf("text") == 0 || objType.indexOf("password") == 0))
                    bNeedDelay = 0;
            }
        }
        //% not need delay or object id is blank
        if (!bNeedDelay || obj.id == "" || tgName == null || objType == null) {
            if (obj.focus) {
                try {
                    obj.focus();
                }
                catch (err) {
                    return true;
                }
            }
            else if (obj.setActive) {
                obj.setActive();
            }
        }
        else {
            MTop().bSetFocusComplete = false;
            setTimeout(function () { delayFocus(obj.id); }, 0);
        }
        if (window.focusHook)
            focusHook(obj);
        var gn = isGridEl(null, obj.id);
        if (gn != null)
            ptGridObj_ % FormName.doScrollOnFocus(gn, obj);
        return false;
    }
    return true;
}
function tryFocus(obj) {
    if (!tryFocus0(obj))
        gFocusObj = obj;
    return;
}
function tryFocus0(obj) {
    if (obj && typeof obj.focus != "undefined" && !obj.disabled && obj.style.visibility != "hidden") {
        if (obj.focus) {
            try {
                obj.focus();
            }
            catch (err) {
                return true;
            }
        }
        else if (obj.setActive)
            obj.setActive();
        if (window.focusHook)
            focusHook(obj);
        var gn = isGridEl(null, obj.id);
        if (gn != null)
            ptGridObj_ % FormName.doScrollOnFocus(gn, obj);
        return false;
    }
    return true;
}
function setFocusSecPageMessage_() { }
 % FormName();
{
    var obj;
    if ((typeof bAccessibility_ % FormName != 'undefined') && (bAccessibility_ % FormName)) {
        obj = document.getElementById("MessageTitle_%FormName");
        if (obj)
            return tryFocus(obj);
    }
    obj = document.getElementById("#ICOK");
    if (obj)
        return tryFocus(obj);
    obj = document.getElementById("#ICYes");
    if (obj)
        return tryFocus(obj);
    obj = document.getElementById("#ICAbort");
    if (obj)
        return tryFocus(obj);
    obj = document.getElementById("#ICRetry");
    if (obj)
        return tryFocus(obj);
}
//% The fuction "delayFocus" is to fix the IE8 browser's focus bug.
function delayFocus(id) {
    if (id == "")
        return;
    var obj = document.getElementById(id);
    var tgName = obj.tagName;
    //% for dropdown/input control, try to put focus on another field first 
    if (tgName.indexOf("SELECT") >= 0) {
        if (objBeforeOrAfterFocusSave)
            try {
                objBeforeOrAfterFocusSave.focus();
            }
            catch (err) { }
    }
    else if (tgName.indexOf("INPUT") >= 0) {
        var idArray = id.split("$");
        var tmp = idArray[0];
        idArray.shift();
        var promptId = tmp.concat("$prompt$", idArray.join());
        var fObject = document.getElementById(promptId);
        var popupId = tmp.concat("$popup");
        var fObject2 = document.getElementById(popupId);
        if (fObject)
            fObject.focus();
        else if (fObject2)
            fObject2.focus();
        else {
            if (objBeforeOrAfterFocusSave) {
                try {
                    objBeforeOrAfterFocusSave.focus();
                }
                catch (err) { }
            }
        }
    }
    //% now put focus on the field that needs the focus
    if (obj.focus) {
        try {
            obj.focus();
        }
        catch (err) { }
    }
    else if (obj.setActive)
        obj.setActive();
    MTop().bSetFocusComplete = true;
}
if (typeof CKEDITOR != 'undefined')
    CKEDITOR.on('instanceReady', function (ev) {
        ev.editor.dataProcessor.writer.setRules('p', {
            indent: false,
            breakBeforeOpen: false,
            breakAfterOpen: false,
            breakBeforeClose: false,
            breakAfterClose: false
        });
        for (var instanceName in CKEDITOR.instances) {
            if (instanceName == gRichTextField) {
                CKEDITOR.instances[instanceName].focus();
            }
        }
    });
function keyPressHandler(e) {
    var kCode = (window.event) ? event.keyCode : e.keyCode; // MSIE or Firefox?
    return kCode;
}
//% used by rich-text editor
function UpdateEditorLinkedField() {
    for (var instanceName in CKEDITOR.instances) {
        if (document.getElementById(instanceName) != null)
            replaceImageSource(instanceName);
    }
}
//% Keep 'WAIT_%FormName' and 'SAVED_%FormName' in view irrespective of user scrolling page around
function positionWAIT_() { }
 % FormName();
{
    var waitobj = null;
    var savedobj = null;
    var objFrame = top.frames['TargetContent'];
    if (objFrame) {
        waitobj = objFrame.document.getElementById("WAIT_%FormName");
        savedobj = objFrame.document.getElementById("SAVED_%FormName");
    }
    else {
        waitobj = document.getElementById("WAIT_%FormName");
        savedobj = document.getElementById("SAVED_%FormName");
    }
    if (waitobj && waitobj.style.display != "none" && waitobj.style.visibility != "hidden")
        keepObjTopRight(waitobj);
    if (savedobj && savedobj.style.display != "none" && savedobj.style.visibility != "hidden")
        keepObjTopRight(savedobj);
}
function isGridEl(evt, objid) {
    if (typeof ptGridObj_ % FormName == "undefined" || !ptGridObj_ % FormName)
        return null;
    if (typeof gridList_ % FormName == "undefined" || typeof gridFieldList_ % FormName == "undefined")
        return null;
    var obj = null;
    var id = '';
    var nRowCnt = 0;
    var idarr = '';
    if (!objid || typeof objid == "undefined") {
        obj = getEventTarget(evt);
        if (!obj || !obj.id)
            return null;
        id = obj.id;
        nRowCnt = 0;
        idarr = id.split("$");
        if (idarr.length < 2)
            return null;
        if (isNaN(idarr[1]))
            nRowCnt = idarr[2];
        else
            nRowCnt = idarr[1];
    }
    else {
        id = objid;
        idarr = id.split("$");
        if (idarr.length < 2)
            return null;
        nRowCnt = idarr[1];
    }
    for (var i = 0; i < gridList_ % FormName.length; i++) {
        var gn = gridList_ % FormName[i][0];
        var gc = document.getElementById('divgc' + gn);
        if (!gc || typeof gc == "undefined")
            continue;
        var gfields = gridFieldList_ % FormName[i];
        for (var j = 0; j < gfields.length; j++) {
            var gfield = gfields[j].replace(/%c/, nRowCnt);
            if (id == gfield)
                return gn;
        }
    }
    return null;
}
//% Retrieve the grid row "TR" tag id of whom the object "oContrl" is a child if there is more than one row in the grid so that it will
//% change the background of the focused row in the grid.  We don't change the row background color if there is only one row in the grid.
function getGridRowID(oContrl) {
    var obj = oContrl;
    var bGrid = false;
    if (!obj)
        return null;
    if (!obj.id)
        return null;
    while (obj && obj.tagName != 'HTML' && obj.tagName != 'FORM') {
        if (obj.tagName == "TD") {
            if (obj.className.indexOf("GRIDROW") != -1 || obj.className.indexOf("GRIDODDROW") != -1 || obj.className.indexOf("GRIDEVENROW") != -1) {
                bGrid = true;
                obj = obj.parentNode;
                continue;
            }
            else
                return null;
        }
        else if (bGrid && (obj.nodeName).indexOf("TR") == 0 && ((obj.id).indexOf("tr") == 0 || (obj.id).indexOf("ftr") == 0)) {
            if (isMoreThanOneGridRow(obj))
                return obj.id;
            else
                return null;
        }
        else
            obj = obj.parentNode;
    }
    return null;
}
//% get next sibling of the element
function getNextSibling(obj) {
    if (!obj)
        return null;
    var oElement = obj.nextSibling;
    while (oElement) {
        if (oElement.nodeType == 1)
            return oElement;
        else
            oElement = oElement.nextSibling;
    }
    return null;
}
//% get previous sibling of the element
function getPrevSibling(obj) {
    if (!obj)
        return null;
    var oElement = obj.previousSibling;
    while (oElement) {
        if (oElement.nodeType == 1)
            return oElement;
        else
            oElement = oElement.previousSibling;
    }
    return null;
}
//% check whether it has more than one grid row
//% Input: oRowObject - grid row object
function isMoreThanOneGridRow(oRowObject) {
    if (!oRowObject)
        return false;
    var nCnt = 1;
    var objNextSib = getNextSibling(oRowObject);
    var objPrevSib = getPrevSibling(oRowObject);
    if (objNextSib && (objNextSib.nodeName).indexOf("TR") == 0 && ((objNextSib.id).indexOf("tr") == 0 || (objNextSib.id).indexOf("ftr") == 0))
        nCnt++;
    if (objPrevSib && (objPrevSib.nodeName).indexOf("TR") == 0 && ((objPrevSib.id).indexOf("tr") == 0 || (objPrevSib.id).indexOf("ftr") == 0))
        nCnt++;
    return (nCnt > 1 ? 1 : 0);
}
function isGridNav(evt) {
    var gn = this.isGridEl(evt);
    if (typeof ptGridObj_ % FormName != "undefined" && ptGridObj_ % FormName && gn != null) {
        evt = (evt) ? evt : ((event) ? event : null);
        var key = getKeyCode(evt);
        if (isShiftKey(evt) && key <= 40 && key >= 37)
            return true;
    }
    return false;
}
//% setup typeahead enabled fields
function initTypeAheadEl(el) {
    var oWin = window;
    var oDoc = document;
    var form = el.form;
    var pId = el.id + "$prompt";
    if (document.getElementById(pId))
        icAction = pId;
    else if (ptCommonObj2.isSearchSearchPage(form))
        icAction = '#ICSrchTypAhd';
    else {
        var nsuffixIndex = el.id.lastIndexOf('$');
        if (nsuffixIndex > -1) {
            var fname = el.id.slice(0, nsuffixIndex);
            var nsuffix = el.id.slice(nsuffixIndex + 1, el.id.length);
        }
        else
            var fname = el.id;
        icAction = fname + "$prompt";
        if (nsuffixIndex > -1)
            icAction += "$" + nsuffix;
    }
    var serverScript = "ptTAObj_%FormName.oWin.pAction_%FormName(ptTAObj_%FormName.oDoc.%FormName,'" + icAction + "');";
    el.obj = oWin.ptTAObj_ % FormName.SetProperties(el, 0, form.ICTypeAheadID, serverScript, true, false, false, true, true, 500); //default search 'Begin with'
}
function removeOccursNum(fname) {
    /**
        Generated field name has the naming notation of recname_fieldname.
        $fieldnum$ and occursnum will be appended when needed.
        form 1 only recname and fieldname: REC_ID
        form 2 field num appended:		   REC_ID$1$
        form 3 field num and occursnum:    REC_ID$1$$0
        form 4 occursnum appened:		   REC_ID$0

        For all these forms, since there is no difference for occursnum
        in Java script behaviour handlers, we remove occursNum
    */
    var i1 = fname.indexOf('$'); //find the first $
    if (i1 < 0)
        return fname;
    if (fname.length == i1 + 1)
        return fname;
    var i2 = fname.indexOf('$', i1 + 1); //find the 2nd $
    if (i2 < 0)
        return fname.substring(0, i1);
    if (fname.length == i2 + 1)
        return fname;
    return fname.substring(0, i2 + 1); //form 3
}
function isTypeAheadEvtTgt(el, kCode) {
    if (el && el.form && !el.form.ICTypeAheadID)
        return false;
    if (typeof kCode != 'undefined') {
        if (!el || el.type != 'text' || (el.value == "" && kCode == 9))
            return false;
    }
    else {
        if (!el || el.type != 'text' || el.value == "")
            return false;
    }
    if (typeof el.obj != 'undefined')
        return true;
    else if (typeof PFieldList_ % FormName != 'undefined' && PFieldList_ % FormName) {
        var fname = removeOccursNum(el.id);
        for (var i = 0; i < PFieldList_ % FormName.length; i++) {
            if (fname == PFieldList_ % FormName[i][0] || el.id == PFieldList_ % FormName[i][0]) {
                initTypeAheadEl(el);
                return true;
            }
        }
    }
    if (ptCommonObj2.isSearchSearchPage(el.form)) {
        if (typeof EFieldList_ % FormName != 'undefined' && EFieldList_ % FormName) {
            for (var i = 0; i < EFieldList_ % FormName.length; i++) {
                if (fname == EFieldList_ % FormName[i][0] || el.id == EFieldList_ % FormName[i][0]) {
                    initTypeAheadEl(el);
                    return true;
                }
            }
        }
    }
    return false;
}
function isTypeAheadEl(evt) {
    var el = getEventTarget(evt);
    var kCode = getKeyCode(evt);
    return isTypeAheadEvtTgt(el, kCode);
}
function isTypeAheadField(id) {
    var el = document.getElementById(id);
    return isTypeAheadEvtTgt(el);
}
function GenerateABN() {
    //% get the main abn container
    var abnContainer = document.getElementById("ptabncontainer");
    if (abnContainer) {
        //% get the app server generated breadcrumbs
        var abnBCContainer = document.getElementById("ptabnbccontainer");
        //% get the app server generated actions folder flyout
        var abnFlyOutContainer = document.getElementById("ptabnfocontainer");
        //% detach the breadcrumb data
        if (abnBCContainer) {
            var abnBCData = abnBCContainer.removeChild(abnBCContainer.firstChild);
            abnBCContainer.parentNode.removeChild(abnBCContainer);
        }
        //% detach the actions folder flyout data
        if (abnFlyOutContainer) {
            var abnFlyOutData = abnFlyOutContainer.parentNode.removeChild(abnFlyOutContainer);
        }
        //% detach the requested node's flyout data
        if (abnContainer) {
            var abnData = abnContainer.removeChild(abnContainer.firstChild);
            abnContainer.parentNode.removeChild(abnContainer);
        }
        try {
            if (!isCrossDomain(parent) && typeof (parent.ptIframe) !== "undefined") {
                if (typeof (parent.pthNav) !== "undefined") {
                    //% update the breadcrumbs
                    parent.pthNav.abn.updateBC(abnBCData, abnFlyOutData);
                    parent.pthNav.abn.addData(abnData);
                }
            }
        }
        catch (e) { }
    }
}
function UpdateBreadCrumbs() {
    bcUpdater.updateBreadCrumbs(document. % FormName);
    bcUpdater.removeRemoteData();
    //% NUI/Classic-MAP-ThirdParty interoperation:  set the cookie when navigating to a component
    backNavigation.setCookie();
    if (!isFModeLayout()) {
        updClassicHistory();
    }
}
//% Application level breadcrumb update
function GetDomData(form, szTC, szActionName) {
    if (typeof bGenDomInfo == 'undefined' || bGenDomInfo == null || !bGenDomInfo)
        return;
    //% Add application level query string params as hidden input params
    var divHiddenFields = document.querySelector("#" + "%FormName" + "divPSHIDDENFIELDS");
    if (typeof refererURL != 'undefined' && refererURL && divHiddenFields) {
        var urlParts = refererURL.split("?");
        if (urlParts.length > 1 && divHiddenFields) {
            var qsStringParams = urlParts[1].split("&");
            for (var i = 0; i < qsStringParams.length; i++) {
                var qsNameValue = qsStringParams[i].split("=");
                //% prevent duplicate input elements
                var inputEl = divHiddenFields.querySelector("#" + qsNameValue[0]);
                if (typeof inputEl == "undefined" || !inputEl) {
                    inputEl = document.createElement("input");
                }
                inputEl.setAttribute("type", "hidden");
                inputEl.setAttribute("name", qsNameValue[0]);
                inputEl.setAttribute("id", qsNameValue[0]);
                inputEl.setAttribute("value", qsNameValue[1]);
                divHiddenFields.appendChild(inputEl);
            }
        }
    }
    form.target = szTC;
    form.ICAction.value = szActionName;
    submitAction_ % FormName(form, szActionName);
}
function GenerateFakeBC() {
    //% get the fake bc container
    var bcContainer;
    try {
        if (top.frames['TargetContent'] && top.frames['TargetContent'].document)
            bcContainer = top.frames['TargetContent'].document.getElementById("pt_fakeBC");
    }
    catch (e) { }
    if (bcContainer) {
        //% detach the breadcrumb data
        var abnBCData = bcContainer.removeChild(bcContainer.firstChild);
        bcContainer.parentNode.removeChild(bcContainer);
        try {
            if (!isCrossDomain(parent) && typeof (parent.ptIframe) !== "undefined") {
                if (typeof (parent.pthNav) !== "undefined") {
                    //% update the breadcrumbs
                    parent.pthNav.FakeBCUpdate(abnBCData);
                }
            }
        }
        catch (e) { }
        return;
    }
}
//% updates the breadcrumbs with ptf specific data attributes. called from onload()
function bcUpdateForPTF() {
    try {
        var dn = top.document.domain; //% cross domain check           
        try {
            if (typeof (top.pthNav) !== "undefined") {
                top.pthNav.doBCUpdateForPTF();
            }
        }
        catch (ex2) { }
    }
    catch (ex1) { }
}
function preSubmitWorkCenter_() { }
 % FormName(arg1, arg2);
{
    var isWorkCenter = top.document.getElementById('ptalPgltAreaFrame');
    if (!isWorkCenter || !arg1) {
        return true;
    }
    if (parent.ptIframe)
        return preSubmitCheckWorkCenter_ % FormName(arg1, arg2, true);
}
function preSubmitCheckWorkCenter_() { }
 % FormName(arg1, arg2, bPtreplace);
{
    if (bPtreplace) {
        if (browserInfoObj2.isIE) {
            if (arg1 != null && typeof arg1.document != "undefined")
                curAnchorObj = arg1.document.getElementById(arg2);
        }
        else {
            if (arg1 != null && typeof arg1.ownerDocument != "undefined")
                curAnchorObj = arg1.ownerDocument.getElementById(arg2);
        }
        if ((typeof curAnchorObj === 'undefined') || !curAnchorObj)
            return true;
        var anchorType = curAnchorObj.getAttribute("ptlinktgt");
        if (anchorType == null)
            return true;
        if ((anchorType) && (anchorType !== 'pt_replace'))
            return true;
    }
    if (parent.ptIframe.isWorkCenterDirty()) {
        var cancelFn = function (arg1, arg2) {
            var tgtFrameForm = top.frames['TargetContent'].document.forms[0];
            if (tgtFrameForm && (tgtFrameForm.ICChanged))
                tgtFrameForm.ICChanged.value = '-1';
            submitAction_ % FormName(arg1, arg2);
            return;
        };
        if (parent.ptIframe.saveWarningForWorkCenter(cancelFn, null, 1, arg1, arg2))
            return false;
    }
    return true;
}
function preSubmitProcessSpellcheck_() { }
 % FormName(form, name);
{
    var spellcheckobj = document.getElementById('SPELLCHECKSTRING');
    if (spellcheckobj && spellcheckobj != 'undefined' && RTEspellcheck == true) {
        var spellcheckstring = spellcheckobj.value;
        if (name == "#ICOK" || name == "#ICCANCEL")
            spellcheckobj.value = ReplaceRTESpellSpaces(spellcheckstring);
    }
}
function preSubmitProcessCKEDITOR_() { }
 % FormName(form, name);
{
    if (typeof CKEDITOR != 'undefined')
        UpdateEditorLinkedField();
}
function preSubmitProcess_() { }
 % FormName(form, name);
{
    if ((name.indexOf('$delete') > 0 || name.indexOf('$srt') > 0) && typeof (preID_ % FormName) != 'undefined' && preID_ % FormName != null)
        preID_ % FormName;
    null; //for grid row highlight
    if (form == null) {
        form = document.forms['%FormName'];
        form.style.display = 'block';
    }
    preSubmitProcessSpellcheck_ % FormName(form, name);
    preSubmitProcessCKEDITOR_ % FormName(form, name);
    //For bcupdate, set the cref clicked flag to indicate that the user
    //has performed an action on the PIA page when in SSO env.
    //The action may or may not require a bc update.  This flag is removed when no longer needed.
    if (!isFModeLayout()) {
        if (typeof bcUpdater.getStoredData(bcUpdater.isMenuCrefNav) == 'undefined' || bcUpdater.getStoredData(bcUpdater.isMenuCrefNav) == null) {
            name == "#GetDomInfo" ? bcUpdater.setStoredData(bcUpdater.isMenuCrefNav, "N") : bcUpdater.setStoredData(bcUpdater.isMenuCrefNav, "P");
        }
    }
}
function isLoaderInProcess() {
    if (loader != null && loader.GetInProcess())
        return true;
    return false;
}
function aAction0_() { }
 % FormName(form, name, params, bAjax, bPrompt);
{
    if (isFModeLayout() && isPopupRequest(form, name))
        return;
    //% Do not submit #ICCancel action when pressing ESC on a search page.
    if (typeof bSearchDialog_ % FormName != 'undefined' && !bDoModal_ % FormName && bSearchDialog_ % FormName && form.ICAction.value.indexOf("\x1b") >= 0) {
        processing_ % FormName(0, 3000);
        return;
    }
    //% if the previous request is a hyperlink request from the same form and is still being processed, return.
    if (loader != null && loader.GetInProcess2() && loader.formname != null && form.name != null && loader.formname == form.name)
        return;
    //% When clicking SAVE button causes field onchange and onclick on SAVE button, put "SAVE" request in the quene to be processed later.
    //% add request to the waiting queue if requested by a different form than where in-progress request is from
    if (loader != null && loader.GetInProcess()) {
        if ((loader.GetWaitingICAction() == "" && loader.GetInProcessICActionValue() != name && name == "#ICSave") ||
            (loader.formname != null && form.name != null && loader.formname != form.name))
            loader.SetWaitingObject(form, name, params, bAjax, bPrompt);
        return;
    }
    if (typeof ptGridObj_ % FormName != 'undefined' && ptGridObj_ % FormName)
        ptGridObj_ % FormName.saveScrollPos();
    form.ICResubmit.value = nResubmit;
    form.ICAction.value = name;
    form.ICXPos.value = ptCommonObj2.getScrollX();
    form.ICYPos.value = ptCommonObj2.getScrollY();
    //% Generate advanced search label for the bc from the search criteria
    bcUpdater.getAdvSrchLblFrmCriteria(name, form);
    //% backup waiting object list if there is any
    var waitingObjList = null;
    if (loader != null && loader.GetWaitingICAction() != "")
        waitingObjList = loader.GetWaitingObjectList();
    if (typeof bAjax != "undefined" && !bAjax && (typeof params == "undefined" || params == null || params == "") && (typeof popupObj_ % FormName.isModalWidget == "undefined" || !popupObj_ % FormName.isModalWidget))
        form.submit();
    else if (typeof params == "undefined" || !params)
        loader = new net2.ContentLoader(postUrl_ % FormName, form, name, null, null, null, null, null, bAjax, bPrompt);
    else
        loader = new net2.ContentLoader(postUrl_ % FormName, form, name, null, null, null, params, null, bAjax, bPrompt);
    if (waitingObjList != null)
        loader.WaitingObjQueue = waitingObjList;
}
function pAction_() { }
 % FormName(form, name, efieldname);
{
    if (typeof CKEDITOR != 'undefined')
        UpdateEditorLinkedField();
    if ((loader != null) && (loader.GetInProcess()))
        return;
    form.ICAction.value = name;
    form.ICXPos.value = ptCommonObj2.getScrollX();
    form.ICYPos.value = ptCommonObj2.getScrollY();
    if (typeof form.ICTypeAheadID != 'undefined' && form.ICTypeAheadID.value != '') {
        //% update iwc event when typeahead starts
        if (pm)
            pm.updateTypeaheadMsgEvent(name);
        var flag = form.ICActionPrompt.value;
        form.ICActionPrompt.value = 'false';
        var ret = aAction_ % FormName(form, name, "", true, 1);
        form.ICActionPrompt.value = flag;
        return ret;
    }
    else {
        //% update iwc event when prompt lookup is selected
        if (pm)
            pm.updatePromptMsgEvent(name);
        form.ICActionPrompt.value = 'true';
        return aAction_ % FormName(form, name, "", true, true);
    }
}
function mAction_() { }
 % FormName(form, name, height, width, title, bModalElement, bSizeOnLoad);
{
    form.ICAction.value = name;
    form.ICXPos.value = ptCommonObj2.getScrollX();
    form.ICYPos.value = ptCommonObj2.getScrollY();
    aAction_ % FormName(form, name, null, true, false);
}
/* fluid search page */
function changeKeyList_() { }
 % FormName(obj, form, name, params);
{
    aAction_ % FormName(form, name, params);
    var searchObj = document.getElementById('PT_SEARCH');
    addClass(searchObj, 'side');
    addClose(searchObj);
    SetSearchStatus(obj, form);
}
/* fluid prompt page */
function updateFromPrompt_() { }
 % FormName(obj, form, name, params);
{
    aAction_ % FormName(form, name, params);
}
function updateFromInPrompt_() { }
 % FormName(obj, form, name, params);
{
    var res = [];
    var arr1 = document.querySelectorAll(".ps_prompt-resultsgrid .ps_grid-body .psc_on");
    for (var i = 0; i < arr1.length; i++)
        res.push(arr1[i].parentElement.parentElement.parentElement.querySelector(".ps_box-value").firstChild.nodeValue);
    var objHidden = document.getElementById("PT_WORK_PT_PROMPT_TEMP_IN");
    objHidden.value = res.join(",");
    addchg_ % FormName(objHidden);
    aAction_ % FormName(form, name, params);
}
//new modal
function doModalURL(url, options) {
    var moptions = 'bCrossDomain@1;bPIA@0;bClose@1;bCenter@1;sTitle@Page Title;';
    if (ptConsole2.isActive() && !bPerf)
        ptConsole2.append((new Date()).valueOf() + "doModalURL url:\n" + url + "\n");
    moptions += options;
    window.modWin = showModalDialog_pt(url, window, moptions);
}
function doModeless(url, options) {
    var moptions = 'bModeless@1;bPIA@1;closeUrl@' + modalCloseUrl + ';closeAlt@' + modalCloseAlt + ';resizeUrl@' + modalResizeUrl + ';resizeAlt@' + modalResizeAlt + ';moveAlt@' + modalMoveAlt + ';';
    if (options == -1 || options.indexOf("bCrossDomain@1") == -1) {
        if (url.indexOf('?') == -1)
            url += '?ICDoModeless=1';
        else
            url += '&ICDoModeless=1';
    }
    if (ptConsole2.isActive() && !bPerf)
        ptConsole2.append((new Date()).valueOf() + "modeless url:\n" + url + "\n");
    if (typeof MTop().window.modLessWinArr == 'undefined')
        MTop().window.modLessWinArr = new Array();
    moptions += options;
    window.modLessWin = showModalDialog_pt(url, window, moptions);
    function checkForReadiness() {
        if (window.modLessWin && window.modLessWin.contentWindow) {
            try {
                if (window.modLessWin.contentWindow.document.readyState == "complete") {
                    setModWinID = setModlessWinParent();
                    return;
                }
                setTimeout(checkForReadiness, 1000);
            }
            catch (err) {
                setTimeout(checkForReadiness, 1000);
            }
        }
    }
    setTimeout(checkForReadiness, 1000);
    try {
        MTop().window.modLessWinArr.push(window.modLessWin);
    }
    catch (e) {
    }
}
/*function setModlessWinParent() {
    setModWinParent(window.modLessWin);
}*/
function doTransfer(url) {
    loader2 = new net2.ContentLoader(url, null, null, 'GET');
}
function doModlessOnLoad_() { }
 % FormName();
{
    if (window.name.length == 0)
        window.name = "%FormName";
    document. % FormName.target;
    window.name;
}
function doModal(url, bPrompt, oParentWin, sCancelName, form, name, sPopupOptions, sResponseHTML) {
    if (typeof (oParentWin.modWin) != 'undefined' && oParentWin.modWin != null) {
        closeModal(oParentWin.modWin.modalID);
        oParentWin.modWin = null;
    }
    var options = 'bPIA@1;';
    var bPopup = 0;
    if (isFModeLayout()) {
        var sOptionsDefault = "bCenter@1;bAutoClose@0;bHeader@0;";
        options += sOptionsDefault;
        if (sPopupOptions) {
            if (sPopupOptions.length > 0 && sPopupOptions.indexOf("bCenter") == -1 && sPopupOptions.indexOf("sPopupParentId") == -1 && sPopupOptions.indexOf("sPopupParentQS") == -1)
                options += "bPopup@1;sPopupParentId@" + name + ";";
            options += sPopupOptions;
        }
        bPopup = 1;
    }
    if (!bPopup)
        options += 'closeUrl@' + modalCloseUrl + ';closeAlt@' + modalCloseAlt + ';resizeUrl@' + modalResizeUrl + ';resizeAlt@' + modalResizeAlt + ';moveAlt@' + modalMoveAlt + ';';
    if (bPrompt == 1) {
        options += "bClose@1;";
    }
    if (typeof sCancelName != "undefined" && sCancelName != null && sCancelName.length > 0) {
        if (isFModeLayout())
            options += 'sCancelName@' + sCancelName + ';';
        else
            options += 'bClose@1;sCancelName@' + sCancelName + ';';
    }
    var nWaitMSec = 1000;
    var bWriteReponse = false;
    if (isFModeLayout() && !browserInfoObj2.isIE && typeof sResponseHTML != "undefined")
        bWriteReponse = true;
    if (bWriteReponse)
        url = "about:blank";
    else {
        if (ptConsole2.isActive() && !bPerf)
            ptConsole2.append((new Date()).valueOf() + "modal url:\n" + url + "\n");
    }
    window.modWin = showModalDialog_pt(url, window, options, null, null, form, name);
    if (bWriteReponse) {
        nWaitMSec = 50;
        window.modWin.contentDocument.write(sResponseHTML);
        setModWinID = setModWinParentPIA();
    }
    function isModalReady() {
        if (bWriteReponse) {
            try {
                if (typeof window.modWin.bLoadCompleted != "undefined" && window.modWin.bLoadCompleted) {
                    window.modWin.onLoadExt_ % FormName();
                    return;
                }
                setTimeout(isModalReady, nWaitMSec);
            }
            catch (err) {
                setTimeout(isModalReady, nWaitMSec);
            }
        }
        else if (window.modWin && window.modWin.contentWindow) {
            try {
                if (window.modWin.contentWindow.document.readyState == "complete") {
                    setModWinID = setModWinParentPIA();
                    return;
                }
                setTimeout(isModalReady, nWaitMSec);
            }
            catch (err) {
                setTimeout(isModalReady, nWaitMSec);
            }
        }
    }
    setTimeout(isModalReady, nWaitMSec);
}
function setWinParent_() { }
 % FormName();
{
    // ptCommonObj2.showPopupMask(window,'pt_modalMaskCover');
}
function setModWinParentPIA() {
    if (setModWinParent())
        document. % FormName.ICResubmit.value;
    0;
}
function doCancelMsg() {
    aAction_ % FormName(document. % FormName, '#ICCancel');
}
function isModalCancel(name) {
    if (window.modalID) {
        if (name.indexOf(getCancelId(window.modalID)) != -1)
            return true;
    }
}
function getCancelId(modid) {
    var modObj = MTop().document.getElementById("ptMod_" + modid);
    if (modObj.sCancelName.length > 0)
        return modObj.sCancelName;
    var sCloseId = '#ICCancel';
    if (!document.getElementById(sCloseId) && document.getElementById("#ICReturn"))
        sCloseId = '#ICReturn';
    return sCloseId;
}
function doCancel(sCancelName) {
    var sCloseId = '';
    if (typeof sCancelName != 'undefined' && sCancelName.length > 0)
        sCloseId = sCancelName;
    else {
        sCloseId = '#ICCancel';
        /* if (!document.getElementById(sCloseId) && document.getElementById("#ICReturn"))
             sCloseId = '#ICReturn';*/ //not support currently from zoom control
    }
    if (typeof window.bMFormSubmit != 'undefined') {
        if (!window.bMFormSubmit)
            document. % FormName.ICAction.value;
        "None";
        {
            winParent.modWinClosed = null;
            return;
        }
    }
    if (browserInfoObj2.isIE && typeof window.modWin != 'undefined' && window.modWin != null) {
        var win = window.modWin;
        if (win.document) {
            var fm = win.document. % FormName;
            if (!fm)
                fm = window.document. % FormName;
            fm.ICAction.value = sCloseId;
            document. % FormName.ICAction.value;
            "None";
        }
    }
    try {
        document. % FormName.target;
        winParent.name;
        if (document. % FormName.ICAction.value != "None")
            return;
        if (typeof window.bMFormSubmit != 'undefined')
            winParent.modWinClosed = null;
        winParent.nResubmit = 0;
        if (window.document. % FormName.enctype.indexOf('multipart') != -1 && typeof window.bMFormSubmit != 'undefined' && !window.bMFormSubmit) {
            winParent.document. % FormName.ICAction.value;
            "None";
            winParent.MTop().ptCommonObj2.hidePopupMask();
            closeModal(modalID);
        }
        else if (sCloseId != "#ICCancel")
            aAction_ % FormName(document. % FormName, sCloseId);
        else {
            var modObj = MTop().document.getElementById(MTop().PTMOD_ + modalID);
            if ((typeof modObj != 'undefined') && modObj && modObj.bRCFModal &&
                (typeof (winParent.aAction_ % FormName) == 'undefined')) {
                try {
                    closeModal(modalID);
                }
                catch (err) { }
                if (typeof window.modWin != 'undefined')
                    window.modWin = null;
                if (typeof winParent != 'undefined' && typeof winParent.modWin != 'undefined')
                    winParent.modWin = null;
            }
            else
                winParent.aAction_ % FormName(document. % FormName, sCloseId);
        }
        if (winParent.winParent)
            ptCommonObj2.hidePopupMask(winParent);
        else
            ptCommonObj2.hidePopupMask(MTop());
    }
    catch (err) {
        closeModal();
    }
}
function closeModWin_() { }
 % FormName();
{
    if ((typeof window.modWinClosed != 'undefined') && window.modWinClosed) {
        window.modWin = null;
        window.modWinClosed = false;
        return;
    }
    if (window.modWin) {
        try {
            window.modWin.document. % FormName.ICAction.value;
            '#ICCancel';
            closeModal(window.modWin.modalID);
        }
        catch (err) {
        }
    }
    window.modWin = null;
}
function onParentUnload_() { }
 % FormName();
{
    if ((typeof window.modWin != 'undefined') && window.modWin)
        closeModWin_ % FormName();
}
function doModalOnLoad_() { }
 % FormName(bStartUp, bFileDetach, bNoParent);
{
    if (isFModeLayout() && bNoParent) {
        window.bDoModal = true;
        return;
    }
    mTop = MTop(); // top window
    try {
        if (!mTop || typeof mTop.oParentWin == 'undefined' || !mTop.oParentWin)
            return;
    }
    catch (err) {
        return;
    }
    if (bStartUp || bFileDetach) {
        winParent = mTop.oParentWin;
        dialogArguments = mTop.oParentWin;
        modalID = mTop.modId;
        window.name = "modWin_" + mTop.modId;
        if (bStartUp) {
            if (modalZoomName != null) {
                var zObj = winParent.document.getElementById(modalZoomName);
                if (zObj)
                    zObj.style.display = 'none';
            }
            if ((mTop.modlessId == -1 || mTop.modlessId != mTop.modId)
                && typeof winParent.document. % FormName != 'undefined')
                winParent.processing_ % FormName(0, 3000);
            resizeModalDialog_pt(modalID);
        }
    }
    else if (modalID != null) {
        if (modalZoomName != null) {
            var zObj = document.getElementById(modalZoomName);
            if (zObj && zObj.innerHTML.indexOf("CKEDITOR") == -1) {
                var modObj = MTop().document.getElementById(MTop().PTMOD_ + modalID);
                resizeZoomGrid(modalZoomName, ptCommonObj2.getWidth(modObj), ptCommonObj2.getHeight(modObj));
            }
        }
        resizeModalDialog_pt(modalID, true);
    }
    if (window.document. % FormName.enctype.indexOf('multipart') != -1)
        window.bMFormSubmit = false;
}
function doUpdateParent(form, name) {
    if (typeof winParent == 'undefined' || winParent == null) {
        submitAction_ % FormName(document. % FormName, name);
        return;
    }
    if (winParent.bDefer && name.indexOf("#ICCancel") != -1 && bPromptPage_ % FormName) {
        winParent.bCleanHtml = false;
        winParent.loader = null;
        winParent.document. % FormName.ICStateNum.value;
        document. % FormName.ICStateNum.value;
        winParent.aAction_ % FormName(winParent.document. % FormName, '#ICCancel');
        var cObj = winParent.document.getElementById("pt_modals");
        if (cObj)
            cObj.style.display = "none";
    }
    else {
        processing_ % FormName(1, 3000);
        form.target = winParent.name;
        form.ICAction.value = name;
        if (typeof CKEDITOR != 'undefined')
            UpdateEditorLinkedField();
        winParent.loader = null;
        if (pm)
            pm.updateParentMsgData(winParent, name); //% set delayed iwc event in parent window
        winParent.aAction_ % FormName(form, name);
    }
}
function doModalMFormSubmit_() { }
 % FormName(form, name);
{
    if (name.indexOf("#ICCancel") != -1) {
        winParent.bCleanHtml = false;
        winParent.loader = null;
        winParent.document. % FormName.ICStateNum.value;
        document. % FormName.ICStateNum.value;
        winParent.aAction_ % FormName(winParent.document. % FormName, '#ICCancel');
        window.winParent.modWin = null;
        closeModal(window.modalID);
        return;
    }
    window.bMFormSubmit = true;
    submitAction_ % FormName(form, name);
    doModalMFormClose_ % FormName();
}
function doModalMFormClose_() { }
 % FormName();
{
    winParent.bUpLoadProgress = true;
    winParent.nResubmit = 1;
    winParent.document. % FormName.ICStateNum.value;
    document. % FormName.ICStateNum.value;
    winParent.loader = null;
    winParent.aAction_ % FormName(winParent.document. % FormName, 'Resubmit');
    if (typeof window.winParent != 'undefined' && window.winParent.winParent != null)
        ptCommonObj2.hideParModalMask(window.winParent);
    else
        ptCommonObj2.hidePopupMask(MTop());
    hideModal(window.modalID);
}
function doUpdateFirstParent(form, name, firstParent) {
    form.target = firstParent.name;
    form.ICAction.value = name;
    if (typeof CKEDITOR != 'undefined')
        UpdateEditorLinkedField();
    firstParent.loader = null;
    firstParent.aAction_ % FormName(form, name);
    if (typeof window.winParent != 'undefined' && window.winParent.winParent != null)
        ptCommonObj2.hidePopupMask(window.winParent);
    else
        ptCommonObj2.hidePopupMask(MTop());
    hideModal(window.modalID);
}
function resizeZoomGrid(id, w, h) {
    if (typeof gridList_ % FormName == 'undefined')
        return;
    var nMinHeight = 140; //% default minimum height for grid zoom
    var exp = "%FormName" + "div"; //% assuming that the overall grid content id is always %FormNamedivgName$index
    var gNameParts = id.split(exp);
    var gToolBar = "%FormName" + "divG" + gNameParts[1];
    var gSParts = gNameParts[1].split("$");
    var gName = gSParts[0];
    var gSID = gSParts[0] + "$scrolli$" + gSParts[1];
    var gNavBar = exp + gSParts[0] + "GP$" + gSParts[1]; //% grid navigation top bar
    var gScrollAreaID = "divgbr" + gNameParts[1]; //% assuming that divgbrgName$index is the unfrozen area of the scrollable grid - right side
    var gScrollAreaHdrID = "divghrc" + gNameParts[1];
    var gFrozenAreaID = "divgbl" + gNameParts[1]; //% assuming that divgblgName$index is the frozen area of the scrollable grid - left side
    var mRight = document.getElementById(gScrollAreaID);
    var mRightHdr = document.getElementById(gScrollAreaHdrID);
    var bIsVSVisible = false;
    if (mRight && mRightHdr) {
        oColHeader = mRightHdr.children[0].children[0].children[0].children[0];
        oLastColHeader = oColHeader.children[oColHeader.children.length - 1];
        if (oLastColHeader.children[0].tagName == 'SPAN' && (oLastColHeader.children[0].innerHTML == '<NOBR>&nbsp;</NOBR>') || (oLastColHeader.children[0].innerHTML == '<nobr>&nbsp;</nobr>'))
            bIsVSVisible = true;
    }
    if (!bIsVSVisible)
        return;
    if (mRight && mRightHdr) {
        var nMaxBodyHeight = mRight.children[0].offsetHeight; // grid unfrozen area data rows' new height
        if (browserInfoObj2.isIE)
            nMaxBodyHeight = nMaxBodyHeight - 5;
        if (nMaxBodyHeight < 140)
            nMinHeight = nMaxBodyHeight;
        if (browserInfoObj2.isSafari)
            nMaxBodyHeight = mRight.offsetHeight;
        var nHdrHeight = mRightHdr.offsetHeight;
        var nOthHeight = 150;
        var nMaxTmpHeight = h - nOthHeight;
        var nMaxHeight = nMinHeight;
        if (nMaxTmpHeight > 0 && nMaxTmpHeight < nMaxBodyHeight && nMaxTmpHeight > nMinHeight)
            nMaxHeight = nMaxTmpHeight;
        else if (nMaxTmpHeight > nMaxBodyHeight)
            nMaxHeight = nMaxBodyHeight;
        var oS = null;
        var nGridNewHeight = 0;
        //% Get the whole grid element.  Due to duplicate element ids, we need to pick the right grid element.
        //% If there are two identical element ids, get the 2nd element.  Else, get the 1st one.
        var oS1 = document.getElementById(gSID); //% grid table id, e.g. QE_ABSENCE_HIST$scrolli$0
        if (oS1 == null) {
            gSID = gSParts[0] + "$scrollm$" + gSParts[1];
            oS1 = document.getElementById(gSID);
            if (oS1 == null) {
                gSID = gSParts[0] + "$scroll$" + gSParts[1];
                oS1 = document.getElementById(gSID);
                if (oS1 == null)
                    return;
            }
        }
        oS1.id = gSID + "zzzz"; //% rename the id temporarily so that we can get the 2nd element with the same id
        oS = document.getElementById(gSID);
        if (!oS)
            oS = oS1;
        oS1.id = gSID; //% restore the id
        nGridNewHeight = oS.offsetHeight + nMaxHeight - ptCommonObj2.getPixValue(mRight.style.height);
        mRight.style.height = nMaxHeight + 'px'; //% grid unfrozen area data rows height
        if (browserInfoObj2.isIE)
            oS.style.height = nGridNewHeight + 'px'; //% Set the whole grid height
        else if (browserInfoObj2.isSafari)
            oS.style.height = nGridNewHeight + 'px'; //% Set the whole grid height
        else {
            oS.style.height = nGridNewHeight + 6 + 'px'; //% Set the whole grid height
            var oTabElm = document.getElementById("tblpstabs"); //% grid tab row table element
            var oTabTd = document.querySelector('td.PSGRIDTABBACKGROUND');
            if (oTabElm && oTabTd)
                oTabTd.style.height = oTabElm.offsetHeight + 'px';
            var oNavElm = document.getElementById(gNavBar);
            if (oNavElm)
                oNavElm.parentNode.style.height = oNavElm.offsetHeight + 'px';
        }
    }
    var mLeft = document.getElementById(gFrozenAreaID); //% frozen area of the grid
    if (mLeft)
        mLeft.style.height = (mRight.offsetHeight) + 'px';
    var mToolBar = document.getElementById(gToolBar);
    if (mToolBar)
        mToolBar.style.width = (mLeft.offsetWidth + mRight.offsetWidth) + 'px';
}
function AgPostMessage() {
    var iframes = parent.parent.document.getElementsByTagName('iframe');
    for (i = 0; i < iframes.length; i++) {
        // test if the iframe 'popup or target' exists
        if (/ptalPgltAreaFrame/.test(iframes[i].id)) {
            try {
                if (top.ptaiAguide.ptaiPostProc != null && top.ptaiAguide.ptaiPostProc) {
                    pm.postMessage(top.ptaiAguide.ptaiItemId + ",save", ((iframes[i].contentWindow.document) ? iframes[i].contentWindow.document : iframes[i].contentDocument).location.href, iframes[i].contentWindow);
                }
                else {
                    if (top.ptaiAguide.ptaiSaveNextBtnId != null && top.ptaiAguide.ptaiSaveNextBtnId && top.ptaiAguide.ptaiButtonAction != null && top.ptaiAguide.ptaiButtonAction == 'next') {
                        top.ptaiAguide.ptaiButtonAction = "";
                        pm.postMessage(top.ptaiAguide.ptaiItemId + ",next" + "," + top.ptaiAguide.ptaiListId, ((iframes[i].contentWindow.document) ? iframes[i].contentWindow.document : iframes[i].contentDocument).location.href, iframes[i].contentWindow);
                    }
                }
            }
            catch (e) {
                alert(e);
            }
        }
    }
}
function goToServer_Ch(strCntr) {
    strCntr += "A";
    submitAction_ % FormName(document. % FormName, strCntr);
}
//% the following related content functions: ResetGlyph_%FormName() and
//% and setPageletInfoInCtxmenu_%FormName(), along with the global variables
//% are put here so these functions are always defined when onload is run
var bIsPagelet_ =  % FormName;
"false", sPageletName_ % FormName;
"";
ResetGlyph_ % FormName;
function () {
    if (typeof (sGlyphList_ % FormName) !== "undefined" && sGlyphList_ % FormName !== "") {
        HideGlyph(sGlyphList_ % FormName);
    }
}
setPageletInfoInCtxmenu_ % FormName;
function (isPagelet, sPgltName) {
    bIsPagelet_ % FormName;
    (isPagelet === "false") ? "false" : "true";
    sPageletName_ % FormName;
    (typeof (sPgltName) !== "undefined" && sPgltName && sPgltName !== "") ? sPgltName : "";
}
//% type ahead initialization
window.PT_typeahead = function () { };
PT_typeahead.prototype = {
    init: function (oWin, oDoc, oForm, url_up, url_dn, url_close, nDelayTime) {
        this.oWin = oWin;
        this.oDoc = oDoc;
        this.oForm = oForm;
        this.url_up = url_up;
        this.url_dn = url_dn;
        this.url_close = url_close;
        this.arrOptions = new Array(); //% result data
        this.arrHeaders = new Array(); //% result header 
        this.arrMatches = new Array(); //% matched data
        this.strLastValue = "";
        this.bMadeRequest;
        this.theTextBox = null;
        this.objLastActive;
        this.currentValueSelected = -2;
        this.bNoResults = false;
        this.nDelayTime = nDelayTime;
        this.isDelayTiming = true;
        this.isTiming = true;
        this.isOpera = (navigator.userAgent.toLowerCase().indexOf('opera') != -1);
        this.countForId = 0;
        this.currentTotalRow = 0; //% 789561
        this.startPos = 0;
        this.maxRange = 3; //% number of items to be displayed in the typeahead list per page
        this.ndisplay = 1; //% 1 - display below the typeahead item; 0 - display above the typeahead item
        this.bScrolldownImage = 0; //% 1- scrolldown image tag included; 0 - no scrolldown image tag included
        this.bStartNewList = 0; //% 1 - start a new typeahead list; 0 - NOT start a new typeahead list 
        this.promptWidth = 0;
        this.opValue = -1;
        this.bodyScrollTop = 0;
        this.bodyScrollLeft = 0;
        this.noMatchingDataMessage = "%Message(124,38, No matching values were found)";
        if (isFModeLayout()) {
            this.undeStart = "<span class='psc_strong'>";
            this.undeEnd = "</span>";
            this.selectSpanStart = "<span class='ps_box-value' ";
            this.selectSpanEnd = '</span>';
            this.tableStart = "<table class='ps_grid-flex ps_grid-typeahead psc_grid-highlightrow'>";
            this.tableEnd = "</table>";
            this.trHStart = "<tr class='ps_grid-head-row'>";
            this.trStart = "<tr class='ps_grid-row'>";
            this.trEnd = "</tr>";
            this.tdStart = "<td class='ps_grid-cell'>";
            this.tdEnd = "</td>";
            this.thStart = "<th scope='col' class='ps_grid-col'><div class='ps_box_grid-col'>";
            this.thEnd = "</div></th>";
        }
        else {
            this.undeStart = "<span class='spanMatchText'>";
            this.undeEnd = "</span>";
            this.selectSpanStart = "<span style='width:100%;display:block' class='spanNormalElement' onmouseover='ptTAObj_%FormName.SetHighColor(this)' ";
            this.selectSpanEnd = '</span>';
            this.tableStart = "<table class='PSSRCHRESULTSTITLE' id='ttable' dir=\'" + '%direction' + "' cellpadding='1' cellspacing='0'>";
            this.tableEnd = "</table>";
            this.trStart = "<tr align=\'" + '%AlignStart' + "\'>";
            this.trEnd = "</tr>";
            this.tdScrollStart = "<td class='PSSRCHRESULTSEVENROW' align='center' colspan='";
            this.tdODDStart = "<td class='PSSRCHRESULTSODDROW' nowrap='nowrap'>";
            this.tdEVENStart = "<td class='PSSRCHRESULTSEVENROW' nowrap='nowrap'>";
            this.tdEnd = "</td>";
            this.thStart = "<th scope='col' class='PSTARESULTSHDR' nowrap='nowrap'><span class='PSTARESULTSHDR'>";
            this.thEnd = "</span></th>";
            this.header = "<tr align=\'" + '%AlignStart' + "\'><th scope='col' class='PSTARESULTSHDR' ><span class='PSTARESULTSHDRR' name='#ICSortCol0'>User ID</span></th><th scope='col' class='PSTARESULTSHDR' ><span class='PSTARESULTSHDR' name='#ICSortCol1'>Description</span></th></tr>";
        }
        this.bTabPressed = false;
        this.bKeyUp = false;
        this.bKeyDown = false;
        this.UnsupportedKeycode = '[?)(|}{]'; //% Keycodes not supported
        this.SpecialKeycode = '*+'; //% supported special character(s)
        this.bFoundSpecialKeycode = false; //% flag to indicate special key code
        this.lastIntKey = -1;
        this.bGrabHighlighted = false; //% flag to indicate data is selected via key up/down from resulted window 
        this.typeAheadProcessedValue = ""; //% type ahead field value just processed
        this.currentTypeAheadField = ""; //% current type ahead field
        this.bStaledResult = false; //% flag to indicate if the typeahead result is staled
        this.bLostFocus = true; //% typeahead field focus status flag. True if focus is lost.
        this.bInProcess = false;
        //% Keycode
        this.BACKSPACE = 8;
        this.TAB = 9;
        this.ENTER = 13;
        this.SHIFT = 16;
        this.CTRL = 17;
        this.ALT = 18;
        this.CAPLOCK = 20;
        this.ESCAPE = 27;
        this.END = 35;
        this.LEFTARROW = 37;
        this.UPARROW = 38;
        this.RIGHTARROW = 39;
        this.DOWNARROW = 40;
        this.EQUALSIGN = 187;
        this.FORWARDSLASH = 191;
        this.OPENBRACKET = 219;
        this.BACKSLASH = 220;
        this.CLOSEBRACKET = 221;
        var ptObj = oDoc.getElementById("pt_typeahead0");
        if (ptObj)
            ptObj.style.display = 'none';
        //% ptConsole2.enable();
    }
};
var ptTAObj_ =  % FormName;
new PT_typeahead();
function CreateRCMenu4PVG(sPvtGridName, nContext, nLeft, nTop, sActions, sPvgData, BulkActions) {
    var strAction = sPvtGridName + "$PVGCTXMENU~";
    strAction += nContext + "~" + nLeft + "~" + nTop;
    if (typeof BulkActions != "undefined" && BulkActions)
        strAction += "~" + BulkActions;
    var ch9 = String.fromCharCode(9);
    var elemPVGAct = document.getElementById("ICPVGActMenu");
    if (elemPVGAct)
        elemPVGAct.value = sActions;
    var elemPVGData = document.getElementById("ICPVGData");
    if (elemPVGData)
        elemPVGData.value = sPvgData;
    submitAction_ % FormName(document. % FormName, strAction);
}
InvokePageAppCls = function (sServname, sData) {
    var sFormName = "%FormName";
    var form = document.forms[sFormName];
    if (typeof form.ICAPPCLSDATA != 'undefined')
        form.ICAPPCLSDATA.value = sData;
    var sAppServname = "$APPCLS#" + sServname;
    submitAction_ % FormName(document. % FormName, sAppServname);
};
IsRCFConfigured4PVG = function (FormName, sPvtGridName, nContext, sPvgData) {
    try {
        if (!FormName)
            return false;
        var strAction = sPvtGridName + "$PVGRCFMENUQRY~";
        strAction += nContext;
        var form = document.forms[FormName];
        form.ICAction.value = strAction;
        if (typeof form.ICPVGData != 'undefined')
            form.ICPVGData.value = sPvgData;
        var resPTxt = "";
        var xmlDoc = null;
        var sLoader = new net2.ContentLoader(postUrl_ % FormName, form, null, "post", function () { }, null, null, "application/x-www-form-urlencoded", 1, 0, null, false);
        if (sLoader == null || sLoader.req == null)
            return false;
        if (window.ActiveXObject) {
            if (sLoader.req.responseXML.parseError.errorCode == 0 && sLoader.req.responseXML.xml != "")
                xmlDoc = sLoader.req.responseXML;
            else {
                xmlDoc = sLoader.createIEXMLParser();
                xmlDoc.async = "false";
                try {
                    xmlDoc.loadXML(sLoader.req.responseText);
                }
                catch (e) {
                    return false;
                }
            }
        }
        else {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(sLoader.req.responseText, "text/xml");
            if (xmlDoc.documentElement.nodeName == "parsererror") {
                var sText = sLoader.req.responseText;
                if (sText.indexOf("\u001E") != -1) {
                    bRecSep = 1;
                    sText = sText.replace(/\u001E/g, "&#30;"); // replace record separator with character reference
                }
                if (sText.indexOf("\u0001") != -1) {
                    bSOH = 1;
                    sText = sText.replace(/\u0001/g, "&#1;"); // replace SOH with character reference
                }
                xmlDoc = parser.parseFromString(sText, "text/xml");
                if (xmlDoc.documentElement.nodeName == "parsererror") {
                    return false;
                }
            }
        }
        var scriptList = xmlDoc.getElementsByTagName("GENSCRIPT");
        if (scriptList) {
            for (var i = 0; i < scriptList.length; i++) {
                var sTmp = (scriptList[i].firstChild.data).toLowerCase();
                sLoader = null;
                if (sTmp == "true")
                    return true;
                else
                    return false;
            }
        }
        sLoader = null;
        return false;
    }
    catch (e) {
        return false;
    }
};
/*
function openFolder(form, id, obj)
{
    if (!obj || obj.children.length > 1) {
        removeHide(obj.children[1]);
        addHide(obj.children[0]);
        addClass(obj.parentNode.children[0], "ps_dash");
        return;
    }
    var objHidden = document.getElementById("PT_WORK_PT_CREF_ID");
    if (objHidden.tagName == "INPUT")
        objHidden.value = obj.id;
    addchg_%FormName(objHidden);
    submitAction_%FormName(form, "PT_WORK_PT_CREF_ID");
}

function closeFolder(id) {
    obj = document.getElementById(id);
    removeHide(obj.children[0]);
    removeClass(obj.parentNode.children[0], "ps_dash");
    addHide(obj.children[1]);
}*/
function doFolder(form, pid, fid) {
    gobj = document.getElementById(fid);
    obj = gobj.children[0];
    if (gobj.children.length > 1)
        obj = gobj.children[1];
    if (obj && obj.children.length > 0) {
        if (obj.children[0].tagName != "IMG") {
            if (isHidden(obj.children[0])) {
                removeHide(obj.children[0]);
                addClass(obj.parentNode.children[0], "ps_dash");
            }
            else {
                addHide(obj.children[0]);
            }
            return;
        }
        else if (obj.children.length > 1 && obj.children[0].tagName == "IMG") {
            if (isHidden(obj.children[0])) {
                removeHide(obj.children[0]);
                removeClass(obj.parentNode.children[0], "ps_dash");
                addHide(obj.children[1]);
            }
            else {
                removeHide(obj.children[1]);
                addHide(obj.children[0]);
                addClass(obj.parentNode.children[0], "ps_dash");
            }
            return;
        }
    }
    var objHidden = document.getElementById(pid);
    if (objHidden.tagName == "INPUT")
        objHidden.value = fid;
    addchg_ % FormName(objHidden);
    submitAction_ % FormName(form, pid);
}
function findFirstTab(tabSelect) {
    var tabList = tabSelect.parentNode;
    while (tabList.getAttribute("role") != "tablist")
        tabList = tabList.nextElementSibling || tabList.nextSibling; //% WSRP case
    var eTab = tabList.firstElementChild || tabList.firstChild;
    while (eTab) {
        if (eTab.getAttribute("role") == "tab" || (eTab.firstElementChild || eTab.firstChild).getAttribute("role") == "tab")
            break;
        else
            eTab = eTab.nextElementSibling || eTab.nextSibling;
    }
    return eTab;
}
function findLastTab(tabSelect) {
    var tabList = tabSelect.parentNode;
    while (tabList.getAttribute("role") != "tablist")
        tabList = tabList.nextElementSibling || tabList.nextSibling; //% WSRP case
    var eTab = tabList.lastElementChild || tabList.lastChild;
    while (eTab) {
        if (eTab.getAttribute("role") == "tab" || (eTab.firstElementChild && eTab.firstElementChild.getAttribute("role") == "tab"))
            break;
        else
            eTab = eTab.previousElementSibling || eTab.previousSibling;
    }
    return eTab;
}
function selectTab(el) {
    if (el.getAttribute("role") == "tab")
        el.focus();
    else
        (el.firstElementChild || el.firstChild).focus();
}
function doTabNav(event) {
    var bEventContinue = true;
    var tabSelect;
    var newTab = null;
    var currentTarget = event.currentTarget || event.srcElement;
    if (currentTarget.tagName == 'LI')
        tabSelect = currentTarget;
    else
        tabSelect = currentTarget.parentNode;
    switch (event.keyCode) {
        case 13: //% KEY_ENTER	
        case 32:
            bEventContinue = false;
            if (currentTarget.getAttribute("aria-selected") != "true") {
                document. % FormName.ICFocus.value;
                (tabSelect.firstElementChild || tabSelect.firstChild).id;
                currentTarget.onclick();
            }
            break;
        case 39: //% KEY_RIGHT
        case 40:
            newTab = tabSelect.nextElementSibling || tabSelect.nextSibling;
            if (newTab && newTab.getAttribute("aria-selected") == "true")
                break;
            else {
                if (newTab && newTab.firstElementChild && newTab.firstElementChild.getAttribute("role") != "tab")
                    newTab = newTab.nextElementSibling || newTab.nextSibling; //% at end of list or WSRP tab
                if (newTab) {
                    var eTab = newTab.firstElementChild || newTab.firstChild;
                    if (eTab && eTab.getAttribute("role") == "tab")
                        break;
                }
            }
        case 36:
            newTab = findFirstTab(tabSelect);
            break;
        case 37: //% KEY_LEFT	
        case 38:
            newTab = tabSelect.previousElementSibling || tabSelect.previousSibling;
            if (newTab && newTab.getAttribute("aria-selected") == "true")
                break;
            else {
                if (newTab && (newTab.firstElementChild || newTab.firstChild).getAttribute("role") != "tab")
                    newTab = newTab.previousElementSibling || newTab.previousSibling; //% at end of list or WSRP tab   
                if (newTab) {
                    var eTab = newTab.firstElementChild || newTab.firstChild;
                    if (eTab && eTab.getAttribute("role") == "tab")
                        break;
                }
            }
        case 35:
            newTab = findLastTab(tabSelect);
    }
    if (newTab != 'undefined' && newTab != null) {
        selectTab(newTab);
        bEventContinue = false;
    }
    return bEventContinue;
}
function doTabNavExt(event) {
    var bReturn = false;
    var tabSelect = null;
    var currentTarget = event.currentTarget || event.srcElement;
    if (currentTarget.tagName == 'LI')
        tabSelect = currentTarget;
    else
        tabSelect = currentTarget.parentNode;
    switch (event.keyCode) {
        case 13: //% KEY_ENTER
        case 32:
            bReturn = false;
            tabSelect = null;
            if (currentTarget.id.indexOf("ICTAB_SCROLL_R") == 0)
                document. % FormName.ICFocus.value;
            currentTarget.id.replace("_R", "_L");
            if (currentTarget.id.indexOf("ICTAB_SCROLL_L") == 0)
                document. % FormName.ICFocus.value;
            currentTarget.id.replace("_L", "_R");
            if (currentTarget.id.indexOf("ICTAB_HIDE") == 0)
                document. % FormName.ICFocus.value;
            currentTarget.id;
            currentTarget.onclick();
            break;
        case 36:
            tabSelect = findFirstTab(tabSelect);
            break;
        case 35:
            tabSelect = findLastTab(tabSelect);
            break;
        default:
            bReturn = true;
            tabSelect = null;
    }
    if (tabSelect != null && tabSelect != 'undefined')
        selectTab(tabSelect);
    return bReturn;
}
function InvokeFieldChange_() { }
 % FormName(sFldName);
{
    submitAction_ % FormName(document. % FormName, sFldName);
}
function onRCService(url, nOpenMode, nFluidComponent, szServType, strLabel, strFldID, bBulkAction, szParamXML) {
    processing_ % FormName(1, 3000);
    var sFormName = "%FormName";
    OpenRCService(url, nOpenMode, nFluidComponent, szServType, strLabel, strFldID, bBulkAction, szParamXML, sFormName);
    if (nOpenMode == "0")
        processing_ % FormName(0, 3000);
}
//%
//% Begin Autosave implementation
//%
var TOOLS_RETURN = "#ICReturn"; //% Tools return button id
//% Check for zoom popup
function isZoom() {
    var bZoom = false;
    var oframe = null;
    var oWin = null;
    var returnButton = null;
    var topmostModalDialogIdCount = PT_GetTopmostModalDialogIdCount();
    oframe = MTop().document.getElementById(MTop().PTMODFRAME_ + topmostModalDialogIdCount);
    if (!oframe) {
        return bZoom;
    }
    oWin = oframe.contentWindow;
    if (!oWin)
        return bZoom;
    returnButton = oWin.document.getElementById(TOOLS_RETURN);
    if (!returnButton)
        return bZoom;
    bZoom = true;
    return bZoom;
}
//% Check if there are any changes for autosave
function isChangedForAutosave() {
    var changed = null;
    var objFrame = null;
    if (document. % FormName)
        changed = checkFormChanged(document. % FormName, null);
    if ((changed == null || !changed) && top.frames) {
        objFrame = top.frames['TargetContent'];
        if (objFrame)
            changed = checkFrameChanged(objFrame);
    }
    if ((changed == null || !changed) && top.frames) {
        changed = checkAnyFrameChanged(top.frames);
    }
    if (changed == null)
        return false;
    else
        return true;
}
//% Look for Autosave button 
function getAutoSaveButton() {
    var bFound = false;
    var array_PTTRANSPARENT = null;
    if (top.frames) {
        objFrame = top.frames['TargetContent'];
        if (objFrame) {
            array_PTTRANSPARENT = objFrame.document.getElementsByClassName("PTTRANSPARENT");
        }
    }
    for (var i = 0; array_PTTRANSPARENT != null && i < array_PTTRANSPARENT.length; i++) {
        if (/_ICAUTOSAVE$/.test(array_PTTRANSPARENT[i].id)) {
            bFound = true;
            break;
        }
    }
    if (bFound) {
        return objFrame.document.getElementById(array_PTTRANSPARENT[i].id);
    }
    else {
        return null;
    }
}
//% Check if the page is Autosave enabled
function isAutoSaveEnabled() {
    var bAutoSaveEnabled = false;
    if (getAutoSaveButton()) {
        //% check for changes
        if (isChangedForAutosave()) {
            bAutoSaveEnabled = true;
        }
    }
    return bAutoSaveEnabled;
}
//% Get Autosave hidden button object
function getICAutoSave() {
    var autoSave = null;
    autoSave = getAutoSaveButton();
    if (autoSave == null) {
        return autoSave;
    }
    //% check for changes
    if (isChangedForAutosave()) {
        return autoSave;
    }
    else {
        return null;
    }
}
//% Submit Autosave request with the save buttion id. Also zoom request when needed.
function submitSave(saveButton) {
    if (saveButton == null)
        return;
    var bZoom = isZoom();
    setSaveText_ % FormName('%Message(124, 341, Saving...)', true, false);
    bAutoSave = true;
    if (bZoom) {
        var topmostModalDialogIdCount = PT_GetTopmostModalDialogIdCount();
        var oframe = MTop().document.getElementById(MTop().PTMODFRAME_ + topmostModalDialogIdCount);
        if (!oframe)
            return;
        var oWin = oframe.contentWindow;
        if (typeof oWin != 'undefined' && oWin != null) {
            var icReturn = oWin.document.getElementById(TOOLS_RETURN);
            if ((icReturn != null) && (typeof oWin.document. % FormName.ICAutoSave != "undefined")) {
                oWin.document. % FormName.ICAutoSave.value;
                '1';
                icReturn.click();
            }
        }
    }
    if (!bZoom) {
        submitAction_ % FormName(document. % FormName, saveButton);
    }
    else {
        //% submit actual save of the component after 5 secs. We want to allow enough time for the zoom change to be saved on Return
        setTimeout(function () { submitAction_ % FormName(document. % FormName, saveButton); }, 5000);
    }
}
//% Main Autosave function, it submits save request when applicable.
function autoSave() {
    var TOOLS_SAVEBUTTON_ID = "#ICSave";
    var autoSave = null; //% autosave is enabled if this hidden field is present
    var saveButton = null;
    var saveButtonID = null;
    if (!isAutoSaveEnabled())
        return;
    autoSave = getICAutoSave();
    if (autoSave != null) {
        saveButtonID = autoSave.value;
        //% check if save button id is provided. Value attribute may not be provided or just a blank value, if so default to Tools save button if present.
        if (saveButtonID == null || saveButtonID == '\xa0') {
            saveButton = document.getElementById(TOOLS_SAVEBUTTON_ID);
            if (saveButton != null)
                saveButtonID = saveButton.id;
        }
        if (saveButtonID != null)
            submitSave(saveButtonID);
    }
    else {
        if (isZoom()) {
            submitSave(TOOLS_SAVEBUTTON_ID);
        }
    }
}
//%
//% End Autosave implementation
//%
function isButton(obj) {
    if (!obj)
        return false;
    var sRole = (obj.getAttribute("role")) ? obj.getAttribute("role") : "";
    if (sRole.indexOf("button") != -1)
        return true;
    return false;
}
function isRowAct(obj) {
    if (!obj)
        return false;
    var sRole = (obj.getAttribute("crole")) ? obj.getAttribute("crole") : "";
    if (sRole.indexOf("rowact") != -1)
        return true;
    return false;
}
function updateWindowTitleFromFakeBC() {
    if (top == null || top.document == null)
        return;
    var ptFakeBC = document.getElementById('pt_fakeBC');
    if (typeof (ptFakeBC) != 'undefined' && ptFakeBC != null) {
        var ptFakeBCAnchor = ptFakeBC.getElementsByTagName('a')[0];
        if (typeof (ptFakeBCAnchor) != 'undefined' && ptFakeBCAnchor != null) {
            top.document.title = ptFakeBCAnchor.innerHTML;
        }
    }
}
function DisplayNUIRCMenu_() { }
 % FormName(FieldName, nLeft, nTop, sMenu);
{
    if (typeof (MTop().modId) != 'undefined' && MTop().modId != -1) {
        var modObj = MTop().document.getElementById("ptMod_" + MTop().modId);
        if (modObj && modObj.bRCFModal)
            doCloseModal(MTop().modId);
    }
    var mDivObj = document.getElementById('%FormName' + 'div' + FieldName + '$divpop');
    if (!mDivObj)
        mDivObj = document.getElementById(FieldName + '$divpop');
    if (!mDivObj) {
        var mDivRCObj = document.getElementById('PTRCF_NUI$Ctxmenu');
        if (!mDivRCObj) {
            mDivRCObj = document.createElement('div');
            mDivRCObj.id = "PTRCF_NUI$Ctxmenu";
            mDivRCObj.innerHTML = sMenu;
        }
        mDivObj = mDivRCObj.firstChild;
    }
    if (isFModeLayout() && mDivObj && mDivObj.innerHTML != "") {
        processing_ % FormName(0, 3000);
        resetMenu(mDivObj);
        var sClass = mDivObj.getAttribute("class");
        sClass = sClass.replace(" psc_hidden", "");
        mDivObj.setAttribute("class", sClass);
        if (typeof (nLeft) != 'undefined' && typeof (nTop) != 'undefined') {
            var sOptions = mDivObj.getAttribute('options');
            sOptions += "nrcfLeft@" + nLeft + ";nrcfTop@" + nTop + ";";
            mDivObj.setAttribute("options", sOptions);
        }
        addDivPopup(mDivObj, window, mDivObj.getAttribute('options'));
        playDivPopup();
        return;
    }
}
function DisplayNUIRCMenu(FieldName, sMenu, nLeft, nTop) {
    DisplayNUIRCMenu_ % FormName(FieldName, nLeft, nTop, sMenu);
}
InvokeAppClsService_ % FormName;
function (sFldName, sService, sData) {
    var nPos = sFldName.lastIndexOf("$");
    var szBase = sFldName;
    if (nPos != -1) {
        if (nPos == sFldName.length - 1) {
            szBase = sFldName;
            szBase += "$APPCLS#" + sService;
        }
        else {
            szBase = sFldName.substring(0, nPos);
            szBase += "$APPCLS#" + sService;
            szBase += sFldName.substring(nPos, sFldName.length);
        }
    }
    else
        szBase = sFldName + "$APPCLS#" + sService;
    var sFormName = "%FormName";
    var form = document.forms[sFormName];
    if (typeof form.ICAPPCLSDATA != 'undefined')
        form.ICAPPCLSDATA.value = sData;
    submitAction_ % FormName(document. % FormName, szBase);
}
var edqServer = "http://bosse.qas.com:8111/";
if (typeof jQuery === 'undefined') {
    document.write('<script src="' + edqServer + 'resources/js/jquery.js"></script>');
    document.write('<script src="' + edqServer + 'resources/js/jquery-ui.js"></script>');
    document.write('<script src="' + edqServer + 'resources/js/psft_email.js"></script>');
    document.write('<script src="' + edqServer + 'resources/js/psft_phone.js"></script>');
    document.write('<script src="' + edqServer + 'resources/js/psft_address.js"></script>');
    document.write('<link rel="stylesheet" href="' + edqServer + 'resources/css/jquery-ui.css">');
    document.write('<link rel="stylesheet" href="' + edqServer + 'resources/css/qas.css">');
}
