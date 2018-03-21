const { execFile } = require('child_process');
const sendMail = require('./utils/sendMail.js');


const child = execFile('node', ['./services/betfair.js'], (error, stdout, stderr) => {
  if (error) { throw error; }
  else {
    if (stderr) {
      // console.log('stderr');
      // console.log(stderr)
      sendMail(stderr, 'Hold on, Something aint right!!')

    } else {
      // console.log(stdout)
      // console.log('stdout')
      // console.log(stdout);
      sendMail(stdout, 'Good to Go')
    }

  }
})