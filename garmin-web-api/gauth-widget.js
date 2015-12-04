/*
	The GAUTH API is used to embed the Garmin Authentication (GAuth) widget.

	To initialize the widget, use GAUTH.init() and pass your configuration parameters.

	Here's an example from https://my.garmin.com/mygarmin/login.htm:

        GAUTH.init({
			"gauthHost":                       "https://sso.garmin.com/sso",
			"callBackWebHostUrl":              "olaxpw-my01.garmin.com",
			"clientId":                        "MY_GARMIN",
            "locale":                          "en",
            "id":                              "gauth-widget",
            "rememberMeShown":                 false,
            "rememberMeChecked":               false,
            "createAccountShown":              true,
            "redirectAfterAccountLoginUrl":    "https://my.garmin.com/mygarmin/customers/myGarminHome.faces",
            "redirectAfterAccountCreationUrl": "/mygarmin/corporateAnnouncements/lists-newAccount.htm"
        )};

	Available configuration options:

    NAME                             REQ  VALUES                                                                DESCRIPTION
    ----------------------------     ---  --------------------------------------------------------------------  ---------------------------------------------------------------------------------------------------
    gauthHost                        Yes  Use helper method SingleSignOnUtils.getGauthHost()                    Environment specific SSO server URL.
    callBackWebHostUrl               Yes  Use helper method SingleSignOnUtils.getCallBackWebHost(request)       Server specific callback web host.
    clientId                         Yes  "MY_GARMIN"/"BUY_GARMIN"/"FLY_GARMIN"/                                Client identifier for your web application
                                          "RMA"/"GarminConnect"/"OpenCaching"/etc
    locale                           Yes  "en", "bg", "cs", "da", "de", "es", "el", "fi", "fr", "hr",           User's current locale, to display the GAuth login widget internationalized properly.
                                          "it", "ja", "ko", "nb", "nl", "no", "pl", "pt", "ru", "sk",           (All the currently supported locales are listed in the Values section.)
                                          "sl", "sv", "tr", "uk", "th", "zh_TW", "zh"       
    id                               Yes  Specify "gauth-widget" unless you gave the GAuth div a different id.  The identifier of the html <div> where the GAuth login widget should be located.
    rememberMeShown                  No   true/false (Default value is true)                                    Whether the "Remember Me" check box is shown in the GAuth login widget.
    rememberMeChecked                No   true/false (Default value is false)                                   Whether the "Remember Me" login feature is set. (Even is rememberMeShown is false, you can hard code all logins to be "remembered.") 
    createAccountShown               No   true/false (Default value is true)                                    Whether the "Don't have an account? Create One" link is shown in the GAuth login widget.
                                                                                                                (If you wish to not show this and provide your own link somewhere else on your page, just call 
                                                                                                                GAUTH.openCreateAccount(); to pop open the create account window.)
    usernameShown                    No   true/false (Default value is true)                                    If set to false, the regular account creation screen will hide the "Username" field and
                                                                                                                use whatever is specified in the "Email Address" field as the user's username instead.
                                                                                                                Also, any GAuth "Email or Username" fields will be labeled just as "Email Address",
                                                                                                                even though they will still by functional by username.
    displayNameShown                 No   true/false (Default value is false)                                   If set to true, show the "Display Name" field on the account creation screen, to allow the user
                                                                                                                to set their central MyGarmin display name upon account creation.
    cssUrl                           No   Absolute URL to custom CSS file.                                      Use custom CSS styling for the GAuth login widget.
    redirectAfterAccountLoginUrl     No   Relative URL including webapp's context path.                         The URL to redirect to after logging on. (If not specified, no full page redirect will occur
                                                                                                                after login/account creation.  If consumeServiceTicket is true, the GAuth login widget will 
                                                                                                                make a JSONP AJAX request to log the user into the client webapp, and then sends a SUCCESS 
                                                                                                                JavaScript event you must listen for, and be relied upon to hide the GAuth div and do whatever 
                                                                                                                you wish next. If you do this, d.username will contain the username of the user just logged in, 
                                                                                                                and d.rememberMe will be true/false depending on whether the user was remembered or actually logged in.)
    redirectAfterAccountCreationUrl  No   Relative URL including webapp's context path.                         The URL to redirect to after creating an account.
                                                                                                                (If not specified, redirectAfterAccountLoginUrl will be used instead.)
    consumeServiceTicket             No   true/false (Default value is true)                                    IF you don't specify a redirectAfterAccountLoginUrl AND you set this to false, the GAuth login widget
                                                                                                                will NOT consume the service ticket assigned and will not seamlessly log you into your webapp. 
                                                                                                                It will send a SUCCESS JavaScript event with the service ticket and service url you can take 
                                                                                                                and explicitly validate against the SSO infrastructure yourself. 
                                                                                                                (By using casClient's SingleSignOnUtils.authenticateServiceTicket() utility method, 
                                                                                                                or calling web service customerWebServices_v1.2 AccountManagementService.authenticateServiceTicket().)
    initialFocus                     No   true/false (Default value is true)                                    If you don't want the GAuth login widget to autofocus in it's "Email or Username" field upon initial loading,
                                                                                                                then specify this option and set it to false.
    productSupportUrl                No   Absolute URL to your custom product support URL.                      If not specified, defaults to http://www.garmin.com/us/support/contact
    termsOfUseUrl                    No   Absolute URL to your custom terms of use URL.                         If not specified, defaults to http://www.garmin.com/garmin/cms/site/products/lang/en/home/terms-of-use
    privacyStatementUrl              No   Absolute URL to your custom privacy statement URL.                    If not specified, defaults to http://www.garmin.com/garmin/cms/lang/en/site/products/home/products-and-applications-privacy-statement
    embedWidget                      No   true/false (Default value is false)                                   If set to false, avoid all lightboxes & popup windows, loading all screens inline.
    socialEnabled                    No   true/false (Default value is true)                                    If set to false, do not show any social sign in elements or allow social sign ins.

    The following GAUTH functions are currently available:

    FUNCTION                      DESCRIPTION
    ----------------------------  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    GAUTH.init();                 Initialize the GAuth login widget's state. Please see the preceeding configuration options table for initialization options. (Must be called before any other GAUTH function.)
    GAUTH.checkAuthentication();  Ask GAuth if a user is already authenticated to the SSO infrastructure.  Request is asynchronous, so you must listen for a 2 new events. 
                                  Sends an AUTHENTICATED event with service ticket & sevice url if logged on. Otherwise throws NOT_AUTHENTICATED event.
    GAUTH.loadGAuth();            Loads the GAuth login widget div content.
    GAUTH.openCreateAccount();    Pops open the GAuth login widget's Create Account screen.


  	If you do not wish the GAUTH to manually refresh the parent window for you, you may also be notified of control changes via events.
	The following events are available to bind to:
	
    EVENT              DESCRIPTION
    -----------------  ----------------------------------------------------------------------------
    NOT_AUTHENTICATED  Event sent after GAUTH.checkAuthentication() is called when user is not logged onto the SSO infrastructure.
    AUTHENTICATED      Event sent after GAUTH.checkAuthentication() is called when user is logged onto SSO infrastructure.
                       Event details contain service ticket identifier & service url that you can use to identify the logged on user
                       using utility method SingleSignOnUtils.authenticateServiceTicket()
                       or using the customerWebServices_v1.2 AccountManagementService.authenticateServiceTicket() webservice method.
    SUCCESS            Login was successful. (If you want to use the GAuth login widget in a modal context without a full page refresh after login
                       and don't specify a "redirectAfterAccountLoginUrl" initialization parameter, this event NEEDS to be listened for,
                       so you know when to hide the GAuth div and perform your next AJAX type operation after user logon.
                       Also if you specify a "consumeServiceTicket" initialization parameter of false,
                       you will be sent a service ticket id & service url and you will have to consume the service ticket manually.)
    ACCOUNT_LOCKED     User has reached the maximum number of failed logins and their account is temporarily locked.
    ACCOUNT_PROBLEM    There is a problem with the user's account that prevents it from being used to log in.
    FAIL               FAIL	Login failed due to invalid user/email and password.
    ERROR              A system error occurred displaying the GAuth widget or during its operation.
    MESSAGE-POSTED	   Triggered when ANY message is sent from the GAUTH backend. Represented as the raw json response.


	Here's some examples of adding a listener:

    // FULL PAGE REFRESH AFTER LOGGING IN WITH GAUTH TO A STATEFUL WEB APPLICATION. (HAS SESSIONS & SERVLET FILTERS)
    // IF redirectAfterAccountLoginUrl specified, a full page refresh will occur, and this is the success event:
    GAUTH_Events.addListener("SUCCESS", function(e, d){
        consoleInfo("gauth-widget.js: [SUCCESS event triggered]");
        // No need to do anything here, browser will be redirected immediately to redirectAfterAccountLoginUrl.
    });

    // NO FULL PAGE REFRESH AFTER LOGGING IN WITH GAUTH TO AN AJAX-Y STATEFUL WEB APPLICATION. (HAS SESSIONS & SERVLET FILTERS)
    // IF redirectAfterAccountLoginUrl not specified AND consumeServiceTicket is true or not specified, this is the success event:
    GAUTH_Events.addListener("SUCCESS", function(e, d) {
        consoleInfo("[SUCCESS event triggered]");
        consoleInfo('login.jsp: successDetails: [‘        + successDetails
                         + '], customerId: ['             + d.customerId
                         + '], username: ['               + d.username
                         + '], rememberMe: ['             + d.rememberMe
                         + '], password: ['               + d.password
                         + '], email: ['                  + d.email
                         + '], displayName: ['            + d.displayName
                         + '], firstName: ['              + d.firstName
                         + '], lastName: ['               + d.lastName
                         + '], localePreference: ['       + d.localePreference
                         + '], addressLine1: ['           + d.addressLine1
                         + '], addressLine2: ['           + d.addressLine2
                         + '], cityName: ['               + d.cityName
                         + '], state: ['                  + d.state
                         + '], postalCode: ['             + d.postalCode
                         + '], country: ['                + d.country
                         + '], passwordChangeRequired: [' + d.passwordChangeRequired
                         + '], lastLogin: ['              + d.lastLogin
                         + '], erpCustomerNumber: ['      + d.erpCustomerNumber
                         + ']');
        // User logged on modally to parent webapp without a full page refresh,
        // so it's up to you to hide the GAUth login widget and make further AJAX requests (which will reflect a logged on user.)
    });

    // NO FULL PAGE REFRESH AFTER LOGGING IN WITH GAUTH TO AN AJAX-Y STATELESS WEB APPLICATION. (NO SESSIONS & NO SERVLET FILTERS)
    // IF redirectAfterAccountLoginUrl not specified AND consumeServiceTicket is false, this is the success event:
    GAUTH_Events.addListener("SUCCESS", function(e, d){
        consoleInfo("[SUCCESS event triggered]");
        consoleInfo('login.jsp: successDetails: [' + d.successDetails
                           + '], serviceTicket: [' + d.serviceTicket
                           + '], serviceUrl: [' + d.serviceUrl
                           + ']');
        // User logged on modally to SSO infrastructure without a full page refresh and without consuming the service ticket,
        // so it's up to you to use the service ticket & service url to determine who the user is.
        // (By using casClient's SingleSignOnUtils.authenticateServiceTicket() utility method, 
        // or calling web service customerWebServices_v1.2 AccountManagementService.authenticateServiceTicket().)
    });

	@author Bobby Hubbard, Alex Blume, Vijay Patil
	@copyright 2013 Garmin International
*/

