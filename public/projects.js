Vue.use(VueToast, { position: "bottom", duration: 10000 });
Vue.use(VuejsDialog.main.default);

var app = new Vue({

  el: "#app",

  created: function () {

    axios.get("/api/me")    // Load logged in user information
    .then((data) => {

      var userData = data.data;

      this.name = userData.name;
      this.email = userData.email;
      this.isAdmin = userData.isAdmin;

      this.projects_email = userData.email;

      axios.get("/api/projects?email=" + this.email)   // Load logged in user's projects
      .then((data) => {

        var projectData = data.data;

        this.projects = projectData;
      })
      .catch((error) => {

        if (error && error.response && error.response.status == 403) {  // If 403 Forbidden, not logged in
          window.location.replace(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/");
        }
        else {
          Vue.$toast.error("Something went wrong in loading your data.");
        }

      });
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
    isAdmin: false,

    other_email: "",

    projects_email: "",

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

    },

    switchProjectsUser: function (new_projects_email) {

      axios.get("/api/users?email=" + new_projects_email)
      .then((data) => {

        var userData = data.data;

        axios.get("/api/projects?email=" + new_projects_email)   // Load logged in user's projects
        .then((data) => {

          var projectData = data.data;

          this.projects_name = userData.name;
          this.projects_email = userData.email;
          this.projects = projectData;
        })
        .catch((error) => {

          if (error && error.response && error.response.status == 403) {  // If 403 Forbidden, not logged in
            window.location.replace(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/");
          }
          else {
            Vue.$toast.error("Something went wrong in loading your data.");
          }

        });

      })
      .catch((error) => {
        Vue.$toast.error("There is no user with the email you specified.");
      });

    },

    projectProgress: function (projectIndex) {

      var project = this.projects[projectIndex];

      var tasks = project.tasks;

      var totalTasks = tasks.length;
      var completedTasks = tasks.filter((task) => task.completed).length;

      return totalTasks == 0 ? 0 : Math.floor(100 * completedTasks / totalTasks);
    }
  },

  watch: {

    projects: {
      handler: function (newProjects, oldProjects) {

        axios.post("/api/projects", { "email": this.projects_email, "projects": newProjects })
        .catch(() => {

          Vue.$toast.error("Something went wrong in saving your work.");
        });
      },
      deep: true
    }
  },

  computed: {

    recentlyCompletedTasks: function () {

      var projects = this.projects;

      var completedTasks = [];
      for (var project of projects) {

        var tasks = project.tasks;
        for (var task of tasks) {
          if (!task.completed) continue;

          completedTasks.push({ projectName: project.name, taskName: task.name, complete_time: task.complete_time });
        }
      }

      completedTasks.sort((a, b) => b.complete_time - a.complete_time);   // Sort descending; i.e. most recent first

      return completedTasks;
    }
  }


});
