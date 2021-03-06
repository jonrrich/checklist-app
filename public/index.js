document.cookie = "token=;";    // Clear cookies on home page access

Vue.use(VueToast, { position: "bottom", duration: 10000 });

var app = new Vue({

  el: "#app",

  data: {
    login_email: "",
    login_plaintextPassword: "",

    signup_name: "",
    signup_email: "",
    signup_plaintextPassword: "",
    signup_isAdmin: false
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

        window.location.href = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/projects.html";  // redirect to projects page
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
        "plaintextPassword": this.signup_plaintextPassword,
        "isAdmin": this.signup_isAdmin
      }

      axios.post("/api/users", data)
      .then((response) => {

        this.signup_name = "";
        this.signup_email = "";
        this.signup_plaintextPassword = "";
        this.signup_isAdmin = false;

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
