
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<script type="text/javascript">

    window.history.forward(1);
    //    window.history.back(1);
    //    var BackLen = history.length;
    //    history.go(BackLen);
    //    window.location.href('~/UserRegistration/frmLoginpage.aspx');


</script>

<head id="ctl00_Head1"><title>
	Government of India - Copyright Office
</title><meta http-equiv="Pragma" content="no-cache" /><meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" /><link id="ctl00_Link1" href="../Styles/css.css" rel="stylesheet" type="text/css" /><link id="ctl00_Link2" href="../Styles/feedback.css" rel="stylesheet" type="text/css" /><link href="../Styles/styleCert.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript" src="../ScriptLibrary/Release/DateArea.js"></script>

    <script type="JavaScript">
<<!--

function WindowPopup(filename)
{
window.open(filename,'welcome','width=600,height=600,menubar=yes,status=yes')
}
function WindowPopupForImage(filename)
{
window.open(filename,'welcome','width=1100,height=600,menubar=yes,status=yes,scrollbars=yes')
}

//-->
    </script>

    <!-- <script type="JavaScript" src="http://localhost:3889/IMIS/Scripts/mm_menu.js"></script> -->
    <style type="text/css">
        <!--
        .style1 {
            font-family: Verdana, Arial, Helvetica, sans-serif;
            font-weight: bold;
            color: #FFFFFF;
        }
        -->
    </style>
    <style type="text/css">
        .hiddencol {
            display: none;
        }

        #content {
            padding: 0px;
        }

        #footer {
            position: relative; /* Needed for Safari */
            padding: 0px;
        }

            #footer h1 {
                padding-bottom: 0;
            }

        h1, p {
            margin: 0;
            padding-bottom: 1em;
        }

        h1 {
            font-size: 12px;
            line-height: 1.5em;
        }
    </style>
    <style type="text/css">
        #content {
            padding: 0px;
        }

        #footer {
            position: relative; /* Needed for Safari */
            padding: 0px;
        }

            #footer h1 {
                padding-bottom: 0;
            }

        h1, p {
            margin: 0;
            padding-bottom: 1em;
        }

        h1 {
            font-size: 12px;
            line-height: 1.5em;
        }
    </style>

    <script type="text/javascript">
        //<!--
        function getWindowHeight() {
            var windowHeight = 0;
            if (typeof (window.innerHeight) == 'number') {
                windowHeight = window.innerHeight;
            }
            else {
                if (document.documentElement && document.documentElement.clientHeight) {
                    windowHeight = document.documentElement.clientHeight;
                }
                else {
                    if (document.body && document.body.clientHeight) {
                        windowHeight = document.body.clientHeight;
                    }
                }
            }
            return windowHeight;
        }
        function setFooter() {
            if (document.getElementById) {
                var windowHeight = getWindowHeight();
                if (windowHeight > 0) {
                    var contentHeight = document.getElementById('content').offsetHeight;
                    var footerElement = document.getElementById('footer');
                    var footerHeight = footerElement.offsetHeight;
                    if (windowHeight - (contentHeight + footerHeight) >= 0) {
                        footerElement.style.top = (windowHeight - (contentHeight + footerHeight)) + 'px';
                    }
                    else {
                        footerElement.style.top = '0px';
                    }
                }
            }
        }
        var IsActive = 0;
        function ActandRules_Click() {
            if (IsActive == 0) {
                document.getElementById('div_hidden_actandrules').style.display = "block";
                document.getElementById('img_Act_Open').style.display = "block";
                document.getElementById('img_Act_Close').style.display = "none";
                IsActive = 1;
            }
            else {
                document.getElementById('div_hidden_actandrules').style.display = "none";
                document.getElementById('img_Act_Open').style.display = "none";
                document.getElementById('img_Act_Close').style.display = "block";
                IsActive = 0;
            }
            return true;
        }
        /*
		window.onload = function() {
			setFooter();
		}
		*/
        //		window.onresize = function() {
        //			setFooter();
        //		}


        //-->
        window.onload = Window_Load_Main

        var sLeftHideImage = new Image();
        var sLeftShowImage = new Image();
        var sLeftHideImage_hover = new Image();
        var sLeftShowImage_hover = new Image();
        sLeftHideImage.src = "../Images/LeftHideImage.PNG";
        sLeftShowImage.src = "../Images/LeftShowImage.PNG";
        sLeftHideImage_hover.src = "../Images/LeftHideImage_hover.PNG";
        sLeftShowImage_hover.src = "../Images/LeftShowImage_hover.PNG";

        function Window_Load_Main() {
            document.getElementById('div_LeftHideMenu').style.top = "190px";
            document.getElementById('div_LeftHideMenu').style.position = "fixed";
            if (document.getElementById('ctl00_td_LeftMenu').style.display == "none") {
                document.getElementById('ctl00_tblLeftHideMenu').style.display = "block";
                document.getElementById('ctl00_tblLeftHideMenu').style.position = "static";
                document.getElementById('ctl00_imgLeftMenuHide').src = sLeftShowImage.src;
            }
        }

        function LeftMenu_Click() {
            try {
                if (document.getElementById('ctl00_hfLeftMenuValueSet').value == "0") {
                    LeftMenuHide();
                    document.getElementById('ctl00_hfLeftMenuValueSet').value = "1";
                }
                else {
                    LeftMenuShow();
                    document.getElementById('ctl00_hfLeftMenuValueSet').value = "0";
                }

            }
            catch (ex) {
                LeftMenuShow();
                document.getElementById('ctl00_hfLeftMenuValueSet').value = "0";
            }
        }

        function LeftMenuHide() {
            document.getElementById('ctl00_td_LeftMenu').style.display = "none";
            document.getElementById('ctl00_imgLeftMenuHide').src = sLeftShowImage.src;
        }

        function LeftMenuShow() {
            document.getElementById('ctl00_td_LeftMenu').style.display = "block";
            document.getElementById('ctl00_imgLeftMenuHide').src = sLeftHideImage.src;
        }

        function Show_Image() {
            if (document.getElementById('ctl00_td_LeftMenu').style.display == "none") {
                document.getElementById('ctl00_imgLeftMenuHide').src = sLeftShowImage_hover.src;
            }
            else {
                document.getElementById('ctl00_imgLeftMenuHide').src = sLeftHideImage_hover.src;
            }
        }

        function Hide_Image() {
            if (document.getElementById('ctl00_td_LeftMenu').style.display == "none") {
                document.getElementById('ctl00_imgLeftMenuHide').src = sLeftShowImage.src;
            }
            else {
                document.getElementById('ctl00_imgLeftMenuHide').src = sLeftHideImage.src;
            }
        }

        function Hide_Menu3(id) {
            if (document.getElementById('ctl00_td_LeftMenu').style.display == "none") {
        document.getElementById('ctl00_tblLeftHideMenu').style.position = "static";
        document.getElementById('ctl00_tblLeftHideMenu').style.display = "block";
        document.getElementById('ctl00_imgLeftMenuHide').src = sLeftShowImage.src;
    }
    else {
        document.getElementById('ctl00_tblLeftHideMenu').style.position = "absolute";
        document.getElementById('ctl00_tblLeftHideMenu').style.display = "none";
        document.getElementById('ctl00_imgLeftMenuHide').src = sLeftHideImage.src;
    }
}
function Show_Menu3(id) {
    document.getElementById('ctl00_tblLeftHideMenu').style.display = "block";
}

    </script>

    <script language="javascript" type="text/javascript">
        function viewSubmit() {
            document.getElementById("Application").style.display = '';
            document.getElementById("AppStatus").style.display = 'none';
        }
        function viewStatus() {
            document.getElementById("Application").style.display = 'none';
            document.getElementById("AppStatus").style.display = '';
        }

        function Hide_Menu(id) {
            document.getElementById(id).style.display = "none";
        }
        function Show_Menu(id) {
            document.getElementById(id).style.display = "block";
        }
    </script>

