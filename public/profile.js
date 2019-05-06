Vue.use(VueToast, { position: "bottom", duration: 10000 });

var app = new Vue({

  el: "#app",

  created: function () {

    axios.get("/api/me")    // Load logged in user information
    .then((data) => {

      var userData = data.data;

      this.name = userData.name;
      this.email = userData.email;
      this.isAdmin = userData.isAdmin;

    })
    .catch((error) => {

      if (error && error.response && error.response.status == 403) {  // If 403 Forbidden, not logged in
        window.location.replace(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/");
      }
      else {
        Vue.$toast.error("Something went wrong in loading your data.");
      }
    });
  },

  data: {
    name: "",
    email: "",
    isAdmin: false
  }

});
