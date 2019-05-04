Vue.use(VueToast, { position: "bottom", duration: 10000 });
Vue.use(VuejsDialog.main.default);

var app = new Vue({

  el: "#app",

  created: function () {

    axios.get("/api/me")    // Load logged in user information
    .then((data) => {

      var userData = data.data;

      if (!userData || !userData.email) {   // If no userData, not logged in, redirect back to home
        window.location.replace(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/");
      }

      else {
        this.email = userData.email;

        axios.get("/api/projects?email=" + this.email)   // Load logged in user's projects
        .then((data) => {

          var projectData = data.data;

          this.projects = projectData;
        })
        .catch(() => {

          Vue.$toast.error("Something went wrong in loading your data.");
        });
      }
    })
    .catch(() => {

      Vue.$toast.error("Something went wrong in loading your data.");
    });
  },

  data: {

    email: "",

    projects: []
  },

  methods: {

    taskUpdate: function (projectIndex, taskIndex) {

      var task = this.projects[projectIndex].tasks[taskIndex];

      task.complete_time = task.completed ? Date.now() : null;

    },

    addTask: function (projectIndex) {

      var project = this.projects[projectIndex];

      this.$dialog.prompt({
        title: "Add Task",
        body: "Enter the name of your task"
      })
      .then((dialog) => {

        var taskName = dialog.data;

        if (taskName) {
          project.tasks.push({ "name": taskName, completed: false, complete_time: null });
        }
      })
    },

    addProject: function () {

      this.$dialog.prompt({
        title: "Add New Project",
        body: "Enter the name of your new project"
      })
      .then((dialog) => {

          var projectName = dialog.data;

          if (projectName) {
            this.projects.push({ "name": projectName, "tasks": [] })
          }
      });

    }
  },

  watch: {

    projects: {
      handler: function (newProjects, oldProjects) {

        axios.post("/api/projects", { "email": this.email, "projects": newProjects })
        .catch(() => {

          Vue.$toast.error("Something went wrong in saving your work.");
        });
      },
      deep: true
    }
  }


});