/**
 * Writes a message to the console with the visual "info" icon and color coding and a hyperlink to the line where it was called.
 *
 * @param msg Console message to write.
 */
function consoleInfo(msg) {
    if (typeof console === 'object' && typeof console.info === 'function') {
        console.info(msg);
    }
}

/**
 * Writes a message to the console with the visual "error" icon and color coding and a hyperlink to the line where it was called.
 *
 * @param msg Console message to write.
 */
function consoleError(msg) {
    if (typeof console === 'object' && typeof console.error === 'function') {
        console.error(msg);
    }
}

var GAUTH = function() {
	var _config, gauthHost, gauth_div, gauthIframe, gauthLoadingDiv, source, target, cssUrl, createAccountUrl, popup_Div, popup_source, popupIframe; // cache
	var LOAD_TIMEOUT_SEC = 10, timeout;

	// private function to append iframe to document
	function appendIFrame(p, src){
		gauthIframe = document.createElement("IFRAME");
		gauthIframe.setAttribute("src", src);
		gauthIframe.setAttribute("id", "gauth-widget-frame");
		gauthIframe.setAttribute("scrolling", "no");
		gauthIframe.setAttribute("marginheight", "0");
		gauthIframe.setAttribute("marginwidth", "0");
		gauthIframe.setAttribute("class", "gauth-iframe");
		gauthIframe.style.width = "100%"; // always consume full width of container
		gauthIframe.style.height = "0px"; // when gauth renders in iframe it will message its height back to the client
		gauthIframe.style.border = "none";
		gauthIframe.frameBorder  = "0"; // for IE
		p.appendChild(gauthIframe);

        // The following line is needed to get around a Firefox 3.x bug where switching outer page languages
        // and reloading outer page isn't properly refreshing GAuth login widget frame to reflect new language.
        // See Firefox bug for details: https://bugzilla.mozilla.org/show_bug.cgi?id=279048
        if (jQuery.browser.mozilla && jQuery.browser.version.slice(0,3) == "1.9") {
            parent.document.getElementById("gauth-widget-frame").src = src;
        }
	}

	// private function to append iframe to document
	function appendLoading(p){
		gauthLoadingDiv = document.createElement("DIV");
		gauthLoadingDiv.setAttribute("class", "gauth-loading");
		gauthLoadingDiv.innerHTML = (cssUrl ? "<link href=\"" + cssUrl + "\" rel=\"stylesheet\" type=\"text/css\" media=\"all\" />" : "")
                                  + "<img src='https://static.garmincdn.com/shared/global/media/images/ajax-loader.gif'/>";
		p.appendChild(gauthLoadingDiv);
	}

	// in order to message cross-domain, the postMessage api requires the host name to be sent along with the message
	function getGAuthHost(){
        // If old client still passing in casServerLoginUrl as gauthHost instead of casServerUrlPrefix, strip off ending '/login'.
        if (gauthHost.indexOf('/login') != -1) {
            gauthHost = gauthHost.substring(0, gauthHost.indexOf('/login'));
        }
		return gauthHost;
	}

    function getGAuthHostOnly(){
        var scheme = gauthHost.substring(0, gauthHost.indexOf("://"));
        var host   = gauthHost.substring(scheme.length + 3, gauthHost.length);
        if (host.indexOf("/") != -1) {
            host = host.substring(0, host.indexOf("/"));
        }
        return scheme + "://" + host;
    }

    /**
     * Returns true if the specified value is NOT a valid boolean value.
     * @param value Value to check.
     */
    function isInvalidBoolean(value) {
        if (value == undefined || (value != false && value != true)) {
            return true;
        } else {
            return false;
        }
    }

	/**
	 * Checks the config for required fields
	 * @throws if configuration is not provided or if one of the required fields is missing.
	 */
	function validateRequired(config){
		if(config){
			var err=[];
            // Check required config options.
			if (!config.gauthHost) { err.push("gauthHost"); }
			if (!config.locale)	   { err.push("locale");    }
            // Convert "de-DE" type locales containing a dash to "de_DE" type locales that we support.
            config.locale = config.locale.replace(/^([a-z]{2})\-([a-z]{2})$/i, "$1_$2");
			if (!config.clientId)  { err.push("clientId");  }
            // Set optional config defaults.
            if (isInvalidBoolean(config.rememberMeShown)) {
                config.rememberMeShown      = 'true';
            }
            if (isInvalidBoolean(config.createAccountShown)) {
                config.createAccountShown   = 'true';
            }
            if (isInvalidBoolean(config.openCreateAccount)) {
                config.openCreateAccount    = 'false';
            }
            if (isInvalidBoolean(config.usernameShown)) {
                config.usernameShown        = 'true';
            }
            if (isInvalidBoolean(config.displayNameShown)) {
                config.displayNameShown     = 'false';
            }
            if (isInvalidBoolean(config.consumeServiceTicket)) {
                config.consumeServiceTicket = 'true';
            }
            if (isInvalidBoolean(config.initialFocus)) {
                config.initialFocus         = 'true';
            }
            if (isInvalidBoolean(config.embedWidget)) {
                config.embedWidget          = false;
            }
            if (isInvalidBoolean(config.socialEnabled)) {
                config.socialEnabled        = 'true';
            }
			if (err.length === 0) {
				_config = config;
				if (_config.target) {
                    target = _config.target;
                }
//				gauthHost = _config.gauthHost.indexOf("https://")>=0?_config.gauthHost:"https://"+_config.gauthHost;
                gauthHost = _config.gauthHost;
                if (_config.cssUrl) {
                    cssUrl = _config.cssUrl;
                }
				return;
			}
			if (err.length > 1) {
				throw "The following are required configuration parameters!: " + err;
			} else {
				throw err + " is a required configuration parameter!";
			}
		} else {
			throw "Configuration is required!";
		}
	}

	//Function to load popupUrl into an Iframe.
	function loadPopupInDialogBox(popupUrl, popupTitle){

		popup_Div = document.getElementById("gauth-light-box");
	    
		popup_Div.innerHTML = "<a class='button' id='liteBoxClose' href='#' onclick='hideLightBox();return false;'><span>X</span></a>";
		
		var popup_source;
		var host = getGAuthHost();
		
		popup_source = host + popupUrl;
	    
        consoleInfo("gauth-widget.js LoadPopupInDialogBox(): popup_source: " + popup_source);

	    if (document.getElementById('popup-iframe-id')){
	    	purge(document.getElementById('popup-iframe-id'));
	    	popup_Div.removeChild(document.getElementById('popup-iframe-id'));
		}
	
	    //append iframe
	    appendPopupIFrame(popup_Div, popup_source, popupTitle);
	}

	//function to append popupUrl into an Iframe.
	function appendPopupIFrame(p, src, title){
		popupIframe = document.createElement("IFRAME");
		popupIframe.setAttribute("src", src);
		popupIframe.setAttribute("title", title);
		popupIframe.setAttribute("id", "popup-iframe-id");
		popupIframe.setAttribute("scrolling", "no");
		popupIframe.setAttribute("marginheight", "0");
		popupIframe.setAttribute("marginwidth", "0");
		popupIframe.setAttribute("class", "popup-iframe-class");
		popupIframe.style.width = "100%"; //Always consume full width of container
		popupIframe.style.height = "100%"; //When gauth renders in iframe it will message its height back to the client
		popupIframe.style.border = "none";
		popupIframe.frameBorder  = "0"; //for IE
		p.appendChild(popupIframe);
	}

	function loadCSS(filename){
        if(isCssFileLoaded(filename)) return; //only append if its not already there.
		var fileref=document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename); //ideally this is absolute url
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}

    // Returns true if and only if the exact filename (as specified by the link's href attribute) is already on the dom.
    function isCssFileLoaded(filename){
            var targetattr = "href";
            var allLinks = document.getElementsByTagName("link");
            for (var i = allLinks.length; i >= 0; i--) {
                    if (allLinks[i]
                     && allLinks[i].getAttribute(targetattr) != null
                     && allLinks[i].getAttribute(targetattr).indexOf(filename) != -1) {
                            return true;
                    }
            }
            return false;
    }

	return {
        loadGAuth : function() {
            gauth_div = document.getElementById(_config.id?_config.id:"gauth-widget");

            //append loading image
            appendLoading(gauth_div);

            var gauthHost = getGAuthHost();

            var queryString;
            if (!_config.redirectAfterAccountLoginUrl) {
                queryString = 'service=' + encodeURIComponent(jQuery.removeRequestParameters(document.location.href));
            } else if (_config.redirectAfterAccountLoginUrl.indexOf('http') == 0) {
                queryString = 'service=' + encodeURIComponent(_config.redirectAfterAccountLoginUrl);
            } else {
                queryString = 'service=' + encodeURIComponent(jQuery.getHost() + _config.redirectAfterAccountLoginUrl);
            }
            queryString += '&webhost=' + encodeURIComponent(_config.callBackWebHostUrl);
            queryString += '&source='  + encodeURIComponent(jQuery.removeRequestParameters(document.location.href));
            if (_config.redirectAfterAccountLoginUrl) {
                if (_config.redirectAfterAccountLoginUrl.indexOf('http') == 0) {
                    queryString += '&redirectAfterAccountLoginUrl=' + encodeURIComponent(_config.redirectAfterAccountLoginUrl);
                } else {
                    queryString += '&redirectAfterAccountLoginUrl=' + encodeURIComponent(jQuery.getHost() + _config.redirectAfterAccountLoginUrl);
                }
            }
            if (_config.redirectAfterAccountCreationUrl) {
                if (_config.redirectAfterAccountCreationUrl.indexOf('http') == 0) {
                    queryString += '&redirectAfterAccountCreationUrl=' + encodeURIComponent( _config.redirectAfterAccountCreationUrl);
                } else {
                    queryString += '&redirectAfterAccountCreationUrl=' + encodeURIComponent(jQuery.getHost() + _config.redirectAfterAccountCreationUrl);
                }
            } else if (_config.redirectAfterAccountLoginUrl) {
                if (_config.redirectAfterAccountLoginUrl.indexOf('http') == 0) {
                    queryString += '&redirectAfterAccountCreationUrl=' + encodeURIComponent(_config.redirectAfterAccountLoginUrl);
                } else {
                    queryString += '&redirectAfterAccountCreationUrl=' + encodeURIComponent(jQuery.getHost() + _config.redirectAfterAccountLoginUrl);
                }
            }
            queryString += '&gauthHost='            + encodeURIComponent(_config.gauthHost);
            queryString += '&locale='               + _config.locale;
            queryString += '&id='                   + _config.id;
            if (_config.cssUrl) {
                queryString += '&cssUrl='           + encodeURIComponent(_config.cssUrl);
            }
            if (_config.productSupportUrl) {
                queryString += '&productSupportUrl='   + encodeURIComponent(_config.productSupportUrl);
            }
            if (_config.termsOfUseUrl) {
                queryString += '&termsOfUseUrl='       + encodeURIComponent(_config.termsOfUseUrl);
            }
            if (_config.privacyStatementUrl) {
                queryString += '&privacyStatementUrl=' + encodeURIComponent(_config.privacyStatementUrl);
            }
            if (_config.customerId) {
                queryString += '&customerId='       + _config.customerId;
            }
            queryString += '&clientId='             + _config.clientId;
            queryString += '&rememberMeShown='      + _config.rememberMeShown;
            queryString += '&rememberMeChecked='    + _config.rememberMeChecked;
            queryString += '&createAccountShown='   + _config.createAccountShown;
            queryString += '&openCreateAccount='    + _config.openCreateAccount;
            queryString += '&usernameShown='        + _config.usernameShown;
            queryString += '&displayNameShown='     + _config.displayNameShown;
            queryString += '&consumeServiceTicket=' + _config.consumeServiceTicket;
            queryString += '&initialFocus='         + _config.initialFocus;
            queryString += '&embedWidget='          + _config.embedWidget;
            if (!_config.socialEnabled) {
                queryString += '&socialEnabled='        + _config.socialEnabled;
            }

            source           = gauthHost + '/login?'            + queryString;
            createAccountUrl = '/createNewAccount?' 			+ queryString;

            consoleInfo("gauth-widget.js loadGAuth(): source: " + source);
            consoleInfo("gauth-widget.js loadGAuth(): createAccountUrl: "  + createAccountUrl);

            if (_config.embedWidget) {
                consoleInfo("gauth-widget.js loadGAuth(): Setting document.location.href to '" + source + "'");
                document.location.href = source;
            } else {
                //append iframe
                consoleInfo("gauth-widget.js loadGAuth(): Calling appendIFrame('" + source + "'");
                appendIFrame(gauth_div, source);

                //trigger error event if it takes longer than configured timeout.
                timeout = setTimeout(
                    function(){
                        GAUTH_Events.error({"status":"error", "errorDetails":"No response from the server in " + LOAD_TIMEOUT_SEC + " seconds."});
                    },LOAD_TIMEOUT_SEC * 1000);
            }
        },
        
        init : function(config) {
            try{
                validateRequired(config);
                
                loadCSS(gauthHost + '/css/gauth-widget.css?20120530');
                
                // setup a callback to handle the dispatched MessageEvent. if window.postMessage is supported the passed
                // event will have .data, .origin and .source properties. otherwise, it will only have the .data property.
                XD.receiveMessage(function(m) {
                    //need to implement custom eventing
                    if (m && m.data) {
                        var md = m.data;
                        if (typeof(md) === 'string') {
                            md = JSON.parse(m.data);
                        }
                        //process events from the gauth
                        GAUTH_Events.messagePosted(md);
                        if (md.gauthInitHeight) {

                            // hide loading icon, if not already hidden.
                            if (gauthLoadingDiv && gauth_div) {
                                gauth_div.removeChild(gauthLoadingDiv);
                                gauthLoadingDiv = undefined;
                            }

                            clearTimeout(timeout);

                            //reset iframe height to match content
                            consoleInfo("gauth-widget.js: Initializing gauth height to: " + md.gauthInitHeight);
                            gauthIframe.style.height = md.gauthInitHeight + 20 + "px";
                        
                        // If the message sent is to open up an iframe.
                        } else if (md.openLiteBox) {
                        	
                            consoleInfo("gauth-widget.js: Opening lite box, ID: [" + md.openLiteBox + "], URL: [" + md.popupUrl + "], TITLE: [" + md.popupTitle + "], LOGINPROVIDER: [" + md.loginProviderName + "], CLIENTID: [" + md.clientId + "]");

                        	// Load PopupUrl in Iframe.
                        	loadPopupInDialogBox(md.popupUrl, md.popupTitle);
                        	
                            var is_provider_qq    = md.loginProviderName == 'qq';
                            var is_client_connect = md.clientId == 'GarminConnect'
                                                 || md.clientId == 'GarminExpressConnect'
                                                 || md.clientId == 'GarminConnectMobileAndroid'
                                                 || md.clientId == 'GarminConnectMobileiOS';
                            
                        	// Check to see what iframe needs to be opened and accordingly pass the height and width of the liteBox in which the iframe needs to be displayed.
                        	if (md.openLiteBox == 'createAccountLink') {
                                showLightBox(600 + (is_client_connect ? 100 : 0), 850); return false;
                        	} else if (md.openLiteBox == 'createAccountOrlinkSocialAccount') {
                                showLightBox(300 + (is_provider_qq ? 100 : 0), 850); return false;
                        	} else if (md.openLiteBox == 'createSocialAccount') {
                                showLightBox(500 + (is_client_connect ? 100 : 0) + (is_provider_qq ? 100 : 0), 850); return false;
                        	} else if (md.openLiteBox == 'linkSocialAccount') {
                        		showLightBox(400, 850); return false;
                        	}
                        	
                        // Else if the message sent is to close the gauth light box,
                        } else if (md.closeLiteBox) {

                            consoleInfo("gauth-widget.js: Closing lite box...");
                            hideLightBox();
                            if (md.username) {
                                // Tell casLoginView.jsp to load username into GAuth login username field & focus in password field.
                                GAUTH.send({'setUsername':'1','username':md.username});
                            }

                        } else if (md.gauthHeight) {

                            //reset iframe height to match content
                            consoleInfo("gauth-widget.js: Resizing gauth to md.gauthHeight: " + md.gauthHeight);
                            gauthIframe.style.height = md.gauthHeight + 20 + "px";

                        } else if (md.fullPageSocialAuth) {

                            consoleInfo( "gauth-widget.js: Redirecting to full page social auth for provider [" + md.provider + "], redirectURL [" + md.redirectURL + "]...");

                            var social_auth_url = getGAuthHost() + '/socialAuth?provider=' + md.provider + '&redirectURL=' + md.redirectURL;
                            consoleInfo("gauth-widget.js: Setting document.location.href to '" + social_auth_url + "'");
                            document.location.href = social_auth_url;

                        } else if (md.status) {
                            var st = md.status;
                            switch(st) {
                                case 'SUCCESS':
                                    if(target) window.location.href = target + "?serviceTicket=" + md.serviceTicket;
                                    else GAUTH_Events.success(md);
                                    break;
                                case 'FAIL':
                                    GAUTH_Events.fail(md);
                                    break;
                                case 'ACCOUNT_LOCKED':
                                    GAUTH_Events.locked(md);
                                    break;
                                case 'ACCOUNT_PROBLEM':
                                    GAUTH_Events.problem(md);
                                    break;
                                default:
                                    GAUTH_Events.error(md);
                            }
                        }
                    }
                }, getGAuthHostOnly());
            } catch(e){
                GAUTH_Events.error({errorDetails:e});
            }
        },
        
        send : function(data){
            consoleInfo("gauth-widget.js send(): message: [" + JSON.stringify(data) + "]");
            consoleInfo("gauth-widget.js send(): target_url: [" + source + "]}");
            window.XD.postMessage(data, source, document.getElementById('gauth-widget-frame').contentWindow);
            return false;
        },

        // Check to see if the user is authenticated with the SSO infrastructure.
        // Sends an AUTHENTICATED event with service ticket & sevice url if logged on. Otherwise throws NOT_AUTHENTICATED event.
		checkAuthentication : function() {
			var service_ticket_url;
            if (_config.embedWidget) {
                service_ticket_url = getGAuthHost() + '/login?manual&service=' + encodeURIComponent(jQuery.removeRequestParameters(document.location.href));
            } else {
                service_ticket_url = getGAuthHost() + '/login?manual&service=' + encodeURIComponent(document.location.href);
            }

            if (_config.callBackWebHostUrl) {
                service_ticket_url += '&webhost=' + encodeURIComponent(_config.callBackWebHostUrl);
            }
            consoleInfo('gauth-widget.js: checkAuthentication(): Loading ajax jsonp URL: [' + service_ticket_url + ']');
            jQuery.ajax({
              url: service_ticket_url,
              dataType: 'jsonp',
              error: function(xhr, status, error) {
                  consoleError('gauth-widget.js: checkAuthentication(): Error loading ajax jsonp URL: [' + service_ticket_url + ']! Error: ' + error);
                  GAUTH_Events.error({"status":"ERROR", "errorDetails":error});
              },
              success: function( data, status, xhr ) {
                  consoleInfo('gauth-widget.js: checkAuthentication(): Success loading ajax jsonp url. data: [' + data + ']');
                  var userdata = data;
                  if (typeof(userdata) === 'string') {
                      userdata = JSON.parse(data);
                  }
                  consoleInfo('gauth-widget.js: checkAuthentication(): serviceTicketId: [' + userdata.serviceTicketId
                                                                  + '], serviceUrl: ['      + userdata.serviceUrl + ']');
                  if (userdata.serviceTicketId) {
                      GAUTH_Events.authenticated({'status':'AUTHENTICATED', 'serviceTicket':userdata.serviceTicketId, 'serviceUrl':userdata.serviceUrl});
                  } else {
                      GAUTH_Events.not_authenticated({'status':'NOT_AUTHENTICATED'});
                  }
              }
            });
		},
		
		//Modified the normal account creation popup to behave as a LiteBox popup. Also added Title for the Iframe.
        openCreateAccount : function(title) {
        	
            consoleInfo("gauth-widget.js: openCreateAccount(): Opening create account iFrame.");

        	if(!title){
        		title = '';
        	}
		
        	loadPopupInDialogBox(createAccountUrl, title);
        	
        	showLightBox(800, 850); return false;
        }
	};
}();

