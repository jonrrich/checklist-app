Vue.use(VuejsDialog.main.default);

var app = new Vue({

  el: "#app",

  data: {

    email: "test@example.com",

    projects: [

      { name: "project 1", tasks: [{ name: "task 1", completed: false }, { name: "task 2", completed: false }] },
      { name: "project 2", tasks: [{ name: "task 3", completed: false }, { name: "task 4", completed: false }] }

    ]
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

        console.log(newProjects)
      },
      deep: true
    }
  }


});
