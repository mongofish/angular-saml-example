var app = angular.module("auth.saml", ["base64", "xml"]);
app.factory("samlClient", function($rootScope, $http, $base64, $location, xmlParser) {
	var client = {};
	var loginTemplate = '<samlp:AuthnRequest AssertionConsumerServiceURL="%%CALL_BACK_URL%%" Destination="%%IDP_URL%%" ID="_a442ee20-c96e-0131-46f4-10b11c51ccf5" IssueInstant="%%DATE%%" Version="2.0" xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"><saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">%%ISSUER%%</saml:Issuer><samlp:NameIDPolicy AllowCreate="true" Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"/><samlp:RequestedAuthnContext Comparison="exact" xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"><saml:AuthnContextClassRef xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef></samlp:RequestedAuthnContext></samlp:AuthnRequest>';
	client.init = function (config) {
		this.idpUrl =  config["idpUrl"];
		this.callbackUrl = config["callbackUrl"];
		this.issuer = config["issuer"];
		console.log(this);
	};
	client.login = function () {
		var payload = loginTemplate.replace("%%CALL_BACK_URL%%", this.callbackUrl);
		payload=payload.replace("%%IDP_URL%%", this.idpUrl);
		payload=payload.replace("%%DATE%%", new Date().toISOString());
		payload=payload.replace("%%ISSUER%%", this.issuer);
		console.log(payload);
		payload=$base64.encode(payload);
		window.location = this.idpUrl + "?SAMLRequest=" + payload;
	};
	client.processCallback = function () {
		var token = $location.search().SAMLResponse;
		console.log(token);
		if (token) {
			var decoded = $base64.decode(token+"==");
			console.log(decoded);
			var domElement = xmlParser.parse(decoded);
			console.log(domElement);
			$rootScope.username = domElement.getElementsByTagName("Assertion")[0].childNodes[4].childNodes[0].childNodes[0].innerHTML;
		}
	}
	return client;
});