//Loads lightboxes
function loadLightBoxes() {

    var fragment = document.createDocumentFragment();

	//Dynamically create a div 'gauth-light-box' So that we dont have to modify each and every login page for this.
	var light_box_dialog       = document.createElement("div");
	light_box_dialog.id        = "gauth-light-box";
	light_box_dialog.className = "LB-white-content";
	fragment.appendChild(light_box_dialog);
	
	//Dynamically create div 'light_box_fade' So that we dont have to modify each and every login page for this.
	var light_box_fade       = document.createElement("div");
	light_box_fade.id        = "light_box_fade";
	light_box_fade.className = 'LB-black-overlay';

	//Set height and widthe of fade div.
	light_box_fade.style.height = document.body.offsetHeight + 20 > screen.height ? document.body.offsetHeight + 20 + 'px' : screen.height + 'px';
	if (typeof document.body.style.maxHeight === "undefined") {// For IE6
		light_box_fade.style.width =  document.body.scrollWidth + 20 + 'px';
	} else {// For other browsers
		light_box_fade.style.width =  '100%';
	}
    fragment.appendChild(light_box_fade);

    // append everything at once... it's faster...
    document.body.appendChild(fragment);
}

jQuery(document).ready(function() {
    loadLightBoxes();
});

//This will show a loaded lightBox.
function showLightBox(height, width) {
	
	//Dynamically apply styles to the lightBox.
    var lightbox_div = document.getElementById('gauth-light-box');
	lightbox_div.style.display = 'block';
	lightbox_div.style.height = height+'px';
	lightbox_div.style.width = width+'px';
	lightbox_div.style.position = 'absolute';
	lightbox_div.style.left = '50%';
	lightbox_div.style.top = '50%';
	
	var marginLeft = width/2;
	var marginTop = height/2;
	
	//Check if we have a margin on the top and left of the window.
	var availableTop = vpHeight()/2;
	var availableLeft = vpWidth()/2;
	
	//Apply Min of availableTop, AvailableLeft OR marginLeft, marginTop. 
	lightbox_div.style.marginTop = '-'+Math.min(availableTop, marginTop)+'px';
	lightbox_div.style.marginLeft = '-'+Math.min(availableLeft, marginLeft)+'px';
    var light_box_fade = document.getElementById('light_box_fade');
    if (light_box_fade) {
	    light_box_fade.style.display = 'block';
    }
	
	if (typeof document.body.style.maxHeight === "undefined") {// For IE6(Hide all select box tag)
		select_boxes = document.getElementsByTagName('select');
		for (var i = 0; i < select_boxes.length; i++) {
		    select_boxes[i].style.visibility = 'hidden';
        }
	}
	
	//scroll the window to the top.
	window.scrollTo(0, 0);
	
	lightbox_div.focus();
} 

