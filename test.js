const user_gid = '1001152530532638';
const proj_gid = '1133011438610423'; // Weekly Edits
const dvd_section_gid = '1133011438610435'; // CD / DVD
const yt_section_gid = '1133011438610436';
const { handler: main } = require('./index');
const {
  query,
  createTask,
  addTaskToSection,
  setDueDate
} = require('./requests');
const moment = require('moment');

const getData = () => {
  query(`/projects/${proj_gid}/sections`, res => {
    console.log(res);
  });
};

main();

// getData();

// const date = moment().startOf('week');
// console.time('t');
// createTask({
//   assignee: user_gid,
//   projects: [proj_gid],
//   name: formatDate(date),
//   due_at: moment().toISOString()
// })

// setDueDate('1133182700208770', moment().format('YYYY-MM-DD'))
//   .then(r => {
//     console.log(r);
//   })
//   .catch(e => {
//     console.error(e);
//   });
