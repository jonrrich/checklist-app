Vue.use(VueToast, { position: "bottom", duration: 10000 });

var app = new Vue({

  el: "#app",

  data: {
    login_email: "",
    login_plaintextPassword: "",

    signup_name: "",
    signup_email: "",
    signup_plaintextPassword: ""
  },

  methods: {

    tryLogin: function () {

      var data = {
        "email": this.login_email,
        "plaintextPassword": this.login_plaintextPassword
      }

      axios.post("/api/sessions", data)
      .then((response) => {

        var token = response.data;

        document.cookie = `token=${token};path=/`;  // Set a cookie with the session token

        Vue.$toast.success("ok");
      })
      .catch((error) => {

        if (error && error.response && error.response.status == 403) {  // If 403 Forbidden, bad login
          Vue.$toast.error("Incorrect email or password. Please try again.");
        }
        else {
          Vue.$toast.error("Something went wrong.");
        }

      });
    },

    trySignup: function () {

      var data = {
        "name": this.signup_name,
        "email": this.signup_email,
        "plaintextPassword": this.signup_plaintextPassword
      }

      axios.post("/api/users", data)
      .then((response) => {

        Vue.$toast.success("Signup successful! You may now log in.");
      })
      .catch((error) => {

        if (error && error.response && error.response.status == 409) {  // If 409 conflict, username already taken
          Vue.$toast.error("This email is already taken. Choose a different email.");
        }
        else {
          Vue.$toast.error("Something went wrong.");
        }

      })
    }
  }
});
