import React from 'react';
import ReactDOM from 'react-dom';
import NoteCard from './notesCard';

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

      const newNotes = Array.from(this.state.notes)
      newNotes.push(note);
      //13) this.setState will re render what's new on the page and re render it to the page
      //we still need to render the data to the page 
      this.setState({
        notes: newNotes
      });
      //18) once everything is submitted we want to clear our form and close our sidebar
      this.noteTitle.value = "";
      this.noteText.value = "";
      this.showSidebar(e);
    }

    render() {
      return (
        <div>
          <header className="mainHeader">
            <h1>Noted</h1>
            <nav>
              {/* 1) on click here we want something to happen so we're going to add an event listener.
              This callback will get passed the event and then will call the sidebar with that specific e.
              Changed this to the bind way of doing it */}
              <a href="" onClick={this.showSidebar}>Add New Note</a>
            </nav>
          </header>

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
                // passing down prop of note which is both note.title and note.text in notesCard
                <NoteCard note={note} key={`note-${i}`} />
              )
            })} 
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
        </div>
      )
    }
}


ReactDOM.render(<App />, document.getElementById('app'));