// Function to hide the light Box.
function hideLightBox() {

    consoleInfo("gauth-widget.js: hideLightBox(): Entering function.");

    var gauth_light_box = document.getElementById('gauth-light-box');
	if (gauth_light_box) {
		gauth_light_box.style.display = 'none';
        var light_box_fade = document.getElementById('light_box_fade');
        if (light_box_fade) {
		    light_box_fade.style.display = 'none';
        }
		//Reclaim memory taken by the iframe.
		purge(document.getElementById('popup-iframe-id'));
//		gauth_light_box.removeChild(document.getElementById('popup-iframe-id')); // TODO: Temporarily skip removal.
	}
	
	if (typeof document.body.style.maxHeight === "undefined") { // For IE6(Shows all select box tag)
		select_boxes = document.getElementsByTagName('select');
		for (var i = 0, len = select_boxes.length; i < len; i++) {
			select_boxes[i].style.visibility = 'hidden';
		}
	}

}

//Gets the width of the view port window (browsers view window)
function vpWidth() {
	return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

//Gets the height of the view port window (browsers view window)
function vpHeight() {
	return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

//The purge function takes a reference to a DOM element as an argument. It loops through the element's attributes. 
//If it finds any functions, it nulls them out. This breaks the cycle, allowing memory to be reclaimed. 
//It will also look at all of the element's descendent elements, and clear out all of their cycles as well.
function purge(d) {
    var a, i, l, n;
    if (d) {
        a = d.attributes;
        if (a) {
            for (i = a.length - 1; i >= 0; i -= 1) {
                n = a[i].name;
                if (typeof d[n] === 'function') {
                    d[n] = null;
                }
            }
        }
        a = d.childNodes;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                purge(d.childNodes[i]);
            }
        }
    }
}

