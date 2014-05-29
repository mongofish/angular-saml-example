var app = angular.module("app", ["auth.saml", "ondeck.common"]);

app.controller("init", function($scope, samlClient) {
	samlClient.init({
		"idpUrl":"https://fs.ondeck.com/adfs/ls/",
		"callbackUrl":"https://rpm.newrelic.com:443/accounts/127903/sso/saml/finalize",
		"issuer":"rpm.newrelic.com"
	});
	$scope.login = function() {
		samlClient.login();
	}
});