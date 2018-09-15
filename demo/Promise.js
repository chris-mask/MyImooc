let checkLogin = function () {
  return new Promise(function (resolve, reject) {
    let flag = document.cookie.indexOf("userId") > -1 ? true : false;
    if (flag = true) {
      resolve({
        status: 0,
        result: true
      })
    } else {
      reject("error");
    }
  })
};

let getUsetInfo = () => {
  return new Promise((resolve, reject) => {
    let UserInfo = {
      userId: "123"
    };
    resolve(UserInfo);
  })
};

checkLogin().then((res) => {
  if (res.status == 0) {
    console.log("login success");
    return getUsetInfo()
  }
}).catch((error) => {
  console.log(`error:${error}`)
}).then((res2) => {
  console.log(`userId:${res2.userId}`)
});

Promise.all([checkLogin(), getUsetInfo()]).then(([res1, res2]) => {
  console.log(`result1:${res1.result},result2:${res2.userId}`)
})
