import React from 'react';
import ReactDOM from 'react-dom';
import NoteCard from './notesCard';
//42) now we want users to be able to login and have their own notes 
//in firebase, hit authentication, sign in method, email, enable and save
//now when we add users it'll show up in the authentication section
//on the api reference page, you can find web, password authentication
// we're going to use create user and the sign in
//https://firebase.google.com/docs/auth/web/password-auth?authuser=0

//when we do login and create user we have to go back into our database rules and change read to "auth != null" and write to "auth != null"
//the page will now require you to be signed in to be able to see your notes
//problem is you can create a user but can't login -- continue to step 48)

//20) setting up firebase
const config = {
  apiKey: "AIzaSyBTrOadgu8K2ZEtagP40QDLh4FuiBunBYw",
  authDomain: "video-noted-ebf00.firebaseapp.com",
  databaseURL: "https://video-noted-ebf00.firebaseio.com",
  projectId: "video-noted-ebf00",
  storageBucket: "",
  messagingSenderId: "296180617247"
};

firebase.initializeApp(config);

class App extends React.Component {
    constructor(){
      super();
      // 8) we're going to add a state that's equal to an empty array. within the array will be a bunch of objects which will be the title and text
      //every time we add a new note we're going to grab this current note state, push something to it and set it again
      this.state = {
        notes: []
      } 

      this.showSidebar = this.showSidebar.bind(this);
      this.addNote = this.addNote.bind(this);
      this.showCreate = this.showCreate.bind(this);
      this.createUser = this.createUser.bind(this);
      this.showLogin = this.showLogin.bind(this);
      this.loginUser = this.loginUser.bind(this);
    }

    // 21) when we load the page we want to connect to our firebase database
    //lifecycle hooks: we're going look at componentDidMount
    //when it has been rendered onto the page it'll run

    //database() references the database and .ref references the entire db
    //.on-- when it gets some sort of value and whenever that new data comes in we want something to happen which is res
    
    componentDidMount(){
      firebase.database().ref().on('value', (res) => {
        // console.log(res.val);  
        // we need .val to get to the actual values

        //in userData, we took the data, stored it in a big object with all the keys
        const userData = res.val();
        console.log(userData);
        //dataArray created an empty array to store
        const dataArray = [];
        //24) we're taking that key, setting it as a key, and then push it into our new array
        //we're taking that data and setting that key to it
        //we're taking each entire object, the key within it, and putting the key inside of where the title and text data exists and then pushing those entire objects into our dataArray
        for(let objKey in userData){
          userData[objKey].key = objKey;
          dataArray.push(userData[objKey]);
        }
        // console.log(dataArray);
        //25) how do we set our notes?
        this.setState({
          notes: dataArray
          //when the page loads now we have persistent data
          //to delete a note we have to add a removeNote
        })
      });
    }


    showSidebar(e){
      e.preventDefault();
      //3) now we have a reference to our sidebar 
      //classList allows us to add and remove classes from our elements
      //we're going to add a toggle class of "show"
      this.sidebar.classList.toggle("show");
    }

    // 6) after binding addNote now every time we click Add New Note it'll console.log submitted:
    addNote(e){
      e.preventDefault();
      console.log("Submitted");
      // 10) now if we console.log(this) from our ref below we get data back that includes both the noteText and noteTitle:
      console.log(this);
      // 11) now we build a new note:
      const note = {
        // value is important here. this.noteTitle would be the whole element NOT the value you want. if you open the element, you just want to grab the text in there
        title: this.noteTitle.value,
        text: this.noteText.value
      };
      //12) we need to take the original state and add to it. in React the state should be something you don't mutate and pushing to it 

      //Array.from -- we're making an array from something which is this.state.notes
      //we are copying the notes array and then add our notes 

      //22) we need to change some things slightly. we don't need to do the below: 
      // const newNotes = Array.from(this.state.notes)
      // newNotes.push(note);


      //13) this.setState will re render what's new on the page and re render it to the page
      //we still need to render the data to the page
      
      //22.5) we don't need to set the state either with firebase
      // this.setState({
      //   notes: newNotes
      // });

      //23) we're pushing an object to our firebase database
      //in our firebase we have a unique key that has the 2 values for us
      //now we have to set the state again
      //the biggest issue we have is our notes array wants to be an array but our data is an object-- we need to be able to access the two properties
      //also  to delete the data we need to be albe to reference the keys as well
      const dbRef = firebase.database().ref();
      dbRef.push(note);

      //18) once everything is submitted we want to clear our form and close our sidebar
      this.noteTitle.value = "";
      this.noteText.value = "";
      this.showSidebar(e);
    }

    //26) it will take just a noteId-- that's how we'll remove it from firebase
    //we can then pass this down to our NoteCard
    removeNote(noteKey){
      console.log(noteKey);
      // 29) to remove the note from our database, we have to tell it from what reference-- in this case we tell it to go to the key
      //we're grabbing that location in our database and saying to remove it 
      //now move on to notesCard.js to allow us to edit our cards

      const dbRef = firebase.database().ref(noteKey);
      dbRef.remove();
    }
    // 47) this.showCreate
    // it will toggle the show class on the two things (reference the CSS)
    showCreate(e){
      e.preventDefault();
      this.overlay.classList.toggle("show");
      this.createUserModal.classList.toggle("show");
    }

