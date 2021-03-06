class SettingsCtrl {
	constructor(User, $state) {
		'ngInject';

		this._User = User;
		this._$state = $state;

		this.formData = {
			email: User.current.email,
			bio: User.current.bio,
			image: User.current.image,
			username: User.current.username
		};

		//Bind is required because the logout method assumes
		//the execution context is within the User Object.
		this.logout = User.logout.bind(User);
		//Can also use
		//logout() { this.User.logout() };
	}

	submitForm() {
		this.isSubmitting = true;
		this._User.update(this.formData).then(
			(user) => {
				console.log('success');
				this.isSubmitting = false;
			},
			(err) => {
				this.isSubmitting = false;
				this.errors = err.data.errors;
			}
		)
	}
		
}

export default SettingsCtrl;