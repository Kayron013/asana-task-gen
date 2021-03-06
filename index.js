const user_gid = '1001152530532638';
const proj_gid = '1133011438610423'; // Weekly Edits
const dvd_section_gid = '1133011438610435'; // CD / DVD
const yt_section_gid = '1133011438610436';
const services_section_gid = '1157019523363033';
const { createTask, addTaskToSection } = require('./requests');
const moment = require('moment');

/**
 * Returns a formatted date for task naming
 */
const formatDate = date => moment(date).format('YY.M MMM DD');

/**
 * Returns a formatted date of the following Wednesday or Sunday
 */
const dueDate = (date, day) => {
  const week_inc = Number(day === 0); // inc if Sunday
  return moment(date)
    .add(week_inc, 'weeks')
    .weekday(day)
    .format('YYYY-MM-DD');
};

/**
 * Generates the tasks for a given Sunday, or this Sunday
 */
const generateTasks = async (date = moment().startOf('week')) => {
  try {
    // Create task
    const { gid: task_gid } = await createTask({
      assignee: user_gid,
      projects: [proj_gid],
      name: `${formatDate(date)} Service`,
      due_on: dueDate(date, 3)
    });

    // Create subtasks
    await Promise.all(
      ['8am', '11am', 'YT Upload', 'Topic Log Entry'].map(name =>
        createTask({
          assignee: user_gid,
          parent: task_gid,
          name,
          due_on: dueDate(date, 3)
        })
      )
    );

    // Add main task to section
    await addTaskToSection(task_gid, services_section_gid);

    console.log('Done');
  } catch (e) {
    console.error(e);
  }
};

// Handler for AWS Lambda
exports.handler = generateTasks;
