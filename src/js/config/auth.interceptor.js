function authInterceptor(JWT, AppConstants, $window, $q) {
	'ngInject';

	return {
		//automatically attach Authoriztion header
		request: function(config) {
			if (config.url.indexOf(AppConstants.api) === 0 && JWT.get()) {
				config.headers.Authorization = 'Token ' + JWT.get();
		}
		return config;
		},

		//Handle 401
		responseError: function(rejection) {
			if (rejection.status === 401) {
				//clear any JWT tocken being stored
				JWT.destroy();
				//do a heard page refresh
				$window.location.reload();
			}
			return $q.reject(rejection);
		}
	}
}

export default authInterceptor;