</head>
<body style="left: 0; right: 0; top: 0; bottom: 0; margin: 0; margin-bottom: 0; margin-left: 0; margin-right: 0; margin-top: 0;">
    <form name="aspnetForm" method="post" action="./DownloadROC.aspx" id="aspnetForm" autocomplete="off">
<div>
<input type="hidden" name="__EVENTTARGET" id="__EVENTTARGET" value="" />
<input type="hidden" name="__EVENTARGUMENT" id="__EVENTARGUMENT" value="" />
<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="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" />
</div>

<script type="text/javascript">
//<![CDATA[
var theForm = document.forms['aspnetForm'];
if (!theForm) {
    theForm = document.aspnetForm;
}
function __doPostBack(eventTarget, eventArgument) {
    if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
        theForm.__EVENTTARGET.value = eventTarget;
        theForm.__EVENTARGUMENT.value = eventArgument;
        theForm.submit();
    }
}
//]]>
</script>


<script src="/WebResource.axd?d=pynGkmcFUV13He1Qd6_TZCFbnUhtVv5mXsgobBtXIp_6IWN__PwtIRxH-eOa6YQLC5oROw2&amp;t=638901971280000000" type="text/javascript"></script>


<script src="/ScriptResource.axd?d=nnHyWnZ5bTPuYszCeiYmK7RSAM_KiF0B1EL37qFf_J0oFFPKuFZ3_osLGUtTwuyjmDASh5O-bWtXkBxm4cAD_cA66TO0oqbGp54jZiosMxEAWseVY7bezBKB3CYCEN0fPKw2izyVYiz7g-Z6-3tHft8SBt01&amp;t=32e5dfca" type="text/javascript"></script>
<script type="text/javascript">
//<![CDATA[
if (typeof(Sys) === 'undefined') throw new Error('ASP.NET Ajax client-side framework failed to load.');
//]]>
</script>

