export default class User {
	constructor(JWT, AppConstants, $http, $state, $q) {
		'ngInject';

		this._JWT = JWT;
		this._AppConstants = AppConstants;
		this._$http = $http;
		this._$state = $state;
		this._$q = $q;

		//Object to store our user properties
		this.current = null;
	}

	//Try to authenticate by registering or loggin in
	attemptAuth(type, credentials) {
		let route = (type === 'login') ? '/login' : '';
		return this._$http({
			url: this._AppConstants.api + '/users' + route,
			method: 'POST',
			data: {
				user: credentials
			}
		}).then(
			//On success
			(res) => {
				//Set the JWT token
				this._JWT.save(res.data.user.token);
				//Store the user's info for easy lookup
				this.current = res.data.user;

				return res;
			}
		)
	}

	logout() {
		this.current = null;
		this._JWT.destroy();
		//Do a hard reload of the page to ensure data is flushed
		this._$state.go(this._$state.$current, null, {reload: true });
	}

	verifyAuth() {
		let deferred = this._$q.defer();

		//Check for JWT token first
		if (!this._JWT.get()) {
			deferred.resolve(false);
			return deferred.promise;
		}

		//If there's a JWT & user is already set
		if (this.current) {
			deferred.resolve(true);

		// If current user isn't set, get it from the server.
		//If server doesn't 401, set current user & resolve promise.
		} else {
			this._$http({
				url: this._AppConstants.api + '/user',
				method: 'GET'
			}).then(
				(res) => {
					this.current = res.data.user;
					deferred.resolve(true);
				},
				//If an error happens, that means the user's token was invalid.
				(err) => {
					this._JWT.destroy();
					deferred.resolve(false);
				},
				//Reject automactically handled by auth interceptor
				//Will boot them to homepage
			);
		}

		return deferred.promise;
	}

	//This method will be used by UI-Router resolves
	ensureAuthIs(bool) {
		let deferred = this._$q.defer();

		this.verifyAuth().then((authValid) => {
			//if it's the opposite, redirect home
			if (authValid !== bool) {
				this._$state.go('app.home');
				deferred.resolve(false);
			} else {
				deferred.resolve(true);
			}
		})

		return deferred.promise;
	}

	//Update the current user's name, email, password, etc
	update(fields) {
		return this._$http({
			url: this._AppConstants.api + '/user',
			method: 'PUT',
			data: { user: fields }
		}).then(
			(res) => {
				this.current = res.data.user;
				return res.data.user;
			}
		);
	}
















}