jQuery.extend({
	getUrlVars: function(){
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},
	getUrlVar: function(name){
		return jQuery.getUrlVars()[name];
	},
	getHost: function(){
		pathArray = window.location.href.split( '/' );
		return pathArray[0]+ '//' + pathArray[2];
	},
	removeRequestParameters: function(documentLocationHref){
        if (documentLocationHref.indexOf("?") != -1) {
		    return documentLocationHref.slice(0, documentLocationHref.indexOf('?'));
        } else {
            return documentLocationHref;
        }
	}
});

// ------ BEGIN json2.js ------ //
/*
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
// ------ END json2.js ------ //

// ------ BEGIN postmessage.js ------ //
/*
 * Requires json2.js
 *
 * a backwards compatable implementation of postMessage
 * by Josh Fraser (joshfraser.com)
 * update by Bobby Hubbard - customization to support json messages
 *
 * released under the Apache 2.0 license.
 *
 * this code was adapted from Ben Alman's jQuery postMessage code found at:
 * http://benalman.com/projects/jquery-postmessage-plugin/
 *
 * other inspiration was taken from Luke Shepard's code for Facebook Connect:
 * http://github.com/facebook/connect-js/blob/master/src/core/xd.js
 *
 * the goal of this project was to make a backwards compatable version of postMessage
 * without having any dependency on jQuery or the FB Connect libraries
 *
 * my goal was to keep this as terse as possible since my own purpose was to use this
 * as part of a distributed widget where filesize could be sensative.
 *
 */

