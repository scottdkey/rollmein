import Confirm from 'prompt-confirm'
const prompt = new Confirm("Doing this will destroy the production database. Are you sure you would like to continue? Y/N")
import {exec} from 'child_process'

async function sh(cmd){
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else{
        resolve({stdout, stderr})
      }
    })
  })
}

prompt.ask(async(answer)=>{
  if(answer === false){
    console.log("exiting")
  } else{
    let {stdout} = await sh('npm run prod_sql');
    for (let line of stdout.split('\n')){
      console.log(line)
    }
  }
})