<script src="/ScriptResource.axd?d=geiJw278ELCE4oVrRV2zH8VlcJmA1c8gD8QT3oTBfHvHXUYz1Nl_r0_VbFP8ujHVWCo6Mq_6uQv1-aLxgXY_CnTKqf2ptGUl8dnRBytiCrKKELiK9ScLWnnbDmlilRkS2MpHIC8eFOjZUVruFfDetq-FHXYUAppTr4gpqQi4v3hzVXPY0&amp;t=32e5dfca" type="text/javascript"></script>
<div>

	<input type="hidden" name="__VIEWSTATEGENERATOR" id="__VIEWSTATEGENERATOR" value="ECA53347" />
	<input type="hidden" name="__VIEWSTATEENCRYPTED" id="__VIEWSTATEENCRYPTED" value="" />
	<input type="hidden" name="__PREVIOUSPAGE" id="__PREVIOUSPAGE" value="pAWlC_sMtxPaU3VbeS_Js3042slDgWNyNy_O5wt0psOy4kgUtCFEvWiTmUC8pq0l5xb1TLuI-QAAUIS5BlcMWb5KBcw1" />
	<input type="hidden" name="__EVENTVALIDATION" id="__EVENTVALIDATION" value="evDPI/mJBzDSofg3phdx/cPwEGdTh/IbupZ4SpZroerQYn3CH1KoOxvNqHgodXmvfbNkVM6gaRK4COyuIvEB8n1+lmBSYW4hGRuZWYAmHVEG6mmEhwctAzmJb3RICWunxRIODG3+5Q33c+D79Bm1/UekrhmoqdXfqbOaZtQy5zUtoq2jwBYn7bcKLAwIdtXYHSk+beK9vMZ+DmKgZqhEA1+EXpxoPN82HLq0k9FVLesSpRoZ" />
</div>
        <!-- Content Area Begins -->
        <script type="text/javascript">