// everything is wrapped in the XD function to reduce namespace collisions
var XD = function(){

    var interval_id,
    last_hash,
    cache_bust = 1,
    attached_callback,
    window = this;

    return {
        postMessage : function(message, target_url, target) {

            if (!target_url) {
                return;
            }

            target = target || parent;  // default to parent

            if (window['postMessage']) {

                // Posting to the Gauth login form (served by spring webflow) after session timeout
                // redisplays the login form, but seems to encode every parameter unnecessarily a 2nd time.
                // Check for this and only decode if needed.
                if (target_url.indexOf("%253A%252F%252F") >= 0) {
                    target_url = decodeURIComponent(target_url);
                    consoleInfo('gauth-widget.js: decoded over-encoded target_url to: [' + target_url + ']');
                }

                // the browser supports window.postMessage, so call it with a targetOrigin
                // set appropriately, based on the target_url parameter.
            	var newURL      = target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1');
            	var jsonMessage = JSON.stringify(message);

                consoleInfo('gauth-widget.js: newURL: [' + newURL + '], jsonMessage: [' + jsonMessage + ']');

                target['postMessage'](jsonMessage, newURL);
            } else if (target_url) {
                // the browser does not support window.postMessage, so set the location
                // of the target to target_url#message. A bit ugly, but it works! A cache
                // bust parameter is added to ensure that repeat messages trigger the callback.
                target.location = target_url.replace(/#.*$/, '') + '#' + (+new Date) + (cache_bust++) + '&' + JSON.stringify(message);
            }
        },

        receiveMessage : function(callback, source_origin) {

            // browser supports window.postMessage
            if (window['postMessage']) {
                // bind the callback to the actual event associated with window.postMessage
                if (callback) {
                    attached_callback = function(e) {
                        if ((typeof source_origin === 'string' && e.origin !== source_origin)
                        || (Object.prototype.toString.call(source_origin) === "[object Function]" && source_origin(e.origin) === !1)) {
                            return !1;
                        }
                        callback(e);
                    };
                }
                if (window['addEventListener']) {
                    window[callback ? 'addEventListener' : 'removeEventListener']('message', attached_callback, !1);
                } else {
                    window[callback ? 'attachEvent' : 'detachEvent']('onmessage', attached_callback);
                }
            } else {
                // a polling loop is started & callback is called whenever the location.hash changes
                interval_id && clearInterval(interval_id);
                interval_id = null;

                if (callback) {
                    interval_id = setInterval(function(){
                        var hash = document.location.hash,
                        re = /^#?\d+&/;
                        if (hash !== last_hash && re.test(hash)) {
                            last_hash = hash;
                            callback({"data": JSON.parse(decodeURIComponent(hash.replace(re, '')))});
                        }
                    }, 100);
                }
            }
        }
    };
}();
// ------ END postmessage.js ------ //

// ------ Based on "Custom events in JavaScript": http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/ ------ //

//Copyright (c) 2010 Nicholas C. Zakas. All rights reserved.
//MIT License

function EventTarget(){
    this._listeners = {};
}

EventTarget.prototype = {

    constructor: EventTarget,

    addListener: function(type, listener){
        if (typeof this._listeners[type] == "undefined"){
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
    },

    fire: function(event, data){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){  //falsy
            throw new Error("Event object missing 'type' property.");
        }

        if (this._listeners[event.type] instanceof Array){
            var listeners = this._listeners[event.type];
            for (var i=0, len=listeners.length; i < len; i++){
                listeners[i].call(this, event, data);
            }
        }
    },

    removeListener: function(type, listener){
        if (this._listeners[type] instanceof Array){
            var listeners = this._listeners[type];
            for (var i=0, len=listeners.length; i < len; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
};

//Event Registry
function EventReg(){
	EventTarget.call(this);
}

EventReg.prototype = new EventTarget();
EventReg.prototype.constructor = EventReg;
EventReg.prototype.not_authenticated = function(d){
	this.fire("NOT_AUTHENTICATED", d);
};
EventReg.prototype.authenticated = function(d){
	this.fire("AUTHENTICATED", d);
};
EventReg.prototype.success = function(d){
	this.fire("SUCCESS", d);
};
EventReg.prototype.error = function(d){
	this.fire("ERROR", d);
};
EventReg.prototype.fail = function(d){
	this.fire("FAIL", d);
};
EventReg.prototype.locked = function(d){
	this.fire("ACCOUNT_LOCKED", d);
};
EventReg.prototype.problem = function(d){
	this.fire("ACCOUNT_PROBLEM", d);
};
EventReg.prototype.messagePosted = function(d){
	this.fire("MESSAGE-POSTED", d);
};

var GAUTH_Events = new EventReg();

GAUTH_Events.addListener("NOT_AUTHENTICATED", function(e, d){
    consoleInfo('gauth-widget.js: [NOT_AUTHENTICATED event triggered]');
});

GAUTH_Events.addListener("AUTHENTICATED", function(e, d){
    consoleInfo('gauth-widget.js: [AUTHENTICATED event triggered] '
                + 'serviceTicket: [' + d.serviceTicket
                + '], serviceUrl: ['    + d.serviceUrl + ']');
});

GAUTH_Events.addListener("SUCCESS", function(e, d){
    consoleInfo("gauth-widget.js: [SUCCESS event triggered]");
});

GAUTH_Events.addListener("ERROR", function(e, d){
    consoleInfo("gauth-widget.js:  [ERROR event triggered] " + "errorDetails: ["  + d. errorDetails + "]");
});

GAUTH_Events.addListener("FAIL", function(e, d){
    consoleInfo("gauth-widget.js:  [FAIL event triggered] " + "failDetails: ["  + d. failDetails + "]");
});

GAUTH_Events.addListener("ACCOUNT_LOCKED", function(e, d){
    consoleInfo("gauth-widget.js: [ACCOUNT_LOCKED event triggered]");
});

GAUTH_Events.addListener("ACCOUNT_PROBLEM", function(e, d){
    consoleInfo("gauth-widget.js: [ACCOUNT_PROBLEM event triggered]");
});

