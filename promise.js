var a = new Promise(
  function(resolve, reject) {
    console.log("Create Promise");

    setTimeout(
      () => {
        resolve({ p1: "kaden1"})
      },
      500
    );
  }
)

var p2 = new Promise(
  function(resolve, reject) {
    console.log("Create Promise");

    setTimeout(
      () => {
        resolve({ p2: "kaden2"})
      },
      500
    );
  }
)

// a.then(result => {
//   console.log("p1 = " + result.p1);
//   return p2;
// }).then(result => {
//   console.log("p2 = " + result.p2)
// })

// Promise.all([a, p2]).then(result => {
//   console.log(result);
//   console.log("p1 = " + result[0].p1);
//   console.log("p2 = " + result[1].p2);
// })


async function runAsyncFunctions () {
  const a1 = await a();
  console.log(a1);
  const a2 = await p2();
  console.log(a2);
}