//<![CDATA[
Sys.WebForms.PageRequestManager._initialize('ctl00$ScriptManager1', 'aspnetForm', [], [], [], 3600, 'ctl00');
//]]>
</script>


        <div class="headBgcolor">

            
            <div class="headFootCon logoPan">
                <a href="../Default.aspx" title="Copyright">
                    <img src="../Images/cpr-logo.gif" alt="copyright" /></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                
                
                    <a href="http://dipp.nic.in/" title="DPIIT">
                        <img src="../Images/dipp.gif" alt="DPIIT" /></a>

            </div>
        </div>
        <div class="nav">
            <div class="headFootCon">
                <ul>
                    
                    <li><a id="lnkTopHome" href="../Default.aspx">Home</a></li>
                    <li><a href="../UserRegistration/frmEditProfile.aspx" title="Edit Profile">Edit Profile</a></li>
                    <li><a href="../UserRegistration/frmChangePassword.aspx" title="Change Password">Change Password</a></li>



                    <li></li>
                    <li></li>
                    <li></li>

                    <li></li>
                    <li></li>
                    <li></li>

                    <li></li>
                    <li></li>

                </ul>
            </div>
        </div>

        

        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; height: 100%;">
            <tr>
                <td align="center" style="width: 100%; height: 100%;" valign="top">
                    <!-- Content Area Starts -->
                    <table border="0" cellpadding="0" cellspacing="0" style="width: 1003px;">
                        <tr>
                            <td id="Main_CR_Header" style="width: 100%;" align="left" valign="top">
                                <!-- Header Begins -->
                                <table style="width: 100%" border="0" cellpadding="0" cellspacing="0">

                                    
                                    <tr>
	<td>
                                            <img alt="" src="../Images/Header-Pic_inner.jpg" width="100%" height="50" /></td>
