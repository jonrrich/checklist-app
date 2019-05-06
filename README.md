# checklist-app

by Jonathan Rich



## Installation

1. Open Terminal / Command Prompt

2. Type `node -v`. If a version number is printed, continue to the next step. Otherwise, install NodeJS [here](https://nodejs.org/en/).

3. Clone this repository to your local machine. Remember the path it is saved at.

4. Change directory to where you saved this repo. (`cd /path/to/checklist-app`)

5. Type `npm install`.


## Running

1. Open Terminal / Command Prompt

2. Change directory to where you saved this repo. (`cd /path/to/checklist-app`)

3. Type `npm start` to run the server on port 8080. To run on a port such as 8081 instead, type `npm start -- --port 8081`. (Note the extra set of `--`. To run on a port lower than 1024, you may need to run as administrator.)

4. Wait for the program to output `Ready.`

5. Navigate to `http://localhost:8080/` in your web browser. (Or the different port you chose)


# Sample database

I have included two sample accounts for you to quickly get started without the need to make your own accounts.

```
Username: user@example.com
Password: user

Username: admin@example.com
Password: admin
```

# General Usage

To navigate between pages, use the navigation bar at the top of the page. Clicking "Home" will log you out.

To add projects or tasks, use the "Add Project" and "Add Task" buttons. To mark a task as complete, click the checkmark beside it.

Your recently completed tasks will automatically appear near the bottom of the page.

As an admin, you can view and edit another user's projects by entering their email in the field near the top of the page, and then clicking "View/Edit other user's work".