    //45) setting up the createUser form event
    // on submit we need to check that the passwords match, if so we want to create the user
    createUser(e){
      e.preventDefault();
      const email = this.createEmail.value;
      const password = this.createPassword.value; //we made a ref of this in our input **
      const confirm = this.confirmPassword.value;
      if(password === confirm){

      // 46) now to actually create the user we just use firebase
      //we need to send in both the email and password that we stored in variables above
        firebase.auth()
        //this below returns a promise so we use .then
          .createUserWithEmailAndPassword(email, password)
          //if the then comes back successfully we want to return something/toggle that create menu
          //now it works and if you console.log firebase.auth().currentUser; it'll return you an object full of the users data
          .then((res) => {
            this.showCreate(e);
          })
          //catch will catch if there are any errors
          .catch((err) => {
            alert(err.message)
          })
      // 45)
      }else{
          alert("Passwords must match")
        }
      }

      //50) this will toggle the login modal
      //after all this is written, on submit of the form we want to log the user in--continue to 51
      showLogin(e){
        e.preventDefault();
        this.overlay.classList.toggle("show");
        this.loginModal.classList.toggle("show");
      }

      //51) we want to grab the email and password of the user-- continue on to 52 for allowing us to close the modal boxes
      loginUser(){
        const email = this.userEmail.value;
        const password = this.userPassword.value;

        firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          this.showLogin(e);
        })
        .catch((err) => {
          alert(err.message);
        })
      }

    render() {
      return (
        <div>
          <header className="mainHeader">
            <h1>Noted</h1>
            <nav>

              {/* 43) we need to add a user create account 
              - we want a modal box to pop up*/}

              {/* 46) adding onClick of showCreate */}
              <a href="" onClick={this.showCreate}>Create Account</a>

              {/* 48) adding a new ubtton so we can login
              - if you already have an account we want you to login*/}
              <a href="" onClick={this.showLogin}>Login</a>


              {/* 1) on click here we want something to happen so we're going to add an event listener.
              This callback will get passed the event and then will call the sidebar with that specific e.
              Changed this to the bind way of doing it */}
              <a href="" onClick={this.showSidebar}>Add New Note</a>
            </nav>
          </header>
          {/* 43) modal box */}
          <div className="overlay" ref={ref => this.overlay = ref}></div>

{/* this is where all of our notes will live */}
{/* 14) we're going to put this into another component */}
          <section className="notes">
            {/* note cards */}
            {/* 17) tell our app to render the cards. 
            - our initial state is our notes array
            - to render all our notes we can:
            - map will pass through each individual note and what it will return is <NoteCard and props
            - props are attributes we come up with that we put onto our components or in our case cards
            - map will iterate over, for each note it'll pass that note as a property called note to our note card component
            - we need to add a key as well*/}
            
            {this.state.notes.map((note, i) => {
              return(
                //17) passing down prop of note which is both note.title and note.text in notesCard
                //27) *added this.removeNote* then we can call this inside of our notesCard component
                <NoteCard note={note} key={`note-${i}`} removeNote={this.removeNote} />
              )
              // 19) if we want the newest card to show first add reverse
            }).reverse()} 
          </section>

{/* when we click on add new it'll slide out and let us add our note */}
{/* 2) we're adding a reference to this element. It allows us to be able to store and reference these for later use.
If we console.log(this) in showSidebar we have all the data and the sidebar in there */}
          <aside className="sidebar" ref={ref => this.sidebar = ref}>
          {/* this form is hidden by default. in the CSS it's left -250px */}

          {/* 5) we have a form here and we need to have an on submit on the form that will track it and digest all the info */}
          {/* 7) now we need to grab the text and build up our data into some sort of object */}
            <form onSubmit={this.addNote}>
              <h3>Add New Note</h3>
              {/* 4) toggle close of sidebar */}
              <div className="close-btn" onClick={this.showSidebar}>
                <i className="fa fa-times"></i>
              </div>
          {/* 9) now we need the ability to grab these references and again we'll use ref. ref takes a callback that gets passed a reference which is the element and we can just set it to something. */}
              <label htmlFor="note-title">Title:</label>
              <input type="text" name="note-title" ref={ref => this.noteTitle = ref }/>
              <label htmlFor="note-text">Text:</label>
              <textarea name="note-text" ref={ref => this.noteText = ref}></textarea>
              <input type="submit" value="Add New Note" />
            </form>
          </aside>

          {/* 44) added all of this straight from Ryan's video 
          - we have a div that will be our createUserModal and we have a reference to it and it has a close button
          - we have a form that has email, password and confirm password and then a submit button
          - */}

          {/* 49) this is the login modal 
          - have login modal with a reference to it
          - similar to the other modal*/}
          <div className="loginModal modal" ref={ref => this.loginModal = ref}>
            {/* 52) just added onClick of showLogin-- has a toggle on it so it'll close*/}
            <div className="close" onClick={this.showLogin}>
              <i className="fa fa-times"></i>
            </div>
            <form action="" onSubmit={this.loginUser}>
              <div>
                <label htmlFor="email">Email:</label>
                <input type="text" name="email" ref={ref => this.userEmail = ref}/>
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" ref={ref => this.userPassword = ref} />
              </div>
              <div>
                <input type="submit" value="Login"/>
              </div>
            </form>
          </div>



          <div className="createUserModal modal" ref={ref => this.createUserModal = ref}>
          {/* 52) just added onClick of showCreate-- has a toggle on it so it'll close */}
            <div className="close" onClick={this.showCreate}>
              <i className="fa fa-times"></i>
            </div>
            <form action="" onSubmit={this.createUser}>
              <div>
                <label htmlFor="createEmail">Email:</label>
                <input type="text" name="createEmail" ref={ref => this.createEmail = ref}/>
              </div>
              <div>
                <label htmlFor="createPassword">Password:</label>
                <input type="password" name="createPassword" ref={ref => this.createPassword = ref} />
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input type="password" name="confirmPassword" ref={ref => this.confirmPassword = ref} />
              </div>
              <div>
                <input type="submit" value="Create"/>
              </div>
            </form>
          </div>
        </div>
      )
    }
}


ReactDOM.render(<App />, document.getElementById('app'));