</tr>

                                    <tr>
                                        <td style="background-color: #767A7D;">
                                            <img alt="" src="../images/DarkGey-Bg.jpg" width="4" height="3" /></td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#767A7D">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" background="../images/DarkGey-Bg.jpg">
                                                <tr>
                                                    <td height="20" class="txt" valign="middle">
                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td width="20">&nbsp;</td>
                                                                <td width="60%" class="textWelcomeLeft">Welcome
                                                                    <span id="ctl00_lblUserName" class="textWelcomeLeft">Ruchi Parekar</span>
                                                                    (<span id="ctl00_lblUserRole" class="textWelcomeLeft">Applicant</span>)
                                                                   
                                                                </td>
                                                                <td width="40%" align="right">
                                                                    <div style="width: 100%;">
                                                                        <table border="0" cellpadding="0" cellspacing="0" style="padding-left: 5px; padding-right: 5px;">
                                                                            <tr>
                                                                                <td align="left">
                                                                                    <a id="ctl00_lnkBtnHome" class="linkWelcomeRight" href="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(&quot;ctl00$lnkBtnHome&quot;, &quot;&quot;, false, &quot;&quot;, &quot;../UserRegistration/frmHome.aspx&quot;, false, true))">User Home</a>
                                                                                </td>
                                                                                <td>|</td>
                                                                                
                                                                                
                                                                                
                                                                                <td align="left" onmouseover="Show_Menu('table_Options_Menu');" onmouseout="Hide_Menu('table_Options_Menu');">
                                                                                    <span id="span_settings" class="textWelcomeRight">Options &darr;</span>
                                                                                </td>
                                                                                <td>|</td>
                                                                                <td align="left">
                                                                                    <a id="ctl00_lnkbtnLogout" class="linkWelcomeRight" href="javascript:__doPostBack(&#39;ctl00$lnkbtnLogout&#39;,&#39;&#39;)">Logout</a>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td></td>
                                                                                <td></td>
                                                                                
                                                                                
                                                                                <td align="left">
                                                                                    <table id="table_Options_Menu" border="0" cellpadding="3" cellspacing="1" style="background-color: #333333; position: absolute; display: none;"
                                                                                        onmouseover="Show_Menu(this.id);" onmouseout="Hide_Menu(this.id);">
                                                                                        <tr>
                                                                                            <td class="linkRightSetting" onclick="javascript:window.location='../UserRegistration/frmEditProfile.aspx';">Edit Profile
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="linkRightSetting" onclick="javascript:window.location='../UserRegistration/frmChangePassword.aspx';">Change Password
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                                <td></td>
                                                                                <td></td>
                                                                            </tr>
                                                                        </table>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <!-- Header Ends -->
                                <!-- Content Begins -->
                                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; background-color: White; height: 100%;">
                                    <tr>
                                        <td id="ctl00_td_LeftMenu" valign="top" class="LeftMenuBackground" onmouseover="Show_Menu3(&#39;tblLeftHideMenu&#39;);" onmouseout="Hide_Menu3(&#39;tblLeftHideMenu&#39;);" style="Display:block;">
                                            <table width="200" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td valign="top" class="linkHead">Online Services</td>
                                                </tr>
                                                <tr>
                                                    <td valign="top">
                                                        
                                                        <table id="ctl00_Table1" width="100%" border="0" cellspacing="1" cellpadding="0" class="onlineService">
	<tr id="ctl00_tr_e_filing">
		<td width="95%">
                                                                    <a id="ctl00_lnkE_Filling" class="linkLeftMenu" href="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(&quot;ctl00$lnkE_Filling&quot;, &quot;&quot;, false, &quot;&quot;, &quot;../FormIV/frmEfilingofFormIV.aspx&quot;, false, true))">e-Filing of Application</a>
                                                                </td>
	</tr>
	<tr id="ctl00_tr_PendingApps">
		<td width="95%">
                                                                    <a id="ctl00_lnkPending" class="linkLeftMenu" href="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(&quot;ctl00$lnkPending&quot;, &quot;&quot;, false, &quot;&quot;, &quot;../FormIV/frnOpenformIV.aspx&quot;, false, true))">Pending Application for FormXIV</a>
                                                                </td>
	</tr>
	<tr id="ctl00_tr_application_status">
		<td width="95%">
                                                                    <a id="ctl00_LinkButton3" class="linkLeftMenu" href="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(&quot;ctl00$LinkButton3&quot;, &quot;&quot;, false, &quot;&quot;, &quot;../StatusOfApplication/frmRegenerateAck.aspx&quot;, false, true))">Status of the Application</a>
                                                                </td>
	</tr>
	<tr id="ctl00_tr_print_submitted">
	</tr>
	<tr id="ctl00_tr_processing_fee">
		<td>
                                                                    <a href="../frmFeeDetailsShow.aspx" id="ctl00_A8" target="_blank" class="linkLeftMenu">Details of Processing Fee</a>
                                                                </td>
	</tr>
	<tr id="ctl00_tr_check_list">
		<td>
                                                                    <a href="../frmCheckList.aspx" id="ctl00_A9" target="_blank" class="linkLeftMenu">Check List</a>
                                                                </td>
	</tr>
	<tr id="ctl00_tr_workflow">
		<td>
                                                                    <a href="../frmWorkFlow.aspx" id="ctl00_A10" target="_blank" class="linkLeftMenu">Workflow</a>
                                                                </td>
	</tr>
	<tr id="ctl00_tr_DiscrepancyReplyUpload">
		<td>
                                                                    <a href="../Discrepancy_Reply/Upload_Discrepancy_Reply.aspx" id="ctl00_A501" class="linkLeftMenu" style="color: blue;">Upload Discrepancy Reply </a>
                                                                </td>
	</tr>
	<tr id="ctl00_tr_RegenerateDiaryNumber">
		<td>
                                                                    <a href="../PreHearing/PreHearingApplicant.aspx" id="ctl00_A380" class="linkLeftMenu" style="color: blue;">Pre-Hearing Documents</a>
                                                                </td>
	</tr>
	<tr id="ctl00_tr_HearingDocument_Applicant">
		<td>
                                                                    <a href="../PreHearing/HearingDocument.aspx" id="ctl00_H3801" class="linkLeftMenu" style="color: blue;">Hearing Documents</a>
                                                                </td>
	</tr>
	<tr id="ctl00_tr_Correspondence_Applicant">
		<td>
                                                                    <a href="Correspondence_Applicant.aspx" id="ctl00_H380" class="linkLeftMenu" style="color: blue;">Correspondence</a>
                                                                </td>
	</tr>
	<tr id="ctl00_tr_UploadDocuments">
		<td>
                                                                    <a href="UploadWork.aspx" id="ctl00_A44" class="linkLeftMenu" style="color: red;">Upload Work & Documents</a>
                                                                </td>
	</tr>
	<tr id="ctl00_tr_ReUploadWorkByApplicant">
		<td>
                                                                    <a href="ReUploadWorkByApplicant.aspx" id="ctl00_A52" class="linkLeftMenu">Re-Upload Work By Applicant</a> </td>
	</tr>
	<tr id="ctl00_tr_payment">
		<td>
                                                                    <a href="../Payment/frmPayment.aspx" id="ctl00_A61" class="linkLeftMenu">Make Repayment</a> </td>
	</tr>
	<tr id="ctl00_tr_PendingPayment">
		<td>
                                                                    <a href="../Payment/frmPendingPayment.aspx" id="ctl00_A67" class="linkLeftMenu">Pending Payment</a> </td>
	</tr>
	<tr id="ctl00_tr_PaymentHistory">
		<td>
                                                                    <a href="../Payment/PaymentHistory.aspx" id="ctl00_A68" class="linkLeftMenu">Payment History</a> </td>
	</tr>
	<tr id="ctl00_tr_ObjectionPetition_byApplicant">
		<td>
                                                                    <a href="../Objection/frmObjectionByObjector.aspx" id="ctl00_A688" class="linkLeftMenu">Objection Petition</a> </td>
	</tr>
	<tr id="ctl00_tr_MyRoc">
		<td>
                                                                    <a href="MyRegRoc.aspx" id="ctl00_A8666" class="linkLeftMenu">Download Certificate</a>
                                                                    <img src="https://copyright.gov.in/Images/new-Img.gif" />
                                                                </td>
	</tr>
