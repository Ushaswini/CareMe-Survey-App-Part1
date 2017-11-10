function ViewModel() {
    var self = this;

    var tokenKey = 'accessToken';

    self.result = ko.observable();
    self.user = ko.observable();

    self.registerPassword = ko.observable();
    self.registerPassword2 = ko.observable();

    self.username = ko.observable();
    self.firstname = ko.observable();
    self.lastname = ko.observable();
    self.email = ko.observable();

    self.newname = ko.observable();
    self.newage = ko.observable();
    self.newweight = ko.observable();
    self.newaddress = ko.observable();
    self.newpassword = ko.observable();
    self.newpassword2 = ko.observable();
    self.oldpassword = ko.observable();

    self.loginEmail = ko.observable();
    self.loginPassword = ko.observable();
    self.errors = ko.observableArray([]);

    function showError(jqXHR) {
        console.log(jqXHR);
        self.result(jqXHR.status + ': ' + jqXHR.statusText);

        var response = jqXHR.responseJSON;
        if (response) {
            if (response.Message) self.errors.push(response.Message);
            if (response.ModelState) {
                var modelState = response.ModelState;
                for (var prop in modelState) {
                    if (modelState.hasOwnProperty(prop)) {
                        var msgArr = modelState[prop]; // expect array here
                        if (msgArr.length) {
                            for (var i = 0; i < msgArr.length; ++i) self.errors.push(msgArr[i]);
                        }
                    }
                }
            }
            if (response.error) self.errors.push(response.error);
            if (response.error_description) self.errors.push(response.error_description);
        }
    }

    self.callApi = function () {
        self.result('');
        self.errors.removeAll();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        $.ajax({
            type: 'GET',
            url: 'api/Account/UserInfo',
            //url: '/api/values',
            headers: headers
        }).done(function (data) {
            self.result(data.Name + " of age " + data.Age + " and weight " + data.Weight + " kgs stays at " + data.Address + ".");
        }).fail(showError);
    }

    self.register = function () {
        self.result('');
        self.errors.removeAll();

        var data = {
            Email: self.email(),
            UserName: self.username(),
            Password: self.registerPassword(),
            ConfirmPassword: self.registerPassword2(),
            FirstName: self.firstname(),
            LastName: self.lastname(),

        };
        var headers = {};
        var token = sessionStorage.getItem(tokenKey);
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        $.ajax({
            type: 'POST',
            url: '/api/Account/AddUser',
            headers: headers,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data)
        }).done(function (data) {
            self.result("Done!");
        }).fail(showError);
    }

    self.login = function () {
        self.result('');
        self.errors.removeAll();

        var loginData = {
            grant_type: 'password',
            username: self.loginEmail(),
            password: self.loginPassword()
        };

        $.ajax({
            type: 'POST',
            url: '/oauth2/token',
            data: loginData
        }).done(function (data) {
            self.user(data.userName);
            console.log(data.access_token);
            // Cache the access token in session storage.
            sessionStorage.setItem(tokenKey, data.access_token);
            window.location.href = 'Admin/Dashboard';
        }).fail(showError);
    }

    self.logout = function () {
        // Log out from the cookie based logon.
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        $.ajax({
            type: 'POST',
            url: '/api/Account/Logout',
            headers: headers
        }).done(function (data) {
            // Successfully logged out. Delete the token.
            self.user('');
            sessionStorage.removeItem(tokenKey);
        }).fail(showError);
    }





}

var app = new ViewModel();
ko.applyBindings(app);