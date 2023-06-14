let nav =0; //to keep track of the month
let clicked = null; //the day on which we clicked
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];  //to store string bcz we cant store objects
const calendar = document.getElementById('calendar');
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday']
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop')
const eventTitleInput = document.getElementById('eventTitleInput')

function openModal(date){
     clicked = date;
     const eventforDay = events.find(e=>e.date === clicked);
     if(eventforDay){
        document.getElementById('eventText').innerText = eventforDay.title;
        deleteEventModal.style.display = 'block';
     }
     else{
        newEventModal.style.display = 'block';
     }
     backDrop.style.display='block';
}

function load(){
    const dt = new Date();
    if(nav!==0){
        dt.setMonth(new Date().getMonth()+nav);
    }
    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();
   
    const firstDayOfMonth = new Date(year, month, 1); //current first day of the month
    const daysInMonth = new Date(year, month+1, 0).getDate(); //to render number of squares 
    const daysInPreviousMonth = new Date(year, month, 0).getDate(); //previous month total number of days
    const dateString = firstDayOfMonth.toLocaleDateString('en-in',{
        weekday:'long',
        year:'numeric',
        month:'numeric',
        day:'numeric'
    }) 
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0])
    let startDay = daysInPreviousMonth - paddingDays + 1;
   
    document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('en-in',{
        month:'long'
    })} ${year}`
    calendar.innerHTML='';
    

    for(let i=1;i<=paddingDays+daysInMonth; i++){
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');
        const dayString = `${i-paddingDays}/${month+1}/${year}`
        
        if(i>paddingDays){
            daySquare.innerText = i-paddingDays;
            daySquare.addEventListener('click', ()=>openModal(dayString))
            const eventforDay = events.find(e=>e.date === dayString);
            if(i-paddingDays === day && nav===0){
                daySquare.id = 'currentDay';
            }
            if(eventforDay){
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText= eventforDay.title;
                daySquare.appendChild(eventDiv)
            }

        }else{
            daySquare.classList.add('padding')  
            daySquare.innerText=startDay;
            startDay++;
           
        }
        calendar.appendChild(daySquare)
    }

    
}

function closeModal(){
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display='none';
    eventTitleInput.value = '';
    clicked=null;
    load();
}
function saveEvent(){
    if(eventTitleInput.value){
        eventTitleInput.classList.remove('error');
        events.push({
            date:clicked,
            title:eventTitleInput.value,
        })
        localStorage.setItem('events', JSON.stringify(events))
        closeModal();
    }else{
        eventTitleInput.classList.add('error');
    }
    
}
function deleteEvent(){
    events = events.filter(e=>e.date !== clicked);
    localStorage.setItem('events',JSON.stringify(events));
    closeModal();
}
function initButtons(){
    document.getElementById('nextButton').addEventListener('click',()=>{
        nav++;
        load();
    })
    document.getElementById('backButton').addEventListener('click',()=>{
        nav--;
        load();
    })
    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal)
    document.getElementById('deleteButton').addEventListener('click', deleteEvent)
    document.getElementById('closeButton').addEventListener('click', closeModal)
}

initButtons();
load();