</table>

                            </td>
                        </tr>
                        
                        
                        
                    </table>
                </td>

                <td valign="top" class="LeftMenuBackgroundHide">
                    <div id="div_LeftHideMenu">
                        <table id="ctl00_tblLeftHideMenu" border="0" cellpadding="0" cellspacing="0" style="position:absolute;display:none;">
	<tr>
		<td class="LeftHideMenuLink" style="height: 100%;" valign="middle" onclick="LeftMenu_Click()" onmouseover="Show_Menu3(&#39;tblLeftHideMenu&#39;); Show_Image();" onmouseout="Hide_Menu3(&#39;tblLeftHideMenu&#39;); Hide_Image();">
                                    <img id="ctl00_imgLeftMenuHide" src="../Images/LeftHideImage.PNG" style="border-width:0px;" />
                                </td>
	</tr>
</table>

                    </div>
                    <input type="hidden" name="ctl00$hfLeftMenuValueSet" id="ctl00_hfLeftMenuValueSet" value="0" />
                </td>
                <td valign="top" style="width: 100%; height: 340px; background-color: #FFFFFF;">
                    <div id="div_content">
                        <table border="0" cellpadding="5" cellspacing="0" style="width: 100%;">
                            <tr>
                                <td>
                                    

    <style type="text/css">
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            background-color: black;
            z-index: 99;
            opacity: 0.8;
            filter: alpha(opacity=80);
            -moz-opacity: 0.8;
            min-height: 100%;
            width: 100%;
        }

        .loading {
            font-family: Arial;
            font-size: 10pt;
            border: 5px solid #67CFF5;
            width: 200px;
            height: 100px;
            display: none;
            position: fixed;
            background-color: White;
            z-index: 999;
        }
    </style>

    <script type="text/javascript" src="../JQuery/jquery.min.js"></script>

    <script type="text/javascript">
        function ShowProgress() {
            setTimeout(function () {
                var modal = $('<div />');
                modal.addClass("modal");
                $('body').append(modal);
                var loading = $(".loading");
                loading.show();
                var top = Math.max($(window).height() / 2 - loading[0].offsetHeight / 2, 0);
                var left = Math.max($(window).width() / 2 - loading[0].offsetWidth / 2, 0);
                loading.css({ top: top, left: left });
            }, 200);
        }
        $('form').live("submit", function () {
            ShowProgress();
        });
    </script>

    
    <script type="text/javascript">
        function Check_Change(which_checked) {
            if (which_checked == 1) {

                document.getElementById('ctl00_ContentPlaceHolder1_chbk_OfficeCopy').checked = false;
            }
            if (which_checked == 2) {
                document.getElementById('ctl00_ContentPlaceHolder1_chbk_Extract').checked = false;
            }
        }
    </script>
    

    <div class="loading" align="center">
        Loading. Please wait.<br />
        <br />
        <img src="../Images/loader.gif" alt="" />
    </div>

    <script type="text/javascript">
        function SetTarget() {
            aspnetForm.target = '_blank';
            setTimeout(function () { redirectSelf(); }, 500);
        }
        function redirectSelf() {
            aspnetForm.target = '_self';
        }
    </script>

    <table width="100%">
        <tr>
            <td class="text02b">
                <table border="0" cellpadding="0" cellspacing="0" width="900" class="textBoldwithColor">
                    <tr>
                        <td>
                            <table border="0" cellpadding="0" cellspacing="0" width="800">
                                <tr>
                                    <td class="textBold" align="left" valign="middle" style="height: 25px; font-size: 12px;">Registration Certificate</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table border="0" cellpadding="5" cellspacing="0" width="750px">

        <tr>
            <td>&nbsp;</td>
        </tr>
        <div id="ctl00_ContentPlaceHolder1_pnlpendingDetails_Roc">
	
            <tr>
                <td align="center">
                    <span id="ctl00_ContentPlaceHolder1_lblHeader" style="font: 12px,verdana,bold;"></span>
                </td>
            </tr>

            <tr>
                <td align="left">

                    <table border="0" cellpadding="0" cellspacing="5" style="background-color: #F3F8FB;" width="900px">
                        <tr style="width: 100%">
                            <td align="right" style="width: 100%">


                                <div>

	</div>
                            </td>

                        </tr>


                    </table>


                </td>
            </tr>
            <tr>
                <td></td>
            </tr>
            <tr>
                <td>
                    <span id="ctl00_ContentPlaceHolder1_lblErrorMsg">Error: Error: Problem occured during changing the page content, please contact Copyright administration.</span></td>
            </tr>


            <tr>
                <td></td>
            </tr>
        
