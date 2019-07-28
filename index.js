const user_gid = '1001152530532638';
const proj_gid = '1133011438610423'; // Weekly Edits
const dvd_section_gid = '1133011438610435'; // CD / DVD
const yt_section_gid = '1133011438610436';
const { query, createTask, addTaskToSection } = require('./requests');
const moment = require('moment');

const getData = () => {
  query(`/projects/${proj_gid}/sections`, res => {
    console.log(res);
  });
};

const formatDate = date => moment(date).format('YY.M MMM DD');

const dueDate = (date, day) => {
  const week_inc = Number(day === 'Sunday');
  return moment(date)
    .add(week_inc, 'weeks')
    .isoWeekday(day)
    .format('YYYY-MM-DD');
};

/**
 * Generates the tasks for a given Sunday, or this Sunday
 */
const generateTasks = async (date = moment().startOf('week')) => {
  try {
    // Create DVD and YT tasks
    const [{ gid: dvd_task_gid }, { gid: yt_task_gid }] = await Promise.all(
      ['dvd', 'yt'].map(type =>
        createTask({
          assignee: user_gid,
          projects: [proj_gid],
          name: formatDate(date),
          due_on:
            type === 'dvd'
              ? dueDate(date, 'Sunday')
              : dueDate(date, 'Wednesday')
        })
      )
    );

    // Create subtasks
    await Promise.all(
      ['8am', '11am'].map(name =>
        createTask({
          assignee: user_gid,
          parent: dvd_task_gid,
          name,
          due_on:
            name === '8am'
              ? dueDate(date, 'Sunday')
              : dueDate(date, 'Wednesday')
        })
      )
    );

    await Promise.all([
      addTaskToSection(dvd_task_gid, dvd_section_gid),
      addTaskToSection(yt_task_gid, yt_section_gid)
    ]);

    console.log('Done');
  } catch (e) {
    console.error(e);
  }
};

const main = () => generateTasks();

// TODO: Populate project with tasks from old project version
// const fill = () => {};

// Handler for AWS Lambda
exports.handler = main;

main();

// getData();
// const date = moment().startOf('week');
// console.time('t');
// createTask({
//   assignee: user_gid,
//   projects: [proj_gid],
//   name: formatDate(date),
//   due_at: moment().valueOf()
// }).then(r => {
//   console.log(r);
//   console.timeEnd('t');
// });
