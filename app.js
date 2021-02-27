
let signIn = (calback, callback) => {


  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function (result) {
    var user = result.user;
    // console.log(provider)

    //  document.getElementById("firstPage-main-div").style.display = "none"

    // document.getElementById("user-pic").src = user.photoURL 
    // document.getElementById("user-name").innerHTML =user.displayName

    getDataFromSignINFunc(user)
    // showData(user)
  }).catch(function (error) {
    console.log(error.message)
  });

}

// var currentUserKey =""

// console.log(currentUserKey)
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in
    var email = user.email;
    // console.log(firebase.auth().currentUser.photoURL)
    document.getElementById("parent-chat").style.display = "block"
    document.getElementById("user-pic").src = firebase.auth().currentUser.photoURL
    document.getElementById("user-name").innerHTML = firebase.auth().currentUser.displayName
    document.getElementById("firstPage-main-div").style.display = "none"
    // currentUserKey = user.uid
    // console.log(firebase.auth().currentUser.uid)
    showData(user)
    // showInChatBox(currentUserKey)
    // ...
  } else {
    // User is not signed in
    // ...
    console.log("not")
    document.getElementById("firstPage-main-div").style.display = "block"
    document.getElementById("parent-chat").style.display = "none"
  }
});


var signout = () => {
  firebase.auth().signOut().then(function () {
    document.getElementById("parent-chat").style.display = "none"
    // document.getElementById("firstPage-main-div").style.display = "block"
  }).catch(function (error) {

  });
}



let getDataFromSignINFunc = (data) => {

  // let key = firebase.database().ref("users").push().key

  let obj = {
    name: data.displayName,
    photo: data.photoURL,
    id: data.uid
  }

  firebase.database().ref("users/" + data.uid).set(obj)





}
currentUsers = ""

// console.log(firebase.auth().currentUser.uid)
let frndList = document.getElementById("list")
let showData = (newData) => {
  //  let userId = newData.uid
  //  console.log(newData.photoURL)

  firebase.database().ref("users").on("child_added", (data) => {
    // console.log(data.val().photo)
    let userId = newData.uid
    // showInChatBox(newData)
    let usersInfo = data.val()
    if (usersInfo.id !== userId) {
      currentUsers += userId


      // showInChatBox(newData)

      let crtFrndList = document.createElement("li")
      crtFrndList.setAttribute("class", "list-li")
      crtFrndList.setAttribute("onclick", `showInChatBox('${data.key}','${usersInfo.name}','${data.val().photo}')`)
      let crtImgTag = document.createElement("img")
      crtImgTag.setAttribute("class", "frnds-pic")
      crtImgTag.setAttribute("src", `${usersInfo.photo}`)
      let crtParaForName = document.createElement("p")
      let crtTextUser = document.createTextNode(usersInfo.name)
      crtParaForName.setAttribute("class", "frnds-name")

      crtParaForName.appendChild(crtTextUser)
      crtFrndList.appendChild(crtImgTag)
      crtFrndList.appendChild(crtParaForName)
      frndList.appendChild(crtFrndList)
    }

  })

}
showData()

let chatBoxPic = document.getElementById("chat-box-pic")
let ChatBoxName = document.getElementById("chat-box-name")
let chatMsgHeader = document.getElementById("chat-msg-header")


var geetkey = ""
// console.log(geetkey)

let showInChatBox = (key, name, photos) => {
  var sclc = currentUsers.slice(0, 28)

  let MkFrndList = {
    userIds: sclc,
    id: key

  }
  var booll = false;

  firebase.database().ref("friendss/").on("value", data => {
    var dat = data.val()

    //  if(dat){
    //    for(const key in dat){
    //    }
    //  }

    data.forEach(chkData => {
      // console.log(chkData.val())
      let frnds = chkData.val()

      if ((frnds.id == MkFrndList.id && frnds.userIds == MkFrndList.userIds) || (MkFrndList.userIds == frnds.userIds && MkFrndList.id == frnds.id)) {
        booll = true;
        console.log("true")
        geetkey = chkData.key
        // console.log(geetkey)
      }
    });
    if (booll === false) {
      firebase.database().ref("friendss").push(MkFrndList)
    }
    else{
      // console.log("erroe")
    }
    ChatBoxName.innerHTML = name;
    chatBoxPic.src = photos;
    conversation.innerHTML = "";


    chatMessage(geetkey)
  })



}

let chatMessage = ()=>{
  firebase.database().ref("chating").child(geetkey).on("value", data => {
    data.forEach(getMsg=>{
      let crtLi = document.createElement("li")
      let crtpara = document.createElement("p")
      let crtTxt = document.createTextNode(getMsg.val().msg)
    
      crtpara.setAttribute("class", "talking-para")
    
      crtpara.appendChild(crtTxt)
      crtLi.appendChild(crtpara)
    
      talkingList.appendChild(crtLi)

      conversation.appendChild(talkingList)
    })
      // var getMsg = data.val()
      // console.log(getMsg.msg)
      // let crtLi = document.createElement("li")
      // let crtpara = document.createElement("p")
      // let crtTxt = document.createTextNode(getMsg.msg)
      // crtpara.setAttribute("class", "talking-para")
      // crtpara.appendChild(crtTxt)
      // crtLi.appendChild(crtpara)
      // talkingList.appendChild(crtLi)
      // conversation.appendChild(talkingList)
    })
}


let writeMsg = document.getElementById("write-msg")
let talkingList = document.getElementById("talking-list")
let conversation = document.getElementById("conversation")


let text = () => {
  let messages = { msg: writeMsg.value }
  firebase.database().ref("chating").child(geetkey).push(messages)

}