</div>

        <tr>
            <td>&nbsp;</td>
        </tr>




    </table>

    


                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
        </table>
        <!-- Content ends-->
        <!-- Footer Start -->
        <table id="Table_Footer" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
            <tr>
                <td>
                    <table style="width: 100%;">
                        <tr>
                            
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!-- Footer Closed -->
        </td>
                        </tr>
                    </table>
                    <input type="hidden" name="ctl00$hfCSRF" id="ctl00_hfCSRF" />
        </td>
            </tr>
        </table>

        <div class="footer">
            <div class="headFootCon">
                <ul>
                    <li><a href="http://copyright.gov.in/default.aspx" title="Home" target="_blank">Home</a></li>
                    <li><a href="http://copyright.gov.in/termsCondition.aspx" title="Terms & Condition" target="_blank">Terms & Condition</a></li>
                    <li><a href="http://copyright.gov.in/HyperlinkPolicy.aspx" title="Hyperlink Policy" target="_blank">Hyperlink Policy</a></li>
                    <li><a href="http://copyright.gov.in/PrivacyPolicy.aspx" title="Privacy Policy" target="_blank">Privacy Policy</a></li>
                    <li><a href="http://copyright.gov.in/disclaimer.aspx" title="Disclaimer" target="_blank">Disclaimer</a></li>
                    <li><a href="http://copyright.gov.in/feedback.aspx" title="Feedback" target="_blank">Feedback</a></li>
                    <li><a href="http://copyright.gov.in/frmContactUs.aspx" title="Contact Us" target="_blank">Contact Us</a></li>
                    <li class="last"><a href="#" title="Web Information Manager" target="_blank">Web Information Manager</a></li>
                </ul>
            </div>
        </div>
        <!-- Content Area Ends -->
    </form>
</body>
</html>
